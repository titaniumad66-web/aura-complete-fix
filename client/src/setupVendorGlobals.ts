/**
 * Exposes GSAP, ScrollTrigger, Three, Lenis, and SplitType on `window` for
 * landing sections that expect script-tag globals. Loaded once from the Vite entry.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Lenis from "lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type VendorWindow = Window &
  typeof globalThis & {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    THREE: typeof THREE;
    Lenis: typeof Lenis;
    SplitType: typeof SplitType;
  };

const w = window as VendorWindow;
w.gsap = gsap;
w.ScrollTrigger = ScrollTrigger;
w.THREE = THREE;
w.Lenis = Lenis;
w.SplitType = SplitType;

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
