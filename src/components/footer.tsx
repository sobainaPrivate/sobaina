export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background py-12">
      <div className="container relative mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Sobaina · Designed & Built by Sobaina
        </p>
        <div className="flex items-center gap-6">
          <a href="#work" className="text-sm text-muted-foreground hover:text-white transition-colors">Work</a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
