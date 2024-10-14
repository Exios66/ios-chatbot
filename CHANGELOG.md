# Changelog

## [Unreleased]

### Added

- Implemented functionality to call API responses from OpenAI, Anthropic, OpenRouter, and Llama
- Added new API endpoints for model selection and response generation
- Created modelService.js to handle API calls for different AI providers
- Implemented theme toggle functionality with iOS-style light and dark themes
- Added Settings and Admin tabs with basic functionality
- Implemented in-memory storage for users, chat messages, user models, and settings
- Added build script for creating a static version of the site
- Created .babelrc file for configuring Babel transpilation

### Changed

- Updated chat.js to use the new generateResponse function when sending messages
- Modified modelSelection.js to store selected model and provider in localStorage
- Enhanced server.js to handle new API endpoints and AI provider integrations
- Updated .env file to include placeholders for all necessary API keys
- Refactored main.js to initialize all modules and handle theme changes
- Updated package.json to include new build script
- Modified README.md with instructions for building and deploying the project using GitHub Pages
- Changed the "main" field in package.json from "server.js" to "app.js" to match the start script
- Simplified deployment process by utilizing GitHub Pages' automatic builder instead of custom scripts
- Updated .github/workflows/label.yml to use a custom GitHub token secret (CUSTOM_GITHUB_TOKEN)

### Fixed

- Resolved issues with theme toggle not working properly
- Fixed unused variable warnings in JavaScript files
- Addressed inconsistency between "main" field and start script in package.json

## [1.0.0] - 2023-XX-XX

- Initial release of the AI Chatbot Interface
