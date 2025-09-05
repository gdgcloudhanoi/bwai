/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Initialize Google Cloud Storage with two buckets
const storage = new Storage();
const secretClient = new SecretManagerServiceClient();

admin.initializeApp();
const db = admin.firestore();

const PUBLIC_BUCKET = "gdg-cloud-hanoi";
const SOURCE_BUCKET = "gdg-cloud-hanoi-dev"; //"gdg-cloud-hanoi.firebasestorage.app";

// Helpers
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Returns true if the provided extension is a supported image type.
 * @param {string} ext
 */
function isImageExtension(ext) {
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Fetch a remote asset using Node 22 global fetch and return a Buffer.
 * @param {string} url
 */
async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch resource: ${url} (${res.status})`);
  }
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

exports.optimizer_dev = onObjectFinalized(
  { bucket: SOURCE_BUCKET, region: "asia-southeast1", cpu: 2, memory: "8GiB", maxInstances: 5 },
  async (event) => {
    try {
      const file = event.data;

      // Define source and destination buckets
      const sourceBucket = storage.bucket(file.bucket);
      const destinationBucket = storage.bucket(PUBLIC_BUCKET);

      const sourceFile = sourceBucket.file(file.name);
      const [metadata] = await sourceFile.getMetadata();

      // Skip if already optimized
      if (
        metadata.metadata?.optimized === "true" ||
        file.name.includes("_optimized")
      ) {
        logger.info("File is already optimized, skipping");
        return;
      }

      // Check if it's an image
      const fileExtension = path.extname(file.name).toLowerCase();
      if (!isImageExtension(fileExtension)) {
        logger.info("File is not an image, skipping");
        return;
      }

      // Create optimized filenames
      const fileNameWithoutExt = path.basename(file.name, fileExtension);
      const optimizedFileName = `${fileNameWithoutExt}_optimized${fileExtension}`;
      const optimizedPreviewFileName = `${fileNameWithoutExt}_preview_optimized${fileExtension}`;
      const optimizedFile = destinationBucket.file(optimizedFileName);
      const optimizedPreviewFile = destinationBucket.file(
        optimizedPreviewFileName
      );

      // Download original file
      const [fileBuffer] = await sourceFile.download();

      // Fetch watermark
      const watermarkUrl =
        `https://storage.googleapis.com/${PUBLIC_BUCKET}/watermark/watermark_cnehn25.png`;
      const watermarkBuffer = await fetchBuffer(watermarkUrl);

      // Get image metadata
      const imageMeta = await sharp(fileBuffer).metadata();

      // Determine if the image is portrait
      const isPortrait = imageMeta.height > imageMeta.width;

      // Calculate dimensions for optimized image
      const maxWidth = isPortrait ? 1200 : 2000; // 1200px for portrait, 2000px for landscape
      let optimizedWidth, optimizedHeight;
      if (isPortrait) {
        optimizedWidth = Math.min(imageMeta.width, maxWidth);
        optimizedHeight = Math.round(
          imageMeta.height * (optimizedWidth / imageMeta.width)
        );
      } else {
        optimizedWidth = Math.min(imageMeta.width, maxWidth);
        optimizedHeight = Math.round(
          imageMeta.height * (optimizedWidth / imageMeta.width)
        );
      }

      // Calculate watermark scale based on orientation
      const watermarkScale = isPortrait ? 0.15 : 0.1;
      const watermarkWidth = Math.round(optimizedWidth * watermarkScale);

      // Resize watermark
      const resizedWatermark = await sharp(watermarkBuffer)
        .resize({
          width: watermarkWidth,
          fit: "contain",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Get watermark metadata
      const watermarkMeta = await sharp(resizedWatermark).metadata();

      // Calculate watermark position with bounds checking
      const paddingPercentage = 0.02;

      // Ensure watermark stays within image bounds
      const maxLeft = optimizedWidth - watermarkMeta.width;
      const maxTop = optimizedHeight - watermarkMeta.height;
      const watermarkLeft = Math.min(
        Math.max(
          0,
          Math.round(
            optimizedWidth * (1 - paddingPercentage) - watermarkMeta.width
          )
        ),
        maxLeft
      );
      const watermarkTop = Math.min(
        Math.max(
          0,
          Math.round(
            optimizedHeight * (1 - paddingPercentage) - watermarkMeta.height
          )
        ),
        maxTop
      );

      // Log dimensions for debugging
      console.log({
        optimizedWidth,
        optimizedHeight,
        watermarkWidth,
        watermarkHeight: watermarkMeta.height,
        watermarkTop,
        watermarkLeft,
        maxLeft,
        maxTop,
        isPortrait,
      });

      // Optimize main image with watermark
      const optimizedBuffer = await sharp(fileBuffer)
        .rotate()
        .resize({
          width: optimizedWidth,
          height: optimizedHeight,
          fit: "inside",
          withoutEnlargement: true,
        })
        .composite([
          {
            input: resizedWatermark,
            top: watermarkTop,
            left: watermarkLeft,
            blend: "over",
          },
        ])
        .toBuffer();

      // Optimize preview image
      const previewMaxDimension = 640;
      let previewWidth, previewHeight;
      if (isPortrait) {
        previewWidth = Math.min(imageMeta.width, previewMaxDimension);
        previewHeight = Math.round(
          imageMeta.height * (previewWidth / imageMeta.width)
        );
      } else {
        previewWidth = Math.min(imageMeta.width, previewMaxDimension);
        previewHeight = Math.round(
          imageMeta.height * (previewWidth / imageMeta.width)
        );
      }

      const optimizedPreviewBuffer = await sharp(fileBuffer)
        .rotate()
        .resize({
          width: previewWidth,
          height: previewHeight,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Upload to destination bucket
      await Promise.all([
        optimizedFile.save(optimizedBuffer, {
          contentType: `image/${fileExtension.slice(1)}`,
          metadata: { optimized: "true" },
        }),
        optimizedPreviewFile.save(optimizedPreviewBuffer, {
          contentType: `image/${fileExtension.slice(1)}`,
          metadata: { optimized: "true" },
        }),
      ]);

      // Write to Firestore
      const docRef = db.collection("optimized_images").doc(fileNameWithoutExt);
      await docRef.set(
        {
          originalName: file.name,
          optimizedName: optimizedFileName,
          previewName: optimizedPreviewFileName,
          originalBucket: file.bucket,
          optimizedBucket: destinationBucket.name,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          originalSize: metadata.size,
          contentType: metadata.contentType,
          status: "completed",
        },
        { merge: true }
      );

      // Access secret for AI API key
      const secretName = "projects/292394080426/secrets/AI_API/versions/latest";
      const [version] = await secretClient.accessSecretVersion({
        name: secretName,
      });
      const apiKey = version.payload.data.toString("utf8");

      // Initialize and use Google Generative AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const mimeType = MIME_TYPES[fileExtension] || "image/jpeg";

      const image = {
        inlineData: {
          data: optimizedPreviewBuffer.toString("base64"),
          mimeType: mimeType,
        },
      };

      // Get description
      let responseText = "";
      try {
        const result = await model.generateContent([
          "Describe the above picture (maximum 50 words) in English.",
          image,
        ]);
        responseText = result.response.text();
      } catch (e) {
        logger.error("AI description generation failed", e);
      }

      // Define generation config for structured JSON response
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
      };

      // Get questions with explicit JSON instruction
      let questions = [];
      try {
        const questionRes = await model.generateContent({
          contents: [
            {
              parts: [
                {
                  text: `Set 10 questions for the picture above and return the result in English in JSON format with the structure: {"questions": ["question 1", "question 2", "question 3"]}`,
                },
                image,
              ],
            },
          ],
          generationConfig,
        });
        const questionsText = questionRes.response.text();
        const questionsData = JSON.parse(questionsText);
        questions = Array.isArray(questionsData.questions)
          ? questionsData.questions
          : [];
      } catch (e) {
        logger.error("AI question generation or parsing failed", e);
      }

      // Get answers for each question
      const qaPairs = await Promise.all(
        questions.map(async (question) => {
          try {
            const answerRes = await model.generateContent([
              `Answer the following question in English based on the picture: "${question}"`,
              image,
            ]);
            return {
              question,
              answer: answerRes.response.text(),
            };
          } catch (e) {
            logger.error("AI answer generation failed", { question, error: e });
            return { question, answer: "" };
          }
        })
      );

      await docRef.set(
        {
          ai_description: responseText,
          qa: qaPairs,
        },
        { merge: true }
      );

      console.log(`Successfully optimized and uploaded: ${optimizedFileName}`);
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }
);
