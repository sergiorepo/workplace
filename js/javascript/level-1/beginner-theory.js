/*
*
* Key concepts:
* - => is the arrow function operator.
* - (a, b) contains the parameters.
* - { return a + b; } is the function body with an explicit return.
* - Without {}, a single expression is returned automatically. This is called an implicit return.
* - Arrow functions are expressions, so we can assign them to variables.
*
*/

function add(a, b) {
    return a + b;
}

const add = (a, b) => {
    return a + b;
};

const add = (a, b) => a + b;
