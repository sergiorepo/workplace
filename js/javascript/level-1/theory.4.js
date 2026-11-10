/*
* Level 1 — Exercise 4: Multiple statements and explicit return
* So far, we've used arrow functions with a single expression.
*
* However, when we need multiple statements, we use curly braces {}.
*
* Important: Once you use curly braces to define a function body, you must explicitly use return if you want to
* return a value.
*
* */

const calculateTotal = (price, tax) => {
  const taxAmount = price * tax;
  const total = price + taxAmount;
  return total;
};



