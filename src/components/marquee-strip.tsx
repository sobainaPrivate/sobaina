export default function MarqueeStrip() {
  const text = "UI/UX DESIGN · SOFTWARE DEVELOPMENT · REACT · FIGMA · FASTAPI · DESIGN SYSTEMS · CREATIVE TECHNOLOGY · PRODUCT THINKING · ";
  return (
    <div className="w-full bg-zinc-950 border-y border-white/10 overflow-hidden relative py-4 flex items-center">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="flex w-max marquee-content">
        <span className="text-xs tracking-[0.3em] text-white/40 font-medium uppercase px-4 whitespace-nowrap">{text}</span>
        <span className="text-xs tracking-[0.3em] text-white/40 font-medium uppercase px-4 whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}