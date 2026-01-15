// Model detection and API call utilities

export const isOpenAIModel = (modelId: string): boolean => {
  return (
    modelId.startsWith("gpt-") ||
    modelId.startsWith("o1-") ||
    modelId.startsWith("o3-")
  );
};

export const isGPT5Model = (modelId: string): boolean => {
  return modelId.startsWith("gpt-5");
};

export const getModelEndpoint = (modelId: string, apiKey: string): string => {
  if (isOpenAIModel(modelId)) {
    return "https://api.openai.com/v1/chat/completions";
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
};

export const getActualModelId = (
  modelId: string,
  customModelId: string | null
): string | null => {
  if (modelId === "custom") {
    return customModelId || null;
  }
  return modelId;
};

// OpenAI payload creator
const createOpenAIPayload = (
  modelId: string,
  prompt: string,
  systemPrompt: string
) => {
  return {
    model: modelId,
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  };
};

// Gemini payload creator
const createGeminiPayload = (prompt: string, systemPrompt: string) => {
  return {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\nUser: ${prompt}`,
          },
        ],
      },
    ],
  };
};

// OpenAI response parser
const parseOpenAIResponse = (data: any): string => {
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty AI response from OpenAI");
  }
  return content;
};

// Gemini response parser
const parseGeminiResponse = (data: any): string => {
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Empty AI response from Gemini");
  }
  return content;
};

export interface MakeModelAPICallParams {
  modelId: string;
  apiKey: string;
  prompt: string;
  systemPrompt: string;
  customModelId?: string | null;
}

export const makeModelAPICall = async ({
  modelId,
  apiKey,
  prompt,
  systemPrompt,
  customModelId = null,
}: MakeModelAPICallParams): Promise<string> => {
  const targetModel = getActualModelId(modelId, customModelId || null);
  if (!targetModel) {
    throw new Error("Invalid model ID");
  }

  const isOpenAI = isOpenAIModel(targetModel);
  const endpoint = getModelEndpoint(targetModel, apiKey);
  const timestamp = new Date().toISOString();

  // Debug: Log request details
  console.group(`[OST-DEBUG] AI API Request - ${timestamp}`);
  console.log("Model:", targetModel);
  console.log("Provider:", isOpenAI ? "OpenAI" : "Gemini");
  console.log("Endpoint:", endpoint);
  console.log("Prompt length:", prompt.length);
  console.log("System prompt length:", systemPrompt.length);
  console.log("API Key present:", !!apiKey);
  console.log("API Key prefix:", apiKey ? apiKey.substring(0, 10) + "..." : "N/A");

  // Create provider-specific payloads
  let payload: any;
  let headers: Record<string, string>;

  if (isOpenAI) {
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    payload = createOpenAIPayload(targetModel, prompt, systemPrompt);
  } else {
    headers = { "Content-Type": "application/json" };
    payload = createGeminiPayload(prompt, systemPrompt);
  }

  console.log("Request payload:", JSON.stringify(payload, null, 2));
  console.groupEnd();

  try {
    // Make API call
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    // Debug: Log response status
    console.group(`[OST-DEBUG] AI API Response - ${timestamp}`);
    console.log("Status:", response.status, response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      console.groupEnd();
      throw new Error(
        `AI request failed (${targetModel}): ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Full response data:", JSON.stringify(data, null, 2));

    // Parse response based on provider
    let content: string;
    if (isOpenAI) {
      content = parseOpenAIResponse(data);
    } else {
      content = parseGeminiResponse(data);
    }

    console.log("Extracted content length:", content.length);
    console.log("Extracted content preview:", content.substring(0, 200) + "...");
    console.groupEnd();

    return content;
  } catch (error: any) {
    console.error(`[OST-DEBUG] API Call Error - ${timestamp}:`, error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw error;
  }
};
