import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "meta-llama/llama-3.1-8b-instruct:free",
      "messages": data.messages,
      "top_p": 1,
      "temperature": 1,
      "repetition_penalty": 1,
    })      
  });

  const result = await response.json();
  return NextResponse.json(result);
}