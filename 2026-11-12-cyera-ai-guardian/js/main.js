/* Boot: split headings, loader, then start the journey */
(function () {
    function boot() {
        /* split display headings into words for stagger reveals */
        document.querySelectorAll('[data-split]').forEach((el) => window.CloneNavInit.splitText(el));

        /* remove js-flicker protection once fonts are ready */
        document.fonts && document.fonts.ready.then(() => document.body.classList.add('fonts-ready'));

        window.CloneScene.initStars();
        window.CloneScene.initCrystals();
        window.CloneNavInit.init();

        /* hide everything until loader finishes */
        document.body.classList.remove('ui-ready');

        window.CloneLoader.run(() => {
            document.body.classList.add('ui-ready');
            window.CloneNav.refreshButtons();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
