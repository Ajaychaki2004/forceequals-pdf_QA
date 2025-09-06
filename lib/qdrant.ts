import { QdrantClient } from "@qdrant/qdrant-js";

// In a Node.js script context, load environment variables if needed
if (typeof process !== "undefined" && !process.env.NEXT_RUNTIME) {
  // Only load dotenv in script context, not in Next.js server
  try {
    require("dotenv").config({ path: '.env.local' });
  } catch (e) {
    console.warn("Could not load dotenv, assuming environment variables are set");
  }
}

// Create client with optimized settings
export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
  
  // Performance and reliability settings
  checkCompatibility: false, // Skip version compatibility check
  timeout: 10000, // 10-second timeout
});
