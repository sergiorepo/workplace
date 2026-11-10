
/*
* Your challenge
*
* Convert this traditional function into an arrow function:
* function greet(name) {
*    return "Hello, " + name + "!";
* }
*
*
* Requirements:
*    - Name the function greet.
* - Use const.
* - Omit the parentheses around the single parameter.
* - Use an implicit return.
* - Bonus: Use a template literal (${...}) instead of string concatenation.
*/

const greet = x => `Hello, ${x}!`;


console.log(greet("Alice")); // Hello, Alice!
console.log(greet("Bob"));   // Hello, Bob!