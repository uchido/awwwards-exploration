function bringToFront(t) {
    window.topZ += 1, t.style.zIndex = window.topZ
}

function getNavBottom() {
    let t = 0;
    for (const e of navEls) {
        const i = e.getBoundingClientRect();
        i.height > 0 && (t = Math.max(t, i.bottom))
    }
    return t
}

function seedPosition(t) {
    const e = document.querySelector(t);
    if (!e || !e.parentElement) return;
    const i = e.style.left && "" !== e.style.left,
        n = e.style.top && "" !== e.style.top;
    if (i && n) return;
    const r = e.parentElement.getBoundingClientRect(),
        o = e.getBoundingClientRect();
    i || (e.style.left = o.left - r.left + "px"), n || (e.style.top = o.top - r.top + "px")
}

function makeDraggable(t, e, i = {}) {
    function n(t) {
        return t.touches && t.touches.length ? {
            x: t.touches[0].clientX,
            y: t.touches[0].clientY
        } : {
            x: t.clientX,
            y: t.clientY
        }
    }

    function r(t) {
        m = !0, p.style.transition = "none", bringToFront(p), u = p.style.overflow, p.style.overflow = "hidden";
        const e = a.getBoundingClientRect(),
            i = p.getBoundingClientRect(),
            r = p.style.left && "" !== p.style.left,
            o = p.style.top && "" !== p.style.top;
        f = r ? parseInt(p.style.left, 10) || 0 : i.left - e.left, d = o ? parseInt(p.style.top, 10) || 0 : i.top - e.top, p.style.left = f + "px", p.style.top = d + "px";
        const s = n(t);
        g = s.x, y = s.y, document.body.style.userSelect = "none"
    }

    function o(t) {
        if (!m) return;
        t.preventDefault();
        const e = n(t);
        let i = f + (e.x - g),
            r = d + (e.y - y);
        p.style.left = i + "px", p.style.top = r + "px";
        const o = a.getBoundingClientRect(),
            s = p.getBoundingClientRect();
        s.left < o.left && (i += o.left - s.left), s.right > o.right && (i -= s.right - o.right);
        const l = c ? Math.max(o.top, getNavBottom()) : o.top;
        s.top < l && (r += l - s.top), s.bottom > o.bottom && (r -= s.bottom - o.bottom), p.style.left = i + "px", p.style.top = r + "px"
    }

    function s() {
        m && (m = !1, document.body.style.userSelect = "", p.style.overflow = u || "", u = null)
    }
    const p = document.querySelector(t),
        l = document.querySelector(e);
    if (!p || !l) return;
    const a = p.parentElement,
        c = !1 !== i.clampToNav;
    l.style.touchAction = "none";
    let g, y, f, d, u = null,
        m = !1;
    l.addEventListener("mousedown", r), document.addEventListener("mousemove", o), document.addEventListener("mouseup", s), l.addEventListener("touchstart", r, {
        passive: !1
    }), document.addEventListener("touchmove", o, {
        passive: !1
    }), document.addEventListener("touchend", s), document.addEventListener("touchcancel", s)
}

function setupPopup(t, e, i, n = {}) {
    function r() {
        return g && window.pricingState ? window.pricingState.isScaledDown ? PRICING_SCALE : 1 : l
    }
    const o = document.querySelector(t),
        s = document.querySelector(e),
        p = document.querySelector(i);
    if (!s || !p) return;
    const l = n.openScale || 1,
        a = n.startOpen || !1,
        c = n.flyToIcon || !1,
        g = n.scrollControlled || !1,
        y = c ? 0 : .05;
    a && !g ? (bringToFront(s), s.style.display = "block", s.style.visibility = "visible", s.style.opacity = "1", s.style.transform = `scale(${l})`, s.style.transformOrigin = "center center", s.style.pointerEvents = "all") : g || (s.style.visibility = "hidden", s.style.display = "block", s.style.pointerEvents = "none", s.style.opacity = "0"), o && o.addEventListener("click", (function() {
        if (bringToFront(s), c) {
            const t = s.parentElement.getBoundingClientRect(),
                e = o.getBoundingClientRect(),
                i = e.left + e.width / 2 - t.left,
                n = e.top + e.height / 2 - t.top,
                p = r();
            let l, a, c, y;
            if (1 === p) l = 0, a = 0, c = 0, y = 0;
            else {
                const t = 20,
                    e = s.offsetHeight * (1 - p) - 20;
                l = t - s.offsetWidth / 2 * (1 - p), a = e - s.offsetHeight / 2 * (1 - p), c = 20, y = -20
            }
            s.style.transition = "none", s.style.left = "0px", s.style.top = "0px", s.style.transformOrigin = "center center", s.style.transform = `translate(${i-s.offsetWidth/2}px, ${n-s.offsetHeight/2}px) scale(0)`, s.style.visibility = "visible", s.offsetHeight, s.style.transition = `transform 0.5s ${EASE}, opacity 0.25s ease`, s.style.opacity = "1", s.style.transform = `translate(${l}px, ${a}px) scale(${p})`, s.style.pointerEvents = "all", g && window.pricingState && (window.pricingState.isMinimized = !1), s.addEventListener("transitionend", (function t() {
                s.removeEventListener("transitionend", t), s.style.transition = "none", s.style.transformOrigin = "bottom left", s.style.transform = `scale(${p})`, s.style.left = c + "px", s.style.top = y + "px"
            }))
        } else {
            s.style.transition = "none", s.style.transform = `scale(${l})`, s.style.visibility = "hidden", s.style.opacity = "0", s.offsetHeight;
            const t = o.getBoundingClientRect(),
                e = s.getBoundingClientRect(),
                i = t.left + t.width / 2 - e.left,
                n = t.top + t.height / 2 - e.top;
            s.style.transformOrigin = `${i}px ${n}px`, s.style.transform = `scale(${y})`, s.style.visibility = "visible", s.offsetHeight, s.style.transition = `transform 0.4s ${EASE}, opacity 0.25s ease`, s.style.transform = `scale(${l})`, s.style.opacity = "1", s.style.pointerEvents = "all"
        }
        seedPosition(e)
    })), p.addEventListener("click", (function() {
        if (c && o) {
            const t = s.getBoundingClientRect(),
                e = s.parentElement.getBoundingClientRect(),
                i = t.left - e.left,
                n = t.top - e.top,
                p = r(),
                l = i - s.offsetWidth / 2 * (1 - p),
                a = n - s.offsetHeight / 2 * (1 - p),
                c = o.getBoundingClientRect(),
                y = c.left + c.width / 2 - e.left,
                f = c.top + c.height / 2 - e.top;
            s.style.transition = "none", s.style.left = "0px", s.style.top = "0px", s.style.transformOrigin = "center center", s.style.transform = `translate(${l}px, ${a}px) scale(${p})`, s.offsetHeight, s.style.transition = `transform 0.5s ${EASE}, opacity 0.2s ease`, s.style.transform = `translate(${y-s.offsetWidth/2}px, ${f-s.offsetHeight/2}px) scale(0)`, s.style.pointerEvents = "none", g && window.pricingState && (window.pricingState.isMinimized = !0)
        } else {
            let t = "50%",
                e = "50%";
            if (o) {
                const i = o.getBoundingClientRect(),
                    n = s.getBoundingClientRect();
                t = i.left + i.width / 2 - n.left + "px", e = i.top + i.height / 2 - n.top + "px"
            }
            s.style.transformOrigin = `${t} ${e}`, s.style.transition = `transform 0.3s ${EASE}, opacity 0.2s ease`, s.style.transform = `scale(${y})`, s.style.opacity = "0", s.style.pointerEvents = "none"
        }
    })), s.addEventListener("mousedown", (function() {
        bringToFront(s)
    }))
}
window.topZ || (window.topZ = 1e5);
const navEls = [document.querySelector(".nav_section"), document.querySelector(".navbar")].filter(Boolean);
[".faq_wrapper", ".testimonial_wrapper", ".natalia_wrapper", ".andrii_wrapper", ".zefir_wrapper"].forEach(seedPosition), makeDraggable(".faq_wrapper", ".faq_grabb"), makeDraggable(".testimonial_wrapper", ".testimonial_grabb"), makeDraggable(".natalia_wrapper", ".natalia_grabb"), makeDraggable(".andrii_wrapper", ".andrii_grabb"), makeDraggable(".zefir_wrapper", ".zefir_grabb"), makeDraggable(".pricing_wrapper", ".pricing_grabb");
const EASE = "cubic-bezier(0.25,0.46,0.45,0.94)",
    PRICING_SCALE = .45,
    stickyWrapper = document.querySelector(".sticky_blur_wrapper"),
    pricingWrapper = document.querySelector(".pricing_wrapper"),
    pricingGrabb = document.querySelector(".pricing_grabb"),
    pricingBorders = document.querySelectorAll(".pricing_border");
if (stickyWrapper && pricingWrapper) {
    pricingGrabb && (pricingGrabb.style.opacity = "0"), pricingBorders.forEach((t => t.style.opacity = "0")), window.pricingState = {
        isMinimized: !1,
        isScaledDown: !1
    };
    let t = !1,
        e = !1;

    function setBadgeOpacity(t) {
        pricingGrabb && (pricingGrabb.style.transition = `opacity 0.5s ${EASE}`, pricingGrabb.style.opacity = t), pricingBorders.forEach((e => {
            e.style.transition = `opacity 0.5s ${EASE}`, e.style.opacity = t
        }))
    }

    function updatePricing() {
        const e = stickyWrapper.getBoundingClientRect(),
            i = stickyWrapper.offsetHeight - window.innerHeight,
            n = (i > 0 ? -e.top / i : 0) >= .7;
        if (n !== t)
            if (t = n, window.pricingState.isScaledDown = n, n) window.pricingState.isMinimized || (pricingWrapper.style.transition = `transform 0.5s ${EASE}, left 0.5s ${EASE}, top 0.5s ${EASE}`, pricingWrapper.style.transformOrigin = "bottom left", pricingWrapper.style.transform = `scale(${PRICING_SCALE})`, pricingWrapper.style.left = "20px", pricingWrapper.style.top = "-20px", pricingWrapper.style.pointerEvents = "all", setBadgeOpacity("1"));
            else {
                window.pricingState.isMinimized = !1, bringToFront(pricingWrapper), setBadgeOpacity("0");
                if ("hidden" === pricingWrapper.style.visibility || pricingWrapper.style.transform.includes("scale(0)")) pricingWrapper.style.transition = "none", pricingWrapper.style.left = "20px", pricingWrapper.style.top = "-20px", pricingWrapper.style.visibility = "visible", pricingWrapper.style.transformOrigin = "bottom left", pricingWrapper.style.transform = `scale(${PRICING_SCALE})`, pricingWrapper.style.pointerEvents = "all", pricingWrapper.offsetHeight, pricingWrapper.style.transition = `transform 0.5s ${EASE}, left 0.5s ${EASE}, top 0.5s ${EASE}`, pricingWrapper.style.transform = "scale(1)", pricingWrapper.style.left = "0px", pricingWrapper.style.top = "0px";
                else {
                    const t = pricingWrapper.getBoundingClientRect(),
                        e = pricingWrapper.parentElement.getBoundingClientRect(),
                        i = t.left - e.left,
                        n = t.top - e.top,
                        r = 1 - PRICING_SCALE,
                        o = i / r,
                        s = n / r;
                    pricingWrapper.style.transition = "none", pricingWrapper.style.left = "0px", pricingWrapper.style.top = "0px", pricingWrapper.style.transformOrigin = `${o}px ${s}px`, pricingWrapper.style.transform = `scale(${PRICING_SCALE})`, pricingWrapper.offsetHeight, pricingWrapper.style.transition = `transform 0.5s ${EASE}`, pricingWrapper.style.transform = "scale(1)"
                }
                pricingWrapper.style.pointerEvents = "all"
            }
    }
    window.addEventListener("scroll", (function() {
        e || (e = !0, requestAnimationFrame((function() {
            updatePricing(), e = !1
        })))
    }), {
        passive: !0
    })
}
setupPopup(".faq_icon", ".faq_wrapper", ".faq_close"), setupPopup(".testimonial_icon", ".testimonial_wrapper", ".testimonial_close"), setupPopup(".zefir_icon", ".zefir_wrapper", ".zefir_close"), setupPopup(".natalia_icon", ".natalia_wrapper", ".natalia_close"), setupPopup(".andrii_icon", ".andrii_wrapper", ".andrii_close"), setupPopup(".pricing_icon", ".pricing_wrapper", ".pricing_close", {
    openScale: PRICING_SCALE,
    flyToIcon: !0,
    scrollControlled: !0
});