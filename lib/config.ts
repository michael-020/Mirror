import OpenAI from "openai";

export const API_URL=process.env.NEXT_PUBLIC_API_URL

export const GEMINI_API_KEY=process.env.GEMINI_API_KEY

export const openai = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});