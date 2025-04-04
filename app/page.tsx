import FAQComponent from "@/components/FAQ";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="h-24 md:hidden"></div>
      <Hero />
      <FAQComponent />
      <Gallery />
      <Footer />
    </div>
  );
}
