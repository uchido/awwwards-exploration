/* Menu interactions */
(function () {
  'use strict';
  var menuToggles = document.querySelectorAll('.menu-toggle');
  var menuOverlay = document.querySelector('.menu-overlay');
  if (!menuToggles.length || !menuOverlay) return;
  
  menuToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      menuOverlay.classList.toggle('is-open');
      var expanded = menuOverlay.classList.contains('is-open');
      menuToggles.forEach(function(t) { t.setAttribute('aria-expanded', expanded ? 'true' : 'false'); });
    });
  });
  
  // Click outside to close
  menuOverlay.addEventListener('click', function(e) {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove('is-open');
      menuToggles.forEach(function(t) { t.setAttribute('aria-expanded', 'false'); });
    }
  });
})();
