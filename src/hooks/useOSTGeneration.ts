import { useState, useCallback } from "react";
import { generateOSTWithAI, GenerateOSTParams } from "../services/ai";
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS } from "../constants";

export interface UseOSTGenerationResult {
  generate: (params: GenerateOSTParams) => Promise<any>;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
}

/**
 * Custom hook for generating OST with AI, including retry logic for invalid JSON or validation errors.
 * 
 * This hook encapsulates:
 * - AI generation logic
 * - JSON parsing and validation
 * - Automatic retry on errors
 * - Loading and error state management
 * 
 * Following the component-modularization pattern, this hook separates
 * the generation concern from the UI components.
 */
export function useOSTGeneration(): UseOSTGenerationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Sleep utility for retry delays
   */
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /**
   * Determines if an error is retryable
   * - Invalid JSON format errors are retryable
   * - Validation errors are retryable
   * - Network/API errors are retryable
   * - Other errors may not be retryable
   */
  const isRetryableError = (error: Error): boolean => {
    const errorMessage = error.message.toLowerCase();
    
    // Retry on JSON parsing errors
    if (
      errorMessage.includes("invalid json") ||
      errorMessage.includes("json input is empty") ||
      errorMessage.includes("json parse")
    ) {
      return true;
    }

    // Retry on validation errors (schema issues)
    if (
      errorMessage.includes("schema") ||
      errorMessage.includes("validation") ||
      errorMessage.includes("missing") ||
      errorMessage.includes("invalid node type") ||
      errorMessage.includes("must be")
    ) {
      return true;
    }

    // Retry on API errors (network issues, rate limits, etc.)
    if (
      errorMessage.includes("request failed") ||
      errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("rate limit")
    ) {
      return true;
    }

    // Don't retry on authentication errors
    if (
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("api key")
    ) {
      return false;
    }

    // Default to retryable for unknown errors
    return true;
  };

  /**
   * Main generation function with retry logic
   */
  const generate = useCallback(
    async (params: GenerateOSTParams): Promise<any> => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();
      
      console.group(`[OST-DEBUG] Generation Session Start - ${sessionId}`);
      console.log("Session ID:", sessionId);
      console.log("Parameters:", {
        modelId: params.modelId,
        customModelId: params.customModelId,
        contextLength: params.context.length,
        hasApiKey: !!params.apiKey,
      });
      console.log("Max retry attempts:", MAX_RETRY_ATTEMPTS);

      setLoading(true);
      setError(null);
      setRetryCount(0);
      setIsRetrying(false);

      let lastError: Error | null = null;
      const attemptLogs: Array<{
        attempt: number;
        timestamp: string;
        error?: string;
        success: boolean;
      }> = [];

      for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
        const attemptTimestamp = new Date().toISOString();
        console.log(`\n[OST-DEBUG] Attempt ${attempt + 1}/${MAX_RETRY_ATTEMPTS + 1} - ${attemptTimestamp}`);

        try {
          // Update retry state
          if (attempt > 0) {
            setIsRetrying(true);
            setRetryCount(attempt);
            
            // Wait before retrying (exponential backoff)
            const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
            console.log(`[OST-DEBUG] Waiting ${delay}ms before retry (exponential backoff)`);
            await sleep(delay);
          }

          // Attempt generation
          const result = await generateOSTWithAI(params);
          
          // Success - reset state and return
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          console.log(`[OST-DEBUG] Generation Success - ${attemptTimestamp}`);
          console.log("Total attempts:", attempt + 1);
          console.log("Total duration:", `${duration}ms`);
          console.log("Result structure:", {
            schemaVersion: result.schemaVersion,
            hasRoot: !!result.root,
            rootType: result.root?.type,
          });
          console.groupEnd();

          attemptLogs.push({
            attempt: attempt + 1,
            timestamp: attemptTimestamp,
            success: true,
          });

          setLoading(false);
          setIsRetrying(false);
          setRetryCount(0);
          setError(null);
          return result;
        } catch (err: any) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const errorTimestamp = new Date().toISOString();
          
          console.error(`[OST-DEBUG] Attempt ${attempt + 1} Failed - ${errorTimestamp}`);
          console.error("Error type:", lastError.constructor.name);
          console.error("Error message:", lastError.message);
          console.error("Error stack:", lastError.stack);

          attemptLogs.push({
            attempt: attempt + 1,
            timestamp: errorTimestamp,
            error: lastError.message,
            success: false,
          });
          
          // Check if error is retryable
          const isRetryable = isRetryableError(lastError);
          const shouldRetry = isRetryable && attempt < MAX_RETRY_ATTEMPTS;

          console.log("Error analysis:", {
            isRetryable,
            shouldRetry,
            attemptsRemaining: MAX_RETRY_ATTEMPTS - attempt,
          });

          if (!shouldRetry) {
            // Non-retryable error or max attempts reached
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.error(`[OST-DEBUG] Generation Failed - ${errorTimestamp}`);
            console.error("Final error:", lastError.message);
            console.error("Total attempts:", attempt + 1);
            console.error("Total duration:", `${duration}ms`);
            console.error("Attempt log:", attemptLogs);
            console.groupEnd();

            setLoading(false);
            setIsRetrying(false);
            setError(lastError.message || "AI generation failed");
            throw lastError;
          }

          console.log(`[OST-DEBUG] Will retry (${MAX_RETRY_ATTEMPTS - attempt} attempts remaining)`);
          // Continue to next retry attempt
        }
      }

      // If we get here, all retries failed
      const endTime = Date.now();
      const duration = endTime - startTime;
      const finalError = lastError || new Error("AI generation failed after retries");
      
      console.error(`[OST-DEBUG] All Retries Exhausted - ${new Date().toISOString()}`);
      console.error("Final error:", finalError.message);
      console.error("Total attempts:", MAX_RETRY_ATTEMPTS + 1);
      console.error("Total duration:", `${duration}ms`);
      console.error("Attempt log:", attemptLogs);
      console.groupEnd();

      setLoading(false);
      setIsRetrying(false);
      setError(finalError.message);
      throw finalError;
    },
    []
  );

  return {
    generate,
    loading,
    error,
    retryCount,
    isRetrying,
  };
}
