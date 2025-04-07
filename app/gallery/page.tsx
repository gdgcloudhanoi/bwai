"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Link from "next/link";
import { ArrowLeftIcon, ChevronLeftIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link className="flex gap-2 font-semibold" href="/">
            <ChevronLeftIcon />
            Trang chủ
          </Link>
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
        </nav>
      </header>
      <div className="h-18"></div>
      <Gallery />
      <Footer />
    </div>
  );
}
