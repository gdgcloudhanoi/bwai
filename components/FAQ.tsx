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

const ease = [0.16, 1, 0.3, 1];

export default function FAQ() {
  return (
    <section id="faq">
      <div className="bg-zinc-50">
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            <h3 className="mx-auto mt-4 max-w-xs text-2xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              Hỏi đáp
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
                  Làm sao để nhận Google Cloud credit?
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        Truy cập vào đường liên kết trygcp.dev để nhận credit{" "}
                        <strong>
                          (BTC sẽ cung cấp đường dẫn cụ thể trong sự kiện)
                        </strong>
                        .
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Đăng nhập vào tài khoản Google của bạn sau đó chọn{" "}
                        <strong className="font-bold">
                          CLICK HERE TO ACCESS YOUR CREDIT
                        </strong>
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Chấp nhận điều khoản và điều kiện sau đó nhấn tiếp tục
                        là hoàn tất.
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Bạn có thể kiểm tra credit của mình bằng cách vào trang{" "}
                        <strong className="font-bold">Billing</strong>
                        {" > "}
                        <strong className="font-bold">
                          Credits
                        </strong> trong{" "}
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
                        // hlsSrc="/videos/credit/playlist.m3u8"
                        thumbnailSrc="/mockups/preview_1.jpg"
                        thumbnailAlt="Hero Video"
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
                  Làm sao để tạo API Key trong Google AI Studio?
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        Truy cập{" "}
                        <a
                          style={{ fontWeight: "bold" }}
                          href="https://aistudio.google.com/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google AI Studio
                        </a>
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Chọn{" "}
                        <strong className="font-bold">Create API key</strong>.
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Chọn Google Cloud Project (hoặc tạo mới nếu chưa có).
                        Sau đó nhấn Create.
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Lưu lại API key để sử dụng trong các bài lab.
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
                            alt="Google AI Studio"
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
                  Làm sao cài API Key trong Google Colab Notebook?
                </AccordionTrigger>
                <AccordionContent className="text-justify px-4">
                  <div>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-800">
                      <li className="hover:text-zinc-900 transition-colors">
                        Chọn mục Secret (hình chìa khoá) trong Google Colab.
                      </li>
                      <li className="hover:text-zinc-900 transition-colors">
                        Enable biến cần dùng và điền giá trị cho biến đó.
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
                            alt="Notebook"
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
            Bạn còn câu hỏi? Hãy liên hệ BTC qua email{" "}
            <a href="mailto:hello@gdgcloudhanoi.dev" className="underline">
              hello@gdgcloudhanoi.dev
            </a>{" "}
            hoặc kênh{" "}
            <a href="https://t.me/GDGCloudHanoi/1" className="underline">
              Telegram
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}
