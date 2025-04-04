// components/AppCheckProvider.tsx
"use client"; // Mark as client component

import { useEffect } from "react";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { app } from "@/lib/firebase";

export default function AppCheckProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
        ),
        isTokenAutoRefreshEnabled: true,
      });
    }
  }, []);

  return <>{children}</>;
}
