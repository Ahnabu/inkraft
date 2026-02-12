import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { prompt, context } = await req.json();

    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: `You are an expert AI writing assistant for a technical blogging platform.
    Your goal is to help authors refine, expand, or improve their content.
    Be concise, professional, and helpful.
    Return only the requested text modification or suggestion, without conversational filler.`,
        prompt: `Context: ${context || "None"}\n\nTask: ${prompt}`,
    });

    return result.toTextStreamResponse();
}
