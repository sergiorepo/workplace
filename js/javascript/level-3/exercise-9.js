/*Your challenge
Given this code:



Write a statement that creates a new array called pricesWithTax, applying the addTax function to every element.

    Requirements:
- Use .map().
- Pass the existing addTax function as a callback.
- Do not create another arrow function.
- Do not call addTax() yourself.
    Expected results:*/


const prices = [50, 100, 150, 200];

const addTax = price => price * 1.2;

const pricesWithTax = prices.map(addTax);
console.log(pricesWithTax);
// [60, 120, 180, 240]

