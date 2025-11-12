# Frontend - AI Chat Application

A Next.js-based chat application with preset prompts, metrics dashboard, and chat history persistence.

## Features

- **Preset Prompts**: Organized by categories (Learning, Games, Creativity, Reflection, Productivity, Tech)
- **Chat History**: Persisted in localStorage with session management
- **Metrics Dashboard**: Mock metrics displayed with Recharts visualizations
- **Settings Page**: Clear history and reset presets functionality

## Getting Started

### Prerequisites

- Node.js 18+ (20.9.0+ recommended for Next.js 16)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
Create a `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main chat page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ChatInterface.tsx  # Main chat UI
│   ├── PresetSelector.tsx # Preset prompt selector
│   └── MetricsDashboard.tsx # Metrics visualization
├── hooks/                 # Custom React hooks
│   ├── useChatHistory.ts  # Chat history management
│   ├── usePresets.ts      # Preset prompts management
│   └── useMetrics.ts      # Metrics data (mock)
├── data/                  # Static data
│   └── presets.ts         # Default preset prompts
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── utils/                 # Utility functions
    └── api.ts             # API client functions
```

## Backend Integration

The frontend expects a FastAPI backend running on `http://localhost:8000` (or the URL specified in `NEXT_PUBLIC_API_URL`).

The backend should have:
- `POST /api/chat` - Streaming chat endpoint
- `GET /api/health` - Health check endpoint

## Notes

- API keys are managed on the backend via environment variables
- Chat history is persisted in localStorage
- Preset prompts can be customized and reset to defaults
- Metrics use mock data and can be easily replaced with real API calls
