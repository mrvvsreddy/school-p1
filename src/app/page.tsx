import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Facilities from "@/components/sections/Facilities";
import Footer from "@/components/Footer";
import { promises as fs } from 'fs';
import path from 'path';

async function getSiteContent() {
  try {
    // In production, this might need fallback if file doesn't exist yet
    const filePath = path.join(process.cwd(), 'src/data/site-content.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    console.error("Failed to load site content", e);
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
