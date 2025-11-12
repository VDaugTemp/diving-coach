"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import MetricsDashboard from "@/components/MetricsDashboard";
import { useThemeStyles } from "@/hooks/useThemeStyles";

export default function MetricsPage() {
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

      <div className="max-w-6xl mx-auto p-6">
        <MetricsDashboard />
      </div>
    </motion.div>
  );
}

