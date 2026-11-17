/*
Exercise: Shared versus independent environments

Let's finish this chapter with a slightly more challenging example. */

function createAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit: amount => {
            balance += amount;
        },

        getBalance: () => balance
    };
}

const accountA = createAccount(100);
const accountB = createAccount(200);

accountA.deposit(50); // A: 150
accountB.deposit(25); // B: 225
accountA.deposit(10); // A: 160

console.log(accountA.getBalance()); //160
console.log(accountB.getBalance()); //225


