var bracketDeg = 0;
var lastAns = 0;

function lastDigitIndex() {
    var elem = document.getElementById("display").value;
    for(var i = elem.length - 1; i >= 0; i--)
        if (elem[i] == '+' || (elem[i] == '-' && i != 0) || elem[i] == '*' || elem[i] == '/' || elem[i] == '^'
            || elem[i] == '(' || elem[i] == ')') return i + 1;
    return 0;
}

function lastNum() {
    var elem = document.getElementById("display").value;
    return parseFloat(elem.substring(lastDigitIndex(), elem.length));
}

function lastOp() {
    var elem = document.getElementById("display").value;
    for(var i = elem.length - 1; i >= 0; i--)
        if (elem[i] == '+' || elem[i] == '-' || elem[i] == '*' || elem[i] == '/' || elem[i] == '.' || elem[i] == '^'
            || elem[i] == '(' || elem[i] == ')')
            return elem[i];
    return 0;
}

function remain() {
    var elem = document.getElementById("display").value;
    return elem.substring(0, lastDigitIndex());
}

function isDigit(x) {
    return (x >= '0' && x <= '9')
}


function set(op) {
    elem = document.getElementById("display").value;
    len = elem.length;
    if (op == '3.142' || op == '2.718')
    {
        if ((lastOp() != '.' && isDigit(elem[len - 1])) || (len == 0)) document.getElementById("display").value += op;
        return;
    }
    if (op == '.')
    {
        if (lastOp() != '.' && isDigit(elem[len - 1])) document.getElementById("display").value += op;
        return;
    }
    if (isDigit(op))
    {
        document.getElementById("display").value += op;
        return;
    }
    if (op == '+' || op == '-')
    {
        if (elem[len - 1] != '.') document.getElementById("display").value += op;
        return;
    }
    if (op == '(')
    {
        if (elem[len - 1] == '+' || elem[len - 1] == '-' || elem[len - 1] == '*' || elem[len - 1] == '/' || elem[len - 1] == '^'
            || elem[len - 1] == '(' || len == 0)
        {
            document.getElementById("display").value += op;
            bracketDeg++;
        }
        return;
    }
    if (op == ')')
    {
        if (bracketDeg == 0) return;
        if (isDigit(elem[len - 1]) || elem[len - 1] == ')')
        {
            document.getElementById("display").value += op;
            bracketDeg--;
        }
        return;
    }
    if (isDigit(elem[len - 1]) || elem[len - 1] == ')') document.getElementById("display").value += op;
}


function sqrRoot() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.sqrt(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.sqrt(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.sqrt(lastNum())).toFixed(3);
}

function asine() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.asin(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.asin(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.asin(lastNum())).toFixed(3);
}

function acosine() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.acos(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.acos(lastNum())); else
  document.getElementById("display").value = remain() + eval(Math.acos(lastNum())).toFixed(3);
}

function fLn() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.log(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.log(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.log(lastNum())).toFixed(3);
}

function fLog() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.log10(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.log10(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.log10(lastNum())).toFixed(3);
}

function atangent() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.atan(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.atan(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.atan(lastNum())).toFixed(3);
}

function tangent() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.tan(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.tan(lastNum())); else
    document.getElementById("display").value = remain() + eval(Math.tan(lastNum())).toFixed(3);
}

function cosine() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.cos(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.cos(lastNum())); else
  document.getElementById("display").value = remain() + eval(Math.cos(lastNum())).toFixed(3);
}

function sine() {
  var tempStore = document.getElementById("display").value;
  if (eval(Math.sin(lastNum())) % 1 == 0)
    document.getElementById("display").value = remain() + eval(Math.sin(lastNum())); else
  document.getElementById("display").value = remain() + eval(Math.sin(lastNum())).toFixed(3);
}


function fact() {
    var elem = document.getElementById("display").value;
    var num = lastNum();
    if (num % 1 != 0) return;
    var res = 1;
    for(var i = 2; i <= num; i++)
        res *= i;
  //  document.getElementById("display").value = lastDigit;
    document.getElementById("display").value = remain() + res.toString();
}

function setOp() {
  alert("gf");
  //document.getElementById("display").value += op;
}

async function answer() {
  var Exp = document.getElementById("display");
  var username = document.getElementById("username").value;
  var Exp1 = Exp.value;
  const response = await fetch("http://localhost:4000/calculate", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      expression: Exp1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const myJson = await response.json();
  var result = myJson.data;
  //alert(result);
  Exp.value = result;
  lastAns = result;
}

function eqn() {
    location.href = "/eqn";
}

function ans() {
    document.getElementById("display").value += lastAns;
}


function ce() {
  var elem = document.getElementById("display").value;
  var length = elem.length;
  if (elem[length - 1] == '(') bracketDeg--;
  if (elem[length - 1] == ')') bracketDeg++;
  length--;
  var a = elem.substring(0, length);
  document.getElementById("display").value = a;
}

function c() {
   document.getElementById("display").value = "";
   bracketDeg = 0;
}

function solveEqn() {
    var eqn = document.getElementById("eqnInput").value;
    var res = nerdamer.solve(eqn, 'x');
    document.getElementById("eqnAns").value = "Result: " + res;
}
