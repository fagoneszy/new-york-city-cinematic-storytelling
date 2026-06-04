import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

interface PanelData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
}

const PANELS: PanelData[] = [
  {
    id: "panel-times-square",
    title: "Times Square",
    subtitle: "O Pulso de Neon",
    description: "Milhões de lúmens ofuscantes contra o céu da meia-noite, um desfiladeiro eletrônico de energia cinética hiperssensorial.",
    badge: "01 / ENERGIA",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "panel-brooklyn-bridge",
    title: "Ponte do Brooklyn",
    subtitle: "Aço e Granito Suspenso",
    description: "Os arcos góticos sobre o East River, ligando sonhos industriais à ambição high-modernista.",
    badge: "02 / ESTRUTURA",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "panel-central-park",
    title: "Central Park",
    subtitle: "O Vazio Esculpido",
    description: "Oitocentos e quarenta e três acres de silêncio primordial encaixados no centro do monólito urbano.",
    badge: "03 / SILÊNCIO",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "panel-manhattan-skyline",
    title: "Horizonte de Manhattan",
    subtitle: "A Matriz da Ambição",
    description: "Uma cordilheira artificial forjada em aço, cobre e vidro, brilhando sobre o porto como uma escultura cósmica.",
    badge: "04 / VISÃO",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "panel-subway",
    title: "O Metrô",
    subtitle: "Veias Subterrâneas",
    description: "Seiscentas e sessenta e cinco milhas de trilhos de ferro carregando a velocidade subterrânea de uma cidade em migração eterna.",
    badge: "05 / RITMO",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=2000&q=80"
  }
];

export default function HorizontalStorySection({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });

  // Map the 0 to 1 progress of the container's scroll to the horizontal translate of the track.
  // There are 5 panels, which occupy a total width of 500vw.
  // To show the 5th panel fully, we translate back by -(5-1) * 100vw = -400vw.
  const xTranslate = useTransform(smoothScroll, [0, 1], ["0vw", "-400vw"]);

  return (
    <div 
      ref={containerRef} 
      id="horizontal-scroll-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky viewport frame */}
      <div id="horizontal-scroll-sticky" className="relative h-full w-full overflow-hidden">
        
        {/* Horizontal Track */}
        <motion.div
          id="horizontal-scroll-track"
          style={{ x: xTranslate }}
          className="flex h-full w-[500vw]"
        >
          {PANELS.map((panel, index) => {
            // Apply horizontal parallax to background images:
            // Since the track translates left, we shift each background slightly to the right to create deep relative visual motion.
            // As the scroll progress runs from 0 to 1, we can calculate for each panel when it enters/exits.
            // But a simple continuous transform is incredibly organic:
            // Translate the image from -8% to 12% relative to card alignment
            const bgParallax = useTransform(
              smoothScroll,
              [0, 1],
              [index * 50 - 150 + "px", (index * 50 - 250) + "px"]
            );

            return (
              <div
                key={panel.id}
                id={panel.id}
                className="relative h-full w-[100vw] flex-shrink-0 flex items-center overflow-hidden"
              >
                {/* Fullscreen Background with Parallax */}
                <motion.div
                  id={`${panel.id}-bg`}
                  style={{
                    x: bgParallax,
                    scale: 1.15,
                    backgroundImage: `url('${panel.image}')`,
                    backgroundPosition: "center",
                  }}
                  className="absolute inset-0 w-[120vw] h-full bg-cover bg-center pointer-events-none"
                />

                {/* Ambient Cinematic Tint/Overlay */}
                <div id={`${panel.id}-overlay`} className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/80 pointer-events-none z-10" />
                <div id={`${panel.id}-bottom-gradient`} className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

                {/* Panel Typography Container */}
                <div id={`${panel.id}-content-wrapper`} className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 flex items-center">
                  <div id={`${panel.id}-content`} className="max-w-2xl select-none">
                    
                    {/* Badge */}
                    <motion.p
                      id={`${panel.id}-badge`}
                      className="font-mono text-zinc-400 text-xs md:text-sm tracking-[0.5em] uppercase mb-4 opacity-70"
                    >
                      {panel.badge}
                    </motion.p>

                    {/* Massive Display Title */}
                    <h2
                      id={`${panel.id}-title`}
                      className="text-5xl md:text-9xl font-black text-white tracking-widest uppercase leading-none drop-shadow-xl"
                    >
                      {panel.title}
                    </h2>

                    {/* Styled Subtitle */}
                    <p
                      id={`${panel.id}-subtitle`}
                      className="text-xl md:text-3xl font-light text-zinc-200 tracking-wider mt-4 leading-relaxed"
                    >
                      {panel.subtitle}
                    </p>

                    {/* Exquisite micro description text */}
                    <p
                      id={`${panel.id}-description`}
                      className="text-zinc-400 text-sm md:text-lg font-light tracking-wide mt-6 leading-relaxed max-w-xl opacity-80"
                    >
                      {panel.description}
                    </p>
                    
                  </div>
                </div>

                {/* Panel bottom status lines to feel documentative and polished */}
                <div id={`${panel.id}-decor`} className="absolute bottom-12 left-12 right-12 z-20 flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-zinc-500 pointer-events-none">
                  <span>OBSERVAÇÕES DA METRÓPOLE</span>
                  <span>[ NY-CEN-03 ]</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Global Progress Bar for Scene 3 */}
        <div id="horizontal-scrollbar-custom" className="absolute bottom-6 left-12 right-12 h-[2px] bg-white/10 z-20 overflow-hidden rounded-full">
          <motion.div
            id="horizontal-scrollbar-thumb"
            style={{ scaleX: smoothScroll }}
            className="w-full h-full bg-white/40 origin-left"
          />
        </div>
      </div>
    </div>
  );
}
