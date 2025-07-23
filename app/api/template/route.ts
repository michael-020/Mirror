import { NextRequest, NextResponse } from "next/server";
import { BASE_PROMPT } from "@/lib/prompts";
import { basePrompt as reactBasePrompt } from "@/defaults/react";
import { basePrompt as nodeBasePrompt } from "@/defaults/node";
import { openai } from "@/lib/server/openai";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json()

        const response = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "system",
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
                }
            ],
            max_completion_tokens: 2000
        });

        const answer = response.choices[0].message.content;

        if(answer === "react"){ 
            return NextResponse.json(
                {
                    prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [reactBasePrompt]
                },
                { status: 200 }
            )
        }

        if(answer === "node"){
            return NextResponse.json(
                {
                    prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [nodeBasePrompt]
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { msg: "Model response did not match expected output. Expected 'node' or 'react', but got something else." },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error while generating template: ", error)
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500}
        )
    }
}