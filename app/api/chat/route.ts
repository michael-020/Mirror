import { getSystemPrompt } from "@/lib/prompts";
import { openai } from "@/lib/server/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { messages, prompt } = await req.json();

        const inputMessages = messages.map((msg: { role: "user" | "assitant" | "system", content: string}) => ({
            role: msg.role,
            content: msg.content
        }))

        const formatedMessages = [
            {
                role: "system",
                content: getSystemPrompt()
            },
            prompt,
            inputMessages
        ]
        
        const completion = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: formatedMessages,
            stream: true,
            max_completion_tokens: 100000
        });
       
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of completion) {
                    console.log(chunk.choices[0].delta.content);
                    const content = chunk.choices[0].delta.content;
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("Error while chatting: ", error)
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        )
    }
}