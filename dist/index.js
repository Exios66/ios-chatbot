"use strict";

// Function to log a greeting message
function greet(message) {
    console.debug("Debug: Preparing to log the greeting message.");
    console.log(message);
    console.debug("Debug: Greeting message logged successfully.");
}

// Call the greet function with a message
greet("Hello, TypeScript!");

// If you need to export the greet function
export { greet };
