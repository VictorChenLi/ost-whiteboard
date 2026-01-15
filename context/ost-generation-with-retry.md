# OST Generation with Retry Logic

This document describes the implementation of AI-powered OST (Opportunity Solution Tree) generation with automatic retry logic for handling invalid JSON responses and validation errors.

## Overview

The OST generation feature encapsulates the complete flow of:
- Calling AI models to generate OST JSON
- Parsing and validating the response
- Automatically retrying on errors
- Managing loading and error states

This follows the component-modularization pattern by separating the generation concern into a dedicated custom hook.

## Architecture

### Components

1. **`useOSTGeneration` Hook** (`src/hooks/useOSTGeneration.ts`)
   - Encapsulates generation logic with retry capability
   - Manages loading, error, and retry state
   - Provides clean API for components

2. **`generateOSTWithAI` Service** (`src/services/ai.ts`)
   - Pure service function for AI API calls
   - Handles JSON parsing and validation
   - Throws errors for retry logic to catch

3. **Constants** (`src/constants/index.ts`)
   - `MAX_RETRY_ATTEMPTS`: Maximum number of retry attempts (default: 3)
   - `RETRY_DELAY_MS`: Base delay between retries (default: 1000ms)

## Implementation Details

### Retry Strategy

The hook implements intelligent retry logic with the following characteristics:

#### Retryable Errors

The system automatically retries on:

1. **JSON Parsing Errors**
   - Invalid JSON format
   - Empty JSON responses
   - Malformed JSON structure

2. **Validation Errors**
   - Schema version mismatches
   - Missing required fields
   - Invalid node types
   - Structural validation failures

3. **API Errors**
   - Network failures
   - Timeouts
   - Rate limiting (with retry)
   - Transient server errors

#### Non-Retryable Errors

The system does NOT retry on:

- Authentication errors (invalid API keys)
- Authorization errors
- Permanent API failures

### Retry Mechanism

```typescript
// Exponential backoff
const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
```

- **Attempt 1**: Immediate (no delay)
- **Attempt 2**: 1 second delay
- **Attempt 3**: 2 second delay
- **Attempt 4**: 4 second delay

### Hook API

```typescript
const {
  generate,      // Function to trigger generation
  loading,        // Loading state
  error,          // Error message (null if no error)
  retryCount,     // Current retry attempt number
  isRetrying,     // Boolean indicating if currently retrying
} = useOSTGeneration();
```

### Usage Example

```typescript
const { generate, loading, error, retryCount, isRetrying } = useOSTGeneration();

const handleGenerate = async () => {
  try {
    const json = await generate({
      modelId: "gemini-3-flash-preview",
      apiKey: "your-api-key",
      context: "User's strategy context",
      customModelId: null,
    });
    
    // Process successful result
    setRawJson(JSON.stringify(json, null, 2));
  } catch (err) {
    // Handle final error after all retries
    console.error("Generation failed:", err);
  }
};
```

## Error Handling Flow

```
1. User triggers generation
   ↓
2. Hook calls generateOSTWithAI()
   ↓
3. AI service makes API call
   ↓
4. Response received
   ↓
5. Parse JSON
   ├─ Success → Validate structure
   │            ├─ Valid → Return result ✅
   │            └─ Invalid → Throw validation error
   └─ Failure → Throw JSON parse error
   ↓
6. Error caught by hook
   ↓
7. Check if retryable
   ├─ Yes → Wait (exponential backoff)
   │        └─ Retry (go to step 2)
   └─ No → Throw error ❌
   ↓
8. Max retries reached → Throw final error ❌
```

## State Management

The hook manages the following state:

- **`loading`**: Indicates if generation is in progress
- **`error`**: Current error message (null if no error)
- **`retryCount`**: Number of retry attempts made (0-indexed)
- **`isRetrying`**: Boolean flag for retry in progress

## Integration with Components

### Main App Component

The main app component uses the hook and provides user feedback:

```typescript
const {
  generate: generateOST,
  loading: aiLoading,
  error: generationError,
  retryCount,
  isRetrying,
} = useOSTGeneration();

// Show retry feedback to user
useEffect(() => {
  if (isRetrying && retryCount > 0) {
    showToastMessage(
      `Retrying generation (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1})...`
    );
  }
}, [isRetrying, retryCount]);
```

## Benefits

1. **Resilience**: Automatically handles transient errors
2. **User Experience**: Reduces need for manual retries
3. **Separation of Concerns**: Generation logic isolated from UI
4. **Testability**: Hook can be tested independently
5. **Reusability**: Can be used in multiple components
6. **Maintainability**: Centralized retry logic

## Configuration

Retry behavior can be configured via constants:

```typescript
// src/constants/index.ts
export const MAX_RETRY_ATTEMPTS = 3;      // Adjust max retries
export const RETRY_DELAY_MS = 1000;       // Adjust base delay
```

## Error Messages

The hook provides specific error messages:

- **JSON Errors**: "Invalid JSON. Please check commas/quotes/brackets."
- **Validation Errors**: "schemaVersion must be '1.0'", "Missing root object", etc.
- **API Errors**: Original API error message with model context
- **Final Error**: "AI generation failed after retries"

## Future Enhancements

Potential improvements:

- Configurable retry strategies per error type
- User-configurable retry count
- Retry analytics/logging
- Circuit breaker pattern for repeated failures
- Different backoff strategies (linear, exponential, etc.)
- Retry queue for batch operations

## Testing Considerations

When testing the hook:

1. Mock the `generateOSTWithAI` service
2. Test retry logic with different error types
3. Verify exponential backoff timing
4. Test max retry limit
5. Verify non-retryable errors are not retried
6. Test state transitions (loading, error, success)

## Related Patterns

- **Component Modularization Pattern**: Follows hook-based separation
- **Service Layer Pattern**: Uses service functions for API calls
- **Error Handling Pattern**: Centralized error management
- **State Management Pattern**: Encapsulated state in custom hook
