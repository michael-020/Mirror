import { getSystemPrompt } from "@/lib/prompts";
import { openai } from "@/lib/server/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { messages, prompt } = await req.json();

        const formattedMessages = messages.map((msg: string) => ({
            role: "user", 
            content: msg,
        }));

        formattedMessages.push({
            role: "user",
            content: prompt,
        });

        formattedMessages.push({
            role: "system",
            content: getSystemPrompt(),
        });
        
        const completion = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: formattedMessages,
            stream: true,
            max_completion_tokens: 100000
        });
        const res = []
        for await (const chunk of completion) {
            console.log(chunk.choices[0].delta.content);
            res.push(chunk.choices[0].delta.content)
        }

        return NextResponse.json(
            { response: res},
            { status: 200}
        )
    } catch (error) {
        console.error("Error while chatting: ", error)
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        )
    }
}