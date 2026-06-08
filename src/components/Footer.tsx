export default function Footer() {
  return (
    <footer
      id="atelier"
      className="relative border-t border-white/[0.04] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Left — Brand */}
          <div>
            <p className="font-serif text-2xl md:text-3xl text-ivory font-light tracking-[0.15em] uppercase mb-4">
              Arabian Dial
            </p>
            <p className="text-[13px] font-sans text-mist/50 leading-relaxed max-w-sm">
              Digital Atelier Concept — Built for{" "}
              <a
                href="https://arabiandial.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne/60 hover:text-champagne transition-colors underline underline-offset-2 decoration-champagne/20"
              >
                arabiandial.store
              </a>
            </p>
          </div>

          {/* Right — Links */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <a
              href="https://instagram.com/arabian_dial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-sans tracking-[0.15em] uppercase text-mist/40 hover:text-champagne transition-colors duration-300"
            >
              @arabian_dial
            </a>
            <p className="text-[11px] font-sans text-mist/25 tracking-[0.05em]">
              © {new Date().getFullYear()} Arabian Dial. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
