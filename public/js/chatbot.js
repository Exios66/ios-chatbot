const responses = {
    hello: ['Hi there!', 'Hello!', 'Hey!'],
    how_are_you: ['I'm doing great, thanks for asking!', 'I'm fine, how about you?', 'All good here!'],
    goodbye: ['Goodbye!', 'See you later!', 'Take care!'],
    default: ['I'm not sure how to respond to that.', 'Could you please rephrase that?', 'Interesting, tell me more.']
};

function getResponse(message) {
    return new Promise((resolve) => {
        const lowercaseMessage = message.toLowerCase();

        let response;
        if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
            response = responses.hello[Math.floor(Math.random() * responses.hello.length)];
        } else if (lowercaseMessage.includes('how are you')) {
            response = responses.how_are_you[Math.floor(Math.random() * responses.how_are_you.length)];
        } else if (lowercaseMessage.includes('goodbye') || lowercaseMessage.includes('bye')) {
            response = responses.goodbye[Math.floor(Math.random() * responses.goodbye.length)];
        } else {
            response = responses.default[Math.floor(Math.random() * responses.default.length)];
        }

        // Simulate processing time
        setTimeout(() => {
            resolve(response);
        }, 500 + Math.random() * 1000);
    });
}

module.exports = { getResponse };
