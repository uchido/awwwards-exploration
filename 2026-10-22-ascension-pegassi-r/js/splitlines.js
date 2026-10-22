/* ============================================================
   Line-split reveal engine (reconstruction of the original
   in-house SplitText + js-animate-lines system).
   ============================================================ */
(function () {
  "use strict";

  var LINE_DURATION = 1.75;
  var LINE_EASE = "expo.out";
  var LINE_STAGGER = 0.1;
  var PAD_EM = 0.5;
  var IO_MARGIN = "0px 0px -20% 0px";

  function computedLineHeight(el) {
    var lh = parseFloat(getComputedStyle(el).lineHeight);
    if (!isFinite(lh) || lh <= 0) {
      var fs = parseFloat(getComputedStyle(el).fontSize) || 16;
      lh = fs * 1.2;
    }
    return lh;
  }

  function isOutOfFlow(el, root) {
    for (var n = el; n; n = n.parentElement) {
      var pos = getComputedStyle(n).position;
      if (pos === "absolute" || pos === "fixed") return true;
      if (n === root) break;
    }
    return false;
  }

  function collectTextNodes(root) {
    var out = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.length) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[data-no-split]")) return NodeFilter.FILTER_REJECT;
        if (isOutOfFlow(parent, root)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  /* Measure per-character rects and cluster them into visual lines.
     Returns [{ start:{node,offset}, end:{node,offset} }] in DOM order. */
  function measureLines(root) {
    var lineHeight = computedLineHeight(root);
    var threshold = lineHeight * 0.5;
    var nodes = collectTextNodes(root);
    var range = document.createRange();
    var globalLines = [];
    var lastLine = null;

    function pushSegment(node, text, start, end, top) {
      while (start < end && /\s/.test(text[start])) start++;
      while (end > start && /\s/.test(text[end - 1])) end--;
      if (end <= start) return;
      if (lastLine && Math.abs(top - lastLine.top) <= threshold) {
        lastLine.segments.push({ node: node, start: start, end: end });
      } else {
        lastLine = { top: top, segments: [{ node: node, start: start, end: end }] };
        globalLines.push(lastLine);
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var text = node.nodeValue;
      var runStart = null;
      var runTop = null;

      for (var c = 0; c < text.length; c++) {
        range.setStart(node, c);
        range.setEnd(node, c + 1);
        var rects = range.getClientRects();
        var rect = rects.length ? rects[0] : null;
        var empty = !rect || (rect.width === 0 && rect.height === 0);

        if (empty) {
          if (runStart === null && runTop !== null) runStart = c;
          continue;
        }

        var top = rect.top;
        if (runTop === null) {
          runTop = top;
          if (runStart === null) runStart = c;
        } else if (top - runTop > threshold) {
          pushSegment(node, text, runStart, c, runTop);
          runTop = top;
          runStart = c;
        } else if (top < runTop) {
          /* raised glyphs (sup) — keep on the same line */
          runTop = top;
        }
      }
      if (runStart !== null && runTop !== null && runStart < text.length) {
        pushSegment(node, text, runStart, text.length, runTop);
      }
    }

    return globalLines
      .filter(function (l) {
        return l.segments.length;
      })
      .map(function (l) {
        var first = l.segments[0];
        var last = l.segments[l.segments.length - 1];
        return {
          start: { node: first.node, offset: first.start },
          end: { node: last.node, offset: last.end }
        };
      });
  }

  function splitElement(el, padEm) {
    padEm = padEm == null ? PAD_EM : padEm;
    var snapshot = el.innerHTML;
    var fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
    var padPx = fontSize * padEm;
    var lines;
    try {
      lines = measureLines(el);
    } catch (err) {
      lines = [];
    }
    if (!lines.length) return null;

    var masks = [];
    var lineEls = [];

    for (var i = lines.length - 1; i >= 0; i--) {
      var seg = lines[i];
      var frag;
      try {
        var range = document.createRange();
        range.setStart(seg.start.node, seg.start.offset);
        range.setEnd(seg.end.node, seg.end.offset);
        frag = range.extractContents();
      } catch (err) {
        continue;
      }
      var line = document.createElement("div");
      line.className = "js-line";
      line.style.cssText = "display:block;position:relative;padding:" + padPx + "px 0";
      line.appendChild(frag);
      var mask = document.createElement("div");
      mask.className = "js-line-mask";
      mask.style.cssText = "display:block;position:relative;overflow:clip;margin:-" + padPx + "px 0";
      mask.appendChild(line);
      masks.unshift(mask);
      lineEls.unshift(line);
    }

    if (!masks.length) return null;

    el.style.display = "flex";
    el.style.flexDirection = "column";
    for (var m = 0; m < masks.length; m++) el.appendChild(masks[m]);

    return {
      el: el,
      lineEls: lineEls,
      maskEls: masks,
      revert: function () {
        el.innerHTML = snapshot;
        el.style.display = "";
        el.style.flexDirection = "";
      }
    };
  }

  function LineRevealer(options) {
    options = options || {};
    this.lineDuration = options.lineDuration || LINE_DURATION;
    this.lineEase = options.lineEase || LINE_EASE;
    this.stagger = options.stagger == null ? LINE_STAGGER : options.stagger;
    this.entries = new Map();
    this.observer = null;
    this.armed = false;
  }

  LineRevealer.prototype.reduced = function () {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  LineRevealer.prototype.hasGsap = function () {
    return typeof window.gsap !== "undefined";
  };

  /* Split every .js-animate-lines target in `scope`. */
  LineRevealer.prototype.split = function (scope) {
    if (!this.hasGsap() || this.reduced()) return;
    var self = this;
    var targets = Array.prototype.slice.call((scope || document).querySelectorAll(".js-animate-lines"));
    targets.forEach(function (el) {
      if (self.entries.has(el)) return;
      var entry = {
        el: el,
        group: el.closest(".js-animate-group"),
        split: null,
        state: "parked"
      };
      self.entries.set(el, entry);
    });
    var toSplit = [];
    this.entries.forEach(function (entry) {
      if (!entry.split && entry.state !== "done") toSplit.push(entry);
    });
    toSplit.forEach(function (entry) {
      if (!(entry.el.checkVisibility && entry.el.checkVisibility())) return;
      entry.split = splitElement(entry.el);
      if (entry.split) {
        window.gsap.set(entry.split.lineEls, { yPercent: 100 });
        entry.state = "parked";
      } else {
        entry.state = "done";
      }
    });
  };

  /* Arm the intersection observer (call after the enter transition). */
  LineRevealer.prototype.arm = function (delay) {
    if (!this.hasGsap() || this.reduced()) return;
    var self = this;
    this.armed = true;
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        function (records) {
          var played = [];
          records.forEach(function (rec) {
            if (!rec.isIntersecting) return;
            var entry = self.entries.get(rec.target);
            if (entry && entry.state === "parked") played.push(entry);
          });
          if (played.length) self._playTogether(played, 0);
        },
        { rootMargin: IO_MARGIN }
      );
    }
    this.entries.forEach(function (entry) {
      if (entry.state === "parked" && entry.split) self.observer.observe(entry.el);
    });
    /* Anything already inside the viewport plays with the given delay. */
    var visible = [];
    this.entries.forEach(function (entry) {
      if (
        entry.state === "parked" &&
        entry.split &&
        entry.el.getBoundingClientRect().bottom > 0 &&
        entry.el.getBoundingClientRect().top < window.innerHeight
      ) {
        visible.push(entry);
      }
    });
    if (visible.length) this._playTogether(visible, delay || 0);
  };

  LineRevealer.prototype._rowsOf = function (entries) {
    var items = [];
    entries.forEach(function (entry) {
      entry.split.maskEls.forEach(function (mask, i) {
        items.push({ entry: entry, mask: mask, line: entry.split.lineEls[i] });
      });
    });
    var measured = items
      .map(function (item) {
        var r = item.mask.getBoundingClientRect();
        return { item: item, top: r.top, left: r.left };
      })
      .sort(function (a, b) {
        return a.top - b.top || a.left - b.left;
      });
    var pitch = computedLineHeight(entries[0].el);
    var rows = [];
    var current = null;
    var lastTop = -Infinity;
    measured.forEach(function (m) {
      if (!current || Math.abs(m.top - lastTop) > pitch / 2) {
        current = [];
        rows.push(current);
        lastTop = m.top;
      }
      current.push(m.item);
    });
    return rows;
  };

  LineRevealer.prototype._playTogether = function (entries, delay) {
    var self = this;
    var unique = [];
    var seen = new Set();
    entries.forEach(function (entry) {
      if (entry.state !== "parked" || seen.has(entry)) return;
      seen.add(entry);
      /* include the rest of the group so they animate as one */
      if (entry.group) {
        self.entries.forEach(function (other) {
          if (other.group === entry.group && other.state === "parked" && !seen.has(other)) {
            seen.add(other);
            unique.push(other);
          }
        });
      }
      unique.push(entry);
    });
    if (!unique.length) return null;

    unique.forEach(function (entry) {
      entry.state = "revealing";
      if (self.observer) self.observer.unobserve(entry.el);
    });

    var rows = this._rowsOf(unique);
    var tl = window.gsap.timeline({ delay: delay || 0 });
    rows.forEach(function (row, rowIndex) {
      var els = row.map(function (item) {
        return item.line;
      });
      tl.to(
        els,
        {
          yPercent: 0,
          duration: self.lineDuration,
          ease: self.lineEase
        },
        rowIndex * self.stagger
      );
    });
    unique.forEach(function (entry, i) {
      tl.call(
        function () {
          if (entry.split) {
            entry.split.revert();
            entry.split = null;
          }
          entry.state = "done";
        },
        null,
        rows.length * self.stagger + 0.05
      );
    });
    return tl;
  };

  /* Force-play everything that is currently visible (used on enter). */
  LineRevealer.prototype.playVisible = function (delay) {
    if (!this.armed) return null;
    var visible = [];
    this.entries.forEach(function (entry) {
      if (entry.state !== "parked" || !entry.split) return;
      var r = entry.el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) visible.push(entry);
    });
    if (!visible.length) return null;
    return this._playTogether(visible, delay || 0);
  };

  window.AscensionSplit = {
    splitElement: splitElement,
    LineRevealer: LineRevealer
  };
})();
