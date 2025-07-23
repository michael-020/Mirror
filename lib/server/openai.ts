import OpenAI from "openai";
import { GEMINI_API_KEY } from "../config";

const openai = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export { openai }