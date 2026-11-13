/*
* Lexical Scope and Scope Chains
* Lexical scope: The foundation of closures
* Before we go further with memory, we need to understand scope.
* - A scope determines where a variable can be accessed in your source code.
* - JavaScript uses lexical scoping, also called static scoping.
* - This means that the scope of a function is determined by where the function is defined, not where it is called.
*/
const x = 10;

function outer() {
    const y = 20;

    function inner() {
        const z = 30;

        console.log(x);
        console.log(y);
        console.log(z);
    }

    inner();
}

outer();
// The output is:
// 10
// 20
// 30
// Why? Because inner() can access variables declared in its own scope and its enclosing scopes.

/*
* 3. How the scope chain works
* When JavaScript encounters a variable reference, it looks for the corresponding binding.
*
* 1. Local scope: inner()
* Contains z, not y
* 2. Enclosing scope: outer()
* Found y = 20
*
* - If y were absent from outer(), the search would continue outward toward the global environment.
* - If no suitable binding exists anywhere along the chain, an ordinary read of y produces a ReferenceError.
* - The scope chain works from the inside outward, not in the opposite direction.
* - For instance, outer() cannot access inner()'s local variable z.
* For example, inside inner():
* console.log(y);
*/

/*
* 4. Lexical scope versus dynamic scope
* This is particularly important for understanding closures.
*
*/
const name = "Global";

function greet() {
    console.log(name);
}

function execute() {
    const name = "Local";
    greet();
}

execute();

// Prints:
// Global
//
// You might initially expect "Local", because greet() is executed inside execute().
// But JavaScript doesn't choose the surrounding scope based on the call location.
// It uses the location where greet() was defined.
// In this example, greet() was defined in global scope, so its reference to name resolves to the global binding.
/*
| Lexical scoping (JavaScript)           |  Dynamic scoping (hypothetical)                |
| -------------------------------------- | ---------------------------------------------- |
| Based on where the function is defined | Based on the active calling context            |
| Scope chain follows lexical nesting    | Lookup follows the dynamic calling environment |
| greet() prints "Global"                | greet() could print "Local"                    |
*/

/*
* 6. What about variable shadowing?
* - Shadowing occurs when an inner scope declares a variable with the same name as a variable in an outer scope.
* The output is 300, because JavaScript finds the closest matching binding in inner()'s own scope.
* - It never needs to search farther outward for value.
* - If you remove the let value = 300 declaration, the output becomes 200.
* - And if you remove the declaration inside outer() as well, the output becomes 100.
* - One important subtlety: a declaration can shadow an outer variable even before the inner variable has been
*                           initialized. With let and const, accessing it during that interval causes a ReferenceError
*                           because of the temporal dead zone.
*/
let value = 100;

function outer() {
    let value = 200;

    function inner() {
        let value = 300;
        console.log(value);
    }

    inner();
}

outer();
