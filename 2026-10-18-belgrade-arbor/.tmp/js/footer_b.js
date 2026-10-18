(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 80853, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(71645),
        s = e.i(18566),
        n = "1.3.23";

    function r(e, t, i) {
        return Math.max(e, Math.min(t, i))
    }
    var o = class {
            isRunning = !1;
            value = 0;
            from = 0;
            to = 0;
            currentTime = 0;
            lerp;
            duration;
            easing;
            onUpdate;
            advance(e) {
                if (!this.isRunning) return;
                let t = !1;
                if (this.duration && this.easing) {
                    this.currentTime += e;
                    let i = r(0, this.currentTime / this.duration, 1),
                        s = (t = i >= 1) ? 1 : this.easing(i);
                    this.value = this.from + (this.to - this.from) * s
                } else if (this.lerp) {
                    var i, s, n, o;
                    this.value = (i = this.value, s = this.to, n = 60 * this.lerp, (1 - (o = 1 - Math.exp(-n * e))) * i + o * s), Math.round(this.value) === Math.round(this.to) && (this.value = this.to, t = !0)
                } else this.value = this.to, t = !0;
                t && this.stop(), this.onUpdate?.(this.value, t)
            }
            stop() {
                this.isRunning = !1
            }
            fromTo(e, t, {
                lerp: i,
                duration: s,
                easing: n,
                onStart: r,
                onUpdate: o
            }) {
                this.from = this.value = e, this.to = t, this.lerp = i, this.duration = s, this.easing = n, this.currentTime = 0, this.isRunning = !0, r?.(), this.onUpdate = o
            }
        },
        l = class {
            width = 0;
            height = 0;
            scrollHeight = 0;
            scrollWidth = 0;
            debouncedResize;
            wrapperResizeObserver;
            contentResizeObserver;
            constructor(e, t, {
                autoResize: i = !0,
                debounce: s = 250
            } = {}) {
                this.wrapper = e, this.content = t, i && (this.debouncedResize = function(e, t) {
                    let i;
                    return function(...s) {
                        clearTimeout(i), i = setTimeout(() => {
                            i = void 0, e.apply(this, s)
                        }, t)
                    }
                }(this.resize, s), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize()
            }
            destroy() {
                this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize)
            }
            resize = () => {
                this.onWrapperResize(), this.onContentResize()
            };
            onWrapperResize = () => {
                this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight)
            };
            onContentResize = () => {
                this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth)
            };
            get limit() {
                return {
                    x: this.scrollWidth - this.width,
                    y: this.scrollHeight - this.height
                }
            }
        },
        a = class {
            events = {};
            emit(e, ...t) {
                let i = this.events[e] || [];
                for (let e = 0, s = i.length; e < s; e++) i[e]?.(...t)
            }
            on(e, t) {
                return this.events[e] ? this.events[e].push(t) : this.events[e] = [t], () => {
                    this.events[e] = this.events[e]?.filter(e => t !== e)
                }
            }
            off(e, t) {
                this.events[e] = this.events[e]?.filter(e => t !== e)
            }
            destroy() {
                this.events = {}
            }
        };
    let c = 100 / 6,
        h = {
            passive: !1
        };

    function d(e, t) {
        return 1 === e ? c : 2 === e ? t : 1
    }
    var u = class {
        touchStart = {
            x: 0,
            y: 0
        };
        lastDelta = {
            x: 0,
            y: 0
        };
        window = {
            width: 0,
            height: 0
        };
        emitter = new a;
        constructor(e, t = {
            wheelMultiplier: 1,
            touchMultiplier: 1
        }) {
            this.element = e, this.options = t, window.addEventListener("resize", this.onWindowResize), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, h), this.element.addEventListener("touchstart", this.onTouchStart, h), this.element.addEventListener("touchmove", this.onTouchMove, h), this.element.addEventListener("touchend", this.onTouchEnd, h)
        }
        on(e, t) {
            return this.emitter.on(e, t)
        }
        destroy() {
            this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize), this.element.removeEventListener("wheel", this.onWheel, h), this.element.removeEventListener("touchstart", this.onTouchStart, h), this.element.removeEventListener("touchmove", this.onTouchMove, h), this.element.removeEventListener("touchend", this.onTouchEnd, h)
        }
        onTouchStart = e => {
            let {
                clientX: t,
                clientY: i
            } = e.targetTouches ? e.targetTouches[0] : e;
            this.touchStart.x = t, this.touchStart.y = i, this.lastDelta = {
                x: 0,
                y: 0
            }, this.emitter.emit("scroll", {
                deltaX: 0,
                deltaY: 0,
                event: e
            })
        };
        onTouchMove = e => {
            let {
                clientX: t,
                clientY: i
            } = e.targetTouches ? e.targetTouches[0] : e, s = -(t - this.touchStart.x) * this.options.touchMultiplier, n = -(i - this.touchStart.y) * this.options.touchMultiplier;
            this.touchStart.x = t, this.touchStart.y = i, this.lastDelta = {
                x: s,
                y: n
            }, this.emitter.emit("scroll", {
                deltaX: s,
                deltaY: n,
                event: e
            })
        };
        onTouchEnd = e => {
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: e
            })
        };
        onWheel = e => {
            let {
                deltaX: t,
                deltaY: i,
                deltaMode: s
            } = e, n = d(s, this.window.width), r = d(s, this.window.height);
            t *= n, i *= r, t *= this.options.wheelMultiplier, i *= this.options.wheelMultiplier, this.emitter.emit("scroll", {
                deltaX: t,
                deltaY: i,
                event: e
            })
        };
        onWindowResize = () => {
            this.window = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    };
    let m = e => Math.min(1, 1.001 - 2 ** (-10 * e));
    var f = class {
            _isScrolling = !1;
            _isStopped = !1;
            _isLocked = !1;
            _preventNextNativeScrollEvent = !1;
            _resetVelocityTimeout = null;
            _rafId = null;
            isTouching;
            time = 0;
            userData = {};
            lastVelocity = 0;
            velocity = 0;
            direction = 0;
            options;
            targetScroll;
            animatedScroll;
            animate = new o;
            emitter = new a;
            dimensions;
            virtualScroll;
            constructor({
                wrapper: e = window,
                content: t = document.documentElement,
                eventsTarget: i = e,
                smoothWheel: s = !0,
                syncTouch: r = !1,
                syncTouchLerp: o = .075,
                touchInertiaExponent: a = 1.7,
                duration: c,
                easing: h,
                lerp: d = .1,
                infinite: f = !1,
                orientation: p = "vertical",
                gestureOrientation: v = "horizontal" === p ? "both" : "vertical",
                touchMultiplier: g = 1,
                wheelMultiplier: x = 1,
                autoResize: w = !0,
                prevent: y,
                virtualScroll: b,
                overscroll: S = !0,
                autoRaf: N = !1,
                anchors: E = !1,
                autoToggle: j = !1,
                allowNestedScroll: L = !1,
                __experimental__naiveDimensions: k = !1,
                naiveDimensions: T = k,
                stopInertiaOnNavigate: _ = !1
            } = {}) {
                window.lenisVersion = n, window.lenis || (window.lenis = {}), window.lenis.version = n, "horizontal" === p && (window.lenis.horizontal = !0), !0 === r && (window.lenis.touch = !0), e && e !== document.documentElement || (e = window), "number" == typeof c && "function" != typeof h ? h = m : "function" == typeof h && "number" != typeof c && (c = 1), this.options = {
                    wrapper: e,
                    content: t,
                    eventsTarget: i,
                    smoothWheel: s,
                    syncTouch: r,
                    syncTouchLerp: o,
                    touchInertiaExponent: a,
                    duration: c,
                    easing: h,
                    lerp: d,
                    infinite: f,
                    gestureOrientation: v,
                    orientation: p,
                    touchMultiplier: g,
                    wheelMultiplier: x,
                    autoResize: w,
                    prevent: y,
                    virtualScroll: b,
                    overscroll: S,
                    autoRaf: N,
                    anchors: E,
                    autoToggle: j,
                    allowNestedScroll: L,
                    naiveDimensions: T,
                    stopInertiaOnNavigate: _
                }, this.dimensions = new l(e, t, {
                    autoResize: w
                }), this.updateClassName(), this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll), this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
                    capture: !0
                }), (this.options.anchors || this.options.stopInertiaOnNavigate) && this.options.wrapper.addEventListener("click", this.onClick), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown), this.virtualScroll = new u(i, {
                    touchMultiplier: g,
                    wheelMultiplier: x
                }), this.virtualScroll.on("scroll", this.onVirtualScroll), this.options.autoToggle && (this.checkOverflow(), this.rootElement.addEventListener("transitionend", this.onTransitionEnd)), this.options.autoRaf && (this._rafId = requestAnimationFrame(this.raf))
            }
            destroy() {
                this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll), this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
                    capture: !0
                }), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown), (this.options.anchors || this.options.stopInertiaOnNavigate) && this.options.wrapper.removeEventListener("click", this.onClick), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName(), this._rafId && cancelAnimationFrame(this._rafId)
            }
            on(e, t) {
                return this.emitter.on(e, t)
            }
            off(e, t) {
                return this.emitter.off(e, t)
            }
            onScrollEnd = e => {
                e instanceof CustomEvent || "smooth" !== this.isScrolling && !1 !== this.isScrolling || e.stopPropagation()
            };
            dispatchScrollendEvent = () => {
                this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
                    bubbles: this.options.wrapper === window,
                    detail: {
                        lenisScrollEnd: !0
                    }
                }))
            };
            get overflow() {
                let e = this.isHorizontal ? "overflow-x" : "overflow-y";
                return getComputedStyle(this.rootElement)[e]
            }
            checkOverflow() {
                ["hidden", "clip"].includes(this.overflow) ? this.internalStop() : this.internalStart()
            }
            onTransitionEnd = e => {
                e.propertyName?.includes("overflow") && e.target === this.rootElement && this.checkOverflow()
            };
            setScroll(e) {
                this.isHorizontal ? this.options.wrapper.scrollTo({
                    left: e,
                    behavior: "instant"
                }) : this.options.wrapper.scrollTo({
                    top: e,
                    behavior: "instant"
                })
            }
            onClick = e => {
                let t = e.composedPath().filter(e => e instanceof HTMLAnchorElement && e.href).map(e => new URL(e.href)),
                    i = new URL(window.location.href);
                if (this.options.anchors) {
                    let e = t.find(e => i.host === e.host && i.pathname === e.pathname && e.hash);
                    if (e) {
                        let t = "object" == typeof this.options.anchors && this.options.anchors ? this.options.anchors : void 0,
                            i = `#${e.hash.split("#")[1]}`;
                        this.scrollTo(i, t);
                        return
                    }
                }
                if (this.options.stopInertiaOnNavigate && t.some(e => i.host === e.host && i.pathname !== e.pathname)) return void this.reset()
            };
            onPointerDown = e => {
                1 === e.button && this.reset()
            };
            onVirtualScroll = e => {
                if ("function" == typeof this.options.virtualScroll && !1 === this.options.virtualScroll(e)) return;
                let {
                    deltaX: t,
                    deltaY: i,
                    event: s
                } = e;
                if (this.emitter.emit("virtual-scroll", {
                        deltaX: t,
                        deltaY: i,
                        event: s
                    }), s.ctrlKey || s.lenisStopPropagation) return;
                let n = s.type.includes("touch"),
                    r = s.type.includes("wheel");
                this.isTouching = "touchstart" === s.type || "touchmove" === s.type;
                let o = 0 === t && 0 === i;
                if (this.options.syncTouch && n && "touchstart" === s.type && o && !this.isStopped && !this.isLocked) return void this.reset();
                let l = "vertical" === this.options.gestureOrientation && 0 === i || "horizontal" === this.options.gestureOrientation && 0 === t;
                if (o || l) return;
                let a = s.composedPath();
                a = a.slice(0, a.indexOf(this.rootElement));
                let c = this.options.prevent,
                    h = Math.abs(t) >= Math.abs(i) ? "horizontal" : "vertical";
                if (a.find(e => e instanceof HTMLElement && ("function" == typeof c && c?.(e) || e.hasAttribute?.("data-lenis-prevent") || "vertical" === h && e.hasAttribute?.("data-lenis-prevent-vertical") || "horizontal" === h && e.hasAttribute?.("data-lenis-prevent-horizontal") || n && e.hasAttribute?.("data-lenis-prevent-touch") || r && e.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(e, {
                        deltaX: t,
                        deltaY: i
                    })))) return;
                if (this.isStopped || this.isLocked) {
                    s.cancelable && s.preventDefault();
                    return
                }
                if (!(this.options.syncTouch && n || this.options.smoothWheel && r)) {
                    this.isScrolling = "native", this.animate.stop(), s.lenisStopPropagation = !0;
                    return
                }
                let d = i;
                "both" === this.options.gestureOrientation ? d = Math.abs(i) > Math.abs(t) ? i : t : "horizontal" === this.options.gestureOrientation && (d = t), (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || 0 === this.animatedScroll && i > 0 || this.animatedScroll === this.limit && i < 0)) && (s.lenisStopPropagation = !0), s.cancelable && s.preventDefault();
                let u = n && this.options.syncTouch,
                    m = n && "touchend" === s.type;
                m && (d = Math.sign(d) * Math.abs(this.velocity) ** this.options.touchInertiaExponent), this.scrollTo(this.targetScroll + d, {
                    programmatic: !1,
                    ...u ? {
                        lerp: m ? this.options.syncTouchLerp : 1
                    } : {
                        lerp: this.options.lerp,
                        duration: this.options.duration,
                        easing: this.options.easing
                    }
                })
            };
            resize() {
                this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit()
            }
            emit() {
                this.emitter.emit("scroll", this)
            }
            onNativeScroll = () => {
                if (null !== this._resetVelocityTimeout && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNextNativeScrollEvent) {
                    this._preventNextNativeScrollEvent = !1;
                    return
                }
                if (!1 === this.isScrolling || "native" === this.isScrolling) {
                    let e = this.animatedScroll;
                    this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - e, this.direction = Math.sign(this.animatedScroll - e), this.isStopped || (this.isScrolling = "native"), this.emit(), 0 !== this.velocity && (this._resetVelocityTimeout = setTimeout(() => {
                        this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit()
                    }, 400))
                }
            };
            reset() {
                this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop()
            }
            start() {
                if (this.isStopped) {
                    if (this.options.autoToggle) return void this.rootElement.style.removeProperty("overflow");
                    this.internalStart()
                }
            }
            internalStart() {
                this.isStopped && (this.reset(), this.isStopped = !1, this.emit())
            }
            stop() {
                if (!this.isStopped) {
                    if (this.options.autoToggle) return void this.rootElement.style.setProperty("overflow", "clip");
                    this.internalStop()
                }
            }
            internalStop() {
                this.isStopped || (this.reset(), this.isStopped = !0, this.emit())
            }
            raf = e => {
                let t = e - (this.time || e);
                this.time = e, this.animate.advance(.001 * t), this.options.autoRaf && (this._rafId = requestAnimationFrame(this.raf))
            };
            scrollTo(e, {
                offset: t = 0,
                immediate: i = !1,
                lock: s = !1,
                programmatic: n = !0,
                lerp: o = n ? this.options.lerp : void 0,
                duration: l = n ? this.options.duration : void 0,
                easing: a = n ? this.options.easing : void 0,
                onStart: c,
                onComplete: h,
                force: d = !1,
                userData: u
            } = {}) {
                if ((this.isStopped || this.isLocked) && !d) return;
                let f = e,
                    p = t;
                if ("string" == typeof f && ["top", "left", "start", "#"].includes(f)) f = 0;
                else if ("string" == typeof f && ["bottom", "right", "end"].includes(f)) f = this.limit;
                else {
                    let e = null;
                    if ("string" == typeof f ? (e = document.querySelector(f)) || ("#top" === f ? f = 0 : console.warn("Lenis: Target not found", f)) : f instanceof HTMLElement && f?.nodeType && (e = f), e) {
                        if (this.options.wrapper !== window) {
                            let e = this.rootElement.getBoundingClientRect();
                            p -= this.isHorizontal ? e.left : e.top
                        }
                        let t = e.getBoundingClientRect(),
                            i = getComputedStyle(e),
                            s = this.isHorizontal ? Number.parseFloat(i.scrollMarginLeft) : Number.parseFloat(i.scrollMarginTop),
                            n = getComputedStyle(this.rootElement),
                            r = this.isHorizontal ? Number.parseFloat(n.scrollPaddingLeft) : Number.parseFloat(n.scrollPaddingTop);
                        f = (this.isHorizontal ? t.left : t.top) + this.animatedScroll - (Number.isNaN(s) ? 0 : s) - (Number.isNaN(r) ? 0 : r)
                    }
                }
                if ("number" == typeof f) {
                    if (f += p, this.options.infinite) {
                        if (n) {
                            this.targetScroll = this.animatedScroll = this.scroll;
                            let e = f - this.animatedScroll;
                            e > this.limit / 2 ? f -= this.limit : e < -this.limit / 2 && (f += this.limit)
                        }
                    } else f = r(0, f, this.limit);
                    if (f === this.targetScroll) {
                        c?.(this), h?.(this);
                        return
                    }
                    if (this.userData = u ?? {}, i) {
                        this.animatedScroll = this.targetScroll = f, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), h?.(this), this.userData = {}, requestAnimationFrame(() => {
                            this.dispatchScrollendEvent()
                        });
                        return
                    }
                    n || (this.targetScroll = f), "number" == typeof l && "function" != typeof a ? a = m : "function" == typeof a && "number" != typeof l && (l = 1), this.animate.fromTo(this.animatedScroll, f, {
                        duration: l,
                        easing: a,
                        lerp: o,
                        onStart: () => {
                            s && (this.isLocked = !0), this.isScrolling = "smooth", c?.(this)
                        },
                        onUpdate: (e, t) => {
                            this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = e - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = e, this.setScroll(this.scroll), n && (this.targetScroll = e), t || this.emit(), t && (this.reset(), this.emit(), h?.(this), this.userData = {}, requestAnimationFrame(() => {
                                this.dispatchScrollendEvent()
                            }), this.preventNextNativeScrollEvent())
                        }
                    })
                }
            }
            preventNextNativeScrollEvent() {
                this._preventNextNativeScrollEvent = !0, requestAnimationFrame(() => {
                    this._preventNextNativeScrollEvent = !1
                })
            }
            hasNestedScroll(e, {
                deltaX: t,
                deltaY: i
            }) {
                let s, n, r, o, l, a, c, h, d, u, m, f, p, v, g, x, w = Date.now();
                e._lenis || (e._lenis = {});
                let y = e._lenis;
                if (w - (y.time ?? 0) > 2e3) {
                    y.time = Date.now();
                    let t = window.getComputedStyle(e);
                    if (y.computedStyle = t, s = ["auto", "overlay", "scroll"].includes(t.overflowX), n = ["auto", "overlay", "scroll"].includes(t.overflowY), l = ["auto"].includes(t.overscrollBehaviorX), a = ["auto"].includes(t.overscrollBehaviorY), y.hasOverflowX = s, y.hasOverflowY = n, !(s || n)) return !1;
                    c = e.scrollWidth, h = e.scrollHeight, d = e.clientWidth, u = e.clientHeight, r = c > d, o = h > u, y.isScrollableX = r, y.isScrollableY = o, y.scrollWidth = c, y.scrollHeight = h, y.clientWidth = d, y.clientHeight = u, y.hasOverscrollBehaviorX = l, y.hasOverscrollBehaviorY = a
                } else r = y.isScrollableX, o = y.isScrollableY, s = y.hasOverflowX, n = y.hasOverflowY, c = y.scrollWidth, h = y.scrollHeight, d = y.clientWidth, u = y.clientHeight, l = y.hasOverscrollBehaviorX, a = y.hasOverscrollBehaviorY;
                if (!(s && r || n && o)) return !1;
                let b = Math.abs(t) >= Math.abs(i) ? "horizontal" : "vertical";
                if ("horizontal" === b) m = Math.round(e.scrollLeft), f = c - d, p = t, v = s, g = r, x = l;
                else {
                    if ("vertical" !== b) return !1;
                    m = Math.round(e.scrollTop), f = h - u, p = i, v = n, g = o, x = a
                }
                return !x && (m >= f || m <= 0) || (p > 0 ? m < f : m > 0) && v && g
            }
            get rootElement() {
                return this.options.wrapper === window ? document.documentElement : this.options.wrapper
            }
            get limit() {
                return this.options.naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"]
            }
            get isHorizontal() {
                return "horizontal" === this.options.orientation
            }
            get actualScroll() {
                let e = this.options.wrapper;
                return this.isHorizontal ? e.scrollX ?? e.scrollLeft : e.scrollY ?? e.scrollTop
            }
            get scroll() {
                var e;
                return this.options.infinite ? (this.animatedScroll % (e = this.limit) + e) % e : this.animatedScroll
            }
            get progress() {
                return 0 === this.limit ? 1 : this.scroll / this.limit
            }
            get isScrolling() {
                return this._isScrolling
            }
            set isScrolling(e) {
                this._isScrolling !== e && (this._isScrolling = e, this.updateClassName())
            }
            get isStopped() {
                return this._isStopped
            }
            set isStopped(e) {
                this._isStopped !== e && (this._isStopped = e, this.updateClassName())
            }
            get isLocked() {
                return this._isLocked
            }
            set isLocked(e) {
                this._isLocked !== e && (this._isLocked = e, this.updateClassName())
            }
            get isSmooth() {
                return "smooth" === this.isScrolling
            }
            get className() {
                let e = "lenis";
                return this.options.autoToggle && (e += " lenis-autoToggle"), this.isStopped && (e += " lenis-stopped"), this.isLocked && (e += " lenis-locked"), this.isScrolling && (e += " lenis-scrolling"), "smooth" === this.isScrolling && (e += " lenis-smooth"), e
            }
            updateClassName() {
                this.cleanUpClassName(), this.className.split(" ").forEach(e => {
                    this.rootElement.classList.add(e)
                })
            }
            cleanUpClassName() {
                for (let e of Array.from(this.rootElement.classList))("lenis" === e || e.startsWith("lenis-")) && this.rootElement.classList.remove(e)
            }
        },
        p = e.i(89970),
        v = e.i(83495),
        g = e.i(91181);
    p.default.registerPlugin(v.ScrollTrigger), e.s(["default", 0, function({
        children: e
    }) {
        let n = (0, i.useRef)(null),
            r = (0, s.usePathname)();
        return (0, i.useLayoutEffect)(() => {
            let e = new f({
                smoothWheel: !0,
                smoothTouch: !1,
                duration: 2
            });
            return n.current = e, e.on("scroll", v.ScrollTrigger.update), p.default.ticker.add(t => {
                e.raf(1e3 * t)
            }), () => {
                e.destroy(), n.current = null
            }
        }, []), (0, i.useEffect)(() => {
            "scrollRestoration" in history && (history.scrollRestoration = "manual")
        }, []), (0, i.useEffect)(() => {
            (0, g.resetPageScroll)(n, r)
        }, [r]), (0, i.useEffect)(() => {
            let e = e => {
                e.persisted && (0, g.resetPageScroll)(n, r)
            };
            return window.addEventListener("pageshow", e), () => window.removeEventListener("pageshow", e)
        }, [r]), (0, t.jsx)(g.LenisContext.Provider, {
            value: n,
            children: e
        })
    }], 80853)
}, 24926, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(71645);
    let s = (0, i.createContext)(null);
    e.s(["MenuProvider", 0, function({
        children: e
    }) {
        let [n, r] = (0, i.useState)(!1), o = (0, i.useCallback)(() => r(!0), []), l = (0, i.useCallback)(() => r(!1), []), a = (0, i.useCallback)(() => r(e => !e), []), c = (0, i.useMemo)(() => ({
            isMenuOpen: n,
            setIsMenuOpen: r,
            openMenu: o,
            closeMenu: l,
            toggleMenu: a
        }), [n, o, l, a]);
        return (0, t.jsx)(s.Provider, {
            value: c,
            children: e
        })
    }, "useMenu", 0, function() {
        let e = (0, i.useContext)(s);
        if (!e) throw Error("useMenu must be used within a MenuProvider");
        return e
    }])
}, 99740, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(71645),
        s = e.i(89970),
        n = e.i(83495),
        r = e.i(87331),
        o = e.i(18566),
        l = e.i(7633),
        a = e.i(57851),
        c = e.i(24926),
        h = e.i(91181),
        d = e.i(2532),
        u = e.i(65144),
        m = e.i(54469),
        f = e.i(61745),
        p = e.i(48148),
        v = e.i(28646),
        g = e.i(40558);
    let x = [{
        key: "location",
        sectionId: g.HOME_SECTION_IDS.location
    }, {
        key: "amenities",
        sectionId: g.HOME_SECTION_IDS.amenities
    }];

    function w(e, t = "sr", i = {}) {
        let s = e === t ? "" : `/${e}`;
        return [{
            href: s || "/",
            label: i.home
        }, {
            href: `${s}/3d`,
            label: i["3d"]
        }, {
            href: `${s}/residences`,
            label: i.residences
        }, {
            href: `${s}/business`,
            label: i.business
        }, {
            href: `${s}/retail-spaces`,
            label: i.retailSpaces
        }, ...x.map(s => ({
            label: i[s.key],
            sectionId: s.sectionId,
            href: (0, g.homeSectionHref)(s.sectionId, e, t)
        })), {
            href: `${s}/contact`,
            label: i.contact
        }, {
            href: `${s}/about-the-investor`,
            label: i.about
        }]
    }
    var y = e.i(44110);

    function b() {
        let e = (0, f.useLocale)(),
            i = (0, y.usePathname)(),
            s = i.startsWith(`/${e}/`) ? i.replace(`/${e}`, "") : i;
        return (0, t.jsx)("div", {
            className: "button mt-15 flex items-center gap-5 max-md:mt-0 max-md:gap-20",
            children: [{
                label: "ENG",
                value: "en"
            }, {
                label: "SRB",
                value: "sr"
            }].map((i, n) => (0, t.jsx)(y.Link, {
                target: "_top",
                locale: i.value,
                className: (0, a.cn)("text-green hover:text-cream uppercase transition", i.value === e && "text-cream-dark hover:text-cream-dark"),
                href: "" === s ? "/" : `${s}`,
                children: i.label
            }, n))
        })
    }

    function S({
        links: e
    }) {
        let i = (0, p.useTranslations)("Header"),
            s = e ?? i.raw("links"),
            n = (0, f.useLocale)(),
            r = (0, o.usePathname)(),
            {
                isMenuOpen: g,
                closeMenu: x
            } = (0, c.useMenu)(),
            {
                scrollToSection: y,
                isHome: N
            } = (0, h.useScrollToSection)(),
            E = w(n, v.routing.defaultLocale, s),
            j = (e, t) => {
                (0, d.isSamePageHref)(t, r) && (e.preventDefault(), x())
            };
        return (0, t.jsx)("div", {
            className: (0, a.cn)("grid grid-cols-1 transition-all max-md:h-9/10 max-md:flex-1", g ? "grid-rows-[1fr]" : "grid-rows-[0fr] max-md:grid-rows-[1fr]"),
            children: (0, t.jsxs)("div", {
                className: "flex h-full flex-col items-center justify-start overflow-hidden transition-all duration-500 max-md:justify-between max-md:gap-5",
                children: [(0, t.jsx)(l.Link, {
                    href: "/",
                    onClick: e => j(e, "/"),
                    className: "flex-1 max-md:hidden",
                    children: (0, t.jsx)(u.default, {
                        name: "logotype",
                        className: (0, a.cn)("text-golden mx-auto mt-12 h-20 w-40 max-w-none shrink-0 transition-all max-xl:h-14", g ? "opacity-100 delay-500" : "opacity-0")
                    })
                }), (0, t.jsx)("nav", {
                    className: "mt-12 flex flex-col max-md:mt-10",
                    children: E.map((e, i) => (0, t.jsxs)(l.Link, {
                        href: e.href,
                        onClick: t => ((e, t) => {
                            if (t.sectionId) {
                                if (!N) return;
                                e.preventDefault(), y(t.sectionId), x();
                                return
                            }(0, d.isSamePageHref)(t.href, r) && (e.preventDefault(), x())
                        })(t, e),
                        style: {
                            transitionDelay: g ? `${(i+1)*70}ms` : "0ms"
                        },
                        className: (0, a.cn)("group heading-3 relative w-full overflow-hidden text-center transition max-md:text-[2rem]", g ? "opacity-100" : "opacity-0"),
                        children: [(0, t.jsx)("span", {
                            className: "text-cream-dark block translate-y-0 py-1 leading-tight transition group-hover:-translate-y-full",
                            children: e.label
                        }), (0, t.jsx)("span", {
                            className: "text-accent absolute top-1/2 left-0 block w-full translate-y-full py-1 text-center italic transition group-hover:-translate-y-1/2",
                            children: e.label
                        })]
                    }, e.sectionId ?? e.href))
                }), (0, t.jsx)(b, {}), (0, t.jsx)(l.Link, {
                    href: "/contact",
                    onClick: e => j(e, "/contact"),
                    className: "button mt-15 hidden w-full max-md:mt-0 max-md:inline-block max-md:px-4",
                    children: (0, t.jsxs)(m.Button, {
                        variant: "darkOutline",
                        className: "w-full",
                        children: [i("cta"), " ", (0, t.jsx)(u.default, {
                            name: "arrow_right",
                            className: "text-green h-2.25 w-6"
                        })]
                    })
                })]
            })
        })
    }

    function N() {
        let e = (0, p.useTranslations)("Header"),
            {
                isMenuOpen: s,
                closeMenu: n,
                toggleMenu: r
            } = (0, c.useMenu)(),
            f = (0, h.useLenis)(),
            v = (0, o.usePathname)(),
            g = (0, i.useRef)(null),
            x = (0, i.useRef)(0),
            [w, y] = (0, i.useState)(!1),
            b = (e, t) => {
                (0, d.isSamePageHref)(t, v) && (e.preventDefault(), n())
            };
        return (0, i.useEffect)(() => {
            if (!s) return;
            let e = e => {
                g.current && !g.current.contains(e.target) && n()
            };
            return document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), () => {
                document.removeEventListener("mousedown", e), document.removeEventListener("touchstart", e)
            }
        }, [s, n]), (0, i.useEffect)(() => {
            let e = window.matchMedia("(max-width: 1120px)"),
                t = () => {
                    let t = f?.current;
                    s && e.matches ? (t?.stop(), document.body.dataset.menuOpen = "") : (t?.start(), delete document.body.dataset.menuOpen)
                };
            return t(), e.addEventListener("change", t), () => {
                e.removeEventListener("change", t), f?.current?.start(), delete document.body.dataset.menuOpen
            }
        }, [s, f]), (0, i.useEffect)(() => {
            if (s) return void y(!1);
            let e = !1,
                t = f?.current,
                i = () => {
                    if (e || s) return;
                    let i = t.scroll;
                    i < 80 ? y(!1) : i > x.current ? y(!0) : i < x.current && y(!1), x.current = i
                },
                n = () => {
                    if (!e) {
                        if (!(t = f?.current)) return void requestAnimationFrame(n);
                        x.current = t.scroll, t.on("scroll", i)
                    }
                };
            return n(), () => {
                e = !0, t?.off("scroll", i)
            }
        }, [s, f]), (0, t.jsx)(t.Fragment, {
            children: (0, t.jsx)("div", {
                className: (0, a.cn)("text-cream pointer-events-none fixed top-6 left-1/2 z-100 flex w-full max-w-160 -translate-x-1/2 justify-center rounded-[1.75rem] bg-[#1F261E]/80 backdrop-blur-lg transition-all ease-in-out max-lg:max-w-113 max-md:h-12.5 max-md:w-[calc(100%-3rem)] max-md:max-w-none max-md:overflow-y-hidden", w && !s && "max-lg:-translate-y-[calc(100%+1.5rem)]", s && "max-md:top-0! max-md:h-full max-md:w-full max-md:overflow-y-auto! max-md:rounded-none!"),
                children: (0, t.jsxs)("div", {
                    ref: g,
                    className: (0, a.cn)("pointer-events-auto relative w-full overflow-hidden rounded-[1.75rem] p-2 transition-all", s ? "pb-6 max-md:pt-8" : "pb-2"),
                    children: [(0, t.jsxs)("div", {
                        className: "relative z-10 flex items-center justify-between max-md:flex-row-reverse max-md:px-4",
                        children: [(0, t.jsx)("div", {
                            className: "relative z-10 flex-1 max-md:flex-0",
                            children: (0, t.jsxs)("button", {
                                type: "button",
                                onClick: r,
                                className: "menu flex cursor-pointer items-center justify-center gap-3 pl-3 uppercase transition max-md:flex-row-reverse",
                                "aria-label": "Open navigation menu",
                                "aria-expanded": s,
                                children: [(0, t.jsxs)("div", {
                                    className: (0, a.cn)("flex w-10 flex-col justify-between transition-all duration-500", s ? "h-4" : "h-2"),
                                    children: [(0, t.jsx)("span", {
                                        className: (0, a.cn)("bg-green block h-0.25 w-full origin-center transition-all duration-500", s ? "translate-y-[0.469rem] rotate-22" : "translate-y-0 rotate-0")
                                    }), (0, t.jsx)("span", {
                                        className: (0, a.cn)("bg-green block h-0.25 w-full origin-center transition-all duration-500", s ? "-translate-y-[0.469rem] -rotate-22" : "translate-y-0 rotate-0")
                                    })]
                                }), (0, t.jsx)("span", {
                                    className: "max-md:hidden",
                                    children: e("menu")
                                })]
                            })
                        }), (0, t.jsxs)(l.Link, {
                            href: "/",
                            onClick: e => b(e, "/"),
                            className: "relative z-10",
                            children: [(0, t.jsx)(u.default, {
                                name: "logo_symbol",
                                className: (0, a.cn)("text-golden h-9 w-9 transition-all max-md:absolute max-md:top-1/2 max-md:left-0 max-md:-translate-y-1/2", s && "max-md:opacity-0")
                            }), (0, t.jsx)(u.default, {
                                name: "logotype",
                                className: (0, a.cn)("text-golden hidden opacity-0 transition-all max-md:block", s ? "h-12 w-25 max-md:opacity-100" : "h-9 w-9")
                            })]
                        }), (0, t.jsx)("div", {
                            className: "relative z-10 flex flex-1 justify-end max-md:hidden",
                            children: (0, t.jsx)(l.Link, {
                                href: "/contact",
                                onClick: e => b(e, "/contact"),
                                children: (0, t.jsxs)(m.Button, {
                                    variant: "darkOutline",
                                    className: "text-sand h-10 min-w-0",
                                    spanClassName: "gap-4",
                                    children: [e("cta"), (0, t.jsx)(u.default, {
                                        name: "arrow_right",
                                        className: "text-green h-2.25 w-6"
                                    })]
                                })
                            })
                        })]
                    }), (0, t.jsx)(S, {
                        links: e.raw("links")
                    })]
                })
            })
        })
    }
    var E = e.i(57688),
        j = e.i(75220),
        L = e.i(20830),
        k = e.i(92120);
    let T = "small mb-2 block text-golden uppercase",
        _ = "paragraph border-pine-green text-pine-green placeholder:text-pine-green focus:border-green w-full border-0 border-b bg-transparent pb-1 outline-none transition-colors",
        O = [{
            href: "https://www.instagram.com/belgradearbor/",
            label: "Instagram"
        }, {
            href: "https://www.linkedin.com/company/belgrade-arbor",
            label: "Linkedin"
        }, {
            href: "https://www.facebook.com/belgradearbor/",
            label: "Facebook"
        }];

    function C() {
        let e = (0, p.useTranslations)("Footer"),
            s = (0, p.useTranslations)("Header"),
            n = (0, o.usePathname)(),
            r = (0, f.useLocale)(),
            {
                scrollToSection: a,
                isHome: c
            } = (0, h.useScrollToSection)(),
            u = w(r, v.routing.defaultLocale, s.raw("links")),
            m = "/3d" === n || n.startsWith("/3d/"),
            [g, x] = (0, i.useState)(!1),
            [y, b] = (0, i.useState)("idle");
        async function S(e) {
            if (e.preventDefault(), "loading" === y) return;
            let t = e.currentTarget,
                i = new FormData(t),
                s = {
                    firstName: String(i.get("firstName") ?? "").trim(),
                    lastName: String(i.get("lastName") ?? "").trim(),
                    email: String(i.get("email") ?? "").trim(),
                    consent: g,
                    locale: r
                };
            if (!s.firstName || !s.lastName || !s.email || !g) return void b("error");
            b("loading");
            try {
                let e = await fetch("/api/newsletter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(s)
                });
                if (!e.ok) throw Error(`Newsletter ${e.status}`);
                t.reset(), x(!1), b("success")
            } catch (e) {
                console.error("Newsletter submit failed:", e), b("error")
            }
        }
        let N = (0, k.useAnimation)(e => {
            m || (e.from(".fadeElement", {
                opacity: 0,
                y: "2rem",
                x: "-2rem",
                duration: 1,
                stagger: .1,
                scrollTrigger: {
                    trigger: ".wrapper"
                }
            }), e.to(".front", {
                y: "10rem",
                scrollTrigger: {
                    trigger: ".scroller",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: !0
                }
            }))
        });
        return m ? null : (0, t.jsxs)("footer", {
            ref: N,
            className: "to-vanilla relative bg-linear-to-t from-[#8AB6D2]",
            children: [(0, t.jsx)("div", {
                className: "scroller pointer-events-none absolute h-full w-full"
            }), (0, t.jsx)("div", {
                className: "wrapper pt-25",
                children: (0, t.jsxs)("div", {
                    className: "content flex gap-5 max-2xl:gap-15 max-lg:flex-wrap max-lg:justify-start max-lg:gap-5 max-lg:gap-y-22 max-md:gap-y-12!",
                    children: [(0, t.jsxs)("div", {
                        className: "w-1/3 max-2xl:w-1/2 max-lg:w-2/3 max-md:w-full",
                        children: [(0, t.jsx)(j.default, {
                            as: "p",
                            className: "heading-2 leading-tight font-light uppercase",
                            children: e("heading")
                        }), (0, t.jsx)(j.default, {
                            as: "p",
                            className: "paragraph mt-6",
                            children: e("subscribeText")
                        }), (0, t.jsxs)("form", {
                            onSubmit: S,
                            className: "mt-10 flex w-3/4 flex-col items-start gap-6 max-md:mt-15 max-md:w-full",
                            children: [(0, t.jsxs)("div", {
                                className: "flex w-full gap-4 max-md:flex-wrap max-md:gap-6",
                                children: [(0, t.jsxs)("div", {
                                    className: "fadeElement w-1/2 max-md:w-full",
                                    children: [(0, t.jsx)("label", {
                                        htmlFor: "footer-first-name",
                                        className: T,
                                        children: e("firstName")
                                    }), (0, t.jsx)("input", {
                                        id: "footer-first-name",
                                        type: "text",
                                        name: "firstName",
                                        className: _,
                                        required: !0
                                    })]
                                }), (0, t.jsxs)("div", {
                                    className: "fadeElement w-1/2 max-md:w-full",
                                    children: [(0, t.jsx)("label", {
                                        htmlFor: "footer-last-name",
                                        className: T,
                                        children: e("lastName")
                                    }), (0, t.jsx)("input", {
                                        id: "footer-last-name",
                                        type: "text",
                                        name: "lastName",
                                        className: _,
                                        required: !0
                                    })]
                                })]
                            }), (0, t.jsxs)("div", {
                                className: "fadeElement w-full",
                                children: [(0, t.jsx)("label", {
                                    htmlFor: "footer-email",
                                    className: T,
                                    children: e("email")
                                }), (0, t.jsx)("input", {
                                    id: "footer-email",
                                    type: "email",
                                    name: "email",
                                    className: _,
                                    required: !0
                                })]
                            }), (0, t.jsxs)("label", {
                                className: "fadeElement my-4 flex cursor-pointer items-start gap-3",
                                children: [(0, t.jsx)(L.Checkbox, {
                                    name: "consent",
                                    checked: g,
                                    onCheckedChange: e => x(!0 === e),
                                    className: "border-green data-[state=checked]:bg-pine-green! data-[state=checked]:border-pine-green data-[state=checked]:text-vanilla mt-1 rounded-none bg-transparent"
                                }), (0, t.jsx)("span", {
                                    className: "small text-golden",
                                    children: e("consent")
                                })]
                            }), (0, t.jsx)("button", {
                                className: "link fadeElement max-md:mx-auto",
                                type: "submit",
                                children: e("submit")
                            })]
                        })]
                    }), (0, t.jsx)("div", {
                        className: "w-1/12 max-2xl:hidden"
                    }), (0, t.jsxs)("div", {
                        className: "w-1/6 max-lg:w-1/3 max-md:flex max-md:w-full max-md:flex-col max-md:items-center",
                        children: [(0, t.jsx)("ul", {
                            className: "space-y-3",
                            children: u.map(e => (0, t.jsx)("li", {
                                className: "fadeElement max-md:text-center",
                                children: (0, t.jsx)(l.Link, {
                                    className: "hover:text-green paragraph font-normal uppercase transition",
                                    href: e.href,
                                    onClick: t => ((e, t) => {
                                        if (t.sectionId) {
                                            if (!c) return;
                                            e.preventDefault(), a(t.sectionId);
                                            return
                                        }(0, d.isSamePageHref)(t.href, n) && e.preventDefault()
                                    })(t, e),
                                    children: e.label
                                })
                            }, e.sectionId ?? e.href))
                        }), (0, t.jsx)(l.Link, {
                            href: "/privacy-policy",
                            className: "paragraph fadeElement hover:text-green transitionfont-normal mt-10 inline-block max-md:mt-4",
                            children: e("privacyPolicy")
                        })]
                    }), (0, t.jsx)("div", {
                        className: "w-1/12 max-lg:w-1/6 max-md:w-full",
                        children: (0, t.jsx)("ul", {
                            className: "space-y-3 max-md:flex max-md:flex-col max-md:items-center",
                            children: O.map((e, i) => (0, t.jsx)("li", {
                                className: "fadeElement",
                                children: (0, t.jsx)("a", {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "hover:text-green text-golden paragraph font-normal transition",
                                    href: e.href,
                                    children: e.label
                                })
                            }, i))
                        })
                    }), (0, t.jsx)("div", {
                        className: "w-1/12 max-2xl:hidden"
                    }), (0, t.jsxs)("div", {
                        className: "w-1/4 max-lg:w-5/12 max-md:w-full",
                        children: [(0, t.jsx)(j.default, {
                            as: "p",
                            type: "paragraph",
                            className: "small",
                            children: e("disclaimer")
                        }), (0, t.jsxs)("div", {
                            className: "mt-6 flex flex-col max-sm:w-2/3",
                            children: [(0, t.jsx)(j.default, {
                                as: "span",
                                children: e("contact")
                            }), (0, t.jsx)(j.default, {
                                children: (0, t.jsx)("a", {
                                    href: "tel:+38169684444",
                                    className: "text-golden detail",
                                    children: "+381 69 68 44 44"
                                })
                            })]
                        })]
                    })]
                })
            }), (0, t.jsxs)("div", {
                className: "pointer-events-none -mt-200 w-full overflow-clip select-none max-2xl:-mt-150 max-lg:-mt-120 max-lg:flex max-lg:items-center max-lg:justify-end max-md:-mt-70",
                children: [(0, t.jsx)(E.default, {
                    src: "/home/footer/front.webp",
                    alt: "footer",
                    width: 1920,
                    height: 1411,
                    className: "front h-auto w-full max-w-none max-lg:min-w-400 max-lg:translate-x-25 max-lg:object-cover max-lg:object-right max-md:min-w-210",
                    loading: "eager"
                }), (0, t.jsxs)("div", {
                    className: "absolute bottom-0 left-0 h-auto w-full",
                    children: [(0, t.jsx)(E.default, {
                        src: "/home/footer/tree-l.webp",
                        alt: "footer",
                        width: 387,
                        height: 559,
                        className: "absolute bottom-0 left-0 h-auto w-96 max-w-none max-2xl:w-75 max-lg:hidden"
                    }), (0, t.jsx)(E.default, {
                        src: "/home/footer/tree-r.webp",
                        alt: "footer",
                        width: 1354,
                        height: 641,
                        className: "absolute right-0 bottom-0 h-auto w-335 max-w-none max-2xl:w-250 max-lg:w-[150%] max-md:w-150"
                    })]
                })]
            }), (0, t.jsx)("div", {
                className: "absolute bottom-15 left-0 z-10 w-full max-md:bottom-10",
                children: (0, t.jsxs)("div", {
                    className: "wrapper flex items-end justify-between max-lg:flex-col-reverse max-lg:items-center max-lg:gap-5",
                    children: [(0, t.jsxs)("div", {
                        className: "small text-cream w-1/6 max-lg:w-full max-lg:text-center max-md:text-[0.625rem]",
                        children: ["©", new Date().getFullYear(), ". ", e("copyright")]
                    }), (0, t.jsx)("div", {
                        className: "heading-1 text-cream w-7/12 text-right font-light uppercase max-xl:w-2/3 max-lg:w-full max-lg:text-center",
                        children: (0, t.jsx)(j.default, {
                            as: "span",
                            children: e("brand")
                        })
                    })]
                })
            })]
        })
    }
    var z = e.i(52582);
    let M = "power2.inOut";

    function P() {
        return (() => {
            function e(e) {
                this.init(e || {})
            }

            function t(e) {
                this.init(e || {})
            }

            function s(e) {
                function i(e) {
                    e.touches ? (a.x = e.touches[0].pageX, a.y = e.touches[0].pageY) : (a.x = e.clientX, a.y = e.clientY), e.preventDefault()
                }
                document.removeEventListener("mousemove", s), document.removeEventListener("touchstart", s), document.addEventListener("mousemove", i), document.addEventListener("touchmove", i), document.addEventListener("touchstart", function(e) {
                        1 == e.touches.length && (a.x = e.touches[0].pageX, a.y = e.touches[0].pageY)
                    }), i(e),
                    function() {
                        c = [];
                        for (var e = 0; e < h.trails; e++) c.push(new t({
                            spring: .4 + e / h.trails * .025
                        }))
                    }(), n()
            }

            function n() {
                if (o.running) {
                    o.globalCompositeOperation = "source-over", o.clearRect(0, 0, o.canvas.width, o.canvas.height), o.globalCompositeOperation = "lighter", o.strokeStyle = "hsla(34.19, 34.96%, 48.24%, 0.2)", o.lineWidth = 1;
                    for (var e, t = 0; t < h.trails; t++)(e = c[t]).update(), e.draw();
                    o.frame++, window.requestAnimationFrame(n)
                }
            }

            function r() {
                o.canvas.width = window.innerWidth - 20, o.canvas.height = window.innerHeight
            }
            e.prototype = {
                init: function(e) {
                    this.phase = e.phase || 0, this.offset = e.offset || 0, this.frequency = e.frequency || .001, this.amplitude = e.amplitude || 1
                },
                update: function() {
                    return this.phase += this.frequency, l = this.offset + Math.sin(this.phase) * this.amplitude
                },
                value: function() {
                    return l
                }
            }, t.prototype = {
                init: function(e) {
                    this.spring = e.spring + .1 * Math.random() - .02, this.friction = h.friction + .01 * Math.random() - .002, this.nodes = [];
                    for (var t, i = 0; i < h.size; i++)(t = new d).x = a.x, t.y = a.y, this.nodes.push(t)
                },
                update: function() {
                    var e = this.spring,
                        t = this.nodes[0];
                    t.vx += (a.x - t.x) * e, t.vy += (a.y - t.y) * e;
                    for (var i, s = 0, n = this.nodes.length; s < n; s++) t = this.nodes[s], 0 < s && (i = this.nodes[s - 1], t.vx += (i.x - t.x) * e, t.vy += (i.y - t.y) * e, t.vx += i.vx * h.dampening, t.vy += i.vy * h.dampening), t.vx *= this.friction, t.vy *= this.friction, t.x += t.vx, t.y += t.vy, e *= h.tension
                },
                draw: function() {
                    var e, t, i = this.nodes[0].x,
                        s = this.nodes[0].y;
                    o.beginPath(), o.moveTo(i, s);
                    for (var n = 1, r = this.nodes.length - 2; n < r; n++) e = this.nodes[n], t = this.nodes[n + 1], i = .5 * (e.x + t.x), s = .5 * (e.y + t.y), o.quadraticCurveTo(e.x, e.y, i, s);
                    e = this.nodes[n], t = this.nodes[n + 1], o.quadraticCurveTo(e.x, e.y, t.x, t.y), o.stroke(), o.closePath()
                }
            };
            var o, l = 0,
                a = {},
                c = [],
                h = {
                    friction: .5,
                    trails: 10,
                    size: 10,
                    dampening: .1,
                    tension: .98
                };

            function d() {
                this.x = 0, this.y = 0, this.vy = 0, this.vx = 0
            }
            let u = function() {
                (o = document.getElementById("canvas").getContext("2d")).running = !0, o.frame = 1, new e({
                    phase: 2 * Math.random() * Math.PI,
                    amplitude: 85,
                    frequency: .0015,
                    offset: 285
                }), document.addEventListener("mousemove", s), document.addEventListener("touchstart", s), document.body.addEventListener("orientationchange", r), window.addEventListener("resize", r), window.addEventListener("focus", () => {
                    o.running || (o.running = !0, n())
                }), window.addEventListener("blur", () => {
                    o.running = !0
                }), r()
            };
            (0, i.useEffect)(() => (u(), () => {
                o.running = !1, o.clearRect(0, 0, o.canvas.width, o.canvas.height), document.removeEventListener("mousemove", s), document.removeEventListener("touchstart", s), document.body.removeEventListener("orientationchange", r), window.removeEventListener("resize", r), window.removeEventListener("focus", () => {
                    o.running || (o.running = !0, n())
                }), window.removeEventListener("blur", () => {
                    o.running = !0
                })
            }), [])
        })(), (0, t.jsx)("canvas", {
            className: "pointer-events-none fixed inset-0 z-100",
            id: "canvas"
        })
    }

    function R() {
        let [e, s] = (0, i.useState)(!1);
        return ((0, i.useEffect)(() => {
            let e = window.matchMedia("(min-width: 1121px)");
            s(e.matches);
            let t = e => s(e.matches);
            return e.addEventListener("change", t), () => e.removeEventListener("change", t)
        }, []), e) ? (0, t.jsx)(P, {}) : null
    }

    function I({
        children: e
    }) {
        let n = (0, h.useLenis)(),
            l = (0, h.useClampScroll)(),
            a = (0, o.usePathname)(),
            d = (0, z.useIsNotFoundPage)(),
            u = "/3d" === a || a.startsWith("/en/3d"),
            m = "/contact" === a || a.startsWith("/en/contact"),
            f = (0, i.useRef)(null),
            p = (0, i.useRef)(null),
            v = (0, i.useRef)(null),
            {
                closeMenu: x
            } = (0, c.useMenu)(),
            w = (0, i.useCallback)(async e => {
                x();
                let t = p.current,
                    i = v.current;
                if (!t || !i) return void e();
                s.default.set(t, {
                    scaleY: 0,
                    transformOrigin: "bottom"
                });
                let n = s.default.timeline({
                    onComplete: e
                });
                return n.to(t, {
                    scaleY: 1,
                    duration: 1,
                    ease: M
                }, 0).to(i, {
                    y: "-50vh",
                    duration: 1,
                    ease: M
                }, 0), () => n.kill()
            }, [x]),
            y = (0, i.useCallback)(async e => {
                !(window.location.hash.slice(1) && (0, g.isHomePathname)(a)) && n.current && (n.current.scrollTo(0, {
                    immediate: !0,
                    force: !0
                }), window.scrollTo(0, 0));
                let t = p.current,
                    i = v.current;
                if (!t || !i) {
                    e(), (0, h.resetPageScroll)(n, a);
                    return
                }
                s.default.set(t, {
                    scaleY: 1,
                    transformOrigin: "bottom"
                }), s.default.set(i, {
                    y: "50vh"
                });
                let r = s.default.timeline({
                    onComplete: () => {
                        e(), s.default.set(i, {
                            clearProps: "transform"
                        }), l(), (0, h.resetPageScroll)(n, a)
                    }
                });
                return r.to(t, {
                    scaleY: 0,
                    transformOrigin: "top",
                    duration: 1,
                    ease: M
                }, 0).to(i, {
                    y: 0,
                    duration: 1,
                    ease: M
                }, 0), () => r.kill()
            }, [l, a, n]);
        return (0, t.jsx)(t.Fragment, {
            children: (0, t.jsxs)(r.TransitionRouter, {
                leave: w,
                enter: y,
                children: [(0, t.jsx)(N, {}), !u && (0, t.jsx)(R, {}), (0, t.jsx)("div", {
                    ref: f,
                    className: "w-full",
                    children: (0, t.jsxs)("main", {
                        ref: v,
                        className: "min-h-screen w-full",
                        children: [e, !u && !m && !d && (0, t.jsx)(C, {})]
                    })
                }), (0, t.jsx)("div", {
                    ref: p,
                    className: "bg-pine-green pointer-events-none fixed inset-0 z-100",
                    style: {
                        transformOrigin: "bottom",
                        transform: "scaleY(0)"
                    },
                    "aria-hidden": !0
                })]
            })
        })
    }
    s.default.registerPlugin(n.ScrollTrigger), e.s(["default", 0, function({
        children: e
    }) {
        return (0, t.jsx)(z.NotFoundProvider, {
            children: (0, t.jsx)(I, {
                children: e
            })
        })
    }], 99740)
}, 8341, (e, t, i) => {
    "use strict";
    Object.defineProperty(i, "__esModule", {
        value: !0
    });
    var s = {
        cancelIdleCallback: function() {
            return o
        },
        requestIdleCallback: function() {
            return r
        }
    };
    for (var n in s) Object.defineProperty(i, n, {
        enumerable: !0,
        get: s[n]
    });
    let r = "u" > typeof self && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(e) {
            let t = Date.now();
            return self.setTimeout(function() {
                e({
                    didTimeout: !1,
                    timeRemaining: function() {
                        return Math.max(0, 50 - (Date.now() - t))
                    }
                })
            }, 1)
        },
        o = "u" > typeof self && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(e) {
            return clearTimeout(e)
        };
    ("function" == typeof i.default || "object" == typeof i.default && null !== i.default) && void 0 === i.default.__esModule && (Object.defineProperty(i.default, "__esModule", {
        value: !0
    }), Object.assign(i.default, i), t.exports = i.default)
}, 19083, (e, t, i) => {
    "use strict";
    Object.defineProperty(i, "__esModule", {
        value: !0
    });
    var s = {
        ESCAPE_REGEX: function() {
            return o
        },
        htmlEscapeAttributeString: function() {
            return h
        },
        htmlEscapeJsonString: function() {
            return c
        }
    };
    for (var n in s) Object.defineProperty(i, n, {
        enumerable: !0,
        get: s[n]
    });
    let r = {
            "&": "\\u0026",
            ">": "\\u003e",
            "<": "\\u003c",
            "\u2028": "\\u2028",
            "\u2029": "\\u2029"
        },
        o = /[&><\u2028\u2029]/g,
        l = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#39;",
            "<": "&lt;",
            ">": "&gt;"
        },
        a = /[&"'<>]/g;

    function c(e) {
        return e.replace(o, e => r[e])
    }

    function h(e) {
        return e.replace(a, e => l[e])
    }
}, 79520, (e, t, i) => {
    "use strict";
    Object.defineProperty(i, "__esModule", {
        value: !0
    });
    var s = {
        default: function() {
            return y
        },
        handleClientScriptLoad: function() {
            return g
        },
        initScriptLoader: function() {
            return x
        }
    };
    for (var n in s) Object.defineProperty(i, n, {
        enumerable: !0,
        get: s[n]
    });
    let r = e.r(55682),
        o = e.r(90809),
        l = e.r(43476),
        a = r._(e.r(74080)),
        c = o._(e.r(71645)),
        h = e.r(42732),
        d = e.r(22737),
        u = e.r(8341),
        m = e.r(19083),
        f = new Map,
        p = new Set,
        v = e => {
            let {
                src: t,
                id: i,
                onLoad: s = () => {},
                onReady: n = null,
                dangerouslySetInnerHTML: r,
                children: o = "",
                strategy: l = "afterInteractive",
                onError: c,
                stylesheets: h
            } = e, u = i || t;
            if (u && p.has(u)) return;
            if (f.has(t)) {
                p.add(u), f.get(t).then(s, c);
                return
            }
            let m = () => {
                    n && n(), p.add(u)
                },
                v = document.createElement("script"),
                g = new Promise((e, t) => {
                    v.addEventListener("load", function(t) {
                        e(), s && s.call(this, t), m()
                    }), v.addEventListener("error", function(e) {
                        t(e)
                    })
                }).catch(function(e) {
                    c && c(e)
                });
            r ? (v.innerHTML = r.__html || "", m()) : o ? (v.textContent = "string" == typeof o ? o : Array.isArray(o) ? o.join("") : "", m()) : t && (v.src = t, f.set(t, g)), (0, d.setAttributesFromProps)(v, e), "worker" === l && v.setAttribute("type", "text/partytown"), v.setAttribute("data-nscript", l), h && (e => {
                if (a.default.preinit) return e.forEach(e => {
                    a.default.preinit(e, {
                        as: "style"
                    })
                });
                if ("u" > typeof window) {
                    let t = document.head;
                    e.forEach(e => {
                        let i = document.createElement("link");
                        i.type = "text/css", i.rel = "stylesheet", i.href = e, t.appendChild(i)
                    })
                }
            })(h), document.body.appendChild(v)
        };

    function g(e) {
        let {
            strategy: t = "afterInteractive"
        } = e;
        "lazyOnload" === t ? window.addEventListener("load", () => {
            (0, u.requestIdleCallback)(() => v(e))
        }) : v(e)
    }

    function x(e) {
        e.forEach(g), [...document.querySelectorAll('[data-nscript="beforeInteractive"]'), ...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e => {
            let t = e.id || e.getAttribute("src");
            p.add(t)
        })
    }

    function w(e) {
        let {
            id: t,
            src: i = "",
            onLoad: s = () => {},
            onReady: n = null,
            strategy: r = "afterInteractive",
            onError: o,
            stylesheets: d,
            ...f
        } = e, {
            updateScripts: g,
            scripts: x,
            getIsSsr: w,
            appDir: y,
            nonce: b
        } = (0, c.useContext)(h.HeadManagerContext);
        b = f.nonce || b;
        let S = (0, c.useRef)(!1);
        (0, c.useEffect)(() => {
            let e = t || i;
            S.current || (n && e && p.has(e) && n(), S.current = !0)
        }, [n, t, i]);
        let N = (0, c.useRef)(!1);
        if ((0, c.useEffect)(() => {
                if (!N.current) {
                    if ("afterInteractive" === r) v(e);
                    else "lazyOnload" === r && ("complete" === document.readyState ? (0, u.requestIdleCallback)(() => v(e)) : window.addEventListener("load", () => {
                        (0, u.requestIdleCallback)(() => v(e))
                    }));
                    N.current = !0
                }
            }, [e, r]), ("beforeInteractive" === r || "worker" === r) && (g ? (x[r] = (x[r] || []).concat([{
                id: t,
                src: i,
                onLoad: s,
                onReady: n,
                onError: o,
                ...f,
                nonce: b
            }]), g(x)) : w && w() ? p.add(t || i) : w && !w() && v({
                ...e,
                nonce: b
            })), y) {
            if (d && d.forEach(e => {
                    a.default.preinit(e, {
                        as: "style"
                    })
                }), "beforeInteractive" === r)
                if (!i) return f.dangerouslySetInnerHTML && (f.children = f.dangerouslySetInnerHTML.__html, delete f.dangerouslySetInnerHTML), (0, l.jsx)("script", {
                    nonce: b,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0,m.htmlEscapeJsonString)(JSON.stringify([0,{...f,id:t}]))})`
                    }
                });
                else return a.default.preload(i, f.integrity ? {
                    as: "script",
                    integrity: f.integrity,
                    nonce: b,
                    crossOrigin: f.crossOrigin
                } : {
                    as: "script",
                    nonce: b,
                    crossOrigin: f.crossOrigin
                }), (0, l.jsx)("script", {
                    nonce: b,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0,m.htmlEscapeJsonString)(JSON.stringify([i,{...f,id:t}]))})`
                    }
                });
            "afterInteractive" === r && i && a.default.preload(i, f.integrity ? {
                as: "script",
                integrity: f.integrity,
                nonce: b,
                crossOrigin: f.crossOrigin
            } : {
                as: "script",
                nonce: b,
                crossOrigin: f.crossOrigin
            })
        }
        return null
    }
    Object.defineProperty(w, "__nextScript", {
        value: !0
    });
    let y = w;
    ("function" == typeof i.default || "object" == typeof i.default && null !== i.default) && void 0 === i.default.__esModule && (Object.defineProperty(i.default, "__esModule", {
        value: !0
    }), Object.assign(i.default, i), t.exports = i.default)
}, 24076, e => {
    "use strict";
    var t = e.i(71645),
        i = e.i(18566);
    let s = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"],
        n = "arbor_utm";
    e.s(["default", 0, function() {
        let e = (0, i.usePathname)(),
            r = (0, i.useSearchParams)(),
            o = (0, t.useRef)(!0);
        return (0, t.useEffect)(() => {
            if (! function() {
                    if (document.cookie.includes(`${n}=`)) return;
                    let e = new URLSearchParams(location.search),
                        t = {};
                    s.forEach(i => {
                        let s = e.get(i);
                        s && (t[i] = s.slice(0, 200))
                    }), Object.keys(t).length && (document.cookie = `${n}=${encodeURIComponent(JSON.stringify(t))}; path=/; max-age=7776000; SameSite=Lax`)
                }(), o.current) {
                o.current = !1;
                return
            }
            let t = r.toString(),
                i = t ? `${e}?${t}` : e;
            window._hsq = window._hsq || [], window._hsq.push(["setPath", i]), window._hsq.push(["trackPageView"])
        }, [e, r]), null
    }], 24076)
}]);