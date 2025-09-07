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
    // Ensure both refs and mount state are ready
    if (!isMounted || !videoRef.current || !playerContainerRef.current) return;
    if (playerRef.current) return; // Avoid re-initialization

    const videoElement = videoRef.current;

    setIsShowingPoster(!autoPlay);

    try {
      // Initialize Video.js on the video element itself
      const player = videojs(videoElement, {
        controls: showControls,
        autoplay: true,
        loop,
        muted,
        fluid: true, // Let Video.js control responsiveness within playerContainerRef
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

      // Add the vjs-show-poster class dynamically based on state
      const updatePosterClass = (show: boolean) => {
        if (player && !player.isDisposed()) {
          if (show && thumbnailSrc) {
            player.addClass("vjs-show-poster");
          } else {
            player.removeClass("vjs-show-poster");
          }
        }
      };

      // Initial poster state class
      updatePosterClass(isShowingPoster);

      player.on("ready", () => {
        console.log("Video.js player ready");
      });

      player.on("play", () => {
        setIsShowingPoster(false);
        updatePosterClass(false); // Update class on play
      });

      player.on("pause", () => {
        // Optional: Show poster on pause? Maybe not typical.
        // If needed, add logic here.
      });

      player.on("ended", () => {
        if (!player.loop()) {
          setIsShowingPoster(true);
          player.poster(thumbnailSrc); // Reset poster image
          player.currentTime(0); // Reset time
          // Don't necessarily pause here, ended state is distinct
          // Ensure the big play button might reappear if needed
          player.addClass("vjs-has-started"); // Keep this to hide overlay initially
          player.removeClass("vjs-playing"); // Ensure play button shows
          updatePosterClass(true); // Update class on end
          // Add class to show big play button again potentially
          player.addClass("vjs-paused");
          // Reset internal 'hasStarted' state if needed for big play button
          // player.hasStarted(false); // Might be needed depending on exact vjs version
        }
      });

      player.on("error", () => {
        console.error("Video.js error:", player.error());
        setIsError(true);
        updatePosterClass(false); // Hide poster on error maybe?
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
  }, [src, thumbnailSrc, autoPlay, loop, muted, isMounted, showControls]); // Removed playerClassName from deps as it's static styling

  // Server-side rendering or before mount: Show a static poster
  if (!isMounted) {
    return (
      <div className={cn("relative w-full", className)}>
        {/* Apply padding/border styling here */}
        <div
          className={cn(
            "relative rounded-md p-2 ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md overflow-hidden", // Added overflow-hidden
            playerClassName // Allow specific styling for this wrapper
          )}
        >
          {/* Simple img for SSR/initial render */}
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            className="w-full h-auto aspect-video object-contain block"
            width={0}
            height={0}
          />
          {/* <img
            src={thumbnailSrc}
            alt={thumbnailAlt}
            className="w-full h-auto aspect-video object-contain block"
          /> */}{" "}
          {/* Ensure block display */}
        </div>
      </div>
    );
  }

  // Client-side rendering
  return (
    // Outermost container for component positioning (e.g., margins, max-width from parent)
    <div
      className={cn("relative w-full video-player-outer-wrapper", className)}
    >
      {/* Container for PADDING, BORDERS, BACKGROUND */}
      <div
        className={cn(
          "relative rounded-md ring-1 ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10 backdrop-blur-md overflow-hidden", // Added overflow-hidden
          playerClassName // Allow specific styling for this wrapper
        )}
      >
        {/* This div becomes the direct container for the Video.js enhanced element */}
        {/* Video.js fluid option will make the .video-js element inside this fill its width */}
        <div ref={playerContainerRef} data-vjs-player>
          {" "}
          {/* Added ref and data-vjs-player */}
          <video
            ref={videoRef}
            // Let Video.js handle sizing via 'fluid:true' and its own classes.
            // Remove w-full, h-auto, aspect-video from here.
            className="video-js vjs-default-skin vjs-big-play-centered"
            playsInline
            preload="auto"
            aria-label={thumbnailAlt}
            // Poster is handled by videojs options and state now
          />
        </div>
        {/* Error overlay, relative to the padded container */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center z-10">
            {" "}
            {/* Darker overlay */}
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
  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
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
    </div>
  );
}
