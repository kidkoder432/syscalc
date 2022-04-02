// noinspection JSUnresolvedFunction

'use strict';

function round(n, places) {
    return Math.round(n * 10 ** places) / 10 ** places;
}

function gcd(a, b) {
    let sa = Math.sign(a);
    Math.sign(b);
    a = Math.abs(a);
    b = Math.abs(b);
    if (0 === a) {
        return b;
    }
    
    while (b !== 0) {
        if (a > b) a -= b; else b -= a;
        console.log(a, b)
    }
    
    return a * sa;
    
}

function addFractions(a, b, c, d, render = true) {
    let newDenom;
    
    newDenom = lcm(b, d);
    a *= (newDenom / b);
    c *= (newDenom / d);
    
    if (render) {
        return simplify(a + c, newDenom)
    } else {
        return [a + c, newDenom]
    }
}

function lcm(a, b) {
    return a * b / gcd(a, b)
}

function simplify(a, b) {
    let sa = Math.sign(a);
    let sb = Math.sign(b);
    a = Math.abs(a);
    b = Math.abs(b);
    let ag = a / gcd(a, b);
    let bg = b / gcd(a, b);
    
    if (ag === bg) {
        return `${ag * sa / bg * sb}`
    }
    
    if (sa === sb) {
        sa = 1;
        sb = 1
    }
    
    if (bg === 1) {
        return `${ag * sa * sb}`;
    }
    
    return String.raw`\tfrac{${ag * sa}}{${bg * sb}}`;
}

function cancel(cfa, cfb, ra, rb) {
    return String.raw`x &= ${simplify(cfb * ra, cfa * rb)}`;
}

window.onload = function () {
    for (let elem of document.getElementsByTagName('input')) {
        
        elem.onkeydown = () => {
            elem.style.width = (elem.value.length + 1) + 'ch';
        }
    }
};

function calc() {
    
    let a1 = Number(document.getElementById('a1').value);
    let b1 = Number(document.getElementById('b1').value);
    let a2 = Number(document.getElementById('a2').value);
    let b2 = Number(document.getElementById('b2').value);
    let c1 = Number(document.getElementById('c1').value);
    let c2 = Number(document.getElementById('c2').value);
    let sol;
    
    calculator.setExpression({'id': 'graph1', 'latex': `${a1}x + ${b1}y = ${c1}`});
    calculator.setExpression({'id': 'graph2', 'latex': `${a2}x + ${b2}y = ${c2}`});
    if (isNaN(a1)) {
        a1 = -1
    }
    if (isNaN(b1)) {
        b1 = -1
    }
    if (isNaN(a2)) {
        a2 = -1
    }
    if (isNaN(b2)) {
        b2 = -1
    }
    
    if (a1 === 0 || b1 === 0 || a2 === 0 || b2 === 0) {
        alert("The coefficients of x and y can't be 0. Did you mean to put 1 instead?");
        return;
    }
    
    
    // Convert to slope-intercept
    let m1 = -a1 / b1;
    let m2 = -a2 / b2;
    
    let i1 = c1 / b1;
    let i2 = c2 / b2;
    
    if (m1 === m2) {
        if (i1 === i2) {
            sol = "Infinite Solutions"
            
        } else {
            sol = "No Solution"
        }
        document.getElementById('answer').innerHTML = sol;
        
        return;
    }
    
    let solX = round(-(i2 - i1) / (m2 - m1), 3);
    let solY = round(m1 * solX + i1, 3);
    
    sol = `Answer: (${solX}, ${solY})`;
    document.getElementById('answer').innerHTML = sol;
    
    
    calculator.setExpression({'id': 'graph3', 'latex': `(${solX}, ${solY})`});
    
    let slp1Latex = simplify(-a1, b1);
    let slp2Latex = simplify(-a2, b2);
    let int1Latex = simplify(c1, b1);
    let int2Latex = simplify(c2, b2);
    
    document.getElementById('convtoslformsol').innerText = String.raw`
            $\begin{aligned}
            ${a1}x + ${b1}y &= ${c1}\\
            ${b1}y &= -${a1}x + ${c1}\\
            y &= ${slp1Latex}x + ${int1Latex}\\
            \end{aligned}$
            
            $\begin{aligned}
            ${a2}x + ${b2}y &= ${c2}\\
            ${b2}y &= -${a2}x + ${c2}\\
            y &= ${slp2Latex}x + ${int2Latex}\\
            \end{aligned}
            $
         `;
    
    let [cfa, cfb] = addFractions(-a1, b1, a2, b2, false);
    let [ra, rb] = addFractions(-c1, b1, c2, b2, false);
    
    document.getElementById('solsubs').innerText = String.raw`
            $\begin{aligned}
            y &= ${slp1Latex}x + ${int1Latex}\\
            y &= ${slp2Latex}x + ${int2Latex}\\\\
            
            ${slp1Latex}x + ${int1Latex} &= ${slp2Latex}x + ${int2Latex}\\
            ${int1Latex} &= -${addFractions(-a1, b1, a2, b2)}x + ${int2Latex}\\
            0 &= -${addFractions(-a1, b1, a2, b2)}x + ${addFractions(-c1, b1, c2, b2)}\\
            ${addFractions(-a1, b1, a2, b2)}x &= ${addFractions(-c1, b1, c2, b2)}\\
            ${cancel(cfa, cfb, ra, rb)}\\
            y &= ${slp1Latex}(${simplify(cfb * ra, cfa * rb)}) + ${int1Latex}\\
              &= ${addFractions(cfb * ra * -a1, cfa * rb * b1, c1, b1)}\\
            \end{aligned}
            $
            \[{\LARGE(${simplify(cfb * ra, cfa * rb)}, ${addFractions(cfb * ra * -a1, cfa * rb * b1, c1, b1)})}\]
            
            
         `;
    
    
    document.getElementById('solelim').innerText = String.raw`
            $\begin{aligned}
            y &= ${slp1Latex}x + ${int1Latex}\\
            y &= ${slp2Latex}x + ${int2Latex}\\\\
            
            0 &= ${addFractions(-a1, b1, a2, b2)}x + ${addFractions(c1, b1, -c2, b2)}\\
            -${addFractions(-a1, b1, a2, b2)}x &= ${addFractions(c1, b1, -c2, b2)}\\
            ${cancel(cfa, cfb, ra, rb)}\\
            y &= ${slp1Latex}(${simplify(cfb * ra, -cfa * rb)}) + ${int1Latex}\\
              &= ${addFractions(cfb * ra * -a1, cfa * rb * b1, c1, b1)}\\
            \end{aligned}
            $
            \[{\LARGE(${simplify(cfb * ra, cfa * rb)}, ${addFractions(cfb * ra * -a1, cfa * rb * b1, c1, b1)})}\]
            
         `;
    MathJax.typeset()
}

