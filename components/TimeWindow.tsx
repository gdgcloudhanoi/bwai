"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeWindowProps {
  startTime: string; // Format: "YYYY-MM-DDTHH:mm:ss"
  endTime: string; // Format: "YYYY-MM-DDTHH:mm:ss"
  timezone: string; // IANA timezone, e.g., "America/New_York"
  children: React.ReactNode;
}

export const TimeWindow: React.FC<TimeWindowProps> = ({
  startTime,
  endTime,
  timezone,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const checkTimeWindow = () => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const currentParts = formatter.formatToParts(now);
      const currentDateTime = new Date(
        `${currentParts.find((p) => p.type === "year")?.value}-${
          currentParts.find((p) => p.type === "month")?.value
        }-${currentParts.find((p) => p.type === "day")?.value}T${
          currentParts.find((p) => p.type === "hour")?.value
        }:${currentParts.find((p) => p.type === "minute")?.value}:${
          currentParts.find((p) => p.type === "second")?.value
        }`
      );

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);

      setIsVisible(
        currentDateTime >= startDateTime && currentDateTime < endDateTime
      );
    } catch (error) {
      console.error("Error checking time window:", error);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    checkTimeWindow();
    const interval = setInterval(checkTimeWindow, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime, timezone]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
