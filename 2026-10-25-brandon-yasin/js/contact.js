/* Contact modal interactions */
(function () {
  'use strict';
  var contactBtns = document.querySelectorAll('.contact, .time-contact');
  var modalWrap = document.querySelector('.modal-wrap');
  var closeBtns = document.querySelectorAll('.modal-wrap .btn-close');
  if (!contactBtns.length || !modalWrap) return;
  
  contactBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      modalWrap.classList.add('is-open');
    });
  });
  
  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modalWrap.classList.remove('is-open');
    });
  });
  
  // Close on backdrop click
  var panel = modalWrap.querySelector('.panel');
  if (panel) {
    modalWrap.addEventListener('click', function(e) {
      if (e.target === modalWrap) {
        modalWrap.classList.remove('is-open');
      }
    });
  }
  
  // Form submission
  var forms = document.querySelectorAll('.modal-wrap form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Show success message
      var successWrap = document.querySelector('.success-wrapper');
      if (successWrap) {
        successWrap.classList.add('is-visible');
        modalWrap.classList.remove('is-open');
      }
    });
  });
  
  var successClose = document.querySelector('.success-wrapper .btn-close');
  var successWrap = document.querySelector('.success-wrapper');
  if (successClose && successWrap) {
    successClose.addEventListener('click', function() {
      successWrap.classList.remove('is-visible');
    });
  }
})();
