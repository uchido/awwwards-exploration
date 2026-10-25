/* Header intro sequence + link hovers + rotating award badge */
(function () {
  'use strict'

  var gsap = window.gsap
  var BY = window.BY

  var page = document.querySelector('main.page--home')
  var header = page ? page.querySelector('.header') : document.querySelector('.header--intro')
  if (!header) return

  var svg = header.querySelector('.svg')
  var paths = svg ? svg.querySelectorAll('path') : []
  var logoFirst = header.querySelectorAll('.logo > .logo-line > span:nth-child(1)')
  var navFirst = header.querySelectorAll('.nav .link-inner > span:nth-child(1)')
  var award = header.querySelector('.award')
  var awardLines = award ? award.querySelectorAll('.award-line') : []
  var logoLines = header.querySelectorAll('.logo > .logo-line')

  function drawSet() {
    Array.prototype.forEach.call(paths, function (p) { BY.theme.dashInit(p) })
  }

  function setInitial() {
    if (!gsap) return
    drawSet()
    gsap.set(logoFirst, { yPercent: 100 })
    gsap.set(navFirst, { yPercent: 100 })
    gsap.set(header.querySelectorAll('.time-toggle, .time-time, .time-contact'), { yPercent: 100 })
    gsap.set(header.querySelector('.easter'), { autoAlpha: 1 })
    gsap.set(header.querySelector('.svg'), { autoAlpha: 1 })
    gsap.set(header.querySelector('.nav'), { autoAlpha: 1 })
    gsap.set(header.querySelector('.logo'), { autoAlpha: 1 })
    gsap.set(header.querySelector('.egg'), { autoAlpha: 1 })
    var circle = header.querySelector('.egg-svg circle')
    if (circle) BY.theme.dashInit(circle)
    var rotate = header.querySelector('.egg .rotate')
    if (rotate) gsap.set(rotate, { autoAlpha: 0, rotation: 0 })
    gsap.set(header, { autoAlpha: 1 })
  }

  function playIntro() {
    if (!gsap) {
      Array.prototype.forEach.call(paths, function (p) { p.style.strokeDashoffset = '0' })
      return null
    }
    setInitial()
    var rotate = header.querySelector('.egg .rotate')
    var circle = header.querySelector('.egg-svg circle')
    var m = BY.clock ? BY.clock.rotationFor(BY.clock.now()) : 0

    var tl = gsap.timeline()

    tl.addLabel('logo', 0)
    tl.to(logoFirst, {
      yPercent: 0,
      duration: 1,
      stagger: 0.06,
      ease: 'power2.out'
    }, 'logo')

    Array.prototype.forEach.call(paths, function (p, i) {
      var durations = [1.3, 0.6, 0.4]
      tl.to(p, {
        strokeDashoffset: 0,
        duration: durations[i] !== undefined ? durations[i] : 0.4,
        ease: 'power1.inOut'
      }, 'logo+=' + (0.225 + i * 0.15))
    })

    tl.set([svg, header.querySelector('.logo'), header.querySelector('.nav')], {
      pointerEvents: 'auto'
    }, 'logo+=1.06')
    tl.set(header.querySelectorAll('.link'), { pointerEvents: 'auto' }, 'logo+=1.06')

    tl.addLabel('nav', 'logo+=1.2')
    tl.to(navFirst, {
      yPercent: 0,
      duration: 1,
      stagger: 0.06,
      ease: 'power2.out'
    }, 'nav')

    tl.to(header.querySelectorAll('.time-toggle, .time-time, .time-contact'), {
      yPercent: 0,
      duration: 1,
      ease: 'power2.out'
    }, 'nav+=0.225')

    if (circle) {
      tl.to(circle, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power2.out'
      }, 'nav+=0.225')
    }

    tl.addLabel('gallery-stacked', 2.88)
    if (rotate) {
      tl.fromTo(rotate,
        { rotation: 0, autoAlpha: 0 },
        { rotation: m, autoAlpha: 1, duration: 1, ease: 'power2.out' },
        'gallery-stacked-=1'
      )
    }

    return tl
  }

  /* ---- hover swap for stacked nav links ---- */
  function bindLinks() {
    if (!gsap) return
    Array.prototype.forEach.call(header.querySelectorAll('.link'), function (link) {
      var spans = link.querySelectorAll('.link-inner > span')
      if (spans.length < 2) return
      var tl = gsap.timeline({ paused: true })
      tl.to(spans, { yPercent: -100, duration: 0.4, ease: 'power2.out', stagger: 0 })
      link.addEventListener('mouseenter', function () {
        if (link.classList.contains('menu-toggle')) return
        tl.play()
      })
      link.addEventListener('mouseleave', function () {
        if (link.classList.contains('menu-toggle')) return
        tl.reverse()
      })
    })
  }

  /* ---- rotating award badge, repeated every 90s ---- */
  function awardCycle() {
    if (!gsap || !award || !awardLines.length) return
    var logoSpans = []
    Array.prototype.forEach.call(logoLines, function (l) {
      logoSpans.push(l.querySelector('span:nth-child(1)'))
    })
    var mid = []
    var last = []
    Array.prototype.forEach.call(awardLines, function (l) {
      mid.push(l.querySelector('span:nth-child(2)'))
      last.push(l.querySelector('span:nth-child(3)'))
    })

    gsap.set(award, { autoAlpha: 0 })
    gsap.set(mid, { yPercent: 100 })
    gsap.set(last, { yPercent: 100 })

    var ease = 'power2.out'
    var hold = 1.5
    var seg = 0.4

    function run() {
      var tl = gsap.timeline()
      tl.set(award, { autoAlpha: 1 })
      tl.to(logoSpans, { yPercent: -100, duration: seg, ease: ease }, 0)
      tl.to(mid, { yPercent: 0, duration: seg, ease: ease }, 0)
      tl.to(mid, { yPercent: -100, duration: seg, ease: ease }, seg + hold)
      tl.to(last, { yPercent: 0, duration: seg, ease: ease }, seg + hold)
      tl.to(last, { yPercent: -100, duration: seg, ease: ease }, seg * 2 + hold * 2)
      tl.to(logoSpans, { yPercent: 0, duration: seg, ease: ease }, seg * 2 + hold * 2)
      tl.set(award, { autoAlpha: 0 }, seg * 3 + hold * 2)
      tl.set(mid, { yPercent: 100 })
      tl.set(last, { yPercent: 100 })
      return tl
    }

    var cycle = run().pause().progress(0)
    gsap.delayedCall(1, function repeat() {
      cycle.restart()
      gsap.delayedCall(90, repeat)
    })
  }

  window.BY.header = {
    setInitial: setInitial,
    playIntro: playIntro,
    bindLinks: bindLinks,
    awardCycle: awardCycle
  }
})()
