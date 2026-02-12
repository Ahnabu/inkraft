import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text, action } = await req.json();

        if (!text || !action) {
            return NextResponse.json(
                { error: "Missing text or action" },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" },
                { status: 500 }
            );
        }

        let prompt = "";

        switch (action) {
            case "improve":
                prompt = `Improve the following text by fixing grammar, enhancing clarity, and making it more professional:\n\n${text}`;
                break;
            case "expand":
                prompt = `Expand the following text with more details, examples, and depth:\n\n${text}`;
                break;
            case "shorten":
                prompt = `Make the following text more concise while preserving its meaning:\n\n${text}`;
                break;
            case "tone":
                prompt = `Rewrite the following text with a different tone (more formal/casual):\n\n${text}`;
                break;
            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful writing assistant. Return only the improved text without any explanations or additional commentary.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const result = completion.choices[0]?.message?.content || "";

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error("OpenAI API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate AI response" },
            { status: 500 }
        );
    }
}
