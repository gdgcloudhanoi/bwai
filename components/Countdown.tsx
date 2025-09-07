"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: string; // Format: "YYYY-MM-DDTHH:mm:ss"
  timezone: string; // IANA timezone, e.g., "America/New_York"
}

const Countdown = ({ targetDate, timezone }: CountdownProps) => {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const target = new Date(
      new Date(targetDate).toLocaleString("en-US", { timeZone: timezone })
    );

    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timezone]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  const timeUnits = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center gap-4 sm:gap-6">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-16 sm:w-24 shadow-lg">
              <span className="text-2xl sm:text-3xl font-mono text-white block text-center">
                00
              </span>
            </div>
            <span className="text-gray-400 text-sm sm:text-base mt-2">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6">
      <AnimatePresence>
        {timeUnits.map((unit) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-16 sm:w-24 shadow-lg">
              <motion.span
                key={unit.value}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-2xl sm:text-3xl font-mono text-white block text-center"
              >
                {formatNumber(unit.value)}
              </motion.span>
            </div>
            <span className="text-gray-400 text-sm sm:text-base mt-2">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Countdown;
