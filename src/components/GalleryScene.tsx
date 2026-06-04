import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

interface GallerySlide {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  image: string;
}

const SLIDES: GallerySlide[] = [
  {
    id: "g-slide-rainy-streets",
    title: "Ruas Chuvosas",
    subtitle: "Néon refletindo em rodovias-espelho.",
    location: "SOHO / 03:14",
    image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "g-slide-yellow-taxis",
    title: "Táxis Amarelos",
    subtitle: "Lâminas de ouro cruzando a grade do pôr do sol.",
    location: "BROADWAY / 18:45",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "g-slide-night-lights",
    title: "Luzes Noturnas",
    subtitle: "O céu elétrico cintilando no frio profundo.",
    location: "MONÓLITO DE MIDTOWN / 23:20",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "g-slide-rooftops",
    title: "Os Pináculos",
    subtitle: "Olhando do alto para as saídas de vapor.",
    location: "MIRANTE CHRYSLER / 02:10",
    image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "g-slide-bridges",
    title: "As Pontes",
    subtitle: "Cabos de aço suspendendo a gravidade sobre as correntes.",
    location: "VÃO DE MANHATTAN / 05:30",
    image: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "g-slide-crowds",
    title: "Correntes Humanas",
    subtitle: "A maré constante de almas anônimas em movimento.",
    location: "GRAND CENTRAL / 08:30",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2000&q=80"
  }
];

export default function GalleryScene({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });

  // Translation from 0vw to -500vw (since there are 6 slides, we translate back by 5 * 100vw = -500vw to display the last one fully)
  const xTranslate = useTransform(smoothScroll, [0, 1], ["0vw", "-500vw"]);

  return (
    <div 
      ref={containerRef} 
      id="gallery-scene-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky viewport frame */}
      <div id="gallery-sticky-frame" className="relative h-full w-full overflow-hidden">
        
        {/* Gallery Slideways Track */}
        <motion.div
          id="gallery-slideways"
          style={{ x: xTranslate }}
          className="flex h-full w-[600vw]"
        >
          {SLIDES.map((slide, index) => {
            // Self-referential horizontal parallax modifier:
            // Background image moves slightly in opposition to current translation.
            const bgParallax = useTransform(
              smoothScroll,
              [0, 1],
              [index * 40 - 120 + "px", (index * 40 - 200) + "px"]
            );

            // Staggered opacity reveal for texts inside of slide as it scroll into path
            // For first slide, index = 0, center is 0.
            const slideStart = index / SLIDES.length;
            const slideCenter = (index + 0.5) / SLIDES.length;
            const slideEnd = (index + 1) / SLIDES.length;
            
            const textOpacity = useTransform(
              smoothScroll,
              [slideStart - 0.08, slideCenter - 0.02, slideEnd],
              [0, 1, 0.5]
            );

            return (
              <div
                key={slide.id}
                id={slide.id}
                className="relative h-full w-[100vw] flex-shrink-0 flex items-end justify-start p-8 md:p-24 overflow-hidden"
              >
                {/* Image Backdrop with opposite horizontal drift */}
                <motion.div
                  id={`${slide.id}-bg`}
                  style={{
                    x: bgParallax,
                    scale: 1.12,
                    backgroundImage: `url('${slide.image}')`,
                    backgroundPosition: "center",
                  }}
                  className="absolute inset-x-[-10vw] inset-y-0 h-full bg-cover bg-center pointer-events-none"
                />

                {/* Shading overlay gradients to mask card sides into pure night */}
                <div id={`${slide.id}-gradient`} className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none z-10" />
                <div id={`${slide.id}-left-shading`} className="absolute inset-y-0 left-0 w-96 bg-gradient-to-r from-black via-black/30 to-transparent pointer-events-none z-10" />
                <div id={`${slide.id}-right-shading`} className="absolute inset-y-0 right-0 w-96 bg-gradient-to-l from-black via-black/30 to-transparent pointer-events-none z-10" />

                {/* Slide Text Content block */}
                <motion.div
                  id={`${slide.id}-content`}
                  style={{ opacity: textOpacity }}
                  className="relative z-15 max-w-xl text-left select-none mb-12"
                >
                  {/* Location and time stamp */}
                  <span id={`${slide.id}-location`} className="text-zinc-400 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase block mb-4">
                    {slide.location}
                  </span>

                  {/* Slide Title */}
                  <h3 id={`${slide.id}-heading`} className="text-4xl md:text-7xl font-light text-white tracking-widest uppercase mb-4 leading-none">
                    {slide.title}
                  </h3>

                  {/* Mini description note */}
                  <p id={`${slide.id}-desc-text`} className="text-zinc-300 text-sm md:text-lg font-light tracking-wide leading-relaxed">
                    {slide.subtitle}
                  </p>
                </motion.div>

                {/* Sidebar index display */}
                <div id={`${slide.id}-slide-index`} className="absolute bottom-24 right-24 z-20 hidden md:flex flex-col items-end gap-1 font-mono text-xs tracking-widest text-zinc-400/50 select-none">
                  <span className="text-[10px] text-zinc-600">REEL ATMOSFÉRICO</span>
                  <span>[ 0{index + 1} / 06 ]</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Global Track Progress indicator for visual aesthetic */}
        <div id="gallery-progress-decor" className="absolute bottom-12 left-12 right-12 z-20 flex justify-between items-center text-[10px] font-mono tracking-[0.4em] text-zinc-500 pointer-events-none">
          <span>LEVANTAMENTO ATMOSFÉRICO</span>
          <div className="flex gap-4 items-center">
            <span id="gallery-scrolling">GALERIA POR SCROLL</span>
            <div className="w-24 h-[1px] bg-zinc-800 relative overflow-hidden">
              <motion.div
                id="gallery-progress-thumb"
                style={{ scaleX: smoothScroll }}
                className="absolute inset-0 bg-zinc-400 origin-left"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
