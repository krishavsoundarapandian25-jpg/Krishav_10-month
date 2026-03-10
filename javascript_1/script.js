// ── Search / Landing Page ──────────────────────────────────────────────────

let searchCount = 0; // integer — tracks how many times user has searched

function checkGame() {
    let gameName = document.getElementById("gameInput").value; // string

    searchCount = searchCount + 1; // math operation
    console.log("Search count: " + searchCount);

    // Logical OR operator — accepts "fortnite" or "fn" as valid inputs
    if (gameName.toLowerCase() === "fortnite" || gameName.toLowerCase() === "fn") {
        console.log("Fortnite found!");
        document.getElementById("fortniteLink").style.display = "block";
    } else {
        console.log("Game not found");
        document.getElementById("fortniteLink").style.display = "none";
    }
}


// ── Calculator ─────────────────────────────────────────────────────────────

function getValues() {
    var a = parseInt(document.getElementById('a').value);
    var b = parseInt(document.getElementById('b').value);
    return { a: a, b: b };
}

function calc(op) {
    var vals = getValues();
    var a = vals.a;
    var b = vals.b;
    var result;

    if (isNaN(a) || isNaN(b)) {
        result = "Please enter values for A and B";
    } else if (op === '+')  { result = a + b; }
    else if (op === '-')    { result = a - b; }
    else if (op === '*')    { result = a * b; }
    else if (op === '/')    { result = b !== 0 ? a / b : "Can't divide by zero"; }
    else if (op === 'and')  { result = a & b; }  // Bitwise AND
    else if (op === 'or')   { result = a | b; }  // Bitwise OR

    document.getElementById('result').textContent = result;
    console.log("Result: " + result);
}

function calcNot() {
    var vals = getValues();
    var a = vals.a;
    var result;

    if (isNaN(a)) {
        result = "Please enter a value for A";
    } else {
        result = !a; // Logical NOT operator
    }

    document.getElementById('result').textContent = result;
    console.log("Result: " + result);
}