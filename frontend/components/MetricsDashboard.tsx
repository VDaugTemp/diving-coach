"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useMetrics } from "@/hooks/useMetrics";
import { useRAGStats } from "@/hooks/useRAGStats";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Count-up animation component for numbers
function AnimatedNumber({
  value,
  suffix = "",
  duration = 0.6,
  style,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span style={style}>
      {displayValue.toLocaleString()}
      {suffix && <span style={{ marginLeft: "0.25rem", opacity: 0.7 }}>{suffix}</span>}
    </span>
  );
}


// Animated divider component
function AnimatedDivider({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        margin: "2rem 0",
        transformOrigin: "left",
      }}
    />
  );
}

// Custom tooltip for charts with smooth transitions
const CustomTooltip = ({
  active,
  payload,
  label,
  styles,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  styles: any;
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: styles.surface,
        border: `1px solid ${styles.border}`,
        borderRadius: "8px",
        padding: "12px",
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
      }}
    >
      <p style={{ color: styles.textSecondary, fontSize: "12px", marginBottom: "4px" }}>
        {label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            color: entry.color || styles.text,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </motion.div>
  );
};

export default function MetricsDashboard() {
  const { metrics, loading } = useMetrics();
  const { ragStats, loading: ragLoading } = useRAGStats();
  const styles = useThemeStyles();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update timestamp when metrics change
  useEffect(() => {
    if (metrics && !loading) {
      setLastUpdated(new Date());
    }
  }, [metrics, loading]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Chart animation variants
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Get theme-specific colors for cards
  const getCardColors = (index: number) => {
    const cardColorKeys: Array<keyof typeof styles.cardColors> = [
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
    ];
    return styles.cardColors[cardColorKeys[index % cardColorKeys.length]];
  };

  // Format hour for display (e.g., 14 -> "2:00 PM")
  const formatHour = (hour: number): string => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  // Chart colors based on theme
  const chartColors = {
    line: styles.chartLine,
    bar: styles.chartBar,
  };

  if (loading) {
    return (
      <motion.div
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: styles.surface,
          borderColor: styles.border,
          backdropFilter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p style={{ color: styles.textSecondary }}>Loading metrics...</p>
      </motion.div>
    );
  }

  if (!metrics) {
    return (
      <motion.div
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: styles.surface,
          borderColor: styles.border,
          backdropFilter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p style={{ color: styles.textSecondary }}>No metrics available. Start chatting to see your statistics!</p>
      </motion.div>
    );
  }

  // Handle empty data gracefully
  if (metrics.totalMessages === 0) {
    return (
      <motion.div
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: styles.surface,
          borderColor: styles.border,
          backdropFilter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p style={{ color: styles.textSecondary }}>No messages yet. Start a conversation to see your metrics!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-8 rounded-xl border"
      style={{
        backgroundColor: styles.surface,
        borderColor: styles.border,
        backdropFilter: styles.backdropBlur,
        boxShadow: styles.boxShadow,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with title and timestamp */}
      <div className="flex justify-between items-start mb-8">
        <motion.h2
          className="text-2xl font-bold tracking-tight uppercase gradient-text"
          style={{
            fontFamily: styles.fontFamily,
            letterSpacing: "0.05em",
            fontWeight: 700,
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Metrics Dashboard
        </motion.h2>
        <motion.p
          className="text-xs"
          style={{
            color: styles.textSecondary,
            opacity: 0.7,
            fontFamily: styles.fontFamily,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Last updated: {lastUpdated.toLocaleTimeString()}
        </motion.p>
      </div>

      {/* Summary Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: "Total Messages", value: metrics.totalMessages },
          { label: "Total Sessions", value: metrics.totalSessions },
          { label: "Avg Messages/Session", value: metrics.avgMessagesPerSession },
          { label: "Avg Word Count", value: metrics.avgWordCount },
        ].map((metric, index) => {
          const cardColors = getCardColors(index);
          return (
            <motion.div
              key={metric.label}
              variants={cardVariants}
              className="p-6 rounded-xl border relative overflow-hidden"
              style={{
                backgroundColor: cardColors.bg,
                borderColor: styles.border,
                backdropFilter: "blur(10px)",
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 24px ${cardColors.glow}, 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                transition: { duration: 0.2 },
              }}
            >
              {/* Subtle gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${cardColors.value}, transparent)`,
                  opacity: 0.5,
                }}
              />
              <p
                className="text-sm font-medium mb-2"
                style={{
                  color: styles.textSecondary,
                  letterSpacing: "0.02em",
                }}
              >
                {metric.label}
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color: cardColors.value,
                  fontFamily: styles.fontFamily,
                  lineHeight: 1.2,
                }}
              >
                <AnimatedNumber
                  value={metric.value}
                  duration={0.8}
                />
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity Insights Section */}
      <motion.div
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={cardVariants}
      >
        <div className="p-4 rounded-lg border" style={{ backgroundColor: styles.cardBg, borderColor: styles.border }}>
          <p
            className="text-xs font-medium mb-1"
            style={{
              color: styles.textSecondary,
              letterSpacing: "0.02em",
            }}
          >
            Most Active Day
          </p>
          <motion.p
            className="text-lg font-semibold"
            style={{
              color: styles.text,
              fontFamily: styles.fontFamily,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {metrics.mostActiveDay}
          </motion.p>
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: styles.cardBg, borderColor: styles.border }}>
          <p
            className="text-xs font-medium mb-1"
            style={{
              color: styles.textSecondary,
              letterSpacing: "0.02em",
            }}
          >
            Most Active Hour
          </p>
          <motion.p
            className="text-lg font-semibold"
            style={{
              color: styles.text,
              fontFamily: styles.fontFamily,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {formatHour(metrics.mostActiveHour)}
          </motion.p>
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: styles.cardBg, borderColor: styles.border }}>
          <p
            className="text-xs font-medium mb-1"
            style={{
              color: styles.textSecondary,
              letterSpacing: "0.02em",
            }}
          >
            Avg Session Duration
          </p>
          <motion.p
            className="text-lg font-semibold"
            style={{
              color: styles.text,
              fontFamily: styles.fontFamily,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {metrics.avgSessionDuration.toFixed(1)} min
          </motion.p>
        </div>
      </motion.div>

      {/* Animated Divider */}
      <AnimatedDivider color={styles.border} />

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Messages Over Time Chart */}
        <motion.div
          variants={chartVariants}
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: styles.cardBg,
            borderColor: styles.border,
            backdropFilter: styles.backdropBlur,
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
          }}
          whileHover={{
            y: -4,
            boxShadow: `0 8px 24px ${chartColors.line}40, 0 4px 16px rgba(0, 0, 0, 0.12)`,
            transition: { duration: 0.2 },
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{
              color: styles.text,
              letterSpacing: "0.02em",
              fontFamily: styles.fontFamily,
            }}
          >
            Messages Over Time
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={metrics.messagesOverTime.length > 0 ? metrics.messagesOverTime : [{ date: "No data", count: 0 }]}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={styles.border}
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={styles.textSecondary}
                style={{ fontSize: "11px" }}
                tick={{ fill: styles.textSecondary }}
                axisLine={{ stroke: styles.border, strokeWidth: 0.5 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke={styles.textSecondary}
                style={{ fontSize: "11px" }}
                tick={{ fill: styles.textSecondary }}
                axisLine={{ stroke: styles.border, strokeWidth: 0.5 }}
              />
              <Tooltip
                content={<CustomTooltip styles={styles} />}
                cursor={{ stroke: chartColors.line, strokeWidth: 1, strokeDasharray: "5 5" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={chartColors.line}
                strokeWidth={3}
                dot={{ fill: chartColors.line, r: 4, strokeWidth: 2, stroke: styles.surface }}
                activeDot={{ r: 6, stroke: chartColors.line, strokeWidth: 2 }}
                animationDuration={800}
                animationBegin={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Average Response Length Chart */}
        <motion.div
          variants={chartVariants}
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: styles.cardBg,
            borderColor: styles.border,
            backdropFilter: styles.backdropBlur,
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
          }}
          whileHover={{
            y: -4,
            boxShadow: `0 8px 24px ${chartColors.bar}40, 0 4px 16px rgba(0, 0, 0, 0.12)`,
            transition: { duration: 0.2 },
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{
              color: styles.text,
              letterSpacing: "0.02em",
              fontFamily: styles.fontFamily,
            }}
          >
            Content Statistics
          </h3>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: styles.surface }}>
              <p className="text-xs mb-1" style={{ color: styles.textSecondary }}>Average Word Count (All Messages)</p>
              <p className="text-2xl font-bold" style={{ color: chartColors.bar }}>
                {metrics.avgWordCount} words
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: styles.surface }}>
              <p className="text-xs mb-1" style={{ color: styles.textSecondary }}>Average Response Length (Assistant)</p>
              <p className="text-2xl font-bold" style={{ color: chartColors.bar }}>
                {metrics.avgResponseLength} words
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* RAG System Statistics Section */}
      {ragStats && !ragLoading && (
        <>
          {/* Animated Divider */}
          <AnimatedDivider color={styles.border} />

          {/* RAG Stats Header */}
          <motion.h3
            className="text-xl font-bold tracking-tight uppercase gradient-text mb-6 mt-8"
            style={{
              fontFamily: styles.fontFamily,
              letterSpacing: "0.05em",
              fontWeight: 700,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            RAG System Statistics
          </motion.h3>

          {/* Vector Store & Retrieval Quality Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "Documents in Store", value: ragStats.vector_store.num_documents, suffix: "" },
              { label: "Total Queries", value: ragStats.total_queries, suffix: "" },
              { label: "Avg Relevance Score", value: Math.round(ragStats.avg_relevance_score * 100), suffix: "%" },
              { label: "Avg Docs/Query", value: ragStats.avg_documents_per_query.toFixed(1), suffix: "" },
            ].map((metric, index) => {
              const cardColors = getCardColors(index);
              return (
                <motion.div
                  key={metric.label}
                  variants={cardVariants}
                  className="p-6 rounded-xl border relative overflow-hidden"
                  style={{
                    backgroundColor: cardColors.bg,
                    borderColor: styles.border,
                    backdropFilter: "blur(10px)",
                    boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 8px 24px ${cardColors.glow}, 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                    transition: { duration: 0.2 },
                  }}
                >
                  {/* Subtle gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, transparent, ${cardColors.value}, transparent)`,
                      opacity: 0.5,
                    }}
                  />
                  <p
                    className="text-sm font-medium mb-2"
                    style={{
                      color: styles.textSecondary,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {metric.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{
                      color: cardColors.value,
                      fontFamily: styles.fontFamily,
                      lineHeight: 1.2,
                    }}
                  >
                    {typeof metric.value === 'number' && Number.isInteger(metric.value) ? (
                      <AnimatedNumber
                        value={metric.value}
                        suffix={metric.suffix}
                        duration={0.8}
                      />
                    ) : (
                      <span>{metric.value}{metric.suffix}</span>
                    )}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* RAG Charts Section */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Similarity Method Usage */}
            <motion.div
              variants={chartVariants}
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: styles.cardBg,
                borderColor: styles.border,
                backdropFilter: styles.backdropBlur,
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
              }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 24px ${chartColors.bar}40, 0 4px 16px rgba(0, 0, 0, 0.12)`,
                transition: { duration: 0.2 },
              }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{
                  color: styles.text,
                  letterSpacing: "0.02em",
                  fontFamily: styles.fontFamily,
                }}
              >
                Similarity Method Usage
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Cosine", value: ragStats.similarity_method_usage.cosine },
                      { name: "Euclidean", value: ragStats.similarity_method_usage.euclidean },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill={chartColors.line} />
                    <Cell fill={chartColors.bar} />
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip styles={styles} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Sources */}
            <motion.div
              variants={chartVariants}
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: styles.cardBg,
                borderColor: styles.border,
                backdropFilter: styles.backdropBlur,
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
              }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 24px ${chartColors.bar}40, 0 4px 16px rgba(0, 0, 0, 0.12)`,
                transition: { duration: 0.2 },
              }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{
                  color: styles.text,
                  letterSpacing: "0.02em",
                  fontFamily: styles.fontFamily,
                }}
              >
                Most Retrieved Sources
              </h3>
              {ragStats.top_sources.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={ragStats.top_sources}
                    layout="vertical"
                    margin={{ left: 10, right: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={styles.border}
                      opacity={0.1}
                    />
                    <XAxis
                      type="number"
                      stroke={styles.textSecondary}
                      style={{ fontSize: "11px" }}
                      tick={{ fill: styles.textSecondary }}
                    />
                    <YAxis
                      type="category"
                      dataKey="source"
                      stroke={styles.textSecondary}
                      style={{ fontSize: "10px" }}
                      tick={{ fill: styles.textSecondary }}
                      width={120}
                    />
                    <Tooltip
                      content={<CustomTooltip styles={styles} />}
                      cursor={{ fill: styles.border, opacity: 0.1 }}
                    />
                    <Bar
                      dataKey="count"
                      fill={chartColors.bar}
                      radius={[0, 8, 8, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[240px]">
                  <p style={{ color: styles.textSecondary }}>No source data available yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Vector Store Details */}
          <motion.div
            className="mt-8 p-6 rounded-xl border"
            variants={chartVariants}
            style={{
              backgroundColor: styles.cardBg,
              borderColor: styles.border,
              backdropFilter: styles.backdropBlur,
              boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                color: styles.text,
                letterSpacing: "0.02em",
                fontFamily: styles.fontFamily,
              }}
            >
              Vector Store Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: styles.surface }}>
                <p className="text-xs mb-1" style={{ color: styles.textSecondary }}>
                  Embedding Dimension
                </p>
                <p className="text-2xl font-bold" style={{ color: chartColors.line }}>
                  {ragStats.vector_store.embedding_dimension || "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: styles.surface }}>
                <p className="text-xs mb-1" style={{ color: styles.textSecondary }}>
                  Storage Size
                </p>
                <p className="text-2xl font-bold" style={{ color: chartColors.bar }}>
                  {ragStats.vector_store.total_size_mb} MB
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: styles.surface }}>
                <p className="text-xs mb-1" style={{ color: styles.textSecondary }}>
                  Total Documents Retrieved
                </p>
                <p className="text-2xl font-bold" style={{ color: chartColors.line }}>
                  {ragStats.total_documents_retrieved}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
