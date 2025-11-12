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
            About This Project
          </h2>
          <p style={{ color: styles.textSecondary, lineHeight: "1.75" }}>
            This project was built as part of The AI Engineer Challenge — a
            hands-on demonstration of front-end engineering, design systems, and
            intelligent UI integration. It connects to a custom LLM API,
            delivering an interactive chat experience with analytics, presets,
            and personalized themes. The goal: show how a polished, responsive,
            and data-aware interface can make working with AI both fast and
            practical.
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
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Vercel / Render
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
              <span className="text-xl">💬</span>
              <div>
                <strong>Chat Interface with History</strong> – Interactive,
                responsive, and persistent conversations.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">📊</span>
              <div>
                <strong>Metrics Dashboard</strong> – Displays average response
                time, word count, and sentiment trend.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <strong>Preset Prompts</strong> – Quick-start prompts organized
                by category for faster interactions.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">⚙️</span>
              <div>
                <strong>Settings with LocalStorage Persistence</strong> – Saves
                user preferences and session data automatically.
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
            Future Enhancements
          </h2>
          <p style={{ color: styles.textSecondary, marginBottom: "0.75rem" }}>
            Next iterations will include:
          </p>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: styles.textSecondary }}
          >
            <li>Real-time backend metrics with live charts.</li>
            <li>Multi-modal input (voice + text).</li>
            <li>Conversation export (Markdown / PDF).</li>
            <li>User authentication and cloud-based session sync.</li>
          </ul>
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
              href="https://github.com/VDaugTemp/challenge#"
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
