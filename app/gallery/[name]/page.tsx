// app/gallery/[name]/page.tsx
import Gallery from "@/components/Gallery"; // Adjust the import path as needed

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params; // Await the params
  const name = resolvedParams.name;

  return <Gallery initialName={name} />; // Pass the name as a prop if needed
}
