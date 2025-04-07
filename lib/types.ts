// src/types.ts (or similar shared location)
export interface QA {
  question: string;
  answer: string;
}

export interface OptimizedImage {
  id: string; // Firestore document ID
  optimizedBucket: string;
  optimizedName: string; // We'll use this for the route parameter `[name]`
  previewName: string;
  originalName: string;
  originalSize?: number;
  createdAt?: string; // Or Firebase Timestamp type
  ai_description: string;
  qa?: QA[];
}
