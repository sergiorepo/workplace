/*
Exercise: Combining everything we've learned*/
function createFunctions() {
    const functions = [];

    for (let i = 0; i < 3; i++) {
        let value = i * 10;

        functions.push(() => {
            value += 5;
            return value;
        });
    }

    return functions;
}

const funcs = createFunctions();

console.log(funcs[0]());
console.log(funcs[0]());
console.log(funcs[1]());
console.log(funcs[2]());
console.log(funcs[1]());


// The output is: 5 10 15 25 20