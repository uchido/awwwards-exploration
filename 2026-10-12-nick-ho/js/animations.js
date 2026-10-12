/* animations.js — GSAP + ScrollTrigger reveals, parallax, hero intro */
(function(){
  if(!window.gsap){ // graceful fallback: show everything
    document.querySelectorAll('.reveal').forEach(function(el){el.style.opacity=1;el.style.transform='none'});
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // hero intro after loader
  gsap.from('.hero__title',{yPercent:60,opacity:0,duration:1.2,ease:'power4.out',delay:2.2});
  gsap.from('.hero__driver',{yPercent:12,opacity:0,duration:1.4,ease:'power3.out',delay:2.0});
  gsap.from('.hero__num',{x:60,opacity:0,duration:1,ease:'power3.out',delay:2.4});
  gsap.from('.hero__stat',{y:24,opacity:0,stagger:.1,duration:.8,ease:'power3.out',delay:2.5});

  // generic reveals
  gsap.utils.toArray('.reveal').forEach(function(el){
    gsap.to(el,{opacity:1,y:0,duration:.9,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 88%'}});
  });

  // hero scroll-out parallax
  gsap.to('.hero__driver',{yPercent:14,ease:'none',
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero__title',{yPercent:-30,opacity:.2,ease:'none',
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero__layer--car',{yPercent:10,ease:'none',
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

  // agenda car drift
  gsap.fromTo('#agendaCar',{x:-60},{x:60,ease:'none',
    scrollTrigger:{trigger:'#calendar',start:'top bottom',end:'bottom top',scrub:true}});

  // giant footer text slide
  gsap.from('.footer h2',{yPercent:30,ease:'none',
    scrollTrigger:{trigger:'.footer',start:'top bottom',end:'top 40%',scrub:true}});

  // marquee speed reacts to scroll velocity (subtle)
  var track=document.getElementById('marquee');
  ScrollTrigger.create({onUpdate:function(self){
    var v=Math.min(3,1+Math.abs(self.getVelocity())/4000);
    track.style.animationDuration=(18/v)+'s';
  }});
})();
