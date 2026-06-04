import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

export default function ParallaxScene({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });

  // Translation values for the Parallax layers
  // Sky moves slowest (0.2x speed adjustment)
  const skyY = useTransform(smoothScroll, [0, 1], ["-5%", "10%"]);
  
  // Midground (buildings) moves at intermediate speed (0.5x)
  const buildingsY = useTransform(smoothScroll, [0, 1], ["0%", "-10%"]);
  const buildingsScale = useTransform(smoothScroll, [0, 1], [1.02, 1.1]);

  // Ambition Typography moves at its own offset, creating a layered floating effect behind foreground
  const textY = useTransform(smoothScroll, [0, 1], ["40%", "-30%"]);
  const textOpacity = useTransform(smoothScroll, [0.15, 0.45, 0.8], [0, 1, 0]);

  // Foreground moves fastest (1x relative rate)
  const foregroundY = useTransform(smoothScroll, [0, 1], ["10%", "-18%"]);
  const foregroundScale = useTransform(smoothScroll, [0, 1], [1.1, 1.25]);

  return (
    <div 
      ref={containerRef} 
      id="parallax-experience-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky presentation view */}
      <div id="parallax-sticky-frame" className="relative h-full w-full overflow-hidden select-none">
        
        {/* LAYER 1: The Sky (Background) */}
        <motion.div
          id="parallax-sky"
          style={{ 
            y: skyY,
            backgroundImage: "url('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=2000&q=80')"
          }}
          className="absolute inset-x-0 -top-[20%] -bottom-[20%] bg-cover bg-center pointer-events-none opacity-45"
        />

        {/* Backdrop visual vignette */}
        <div id="parallax-sky-overlay" className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

        {/* LAYER 2: The Buildings (Midground) */}
        <motion.div 
          id="parallax-midground"
          style={{ 
            y: buildingsY,
            scale: buildingsScale,
            backgroundImage: "url('https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=2000&q=80')"
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center pointer-events-none z-10 opacity-75"
        />

        {/* Elegant Fog / Atmospheric Layer to blend Midground with Sky and Foreground */}
        <div id="parallax-atmosphere" className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-12" />

        {/* LAYER 3: The Ambition Display Text (Floats between Midground and Foreground) */}
        <motion.div
          id="parallax-floating-text"
          style={{ 
            y: textY,
            opacity: textOpacity
          }}
          className="absolute inset-0 z-15 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <div className="text-center max-w-4xl">
            <span className="text-xs md:text-sm font-mono tracking-[0.6em] uppercase text-zinc-400 block mb-6">
              O AUGE DO ALCANCE HUMANO
            </span>
            <h2 className="text-5xl md:text-[7rem] font-extrabold tracking-[0.08em] uppercase text-white leading-none">
              CONSTRUÍDO SOBRE
              <br />
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-zinc-500">
                AMBIÇÃO.
              </span>
            </h2>
          </div>
        </motion.div>

        {/* LAYER 4: The Bridge Metal Truss / Foreground elements (Closest to user) */}
        <motion.div
          id="parallax-foreground"
          style={{ 
            y: foregroundY,
            scale: foregroundScale,
            backgroundImage: "url('https://images.unsplash.com/photo-1492666673288-3c4b4576ad9a?auto=format&fit=crop&w=2000&q=80')"
          }}
          className="absolute inset-x-0 -top-[20%] -bottom-[20%] bg-cover bg-center pointer-events-none z-20 opacity-90 mix-blend-screen"
        />

        {/* Foreground vignette and bottom fade to pure black */}
        <div id="parallax-foreground-fade" className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-25" />
        <div id="parallax-top-vignette" className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-25" />
        <div id="parallax-bottom-vignette" className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-25" />

      </div>
    </div>
  );
}
