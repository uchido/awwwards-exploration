/* Time theme + custom easing (mirror of the original inline head script) */
(function () {
  'use strict'

  var root = document.documentElement
  var gsap = window.gsap

  var BG_STOPS = [
    { hour: 0, bg: '#2C2922', ov: 0.1, br: 0.2 },
    { hour: 4, bg: '#2C2922', ov: 0.1, br: 0.2 },
    { hour: 5, bg: '#60594C', ov: 0.08, br: 0.36 },
    { hour: 6, bg: '#857C6A', ov: 0.06, br: 0.52 },
    { hour: 7, bg: '#A59D8A', ov: 0.04, br: 0.68 },
    { hour: 8, bg: '#CEC9BB', ov: 0.02, br: 0.84 },
    { hour: 9, bg: '#F8F6F2', ov: 0, br: 1 },
    { hour: 16, bg: '#F8F6F2', ov: 0, br: 1 },
    { hour: 17, bg: '#CEC9BB', ov: 0.02, br: 0.84 },
    { hour: 18, bg: '#A59D8A', ov: 0.04, br: 0.68 },
    { hour: 19, bg: '#7C725E', ov: 0.06, br: 0.52 },
    { hour: 20, bg: '#534C3D', ov: 0.08, br: 0.36 },
    { hour: 21, bg: '#2C2922', ov: 0.1, br: 0.2 },
    { hour: 24, bg: '#2C2922', ov: 0.1, br: 0.2 }
  ]

  var TEXT_STEPS = [
    { hour: 0, key: 'night' },
    { hour: 5, key: 'yellow' },
    { hour: 6, key: 'day' },
    { hour: 19, key: 'yellow' },
    { hour: 20, key: 'night' }
  ]

  var TEXT_COLORS = {
    night: { ui: '#C3BEB1', sel: 'rgba(255, 238, 194, 0.2)' },
    yellow: { ui: '#F1C345', sel: 'rgba(68, 48, 0, 0.2)' },
    day: { ui: '#111111', sel: 'rgba(68, 48, 0, 0.2)' }
  }

  var COLOR_PROPS = ['--color-main', '--color-bg', '--selection-color', '--selection-bg']

  function getTimeThemeTextKey(date, steps) {
    steps = steps || TEXT_STEPS
    var hour = date.getHours() + date.getMinutes() / 60
    var index = 0
    while (index < steps.length - 1 && steps[index + 1].hour <= hour) index++
    return steps[index].key
  }

  function interpolateNumber(from, to, progress) { return from + (to - from) * progress }

  function parseColor(color) {
    if (color.charAt(0) === '#') {
      var hex = color.slice(1)
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        1
      ]
    }
    var channels = color.match(/[\d.]+/g).map(Number)
    return [channels[0], channels[1], channels[2], channels[3] === undefined ? 1 : channels[3]]
  }

  function interpolateColor(from, to, progress) {
    var a = parseColor(from)
    var b = parseColor(to)
    var channels = a.slice(0, 3).map(function (c, i) { return Math.round(interpolateNumber(c, b[i], progress)) })
    var alpha = Math.round(interpolateNumber(a[3], b[3], progress) * 10000) / 10000
    return 'rgba(' + channels.join(',') + ',' + alpha + ')'
  }

  function formatColor(color) { return interpolateColor(color, color, 0) }

  function getTimeTheme(date) {
    var hour = date.getHours() + date.getMinutes() / 60
    var text = TEXT_COLORS[getTimeThemeTextKey(date)]
    var index = 0
    while (index < BG_STOPS.length - 1 && BG_STOPS[index + 1].hour <= hour) index++
    var from = BG_STOPS[index]
    var to = BG_STOPS[Math.min(index + 1, BG_STOPS.length - 1)]
    var range = to.hour - from.hour
    var progress = range > 0 ? (hour - from.hour) / range : 0
    return {
      '--color-main': formatColor(text.ui),
      '--color-bg': interpolateColor(from.bg, to.bg, progress),
      '--img-over-opacity': String(interpolateNumber(from.ov, to.ov, progress)),
      '--bg-brightness': String(interpolateNumber(from.br, to.br, progress)),
      '--selection-color': formatColor(text.ui),
      '--selection-bg': formatColor(text.sel)
    }
  }

  function current(prop) {
    var v = root.style.getPropertyValue(prop)
    if (v) return v
    return getComputedStyle(root).getPropertyValue(prop).trim()
  }

  function applyTheme(date, animate) {
    var target = getTimeTheme(date)
    if (!gsap || !animate) {
      Object.keys(target).forEach(function (k) { root.style.setProperty(k, target[k]) })
      root.style.backgroundColor = 'var(--color-bg)'
      root.style.color = 'var(--color-main)'
      return
    }
    var start = {}
    var fromColor = {}
    var numeric = {}
    Object.keys(target).forEach(function (k) {
      start[k] = current(k) || target[k]
      if (COLOR_PROPS.indexOf(k) !== -1) fromColor[k] = start[k]
      else numeric[k] = parseFloat(start[k]) || 0
    })

    gsap.killTweensOf(numeric)
    gsap.to(numeric, {
      duration: 0.25,
      ease: 'none',
      overwrite: true,
      onUpdate: function () {
        Object.keys(numeric).forEach(function (k) { root.style.setProperty(k, String(numeric[k])) })
      },
      onComplete: function () {
        Object.keys(numeric).forEach(function (k) { root.style.setProperty(k, target[k]) })
      }
    })

    var state = { p: 0 }
    gsap.killTweensOf(state)
    gsap.to(state, {
      p: 1,
      duration: 0.7,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: function () {
        COLOR_PROPS.forEach(function (k) {
          root.style.setProperty(k, interpolateColor(fromColor[k], target[k], state.p))
        })
      },
      onComplete: function () {
        COLOR_PROPS.forEach(function (k) { root.style.setProperty(k, target[k]) })
      }
    })
    root.style.backgroundColor = 'var(--color-bg)'
    root.style.color = 'var(--color-main)'
  }

  /* cubic-bezier ease factory (replaces the paid CustomEase plugin) */
  function cubicBezier(x1, y1, x2, y2) {
    var A = function (a, b) { return 1 - 3 * b + 3 * a }
    var B = function (a, b) { return 3 * b - 6 * a }
    var C = function (a) { return 3 * a }
    var calc = function (t, a, b) { return ((A(a, b) * t + B(a, b)) * t + C(a)) * t }
    var slope = function (t, a, b) { return 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a) }
    return function (p) {
      if (p <= 0) return 0
      if (p >= 1) return 1
      var t = p
      for (var i = 0; i < 6; i++) {
        var s = slope(t, x1, x2)
        if (s === 0) break
        var x = calc(t, x1, x2) - p
        t -= x / s
      }
      return calc(t, y1, y2)
    }
  }

  var eases = {
    gallerySlowStart: cubicBezier(0.9, 0, 0.58, 1),
    galleryReveal: cubicBezier(0.46, 0, 0.09, 1),
    galleryZoomBump: cubicBezier(0.5, 0, 0.5, 1),
    pageSpread: cubicBezier(0.46, 0, 0.09, 0.99)
  }

  if (gsap) {
    Object.keys(eases).forEach(function (name) {
      gsap.registerEase(name, eases[name])
    })
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger)
  }

  /* DrawSVG is a premium plugin — recreate it with stroke-dasharray. */
  function dashInit(el) {
    var len
    try { len = el.getTotalLength() } catch (e) { len = 0 }
    if (!len) len = 1
    el.style.strokeDasharray = len + 'px'
    el.style.strokeDashoffset = len + 'px'
    return len
  }

  function prepareDraw(targets) {
    return Array.prototype.slice.call(targets).map(function (el) {
      return { el: el, len: dashInit(el) }
    })
  }

  window.BY = window.BY || {}
  window.BY.theme = {
    getTimeTheme: getTimeTheme,
    applyTheme: applyTheme,
    eases: eases,
    dashInit: dashInit,
    prepareDraw: prepareDraw
  }
})()
