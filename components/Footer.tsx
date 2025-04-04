"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t mt-8">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Image
            src="/gdg_cloud_hanoi.png"
            alt="Logo"
            width={192}
            height={60}
            className="h-8 object-contain"
          />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
