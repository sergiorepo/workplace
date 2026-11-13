/*
* Closure creation and lifetime
*
* When is a closure created?
* A closure is formed when a function object is created with access to its surrounding lexical environment.
*
* - The arrow function is created during the execution of outer(), when JavaScript evaluates the arrow function expression.
* - It is not created when counter() is subsequently called.
*/
function outer() {
    let count = 0;

    const inner = () => {
        count++;
        return count;
    };

    return inner;
}

const counter = outer();
/*
* 2.2. How long does the captured environment survive?
*
* As long as the environment or its bindings are needed by reachable functions or other references, the JavaScript
* engine must preserve their observable behavior.
* Even though outer() has finished executing, its count binding must remain accessible.
*
*/
let counter = outer();

counter(); // 1
counter(); // 2
counter(); // 3

/*
* Now consider:
*/
counter = null;

/*
* If there are no other references to the returned function or its environment, the associated memory can become
* eligible for garbage collection.
*
*  Two important qualifications:
* - Setting counter = null does not guarantee immediate garbage collection.
* - It is possible that some other reference still keeps the function or environment reachable.
*/

/*
* Does the entire outer function stay in memory?
* The returned function uses count but never uses temporary.
* Does JavaScript have to keep both variables physically allocated?
* No. The engine must preserve the observable behavior of the program, but it may optimize away unused bindings.
*/
function createCounter() {
    let count = 0;
    let temporary = 1000;

    return () => ++count;
}

/*
* 3. Multiple closures sharing the same environment
* This is one of the most interesting properties of closures.
* - All three inner functions have access to the same count binding.
* - This is because they were created during the same invocation of createCounter().
*
* This mechanism allows you to implement private state without classes.
* In the example, callers cannot directly access the lexical count variable. They must interact with it through the
* three provided functions.
* This is a form of encapsulation.
*/
function createCounter() {
    let count = 0;

    const increment = () => ++count;
    const decrement = () => --count;
    const getCount = () => count;

    return {
        increment,
        decrement,
        getCount
    };
}

const counter = createCounter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

/*
* 4. Separate invocations create separate environments
* Each call to createCounter() creates a new environment. As a result, counterA and counterB have independent
* count bindings.
*/
const counterA = createCounter();
const counterB = createCounter();

/*
* | Situation                                  | Behavior                                           |
* | ------------------------------------------ | -------------------------------------------------- |
* | Two closures created during the same call  | Can share captured bindings                        |
* | Two closures created during separate calls | Normally capture separate local bindings           |
* | Two references to the same closure         | Both refer to the same function and captured state |
*/

/*
* That third case is worth demonstrating:
* Here we did not invoke createCounter() twice.
* Instead, counterB points to the same object returned for counterA, including the same closure functions.
* */
const counterA = createCounter();
const counterB = counterA;

counterA.increment(); // 1
counterB.increment(); // 2
counterA.getCount();  // 2

/*
* 5. Does a closure require returning a function?
* No, and this is another common misunderstanding. Closures can exist even when a function isn't returned.
* inner has access to its enclosing lexical environment, making it a closure.
* The difference is that this environment doesn't need to remain accessible after outer() finishes if nothing else
* retains it.
*/
function outer() {
    let message = "Hello";

    function inner() {
        console.log(message);
    }

    inner();
}

outer();

/*
* In this case, the callback is registered as an event listener.
* Although setupButton() returns, the registered callback can remain reachable through the event listener registration,
* so its captured clicks binding remains accessible.
* This is a real-world example of closure lifetime, and it also explains why event listeners can sometimes contribute
* to unwanted memory retention.
*/


function setupButton() {
    let clicks = 0;

    document.querySelector("button")
        .addEventListener("click", () => {
            clicks++;
            console.log(clicks);
        });
}

setupButton();

/*
* 6. What happens internally? A preview of our next chapter
* We now have enough information to revisit your original question about memory.
*
*
*/
function outer() {
    let x = 10;
    return () => x;
}

const fn = outer();

/*
* Conceptually, after outer() returns, we have:
* CALL STACK
* ──────────────────────
* Global execution
*   fn ──────────────────────┐
* ──────────────────────     │
*                            │
* DYNAMICALLY MANAGED MEMORY │
* ──────────────────────     │
*                            ▼
*                       Arrow function
*                            │
*                            ▼
*                     Lexical environment
*                     ┌─────────────────┐
*                     │ x = 10          │
*                     └─────────────────┘
*
* The important insight is that the lifetime of an executing function call is not the same as the lifetime of the
* variables captured by closures.
* When outer() returns, its active call frame can be removed from the call stack.
* But the environment containing x remains accessible because fn still refers to the arrow function that needs it.
* This is a conceptual model; actual stack allocation, heap allocation, and optimization depend on the JavaScript
* engine.
*/

