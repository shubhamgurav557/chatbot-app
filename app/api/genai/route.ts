import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = {
    role: 'system',
    content: `
      You are an expert at creating landing page content. Your task is to:
      1. Generate compelling headlines.
      2. Highlight key benefits of the product or service.
      3. Include persuasive calls to action.
      4. Ensure the content is professional, engaging, and optimized for conversion.
    `,
  };
  
  const updatedMessages = [systemPrompt, ...messages];

  const model = google('models/gemini-1.5-flash-001');

  const result = await streamText({
    model,
    messages: updatedMessages,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.4,
  });
  return result.toDataStreamResponse();
}
