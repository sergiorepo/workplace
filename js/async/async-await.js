/*
* 4. Async / Await
* async/await provides a more readable way to work with Promises.
* We can rewrite the previous example without changing getUser().
* In modern JavaScript, async/await is generally preferred for readable asynchronous workflows, but understanding
* callbacks and Promises is essential because they're the underlying building blocks.
*/
const getUser = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ id: 1, name: "John" });
        }, 1000);
    });
};

const displayUser = async () => {
    try {
        const user = await getUser();

        console.log(user.name);
    } catch (error) {
        console.error(error);
    }
};

displayUser();

/*
* Output: John
*
* Two keywords are important:
*
*     async
*
* Declares an asynchronous function. An async function always returns a Promise, even if you return a regular value.
*/
const getNumber = async () => 42;

getNumber().then(number => {
    console.log(number);
});
/*
* await
*
* Waits for a Promise to settle before continuing execution of the surrounding async function.
* await does not block the entire JavaScript runtime. Other code can continue running while the async function is
* suspended.
* You can use await inside an async function or at the top level of a JavaScript module.
*
*/
const number = await getNumber();



