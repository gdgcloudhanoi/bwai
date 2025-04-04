// components/AppCheckProvider.tsx
"use client"; // Mark as client component

import { useEffect } from "react";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "@/lib/firebase";

export default function AppCheckProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize App Check only in the browser
    if (typeof window !== "undefined") {
      // Enable debug mode in development
      if (process.env.NODE_ENV !== "production") {
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
          process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN || true;
      }

      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
        ),
        isTokenAutoRefreshEnabled: true, // Automatically refresh token
      });
    }
  }, []);

  return <>{children}</>;
}
