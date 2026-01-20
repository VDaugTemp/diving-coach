<p align = "center" draggable="false" ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>

## <h1 align="center" id="heading"> 🤖 AI Chat Application</h1>

<p align="center">
  <strong>A modern, full-stack LLM-powered chat application built with FastAPI and Next.js</strong>
</p>

<p align="center">
  <a href="https://challenge-kzpvc7da8-vdaugs-projects.vercel.app/" target="_blank">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-testing">Testing</a>
</p>

---

## 🎯 Features

This application brings together the power of OpenAI's GPT models with a beautiful, intuitive interface:

- **💬 Streaming Chat Interface** - Real-time streaming responses powered by OpenAI's API
- **🎨 Preset Prompts** - Organized preset prompts across multiple categories (Learning, Games, Creativity, Reflection, Productivity, Tech)
- **📊 Metrics Dashboard** - Visualize your chat metrics with beautiful Recharts visualizations
- **📝 Chat History** - Persistent chat history with session management (stored in localStorage)
- **🎭 Theme Support** - Customizable themes with dark/light mode support
- **⚡ Fast & Modern** - Built with Next.js 16 and FastAPI for optimal performance

## 🌐 Live Demo

**Check out the live application:** [https://diving-coach.vercel.app/](https://diving-coach.vercel.app/)

> 💡 **Pro Tip:** Open the demo in an incognito window to see it as a first-time visitor!

---

## 🚀 Getting Started

### Prerequisites

Before you dive in, make sure you have:

- **Python 3.11+** (automatically managed by `uv`)
- **Node.js 18+** (20.9.0+ recommended for Next.js 16)
- **OpenAI API Key** - Get yours at [platform.openai.com](https://platform.openai.com/)
- **Git** - For cloning the repository
- **npm or yarn** - For managing frontend dependencies

### Backend Setup

The backend is a FastAPI service that handles chat requests and streams responses from OpenAI.

1. **Install `uv` package manager** (if you haven't already):
   ```bash
   pip install uv
   ```
   > `uv` will automatically download and manage Python 3.11 for you on first run!

2. **Install backend dependencies**:
   ```bash
   # From the project root
   uv sync
   ```
   This creates a `.venv/` directory and installs all required packages.

3. **Set your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY=sk-your-api-key-here
   ```
   > On Windows (PowerShell): `$env:OPENAI_API_KEY="sk-your-api-key-here"`

4. **Start the backend server**:
   ```bash
   # Development mode with auto-reload
   uv run uvicorn api.app:app --reload
   
   # Or run directly
   uv run python api/app.py
   ```

   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs` (Swagger UI)
   - Health check: `http://localhost:8000/api/health`

> 📚 For more backend details, check out [`api/README.md`](api/README.md)

### Frontend Setup

The frontend is a Next.js application with a modern, responsive UI.

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (optional):
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   > If you don't create this file, it defaults to `http://localhost:8000`

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`

> 📚 For more frontend details, check out [`frontend/README.md`](frontend/README.md)

---

## 🧪 Testing

### Running Frontend Tests

The frontend includes a comprehensive test suite using Jest and React Testing Library.

1. **Run all tests**:
   ```bash
   cd frontend
   npm test
   # or
   yarn test
   ```

2. **Run tests in watch mode** (great for development):
   ```bash
   npm run test:watch
   # or
   yarn test:watch
   ```

3. **Generate test coverage report**:
   ```bash
   npm run test:coverage
   # or
   yarn test:coverage
   ```

### Test Coverage

The test suite includes tests for:
- `ChatInterface` - Main chat UI component
- `Header` - Application header
- `MetricsDashboard` - Metrics visualization
- `PresetSelector` - Preset prompt selector
- `ThemeToggle` - Theme switching functionality

### Backend Testing

The backend API can be tested using:

1. **Interactive API Documentation**:
   - Visit `http://localhost:8000/docs` when the server is running
   - Use the Swagger UI to test endpoints interactively

2. **Health Check**:
   ```bash
   curl http://localhost:8000/api/health
   ```

3. **Manual Chat Test**:
   ```bash
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "developer_message": "You are a helpful assistant.",
       "user_message": "Hello!",
       "model": "gpt-4.1-mini"
     }'
   ```

---

## 📁 Project Structure

```
challenge/
├── api/                    # FastAPI backend
│   ├── app.py             # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Main chat page
│   │   ├── settings/      # Settings page
│   │   ├── metrics/       # Metrics dashboard page
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ChatInterface.tsx
│   │   ├── PresetSelector.tsx
│   │   ├── MetricsDashboard.tsx
│   │   └── __tests__/     # Component tests
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   └── package.json       # Frontend dependencies
├── docs/                  # Additional documentation
└── README.md              # This file!
```

---

## 🚀 Deployment

This application is deployed on Vercel. The deployment configuration is handled by:

- `vercel.json` - Root-level Vercel configuration
- `api/vercel.json` - API-specific configuration

### Environment Variables for Deployment

Make sure to set the following environment variables in your Vercel project:

- `OPENAI_API_KEY` - Your OpenAI API key

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **OpenAI Python SDK** - Official OpenAI API client
- **uv** - Fast Python package manager
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Chakra UI** - Component library
- **Recharts** - Charting library for metrics
- **Framer Motion** - Animation library
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities

---

## 📚 Additional Resources

- [Backend Documentation](api/README.md) - Detailed backend setup and API documentation
- [Frontend Documentation](frontend/README.md) - Frontend architecture and features
- [Git Setup Guide](docs/GIT_SETUP.md) - Help with git configuration (for beginners)

---

## 🤝 Contributing

This is a learning project, but if you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

See the [LICENSE](LICENSE) file for details.

---

## 🎉 Acknowledgments

Built as part of the AI Engineer Challenge. Special thanks to the AI Makerspace community for inspiration and support!

---

<p align="center">
  Made with ❤️ and lots of ☕
</p>
