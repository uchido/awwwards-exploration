(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 57851, 7670, e => {
    "use strict";

    function t() {
        for (var e, t, r = 0, o = "", l = arguments.length; r < l; r++)(e = arguments[r]) && (t = function e(t) {
            var r, o, l = "";
            if ("string" == typeof t || "number" == typeof t) l += t;
            else if ("object" == typeof t)
                if (Array.isArray(t)) {
                    var n = t.length;
                    for (r = 0; r < n; r++) t[r] && (o = e(t[r])) && (l && (l += " "), l += o)
                } else
                    for (o in t) t[o] && (l && (l += " "), l += o);
            return l
        }(e)) && (o && (o += " "), o += t);
        return o
    }
    e.s(["clsx", 0, t], 7670);
    let r = (e = new Map, t = null, r) => ({
            nextPart: e,
            validators: t,
            classGroupId: r
        }),
        o = [],
        l = (e, t, r) => {
            if (0 == e.length - t) return r.classGroupId;
            let o = e[t],
                n = r.nextPart.get(o);
            if (n) {
                let r = l(e, t + 1, n);
                if (r) return r
            }
            let s = r.validators;
            if (null === s) return;
            let i = 0 === t ? e.join("-") : e.slice(t).join("-"),
                a = s.length;
            for (let e = 0; e < a; e++) {
                let t = s[e];
                if (t.validator(i)) return t.classGroupId
            }
        },
        n = (e, t) => {
            let o = r();
            for (let r in e) s(e[r], o, r, t);
            return o
        },
        s = (e, t, r, o) => {
            let l = e.length;
            for (let n = 0; n < l; n++) i(e[n], t, r, o)
        },
        i = (e, t, r, o) => {
            "string" == typeof e ? a(e, t, r) : "function" == typeof e ? d(e, t, r, o) : c(e, t, r, o)
        },
        a = (e, t, r) => {
            ("" === e ? t : m(t, e)).classGroupId = r
        },
        d = (e, t, r, o) => {
            p(e) ? s(e(o), t, r, o) : (null === t.validators && (t.validators = []), t.validators.push({
                classGroupId: r,
                validator: e
            }))
        },
        c = (e, t, r, o) => {
            let l = Object.entries(e),
                n = l.length;
            for (let e = 0; e < n; e++) {
                let [n, i] = l[e];
                s(i, m(t, n), r, o)
            }
        },
        m = (e, t) => {
            let o = e,
                l = t.split("-"),
                n = l.length;
            for (let e = 0; e < n; e++) {
                let t = l[e],
                    n = o.nextPart.get(t);
                n || (n = r(), o.nextPart.set(t, n)), o = n
            }
            return o
        },
        p = e => "isThemeGetter" in e && !0 === e.isThemeGetter,
        u = [],
        b = (e, t, r, o, l) => ({
            modifiers: e,
            hasImportantModifier: t,
            baseClassName: r,
            maybePostfixModifierPosition: o,
            isExternal: l
        }),
        f = /\s+/,
        h = e => {
            let t;
            if ("string" == typeof e) return e;
            let r = "";
            for (let o = 0; o < e.length; o++) e[o] && (t = h(e[o])) && (r && (r += " "), r += t);
            return r
        },
        g = [],
        w = e => {
            let t = t => t[e] || g;
            return t.isThemeGetter = !0, t
        },
        x = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
        k = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
        y = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
        v = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
        z = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
        C = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
        S = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
        E = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
        T = e => y.test(e),
        A = e => !!e && !Number.isNaN(Number(e)),
        N = e => !!e && Number.isInteger(Number(e)),
        j = e => e.endsWith("%") && A(e.slice(0, -1)),
        G = e => v.test(e),
        O = () => !0,
        W = e => z.test(e) && !C.test(e),
        R = () => !1,
        $ = e => S.test(e),
        _ = e => E.test(e),
        B = e => !M(e) && !Z(e),
        I = e => e.startsWith("@container") && ("/" === e[10] && void 0 !== e[11] || "s" === e[11] && void 0 !== e[16] && e.startsWith("-size/", 10) || "n" === e[11] && void 0 !== e[18] && e.startsWith("-normal/", 10)),
        P = e => er(e, es, R),
        M = e => x.test(e),
        F = e => er(e, ei, W),
        L = e => er(e, ea, A),
        q = e => er(e, ec, O),
        H = e => er(e, ed, R),
        D = e => er(e, el, R),
        K = e => er(e, en, _),
        U = e => er(e, em, $),
        Z = e => k.test(e),
        J = e => eo(e, ei),
        Q = e => eo(e, ed),
        V = e => eo(e, el),
        X = e => eo(e, es),
        Y = e => eo(e, en),
        ee = e => eo(e, em, !0),
        et = e => eo(e, ec, !0),
        er = (e, t, r) => {
            let o = x.exec(e);
            return !!o && (o[1] ? t(o[1]) : r(o[2]))
        },
        eo = (e, t, r = !1) => {
            let o = k.exec(e);
            return !!o && (o[1] ? t(o[1]) : r)
        },
        el = e => "position" === e || "percentage" === e,
        en = e => "image" === e || "url" === e,
        es = e => "length" === e || "size" === e || "bg-size" === e,
        ei = e => "length" === e,
        ea = e => "number" === e,
        ed = e => "family-name" === e,
        ec = e => "number" === e || "weight" === e,
        em = e => "shadow" === e,
        ep = ((e, ...t) => {
            let r, s, i, a, d = e => {
                let t = s(e);
                if (t) return t;
                let o = ((e, t) => {
                    let {
                        parseClassName: r,
                        getClassGroupId: o,
                        getConflictingClassGroupIds: l,
                        sortModifiers: n,
                        postfixLookupClassGroupIds: s
                    } = t, i = [], a = e.trim().split(f), d = "";
                    for (let e = a.length - 1; e >= 0; e -= 1) {
                        let t, c = a[e],
                            {
                                isExternal: m,
                                modifiers: p,
                                hasImportantModifier: u,
                                baseClassName: b,
                                maybePostfixModifierPosition: f
                            } = r(c);
                        if (m) {
                            d = c + (d.length > 0 ? " " + d : d);
                            continue
                        }
                        let h = !!f;
                        if (h) {
                            let e = (t = o(b.substring(0, f))) && s[t] ? o(b) : void 0;
                            e && e !== t && (t = e, h = !1)
                        } else t = o(b);
                        if (!t) {
                            if (!h || !(t = o(b))) {
                                d = c + (d.length > 0 ? " " + d : d);
                                continue
                            }
                            h = !1
                        }
                        let g = 0 === p.length ? "" : 1 === p.length ? p[0] : n(p).join(":"),
                            w = u ? g + "!" : g,
                            x = w + t;
                        if (i.indexOf(x) > -1) continue;
                        i.push(x);
                        let k = l(t, h);
                        for (let e = 0; e < k.length; ++e) {
                            let t = k[e];
                            i.push(w + t)
                        }
                        d = c + (d.length > 0 ? " " + d : d)
                    }
                    return d
                })(e, r);
                return i(e, o), o
            };
            return a = c => {
                var m;
                let p;
                return s = (r = {
                    cache: (e => {
                        if (e < 1) return {
                            get: () => void 0,
                            set: () => {}
                        };
                        let t = 0,
                            r = Object.create(null),
                            o = Object.create(null),
                            l = (l, n) => {
                                r[l] = n, ++t > e && (t = 0, o = r, r = Object.create(null))
                            };
                        return {
                            get(e) {
                                let t = r[e];
                                return void 0 !== t ? t : void 0 !== (t = o[e]) ? (l(e, t), t) : void 0
                            },
                            set(e, t) {
                                e in r ? r[e] = t : l(e, t)
                            }
                        }
                    })((m = t.reduce((e, t) => t(e), e())).cacheSize),
                    parseClassName: (e => {
                        let {
                            prefix: t,
                            experimentalParseClassName: r
                        } = e, o = e => {
                            let t, r = [],
                                o = 0,
                                l = 0,
                                n = 0,
                                s = e.length;
                            for (let i = 0; i < s; i++) {
                                let s = e[i];
                                if (0 === o && 0 === l) {
                                    if (":" === s) {
                                        r.push(e.slice(n, i)), n = i + 1;
                                        continue
                                    }
                                    if ("/" === s) {
                                        t = i;
                                        continue
                                    }
                                }
                                "[" === s ? o++ : "]" === s ? o-- : "(" === s ? l++ : ")" === s && l--
                            }
                            let i = 0 === r.length ? e : e.slice(n),
                                a = i,
                                d = !1;
                            return i.endsWith("!") ? (a = i.slice(0, -1), d = !0) : i.startsWith("!") && (a = i.slice(1), d = !0), b(r, d, a, t && t > n ? t - n : void 0)
                        };
                        if (t) {
                            let e = t + ":",
                                r = o;
                            o = t => t.startsWith(e) ? r(t.slice(e.length)) : b(u, !1, t, void 0, !0)
                        }
                        if (r) {
                            let e = o;
                            o = t => r({
                                className: t,
                                parseClassName: e
                            })
                        }
                        return o
                    })(m),
                    sortModifiers: (p = new Map, m.orderSensitiveModifiers.forEach((e, t) => {
                        p.set(e, 1e6 + t)
                    }), e => {
                        let t = [],
                            r = [];
                        for (let o = 0; o < e.length; o++) {
                            let l = e[o],
                                n = "[" === l[0],
                                s = p.has(l);
                            n || s ? (r.length > 0 && (r.sort(), t.push(...r), r = []), t.push(l)) : r.push(l)
                        }
                        return r.length > 0 && (r.sort(), t.push(...r)), t
                    }),
                    postfixLookupClassGroupIds: (e => {
                        let t = Object.create(null),
                            r = e.postfixLookupClassGroups;
                        if (r)
                            for (let e = 0; e < r.length; e++) t[r[e]] = !0;
                        return t
                    })(m),
                    ...(e => {
                        let t = (e => {
                                let {
                                    theme: t,
                                    classGroups: r
                                } = e;
                                return n(r, t)
                            })(e),
                            {
                                conflictingClassGroups: r,
                                conflictingClassGroupModifiers: s
                            } = e;
                        return {
                            getClassGroupId: e => {
                                if (e.startsWith("[") && e.endsWith("]")) {
                                    var r;
                                    let t, o, l;
                                    return -1 === (r = e).slice(1, -1).indexOf(":") ? void 0 : (o = (t = r.slice(1, -1)).indexOf(":"), (l = t.slice(0, o)) ? "arbitrary.." + l : void 0)
                                }
                                let o = e.split("-"),
                                    n = +("" === o[0] && o.length > 1);
                                return l(o, n, t)
                            },
                            getConflictingClassGroupIds: (e, t) => {
                                if (t) {
                                    let t = s[e],
                                        l = r[e];
                                    if (t) {
                                        if (l) {
                                            let e = Array(l.length + t.length);
                                            for (let t = 0; t < l.length; t++) e[t] = l[t];
                                            for (let r = 0; r < t.length; r++) e[l.length + r] = t[r];
                                            return e
                                        }
                                        return t
                                    }
                                    return l || o
                                }
                                return r[e] || o
                            }
                        }
                    })(m)
                }).cache.get, i = r.cache.set, a = d, d(c)
            }, (...e) => a(((...e) => {
                let t, r, o = 0,
                    l = "";
                for (; o < e.length;)(t = e[o++]) && (r = h(t)) && (l && (l += " "), l += r);
                return l
            })(...e))
        })(() => {
            let e = w("color"),
                t = w("font"),
                r = w("text"),
                o = w("font-weight"),
                l = w("tracking"),
                n = w("leading"),
                s = w("breakpoint"),
                i = w("container"),
                a = w("spacing"),
                d = w("radius"),
                c = w("shadow"),
                m = w("inset-shadow"),
                p = w("text-shadow"),
                u = w("drop-shadow"),
                b = w("blur"),
                f = w("perspective"),
                h = w("aspect"),
                g = w("ease"),
                x = w("animate"),
                k = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
                y = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"],
                v = () => [...y(), Z, M],
                z = () => ["auto", "hidden", "clip", "visible", "scroll"],
                C = () => ["auto", "contain", "none"],
                S = () => [Z, M, a],
                E = () => [T, "full", "auto", ...S()],
                W = () => [N, "none", "subgrid", Z, M],
                R = () => ["auto", {
                    span: ["full", N, Z, M]
                }, N, Z, M],
                $ = () => [N, "auto", Z, M],
                _ = () => ["auto", "min", "max", "fr", Z, M],
                er = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"],
                eo = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
                el = () => ["auto", ...S()],
                en = () => [T, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...S()],
                es = () => [T, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...S()],
                ei = () => [T, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...S()],
                ea = () => [e, Z, M],
                ed = () => [...y(), V, D, {
                    position: [Z, M]
                }],
                ec = () => ["no-repeat", {
                    repeat: ["", "x", "y", "space", "round"]
                }],
                em = () => ["auto", "cover", "contain", X, P, {
                    size: [Z, M]
                }],
                ep = () => [j, J, F],
                eu = () => ["", "none", "full", d, Z, M],
                eb = () => ["", A, J, F],
                ef = () => ["solid", "dashed", "dotted", "double"],
                eh = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
                eg = () => [A, j, V, D],
                ew = () => ["", "none", b, Z, M],
                ex = () => ["none", A, Z, M],
                ek = () => ["none", A, Z, M],
                ey = () => [A, Z, M],
                ev = () => [T, "full", ...S()];
            return {
                cacheSize: 500,
                theme: {
                    animate: ["spin", "ping", "pulse", "bounce"],
                    aspect: ["video"],
                    blur: [G],
                    breakpoint: [G],
                    color: [O],
                    container: [G],
                    "drop-shadow": [G],
                    ease: ["in", "out", "in-out"],
                    font: [B],
                    "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
                    "inset-shadow": [G],
                    leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
                    perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
                    radius: [G],
                    shadow: [G],
                    spacing: ["px", A],
                    text: [G],
                    "text-shadow": [G],
                    tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
                },
                classGroups: {
                    aspect: [{
                        aspect: ["auto", "square", T, M, Z, h]
                    }],
                    container: ["container"],
                    "container-type": [{
                        "@container": ["", "normal", "size", Z, M]
                    }],
                    "container-named": [I],
                    columns: [{
                        columns: [A, M, Z, i]
                    }],
                    "break-after": [{
                        "break-after": k()
                    }],
                    "break-before": [{
                        "break-before": k()
                    }],
                    "break-inside": [{
                        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
                    }],
                    "box-decoration": [{
                        "box-decoration": ["slice", "clone"]
                    }],
                    box: [{
                        box: ["border", "content"]
                    }],
                    display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
                    sr: ["sr-only", "not-sr-only"],
                    float: [{
                        float: ["right", "left", "none", "start", "end"]
                    }],
                    clear: [{
                        clear: ["left", "right", "both", "none", "start", "end"]
                    }],
                    isolation: ["isolate", "isolation-auto"],
                    "object-fit": [{
                        object: ["contain", "cover", "fill", "none", "scale-down"]
                    }],
                    "object-position": [{
                        object: v()
                    }],
                    overflow: [{
                        overflow: z()
                    }],
                    "overflow-x": [{
                        "overflow-x": z()
                    }],
                    "overflow-y": [{
                        "overflow-y": z()
                    }],
                    overscroll: [{
                        overscroll: C()
                    }],
                    "overscroll-x": [{
                        "overscroll-x": C()
                    }],
                    "overscroll-y": [{
                        "overscroll-y": C()
                    }],
                    position: ["static", "fixed", "absolute", "relative", "sticky"],
                    inset: [{
                        inset: E()
                    }],
                    "inset-x": [{
                        "inset-x": E()
                    }],
                    "inset-y": [{
                        "inset-y": E()
                    }],
                    start: [{
                        "inset-s": E(),
                        start: E()
                    }],
                    end: [{
                        "inset-e": E(),
                        end: E()
                    }],
                    "inset-bs": [{
                        "inset-bs": E()
                    }],
                    "inset-be": [{
                        "inset-be": E()
                    }],
                    top: [{
                        top: E()
                    }],
                    right: [{
                        right: E()
                    }],
                    bottom: [{
                        bottom: E()
                    }],
                    left: [{
                        left: E()
                    }],
                    visibility: ["visible", "invisible", "collapse"],
                    z: [{
                        z: [N, "auto", Z, M]
                    }],
                    basis: [{
                        basis: [T, "full", "auto", i, ...S()]
                    }],
                    "flex-direction": [{
                        flex: ["row", "row-reverse", "col", "col-reverse"]
                    }],
                    "flex-wrap": [{
                        flex: ["nowrap", "wrap", "wrap-reverse"]
                    }],
                    flex: [{
                        flex: [A, T, "auto", "initial", "none", M]
                    }],
                    grow: [{
                        grow: ["", A, Z, M]
                    }],
                    shrink: [{
                        shrink: ["", A, Z, M]
                    }],
                    order: [{
                        order: [N, "first", "last", "none", Z, M]
                    }],
                    "grid-cols": [{
                        "grid-cols": W()
                    }],
                    "col-start-end": [{
                        col: R()
                    }],
                    "col-start": [{
                        "col-start": $()
                    }],
                    "col-end": [{
                        "col-end": $()
                    }],
                    "grid-rows": [{
                        "grid-rows": W()
                    }],
                    "row-start-end": [{
                        row: R()
                    }],
                    "row-start": [{
                        "row-start": $()
                    }],
                    "row-end": [{
                        "row-end": $()
                    }],
                    "grid-flow": [{
                        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
                    }],
                    "auto-cols": [{
                        "auto-cols": _()
                    }],
                    "auto-rows": [{
                        "auto-rows": _()
                    }],
                    gap: [{
                        gap: S()
                    }],
                    "gap-x": [{
                        "gap-x": S()
                    }],
                    "gap-y": [{
                        "gap-y": S()
                    }],
                    "justify-content": [{
                        justify: [...er(), "normal"]
                    }],
                    "justify-items": [{
                        "justify-items": [...eo(), "normal"]
                    }],
                    "justify-self": [{
                        "justify-self": ["auto", ...eo()]
                    }],
                    "align-content": [{
                        content: ["normal", ...er()]
                    }],
                    "align-items": [{
                        items: [...eo(), {
                            baseline: ["", "last"]
                        }]
                    }],
                    "align-self": [{
                        self: ["auto", ...eo(), {
                            baseline: ["", "last"]
                        }]
                    }],
                    "place-content": [{
                        "place-content": er()
                    }],
                    "place-items": [{
                        "place-items": [...eo(), "baseline"]
                    }],
                    "place-self": [{
                        "place-self": ["auto", ...eo()]
                    }],
                    p: [{
                        p: S()
                    }],
                    px: [{
                        px: S()
                    }],
                    py: [{
                        py: S()
                    }],
                    ps: [{
                        ps: S()
                    }],
                    pe: [{
                        pe: S()
                    }],
                    pbs: [{
                        pbs: S()
                    }],
                    pbe: [{
                        pbe: S()
                    }],
                    pt: [{
                        pt: S()
                    }],
                    pr: [{
                        pr: S()
                    }],
                    pb: [{
                        pb: S()
                    }],
                    pl: [{
                        pl: S()
                    }],
                    m: [{
                        m: el()
                    }],
                    mx: [{
                        mx: el()
                    }],
                    my: [{
                        my: el()
                    }],
                    ms: [{
                        ms: el()
                    }],
                    me: [{
                        me: el()
                    }],
                    mbs: [{
                        mbs: el()
                    }],
                    mbe: [{
                        mbe: el()
                    }],
                    mt: [{
                        mt: el()
                    }],
                    mr: [{
                        mr: el()
                    }],
                    mb: [{
                        mb: el()
                    }],
                    ml: [{
                        ml: el()
                    }],
                    "space-x": [{
                        "space-x": S()
                    }],
                    "space-x-reverse": ["space-x-reverse"],
                    "space-y": [{
                        "space-y": S()
                    }],
                    "space-y-reverse": ["space-y-reverse"],
                    size: [{
                        size: en()
                    }],
                    "inline-size": [{
                        inline: ["auto", ...es()]
                    }],
                    "min-inline-size": [{
                        "min-inline": ["auto", ...es()]
                    }],
                    "max-inline-size": [{
                        "max-inline": ["none", ...es()]
                    }],
                    "block-size": [{
                        block: ["auto", ...ei()]
                    }],
                    "min-block-size": [{
                        "min-block": ["auto", ...ei()]
                    }],
                    "max-block-size": [{
                        "max-block": ["none", ...ei()]
                    }],
                    w: [{
                        w: [i, "screen", ...en()]
                    }],
                    "min-w": [{
                        "min-w": [i, "screen", "none", ...en()]
                    }],
                    "max-w": [{
                        "max-w": [i, "screen", "none", "prose", {
                            screen: [s]
                        }, ...en()]
                    }],
                    h: [{
                        h: ["screen", "lh", ...en()]
                    }],
                    "min-h": [{
                        "min-h": ["screen", "lh", "none", ...en()]
                    }],
                    "max-h": [{
                        "max-h": ["screen", "lh", ...en()]
                    }],
                    "font-size": [{
                        text: ["base", r, J, F]
                    }],
                    "font-smoothing": ["antialiased", "subpixel-antialiased"],
                    "font-style": ["italic", "not-italic"],
                    "font-weight": [{
                        font: [o, et, q]
                    }],
                    "font-stretch": [{
                        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", j, M]
                    }],
                    "font-family": [{
                        font: [Q, H, t]
                    }],
                    "font-features": [{
                        "font-features": [M]
                    }],
                    "fvn-normal": ["normal-nums"],
                    "fvn-ordinal": ["ordinal"],
                    "fvn-slashed-zero": ["slashed-zero"],
                    "fvn-figure": ["lining-nums", "oldstyle-nums"],
                    "fvn-spacing": ["proportional-nums", "tabular-nums"],
                    "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
                    tracking: [{
                        tracking: [l, Z, M]
                    }],
                    "line-clamp": [{
                        "line-clamp": [A, "none", Z, L]
                    }],
                    leading: [{
                        leading: [n, ...S()]
                    }],
                    "list-image": [{
                        "list-image": ["none", Z, M]
                    }],
                    "list-style-position": [{
                        list: ["inside", "outside"]
                    }],
                    "list-style-type": [{
                        list: ["disc", "decimal", "none", Z, M]
                    }],
                    "text-alignment": [{
                        text: ["left", "center", "right", "justify", "start", "end"]
                    }],
                    "placeholder-color": [{
                        placeholder: ea()
                    }],
                    "text-color": [{
                        text: ea()
                    }],
                    "text-decoration": ["underline", "overline", "line-through", "no-underline"],
                    "text-decoration-style": [{
                        decoration: [...ef(), "wavy"]
                    }],
                    "text-decoration-thickness": [{
                        decoration: [A, "from-font", "auto", Z, F]
                    }],
                    "text-decoration-color": [{
                        decoration: ea()
                    }],
                    "underline-offset": [{
                        "underline-offset": [A, "auto", Z, M]
                    }],
                    "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
                    "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
                    "text-wrap": [{
                        text: ["wrap", "nowrap", "balance", "pretty"]
                    }],
                    indent: [{
                        indent: S()
                    }],
                    "tab-size": [{
                        tab: [N, Z, M]
                    }],
                    "vertical-align": [{
                        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Z, M]
                    }],
                    whitespace: [{
                        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
                    }],
                    break: [{
                        break: ["normal", "words", "all", "keep"]
                    }],
                    wrap: [{
                        wrap: ["break-word", "anywhere", "normal"]
                    }],
                    hyphens: [{
                        hyphens: ["none", "manual", "auto"]
                    }],
                    content: [{
                        content: ["none", Z, M]
                    }],
                    "bg-attachment": [{
                        bg: ["fixed", "local", "scroll"]
                    }],
                    "bg-clip": [{
                        "bg-clip": ["border", "padding", "content", "text"]
                    }],
                    "bg-origin": [{
                        "bg-origin": ["border", "padding", "content"]
                    }],
                    "bg-position": [{
                        bg: ed()
                    }],
                    "bg-repeat": [{
                        bg: ec()
                    }],
                    "bg-size": [{
                        bg: em()
                    }],
                    "bg-image": [{
                        bg: ["none", {
                            linear: [{
                                to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
                            }, N, Z, M],
                            radial: ["", Z, M],
                            conic: [N, Z, M]
                        }, Y, K]
                    }],
                    "bg-color": [{
                        bg: ea()
                    }],
                    "gradient-from-pos": [{
                        from: ep()
                    }],
                    "gradient-via-pos": [{
                        via: ep()
                    }],
                    "gradient-to-pos": [{
                        to: ep()
                    }],
                    "gradient-from": [{
                        from: ea()
                    }],
                    "gradient-via": [{
                        via: ea()
                    }],
                    "gradient-to": [{
                        to: ea()
                    }],
                    rounded: [{
                        rounded: eu()
                    }],
                    "rounded-s": [{
                        "rounded-s": eu()
                    }],
                    "rounded-e": [{
                        "rounded-e": eu()
                    }],
                    "rounded-t": [{
                        "rounded-t": eu()
                    }],
                    "rounded-r": [{
                        "rounded-r": eu()
                    }],
                    "rounded-b": [{
                        "rounded-b": eu()
                    }],
                    "rounded-l": [{
                        "rounded-l": eu()
                    }],
                    "rounded-ss": [{
                        "rounded-ss": eu()
                    }],
                    "rounded-se": [{
                        "rounded-se": eu()
                    }],
                    "rounded-ee": [{
                        "rounded-ee": eu()
                    }],
                    "rounded-es": [{
                        "rounded-es": eu()
                    }],
                    "rounded-tl": [{
                        "rounded-tl": eu()
                    }],
                    "rounded-tr": [{
                        "rounded-tr": eu()
                    }],
                    "rounded-br": [{
                        "rounded-br": eu()
                    }],
                    "rounded-bl": [{
                        "rounded-bl": eu()
                    }],
                    "border-w": [{
                        border: eb()
                    }],
                    "border-w-x": [{
                        "border-x": eb()
                    }],
                    "border-w-y": [{
                        "border-y": eb()
                    }],
                    "border-w-s": [{
                        "border-s": eb()
                    }],
                    "border-w-e": [{
                        "border-e": eb()
                    }],
                    "border-w-bs": [{
                        "border-bs": eb()
                    }],
                    "border-w-be": [{
                        "border-be": eb()
                    }],
                    "border-w-t": [{
                        "border-t": eb()
                    }],
                    "border-w-r": [{
                        "border-r": eb()
                    }],
                    "border-w-b": [{
                        "border-b": eb()
                    }],
                    "border-w-l": [{
                        "border-l": eb()
                    }],
                    "divide-x": [{
                        "divide-x": eb()
                    }],
                    "divide-x-reverse": ["divide-x-reverse"],
                    "divide-y": [{
                        "divide-y": eb()
                    }],
                    "divide-y-reverse": ["divide-y-reverse"],
                    "border-style": [{
                        border: [...ef(), "hidden", "none"]
                    }],
                    "divide-style": [{
                        divide: [...ef(), "hidden", "none"]
                    }],
                    "border-color": [{
                        border: ea()
                    }],
                    "border-color-x": [{
                        "border-x": ea()
                    }],
                    "border-color-y": [{
                        "border-y": ea()
                    }],
                    "border-color-s": [{
                        "border-s": ea()
                    }],
                    "border-color-e": [{
                        "border-e": ea()
                    }],
                    "border-color-bs": [{
                        "border-bs": ea()
                    }],
                    "border-color-be": [{
                        "border-be": ea()
                    }],
                    "border-color-t": [{
                        "border-t": ea()
                    }],
                    "border-color-r": [{
                        "border-r": ea()
                    }],
                    "border-color-b": [{
                        "border-b": ea()
                    }],
                    "border-color-l": [{
                        "border-l": ea()
                    }],
                    "divide-color": [{
                        divide: ea()
                    }],
                    "outline-style": [{
                        outline: [...ef(), "none", "hidden"]
                    }],
                    "outline-offset": [{
                        "outline-offset": [A, Z, M]
                    }],
                    "outline-w": [{
                        outline: ["", A, J, F]
                    }],
                    "outline-color": [{
                        outline: ea()
                    }],
                    shadow: [{
                        shadow: ["", "none", c, ee, U]
                    }],
                    "shadow-color": [{
                        shadow: ea()
                    }],
                    "inset-shadow": [{
                        "inset-shadow": ["none", m, ee, U]
                    }],
                    "inset-shadow-color": [{
                        "inset-shadow": ea()
                    }],
                    "ring-w": [{
                        ring: eb()
                    }],
                    "ring-w-inset": ["ring-inset"],
                    "ring-color": [{
                        ring: ea()
                    }],
                    "ring-offset-w": [{
                        "ring-offset": [A, F]
                    }],
                    "ring-offset-color": [{
                        "ring-offset": ea()
                    }],
                    "inset-ring-w": [{
                        "inset-ring": eb()
                    }],
                    "inset-ring-color": [{
                        "inset-ring": ea()
                    }],
                    "text-shadow": [{
                        "text-shadow": ["none", p, ee, U]
                    }],
                    "text-shadow-color": [{
                        "text-shadow": ea()
                    }],
                    opacity: [{
                        opacity: [A, Z, M]
                    }],
                    "mix-blend": [{
                        "mix-blend": [...eh(), "plus-darker", "plus-lighter"]
                    }],
                    "bg-blend": [{
                        "bg-blend": eh()
                    }],
                    "mask-clip": [{
                        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
                    }, "mask-no-clip"],
                    "mask-composite": [{
                        mask: ["add", "subtract", "intersect", "exclude"]
                    }],
                    "mask-image-linear-pos": [{
                        "mask-linear": [A]
                    }],
                    "mask-image-linear-from-pos": [{
                        "mask-linear-from": eg()
                    }],
                    "mask-image-linear-to-pos": [{
                        "mask-linear-to": eg()
                    }],
                    "mask-image-linear-from-color": [{
                        "mask-linear-from": ea()
                    }],
                    "mask-image-linear-to-color": [{
                        "mask-linear-to": ea()
                    }],
                    "mask-image-t-from-pos": [{
                        "mask-t-from": eg()
                    }],
                    "mask-image-t-to-pos": [{
                        "mask-t-to": eg()
                    }],
                    "mask-image-t-from-color": [{
                        "mask-t-from": ea()
                    }],
                    "mask-image-t-to-color": [{
                        "mask-t-to": ea()
                    }],
                    "mask-image-r-from-pos": [{
                        "mask-r-from": eg()
                    }],
                    "mask-image-r-to-pos": [{
                        "mask-r-to": eg()
                    }],
                    "mask-image-r-from-color": [{
                        "mask-r-from": ea()
                    }],
                    "mask-image-r-to-color": [{
                        "mask-r-to": ea()
                    }],
                    "mask-image-b-from-pos": [{
                        "mask-b-from": eg()
                    }],
                    "mask-image-b-to-pos": [{
                        "mask-b-to": eg()
                    }],
                    "mask-image-b-from-color": [{
                        "mask-b-from": ea()
                    }],
                    "mask-image-b-to-color": [{
                        "mask-b-to": ea()
                    }],
                    "mask-image-l-from-pos": [{
                        "mask-l-from": eg()
                    }],
                    "mask-image-l-to-pos": [{
                        "mask-l-to": eg()
                    }],
                    "mask-image-l-from-color": [{
                        "mask-l-from": ea()
                    }],
                    "mask-image-l-to-color": [{
                        "mask-l-to": ea()
                    }],
                    "mask-image-x-from-pos": [{
                        "mask-x-from": eg()
                    }],
                    "mask-image-x-to-pos": [{
                        "mask-x-to": eg()
                    }],
                    "mask-image-x-from-color": [{
                        "mask-x-from": ea()
                    }],
                    "mask-image-x-to-color": [{
                        "mask-x-to": ea()
                    }],
                    "mask-image-y-from-pos": [{
                        "mask-y-from": eg()
                    }],
                    "mask-image-y-to-pos": [{
                        "mask-y-to": eg()
                    }],
                    "mask-image-y-from-color": [{
                        "mask-y-from": ea()
                    }],
                    "mask-image-y-to-color": [{
                        "mask-y-to": ea()
                    }],
                    "mask-image-radial": [{
                        "mask-radial": [Z, M]
                    }],
                    "mask-image-radial-from-pos": [{
                        "mask-radial-from": eg()
                    }],
                    "mask-image-radial-to-pos": [{
                        "mask-radial-to": eg()
                    }],
                    "mask-image-radial-from-color": [{
                        "mask-radial-from": ea()
                    }],
                    "mask-image-radial-to-color": [{
                        "mask-radial-to": ea()
                    }],
                    "mask-image-radial-shape": [{
                        "mask-radial": ["circle", "ellipse"]
                    }],
                    "mask-image-radial-size": [{
                        "mask-radial": [{
                            closest: ["side", "corner"],
                            farthest: ["side", "corner"]
                        }]
                    }],
                    "mask-image-radial-pos": [{
                        "mask-radial-at": y()
                    }],
                    "mask-image-conic-pos": [{
                        "mask-conic": [A]
                    }],
                    "mask-image-conic-from-pos": [{
                        "mask-conic-from": eg()
                    }],
                    "mask-image-conic-to-pos": [{
                        "mask-conic-to": eg()
                    }],
                    "mask-image-conic-from-color": [{
                        "mask-conic-from": ea()
                    }],
                    "mask-image-conic-to-color": [{
                        "mask-conic-to": ea()
                    }],
                    "mask-mode": [{
                        mask: ["alpha", "luminance", "match"]
                    }],
                    "mask-origin": [{
                        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
                    }],
                    "mask-position": [{
                        mask: ed()
                    }],
                    "mask-repeat": [{
                        mask: ec()
                    }],
                    "mask-size": [{
                        mask: em()
                    }],
                    "mask-type": [{
                        "mask-type": ["alpha", "luminance"]
                    }],
                    "mask-image": [{
                        mask: ["none", Z, M]
                    }],
                    filter: [{
                        filter: ["", "none", Z, M]
                    }],
                    blur: [{
                        blur: ew()
                    }],
                    brightness: [{
                        brightness: [A, Z, M]
                    }],
                    contrast: [{
                        contrast: [A, Z, M]
                    }],
                    "drop-shadow": [{
                        "drop-shadow": ["", "none", u, ee, U]
                    }],
                    "drop-shadow-color": [{
                        "drop-shadow": ea()
                    }],
                    grayscale: [{
                        grayscale: ["", A, Z, M]
                    }],
                    "hue-rotate": [{
                        "hue-rotate": [A, Z, M]
                    }],
                    invert: [{
                        invert: ["", A, Z, M]
                    }],
                    saturate: [{
                        saturate: [A, Z, M]
                    }],
                    sepia: [{
                        sepia: ["", A, Z, M]
                    }],
                    "backdrop-filter": [{
                        "backdrop-filter": ["", "none", Z, M]
                    }],
                    "backdrop-blur": [{
                        "backdrop-blur": ew()
                    }],
                    "backdrop-brightness": [{
                        "backdrop-brightness": [A, Z, M]
                    }],
                    "backdrop-contrast": [{
                        "backdrop-contrast": [A, Z, M]
                    }],
                    "backdrop-grayscale": [{
                        "backdrop-grayscale": ["", A, Z, M]
                    }],
                    "backdrop-hue-rotate": [{
                        "backdrop-hue-rotate": [A, Z, M]
                    }],
                    "backdrop-invert": [{
                        "backdrop-invert": ["", A, Z, M]
                    }],
                    "backdrop-opacity": [{
                        "backdrop-opacity": [A, Z, M]
                    }],
                    "backdrop-saturate": [{
                        "backdrop-saturate": [A, Z, M]
                    }],
                    "backdrop-sepia": [{
                        "backdrop-sepia": ["", A, Z, M]
                    }],
                    "border-collapse": [{
                        border: ["collapse", "separate"]
                    }],
                    "border-spacing": [{
                        "border-spacing": S()
                    }],
                    "border-spacing-x": [{
                        "border-spacing-x": S()
                    }],
                    "border-spacing-y": [{
                        "border-spacing-y": S()
                    }],
                    "table-layout": [{
                        table: ["auto", "fixed"]
                    }],
                    caption: [{
                        caption: ["top", "bottom"]
                    }],
                    transition: [{
                        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", Z, M]
                    }],
                    "transition-behavior": [{
                        transition: ["normal", "discrete"]
                    }],
                    duration: [{
                        duration: [A, "initial", Z, M]
                    }],
                    ease: [{
                        ease: ["linear", "initial", g, Z, M]
                    }],
                    delay: [{
                        delay: [A, Z, M]
                    }],
                    animate: [{
                        animate: ["none", x, Z, M]
                    }],
                    backface: [{
                        backface: ["hidden", "visible"]
                    }],
                    perspective: [{
                        perspective: [f, Z, M]
                    }],
                    "perspective-origin": [{
                        "perspective-origin": v()
                    }],
                    rotate: [{
                        rotate: ex()
                    }],
                    "rotate-x": [{
                        "rotate-x": ex()
                    }],
                    "rotate-y": [{
                        "rotate-y": ex()
                    }],
                    "rotate-z": [{
                        "rotate-z": ex()
                    }],
                    scale: [{
                        scale: ek()
                    }],
                    "scale-x": [{
                        "scale-x": ek()
                    }],
                    "scale-y": [{
                        "scale-y": ek()
                    }],
                    "scale-z": [{
                        "scale-z": ek()
                    }],
                    "scale-3d": ["scale-3d"],
                    skew: [{
                        skew: ey()
                    }],
                    "skew-x": [{
                        "skew-x": ey()
                    }],
                    "skew-y": [{
                        "skew-y": ey()
                    }],
                    transform: [{
                        transform: [Z, M, "", "none", "gpu", "cpu"]
                    }],
                    "transform-origin": [{
                        origin: v()
                    }],
                    "transform-style": [{
                        transform: ["3d", "flat"]
                    }],
                    translate: [{
                        translate: ev()
                    }],
                    "translate-x": [{
                        "translate-x": ev()
                    }],
                    "translate-y": [{
                        "translate-y": ev()
                    }],
                    "translate-z": [{
                        "translate-z": ev()
                    }],
                    "translate-none": ["translate-none"],
                    zoom: [{
                        zoom: [N, Z, M]
                    }],
                    accent: [{
                        accent: ea()
                    }],
                    appearance: [{
                        appearance: ["none", "auto"]
                    }],
                    "caret-color": [{
                        caret: ea()
                    }],
                    "color-scheme": [{
                        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
                    }],
                    cursor: [{
                        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Z, M]
                    }],
                    "field-sizing": [{
                        "field-sizing": ["fixed", "content"]
                    }],
                    "pointer-events": [{
                        "pointer-events": ["auto", "none"]
                    }],
                    resize: [{
                        resize: ["none", "", "y", "x"]
                    }],
                    "scroll-behavior": [{
                        scroll: ["auto", "smooth"]
                    }],
                    "scrollbar-thumb-color": [{
                        "scrollbar-thumb": ea()
                    }],
                    "scrollbar-track-color": [{
                        "scrollbar-track": ea()
                    }],
                    "scrollbar-gutter": [{
                        "scrollbar-gutter": ["auto", "stable", "both"]
                    }],
                    "scrollbar-w": [{
                        scrollbar: ["auto", "thin", "none"]
                    }],
                    "scroll-m": [{
                        "scroll-m": S()
                    }],
                    "scroll-mx": [{
                        "scroll-mx": S()
                    }],
                    "scroll-my": [{
                        "scroll-my": S()
                    }],
                    "scroll-ms": [{
                        "scroll-ms": S()
                    }],
                    "scroll-me": [{
                        "scroll-me": S()
                    }],
                    "scroll-mbs": [{
                        "scroll-mbs": S()
                    }],
                    "scroll-mbe": [{
                        "scroll-mbe": S()
                    }],
                    "scroll-mt": [{
                        "scroll-mt": S()
                    }],
                    "scroll-mr": [{
                        "scroll-mr": S()
                    }],
                    "scroll-mb": [{
                        "scroll-mb": S()
                    }],
                    "scroll-ml": [{
                        "scroll-ml": S()
                    }],
                    "scroll-p": [{
                        "scroll-p": S()
                    }],
                    "scroll-px": [{
                        "scroll-px": S()
                    }],
                    "scroll-py": [{
                        "scroll-py": S()
                    }],
                    "scroll-ps": [{
                        "scroll-ps": S()
                    }],
                    "scroll-pe": [{
                        "scroll-pe": S()
                    }],
                    "scroll-pbs": [{
                        "scroll-pbs": S()
                    }],
                    "scroll-pbe": [{
                        "scroll-pbe": S()
                    }],
                    "scroll-pt": [{
                        "scroll-pt": S()
                    }],
                    "scroll-pr": [{
                        "scroll-pr": S()
                    }],
                    "scroll-pb": [{
                        "scroll-pb": S()
                    }],
                    "scroll-pl": [{
                        "scroll-pl": S()
                    }],
                    "snap-align": [{
                        snap: ["start", "end", "center", "align-none"]
                    }],
                    "snap-stop": [{
                        snap: ["normal", "always"]
                    }],
                    "snap-type": [{
                        snap: ["none", "x", "y", "both"]
                    }],
                    "snap-strictness": [{
                        snap: ["mandatory", "proximity"]
                    }],
                    touch: [{
                        touch: ["auto", "none", "manipulation"]
                    }],
                    "touch-x": [{
                        "touch-pan": ["x", "left", "right"]
                    }],
                    "touch-y": [{
                        "touch-pan": ["y", "up", "down"]
                    }],
                    "touch-pz": ["touch-pinch-zoom"],
                    select: [{
                        select: ["none", "text", "all", "auto"]
                    }],
                    "will-change": [{
                        "will-change": ["auto", "scroll", "contents", "transform", Z, M]
                    }],
                    fill: [{
                        fill: ["none", ...ea()]
                    }],
                    "stroke-w": [{
                        stroke: [A, J, F, L]
                    }],
                    stroke: [{
                        stroke: ["none", ...ea()]
                    }],
                    "forced-color-adjust": [{
                        "forced-color-adjust": ["auto", "none"]
                    }]
                },
                conflictingClassGroups: {
                    "container-named": ["container-type"],
                    overflow: ["overflow-x", "overflow-y"],
                    overscroll: ["overscroll-x", "overscroll-y"],
                    inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
                    "inset-x": ["right", "left"],
                    "inset-y": ["top", "bottom"],
                    flex: ["basis", "grow", "shrink"],
                    gap: ["gap-x", "gap-y"],
                    p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
                    px: ["pr", "pl"],
                    py: ["pt", "pb"],
                    m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
                    mx: ["mr", "ml"],
                    my: ["mt", "mb"],
                    size: ["w", "h"],
                    "font-size": ["leading"],
                    "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
                    "fvn-ordinal": ["fvn-normal"],
                    "fvn-slashed-zero": ["fvn-normal"],
                    "fvn-figure": ["fvn-normal"],
                    "fvn-spacing": ["fvn-normal"],
                    "fvn-fraction": ["fvn-normal"],
                    "line-clamp": ["display", "overflow"],
                    rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
                    "rounded-s": ["rounded-ss", "rounded-es"],
                    "rounded-e": ["rounded-se", "rounded-ee"],
                    "rounded-t": ["rounded-tl", "rounded-tr"],
                    "rounded-r": ["rounded-tr", "rounded-br"],
                    "rounded-b": ["rounded-br", "rounded-bl"],
                    "rounded-l": ["rounded-tl", "rounded-bl"],
                    "border-spacing": ["border-spacing-x", "border-spacing-y"],
                    "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
                    "border-w-x": ["border-w-r", "border-w-l"],
                    "border-w-y": ["border-w-t", "border-w-b"],
                    "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
                    "border-color-x": ["border-color-r", "border-color-l"],
                    "border-color-y": ["border-color-t", "border-color-b"],
                    translate: ["translate-x", "translate-y", "translate-none"],
                    "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
                    "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
                    "scroll-mx": ["scroll-mr", "scroll-ml"],
                    "scroll-my": ["scroll-mt", "scroll-mb"],
                    "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
                    "scroll-px": ["scroll-pr", "scroll-pl"],
                    "scroll-py": ["scroll-pt", "scroll-pb"],
                    touch: ["touch-x", "touch-y", "touch-pz"],
                    "touch-x": ["touch"],
                    "touch-y": ["touch"],
                    "touch-pz": ["touch"]
                },
                conflictingClassGroupModifiers: {
                    "font-size": ["leading"]
                },
                postfixLookupClassGroups: ["container-type"],
                orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
            }
        });
    e.s(["cn", 0, function(...e) {
        return ep(t(e))
    }, "emissiveIntensityForDay", 0, function(e) {
        return e <= 0 ? 0 : e < .25 ? e / .25 : e <= .75 ? 1 : e >= 1 ? 0 : (1 - e) / .25
    }, "normalizeMeshName", 0, function(e) {
        let t = e.match(/^([A-Za-z]+)(\d)(\d{2})$/);
        if (!t) return e;
        let [, r, o, l] = t;
        return `${r} ${o}.${l}`
    }, "normalizeRetailMeshName", 0, function(e) {
        let t = e.replace(/_(F|B)$/i, ""),
            r = t.split("_");
        if (3 === r.length) {
            let [e, t, o] = r;
            return `${e}${t}.${o}`
        }
        if (2 === r.length) {
            let [e, t] = r;
            return `${e}.${t}`
        }
        return t
    }], 57851)
}, 75324, e => {
    "use strict";
    let t, r, o = "function" == typeof Symbol ? Symbol() : "_split",
        l, n = "u" > typeof Intl && "Segmenter" in Intl ? new Intl.Segmenter : 0,
        s = e => e ? "string" == typeof e ? s(document.querySelectorAll(e)) : "length" in e ? Array.from(e).reduce((e, t) => ("string" == typeof t ? e.push(...s(t)) : e.push(t), e), []) : [e] : [],
        i = e => s(e).filter(e => e && 1 === e.nodeType),
        a = [],
        d = function() {},
        c = {
            add: e => e()
        },
        m = /\s+/g,
        p = RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"),
        u = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        },
        b = (e, t) => {
            for (; ++t < e.length && e[t] === u;);
            return e[t] || u
        },
        f = ({
            element: e,
            html: t,
            ariaL: r,
            ariaH: o
        }) => {
            e.innerHTML = t, r ? e.setAttribute("aria-label", r) : e.removeAttribute("aria-label"), o ? e.setAttribute("aria-hidden", o) : e.removeAttribute("aria-hidden")
        },
        h = (e, t) => {
            if (t) {
                let r = new Set(e.join("").match(t) || a),
                    o = e.length,
                    l, n, s, i;
                if (r.size) {
                    for (; --o > -1;)
                        for (s of (n = e[o], r))
                            if (s.startsWith(n) && s.length > n.length) {
                                for (l = 0, i = n; s.startsWith(i += e[o + ++l]) && i.length < s.length;);
                                if (l && i.length === s.length) {
                                    e[o] = s, e.splice(o + 1, l);
                                    break
                                }
                            }
                }
            }
            return e
        },
        g = e => "inline" === window.getComputedStyle(e).display && (e.style.display = "inline-block"),
        w = (e, t, r) => t.insertBefore("string" == typeof e ? document.createTextNode(e) : e, r),
        x = (e, t, r) => {
            let o = t[e + "sClass"] || "",
                {
                    tag: l = "div",
                    aria: n = "auto",
                    propIndex: s = !1
                } = t,
                i = "line" === e ? "block" : "inline-block",
                a = o.indexOf("++") > -1,
                d = t => {
                    let d = document.createElement(l),
                        c = r.length + 1;
                    return o && (d.className = o + (a ? " " + o + c : "")), s && d.style.setProperty("--" + e, c + ""), "none" !== n && d.setAttribute("aria-hidden", "true"), "span" !== l && (d.style.position = "relative", d.style.display = i), d.textContent = t, r.push(d), d
                };
            return a && (o = o.replace("++", "")), d.collection = r, d
        },
        k = (e, t, r, o, l, s, i, d, c, p) => {
            var u;
            let b = Array.from(e.childNodes),
                f = 0,
                {
                    wordDelimiter: x,
                    reduceWhiteSpace: y = !0,
                    prepareText: v
                } = t,
                z = e.getBoundingClientRect(),
                C = z,
                S = !y && "pre" === window.getComputedStyle(e).whiteSpace.substring(0, 3),
                E = 0,
                T = r.collection,
                A, N, j, G, O, W, R, $, _, B, I, P, M, F, L, q, H, D;
            for ("object" == typeof x ? (j = x.delimiter || x, N = x.replaceWith || "") : N = "" === x ? "" : x || " ", A = " " !== N; f < b.length; f++)
                if (3 === (G = b[f]).nodeType) {
                    for (L = G.textContent || "", y ? L = L.replace(m, " ") : S && (L = L.replace(/\n/g, N + "\n")), v && (L = v(L, e)), G.textContent = L, H = (O = N || j ? L.split(j || N) : L.match(d) || a)[O.length - 1], $ = A ? " " === H.slice(-1) : !H, H || O.pop(), C = z, (R = A ? " " === O[0].charAt(0) : !O[0]) && w(" ", e, G), O[0] || O.shift(), h(O, c), s && p || (G.textContent = ""), _ = 1; _ <= O.length; _++)
                        if (q = O[_ - 1], !y && S && "\n" === q.charAt(0) && (null == (u = G.previousSibling) || u.remove(), w(document.createElement("br"), e, G), q = q.slice(1)), y || "" !== q)
                            if (" " === q) e.insertBefore(document.createTextNode(" "), G);
                            else {
                                if (A && " " === q.charAt(0) && w(" ", e, G), E && 1 === _ && !R && T.indexOf(E.parentNode) > -1 ? (W = T[T.length - 1]).appendChild(document.createTextNode(o ? "" : q)) : (w(W = r(o ? "" : q), e, G), E && 1 === _ && !R && W.insertBefore(E, W.firstChild)), o)
                                    for (D = 0, I = n ? h([...n.segment(q)].map(e => e.segment), c) : q.match(d) || a; D < I.length; D++) W.appendChild(" " === I[D] ? document.createTextNode(" ") : o(I[D]));
                                if (s && p) {
                                    if (L = G.textContent = L.substring(q.length + 1, L.length), (B = W.getBoundingClientRect()).top > C.top && B.left <= C.left) {
                                        for (P = e.cloneNode(), M = e.childNodes[0]; M && M !== W;) F = M, M = M.nextSibling, P.appendChild(F);
                                        e.parentNode.insertBefore(P, e), l && g(P)
                                    }
                                    C = B
                                }(_ < O.length || $) && w(_ >= O.length ? " " : A && " " === q.slice(-1) ? " " + N : N, e, G)
                            }
                    else w(N, e, G);
                    e.removeChild(G), E = 0
                } else 1 === G.nodeType && (i && i.indexOf(G) > -1 ? (T.indexOf(G.previousSibling) > -1 && T[T.length - 1].appendChild(G), E = G) : (k(G, t, r, o, l, s, i, d, c, !0), E = 0), l && g(G))
        },
        y = class e {
            constructor(e, t) {
                this.isSplit = !1, l || v.register(window.gsap), this.elements = i(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t, this.elements.forEach(e => {
                    var r;
                    !1 !== t.overwrite && (null == (r = e[o]) || r._data.orig.filter(({
                        element: t
                    }) => t === e).forEach(f)), e[o] = this
                }), this._split = () => this.isSplit && this.split(this.vars);
                let r = [],
                    n, s = () => {
                        let e = r.length,
                            t;
                        for (; e--;) {
                            let o = (t = r[e]).element.offsetWidth;
                            if (o !== t.width) {
                                t.width = o, this._split();
                                return
                            }
                        }
                    };
                this._data = {
                    orig: r,
                    obs: "u" > typeof ResizeObserver && new ResizeObserver(() => {
                        clearTimeout(n), n = setTimeout(s, 200)
                    })
                }, d(this), this.split(t)
            }
            split(e) {
                return (this._ctx || c).add(() => {
                    this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
                    let {
                        type: t = "chars,words,lines",
                        aria: o = "auto",
                        deepSlice: l = !0,
                        smartWrap: n,
                        onSplit: a,
                        autoSplit: d = !1,
                        specialChars: c,
                        mask: m
                    } = this.vars, f = t.indexOf("lines") > -1, h = t.indexOf("chars") > -1, g = t.indexOf("words") > -1, w = h && !g && !f, y = c && ("push" in c ? RegExp("(?:" + c.join("|") + ")", "gu") : c), v = y ? RegExp(y.source + "|" + p.source, "gu") : p, z = !!e.ignore && i(e.ignore), {
                        orig: C,
                        animTime: S,
                        obs: E
                    } = this._data, T;
                    (h || g || f) && (this.elements.forEach((t, r) => {
                        C[r] = {
                            element: t,
                            html: t.innerHTML,
                            ariaL: t.getAttribute("aria-label"),
                            ariaH: t.getAttribute("aria-hidden")
                        }, "auto" === o ? t.setAttribute("aria-label", (t.textContent || "").trim()) : "hidden" === o && t.setAttribute("aria-hidden", "true");
                        let i = [],
                            a = [],
                            d = [],
                            c = h ? x("char", e, i) : null,
                            m = x("word", e, a),
                            p, S, E, T;
                        if (k(t, e, m, c, w, l && (f || w), z, v, y, !1), f) {
                            let r, o, l = s(t.childNodes),
                                n = (r = x("line", e, d), o = window.getComputedStyle(t).textAlign || "left", (e, n) => {
                                    let s = r("");
                                    for (s.style.textAlign = o, t.insertBefore(s, l[e]); e < n; e++) s.appendChild(l[e]);
                                    s.normalize()
                                }),
                                i, a = [],
                                c = 0,
                                m = l.map(e => 1 === e.nodeType ? e.getBoundingClientRect() : u),
                                f = u,
                                h;
                            for (p = 0; p < l.length; p++) 1 === (i = l[p]).nodeType && ("BR" === i.nodeName ? (p && "BR" === l[p - 1].nodeName || (a.push(i), n(c, p + 1)), c = p + 1, f = b(m, p)) : (h = m[p], p && h.top > f.top && h.left < f.left + f.width - 1 && (n(c, p), c = p), f = h));
                            c < p && n(c, p), a.forEach(e => {
                                var t;
                                return null == (t = e.parentNode) ? void 0 : t.removeChild(e)
                            })
                        }
                        if (!g) {
                            for (p = 0; p < a.length; p++)
                                if (S = a[p], h || !S.nextSibling || 3 !== S.nextSibling.nodeType)
                                    if (n && !f) {
                                        for ((E = document.createElement("span")).style.whiteSpace = "nowrap"; S.firstChild;) E.appendChild(S.firstChild);
                                        S.replaceWith(E)
                                    } else S.replaceWith(...S.childNodes);
                            else(T = S.nextSibling) && 3 === T.nodeType && (T.textContent = (S.textContent || "") + (T.textContent || ""), S.remove());
                            a.length = 0, t.normalize()
                        }
                        this.lines.push(...d), this.words.push(...a), this.chars.push(...i)
                    }), m && this[m] && this.masks.push(...this[m].map(e => {
                        let t = e.cloneNode();
                        return e.replaceWith(t), t.appendChild(e), e.className && (t.className = e.className.trim().split(" ").map(e => e + "-mask").join(" ")), t.style.overflow = "clip", t
                    }))), this.isSplit = !0, r && f && d && r.addEventListener("loadingdone", this._split), (T = a && a(this)) && T.totalTime && (this._data.anim = S ? T.totalTime(S) : T), f && d && this.elements.forEach((e, t) => {
                        C[t].width = e.offsetWidth, E && E.observe(e)
                    })
                }), this
            }
            kill() {
                let {
                    obs: e
                } = this._data;
                e && e.disconnect(), null == r || r.removeEventListener("loadingdone", this._split)
            }
            revert() {
                var e, t;
                if (this.isSplit) {
                    let {
                        orig: r,
                        anim: o
                    } = this._data;
                    this.kill(), r.forEach(f), this.chars.length = this.words.length = this.lines.length = r.length = this.masks.length = 0, this.isSplit = !1, o && (this._data.animTime = o.totalTime(), o.revert()), null == (t = (e = this.vars).onRevert) || t.call(e, this)
                }
                return this
            }
            static create(t, r) {
                return new e(t, r)
            }
            static register(e) {
                (t = t || e || window.gsap) && (s = t.utils.toArray, d = t.core.context || d), !l && window.innerWidth > 0 && (r = document.fonts, l = !0)
            }
        };
    y.version = "3.15.0";
    let v = y;
    e.s(["SplitText", 0, v])
}, 74269, e => {
    "use strict";
    var t = {
            "fade-up": {
                opacity: 0,
                y: "110%"
            },
            "fade-down": {
                opacity: 0,
                y: "-110%"
            },
            fade: {
                opacity: 0
            },
            "fade-left": {
                opacity: 0,
                x: "-110%"
            },
            "fade-right": {
                opacity: 0,
                x: "110%"
            }
        },
        r = {
            "fade-up": "words",
            "fade-down": "words",
            fade: "words",
            "fade-left": "words",
            "fade-right": "words"
        },
        o = {
            chars: .025,
            words: .06,
            lines: .1
        },
        l = e.i(71645),
        n = e.i(65747),
        s = e.i(89970),
        i = e.i(83495),
        a = e.i(75324);
    s.default.registerPlugin(i.ScrollTrigger, n.useGSAP), s.default.registerPlugin(i.ScrollTrigger, a.SplitText, n.useGSAP), s.default.registerPlugin(i.ScrollTrigger, n.useGSAP), e.s(["AnimatedText", 0, function({
        as: e = "p",
        preset: i = "fade-up",
        type: d,
        stagger: c,
        delay: m,
        duration: p,
        ease: u,
        gsapVars: b,
        triggerVars: f,
        splitTextVars: h,
        onInit: g,
        className: w,
        children: x
    }) {
        let k = function(e = {}) {
            let {
                preset: i = "fade-up",
                type: d,
                stagger: c,
                delay: m = 0,
                duration: p = .9,
                ease: u = "power3.out",
                gsapVars: b = {},
                triggerVars: f = {},
                splitTextVars: h = {},
                onInit: g
            } = e, w = (0, l.useRef)(null);
            return (0, n.useGSAP)(() => {
                if (!w.current) return;
                let e = d ?? r[i],
                    l = c ?? o[e],
                    n = t[i],
                    x = new a.SplitText(w.current, {
                        type: "chars" === e ? "chars,words" : "lines" === e ? "lines,words" : "words",
                        linesClass: "line-wrap",
                        wordsClass: "word-wrap",
                        ...h
                    }),
                    k = "chars" === e ? x.chars : "words" === e ? x.words : x.lines;
                "lines" === e && x.lines.forEach(e => {
                    let t = document.createElement("div");
                    t.style.overflow = "hidden", e.parentNode?.insertBefore(t, e), t.appendChild(e)
                });
                let y = s.default.timeline({
                    scrollTrigger: {
                        trigger: w.current,
                        start: "top 88%",
                        toggleActions: "play none none none",
                        ...f
                    }
                });
                return y.from(k, {
                    ...n,
                    duration: p,
                    delay: m,
                    ease: u,
                    stagger: l,
                    ...b
                }), g?.(y), () => x.revert()
            }, {
                scope: w
            }), w
        }({
            preset: i,
            type: d,
            stagger: c,
            delay: m,
            duration: p,
            ease: u,
            gsapVars: b,
            triggerVars: f,
            splitTextVars: h,
            onInit: g
        });
        return (0, l.createElement)(e, {
            ref: k,
            className: w
        }, x)
    }], 74269)
}]);