import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import About from "@/components/about";
import DesignDevShowcase from "@/components/design-dev-showcase";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import CustomCursor from "@/components/cursor";
import NoiseOverlay from "@/components/noise-overlay";
import MarqueeStrip from "@/components/marquee-strip";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <NoiseOverlay />
      <CustomCursor />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Projects />
      <About />
      <DesignDevShowcase />
      <Contact />
      <Footer />
    </main>
  );
}