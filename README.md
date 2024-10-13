# AI Chatbot Interface

An interactive web-based chatbot interface that supports multiple AI models from OpenAI, Anthropic, OpenRouter, and Llama.

## Features

- Support for multiple AI providers: OpenAI, Anthropic, OpenRouter, and Llama
- Dynamic model selection
- Real-time chat interface
- iOS-style light and dark themes
- Settings management
- Admin panel for user management and system statistics

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/ai-chatbot-interface.git
   cd ai-chatbot-interface
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in the required API keys and other configuration options

4. Start the server:

   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select an AI model from the Models tab
2. Navigate to the Chat tab
3. Start chatting with the selected AI model

## Configuration

Update the `.env` file with your API keys and other settings:

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `PORT`: The port number for the server (default: 3000)
- `HOST`: The host for the server (default: localhost)
- `JWT_SECRET`: Secret key for JWT token generation
- `DATABASE_URL`: Your database connection string
- `API_KEY`: API key for external services
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- `NODE_ENV`: The environment (development, production, etc.)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
