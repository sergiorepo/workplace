/*
* Level 1 — Exercise 5: Returning object literals
* This is an important JavaScript particularity.
*
* Consider this arrow function:
*/
const createUser = name => { name: name };
/*
* It might look like it returns an object, but it doesn't!
* JavaScript interprets {} as a function body, not an object literal. As a result, the function returns undefined.
*
* To return an object implicitly, wrap the object literal in parentheses:
*/
const createUser = name => ({ name: name });
/*
* And using JavaScript's object property shorthand.
* Both correctly return an object.
* */
const createUser = name => ({ name });
