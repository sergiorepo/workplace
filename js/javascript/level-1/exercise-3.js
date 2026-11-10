/*
* Convert this traditional function into an arrow function:
*
* function getCurrentYear() {
*   return new Date().getFullYear();
* }
*
* Requirements:
*     - Declare it with const.
* - Name it getCurrentYear.
* - Use the correct syntax for zero parameters.
* - Use an implicit return.
*/

const getCurrentYear = () => new Date().getFullYear();


console.log(getCurrentYear()); // 2026