"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Countdown from "./Countdown";

// Fisher-Yates shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Original layout with spans (fixed order)
  const layout = [
    { span: "col-span-5 row-span-2" },
    { span: "col-span-3 row-span-2" },
    { span: "col-span-4 row-span-3" },
    { span: "col-span-3 row-span-2" },
    { span: "col-span-5 row-span-2" },
    { span: "col-span-4 row-span-3" },
    { span: "col-span-4 row-span-2" },
    { span: "col-span-4 row-span-2" },
  ];

  // Image content to shuffle
  const imageContent = [
    { src: "/featured/featured_1.jpg", alt: "Feature 1" },
    { src: "/featured/featured_2.jpg", alt: "Feature 2" },
    { src: "/featured/featured_3.jpg", alt: "Feature 3" },
    { src: "/featured/featured_4.jpg", alt: "Feature 4" },
    { src: "/featured/featured_5.jpg", alt: "Feature 5" },
    { src: "/featured/featured_6.jpg", alt: "Feature 6" },
    { src: "/featured/featured_7.jpg", alt: "Feature 7" },
    { src: "/featured/featured_8.jpg", alt: "Feature 8" },
  ];

  const [shuffledImages, setShuffledImages] = useState(imageContent);

  useEffect(() => {
    const shuffled = shuffleArray(imageContent).slice(0, layout.length);
    setShuffledImages(shuffled);
  }, []);

  return (
    <motion.div className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-20 font-[family-name:var(--font-geist-sans)]">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col gap-6 md:gap-8 items-center lg:items-start text-center lg:text-left"
          variants={itemVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            variants={itemVariants}
          >
            Build with AI Cloud Hanoi 2025
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md"
            variants={itemVariants}
          >
            Learn to build next-gen AI applications at the Build with AI Hanoi
            2025, with expert-led sessions and practical experience.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Countdown
              targetDate="2025-04-05T08:29:59"
              timezone="Asia/Ho_Chi_Minh"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-12 gap-4 h-[400px] sm:h-[500px] md:h-[600px] w-full max-w-2xl mx-auto lg:mx-0"
          variants={itemVariants}
        >
          {layout.map((item, index) => (
            <motion.div
              key={index}
              className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 ${item.span}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                className="dark:invert object-cover scale-125"
                src={shuffledImages[index].src}
                alt={shuffledImages[index].alt}
                fill
                sizes="(max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
                priority={index === 0}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
