const responses = {
    hello: ['Hi there!', 'Hello!', 'Hey!'],
    how_are_you: ['I\'m doing great, thanks for asking!', 'I\'m fine, how about you?', 'All good here!'],
    goodbye: ['Goodbye!', 'See you later!', 'Take care!'],
    default: ['I\'m not sure how to respond to that.', 'Could you please rephrase that?', 'Interesting, tell me more.']
};

import { LlamaAPI } from 'llamaapi';

// Initialize the LlamaAPI with your api_token
const llama = new LlamaAPI('your_api_token_here');

/**
 * Generates a response based on the user's message.
 * @param {string} message - The user's input message.
 * @returns {Promise<string>} - A promise that resolves to the generated response.
 */
async function getResponse(message) {
    const lowercaseMessage = message.toLowerCase().trim(); // Trim whitespace for better matching

    // Define your API request dynamically based on the user's message
    const apiRequestJson = {
        "messages": [
            {"role": "user", "content": lowercaseMessage}
        ],
        "functions": [
            {
                "name": "get_current_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "days": {
                            "type": "number",
                            "description": "for how many days ahead you want the forecast"
                        },
                        "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                    }
                },
                "required": ["location", "days"]
            }
        ],
        "stream": false,
        "function_call": "get_current_weather"
    };

    try {
        // Make your request and handle the response
        const response = await llama.run(apiRequestJson);
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);
    } catch (error) {
        console.error('Error fetching response:', error);
        return 'Sorry, there was an error processing your request.';
    }
}

export { getResponse };
