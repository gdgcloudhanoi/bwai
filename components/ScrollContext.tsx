"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ScrollContextType {
  scrollToSection: (id: string) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollToSection: () => {},
});

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isMounted) return;
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Force a slight delay to ensure mobile browsers adjust
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollToSection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};