function mystery() {
    let x = 10;

    const getX = () => x;

    const addFive = () => {
        x += 5;
    };

    return { getX, addFive };
}

const obj = mystery();
console.log(obj.getX());
obj.addFive();
console.log(obj.getX());

/*
* JavaScript calls createAccount() twice.
* Each invocation creates its own balance binding:
* - Account A: balance starts at 100.
* - Account B: balance starts at 200.
* Within each account, the deposit() and getBalance() closures share access to that account's balance.
*
*/


