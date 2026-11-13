/*
* 7. Exercise: Definition versus execution
* Let's check whether the distinction between where a function is defined and where it executes is clear.
*/

let x = 100;

function createFunction() {
    let x = 200;

    return () => {
        console.log(x);
    };
}

function executeFunction(fn) {
    let x = 300;
    fn();
}

const myFunction = createFunction();

executeFunction(myFunction);


