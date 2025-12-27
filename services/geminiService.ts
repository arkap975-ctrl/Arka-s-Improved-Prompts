
import { GoogleGenAI } from "@google/genai";
import { PromptConfig, PromptFramework } from "../types.ts";

const SYSTEM_INSTRUCTION = `You are a world-class AI Prompt Engineer with deep expertise in Large Language Models (LLMs). 
Your task is to transform simple user queries into highly professional, structured, and effective prompts.

When a user provides a task, you must output a comprehensive prompt including:
1. **Role**: Define a specific persona for the AI.
2. **Context**: Background information the AI needs.
3. **Task**: A clear statement of the primary goal.
4. **Instructions**: Detailed, step-by-step constraints and rules.
5. **Flow of Operation**: How the AI should think through the problem (Chain of Thought).
6. **Output Format**: Specific structure for the final result (e.g., Markdown, JSON).
7. **Clarification Questions**: 1-3 questions the AI should ask the user if things are ambiguous.

Use professional markdown formatting. Use bolding and headers to make it readable.
Always optimize for the best possible reasoning performance.`;

export async function engineerPrompt(query: string, config: PromptConfig): Promise<string> {
  // Use process.env.API_KEY directly as required by the @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const frameworkInstruction = `Apply the ${config.framework} framework. Tone should be ${config.tone}. ${config.includeFlow ? "Ensure a 'Flow of Operation' section is included." : ""}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Transform this raw query into a professional prompt: "${query}"\n\nConfiguration: ${frameworkInstruction}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    // Access .text property directly as per latest SDK guidelines
    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with AI architect.");
  }
}
