/*
* Level 3 — Exercise 8: Arrow functions as callbacks
*
* Now we're moving into one of the most useful applications of arrow functions.
*
* In JavaScript, functions can be passed as arguments to other functions. These are commonly called callback functions.
* Here, .map() calls the provided function once for each element of the array and creates a new array from the returned
* values.
*
*/
const numbers = [1, 2, 3, 4];

const doubled = numbers.map(function(number) {
    return number * 2;
});

console.log(doubled); // [2, 4, 6, 8]
