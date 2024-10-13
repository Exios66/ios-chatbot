# Changelog

## [Unreleased]

### Added
- Implemented functionality to call API responses from OpenAI, Anthropic, OpenRouter, and Llama
- Added new API endpoints for model selection and response generation
- Created modelService.js to handle API calls for different AI providers
- Implemented theme toggle functionality with iOS-style light and dark themes
- Added Settings and Admin tabs with basic functionality
- Implemented in-memory storage for users, chat messages, user models, and settings

### Changed
- Updated chat.js to use the new generateResponse function when sending messages
- Modified modelSelection.js to store selected model and provider in localStorage
- Enhanced server.js to handle new API endpoints and AI provider integrations
- Updated .env file to include placeholders for new API keys
- Refactored main.js to initialize all modules and handle theme changes

### Fixed
- Resolved issues with theme toggle not working properly
- Fixed unused variable warnings in JavaScript files

## [1.0.0] - 2023-XX-XX
- Initial release of the AI Chatbot Interface
