"use client";
import { useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QA {
  question: string;
  answer: string;
}

interface OptimizedImage {
  id: string;
  optimizedBucket: string;
  optimizedName: string;
  previewName: string;
  originalName: string;
  originalSize?: number;
  createdAt?: string;
  ai_description: string;
  qa?: QA[];
}

export default function Gallery() {
  const [images, setImages] = useState<OptimizedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<OptimizedImage | null>(
    null
  ); // New state for the selected image

  const layout = [
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-2 row-span-2" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-2 row-span-2" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },

    { span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1" },
    { span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
    { span: "col-span-1 row-span-1" },
  ];

  useEffect(() => {
    const imagesQuery = query(
      collection(firestore, "optimized_images"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      imagesQuery,
      (snapshot) => {
        const imagesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as OptimizedImage[];

        // Only update images if no image is selected (modal is closed)
        if (selectedImageIndex === null) {
          setImages(imagesList);
        } else {
          // If an image is selected, update the list but keep the current selected image
          setImages((prevImages) => {
            const currentImage = prevImages[selectedImageIndex];
            const updatedImages = imagesList;
            const currentImageStillExists = updatedImages.some(
              (img) => img.id === currentImage?.id
            );
            if (!currentImageStillExists) {
              // If the current image was deleted, close the modal
              setSelectedImageIndex(null);
              setSelectedImage(null);
            }
            return updatedImages;
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching images:", err);
        setError("Failed to load images");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedImageIndex]);

  // Handle selecting an image
  const handleImageSelect = useCallback(
    (index: number) => {
      setSelectedImageIndex(index);
      setSelectedImage(images[index]); // Store the selected image separately
    },
    [images]
  );

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
    setSelectedImage(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-lg"
        >
          {error}
        </motion.p>
      </div>
    );

  return (
    <div id="gallery" className="w-full">
      <div className="relative container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h3 className="mx-auto mt-4 max-w-xs text-2xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            Thư viện ảnh
          </h3>
        </div>
      </div>
      <AnimatePresence>
        {images.length === 0 ? (
          <></>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`group relative aspect-square overflow-hidden cursor-pointer ${
                  layout[index % layout.length].span
                }`}
                onClick={() => handleImageSelect(index)} // Updated to use new handler
              >
                <Image
                  src={`https://storage.googleapis.com/${image.optimizedBucket}/${image.previewName}`}
                  alt={image.ai_description || image.originalName}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      className="text-justify font-semibold"
                    >
                      {image.ai_description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Custom Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 w-screen h-screen bg-black/90 overflow-y-auto"
            onClick={handleClose}
          >
            <div
              className="flex flex-col w-full min-h-screen sm:flex-row sm:h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="relative w-full sm:w-2/3 sm:h-full bg-black">
                <Image
                  src={`https://storage.googleapis.com/${selectedImage.optimizedBucket}/${selectedImage.optimizedName}`}
                  alt={
                    selectedImage.ai_description || selectedImage.originalName
                  }
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto sm:h-full object-contain"
                  quality={100}
                  blurDataURL={`https://storage.googleapis.com/${selectedImage.optimizedBucket}/${selectedImage.previewName}`}
                  placeholder="blur"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                  onClick={handleClose}
                >
                  <X className="h-6 w-6" />
                </Button>
                {selectedImageIndex !== null && selectedImageIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}
                {selectedImageIndex !== null &&
                  selectedImageIndex < images.length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
              </div>

              {/* Description and Q&A Section */}
              <div className="w-full sm:w-1/3 bg-white p-8 sm:h-full sm:overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Image
                    src="/gdg_cloud_hanoi.png"
                    alt="GDG Cloud Hanoi"
                    width={200}
                    height={200}
                    className="object-cover rounded-lg mb-8"
                  />
                  <div>
                    <p className="text-justify">
                      {selectedImage.ai_description ||
                        "No description available"}
                    </p>
                  </div>
                  <div>
                    {selectedImage.qa && selectedImage.qa.length > 0 ? (
                      <div className="space-y-2">
                        {selectedImage.qa.map((item, index) => (
                          <Accordion key={index} type="single" collapsible>
                            <AccordionItem value={`item-${index}`}>
                              <AccordionTrigger className="text-start">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-justify">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </div>
                    ) : (
                      <p>No Q&A available</p>
                    )}
                    <p className="text-end text-sm text-gray-500 mt-8">
                      được tạo bởi <strong>Gemini 2.0 Flash</strong>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
