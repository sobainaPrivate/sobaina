export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
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
