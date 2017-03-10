(function (b) {
    var a = {
        xaxis: {zoomRange: null, panRange: null},
        zoom: {interactive: false, trigger: "dblclick", amount: 1.5},
        pan: {interactive: false, cursor: "move", frameRate: 20}
    };

    function c(o) {
        function m(q, p) {
            var r = o.offset();
            r.left = q.pageX - r.left;
            r.top = q.pageY - r.top;
            if (p) {
                o.zoomOut({center: r})
            } else {
                o.zoom({center: r})
            }
        }

        function d(p, q) {
            p.preventDefault();
            m(p, q < 0);
            return false
        }

        var i = "default", g = 0, e = 0, n = null;

        function f(p) {
            if (p.which != 1) {
                return false
            }
            var q = o.getPlaceholder().css("cursor");
            if (q) {
                i = q
            }
            o.getPlaceholder().css("cursor", o.getOptions().pan.cursor);
            g = p.pageX;
            e = p.pageY
        }

        function j(q) {
            var p = o.getOptions().pan.frameRate;
            if (n || !p) {
                return
            }
            n = setTimeout(function () {
                o.pan({left: g - q.pageX, top: e - q.pageY});
                g = q.pageX;
                e = q.pageY;
                n = null
            }, 1 / p * 1000)
        }

        function h(p) {
            if (n) {
                clearTimeout(n);
                n = null
            }
            o.getPlaceholder().css("cursor", i);
            o.pan({left: g - p.pageX, top: e - p.pageY})
        }

        function l(q, p) {
            var r = q.getOptions();
            if (r.zoom.interactive) {
                p[r.zoom.trigger](m);
                p.mousewheel(d)
            }
            if (r.pan.interactive) {
                p.bind("dragstart", {distance: 10}, f);
                p.bind("drag", j);
                p.bind("dragend", h)
            }
        }

        o.zoomOut = function (p) {
            if (!p) {
                p = {}
            }
            if (!p.amount) {
                p.amount = o.getOptions().zoom.amount
            }
            p.amount = 1 / p.amount;
            o.zoom(p)
        };
        o.zoom = function (q) {
            if (!q) {
                q = {}
            }
            var x = q.center, r = q.amount || o.getOptions().zoom.amount, p = o.width(), t = o.height();
            if (!x) {
                x = {left: p / 2, top: t / 2}
            }
            var s = x.left / p, v = x.top / t, u = {
                x: {min: x.left - s * p / r, max: x.left + (1 - s) * p / r},
                y: {min: x.top - v * t / r, max: x.top + (1 - v) * t / r}
            };
            b.each(o.getAxes(), function (F, z) {
                var w = z.options, A = u[z.direction].min, E = u[z.direction].max, D = w.zoomRange, y = w.panRange;
                if (D === false) {
                    return
                }
                A = z.c2p(A);
                E = z.c2p(E);
                if (A > E) {
                    var B = A;
                    A = E;
                    E = B
                }
                if (y) {
                    if (y[0] != null && A < y[0]) {
                        A = y[0]
                    }
                    if (y[1] != null && E > y[1]) {
                        E = y[1]
                    }
                }
                var C = E - A;
                if (D && ((D[0] != null && C < D[0] && r > 1) || (D[1] != null && C > D[1] && r < 1))) {
                    return
                }
                w.min = A;
                w.max = E
            });
            o.setupGrid();
            o.draw();
            if (!q.preventEvent) {
                o.getPlaceholder().trigger("plotzoom", [o, q])
            }
        };
        o.pan = function (p) {
            var q = {x: +p.left, y: +p.top};
            if (isNaN(q.x)) {
                q.x = 0
            }
            if (isNaN(q.y)) {
                q.y = 0
            }
            b.each(o.getAxes(), function (s, u) {
                var v = u.options, t, r, w = q[u.direction];
                t = u.c2p(u.p2c(u.min) + w), r = u.c2p(u.p2c(u.max) + w);
                var x = v.panRange;
                if (x === false) {
                    return
                }
                if (x) {
                    if (x[0] != null && x[0] > t) {
                        w = x[0] - t;
                        t += w;
                        r += w
                    }
                    if (x[1] != null && x[1] < r) {
                        w = x[1] - r;
                        t += w;
                        r += w
                    }
                }
                v.min = t;
                v.max = r
            });
            o.setupGrid();
            o.draw();
            if (!p.preventEvent) {
                o.getPlaceholder().trigger("plotpan", [o, p])
            }
        };
        function k(q, p) {
            p.unbind(q.getOptions().zoom.trigger, m);
            p.unbind("mousewheel", d);
            p.unbind("dragstart", f);
            p.unbind("drag", j);
            p.unbind("dragend", h);
            if (n) {
                clearTimeout(n)
            }
        }

        o.hooks.bindEvents.push(l);
        o.hooks.shutdown.push(k)
    }

    b.plot.plugins.push({init: c, options: a, name: "navigate", version: "1.3"})
})(jQuery);