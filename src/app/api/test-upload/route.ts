// src/app/api/test-upload/route.ts

import { NextResponse } from "next/server";
import { qdrant } from "@/lib/qdrant";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("pdf") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log(`Received PDF file: ${file.name}, size: ${buffer.length} bytes`);

    // Example: Split into chunks (replace with your actual processor)
    const docId = file.name.replace(".pdf", "").replace(/\s+/g, "_");
    const chunkText = `This is a sample PDF chunk for file ${file.name}`;
    
    // Create a mock vector with 1536 dimensions (same as OpenAI embeddings)
    // Ensure all values are floating point numbers in the proper range
    const mockVector = Array(1536).fill(0).map(() => parseFloat((Math.random() - 0.5).toFixed(6)));

    // Try to create collection only if it doesn't exist
    try {
      const collections = await qdrant.getCollections();
      const collectionExists = collections.collections.some(c => c.name === "pdf_chunks");
      
      if (!collectionExists) {
        await qdrant.createCollection("pdf_chunks", {
          vectors: { size: 1536, distance: "Cosine" }
        });
        console.log("Collection created successfully");
      } else {
        console.log("Collection already exists, skipping creation");
      }
    } catch (error) {
      console.log("Error checking/creating collection:", error);
      // Continue anyway - the collection might exist
    }

    // Try to create a point with a simple structure
    try {
      // Convert docId to a random number for testing
      const numericId = Math.floor(Math.random() * 1000000);
      
      await qdrant.upsert("pdf_chunks", {
        points: [{
          id: numericId,
          vector: mockVector,
          payload: {
            text: chunkText,
            docId: docId,
            filename: file.name
          }
        }]
      });
    } catch (error: any) {
      console.error("Qdrant upsert error details:", error.data || error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      docId, 
      chunkCount: 1,
      message: "Test mode: Created dummy embedding for PDF file" 
    });

  } catch (error: any) {
    console.error("Failed to store in Qdrant:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
