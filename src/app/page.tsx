import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Facilities from "@/components/sections/Facilities";
import Footer from "@/components/Footer";

async function getSiteContent() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/pages/home`, {
      cache: 'no-store', // Ensure we always get fresh data for now
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    console.error("Failed to load site content from API", e);
    return null;
  }
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen">
      <Header />
      <Hero slides={content?.hero?.slides} />
      <Welcome data={content?.welcome} />
      <Facilities data={content?.facilities} />
      <Footer />
    </main>
  );
}
