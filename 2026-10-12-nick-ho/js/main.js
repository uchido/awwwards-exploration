/* main.js — loader, nav, counters, countdown, cursor, gallery, form */
(function(){
  "use strict";
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- loader ---------- */
  var loader=$('#loader'), num=$('#loadNum'), bar=$('#loadBar'), cover=$('#loadCover');
  var n=0;
  var li=setInterval(function(){
    n+=Math.ceil(Math.random()*9);
    if(n>=98){n=98;clearInterval(li);finish();}
    num.textContent=n; bar.style.width=n+'%';
  },90);
  function finish(){
    setTimeout(function(){
      loader.style.transition='opacity .5s'; loader.style.opacity='0';
      cover.style.transition='transform .9s cubic-bezier(.7,0,.3,1)';
      cover.style.transform='scaleY(0)';
      setTimeout(function(){loader.remove();cover.remove();startCounters();},950);
    },300);
  }
  // safety: never trap user
  setTimeout(function(){if(document.getElementById('loader')){loader.style.display='none';var c=$('#loadCover');if(c)c.style.display='none';}},6000);

  /* ---------- nav ---------- */
  var nav=$('#nav'), menu=$('#menu');
  $('#burger').addEventListener('click',function(){menu.classList.add('open')});
  $('#menuClose').addEventListener('click',function(){menu.classList.remove('open')});
  $$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});
  window.addEventListener('scroll',function(){
    nav.classList.toggle('nav--scrolled',window.scrollY>innerHeight*.7);
    var h=document.documentElement;
    var p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
    $('#progress').style.width=p+'%';
  },{passive:true});

  /* ---------- counters ---------- */
  var counted=false;
  function startCounters(){ if(counted)return; counted=true;
    $$('[data-count]').forEach(function(el){
      var target=+el.dataset.count, t0=performance.now(), dur=1400;
      (function tick(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
        el.textContent=Math.round(target*e); if(p<1)requestAnimationFrame(tick);})(t0);
    });
  }
  // also trigger on scroll into view (fallback if loader removed early)
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)startCounters()})},{threshold:.2});
    $$('[data-count]').forEach(function(el){io.observe(el)});
  }

  /* ---------- countdown to next race (Imola 2026-04-18) ---------- */
  var dest=new Date('2026-10-24T12:00:00+02:00').getTime();
  function pad(x){return String(x).padStart(2,'0')}
  setInterval(function(){
    var d=Math.max(0,dest-Date.now());
    var dd=Math.floor(d/864e5),hh=Math.floor(d/36e5)%24,mm=Math.floor(d/6e4)%60,ss=Math.floor(d/1e3)%60;
    var el=$('#countdown'); if(el)el.textContent=pad(dd)+':'+pad(hh)+':'+pad(mm)+':'+pad(ss);
  },1000);

  /* ---------- hero mouse parallax ---------- */
  var stage=$('#stage');
  if(stage&&matchMedia('(hover:hover)').matches){
    document.querySelector('.hero').addEventListener('mousemove',function(e){
      var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
      $$('#stage [data-depth]').forEach(function(l){
        var d=+l.dataset.depth;
        l.style.translate=(x*d)+'px '+(y*d)+'px';
      });
    });
  }

  /* ---------- custom cursor on media row ---------- */
  var cur=$('#cursor'), row=$('#mediaRow');
  if(row&&matchMedia('(hover:hover)').matches){
    row.addEventListener('mouseenter',function(){cur.classList.add('on')});
    row.addEventListener('mouseleave',function(){cur.classList.remove('on')});
    row.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
    // drag to scroll
    var down=false,sx=0,sl=0;
    row.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;sl=row.scrollLeft});
    window.addEventListener('pointerup',function(){down=false});
    row.addEventListener('pointermove',function(e){if(down)row.scrollLeft=sl-(e.clientX-sx)});
  }

  /* ---------- gallery switch ---------- */
  var main=$('#galMain');
  $$('.gal-row img').forEach(function(im){
    im.addEventListener('click',function(){
      main.style.opacity='0';
      setTimeout(function(){main.src=im.src;main.style.opacity='1'},200);
    });
  });
  main.style.transition='opacity .25s';

  /* ---------- fake form ---------- */
  $('#contactForm').addEventListener('submit',function(e){
    e.preventDefault();
    $('#formMsg').textContent='Thanks — message noted (demo form, no backend).';
    e.target.reset();
  });

  /* ---------- history image swap ---------- */
  var imgs=['assets/img1.avif','assets/img2.avif','assets/img3.avif','assets/race1.avif','assets/porsche.avif'];
  var hi=$('#historyImg');
  if('IntersectionObserver' in window&&hi){
    var ch=$$('.chapter');
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(en.isIntersecting){
          var i=ch.indexOf(en.target);
          hi.src=imgs[i%imgs.length];
          ch.forEach(function(c){c.classList.remove('active')});
          en.target.classList.add('active');
        }
      });
    },{threshold:.5});
    ch.forEach(function(c){cio.observe(c)});
  }
})();
