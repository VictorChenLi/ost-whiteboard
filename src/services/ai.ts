import { safeJsonParse } from "../utils/json";
import { validateStrictOSTJson } from "../utils/validation";
import { makeModelAPICall } from "../utils/modelHandlers";

export interface GenerateOSTParams {
  modelId: string;
  apiKey: string;
  context: string;
  customModelId?: string | null;
}

export async function generateOSTWithAI({
  modelId,
  apiKey,
  context,
  customModelId = null,
}: GenerateOSTParams) {
  const timestamp = new Date().toISOString();
  const systemPrompt = `You are a senior product strategist.
Generate an Opportunity Solution Tree (OST).
Return ONLY valid JSON. No markdown. No explanation.

Schema:
{
  "schemaVersion": "1.0",
  "root": {
    "id": "outcome",
    "type": "Outcome",
    "title": "Outcome",
    "description": "...",
    "children": []
  }
}`;

  console.group(`[OST-DEBUG] OST Generation Start - ${timestamp}`);
  console.log("Model ID:", modelId);
  console.log("Custom Model ID:", customModelId);
  console.log("Context length:", context.length);
  console.log("Context preview:", context.substring(0, 100) + "...");

  try {
    const content = await makeModelAPICall({
      modelId,
      apiKey,
      prompt: context,
      systemPrompt,
      customModelId,
    });

    console.log(`[OST-DEBUG] Raw AI Response - ${timestamp}`);
    console.log("Raw content length:", content.length);
    console.log("Raw content (first 500 chars):", content.substring(0, 500));
    console.log("Raw content (last 500 chars):", content.substring(Math.max(0, content.length - 500)));

    // Try to parse JSON
    let parsed: any;
    try {
      parsed = safeJsonParse(content);
      console.log(`[OST-DEBUG] JSON Parse Success - ${timestamp}`);
      console.log("Parsed JSON:", JSON.stringify(parsed, null, 2));
    } catch (parseError: any) {
      console.error(`[OST-DEBUG] JSON Parse Error - ${timestamp}`);
      console.error("Parse error:", parseError.message);
      console.error("Raw content that failed to parse:", content);
      console.groupEnd();
      throw parseError;
    }

    // Try to validate
    try {
      const validated = validateStrictOSTJson(parsed);
      console.log(`[OST-DEBUG] Validation Success - ${timestamp}`);
      console.log("Validated JSON structure:", {
        schemaVersion: validated.schemaVersion,
        rootId: validated.root?.id,
        rootType: validated.root?.type,
        rootTitle: validated.root?.title,
        childrenCount: validated.root?.children?.length || 0,
      });
      console.groupEnd();
      return validated;
    } catch (validationError: any) {
      console.error(`[OST-DEBUG] Validation Error - ${timestamp}`);
      console.error("Validation error:", validationError.message);
      console.error("Parsed JSON that failed validation:", JSON.stringify(parsed, null, 2));
      console.groupEnd();
      throw validationError;
    }
  } catch (error: any) {
    console.error(`[OST-DEBUG] Generation Error - ${timestamp}`);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.groupEnd();
    throw error;
  }
}
