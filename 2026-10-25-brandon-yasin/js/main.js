/* Main initialization */
(function () {
  'use strict';
  
  function init() {
    // Start clock
    if (window.BY && window.BY.clock && typeof window.BY.clock.start === 'function') {
      try { window.BY.clock.start(); } catch (e) {}
    }
    
    // Start header intro
    if (window.BY && window.BY.header) {
      try {
        if (typeof window.BY.header.setInitial === 'function') window.BY.header.setInitial();
        if (typeof window.BY.header.playIntro === 'function') {
          var intro = window.BY.header.playIntro();
          if (intro && typeof intro.call === 'function') {
            // Chain with gallery
            intro.call();
          }
        }
        if (typeof window.BY.header.bindLinks === 'function') window.BY.header.bindLinks();
        if (typeof window.BY.header.awardCycle === 'function') window.BY.header.awardCycle();
      } catch (e) {}
    }
    
    // Start gallery
    if (window.BY && window.BY.gallery && typeof window.BY.gallery.start === 'function') {
      try { window.BY.gallery.start(); } catch (e) {}
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
