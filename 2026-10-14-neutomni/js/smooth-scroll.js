const LERP_SMOOTH = 0.07; 
const LERP_SNAPPY = 0.14; 
const LERP_MOBILE = 0.3;
 

const isMobile = window.matchMedia('(max-width: 768px)').matches;
 
const lenis = new Lenis({
  lerp: isMobile ? LERP_MOBILE : LERP_SMOOTH
});
 
lenis.on('scroll', ScrollTrigger.update);
 
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
 
const jumpState = window.jumpState || {
  triggerId: null,
  label: null,
  until: 0
};
