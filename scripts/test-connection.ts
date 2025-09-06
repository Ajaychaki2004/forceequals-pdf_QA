// scripts/test-connection.ts
import * as dotenv from 'dotenv';
// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { QdrantClient } from "@qdrant/qdrant-js";

async function main() {
  console.log("Starting test connection...");
  console.log("QDRANT_URL:", process.env.QDRANT_URL);
  console.log("QDRANT_API_KEY exists:", !!process.env.QDRANT_API_KEY);

  try {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
      checkCompatibility: false, // Skip version compatibility check
      timeout: 15000, // Increase timeout to 15 seconds
    });

    console.log("Client created. Trying to get collections...");
    const collections = await client.getCollections();
    console.log("Collections:", collections);

    console.log("Success! Connection to Qdrant is working.");
  } catch (error) {
    console.error("Connection error:", error);
    
    // If there's a 'cause' property, log it
    if (error && typeof error === 'object' && 'cause' in error) {
      console.error("Cause:", error.cause);
    }
  }
}

main();
