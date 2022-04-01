
'use strict';

function calc() {

    let b1 = Number(document.getElementById('b1').innerHTML);
    let a1 = Number(document.getElementById('a1').innerHTML);
    let a2 = Number(document.getElementById('a2').innerHTML);
    let b2 = Number(document.getElementById('b2').innerHTML);
    let c1 = Number(document.getElementById('c1').innerHTML);
    let c2 = Number(document.getElementById('c2').innerHTML);
    let sol = '';
    // Convert to slope-intercept
    let m1 = -a1 / b1;
    let m2 = -a2 / b2;
    let i1 = c1;
    let i2 = c2;

    if (m1 === m2) {
        if (i1 === i2){
            sol = "Infinite Solutions";
        }
        else {
            sol = "No Solution";
        }
        return;
    }

    let solX = (i1 - i2) / (m1 - m2);
    let solY = m1 * solX + i1;
    if (! (solY === m2 * solX + i2)) {
        throw Error("Invalid solution!")
    }
}

