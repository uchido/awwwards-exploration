/* Marque list — hover/focus swaps the sticky square image and dims siblings */
(function () {
  const items = document.querySelectorAll('.marques__item');
  const images = document.querySelectorAll('.marque-image');
  if (!items.length) return;

  function activate(i) {
    items.forEach((el, j) => el.classList.toggle('is-active', j === i));
    images.forEach((el, j) => el.classList.toggle('is-active', j === i));
  }

  items.forEach((item) => {
    const i = Number(item.dataset.index);
    item.addEventListener('mouseenter', () => activate(i));
    item.addEventListener('focus', () => activate(i));
  });
})();
