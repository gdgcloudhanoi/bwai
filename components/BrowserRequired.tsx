"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const BrowserRequired = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations("browserRequired");
  const [showPrompt, setShowPrompt] = useState(false);

  const { isAndroid, isWebView } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isAndroid: false, isWebView: false };
    }
    const ua = navigator.userAgent;
    const isWebViewDetected =
      /wv\)|WebView|FBAV\/|FBAN\/|Instagram|Twitter|LinkedInApp/i.test(ua) ||
      (/iPad|iPhone|iPod/.test(ua) && !/Safari\//i.test(ua)) ||
      (/Android/.test(ua) && !/Chrome\//i.test(ua) && !/Firefox\//i.test(ua));
    return { isAndroid: /android/i.test(ua), isWebView: isWebViewDetected };
  }, []);

  useEffect(() => {
    if (isWebView) {
      setShowPrompt(true);
    }
  }, [isWebView]);

  const handleOpenInBrowser = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!currentUrl) return;
    if (isAndroid) {
      const intentUrl = `intent:${currentUrl}#Intent;action=android.intent.action.VIEW;end`;
      window.location.href = intentUrl;
    } else {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {children}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrompt(false)}>
              {t("continueHere")}
            </Button>
            <Button onClick={handleOpenInBrowser}>{t("openInBrowser")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
