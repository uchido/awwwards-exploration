/* Local clock / "time travel" easter egg in the header */
(function () {
  'use strict'

  var gsap = window.gsap
  var BY = window.BY
  var STORAGE_KEY = 'clock-offset'

  var easter = document.querySelector('.easter')
  var egg = document.querySelector('.egg')
  var rotateEl = document.querySelector('.egg .rotate')
  var followEl = document.querySelector('.egg .follow-rotate')
  var circleEl = document.querySelector('.egg-svg circle')
  var timeEl = document.querySelector('.time-time')
  var timeInner = document.querySelector('.time-inner')
  var labelEl = document.querySelector('.time-label')
  var resetEl = document.querySelector('.time-reset')
  var contactTimeEl = document.querySelector('.time-contact__time')

  var offset = 0
  try { offset = parseInt(window.localStorage.getItem(STORAGE_KEY) || '0', 10) || 0 } catch (e) { offset = 0 }

  function now() { return new Date(Date.now() + offset) }

  function pad(n) { return n < 10 ? '0' + n : '' + n }

  function rotationFor(date) {
    return (date.getHours() % 12) * 30 + date.getMinutes() * 0.5
  }

  function renderTime() {
    var d = now()
    var hh = pad(d.getHours())
    var mm = pad(d.getMinutes())
    var dot = '\u00A0\u00A0\u00A0. '
    if (timeEl) timeEl.innerHTML = hh + '<span class="time-dot">' + dot + '</span>' + mm
    if (contactTimeEl) contactTimeEl.innerHTML = hh + '<span class="time-dot">\u00A0\u00A0. </span>' + mm
    setToggleState(offset !== 0)
  }

  var toggled = null
  function setToggleState(traveling) {
    if (toggled === traveling) return
    toggled = traveling
    if (!labelEl || !resetEl) return
    if (gsap) {
      gsap.to([labelEl, resetEl], {
        yPercent: traveling ? -100 : 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true
      })
    } else {
      labelEl.style.transform = traveling ? 'translateY(-100%)' : ''
      resetEl.style.transform = traveling ? 'translateY(-100%)' : ''
    }
  }

  function setRotation(deg, duration) {
    if (!rotateEl) return
    if (!gsap) {
      rotateEl.style.transform = 'rotate(' + deg + 'deg)'
      if (followEl) followEl.style.transform = 'rotate(' + deg + 'deg)'
      return
    }
    gsap.to([rotateEl, followEl], {
      rotation: deg,
      duration: duration === undefined ? 1 : duration,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }

  function sync(instant) {
    renderTime()
    setRotation(rotationFor(now()), instant ? 0 : 1)
    BY.theme.applyTheme(now(), !instant)
  }

  function save() {
    try { window.localStorage.setItem(STORAGE_KEY, String(offset)) } catch (e) { /* noop */ }
  }

  function applyOffset(deltaMinutes) {
    offset += deltaMinutes * 60000
    save()
    sync(false)
  }

  function resetOffset() {
    offset = 0
    save()
    sync(false)
  }

  /* ---- drag the ring to travel through time ---- */
  function bindDrag() {
    if (!egg || !rotateEl) return
    var dragging = false
    var startPointer = 0
    var startRotation = 0

    function center() {
      var r = egg.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }

    function angleAt(clientX, clientY) {
      var c = center()
      var dx = clientX - c.x
      var dy = clientY - c.y
      var a = Math.atan2(dx, -dy) * 180 / Math.PI
      return (a + 360) % 360
    }

    function currentRotation() {
      if (!gsap) return rotationFor(now())
      return gsap.getProperty(rotateEl, 'rotation') || 0
    }

    egg.addEventListener('pointerdown', function (e) {
      dragging = true
      startPointer = angleAt(e.clientX, e.clientY)
      startRotation = currentRotation()
      document.documentElement.classList.add('clock-grabbing')
      egg.classList.add('egg--grabbing')
      try { egg.setPointerCapture(e.pointerId) } catch (err) { /* noop */ }
      e.preventDefault()
    })

    egg.addEventListener('pointermove', function (e) {
      if (dragging) {
        var a = angleAt(e.clientX, e.clientY)
        var delta = a - startPointer
        while (delta > 180) delta -= 360
        while (delta < -180) delta += 360
        var target = startRotation + delta
        if (gsap) {
          gsap.set([rotateEl, followEl], { rotation: target })
        } else {
          rotateEl.style.transform = 'rotate(' + target + 'deg)'
          if (followEl) followEl.style.transform = 'rotate(' + target + 'deg)'
        }
        return
      }
      if (!easter) return
      var ang = angleAt(e.clientX, e.clientY)
      egg.classList.toggle('egg--grab', ang < 40 || ang > 320)
    })

    function endDrag(e) {
      if (!dragging) return
      dragging = false
      document.documentElement.classList.remove('clock-grabbing')
      egg.classList.remove('egg--grabbing')
      var target = currentRotation()
      var current = rotationFor(now())
      var delta = ((target - current) % 360 + 540) % 360 - 180
      applyOffset(delta / 0.5)
      if (e && e.pointerId !== undefined) {
        try { egg.releasePointerCapture(e.pointerId) } catch (err) { /* noop */ }
      }
    }

    egg.addEventListener('pointerup', endDrag)
    egg.addEventListener('pointercancel', endDrag)
    egg.addEventListener('lostpointercapture', endDrag)

    egg.addEventListener('click', function (e) {
      if (resetEl && e.target === resetEl) return
    })

    if (resetEl) {
      resetEl.addEventListener('click', function (e) {
        e.stopPropagation()
        resetOffset()
      })
      resetEl.style.pointerEvents = 'auto'
    }
  }

  var timer = null
  function tick() {
    var d = now()
    renderTime()
    setRotation(rotationFor(d), 1)
    BY.theme.applyTheme(d, true)
  }

  function start() {
    sync(true)
    bindDrag()
    if (timer) clearInterval(timer)
    timer = setInterval(tick, 60000)
    // line the first tick up with the next minute boundary
    var ms = 60000 - (Date.now() % 60000)
    setTimeout(function () {
      tick()
      if (timer) clearInterval(timer)
      timer = setInterval(tick, 60000)
    }, ms)
  }

  window.BY.clock = {
    start: start,
    sync: sync,
    now: now,
    rotationFor: rotationFor
  }
})()
