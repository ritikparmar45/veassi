# VedaAI Assessment Creator

An AI-powered assessment creator designed for educators. Teachers can seamlessly create assignments, specify question types, and let AI automatically generate a well-structured question paper with varying difficulty levels and structured marking.

## Architecture Overview

**Frontend:**
- **Framework:** Next.js 14 (App Router) + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS (Matching the exact provided Figma designs)
- **Real-time:** Socket.io-client for listening to background generation jobs

**Backend:**
- **Framework:** Node.js + Express (TypeScript)
- **Database:** MongoDB (Mongoose) to store Assignment configurations and the Final Generated Papers.
- **Job Queue:** BullMQ + Redis (Upstash) to offload the heavy AI generation to background workers seamlessly.
- **Real-time:** Socket.io server to broadcast `job-progress`, `job-completed`, and `job-failed` events to the connected frontend client.
- **AI Integration:** Google Gemini APIs (via `@google/genai`) strictly prompted to return structured JSON without markdown wrappers for robust parsing.

## Approach & Flow

1. **User Input:** The teacher submits assignment details (Due Date, Question Types, Counts, and Marks) via the Next.js frontend.
2. **API & Queue:** The backend Express server receives the payload, saves an `Assignment` document (status: `processing`), and adds a job to the BullMQ Redis queue.
3. **Background Worker:** A dedicated BullMQ worker picks up the job, constructs a highly detailed prompt enforcing JSON output representing `Sections` and `Questions`, and calls the Gemini LLM.
4. **WebSocket Updates:** During this process, the backend blasts progress updates through Socket.io directly to the user's browser, replacing the traditional loading spinner with real-time feedback.
5. **Completion & Rendering:** Once the LLM responds, the worker parses the JSON, stores it as a `GeneratedPaper` in MongoDB, updates the assignment status, and notifies the client.
6. **Output Dashboard:** The frontend consumes the structured data and renders a beautiful, A4-styled print-ready Question Paper inspired by the Figma designs, complete with Student Info, Instructions, and Difficulty Badges.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or Atlas)
- Redis connection URL (Upstash recommended)
- Gemini / OpenAI API Key

### Backend Setup
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

### Frontend Setup
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

## Bonus Features Implemented
- **Beautiful Figma Implementation:** Recreated the UI with intense attention to detail including the floating navigation components and empty states.
- **PDF Export Compatibility:** The Output page leverages `window.print()` with hidden UI elements to flawlessly preserve native vector fonts and CSS styling for pixel-perfect PDF rendering (superior to basic HTML2Canvas screenshots).
- **Regenerate Logic:** Built-in endpoint to re-trigger the BullMQ worker if the AI output wasn't satisfactory.
- **Difficulty Tagging:** Fully structured difficulty tracking within the LLM constraints.
