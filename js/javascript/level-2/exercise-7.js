/*
* Level 2 — Exercise 7: Conditional object returns
* Let's increase the difficulty by combining three concepts you've already practiced:
*     1. Arrow functions with implicit returns.
* 2. Ternary operators.
* 3. Returning object literals.
*     Your challenge
* Convert this traditional function into an arrow function:
*
* function getProductStatus(stock) {
*
*      if (stock > 0) {
*         return {
*             available: true,
*             message: "In stock"
*         };
*     } else {
*         return {
*             available: false,
*             message: "Out of stock"
*         };
*     }
* }
*
*
* Requirements:
* - Declare the function with const and name it getProductStatus.
* - Accept one parameter: stock.
* - Use an implicit return.
* - Use a ternary operator instead of if/else.
* - Return an object literal in both cases.
* - Do not use a block body {} or an explicit return.
* Hint: Each branch of the ternary operator can return an object wrapped in parentheses:
*
* condition
*    ? ({ property: value1 })
*    : ({ property: value2 })
*
* */



const getProductStatus = stock => stock > 0? ({ available: true, message: "In stock" }): ({available: false, message: "Out of stock"})

/*
* One interesting detail: you don't actually need parentheses around the objects inside a ternary expression.
*
* You could write:
*    const getProductStatus = stock =>
*        stock > 0
*            ? { available: true, message: "In stock" }
*            : { available: false, message: "Out of stock" };
*/

/*
* Test your solution:
*/
console.log(getProductStatus(10));
// { available: true, message: 'In stock' }

console.log(getProductStatus(0));
// { available: false, message: 'Out of stock' }


