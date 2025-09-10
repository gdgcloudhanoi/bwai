import { Metadata } from "next";
import Gallery from "@/components/Gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const name = resolvedParams.name;
  const imageUrl = `${process.env.IMAGES_URL}/${name}`;
  const title = `Gallery | Build with AI Cloud Hanoi 2025`;
  const description = `View your images in our gallery.`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}gallery/${name}`;

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

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = resolvedParams.name;
  const imageUrl = `${process.env.IMAGES_URL}/${name}`;

  return (
    <>
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