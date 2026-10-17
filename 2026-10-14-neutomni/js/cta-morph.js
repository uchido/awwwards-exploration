! function() {
    function e() {
        const e = window.innerWidth;
        return e <= l ? {
            key: "mobile",
            interaction: "drag",
            svgSelector: "#morphSvgMobile",
            otherSvgSelector: "#morphSvg",
            labelSelector: "#morphLabelMobile",
            otherLabelSelector: "#morphLabel",
            shapeSuffix: "-mobile",
            viewBox: "0 0 120 120",
            svgOrigin: "60 60",
            intrinsicSize: 120,
            checkpoints: [{
                progress: 0,
                baseId: "first",
                rotation: 0
            }, {
                progress: 1 / 3,
                baseId: "second",
                rotation: 90
            }, {
                progress: 2 / 3,
                baseId: "third",
                rotation: 180
            }, {
                progress: 1,
                baseId: "fourth",
                rotation: 270
            }]
        } : e <= a ? {
            key: "tablet",
            interaction: "drag",
            svgSelector: "#morphSvg",
            otherSvgSelector: "#morphSvgMobile",
            labelSelector: "#morphLabelMobile",
            otherLabelSelector: "#morphLabel",
            shapeSuffix: "",
            viewBox: "0 0 220 220",
            svgOrigin: "110 110",
            intrinsicSize: 220,
            checkpoints: [{
                progress: 0,
                baseId: "first",
                rotation: 0
            }, {
                progress: .2,
                baseId: "second",
                rotation: 90
            }, {
                progress: .4,
                baseId: "third",
                rotation: 180
            }, {
                progress: .6,
                baseId: "fourth",
                rotation: 270
            }, {
                progress: .8,
                baseId: "fifth",
                rotation: 360
            }, {
                progress: 1,
                baseId: "sixth",
                rotation: 450
            }]
        } : {
            key: "desktop",
            interaction: "hover",
            svgSelector: "#morphSvg",
            otherSvgSelector: "#morphSvgMobile",
            labelSelector: "#morphLabel",
            otherLabelSelector: "#morphLabelMobile",
            shapeSuffix: "",
            viewBox: "0 0 220 220",
            svgOrigin: "110 110",
            intrinsicSize: 220,
            checkpoints: [{
                progress: 0,
                baseId: "first",
                rotation: 0
            }, {
                progress: .2,
                baseId: "second",
                rotation: 90
            }, {
                progress: .4,
                baseId: "third",
                rotation: 180
            }, {
                progress: .6,
                baseId: "fourth",
                rotation: 270
            }, {
                progress: .8,
                baseId: "fifth",
                rotation: 360
            }, {
                progress: 1,
                baseId: "sixth",
                rotation: 450
            }]
        }
    }

    function t() {
        if (document.querySelector("#morph-mode-styles")) return;
        const e = document.createElement("style");
        e.id = "morph-mode-styles", e.textContent = "\n      #morphSvg,\n      #morphSvgMobile,\n      #morphLabel,\n      #morphLabelMobile {\n        will-change: transform;\n      }\n\n      #morphLabel {\n        pointer-events: auto;\n        position: relative;\n        z-index: 3;\n      }\n\n      #morphSvg {\n        position: relative;\n        z-index: 1;\n      }\n\n      #morphLabelMobile {\n        pointer-events: none;\n      }\n\n      .trail-clone {\n        will-change: opacity;\n        z-index: 0;\n      }\n    ", document.head.appendChild(e)
    }

    function n(e, t) {
        e && (e.hidden = !1, e.removeAttribute("hidden"), e.style.setProperty("display", t, "important"), e.style.setProperty("visibility", "visible", "important"), e.style.setProperty("opacity", "1", "important"))
    }

    function o(e) {
        e && (e.hidden = !0, e.style.setProperty("display", "none", "important"), e.style.setProperty("visibility", "hidden", "important"), e.style.setProperty("opacity", "0", "important"))
    }

    function r(e) {
        e && (e.style.setProperty("display", "inline-flex", "important"), e.style.setProperty("align-items", "center", "important"), e.style.setProperty("justify-content", "center", "important"), e.style.setProperty("width", "max-content", "important"), e.style.setProperty("max-width", "none", "important"), e.style.setProperty("white-space", "nowrap", "important"), e.style.setProperty("margin", "0", "important"))
    }

    function i(e) {
        const t = document.querySelector(e.svgSelector),
            i = document.querySelector(e.otherSvgSelector),
            s = document.querySelector(e.labelSelector),
            a = document.querySelector(e.otherLabelSelector);
        n(t, "block"), o(i), s && (n(s, "inline-flex"), r(s)), a && o(a)
    }

    function s() {
        function n() {
            const e = z.getBoundingClientRect();
            e.width > 0 && (q.shapeSize = e.width)
        }

        function o() {
            if (!C) return q.labelOffsetX = 0, void(q.labelOffsetY = 0);
            r(C), gsap.set(z, {
                x: 0,
                y: 0
            }), gsap.set(C, {
                x: 0,
                y: 0
            });
            const e = z.getBoundingClientRect(),
                t = C.getBoundingClientRect(),
                n = e.left + e.width / 2,
                o = e.top + e.height / 2,
                i = t.left + t.width / 2,
                s = t.top + t.height / 2;
            q.labelOffsetX = n - i, q.labelOffsetY = o - s
        }

        function a() {
            const e = gsap.timeline({
                paused: !0
            });
            e.set(B, {
                rotation: 0
            }, 0);
            for (let t = 1; t < P.checkpoints.length; t++) {
                const n = P.checkpoints[t - 1],
                    o = P.checkpoints[t];
                e.to(B, {
                    morphSVG: {
                        shape: "#" + o.shapeId,
                        type: "rotational",
                        origin: "50% 50%"
                    },
                    rotation: o.rotation,
                    transformOrigin: "50% 50%",
                    svgOrigin: I.svgOrigin,
                    duration: o.progress - n.progress,
                    ease: "linear"
                }, n.progress)
            }
            return e
        }

        function l(e) {
            const t = X.getBoundingClientRect(),
                n = q.shapeSize / 2;
            let o = e - t.left;
            o = Math.max(n, Math.min(t.width - n, o));
            const r = t.width - q.shapeSize,
                i = r > 0 ? (o - n) / r : 0;
            return {
                progress: Math.max(0, Math.min(1, i)),
                centerX: o,
                leftX: o - n
            }
        }

        function g(e) {
            const t = X.getBoundingClientRect(),
                n = q.shapeSize / 2;
            return n + e * (t.width - q.shapeSize) - n
        }

        function h(e) {
            const t = P.checkpoints[e],
                n = g(t.progress),
                o = q.originalPaths[t.shapeId];
            if (!o) return null;
            const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            r.setAttribute("width", q.shapeSize), r.setAttribute("height", q.shapeSize), r.setAttribute("viewBox", I.viewBox), r.setAttribute("class", "trail-clone");
            const i = document.createElementNS("http://www.w3.org/2000/svg", "path");
            return i.setAttribute("d", o), i.setAttribute("fill", "none"), i.setAttribute("stroke", "currentcolor"), i.setAttribute("stroke-width", "1"), r.appendChild(i), r.style.position = "absolute", r.style.left = n + "px", r.style.top = "0", r.style.pointerEvents = "none", r.style.transformOrigin = "50% 50%", r.style.transform = `rotate(${t.rotation}deg)`, r.style.zIndex = "0", X.appendChild(r), gsap.to(r, {
                opacity: 0,
                duration: P.trailFadeBase + q.trails.size * P.trailFadeIncrement,
                ease: "power2.out",
                onComplete: () => {
                    r.parentNode && r.parentNode.removeChild(r)
                }
            }), r
        }

        function f(e) {
            e && e.parentNode && (gsap.killTweensOf(e), e.parentNode.removeChild(e))
        }

        function m() {
            q.trails.forEach(f), q.trails.clear()
        }

        function v(e, t) {
            const n = .001,
                o = t > e;
            P.checkpoints.forEach(((r, i) => {
                const s = r.progress;
                if (o && e < s + n && t >= s + n || !o && e > s - n && t <= s - n) {
                    q.trails.has(i) && f(q.trails.get(i));
                    const e = h(i);
                    e && q.trails.set(i, e)
                }
            }))
        }

        function b(e, t) {
            t ? (gsap.to(z, {
                x: e,
                duration: .1,
                ease: "none",
                overwrite: "auto"
            }), C && gsap.to(C, {
                x: e + q.labelOffsetX,
                y: q.labelOffsetY,
                duration: .1,
                ease: "none",
                overwrite: "auto"
            })) : (gsap.set(z, {
                x: e
            }), C && gsap.set(C, {
                x: e + q.labelOffsetX,
                y: q.labelOffsetY
            }))
        }

        function y(e, t) {
            const n = q.currentProgress;
            q.currentProgress = e.progress, d = e.progress, q.timeline && q.timeline.progress(e.progress), b(e.leftX, t), v(n, q.currentProgress), q.previousProgress = q.currentProgress
        }

        function S(e) {
            y(l(e.clientX), !0)
        }

        function w(e) {
            const t = e.touches[0];
            if (!t) return;
            const n = z.getBoundingClientRect();
            t.clientX >= n.left && t.clientX <= n.right && t.clientY >= n.top && t.clientY <= n.bottom && (q.isDragging = !0, q.dragOffsetX = t.clientX - n.left, e.preventDefault())
        }

        function L(e) {
            if (!q.isDragging) return;
            const t = e.touches[0];
            if (!t) return;
            const n = X.getBoundingClientRect(),
                o = t.clientX - n.left - q.dragOffsetX;
            y(l(n.left + o + q.shapeSize / 2), !1), e.preventDefault()
        }

        function x() {
            q.isDragging = !1
        }

        function E(e) {
            function t(e) {
                if (!q.isDragging) return;
                const t = X.getBoundingClientRect(),
                    n = e.clientX - t.left - q.dragOffsetX;
                y(l(t.left + n + q.shapeSize / 2), !1)
            }

            function n() {
                q.isDragging = !1, document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n), A = null
            }
            if (0 !== e.button) return;
            const o = z.getBoundingClientRect();
            e.clientX >= o.left && e.clientX <= o.right && e.clientY >= o.top && e.clientY <= o.bottom && (q.isDragging = !0, q.dragOffsetX = e.clientX - o.left, e.preventDefault(), document.addEventListener("mousemove", t), document.addEventListener("mouseup", n), A = function() {
                document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n)
            })
        }

        function O() {
            n(), o();
            b(g(q.currentProgress), !1), q.timeline && q.timeline.progress(q.currentProgress)
        }

        function k() {
            if (e().key !== p) return u && u(), void s();
            O()
        }
        t();
        const I = e();
        p = I.key, i(I);
        const P = {
                trailFadeBase: .3,
                trailFadeIncrement: .4,
                checkpoints: I.checkpoints.map((e => ({
                    ...e,
                    shapeId: e.baseId + I.shapeSuffix
                })))
            },
            X = document.querySelector(".track"),
            z = document.querySelector(I.svgSelector),
            B = z && z.querySelector("#first" + I.shapeSuffix),
            C = document.querySelector(I.labelSelector),
            M = document.querySelector(".section.light.hover");
        if (!X || !z || !B) return void(u = null);
        let q = {
                timeline: null,
                currentProgress: d,
                previousProgress: d,
                shapeSize: I.intrinsicSize,
                trails: new Map,
                originalPaths: {},
                labelOffsetX: 0,
                labelOffsetY: 0,
                isDragging: !1,
                dragOffsetX: 0
            },
            A = null;
        P.checkpoints.forEach((e => {
            const t = document.querySelector("#" + e.shapeId);
            t && (q.originalPaths[e.shapeId] = t.getAttribute("d"))
        })), q.timeline = a(), gsap.set(z, {
            x: 0,
            y: 0,
            transformOrigin: "50% 50%"
        }), C && gsap.set(C, {
            x: 0,
            y: 0
        }), q.timeline.progress(d), O(), "hover" === I.interaction ? M && M.addEventListener("mousemove", S) : (X.addEventListener("touchstart", w, {
            passive: !1
        }), X.addEventListener("touchmove", L, {
            passive: !1
        }), X.addEventListener("touchend", x), X.addEventListener("touchcancel", x), c && X.addEventListener("mousedown", E)), window.addEventListener("resize", k), u = function() {
            M && M.removeEventListener("mousemove", S), X.removeEventListener("touchstart", w), X.removeEventListener("touchmove", L), X.removeEventListener("touchend", x), X.removeEventListener("touchcancel", x), X.removeEventListener("mousedown", E), A && A(), window.removeEventListener("resize", k), m(), q.timeline && q.timeline.kill(), gsap.killTweensOf(z), C && gsap.killTweensOf(C)
        }
    }
    const a = 991,
        l = 767,
        c = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let p = null,
        u = null,
        d = 0;
    s()
}();