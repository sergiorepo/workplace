/*
* Your challenge
*
* Convert this traditional function into an arrow function:
*
* function calculateDiscount(price, discountPercent) {
*  const discount = price * discountPercent / 100;
*  const finalPrice = price - discount;
*  return finalPrice;
* }
*
*
* Requirements:
* - Use const and name the function calculateDiscount.
* - Accept two parameters.
* - Use curly braces {} for the function body.
* - Keep the two intermediate variables.
* - Use an explicit return.
*/


const calculateDiscount = (price, discountPercent) =>
{
    const discount = price * discountPercent / 100;
    const finalPrice = price - discount;
    return finalPrice;
}


console.log(calculateDiscount(100, 20)); // 80
console.log(calculateDiscount(200, 10)); // 180
console.log(calculateDiscount(50, 50));  // 25