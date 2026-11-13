/*
* A Promise represents the eventual result of an asynchronous operation.
* A Promise can be in three states:
*
*                     Pending
*            The operation hasn't finished
*                         |
*                         |
*      ------------------------------------------
*     |                                          |
*     |                                          |
*  Fulfilled                                 Rejected
*  Successful result                         Operation failed
*
*/

/*
*
* The important parts:
* - new Promise() creates a Promise.
* - resolve(value) fulfills the Promise with a result.
* - reject(error) rejects the Promise.
* - .then() registers a callback to process a successful result.
* - .catch() registers a callback to handle errors.
*
* Notice that Promises still use callbacks, often written as arrow functions.
*/
const getUser = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ id: 1, name: "John" });
        }, 1000);
    });
};

console.log("First");
getUser()
    .then(user => {
        console.log(user.name);
    })
    .catch(error => {
        console.error(error);
    });

console.log("Last");