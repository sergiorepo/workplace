/*
* Your challenge
*
* Rewrite this code using an arrow function:
*
*
* const discountedPrices = prices.map(function(price) {
*     return price * 0.9;
* });
* Requirements:
* - Replace the traditional anonymous function with an arrow function.
* - Use an implicit return.
* - Omit the parentheses around the single parameter.
* - Don't declare a separate function; pass the arrow function directly to .map().
*
*/

const prices = [100, 200, 300, 400];

const discountedPrices = prices.map(price => price * 0.9);

console.log(discountedPrices);

// Expected output:
// [90, 180, 270, 360]
