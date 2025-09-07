"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoPlayer from "./Video";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ease = [0.16, 1, 0.3, 1];

export default function FAQ() {
  const t = useTranslations();
  return (
    <section id="faq">
      <div className="bg-zinc-50">
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            <h3 className="mx-auto mt-4 max-w-xs text-2xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              {t("faqSection.title")}
            </h3>
          </div>
          <div className="mx-auto my-12 md:max-w-[800px]">
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col items-center justify-center space-y-4"
            >
              <AccordionItem
                key={1}
                value="item-1"
                className="w-full border rounded-lg bg-white"
              >
                <AccordionTrigger className="text-start px-4">
                  {t("faqSection.q1.title")}
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q1.step1")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q1.step2")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q1.step3")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q1.step4.prefix")} <strong className="font-bold">Billing</strong>
                        {" > "}
                        <strong className="font-bold">Credits</strong> {t("faqSection.q1.step4.suffix")} {" "}
                        <a
                          href="https://console.cloud.google.com/"
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google Cloud Console
                        </a>
                        .
                      </li>
                    </ul>
                    <motion.div
                      className="relative mx-auto flex w-full items-center justify-center mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1, ease }}
                    >
                      <VideoPlayer
                        hlsSrc="https://storage.googleapis.com/gdg-cloud-hanoi/videos/how-to-get-gcp-credit-bwaic-2025/playlist.m3u8"
                        thumbnailSrc="/preview.jpg"
                        thumbnailAlt={t("faqSection.q1.videoAlt")}
                        className="border rounded-lg shadow-lg max-w-screen-lg"
                      />
                    </motion.div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                key={2}
                value="item-2"
                className="w-full border rounded-lg bg-white"
              >
                <AccordionTrigger className="text-start px-4">
                  {t("faqSection.q2.title")}
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q2.step1")}{" "}
                        <a
                          style={{ fontWeight: "bold" }}
                          href="https://aistudio.google.com/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("faqSection.q2.googleAiStudio")}
                        </a>
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q2.step2")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q2.step3")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q2.step4")}
                      </li>
                    </ul>
                    <motion.div
                      className="relative mx-auto flex w-full items-center justify-center mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1, ease }}
                    >
                      <div
                        className={cn(
                          "relative w-full",
                          "border rounded-lg shadow-lg max-w-screen-lg"
                        )}
                      >
                        <div className="relative rounded-md p-2 ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md">
                          <Image
                            src="/ai_studio.jpg"
                            alt={t("faqSection.q2.imageAlt")}
                            className="rounded-lg"
                            width={1280}
                            height={720}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                key={3}
                value="item-3"
                className="w-full border rounded-lg bg-white"
              >
                <AccordionTrigger className="text-start px-4">
                  {t("faqSection.q3.title")}
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q3.step1")}
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        {t("faqSection.q3.step2")}
                      </li>
                    </ul>
                    <motion.div
                      className="relative mx-auto flex w-full items-center justify-center mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1, ease }}
                    >
                      <div
                        className={cn(
                          "relative w-full",
                          "border rounded-lg shadow-lg max-w-screen-lg"
                        )}
                      >
                        <div className="relative rounded-md p-2 ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md">
                          <Image
                            src="/notebook.jpg"
                            alt={t("faqSection.q3.imageAlt")}
                            className="rounded-lg"
                            width={1280}
                            height={720}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            {t("faqSection.contact.prefix")} {" "}
            <a href="mailto:hello@gdgcloudhanoi.dev" className="underline">
              hello@gdgcloudhanoi.dev
            </a>{" "}
            {t("faqSection.contact.or")} {" "}
            <a href="https://t.me/GDGCloudHanoi/1" className="underline">
              {t("faqSection.contact.telegram")}
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}
