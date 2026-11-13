/*
* 2. Callbacks
* A callback is simply a function passed to another function so that it can be invoked later.
* Callbacks are not necessarily asynchronous.
*/

// Example A: Synchronous callback
const greet = (name, callback) => {
    callback(name);
};

greet("John", name => {
    console.log(`Hello ${name}`);
});

// Example B: Asynchronous callback
// Connection to closures: The arrow function passed to setTimeout() can access callback even after getUser()
// has returned. That's a closure in action!
const getUser = callback => {
    setTimeout(() => {
        callback({ id: 1, name: "John" });
    }, 1000);
};

getUser(user => {
    console.log(user.name);
});