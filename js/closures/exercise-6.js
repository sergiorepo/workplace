/*
Exercise: Identify and predict the closure behavior
* */

function createLogger(prefix) {
    let count = 0;

    return message => {
        count++;

        return `${prefix} [${count}]: ${message}`;
    };
}

const error = createLogger("ERROR");
const info = createLogger("INFO");

console.log(error("File not found"));
console.log(info("Application started"));
console.log(error("Connection failed"));
console.log(info("User logged in"));
console.log(error("Timeout"));
/*

Result:

    1, 1, 2, 2, 3*/
