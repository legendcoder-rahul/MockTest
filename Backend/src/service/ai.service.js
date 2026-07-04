import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// Standard model for plain text generation (e.g. titles)
const geminiModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GEMINI_API_KEY
});

// Dedicated JSON model to force structured JSON output from Gemini
const jsonModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GEMINI_API_KEY,
    responseMimeType: "application/json"
});

// Invokes the JSON Gemini model with formatting and returns the content
export async function generateResponse(messages, systemPrompt = "") {
    const formattedMessages = [];
    
    if (systemPrompt) {
        formattedMessages.push(new SystemMessage(systemPrompt));
    }
    
    messages.forEach(msg => {
        const content = msg.content || msg.text || "";
        const role = msg.role || msg.sender;
        if (role === "user") {
            formattedMessages.push(new HumanMessage(content));
        } else if (role === "system") {
            formattedMessages.push(new SystemMessage(content));
        } else {
            formattedMessages.push(new AIMessage(content));
        }
    });

    const response = await jsonModel.invoke(formattedMessages);
    return response.content;
}

// Automatically creates a short 3-5 word title for the chat
export async function generateChatTitle(firstMessage) {
    try {
        const prompt = [
            new SystemMessage("Create a short, concise 3 to 5 word title for a chat session starting with the following user query. Do not use quotes, markdown, or extra punctuation. Return only the title text itself."),
            new HumanMessage(firstMessage)
        ];
        const response = await geminiModel.invoke(prompt);
        return response.content.trim().replace(/^["']|["']$/g, '');
    } catch (e) {
        console.error("Error generating chat title:", e);
        return "Exam AI Tutor Session";
    }
}

// Safely parses JSON response from the LLM using brace counting
export function parseJSONResponse(text) {
    try {
        let cleanText = text.trim();
        
        // Strip markdown wrappers if present
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith("```")) {
            cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        
        cleanText = cleanText.trim();
        
        // Find the first outer '{'
        const firstBrace = cleanText.indexOf('{');
        if (firstBrace === -1) {
            throw new Error("No opening brace found in response");
        }
        
        // Match outer braces by counting and accounting for quotes and escapes
        let braceCount = 0;
        let lastBrace = -1;
        let inString = false;
        let escapeNext = false;
        
        for (let i = firstBrace; i < cleanText.length; i++) {
            const char = cleanText[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        lastBrace = i;
                        break;
                    }
                }
            }
        }
        
        if (lastBrace !== -1) {
            cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        } else {
            // Fallback if brace counting was incomplete
            const fallbackLastBrace = cleanText.lastIndexOf('}');
            if (fallbackLastBrace !== -1) {
                cleanText = cleanText.substring(firstBrace, fallbackLastBrace + 1);
            }
        }

        return JSON.parse(cleanText);
    } catch (e) {
        console.warn("JSON parsing failed, returning raw text as fallback:", e);
        return {
            text: text,
            conceptCard: null,
            actionChips: ["Explain step-by-step", "Show shortcut trick", "Try another question"]
        };
    }
}
