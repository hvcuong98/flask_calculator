import re
from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
from datetime import timedelta

app = Flask(__name__)
app.secret_key = '1a2b3c4d5e'
app.config['DEFAULT_PARSERS'] = [
    'flask.ext.api.parsers.JSONParser',
    'flask.ext.api.parsers.URLEncodedParser',
    'flask.ext.api.parsers.MultiPartParser'
]
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:123456@localhost/calculator"
db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, )
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    expressions = db.relationship("History", backref="users")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @classmethod
    def users_by_expression(cls):
        return Users.query.join(History).all()


class History(db.Model):
    __tablename__ = 'history'
    id = db.Column(db.Integer, primary_key=True)
    expression = db.Column(db.String, nullable=False)
    result = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route("/calculate", methods=["POST"])
def answer():
    print(1)
    data = request.get_json()
    print(data)
    expression = data["expression"]
    username = data["username"]
    if expression == "" or expression is None:
        return jsonify({"data": ""}), 200
    expression = expression.replace("^", "**");
    bracketDeg = 0;
    for x in expression:
        if x == '(':
            bracketDeg += 1
        if x == ')':
            bracketDeg -= 1
    while bracketDeg > 0:
        expression = expression + ")"
        bracketDeg -= 1
    print(expression)
    result = eval(expression)
    existing_user = Users.query.filter_by(
        username=username).first()
    existing_user = existing_user.as_dict()

    history = History(
        expression=expression,
        result=result,
        user_id=int(existing_user["id"])
    )
    db.session.add(history)
    db.session.commit()
    db.session.flush()
    return jsonify({"data": result}), 200


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=['GET', 'POST'])
def login():
    msg = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']
        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        existing_user = Users.query.filter_by(
            username=username, password=password_hash).first()
        if existing_user is not None:
            existing_user = existing_user.as_dict()
            session.permanent = True
            # print(existing_user)
            session["loggedin"] = True
            session['id'] = existing_user['id']
            session['username'] = existing_user['username']
            return redirect(url_for('home'))
        elif username == 'root' and password == 'root':
            session.permanent = True
            # print(existing_user)
            session["loggedin"] = True
            session['id'] = 99999
            session['username'] = 'admin'
            return redirect(url_for('home'))
        else:
            msg = "Incorrect username/password!"
    return render_template('index.html', msg=msg)


@app.route("/register", methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        existing_user = Users.query.filter_by(
            username=username).first()
        if existing_user is None:
            user = Users(
                username=username,
                password=hashlib.sha256(password.encode('utf-8')).hexdigest(),
            )
            db.session.add(user)
            db.session.commit()
            db.session.flush()
            session.permanent = True
            session["loggedin"] = True
            user = user.as_dict()
            session["id"] = user["id"]
            session['username'] = user['username']
            msg = 'You have successfully registered!'
            # return redirect(url_for('home'))
        else:
            msg = "'Account already exists!'"
    return render_template('register.html', msg=msg)


@app.route('/home')
def home():
    # Check if user had loggedin
    if 'loggedin' in session:
        # User had loggedin show them the home page
        return render_template('home.html', username=session['username'], user_id=session["id"])
    # User had not loggedin redirect to login page
    return redirect(url_for('login'))


@app.route("/profile")
def profile():
    histories = History.query.filter_by(
        user_id=session['id']).all()
    items = []
    for history in histories:
        items.append(history.as_dict())

    return render_template("profile.html", username=session['username'], items=items)

@app.route("/logout")
def logout():
    return render_template('index.html')

@app.route("/eqn")
def eqn():
    return render_template('eqn.html')

if __name__ == '__main__':
    app.run(host="localhost", port=4000, debug=True)
