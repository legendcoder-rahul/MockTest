import { generateResponse, generateChatTitle, parseJSONResponse } from "../service/ai.service.js";
import chatModel from "../models/Chat.model.js";
import messageModel from "../models/Message.model.js";

// Sends a message to the AI tutor and retrieves the parsed response
export async function sendMessage(req, res) {
    try {
        const userId = req.user.id;
        const { message, questionContext } = req.body;
        let chatId = req.body.chatId;

        if (!message || message.trim() === '') {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // If no chatId is provided, create a new chat session
        if (!chatId) {
            const title = await generateChatTitle(message);
            const newChat = await chatModel.create({
                user: userId,
                title: title
            });
            chatId = newChat._id;
        }

        // Save user message in the database
        await messageModel.create({
            chat: chatId,
            sender: 'user',
            text: message
        });

        // Retrieve full conversation history for this chat
        const dbMessages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        // Map database messages to format needed for the AI service
        const history = dbMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        // Build the system instructions
        let systemPrompt = `You are "ExamAI Tutor", a supportive and expert AI tutor for competitive exams like SSC CGL, UPSC, Banking, and Railways.
Your goal is to guide the user step-by-step, teaching them the logic, formulas, concepts, and shortcut tricks.

GUIDELINES:
1. Break down concepts clearly. Show formulas and rules when applicable.
2. Provide a shortcut trick or mnemonic to solve the question faster in exams.
3. If requested or if the user asks in Hindi, explain using Hinglish (mix of English and Hindi) or Hindi.
4. Respond in valid JSON format only, matching this structure:
{
  "text": "Your conversational response here. Use markdown for styling, bolding, and bullet points.",
  "conceptCard": {
    "title": "Concept/Topic Title (optional, provide only if explaining a specific math/GK concept)",
    "content": "Short, clear explanation of the core concept or formula (optional)"
  },
  "actionChips": ["Follow up query 1", "Follow up query 2"] (2-3 short chips the user might click next)
}
Ensure your JSON output is strictly valid and escapes double quotes and newlines correctly.`;

        if (questionContext) {
            systemPrompt += `\n\nActive Question Context:
- Topic: ${questionContext.topic}
- Source: ${questionContext.source}
- Question Text: "${questionContext.text}"
- Options:
${questionContext.options ? questionContext.options.map((opt, i) => `  ${i}. ${opt}`).join('\n') : ''}
- Correct Option Index: ${questionContext.correctOption}
- User's Selection Index: ${questionContext.userAnswer}
- Status: ${questionContext.isCorrect ? "Correct" : "Incorrect"}
Please refer to this question in your explanations where relevant. Keep your guidance educational, pointing out the mistake in the user's choice and showing how to reach the correct answer.`;
        }

        // Generate response from AI model
        const rawResponse = await generateResponse(history, systemPrompt);
        
        // Parse JSON response safely
        const parsedResponse = parseJSONResponse(rawResponse);

        // Save AI reply in the database
        const botMessage = await messageModel.create({
            chat: chatId,
            sender: 'bot',
            text: parsedResponse.text,
            conceptCard: parsedResponse.conceptCard,
            actionChips: parsedResponse.actionChips
        });

        res.status(200).json({
            success: true,
            chatId: chatId,
            messages: [botMessage]
        });

    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({
            success: false,
            message: "Error processing chat message",
            error: error.message
        });
    }
}

// Retrieves all chat histories for the user
export async function getChats(req, res) {
    try {
        const userId = req.user.id;
        const chats = await chatModel.find({ user: userId }).sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve chat history",
            error: error.message
        });
    }
}

// Retrieves all messages in a specific chat
export async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        const dbMessages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        
        const messages = dbMessages.map(msg => {
            const msgObj = msg.toObject();
            if (msgObj.sender === 'bot' && msgObj.text && msgObj.text.trim().startsWith('{')) {
                try {
                    const parsed = parseJSONResponse(msgObj.text);
                    if (parsed.text) {
                        msgObj.text = parsed.text;
                        if (parsed.conceptCard) msgObj.conceptCard = parsed.conceptCard;
                        if (parsed.actionChips) msgObj.actionChips = parsed.actionChips;
                    }
                } catch (e) {
                    // Ignore, keep original text
                }
            }
            return msgObj;
        });

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve messages",
            error: error.message
        });
    }
}