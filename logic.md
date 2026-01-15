# Logic Documentation Index

This file indexes all logic and pattern documentation stored in the `/context` folder. Each entry provides a brief description and reference to the detailed documentation.

## Index

### Component Modularization Pattern
- **File**: `context/component-modularization-pattern.md`
- **Description**: Pattern for refactoring monolithic React components into modular, maintainable architecture with feature-based component organization, custom hooks for business logic, and domain-organized utilities.
- **Key Concepts**:
  - Feature-based component grouping
  - Custom hooks for state management
  - Domain-organized utilities
  - Service layer separation
  - Type safety and constants management

### AI Model Management
- **File**: `context/multiple-ai-model-selection-popout.md`
- **Description**: Multiple AI model selection with popout/modal interface for configuring models and API keys. Supports Google Gemini and OpenAI models with per-model API key storage, custom model support, and unified API handler.
- **Key Features**:
  - Multiple AI provider support (Google Gemini, OpenAI)
  - Model selection UI with grouped options
  - Custom model ID support
  - Per-model API key storage in localStorage
  - Popout modal for settings
  - Unified API call interface

### OST Generation with Retry Logic
- **File**: `context/ost-generation-with-retry.md`
- **Description**: AI-powered OST generation with automatic retry logic for handling invalid JSON responses, validation errors, and transient API failures. Encapsulated in a custom hook following the component-modularization pattern.
- **Key Features**:
  - Automatic retry on JSON parsing errors
  - Automatic retry on validation errors
  - Exponential backoff retry strategy
  - Intelligent error classification (retryable vs non-retryable)
  - Loading and error state management
  - User feedback during retries

---

## How to Add New Logic Documentation

1. Create a new markdown file in the `/context` folder
2. Document the logic, pattern, or implementation details
3. Add an entry to this `logic.md` file with:
   - File path
   - Brief description
   - Key features or concepts

## Notes

- All detailed logic documentation is stored in `/context/`
- This index file provides quick reference and navigation
- Keep descriptions concise but informative
- Update this file whenever new logic documentation is added
