// app/gallery/[name]/page.tsx
import { Metadata } from "next";
import Gallery from "@/components/Gallery"; // Adjust the import path as needed

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const name = resolvedParams.name;

  // Assume a default bucket name or get it from an environment variable
  const bucketName = "gdg-cloud-hanoi";
  const imageUrl = `https://storage.googleapis.com/${bucketName}/${name}`;
  const title = `Build with AI Cloud Hanoi 2025`;
  const description = `View your images in our gallery.`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${name}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Server Component for the gallery page
export default async function GalleryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = resolvedParams.name;

  // Assume a default bucket name or get it from an environment variable
  const bucketName = "gdg-cloud-hanoi";
  const imageUrl = `https://storage.googleapis.com/${bucketName}/${name}`;

  return (
    <>
      {/* Structured Data for Image Gallery (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            name: name,
            contentUrl: imageUrl,
            description: `Gallery image: ${name}`,
          }),
        }}
      />
      <Gallery initialName={name} />
    </>
  );
}