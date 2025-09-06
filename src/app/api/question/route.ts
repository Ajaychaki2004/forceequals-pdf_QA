import { NextRequest, NextResponse } from "next/server";
import { generateAnswer } from "@/lib/openai";
import { qdrant } from "@/lib/qdrant";

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== 'pdf_qa_dev_secret_key') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const { question, docId } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Generate embedding for the question
    const openai = await import("@/lib/openai");
    const questionEmbedding = await openai.generateEmbeddings(question);
    
    // Filter by document ID if provided
    const filter = docId 
      ? { must: [{ key: "docId", match: { value: docId } }] }
      : undefined;
      
    // Search for relevant chunks
    const searchResults = await qdrant.search("pdf_chunks", {
      vector: questionEmbedding,
      limit: 5,
      filter,
    });
    
    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({ 
        answer: "I couldn't find any relevant information to answer your question." 
      });
    }
    
    // Combine relevant chunks as context
    const context = searchResults
      .map(result => result.payload?.content || "")
      .join("\n\n");
    
    // Generate answer
    const answer = await generateAnswer(question, context);
    
    return NextResponse.json({ answer });
    
  } catch (error: any) {
    console.error("Error answering question:", error);
    return NextResponse.json({ error: error.message || "Failed to process question" }, { status: 500 });
  }
}
