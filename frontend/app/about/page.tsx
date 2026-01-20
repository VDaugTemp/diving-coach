"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useThemeStyles } from "@/hooks/useThemeStyles";

export default function AboutPage() {
  const styles = useThemeStyles();

  return (
    <motion.div
      className="min-h-screen"
      style={{ backgroundColor: styles.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <Header />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Intro */}
        <motion.section
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            About Diving Coach
          </h2>
          <p style={{ color: styles.textSecondary, lineHeight: "1.75", marginBottom: "1rem" }}>
            Diving Coach is an AI-powered educational assistant designed to help divers 
            understand the principles, safety considerations, and training structures for 
            both scuba diving and freediving. Built as part of The AI Engineer Challenge, 
            this project demonstrates how intelligent interfaces can support learning in 
            specialized domains.
          </p>
          <p style={{ color: styles.textSecondary, lineHeight: "1.75", fontStyle: "italic" }}>
            <strong>Important:</strong> This tool is for educational purposes only. It does not 
            replace professional diving instruction, medical advice, or certification courses. 
            Always dive with proper training, certification, and a buddy.
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            Tech Stack
          </h2>

          <div className="space-y-4">
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Next.js 14
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Tailwind CSS
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Framer Motion
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Recharts
                </span>
              </div>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Backend / API
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  FastAPI (Python)
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  OpenAI API
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Uvicorn
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Pydantic
                </span>
              </div>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: styles.text }}
              >
                RAG & Knowledge Base
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Vector Search
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  OpenAI Embeddings
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  NumPy
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  AIDA Manuals (PDF)
                </span>
              </div>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Web Scraping & Content
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Trafilatura
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  BeautifulSoup4
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  PyPDF2
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Requests
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Core Features */}
        <motion.section
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            Core Features
          </h2>
          <ul className="space-y-3" style={{ color: styles.textSecondary }}>
            <li className="flex items-start gap-3">
              <span className="text-xl">🧠</span>
              <div>
                <strong>RAG-Powered Responses</strong> – Uses Retrieval Augmented Generation 
                to search official AIDA manuals and web articles, providing contextually relevant, 
                source-cited answers.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🌐</span>
              <div>
                <strong>Hybrid Knowledge Base</strong> – Combines local AIDA training manuals 
                with live web articles (SSI, DeeperBlue) for up-to-date diving information.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🎓</span>
              <div>
                <strong>Adaptive Learning Modes</strong> – Choose between Default, Beginner, 
                or Advanced instructor modes tailored to your skill level.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🔍</span>
              <div>
                <strong>Semantic Search</strong> – Toggle between Cosine and Euclidean 
                similarity measures to see how different algorithms retrieve information.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">📊</span>
              <div>
                <strong>RAG Metrics Dashboard</strong> – Visualize vector embeddings, 
                search performance, and knowledge base statistics in real-time.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">💬</span>
              <div>
                <strong>Interactive Learning</strong> – Persistent chat history lets you 
                build knowledge progressively across sessions.
              </div>
            </li>
          </ul>
        </motion.section>

        {/* Future Enhancements */}
        <motion.section
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            Future: AI Dive Agent 🤖
          </h2>
          <p style={{ color: styles.textSecondary, marginBottom: "1rem", lineHeight: "1.75" }}>
            The next evolution is transforming Diving Coach into an <strong>intelligent dive planning 
            and tracking agent</strong> that goes beyond answering questions to actively helping you 
            plan, log, and optimize your diving experiences.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: styles.text }}
              >
                <span className="text-xl">📍</span>
                Dive Planning Agent
              </h3>
              <ul
                className="list-disc list-inside space-y-1 ml-6"
                style={{ color: styles.textSecondary, fontSize: "0.95rem" }}
              >
                <li>Fetch real-time tide data for dive site recommendations</li>
                <li>Pull weather forecasts and water conditions</li>
                <li>Suggest optimal dive windows based on conditions</li>
                <li>Calculate surface intervals and no-decompression limits</li>
              </ul>
            </div>

            <div>
              <h3
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: styles.text }}
              >
                <span className="text-xl">📖</span>
                Dive Log & Analytics
              </h3>
              <ul
                className="list-disc list-inside space-y-1 ml-6"
                style={{ color: styles.textSecondary, fontSize: "0.95rem" }}
              >
                <li>Track your dive history with depth, time, and conditions</li>
                <li>Analyze progression in skills and breath-hold capacity</li>
                <li>Personalized training recommendations based on your logs</li>
                <li>Visualize diving statistics and achievements</li>
              </ul>
            </div>

            <div>
              <h3
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: styles.text }}
              >
                <span className="text-xl">🌊</span>
                Environmental Integration
              </h3>
              <ul
                className="list-disc list-inside space-y-1 ml-6"
                style={{ color: styles.textSecondary, fontSize: "0.95rem" }}
              >
                <li>Marine life sighting predictions based on season and location</li>
                <li>Water temperature and visibility forecasts</li>
                <li>Current strength and direction advisories</li>
                <li>Local dive site database with community reviews</li>
              </ul>
            </div>

            <div>
              <h3
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: styles.text }}
              >
                <span className="text-xl">🎯</span>
                Smart Training Coach
              </h3>
              <ul
                className="list-disc list-inside space-y-1 ml-6"
                style={{ color: styles.textSecondary, fontSize: "0.95rem" }}
              >
                <li>Adaptive training plans based on your goals and progress</li>
                <li>Breath-hold table generation (CO2 and O2 tables)</li>
                <li>Technique improvement suggestions from dive log analysis</li>
                <li>Integration with certification requirements (AIDA, PADI, SSI)</li>
              </ul>
            </div>
          </div>

          <p 
            style={{ 
              color: styles.textSecondary, 
              marginTop: "1rem", 
              fontStyle: "italic",
              fontSize: "0.9rem" 
            }}
          >
            💡 <strong>Vision:</strong> An AI agent that doesn't just educate, but actively participates 
            in your diving journey—planning dives, tracking progress, and ensuring safety through 
            intelligent, data-driven recommendations.
          </p>
        </motion.section>

        {/* About the Developer */}
        <motion.section
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            About the Developer
          </h2>
          <p
            style={{
              color: styles.textSecondary,
              lineHeight: "1.75",
              marginBottom: "1rem",
            }}
          >
            Built by Victoria, a front-end engineer transitioning into AI
            product engineering.
          </p>
          <p
            style={{
              color: styles.textSecondary,
              lineHeight: "1.75",
              marginBottom: "1rem",
            }}
          >
            She likes turning technical ideas into elegant, usable tools —
            combining logic with storytelling to create products that feel
            alive.
          </p>
          <div className="mt-4 flex gap-4 flex-wrap">
            <motion.a
              href="https://www.linkedin.com/in/victoria-daug-494999a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: styles.primary }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>LinkedIn</span>
              <span>→</span>
            </motion.a>
            <motion.a
              href="https://github.com/VDaugTemp/diving-coach#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: styles.primary }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Code on GitHub</span>
              <span>→</span>
            </motion.a>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
