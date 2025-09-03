English | [Tiếng Việt](README-vi.md)

## Build with AI — Gallery & Image Optimizer

A Next.js 15 app with a real-time gallery powered by Firebase and an automated Cloud Functions pipeline that:
- Optimizes uploaded images (Sharp), generates previews, and applies a watermark
- Publishes assets to a public Google Cloud Storage bucket
- Stores metadata in Firestore
- Uses Gemini 2.0 Flash to auto-generate Vietnamese descriptions and Q&A for each image

### Features
- **Modern frontend**: Next.js App Router, Tailwind CSS, Radix UI, Framer Motion, lucide icons
- **Realtime gallery**: Live updates from Firestore `optimized_images`
- **High-perf media**: Optimized and preview variants served from Google Cloud Storage
- **AI captions & Q&A**: Generated via Google Generative AI (Gemini) using Secret Manager
- **Deep links & SEO**: `/gallery/[name]` detail page with dynamic metadata and JSON-LD
- **Social share**: One-click share to Facebook, LinkedIn, and X

### Tech Stack
- **Web**: Next.js 15, React 19, Tailwind v4, Radix UI, Framer Motion
- **Media**: `video.js` + HLS for hero video playback
- **Firebase**: Firestore, Analytics
- **Cloud Functions**: Node.js 22, `firebase-functions@v2`, `sharp`, `@google-cloud/storage`, `@google/generative-ai`, Secret Manager

### Monorepo Layout
- `app/` — Next.js App Router pages, routes, and OG image endpoint (`app/og/route.tsx`)
- `components/` — UI components (gallery, hero video, header/footer, UI primitives)
- `lib/firebase.ts` — Firebase client initialization for web
- `functions/` — Cloud Functions source (image processing + AI integration)

### How It Works
1. Upload an image to the source bucket (`gdg-cloud-hanoi-dev` by default).
2. `optimizer_dev` Cloud Function (Storage `onObjectFinalized`) triggers:
   - Skips non-image files and already-optimized uploads
   - Creates an optimized image and a preview (Sharp), adds a watermark
   - Writes `optimized_images/{docId}` in Firestore with metadata
   - Calls Gemini 2.0 Flash to generate:
     - `ai_description` (Vietnamese, up to ~50 words)
     - `qa` array with auto-generated question/answer pairs
   - Saves optimized assets to the public bucket (`gdg-cloud-hanoi`).
3. The frontend listens to `optimized_images` and renders the grid and detail modal in real time.

### Prerequisites
- Node.js: Web app works with Node 18+, Functions require Node 22 (see `functions/package.json`)
- Firebase CLI: `npm i -g firebase-tools`
- A Google Cloud project with:
  - Two Storage buckets: source and public
  - Secret Manager enabled (for Gemini API key)
  - Firestore (in native mode)

### Environment Variables (Web, `.env.local`)
Create `.env.local` in the project root with your Firebase config and site URL.
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```
- `NEXT_PUBLIC_SITE_URL` is used for social share links and the OG image route.

### Bucket Configuration (Functions)
Defaults are defined in `functions/index.js`:
- `SOURCE_BUCKET = "gdg-cloud-hanoi-dev"`
- `PUBLIC_BUCKET = "gdg-cloud-hanoi"`

Change these if your bucket names differ. Ensure the Functions service account has read on `SOURCE_BUCKET` and write on `PUBLIC_BUCKET`.

### Gemini API Key (Secret Manager)
The function reads the Gemini API key from Secret Manager:
- Secret name: `projects/<PROJECT_NUMBER>/secrets/AI_API/versions/latest`
- Update the `secretName` in `functions/index.js` if your resource path differs

You can create the secret via the console or CLI. Example CLI:
```bash
# Replace with your project ID
PROJECT_ID=your-project-id

# Get project number
gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)'

# Create a secret named AI_API
printf "%s" "YOUR_GEMINI_API_KEY" | gcloud secrets create AI_API \
  --data-file=- --project="$PROJECT_ID"
```
Grant the Cloud Functions runtime service account `Secret Manager Secret Accessor` on this secret.

### Install & Run (Web)
```bash
# In project root
npm install
npm run dev
```
Open `http://localhost:3000`.

### Deploy/Emulate Functions
```bash
# One-time: install deps for functions
cd functions
npm install

# Option A: Deploy functions to Firebase
npm run deploy

# Option B: Run local emulators (functions only)
npm run serve
```
Notes:
- The provided emulator script runs `--only functions`. Add Storage/Firestore emulators if you want to test end-to-end triggers locally.
- Ensure your local credentials can access GCS if you test against real buckets.

### Root Scripts
- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start built app
- `npm run lint` — Lint web app
- `npm run functions` — Deploy Cloud Functions only (shortcut)

### Functions Scripts (`functions/`)
- `npm run lint` — Lint functions
- `npm run serve` — Start functions emulator
- `npm run deploy` — Deploy functions only
- `npm run logs` — Tail function logs

### Key Routes & Files
- Web
  - `app/page.tsx` — Landing page with hero, FAQ, gallery
  - `app/gallery/[name]/page.tsx` — Deep link to an image detail
  - `app/og/route.tsx` — OG image generator using `NEXT_PUBLIC_SITE_URL`
  - `components/Gallery.tsx` — Realtime grid, modal, and share actions
  - `lib/firebase.ts` — Firebase client initialization
- Functions
  - `functions/index.js` — `optimizer_dev` Storage trigger (Sharp, GCS, Firestore, Gemini)

### Troubleshooting
- **Images not loading**: Verify `next.config.ts` allows `storage.googleapis.com` and your public bucket paths are correct.
- **No gallery items**: Confirm the function is writing to Firestore `optimized_images` and your web app is pointed at the same project.
- **Gemini errors**: Ensure the `AI_API` secret exists, the service account can access it, and the model `gemini-2.0-flash` is available in your region.
- **Permissions**: Check IAM for Functions service account on Storage and Secret Manager.

### Security & Costs
- Cloud Functions, Storage, Firestore, and Generative AI incur costs. Set appropriate quotas and budgets.
- The function sets `maxInstances: 10` globally and `maxInstances: 5` for the optimizer. Adjust to control spend.
