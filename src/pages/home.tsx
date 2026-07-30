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
import CoinToast from "@/components/coin-toast";
import RewardTrigger from "@/components/reward-trigger";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <NoiseOverlay />
      <CustomCursor />
      <CoinToast />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <RewardTrigger id="projects" amount={15} label="Explored the work">
        <Projects />
      </RewardTrigger>
      <RewardTrigger id="about" amount={10} label="Got to know Sobaina">
        <About />
      </RewardTrigger>
      <RewardTrigger id="showcase" amount={20} label="Unlocked Design/Dev mode">
        <DesignDevShowcase />
      </RewardTrigger>
      <RewardTrigger id="contact" amount={15} label="Reached the contact zone">
        <Contact />
      </RewardTrigger>
      <Footer />
    </main>
  );
}