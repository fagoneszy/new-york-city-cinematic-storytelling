import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";

const HeroScene = lazy(() => import("./components/HeroScene"));
const ImageRevealSection = lazy(() => import("./components/ImageRevealSection"));
const HorizontalStorySection = lazy(() => import("./components/HorizontalStorySection"));
const ParallaxScene = lazy(() => import("./components/ParallaxScene"));
const TypographyScene = lazy(() => import("./components/TypographyScene"));
const ZoomRevealScene = lazy(() => import("./components/ZoomRevealScene"));
const GalleryScene = lazy(() => import("./components/GalleryScene"));
const FinalScene = lazy(() => import("./components/FinalScene"));

const SCROLL_PER_SCENE = 3000;

interface SnapPoint {
  scene: number;
  center: number;
  captureRadius: number;
  releaseRadius: number;
}

const SNAP_POINTS: SnapPoint[] = [
  // Scene 1 - ImageRevealSection: "8 Million Stories. One City."
  { scene: 1, center: 0.7, captureRadius: 0.08, releaseRadius: 0.14 },
  // Scene 2 - HorizontalStorySection: each panel
  { scene: 2, center: 0.125, captureRadius: 0.06, releaseRadius: 0.10 },
  { scene: 2, center: 0.375, captureRadius: 0.06, releaseRadius: 0.10 },
  { scene: 2, center: 0.625, captureRadius: 0.06, releaseRadius: 0.10 },
  { scene: 2, center: 0.875, captureRadius: 0.06, releaseRadius: 0.10 },
  // Scene 3 - ParallaxScene: "BUILT ON AMBITION"
  { scene: 3, center: 0.45, captureRadius: 0.08, releaseRadius: 0.14 },
  // Scene 4 - TypographyScene: Dream / Build / Rise / Conquer
  { scene: 4, center: 0.125, captureRadius: 0.06, releaseRadius: 0.11 },
  { scene: 4, center: 0.375, captureRadius: 0.06, releaseRadius: 0.11 },
  { scene: 4, center: 0.625, captureRadius: 0.06, releaseRadius: 0.11 },
  { scene: 4, center: 0.875, captureRadius: 0.06, releaseRadius: 0.11 },
  // Scene 5 - ZoomRevealScene: "The world arrives here."
  { scene: 5, center: 0.6, captureRadius: 0.08, releaseRadius: 0.14 },
  // Scene 6 - GalleryScene: each slide
  { scene: 6, center: 0.1, captureRadius: 0.05, releaseRadius: 0.09 },
  { scene: 6, center: 0.3, captureRadius: 0.05, releaseRadius: 0.09 },
  { scene: 6, center: 0.5, captureRadius: 0.05, releaseRadius: 0.09 },
  { scene: 6, center: 0.7, captureRadius: 0.05, releaseRadius: 0.09 },
  { scene: 6, center: 0.9, captureRadius: 0.05, releaseRadius: 0.09 },
  // Scene 7 - FinalScene: closing text
  { scene: 7, center: 0.35, captureRadius: 0.08, releaseRadius: 0.14 },
];

export default function App() {
  const [activeScene, setActiveScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const scrollAccumulator = useRef(0);
  const activeSceneRef = useRef(0);
  const prevActiveSceneRef = useRef(0);
  const touchStartY = useRef(0);
  const snappedRef = useRef<{ center: number; releaseRadius: number; offset: number } | null>(null);
  const transitionGuard = useRef(false);

  const overallProgressValue = useMotionValue(0);
  useEffect(() => {
    overallProgressValue.set((activeScene + progress) / 8);
  }, [activeScene, progress, overallProgressValue]);

  const smoothProgress = useSpring(overallProgressValue, { stiffness: 60, damping: 25 });

  const goToScene = useCallback((scene: number) => {
    activeSceneRef.current = scene;
    scrollAccumulator.current = 0;
    snappedRef.current = null;
    setActiveScene(scene);
    setProgress(0);
  }, []);

  const handleScrollDelta = useCallback((deltaY: number) => {
    const scene = activeSceneRef.current;
    const sceneSnaps = SNAP_POINTS.filter(s => s.scene === scene);

    // One-event guard: prevents bounce-back right after a transition
    if (transitionGuard.current) {
      transitionGuard.current = false;
      scrollAccumulator.current += deltaY;
      scrollAccumulator.current = Math.max(0, Math.min(SCROLL_PER_SCENE, scrollAccumulator.current));
      setProgress(scrollAccumulator.current / SCROLL_PER_SCENE);
      return;
    }

    // Handle snapped state
    if (snappedRef.current !== null) {
      snappedRef.current.offset += deltaY;
      const offsetProgress = snappedRef.current.offset / SCROLL_PER_SCENE;

      if (Math.abs(offsetProgress) >= snappedRef.current.releaseRadius) {
        scrollAccumulator.current += snappedRef.current.offset;
        snappedRef.current = null;
      } else {
        setProgress(snappedRef.current.center);
        return;
      }
    } else {
      scrollAccumulator.current += deltaY;
    }

    // Scene transitions
    let currentScene = scene;
    while (scrollAccumulator.current >= SCROLL_PER_SCENE && currentScene < 7) {
      currentScene++;
      scrollAccumulator.current = 0;
      snappedRef.current = null;
      transitionGuard.current = true;
    }
    while (scrollAccumulator.current < 0 && currentScene > 0) {
      currentScene--;
      scrollAccumulator.current = SCROLL_PER_SCENE;
      snappedRef.current = null;
      transitionGuard.current = true;
    }
    if (currentScene === 0) scrollAccumulator.current = Math.max(0, scrollAccumulator.current);
    if (currentScene === 7) scrollAccumulator.current = Math.min(SCROLL_PER_SCENE, scrollAccumulator.current);

    // Always reset HorizontalStorySection to progress 0 on entry, regardless of direction
    if (currentScene === 2 && prevActiveSceneRef.current !== 2) {
      scrollAccumulator.current = 0;
    }

    const rawProgress = scrollAccumulator.current / SCROLL_PER_SCENE;
    let finalProgress = rawProgress;

    // Check snap entry
    if (snappedRef.current === null) {
      for (const snap of sceneSnaps) {
        const dist = Math.abs(rawProgress - snap.center);
        if (dist <= snap.captureRadius) {
          snappedRef.current = { center: snap.center, releaseRadius: snap.releaseRadius, offset: 0 };
          finalProgress = snap.center;
          scrollAccumulator.current = snap.center * SCROLL_PER_SCENE;
          break;
        }
      }
    }

    if (currentScene !== activeSceneRef.current) {
      activeSceneRef.current = currentScene;
      setActiveScene(currentScene);
    }
    prevActiveSceneRef.current = currentScene;
    setProgress(finalProgress);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScrollDelta(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      if (Math.abs(deltaY) > 4) {
        handleScrollDelta(deltaY);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleScrollDelta(120);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleScrollDelta(-120);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScrollDelta]);

  const renderActiveScene = () => {
    switch (activeScene) {
      case 0:
        return (
          <HeroScene 
            progress={progress} 
            onNext={() => goToScene(1)} 
          />
        );
      case 1:
        return <ImageRevealSection progress={progress} />;
      case 2:
        return <HorizontalStorySection progress={progress} />;
      case 3:
        return <ParallaxScene progress={progress} />;
      case 4:
        return <TypographyScene progress={progress} />;
      case 5:
        return <ZoomRevealScene progress={progress} />;
      case 6:
        return <GalleryScene progress={progress} />;
      case 7:
        return (
          <FinalScene 
            progress={progress} 
            onReplay={() => goToScene(0)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="narrative-framework" className="relative w-full h-screen bg-black overflow-hidden select-none">

      {/* Premium Cinematic Border Framing Grid Overlay */}
      <div id="framework-border-overlay" className="fixed inset-0 pointer-events-none z-50">
        <div id="border-top" className="absolute top-0 left-0 right-0 h-1.5 bg-black/80 backdrop-blur-sm" />
        <div id="border-bottom" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80 backdrop-blur-sm" />
        <div id="border-left" className="absolute top-0 bottom-0 left-0 w-1.5 bg-black/80 backdrop-blur-sm" />
        <div id="border-right" className="absolute top-0 bottom-0 right-0 w-1.5 bg-black/80 backdrop-blur-sm" />
      </div>

      {/* Global Scroll Timeline Line Indicator */}
      <div id="global-scroll-visualizer" className="fixed top-0 left-0 right-0 h-[3px] bg-white/[0.04] z-55 pointer-events-none">
        <motion.div
          id="global-scroll-fill"
          style={{ scaleX: smoothProgress }}
          className="w-full h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-400 origin-left"
        />
      </div>

      {/* Minimalist Scene Indicator dots */}
      <div id="narrative-scene-navigator" className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-45 pointer-events-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para cena ${i + 1}`}
            onClick={() => goToScene(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === activeScene 
                ? "bg-white scale-150 shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                : "bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* SEQUENTIAL NARRATIVE ACTS (SCENES 1 TO 8) */}
      <main id="sequential-scenes-main" className="relative w-full h-full">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.45, 0, 0.55, 1] }}
              className="w-full h-full"
            >
              {renderActiveScene()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

    </div>
  );
}
