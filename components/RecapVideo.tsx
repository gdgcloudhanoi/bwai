"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";

import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import "videojs-hls-quality-selector";
import Image from "next/image";

type VideoJsPlayer = ReturnType<typeof videojs>;

interface VideoPlayerProps {
  src: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
  playerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
}

function VideoPlayer({
  src,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  playerClassName,
  autoPlay = true,
  loop = false,
  muted = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isShowingPoster, setIsShowingPoster] = useState(true);

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
    if (!isMounted || !videoRef.current || !playerContainerRef.current) return;
    if (playerRef.current) return; // Avoid re-initialization

    const videoElement = videoRef.current;

    setIsShowingPoster(!autoPlay);

    try {
      const player = videojs(videoElement, {
        controls: showControls,
        autoplay: true,
        loop,
        muted,
        fluid: true,
        sources: [
          {
            src: src,
            type: "application/dash+xml",
          },
        ],
        poster: thumbnailSrc,
        html5: {
          vhs: {
            overrideNative: true,
            withCredentials: false,
            enableLowInitialPlaylist: true,
          },
        },
        plugins: {
          hlsQualitySelector: {
            displayCurrentQuality: true,
          },
        },
        errorDisplay: false,
      });

      playerRef.current = player;

      const updatePosterClass = (show: boolean) => {
        if (player && !player.isDisposed()) {
          if (show && thumbnailSrc) {
            player.addClass("vjs-show-poster");
          } else {
            player.removeClass("vjs-show-poster");
          }
        }
      };
      updatePosterClass(isShowingPoster);

      player.on("ready", () => {
        console.log("Video.js player ready");
      });

      player.on("play", () => {
        setIsShowingPoster(false);
        updatePosterClass(false);
      });


      player.on("ended", () => {
        if (!player.loop()) {
          setIsShowingPoster(true);
          player.poster(thumbnailSrc);
          player.currentTime(0);
          player.addClass("vjs-has-started");
          player.removeClass("vjs-playing");
          updatePosterClass(true);
          player.addClass("vjs-paused");
        }
      });

      player.on("error", () => {
        console.error("Video.js error:", player.error());
        setIsError(true);
        updatePosterClass(false);
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
  }, [src, thumbnailSrc, autoPlay, loop, muted, isMounted, showControls]);

  if (!isMounted) {
    return (
      <div className={cn("relative w-full", className)}>
        <div
          className={cn(
            "relative rounded-md p-2 ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md overflow-hidden",
            playerClassName
          )}
        >
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            className="w-full h-auto aspect-video object-contain block"
            width={0}
            height={0}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full video-player-outer-wrapper", className)}
    >
      <div
        className={cn(
          "relative rounded-md ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md overflow-hidden",
          playerClassName
        )}
      >
        <div ref={playerContainerRef} data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            playsInline
            preload="auto"
            aria-label={thumbnailAlt}
          />
        </div>
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center z-10">
            Video failed to load.
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecapVideo() {
  return (
    <VideoPlayer
      src="https://storage.googleapis.com/gdg-cloud-hanoi/videos/recap/manifest.mpd"
      thumbnailSrc="/preview.jpg"
      thumbnailAlt="Recap video"
      className="max-w-screen-lg w-full shadow-lg"
      playerClassName="border border-transparent rounded-lg"
      showControls={true}
      autoPlay={true}
      muted={false}
      loop={true}
    />
  );
}
