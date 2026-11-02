/*
* Your challenge
* Convert this traditional function into an arrow function:

function getShippingCost(total) {
    if (total >= 100) {
        return 0;
    } else {
        return 15;
    }
}
*/
/*
* Requirements:
* - Use const and name it getShippingCost.
* - Accept one parameter: total.
* - Omit parentheses around the parameter.
* - Use a ternary operator.
* - Use an implicit return.
* - Don't use if, else, braces, or an explicit return.
*/
const getShippingCost = total => total >= 100 ? 0 : 15;


console.log(getShippingCost(150)); // 0
console.log(getShippingCost(100)); // 0
console.log(getShippingCost(50));  // 15
console.log(getShippingCost(0));   // 15

