import OpenAI from "openai";
import { API_KEYS } from "../config";

let currentIndex = 0;

function getNextKey() {
  const key = API_KEYS[currentIndex];
  currentIndex = (currentIndex + 1) % API_KEYS.length;
  return key;
}

export function getOpenAIClient() {
  const key = getNextKey();

  console.log("Using API Key:", key?.slice(0, 10) + "...");

  return new OpenAI({
    apiKey: key,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}