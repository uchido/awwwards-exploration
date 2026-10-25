/* Home gallery: intro reveal + infinite wheel/drag scrolling + hovers */
(function () {
  'use strict'

  var gsap = window.gsap
  var BY = window.BY

  var gallery = document.querySelector('main.page--home .gallery')
  if (!gallery) { window.BY.gallery = { start: function () {} }; return }

  var items = Array.prototype.slice.call(gallery.querySelectorAll('.item'))
  var wrappers = items.map(function (i) { return i.querySelector('.item-wrapper') })
  var stages = items.map(function (i) { return i.querySelector('.item-stage') })
  var names = items.map(function (i) { return i.querySelector('.name') })
  var media = items.map(function (i) { return i.querySelector('.img > img, .img > .video-frame') })
  var videos = items.map(function (i) { return i.querySelector('video') })

  /* timings mirrored from the original bundle */
  var T = 2.88
  var S = [0, 0.76, 1.3, 1.58]
  var O = [0, 0.27, 0.5, 0.7]
  var special = { 2: { start: 1.3, mid: 1 } }
  var OT = 1.5      // initial image scale
  var ST = 1.2      // image scale after zoom
  var CT = 1.3      // zoom bump
  var LT = 1.15     // resting image scale
  var UT = 0.025
  var DT = 1.3      // clip reveal
  var FT = 1.65     // stage settle duration
  var PT = 4.5      // name reveal / interactive
  var HT = 0.15     // name stagger

  var LERP = 0.06
  var VEL_FACTOR = -0.002
  var VEL_CAP = 100
  var FRAME = 1000 / 60

  var itemEls = items
  var step = 0
  var total = 0
  var itemWidth = 0
  var gap = 0
  var padLeft = 0
  var bound = 2
  var setX = []
  var visible = items.map(function () { return false })
  var shown = items.map(function () { return false })

  var target = 0
  var pos = 0
  var prev = 0
  var vScale = 1
  var interactive = false
  var started = false
  var tickerBound = false
  var lastDragX = 0
  var dragVel = 0
  var moved = false

  function wrap(v) {
    if (step <= 0) return v
    var min = -step
    var max = total - step
    if (v < min) v += total
    else if (v > max) v -= total
    return v
  }

  function frameFactor(ms) {
    if (!isFinite(ms) || ms <= 0) ms = FRAME
    return Math.min(4, Math.max(0.25, ms / FRAME))
  }

  function decay(base, n) { return 1 - Math.pow(1 - base, n) }

  function measure() {
    if (!items.length) return false
    var style = getComputedStyle(gallery)
    gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0
    padLeft = parseFloat(style.paddingLeft) || 0
    itemWidth = items[0].getBoundingClientRect().width
    step = itemWidth + gap
    total = step * items.length
    bound = Math.max(2, gap)
    setX = items.map(function (el) {
      return gsap ? gsap.quickSetter(el, 'x', 'px') : function (v) { el.style.transform = 'translateX(' + v + 'px)' }
    })
    return true
  }

  function isMostlyVisible(r) {
    var vw = window.innerWidth
    var overlapX = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0))
    var overlapY = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0))
    var area = r.width * r.height
    return area > 0 && (overlapX * overlapY) / area >= 0.05
  }

  function applyScale() {
    wrappers.forEach(function (w) {
      if (!w) return
      if (vScale === 1) w.style.removeProperty('transform')
      else w.style.transform = 'scale(' + vScale + ')'
    })
  }

  function layout() {
    var vw = window.innerWidth
    for (var i = 0; i < items.length; i++) {
      var r = i * step
      var a = wrap(r - pos)
      var left = padLeft + a
      var vis = left < vw + bound && left + itemWidth > -bound
      setX[i](a - r)
      if (vis !== visible[i]) { visible[i] = vis; syncVideo(i) }
      var rect = items[i].getBoundingClientRect()
      var mostly = isMostlyVisible(rect)
      if (mostly !== shown[i]) { shown[i] = mostly; syncVideo(i) }
    }
  }

  function syncVideo(i) {
    var v = videos[i]
    if (!v) return
    if (!interactive || document.hidden) { v.pause(); return }
    if (shown[i]) { var p = v.play(); if (p && p.catch) p.catch(function () {}) }
    else v.pause()
  }

  function tick(time, deltaTime) {
    var n = frameFactor(deltaTime)
    var delta = target - pos
    if (Math.abs(delta) <= 0.01) pos = target
    else pos += delta * decay(LERP, n)

    var d = pos - prev
    prev = pos

    if (interactive) {
      var vPerFrame = d / n
      var goal = 1 + Math.min(VEL_CAP, Math.abs(vPerFrame)) * VEL_FACTOR
      var next = vScale + (goal - vScale) * decay(LERP, n)
      if (goal === 1 && Math.abs(1 - next) <= 0.0001) next = 1
      if (next !== vScale) { vScale = next; applyScale() }
    }
    layout()
  }

  function bindInput() {
    gallery.addEventListener('wheel', function (e) {
      if (!interactive) return
      e.preventDefault()
      var dx = e.deltaX
      var dy = e.deltaY
      target += (Math.abs(dx) > Math.abs(dy) ? dx : dy) * 2
    }, { passive: false })

    var down = false
    var startX = 0

    gallery.addEventListener('pointerdown', function (e) {
      if (!interactive) return
      if (e.button !== undefined && e.button !== 0) return
      down = true
      moved = false
      startX = lastDragX = e.clientX
      dragVel = 0
      try { gallery.setPointerCapture(e.pointerId) } catch (err) { /* noop */ }
    })

    gallery.addEventListener('pointermove', function (e) {
      if (!down) return
      var dx = e.clientX - lastDragX
      lastDragX = e.clientX
      if (Math.abs(e.clientX - startX) > 3) moved = true
      if (!moved) return
      target -= dx
      pos -= dx
      dragVel = dragVel * 0.6 + dx * 0.4
    })

    function release(e) {
      if (!down) return
      down = false
      if (moved) target -= dragVel * 4
      if (e && e.pointerId !== undefined) {
        try { gallery.releasePointerCapture(e.pointerId) } catch (err) { /* noop */ }
      }
      setTimeout(function () { moved = false }, 0)
    }

    gallery.addEventListener('pointerup', release)
    gallery.addEventListener('pointercancel', release)

    gallery.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation() }
    }, true)

    gallery.addEventListener('dragstart', function (e) { e.preventDefault() })

    window.addEventListener('resize', function () {
      if (!measure()) return
      layout()
    })
  }

  function bindHovers() {
    if (!gsap || !window.matchMedia('(min-width: 1025px)').matches) return
    items.forEach(function (item, i) {
      var spans = item.querySelectorAll('.name > span')
      var mediaEl = media[i]
      if (!spans.length) return
      var tl = gsap.timeline({ paused: true })
      tl.to(spans, { yPercent: -100, duration: 0.4, ease: 'power2.out' })
      item.addEventListener('mouseenter', function () {
        if (item.dataset.clicked === '1') return
        if (tl.progress() === 1) tl.restart(); else tl.play()
        gsap.to(item, { y: -8, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
        if (mediaEl) gsap.to(mediaEl, { y: 4, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      })
      item.addEventListener('mouseleave', function () {
        if (item.dataset.clicked === '1') return
        if (tl.progress() === 1) tl.reverse(); else tl.progress(0)
        gsap.to(item, { y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
        if (mediaEl) gsap.to(mediaEl, { y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      })
      item.addEventListener('click', function (e) {
        if (e.button !== undefined && e.button !== 0) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
      })
    })
  }

  function waitForImages() {
    var count = Math.min(4, items.length)
    var nodes = items.slice(0, count).map(function (it) { return it.querySelector('.img img') }).filter(Boolean)
    return new Promise(function (resolve) {
      var remaining = nodes.length
      if (!remaining) return resolve()
      var done = false
      var finish = function () {
        if (done) return
        done = true
        resolve()
      }
      nodes.forEach(function (img) {
        if (img.complete) {
          if (--remaining <= 0) finish()
          return
        }
        var dec = function () {
          if (--remaining <= 0) finish()
          img.removeEventListener('load', dec)
          img.removeEventListener('error', dec)
        }
        img.addEventListener('load', dec)
        img.addEventListener('error', dec)
      })
      setTimeout(finish, 4000)
    })
  }

  function intro() {
    if (!gsap || started) return
    started = true
    var o = Math.min(4, items.length)
    var desktop = window.matchMedia('(min-width: 1025px)').matches
    var s = desktop ? Math.min(4, o) : Math.min(2, o)
    var c = desktop ? 0.4 : 0.37
    var u = desktop ? 0.7 : 0.74
    var f = desktop ? O : [0, 0.15]
    var p = desktop ? O : [0, 0.27]
    var m = desktop ? PT : 4.1

    gallery.classList.remove('gallery--intro')
    gsap.set(gallery, { autoAlpha: 1, pointerEvents: 'none' })
    gsap.set(names.slice(0, o), { yPercent: 100 })

    var cx = window.innerWidth / 2
    var cy = window.innerHeight / 2
    var offsets = items.slice(0, o).map(function (el) {
      var r = el.getBoundingClientRect()
      return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) }
    })

    stages.slice(0, o).forEach(function (st, i) {
      gsap.set(st, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        x: offsets[i].x,
        y: offsets[i].y,
        scale: c - i * 0.001
      })
    })
    media.slice(0, o).forEach(function (el, i) {
      if (!el) return
      gsap.set(el, { scale: special[i] ? special[i].start : OT })
    })

    var tl = gsap.timeline({ delay: 0.6 })
    tl.to(stages.slice(0, o), {
      scale: function (i) { return u - i * 0.001 },
      duration: T,
      ease: 'gallerySlowStart'
    }, 0)

    media.slice(0, o).forEach(function (el, i) {
      if (!el) return
      tl.to(el, { scale: special[i] ? special[i].mid : ST, duration: T, ease: 'gallerySlowStart' }, 0)
    })

    for (var e = 0; e < o; e++) {
      (function (i) {
        var st = stages[i]
        tl.to(st, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: DT,
          ease: 'galleryReveal',
          onComplete: function () { gsap.set(st, { clipPath: 'none' }) }
        }, S[o - 1 - i])
      })(e)
    }

    for (var j = 0; j < s; j++) {
      (function (i) {
        var start = T + f[i]
        var end = T + FT
        tl.to(stages[i], {
          scale: 1,
          x: 0,
          y: 0,
          duration: end - start,
          ease: 'galleryReveal'
        }, start)

        var bump = special[i] ? UT : p[i]
        if (f[i] > 0) {
          tl.to(media[i], { scale: CT, duration: bump, ease: 'galleryZoomBump' }, T)
        }
        var imgStart = Math.max(start, T + (f[i] > 0 ? bump : 0))
        tl.to(media[i], { scale: LT, duration: end - imgStart, ease: 'galleryReveal' }, imgStart)
      })(j)
    }

    tl.set(gallery, { pointerEvents: 'auto' }, T + FT)
    tl.call(function () {
      interactive = true
      items.forEach(function (_, i) { syncVideo(i) })
    }, null, T + FT)

    tl.to(names.slice(0, s), {
      yPercent: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: HT
    }, m)

    return tl
  }

  function start() {
    if (!measure()) return
    if (!tickerBound) { gsap.ticker.add(tick); tickerBound = true }
    bindInput()
    bindHovers()
    return waitForImages().then(intro)
  }

  window.BY.gallery = { start: start, intro: intro }
})()
