"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScroll } from "@/components/ScrollContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header = ({
  navItems = [
    { id: "home", nameKey: "home", url: "/" },
    { id: "gallery", nameKey: "gallery", url: "/gallery" },
  ],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollToSection } = useScroll();
  const router = useRouter();
  const t = useTranslations();

  const handleScroll = (id: string, url?: string) => {
    if (url) {
      router.push(url); // Navigate to the URL if it exists
    } else {
      scrollToSection(id); // Scroll to section if no URL
    }
    setIsMobileMenuOpen(false);
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 shadow-md ${!isMobileMenuOpen ? "bg-background/60 backdrop-blur" : "bg-white"}`}>
      <nav className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Image
            src="/gdg_cloud_hanoi.png"
            alt="Logo"
            width={192}
            height={60}
            className="h-8 object-contain"
          />
        </motion.div>

        
        <motion.div
          className="hidden md:flex items-center space-x-6"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => handleScroll(item.id, item.url)}
              >
                {item.nameKey ? t(item.nameKey) : item.nameKey}
              </Button>
            </motion.div>
          ))}
          <LanguageSwitcher />
        </motion.div>

        
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </nav>

      
      <motion.div
        className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md overflow-hidden"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full text-left text-gray-700 hover:text-blue-600"
              onClick={() => handleScroll(item.id, item.url)}
            >
              {item.nameKey ? t(item.nameKey) : item.nameKey}
            </Button>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
