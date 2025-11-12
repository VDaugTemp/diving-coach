"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useMetrics } from "@/hooks/useMetrics";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

// Sentiment icon component with animation
function SentimentIcon({ trend }: { trend: "positive" | "neutral" | "negative" }) {
  const iconMap = {
    positive: "↑",
    neutral: "→",
    negative: "↓",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      style={{ display: "inline-block", marginLeft: "0.5rem" }}
    >
      {iconMap[trend]}
    </motion.span>
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

  const sentimentColor =
    metrics?.sentimentTrend === "positive"
      ? styles.chartBar
      : metrics?.sentimentTrend === "negative"
      ? "#ef4444"
      : styles.textSecondary;

  // Mock time series data for charts
  const timeSeriesData = useMemo(() => {
    if (!metrics) return [];
    return [
      { time: "Mon", responseTime: metrics.avgResponseTime, wordCount: metrics.avgWordCount },
      { time: "Tue", responseTime: metrics.avgResponseTime + 100, wordCount: metrics.avgWordCount + 10 },
      { time: "Wed", responseTime: metrics.avgResponseTime - 50, wordCount: metrics.avgWordCount - 5 },
      { time: "Thu", responseTime: metrics.avgResponseTime + 200, wordCount: metrics.avgWordCount + 20 },
      { time: "Fri", responseTime: metrics.avgResponseTime, wordCount: metrics.avgWordCount },
    ];
  }, [metrics]);

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
        <p style={{ color: styles.textSecondary }}>No metrics available</p>
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
          { label: "Avg Response Time", value: metrics.avgResponseTime, suffix: "ms" },
          { label: "Avg Word Count", value: metrics.avgWordCount },
          { label: "Total Messages", value: metrics.totalMessages },
          { label: "Total Sessions", value: metrics.totalSessions },
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
                  suffix={metric.suffix}
                  duration={0.8}
                />
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Sentiment Trend Section */}
      <motion.div
        className="mb-8"
        variants={cardVariants}
      >
        <div className="flex items-center">
          <p
            className="text-sm font-medium mb-1"
            style={{
              color: styles.textSecondary,
              letterSpacing: "0.02em",
            }}
          >
            Sentiment Trend
          </p>
        </div>
        <div className="flex items-center">
          <motion.p
            className="text-xl font-semibold capitalize"
            style={{
              color: sentimentColor,
              fontFamily: styles.fontFamily,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {metrics.sentimentTrend}
          </motion.p>
          <SentimentIcon trend={metrics.sentimentTrend} />
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
        {/* Response Time Chart */}
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
            Response Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={styles.border}
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke={styles.textSecondary}
                style={{ fontSize: "11px" }}
                tick={{ fill: styles.textSecondary }}
                axisLine={{ stroke: styles.border, strokeWidth: 0.5 }}
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
                dataKey="responseTime"
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

        {/* Word Count Chart */}
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
            Word Count Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={styles.border}
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke={styles.textSecondary}
                style={{ fontSize: "11px" }}
                tick={{ fill: styles.textSecondary }}
                axisLine={{ stroke: styles.border, strokeWidth: 0.5 }}
              />
              <YAxis
                stroke={styles.textSecondary}
                style={{ fontSize: "11px" }}
                tick={{ fill: styles.textSecondary }}
                axisLine={{ stroke: styles.border, strokeWidth: 0.5 }}
              />
              <Tooltip
                content={<CustomTooltip styles={styles} />}
                cursor={{ fill: chartColors.bar + "20" }}
              />
              <Bar
                dataKey="wordCount"
                fill={chartColors.bar}
                radius={[8, 8, 0, 0]}
                animationDuration={800}
                animationBegin={0}
              >
                {timeSeriesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors.bar}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
