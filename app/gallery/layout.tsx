import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ""),
  title: "Gallery | Build with AI Cloud Hanoi 2025",
  description: "By GDG Cloud Hanoi",
  keywords: ["Gallery", "AI", "Cloud", "GDG", "Hanoi", "Google"],
  openGraph: {
    title: "Gallery | Build with AI Cloud Hanoi 2025",
    description: "By GDG Cloud Hanoi",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}gallery`,
    siteName: "Build with AI Cloud Hanoi 2025",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
