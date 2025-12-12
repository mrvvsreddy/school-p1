import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Facilities from "@/components/sections/Facilities";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Welcome />
      <Facilities />
      <Footer />
    </main>
  );
}
