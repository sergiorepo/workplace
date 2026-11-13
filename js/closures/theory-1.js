/*
* What is a closure?
* At first glance, there's something unusual happening here.
* 1. We execute outer().
* 2. outer() creates the local variable message.
* 3. outer() creates and returns the function inner.
* 4. outer() finishes executing.
* 5. Later, we execute greet(), which is actually inner().
* 6. The function successfully accesses message, even though outer() has already returned.
*/
function outer() {
    let message = "Hello!";

    function inner() {
        console.log(message);
    }

    return inner;
}

const greet = outer();

greet(); // "Hello!"

/*
* 3. Closures capture variables, not snapshots of their values
* Notice that count does not reset to zero every time counter() is called.

The inner arrow function retains access to the same count binding that was established when createCounter() executed.
*/

function createCounter() {
    let count = 0;

    return () => {
        count++;
        return count;
    };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

/*
* Each execution of createCounter() establishes a new environment with its own count variable.
*
* Consequently, counterA and counterB maintain independent state.
* This is one of the reasons closures are so useful.
*
*/
const counterA = createCounter();
const counterB = createCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2

console.log(counterB()); // 1
console.log(counterA()); // 3

/*
* For example, consider a function factory:
*/
const createMultiplier = factor => {
    return number => number * factor;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30

/*
* A particularly important connection to React
*/
function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <button onClick={handleClick}>
            {count}
        </button>
    );
}

/*
* handleClick is a closure. It accesses count from the component render in which it was created.
*
* When React renders the component again, it creates a new render scope and normally a new handleClick function
* associated with that render.
* This explains why callbacks sometimes see stale state: an older callback may still reference values from an older
* render.
* It also helps explain why functional state updates can be preferable:
*/
setCount(prevCount => prevCount + 1);

