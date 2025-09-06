import { OpenAI } from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate embeddings from text
export async function generateEmbeddings(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    encoding_format: "float",
  });
  
  return response.data[0].embedding;
}

// Split text into manageable chunks
export function splitTextIntoChunks(text: string, maxChunkSize: number = 8000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by paragraphs
  const paragraphs = text.split("\n\n");
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed max size, save current chunk and start a new one
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      // Otherwise, add paragraph to current chunk
      if (currentChunk) {
        currentChunk += "\n\n" + paragraph;
      } else {
        currentChunk = paragraph;
      }
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Generate answer from RAG system
export async function generateAnswer(question: string, context: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that answers questions based on the provided PDF content. Only use the context provided to answer questions. If the answer cannot be found in the context, say you don't have enough information to answer accurately."
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`
      }
    ],
    temperature: 0.5,
    max_tokens: 500,
  });
  
  return completion.choices[0].message.content || "Unable to generate an answer.";
}
