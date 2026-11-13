// 1. Creating a Promise (Simulating a delayed API call)
const fetchUserData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true; // Toggle to false to simulate a network error
            if (success) {
                resolve({ id: 1, name: "Alice" }); // Triggers .then()
            } else {
                reject(new Error("Network timeout")); // Triggers .catch()
            }
        }, 1000); // 1-second background delay
    });
};

// 2. Consuming the Promise (Legacy ES6 Way)
fetchUserData()
    .then(user => console.log(`Fetched user 1: ${user.name}`))
    .catch(error => console.error(`Error 2: ${error.message}`))
    .finally(() => console.log("Operation 1 complete."));

// 3. Consuming the Promise (Modern Async/Await Way)
const displayUser = async () => {
    try {
        // Execution pauses on this exact line until fetchUserData finishes
        const user = await fetchUserData();
        console.log(`Fetched user 2: ${user.name}`);
    } catch (error) {
        // Rejections are cleanly caught here
        console.error(`Error 2: ${error.message}`);
    } finally {
        console.log("Operation 2 complete.");
    }
};

displayUser();
