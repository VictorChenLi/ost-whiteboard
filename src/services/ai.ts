import { AI_MODEL } from "../constants";
import { safeJsonParse } from "../utils/json";
import { validateStrictOSTJson } from "../utils/validation";

export async function generateOSTWithAI(apiKey: string, context: string) {
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

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: context },
      ],
    }),
  });

  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = safeJsonParse(content);
  return validateStrictOSTJson(parsed);
}
