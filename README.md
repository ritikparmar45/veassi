# VedaAI Assessment Creator

An AI-powered assessment creator designed for educators. Teachers can seamlessly create assignments, specify question types, and let AI automatically generate a well-structured question paper with varying difficulty levels and structured marking.

ARCHITECTURE

- **Frontend:** Next.js 14, TypeScript, Zustand, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express, MongoDB (Mongoose), BullMQ, Redis.
- **AI & Services:** Google Gemini API, Nodemailer (OTP Recovery), Socket.io.
- **Security:** JWT Auth with owner-only access middleware.

HOW IT WORKS

1. **Dashboard:** Users land on `/` and log in to access the `/dashboard`.
2. **Creation:** Teachers create assignments with a Subject and Class name.
3. **Generation:** Backend uses Gemini AI to generate structured question papers in the background.
4. **Security:** Users can only access assignments they created.
5. **Recovery:** Secure email-based OTP system for password reset.
6. **Output:** Final papers are optimized for A4 PDF printing.

SETUP INSTRUCTIONS

Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or Atlas)
- Redis connection URL (Upstash recommended)
- Gemini / OpenAI API Key

Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (if provided) and fill in your keys:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

FEATURES
- **Beautiful Figma Implementation:** Recreated the UI with intense attention to detail including floating navigation and professional empty states.
- **Forgot Password (OTP):** Secure account recovery via 6-digit email OTP using Nodemailer.
- **Ownership Security:** Middleware-level protection preventing unauthorized users from accessing other teachers' data.
- **Assignment Customization:** Teachers can now specify custom **Subject** and **Class** names directly in the creation form for a personalized paper header.
- **PDF Export Compatibility:** Flawless pixel-perfect PDF rendering using CSS print-media queries.
- **Regenerate Logic:** Built-in endpoint to re-trigger the BullMQ worker for updated AI output.
- **Difficulty Tagging:** Structured tracking of Easy, Moderate, and Challenging questions.

