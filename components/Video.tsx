"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
type VideoJsPlayer = ReturnType<typeof videojs>;

interface HeroVideoProps {
  hlsSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export default function VideoPlayer({
  hlsSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  autoPlay = true,
  loop = true,
  muted = true,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !videoRef.current || !containerRef.current) return;
    if (playerRef.current) return;

    const videoElement = videoRef.current;

    try {
      const player = videojs(videoElement, {
        controls: false,
        autoplay: autoPlay,
        loop,
        muted,
        fluid: true,
        sources: [
          {
            src: hlsSrc,
            type: "application/x-mpegURL",
          },
        ],
        poster: thumbnailSrc,
        html5: {
          vhs: {
            overrideNative: true,
            withCredentials: false,
          },
        },
        errorDisplay: false,
      });

      playerRef.current = player;

      player.on("ready", () => {
        console.log("Video.js HLS player ready");
      });

      player.on("error", () => {
        console.error("Video.js error:", player.error());
        setIsError(true);
      });
    } catch (error) {
      console.error("Video.js initialization failed:", error);
      setIsError(true);
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [hlsSrc, thumbnailSrc, autoPlay, loop, muted, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative rounded-md p-2 ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          playsInline
          preload="auto"
          aria-label={thumbnailAlt}
        />
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-white">
            Video failed to load
          </div>
        )}
      </div>
    </div>
  );
}
