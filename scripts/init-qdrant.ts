import { QdrantClient } from "@qdrant/qdrant-js";
import * as dotenv from 'dotenv';
// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("Connecting to Qdrant...");
  try {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    });

    console.log("Connected to Qdrant. Creating collection...");
    
    await client.createCollection("pdf_chunks", {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log("Collection created: pdf_chunks");
    
    // List collections to verify
    const collections = await client.getCollections();
    console.log("Available collections:", collections);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
