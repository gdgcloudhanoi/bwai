[Tiếng Việt] | English

## Build with AI — Bộ sưu tập & Trình tối ưu hóa ảnh

Ứng dụng Next.js 15 với thư viện ảnh thời gian thực sử dụng Firebase và một pipeline Cloud Functions tự động có thể:
- Tối ưu ảnh tải lên (Sharp), tạo ảnh xem trước (preview) và đóng dấu watermark
- Xuất bản tài nguyên lên Google Cloud Storage công khai
- Lưu metadata vào Firestore
- Dùng Gemini 2.0 Flash để tự động tạo mô tả tiếng Việt và Hỏi–Đáp cho từng ảnh

### Tính năng
- **Frontend hiện đại**: Next.js App Router, Tailwind CSS, Radix UI, Framer Motion, biểu tượng lucide
- **Thư viện thời gian thực**: cập nhật trực tiếp từ Firestore `optimized_images`
- **Media hiệu năng cao**: Ảnh tối ưu và ảnh preview phục vụ từ Google Cloud Storage
- **Chú thích & Hỏi–Đáp bằng AI**: Tạo bởi Google Generative AI (Gemini) thông qua Secret Manager
- **Liên kết sâu & SEO**: Trang chi tiết `/gallery/[name]` với metadata động và JSON-LD
- **Chia sẻ mạng xã hội**: Chia sẻ nhanh lên Facebook, LinkedIn và X

### Công nghệ
- **Web**: Next.js 15, React 19, Tailwind v4, Radix UI, Framer Motion
- **Media**: `video.js` + HLS cho phát video hero
- **Firebase**: Firestore, Analytics
- **Cloud Functions**: Node.js 22, `firebase-functions@v2`, `sharp`, `@google-cloud/storage`, `@google/generative-ai`, Secret Manager

### Cấu trúc dự án
- `app/` — Trang Next.js App Router và endpoint tạo ảnh OG (`app/og/route.tsx`)
- `components/` — Thành phần UI (gallery, hero video, header/footer, các UI primitives)
- `lib/firebase.ts` — Khởi tạo Firebase cho web
- `functions/` — Mã Cloud Functions (xử lý ảnh + tích hợp AI)

### Cách hoạt động
1. Tải ảnh lên bucket nguồn (`gdg-cloud-hanoi-dev` mặc định).
2. Cloud Function `optimizer_dev` (trigger Storage `onObjectFinalized`) chạy:
   - Bỏ qua tệp không phải ảnh và các tệp đã tối ưu
   - Tạo ảnh tối ưu và ảnh preview (Sharp), thêm watermark
   - Ghi `optimized_images/{docId}` vào Firestore với metadata
   - Gọi Gemini 2.0 Flash để tạo:
     - `ai_description` (tiếng Việt, khoảng tối đa 50 từ)
     - Mảng `qa` gồm các cặp câu hỏi/trả lời tự động
   - Lưu tài nguyên tối ưu vào bucket công khai (`gdg-cloud-hanoi`).
3. Frontend lắng nghe `optimized_images` và hiển thị lưới ảnh + chi tiết theo thời gian thực.

### Yêu cầu
- Node.js: Ứng dụng web chạy với Node 18+, Functions yêu cầu Node 22 (xem `functions/package.json`)
- Firebase CLI: `npm i -g firebase-tools`
- Một dự án Google Cloud có:
  - Hai bucket Storage: nguồn và công khai
  - Bật Secret Manager (để lưu khóa API Gemini)
  - Firestore (chế độ native)

### Biến môi trường (Web, `.env.local`)
Tạo tệp `.env.local` ở thư mục gốc dự án với cấu hình Firebase và URL trang web:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vi-du
```
- `NEXT_PUBLIC_SITE_URL` được dùng cho liên kết chia sẻ và route tạo ảnh OG.

### Cấu hình bucket (Functions)
Giá trị mặc định trong `functions/index.js`:
- `SOURCE_BUCKET = "gdg-cloud-hanoi-dev"`
- `PUBLIC_BUCKET = "gdg-cloud-hanoi"`

Hãy đổi nếu tên bucket của bạn khác. Đảm bảo tài khoản dịch vụ của Functions có quyền đọc `SOURCE_BUCKET` và ghi `PUBLIC_BUCKET`.

### Khóa Gemini API (Secret Manager)
Function đọc khóa Gemini từ Secret Manager:
- Tên bí mật: `projects/<PROJECT_NUMBER>/secrets/AI_API/versions/latest`
- Cập nhật `secretName` trong `functions/index.js` nếu đường dẫn tài nguyên của bạn khác

Có thể tạo secret qua Console hoặc CLI. Ví dụ CLI:
```bash
# Thay bằng project ID của bạn
PROJECT_ID=your-project-id

# Lấy project number
gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)'

# Tạo secret tên AI_API
printf "%s" "YOUR_GEMINI_API_KEY" | gcloud secrets create AI_API \
  --data-file=- --project="$PROJECT_ID"
```
Cấp quyền `Secret Manager Secret Accessor` cho tài khoản chạy Cloud Functions trên secret này.

### Cài đặt & chạy (Web)
```bash
# Tại thư mục gốc dự án
npm install
npm run dev
```
Mở `http://localhost:3000`.

### Triển khai/giả lập Functions
```bash
# Lần đầu: cài đặt phụ thuộc cho functions
cd functions
npm install

# Cách A: Deploy functions lên Firebase
npm run deploy

# Cách B: Chạy emulator (chỉ functions)
npm run serve
```
Ghi chú:
- Script emulator hiện chạy `--only functions`. Hãy bổ sung emulator Storage/Firestore nếu muốn kiểm thử đầy đủ trigger.
- Đảm bảo thông tin xác thực cục bộ của bạn có thể truy cập GCS nếu kiểm thử với bucket thật.

### Script ở thư mục gốc
- `npm run dev` — Máy chủ phát triển Next.js (Turbopack)
- `npm run build` — Build production
- `npm run start` — Chạy ứng dụng đã build
- `npm run lint` — Lint ứng dụng web
- `npm run functions` — Deploy Cloud Functions (shortcut)

### Script trong `functions/`
- `npm run lint` — Lint functions
- `npm run serve` — Emulator functions
- `npm run deploy` — Deploy functions
- `npm run logs` — Theo dõi log

### Route & tệp quan trọng
- Web
  - `app/page.tsx` — Trang chính với hero, FAQ, gallery
  - `app/gallery/[name]/page.tsx` — Deep link tới chi tiết ảnh
  - `app/og/route.tsx` — Tạo ảnh OG dựa trên `NEXT_PUBLIC_SITE_URL`
  - `components/Gallery.tsx` — Lưới ảnh realtime, modal, hành động chia sẻ
  - `lib/firebase.ts` — Khởi tạo Firebase client
- Functions
  - `functions/index.js` — Trigger `optimizer_dev` (Sharp, GCS, Firestore, Gemini)

### Khắc phục sự cố
- **Ảnh không hiển thị**: Kiểm tra `next.config.ts` cho phép `storage.googleapis.com` và đường dẫn tới bucket công khai đúng.
- **Không thấy ảnh trong gallery**: Xác nhận function ghi vào Firestore `optimized_images` và web trỏ cùng project.
- **Lỗi Gemini**: Đảm bảo có secret `AI_API`, service account có quyền truy cập và model `gemini-2.0-flash` khả dụng trong khu vực.
- **Quyền truy cập**: Rà soát IAM cho tài khoản Functions trên Storage và Secret Manager.

### Bảo mật & Chi phí
- Cloud Functions, Storage, Firestore và Generative AI phát sinh chi phí. Hãy đặt quota/budget phù hợp.
- Function đặt `maxInstances: 10` toàn cục và `maxInstances: 5` cho optimizer. Điều chỉnh để kiểm soát chi tiêu.
