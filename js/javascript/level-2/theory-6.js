/*
* Level 2 — Exercise 6: Conditional expressions
* Now we'll introduce the ternary operator, which allows you to express a simple condition in a single expression.
*
* Traditional if/else:
*/
function checkAge(age) {
  if (age >= 18) {
    return "Adult";
  } else {
    return "Minor";
  }
}

/*
* Using an arrow function and a ternary operator:
*/
const checkAge = age => age >= 18 ? "Adult" : "Minor";

/*
* The syntax is:
* Since a ternary operator is an expression, it works naturally with implicit returns.
*/
condition ? valueIfTrue : valueIfFalse
