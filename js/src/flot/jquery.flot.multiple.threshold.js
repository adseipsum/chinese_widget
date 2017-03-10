(function (a) {
    function b(e) {
        function f(m, k, l) {
            if (k.data && k.data.length > 0 && k.constraints && k.constraints.length > 0) {
                var j = new c(k.data, k.constraints).getPlotData();
                for (var h = 0; h < j.length; h++) {
                    var g = a.extend({}, k);
                    g.constraints = [];
                    g.data = j[h].data;
                    g.color = j[h].color;
                    g.label = j[h].label;
                    m.getData().push(g)
                }
            }
        }

        function c(j, k) {
            this._constraints = i(j, k);
            this._dataset = j;
            this._plotData = [];
            this.getPlotData = function () {
                if (this._constraints.length == 0) {
                    return []
                }
                for (var l = this._constraints.length - 1; l >= 0; l--) {
                    var m = this._constraints[l];
                    if (null != m.threshold) {
                        var n = new h(this._dataset).using(m.threshold, m.evaluate);
                        this._plotData.push({data: n, color: m.color, label: m.label, shadowSize: 0})
                    }
                }
                return this._plotData
            };
            function h(l) {
                this._originalPoints = l;
                this._data = [];
                this._getPointOnThreshold = n;
                this.using = o;
                this.showBars = m();
                function m() {
                    if (e.getOptions().series.bars.show) {
                        return true
                    } else {
                        var q = e.getData();
                        for (var p = 0; p < q.length; p++) {
                            if (q[p].data == l) {
                                return q[p].bars.show
                            }
                        }
                    }
                    return false
                }

                function o(p, t) {
                    var r = 0;
                    for (var q = 0; q < this._originalPoints.length; q++) {
                        var s = this._originalPoints[q];
                        if (t(s[1], p)) {
                            if (!this.showBars && q > 0 && (this._data.length == 0 || this._data[r - 1] == null)) {
                                this._data[r++] = this._getPointOnThreshold(p, this._originalPoints[q - 1], s)
                            }
                            this._data[r++] = s
                        } else {
                            if (this._data.length > 0 && this._data[r - 1] != null) {
                                if (!this.showBars) {
                                    this._data[r++] = this._getPointOnThreshold(p, this._originalPoints[q - 1], s)
                                }
                                this._data[r++] = null;
                                this._data[r++] = null
                            }
                        }
                    }
                    return this._data
                }

                function n(s, x, t) {
                    var q = t[0];
                    var p = t[1];
                    var v = x[0];
                    var u = x[1];
                    var w = (s - p) / (u - p);
                    var r = w * (v - q) + q;
                    return [r, s]
                }
            }

            function i(o, n) {
                var s = g(o);
                if (undefined == s) {
                    return []
                }
                var t = s.max;
                var p = s.min;
                var l = [];
                var u = [];
                for (var q = 0; q < n.length; q++) {
                    var m = n[q];
                    var r = 0;
                    if (m.evaluate(p, m.threshold)) {
                        r = Math.abs(m.threshold - p)
                    } else {
                        r = Math.abs(t - m.threshold)
                    }
                    l.push({constraint: m, range: r})
                }
                d(l, function (w, v) {
                    return w.range < v.range
                });
                for (var q = l.length - 1; q >= 0; q--) {
                    u[q] = l[q].constraint
                }
                return u
            }

            function g(n) {
                if (undefined == n) {
                    return undefined
                }
                var l = [];
                for (var m = 0; m < n.length; m++) {
                    l[m] = n[m][1]
                }
                d(l, function (p, o) {
                    return p < o
                });
                return {min: l[0], max: l[l.length - 1]}
            }
        }

        function d(k, g) {
            i(k, 0, k.length - 1, g);
            function i(q, p, n, m) {
                if (n > p) {
                    var o = Math.floor((p + n) / 2);
                    var l = h(q, p, n, o, m);
                    i(q, p, l - 1, m);
                    i(q, l + 1, n, m)
                }
            }

            function h(s, r, o, q, m) {
                var l = s[q];
                j(s, q, o);
                var p = r;
                for (var n = r; n < o; n++) {
                    if (m(s[n], l)) {
                        j(s, n, p);
                        p = p + 1
                    }
                }
                j(s, p, o);
                return p
            }

            function j(o, n, m) {
                var l = o[n];
                o[n] = o[m];
                o[m] = l
            }
        }

        e.hooks.processRawData.push(f)
    }

    a.plot.plugins.push({init: b, name: "multiple.threshold", version: "1.0"})
})(jQuery);