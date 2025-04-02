import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <div className="absolute top-0 left-0 w-full z-10">
        <Header />
      </div>
      <Hero />
    </div>
  );
}
