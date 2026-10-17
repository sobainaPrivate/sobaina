import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import DesignDevShowcase from "@/components/design-dev-showcase";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import CustomCursor from "@/components/cursor";
import NoiseOverlay from "@/components/noise-overlay";
import WorkSection from "@/components/work/work-section";
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
      <WorkSection />
      <RewardTrigger id="showcase" amount={25} label="Explored the work">
        <DesignDevShowcase />
      </RewardTrigger>
      <RewardTrigger id="about" amount={10} label="Got to know Sobaina">
        <About />
      </RewardTrigger>
      <RewardTrigger id="contact" amount={15} label="Reached the contact zone">
        <Contact />
      </RewardTrigger>
      <Footer />
    </main>
  );
}