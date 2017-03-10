(function (b) {
    b.color = {};
    b.color.make = function (f, e, c, d) {
        var h = {};
        h.r = f || 0;
        h.g = e || 0;
        h.b = c || 0;
        h.a = d != null ? d : 1;
        h.add = function (k, j) {
            for (var g = 0; g < k.length; ++g) {
                h[k.charAt(g)] += j
            }
            return h.normalize()
        };
        h.scale = function (k, j) {
            for (var g = 0; g < k.length; ++g) {
                h[k.charAt(g)] *= j
            }
            return h.normalize()
        };
        h.toString = function () {
            if (h.a >= 1) {
                return "rgb(" + [h.r, h.g, h.b].join(",") + ")"
            } else {
                return "rgba(" + [h.r, h.g, h.b, h.a].join(",") + ")"
            }
        };
        h.normalize = function () {
            function g(j, k, i) {
                return k < j ? j : k > i ? i : k
            }

            h.r = g(0, parseInt(h.r), 255);
            h.g = g(0, parseInt(h.g), 255);
            h.b = g(0, parseInt(h.b), 255);
            h.a = g(0, h.a, 1);
            return h
        };
        h.clone = function () {
            return b.color.make(h.r, h.b, h.g, h.a)
        };
        return h.normalize()
    };
    b.color.extract = function (e, d) {
        var f;
        do {
            f = e.css(d).toLowerCase();
            if (f != "" && f != "transparent") {
                break
            }
            e = e.parent()
        } while (e.length && !b.nodeName(e.get(0), "body"));
        if (f == "rgba(0, 0, 0, 0)") {
            f = "transparent"
        }
        return b.color.parse(f)
    };
    b.color.parse = function (f) {
        var e, c = b.color.make;
        if (e = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)) {
            return c(parseInt(e[1], 10), parseInt(e[2], 10), parseInt(e[3], 10))
        }
        if (e = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(f)) {
            return c(parseInt(e[1], 10), parseInt(e[2], 10), parseInt(e[3], 10), parseFloat(e[4]))
        }
        if (e = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)) {
            return c(parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55)
        }
        if (e = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(f)) {
            return c(parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55, parseFloat(e[4]))
        }
        if (e = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)) {
            return c(parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16))
        }
        if (e = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)) {
            return c(parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16))
        }
        var d = b.trim(f).toLowerCase();
        if (d == "transparent") {
            return c(255, 255, 255, 0)
        } else {
            e = a[d] || [0, 0, 0];
            return c(e[0], e[1], e[2])
        }
    };
    var a = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    }
})(jQuery);