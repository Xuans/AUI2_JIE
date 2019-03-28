/**
 * @author lijiancheng@agree.com.cn
 * @date    20180725
 */
var Parser = (function(){
	return function e(t, n, r) {
		function i(a, s) {
			if (!n[a]) {
				if (!t[a]) {
					var l = "function" == typeof require && require;
					if (!s && l) return l(a, !0);
					if (o) return o(a, !0);
					throw new Error("Cannot find module '" + a + "'")
				}
				var u = n[a] = {exports: {}};
				t[a][0].call(u.exports, function (e) {
					var n = t[a][1][e];
					return i(n ? n : e)
				}, u, u.exports, e, t, n, r)
			}
			return n[a].exports
		}

		return i(r);
	}({
		1: [function (e,t) {
			"use strict";

			t.exports=e("htmlparser2");
		}, {"code-mirror/mode/htmlmixed": 20, htmlparser2: 34, "object-explorer": 47}], 2: [function (e, t) {
			function n() {
				this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
			}

			function r(e) {
				return "function" == typeof e
			}

			function i(e) {
				return "number" == typeof e
			}

			function o(e) {
				return "object" == typeof e && null !== e
			}

			function a(e) {
				return void 0 === e
			}

			t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) {
				if (!i(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
				return this._maxListeners = e, this
			}, n.prototype.emit = function (e) {
				var t, n, i, s, l, u;
				if (this._events || (this._events = {}), "error" === e && (!this._events.error || o(this._events.error) && !this._events.error.length)) throw t = arguments[1], t instanceof Error ? t : TypeError('Uncaught, unspecified "error" event.');
				if (n = this._events[e], a(n)) return !1;
				if (r(n)) switch (arguments.length) {
					case 1:
						n.call(this);
						break;
					case 2:
						n.call(this, arguments[1]);
						break;
					case 3:
						n.call(this, arguments[1], arguments[2]);
						break;
					default:
						for (i = arguments.length, s = new Array(i - 1), l = 1; i > l; l++) s[l - 1] = arguments[l];
						n.apply(this, s)
				} else if (o(n)) {
					for (i = arguments.length, s = new Array(i - 1), l = 1; i > l; l++) s[l - 1] = arguments[l];
					for (u = n.slice(), i = u.length, l = 0; i > l; l++) u[l].apply(this, s)
				}
				return !0
			}, n.prototype.addListener = function (e, t) {
				var i;
				if (!r(t)) throw TypeError("listener must be a function");
				if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, r(t.listener) ? t.listener : t), this._events[e] ? o(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, o(this._events[e]) && !this._events[e].warned) {
					var i;
					i = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners, i && i > 0 && this._events[e].length > i && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), console.trace())
				}
				return this
			}, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) {
				function n() {
					this.removeListener(e, n), i || (i = !0, t.apply(this, arguments))
				}

				if (!r(t)) throw TypeError("listener must be a function");
				var i = !1;
				return n.listener = t, this.on(e, n), this
			}, n.prototype.removeListener = function (e, t) {
				var n, i, a, s;
				if (!r(t)) throw TypeError("listener must be a function");
				if (!this._events || !this._events[e]) return this;
				if (n = this._events[e], a = n.length, i = -1, n === t || r(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t); else if (o(n)) {
					for (s = a; s-- > 0;) if (n[s] === t || n[s].listener && n[s].listener === t) {
						i = s;
						break
					}
					if (0 > i) return this;
					1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
				}
				return this
			}, n.prototype.removeAllListeners = function (e) {
				var t, n;
				if (!this._events) return this;
				if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
				if (0 === arguments.length) {
					for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
					return this.removeAllListeners("removeListener"), this._events = {}, this
				}
				if (n = this._events[e], r(n)) this.removeListener(e, n); else for (; n.length;) this.removeListener(e, n[n.length - 1]);
				return delete this._events[e], this
			}, n.prototype.listeners = function (e) {
				var t;
				return t = this._events && this._events[e] ? r(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
			}, n.listenerCount = function (e, t) {
				var n;
				return n = e._events && e._events[t] ? r(e._events[t]) ? 1 : e._events[t].length : 0
			}
		}, {}], 3: [function (e, t) {
			t.exports = "function" == typeof Object.create ? function (e, t) {
				e.super_ = t, e.prototype = Object.create(t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				})
			} : function (e, t) {
				e.super_ = t;
				var n = function () {
				};
				n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
			}
		}, {}], 4: [function (e, t) {
			var n = t.exports = {};
			n.nextTick = function () {
				var e = "undefined" != typeof window && window.setImmediate,
					t = "undefined" != typeof window && window.postMessage && window.addEventListener;
				if (e) return function (e) {
					return window.setImmediate(e)
				};
				if (t) {
					var n = [];
					return window.addEventListener("message", function (e) {
						var t = e.source;
						if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), n.length > 0)) {
							var r = n.shift();
							r()
						}
					}, !0), function (e) {
						n.push(e), window.postMessage("process-tick", "*")
					}
				}
				return function (e) {
					setTimeout(e, 0)
				}
			}(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.binding = function () {
				throw new Error("process.binding is not supported")
			}, n.cwd = function () {
				return "/"
			}, n.chdir = function () {
				throw new Error("process.chdir is not supported")
			}
		}, {}], 5: [function (e, t, n) {
			function r(e, t, n) {
				if (!(this instanceof r)) return new r(e, t, n);
				var i = typeof e;
				if ("base64" === t && "string" === i) for (e = A(e); 0 !== e.length % 4;) e += "=";
				var o;
				if ("number" === i) o = T(e); else if ("string" === i) o = r.byteLength(e, t); else {
					if ("object" !== i) throw new Error("First argument needs to be a number, array or string.");
					o = T(e.length)
				}
				var a;
				r._useTypedArrays ? a = E(new Uint8Array(o)) : (a = this, a.length = o, a._isBuffer = !0);
				var s;
				if (r._useTypedArrays && "function" == typeof Uint8Array && e instanceof Uint8Array) a._set(e); else if (M(e)) for (s = 0; o > s; s++) a[s] = r.isBuffer(e) ? e.readUInt8(s) : e[s]; else if ("string" === i) a.write(e, 0, t); else if ("number" === i && !r._useTypedArrays && !n) for (s = 0; o > s; s++) a[s] = 0;
				return a
			}

			function i(e, t, n, i) {
				n = Number(n) || 0;
				var o = e.length - n;
				i ? (i = Number(i), i > o && (i = o)) : i = o;
				var a = t.length;
				W(0 === a % 2, "Invalid hex string"), i > a / 2 && (i = a / 2);
				for (var s = 0; i > s; s++) {
					var l = parseInt(t.substr(2 * s, 2), 16);
					W(!isNaN(l), "Invalid hex string"), e[n + s] = l
				}
				return r._charsWritten = 2 * s, s
			}

			function o(e, t, n, i) {
				var o = r._charsWritten = H(B(t), e, n, i);
				return o
			}

			function a(e, t, n, i) {
				var o = r._charsWritten = H(O(t), e, n, i);
				return o
			}

			function s(e, t, n, r) {
				return a(e, t, n, r)
			}

			function l(e, t, n, i) {
				var o = r._charsWritten = H(F(t), e, n, i);
				return o
			}

			function u(e, t, n) {
				return 0 === t && n === e.length ? P.fromByteArray(e) : P.fromByteArray(e.slice(t, n))
			}

			function c(e, t, n) {
				var r = "", i = "";
				n = Math.min(e.length, n);
				for (var o = t; n > o; o++) e[o] <= 127 ? (r += j(i) + String.fromCharCode(e[o]), i = "") : i += "%" + e[o].toString(16);
				return r + j(i)
			}

			function f(e, t, n) {
				var r = "";
				n = Math.min(e.length, n);
				for (var i = t; n > i; i++) r += String.fromCharCode(e[i]);
				return r
			}

			function d(e, t, n) {
				return f(e, t, n)
			}

			function h(e, t, n) {
				var r = e.length;
				(!t || 0 > t) && (t = 0), (!n || 0 > n || n > r) && (n = r);
				for (var i = "", o = t; n > o; o++) i += N(e[o]);
				return i
			}

			function p(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 1 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o;
					return n ? (o = e[t], i > t + 1 && (o |= e[t + 1] << 8)) : (o = e[t] << 8, i > t + 1 && (o |= e[t + 1])), o
				}
			}

			function m(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 3 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o;
					return n ? (i > t + 2 && (o = e[t + 2] << 16), i > t + 1 && (o |= e[t + 1] << 8), o |= e[t], i > t + 3 && (o += e[t + 3] << 24 >>> 0)) : (i > t + 1 && (o = e[t + 1] << 16), i > t + 2 && (o |= e[t + 2] << 8), i > t + 3 && (o |= e[t + 3]), o += e[t] << 24 >>> 0), o
				}
			}

			function g(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 1 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o = p(e, t, n, !0), a = 32768 & o;
					return a ? -1 * (65535 - o + 1) : o
				}
			}

			function v(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 3 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o = m(e, t, n, !0), a = 2147483648 & o;
					return a ? -1 * (4294967295 - o + 1) : o
				}
			}

			function b(e, t, n, r) {
				return r || (W("boolean" == typeof n, "missing or invalid endian"), W(t + 3 < e.length, "Trying to read beyond buffer length")), q.read(e, t, n, 23, 4)
			}

			function y(e, t, n, r) {
				return r || (W("boolean" == typeof n, "missing or invalid endian"), W(t + 7 < e.length, "Trying to read beyond buffer length")), q.read(e, t, n, 52, 8)
			}

			function w(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 1 < e.length, "trying to write beyond buffer length"), I(t, 65535));
				var o = e.length;
				if (!(n >= o)) for (var a = 0, s = Math.min(o - n, 2); s > a; a++) e[n + a] = (t & 255 << 8 * (r ? a : 1 - a)) >>> 8 * (r ? a : 1 - a)
			}

			function _(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "trying to write beyond buffer length"), I(t, 4294967295));
				var o = e.length;
				if (!(n >= o)) for (var a = 0, s = Math.min(o - n, 4); s > a; a++) e[n + a] = 255 & t >>> 8 * (r ? a : 3 - a)
			}

			function x(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 1 < e.length, "Trying to write beyond buffer length"), z(t, 32767, -32768));
				var o = e.length;
				n >= o || (t >= 0 ? w(e, t, n, r, i) : w(e, 65535 + t + 1, n, r, i))
			}

			function k(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "Trying to write beyond buffer length"), z(t, 2147483647, -2147483648));
				var o = e.length;
				n >= o || (t >= 0 ? _(e, t, n, r, i) : _(e, 4294967295 + t + 1, n, r, i))
			}

			function S(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "Trying to write beyond buffer length"), R(t, 3.4028234663852886e38, -3.4028234663852886e38));
				var o = e.length;
				n >= o || q.write(e, t, n, r, 23, 4)
			}

			function C(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 7 < e.length, "Trying to write beyond buffer length"), R(t, 1.7976931348623157e308, -1.7976931348623157e308));
				var o = e.length;
				n >= o || q.write(e, t, n, r, 52, 8)
			}

			function A(e) {
				return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
			}

			function E(e) {
				return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = U.get, e.set = U.set, e.write = U.write, e.toString = U.toString, e.toLocaleString = U.toString, e.toJSON = U.toJSON, e.copy = U.copy, e.slice = U.slice, e.readUInt8 = U.readUInt8, e.readUInt16LE = U.readUInt16LE, e.readUInt16BE = U.readUInt16BE, e.readUInt32LE = U.readUInt32LE, e.readUInt32BE = U.readUInt32BE, e.readInt8 = U.readInt8, e.readInt16LE = U.readInt16LE, e.readInt16BE = U.readInt16BE, e.readInt32LE = U.readInt32LE, e.readInt32BE = U.readInt32BE, e.readFloatLE = U.readFloatLE, e.readFloatBE = U.readFloatBE, e.readDoubleLE = U.readDoubleLE, e.readDoubleBE = U.readDoubleBE, e.writeUInt8 = U.writeUInt8, e.writeUInt16LE = U.writeUInt16LE, e.writeUInt16BE = U.writeUInt16BE, e.writeUInt32LE = U.writeUInt32LE, e.writeUInt32BE = U.writeUInt32BE, e.writeInt8 = U.writeInt8, e.writeInt16LE = U.writeInt16LE, e.writeInt16BE = U.writeInt16BE, e.writeInt32LE = U.writeInt32LE, e.writeInt32BE = U.writeInt32BE, e.writeFloatLE = U.writeFloatLE, e.writeFloatBE = U.writeFloatBE, e.writeDoubleLE = U.writeDoubleLE, e.writeDoubleBE = U.writeDoubleBE, e.fill = U.fill, e.inspect = U.inspect, e.toArrayBuffer = U.toArrayBuffer, e
			}

			function L(e, t, n) {
				return "number" != typeof e ? n : (e = ~~e, e >= t ? t : e >= 0 ? e : (e += t, e >= 0 ? e : 0))
			}

			function T(e) {
				return e = ~~Math.ceil(+e), 0 > e ? 0 : e
			}

			function D(e) {
				return (Array.isArray || function (e) {
					return "[object Array]" === Object.prototype.toString.call(e)
				})(e)
			}

			function M(e) {
				return D(e) || r.isBuffer(e) || e && "object" == typeof e && "number" == typeof e.length
			}

			function N(e) {
				return 16 > e ? "0" + e.toString(16) : e.toString(16)
			}

			function B(e) {
				for (var t = [], n = 0; n < e.length; n++) {
					var r = e.charCodeAt(n);
					if (127 >= r) t.push(e.charCodeAt(n)); else {
						var i = n;
						r >= 55296 && 57343 >= r && n++;
						for (var o = encodeURIComponent(e.slice(i, n + 1)).substr(1).split("%"), a = 0; a < o.length; a++) t.push(parseInt(o[a], 16))
					}
				}
				return t
			}

			function O(e) {
				for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
				return t
			}

			function F(e) {
				return P.toByteArray(e)
			}

			function H(e, t, n, r) {
				for (var i = 0; r > i && !(i + n >= t.length || i >= e.length); i++) t[i + n] = e[i];
				return i
			}

			function j(e) {
				try {
					return decodeURIComponent(e)
				} catch (t) {
					return String.fromCharCode(65533)
				}
			}

			function I(e, t) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(e >= 0, "specified a negative value for writing an unsigned value"), W(t >= e, "value is larger than maximum value for type"), W(Math.floor(e) === e, "value has a fractional component")
			}

			function z(e, t, n) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(t >= e, "value larger than maximum allowed value"), W(e >= n, "value smaller than minimum allowed value"), W(Math.floor(e) === e, "value has a fractional component")
			}

			function R(e, t, n) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(t >= e, "value larger than maximum allowed value"), W(e >= n, "value smaller than minimum allowed value")
			}

			function W(e, t) {
				if (!e) throw new Error(t || "Failed assertion")
			}

			var P = e("base64-js"), q = e("ieee754");
			n.Buffer = r, n.SlowBuffer = r, n.INSPECT_MAX_BYTES = 50, r.poolSize = 8192, r._useTypedArrays = function () {
				if ("undefined" == typeof Uint8Array || "undefined" == typeof ArrayBuffer) return !1;
				try {
					var e = new Uint8Array(0);
					return e.foo = function () {
						return 42
					}, 42 === e.foo() && "function" == typeof e.subarray
				} catch (t) {
					return !1
				}
			}(), r.isEncoding = function (e) {
				switch (String(e).toLowerCase()) {
					case"hex":
					case"utf8":
					case"utf-8":
					case"ascii":
					case"binary":
					case"base64":
					case"raw":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return !0;
					default:
						return !1
				}
			}, r.isBuffer = function (e) {
				return !(null === e || void 0 === e || !e._isBuffer)
			}, r.byteLength = function (e, t) {
				var n;
				switch (e += "", t || "utf8") {
					case"hex":
						n = e.length / 2;
						break;
					case"utf8":
					case"utf-8":
						n = B(e).length;
						break;
					case"ascii":
					case"binary":
					case"raw":
						n = e.length;
						break;
					case"base64":
						n = F(e).length;
						break;
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						n = 2 * e.length;
						break;
					default:
						throw new Error("Unknown encoding")
				}
				return n
			}, r.concat = function (e, t) {
				if (W(D(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new r(0);
				if (1 === e.length) return e[0];
				var n;
				if ("number" != typeof t) for (t = 0, n = 0; n < e.length; n++) t += e[n].length;
				var i = new r(t), o = 0;
				for (n = 0; n < e.length; n++) {
					var a = e[n];
					a.copy(i, o), o += a.length
				}
				return i
			}, r.prototype.write = function (e, t, n, r) {
				if (isFinite(t)) isFinite(n) || (r = n, n = void 0); else {
					var u = r;
					r = t, t = n, n = u
				}
				t = Number(t) || 0;
				var c = this.length - t;
				switch (n ? (n = Number(n), n > c && (n = c)) : n = c, r = String(r || "utf8").toLowerCase()) {
					case"hex":
						return i(this, e, t, n);
					case"utf8":
					case"utf-8":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return o(this, e, t, n);
					case"ascii":
						return a(this, e, t, n);
					case"binary":
						return s(this, e, t, n);
					case"base64":
						return l(this, e, t, n);
					default:
						throw new Error("Unknown encoding")
				}
			}, r.prototype.toString = function (e, t, n) {
				var r = this;
				if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, n = void 0 !== n ? Number(n) : n = r.length, n === t) return "";
				switch (e) {
					case"hex":
						return h(r, t, n);
					case"utf8":
					case"utf-8":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return c(r, t, n);
					case"ascii":
						return f(r, t, n);
					case"binary":
						return d(r, t, n);
					case"base64":
						return u(r, t, n);
					default:
						throw new Error("Unknown encoding")
				}
			}, r.prototype.toJSON = function () {
				return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
			}, r.prototype.copy = function (e, t, n, r) {
				var i = this;
				if (n || (n = 0), r || 0 === r || (r = this.length), t || (t = 0), r !== n && 0 !== e.length && 0 !== i.length) {
					W(r >= n, "sourceEnd < sourceStart"), W(t >= 0 && t < e.length, "targetStart out of bounds"), W(n >= 0 && n < i.length, "sourceStart out of bounds"), W(r >= 0 && r <= i.length, "sourceEnd out of bounds"), r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
					for (var o = 0; r - n > o; o++) e[o + t] = this[o + n]
				}
			}, r.prototype.slice = function (e, t) {
				var n = this.length;
				if (e = L(e, n, 0), t = L(t, n, n), r._useTypedArrays) return E(this.subarray(e, t));
				for (var i = t - e, o = new r(i, void 0, !0), a = 0; i > a; a++) o[a] = this[a + e];
				return o
			}, r.prototype.get = function (e) {
				return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
			}, r.prototype.set = function (e, t) {
				return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
			}, r.prototype.readUInt8 = function (e, t) {
				return t || (W(void 0 !== e && null !== e, "missing offset"), W(e < this.length, "Trying to read beyond buffer length")), e >= this.length ? void 0 : this[e]
			}, r.prototype.readUInt16LE = function (e, t) {
				return p(this, e, !0, t)
			}, r.prototype.readUInt16BE = function (e, t) {
				return p(this, e, !1, t)
			}, r.prototype.readUInt32LE = function (e, t) {
				return m(this, e, !0, t)
			}, r.prototype.readUInt32BE = function (e, t) {
				return m(this, e, !1, t)
			}, r.prototype.readInt8 = function (e, t) {
				if (t || (W(void 0 !== e && null !== e, "missing offset"), W(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) {
					var n = 128 & this[e];
					return n ? -1 * (255 - this[e] + 1) : this[e]
				}
			}, r.prototype.readInt16LE = function (e, t) {
				return g(this, e, !0, t)
			}, r.prototype.readInt16BE = function (e, t) {
				return g(this, e, !1, t)
			}, r.prototype.readInt32LE = function (e, t) {
				return v(this, e, !0, t)
			}, r.prototype.readInt32BE = function (e, t) {
				return v(this, e, !1, t)
			}, r.prototype.readFloatLE = function (e, t) {
				return b(this, e, !0, t)
			}, r.prototype.readFloatBE = function (e, t) {
				return b(this, e, !1, t)
			}, r.prototype.readDoubleLE = function (e, t) {
				return y(this, e, !0, t)
			}, r.prototype.readDoubleBE = function (e, t) {
				return y(this, e, !1, t)
			}, r.prototype.writeUInt8 = function (e, t, n) {
				n || (W(void 0 !== e && null !== e, "missing value"), W(void 0 !== t && null !== t, "missing offset"), W(t < this.length, "trying to write beyond buffer length"), I(e, 255)), t >= this.length || (this[t] = e)
			}, r.prototype.writeUInt16LE = function (e, t, n) {
				w(this, e, t, !0, n)
			}, r.prototype.writeUInt16BE = function (e, t, n) {
				w(this, e, t, !1, n)
			}, r.prototype.writeUInt32LE = function (e, t, n) {
				_(this, e, t, !0, n)
			}, r.prototype.writeUInt32BE = function (e, t, n) {
				_(this, e, t, !1, n)
			}, r.prototype.writeInt8 = function (e, t, n) {
				n || (W(void 0 !== e && null !== e, "missing value"), W(void 0 !== t && null !== t, "missing offset"), W(t < this.length, "Trying to write beyond buffer length"), z(e, 127, -128)), t >= this.length || (e >= 0 ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n))
			}, r.prototype.writeInt16LE = function (e, t, n) {
				x(this, e, t, !0, n)
			}, r.prototype.writeInt16BE = function (e, t, n) {
				x(this, e, t, !1, n)
			}, r.prototype.writeInt32LE = function (e, t, n) {
				k(this, e, t, !0, n)
			}, r.prototype.writeInt32BE = function (e, t, n) {
				k(this, e, t, !1, n)
			}, r.prototype.writeFloatLE = function (e, t, n) {
				S(this, e, t, !0, n)
			}, r.prototype.writeFloatBE = function (e, t, n) {
				S(this, e, t, !1, n)
			}, r.prototype.writeDoubleLE = function (e, t, n) {
				C(this, e, t, !0, n)
			}, r.prototype.writeDoubleBE = function (e, t, n) {
				C(this, e, t, !1, n)
			}, r.prototype.fill = function (e, t, n) {
				if (e || (e = 0), t || (t = 0), n || (n = this.length), "string" == typeof e && (e = e.charCodeAt(0)), W("number" == typeof e && !isNaN(e), "value is not a number"), W(n >= t, "end < start"), n !== t && 0 !== this.length) {
					W(t >= 0 && t < this.length, "start out of bounds"), W(n >= 0 && n <= this.length, "end out of bounds");
					for (var r = t; n > r; r++) this[r] = e
				}
			}, r.prototype.inspect = function () {
				for (var e = [], t = this.length, r = 0; t > r; r++) if (e[r] = N(this[r]), r === n.INSPECT_MAX_BYTES) {
					e[r + 1] = "...";
					break
				}
				return "<Buffer " + e.join(" ") + ">"
			}, r.prototype.toArrayBuffer = function () {
				if ("function" == typeof Uint8Array) {
					if (r._useTypedArrays) return new r(this).buffer;
					for (var e = new Uint8Array(this.length), t = 0, n = e.length; n > t; t += 1) e[t] = this[t];
					return e.buffer
				}
				throw new Error("Buffer.toArrayBuffer not supported in this browser")
			};
			var U = r.prototype
		}, {"base64-js": 6, ieee754: 7}], 6: [function (e, t) {
			var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			!function () {
				"use strict";

				function e(e) {
					var t = e.charCodeAt(0);
					return t === a ? 62 : t === s ? 63 : l > t ? -1 : l + 10 > t ? t - l + 26 + 26 : c + 26 > t ? t - c : u + 26 > t ? t - u + 26 : void 0
				}

				function r(t) {
					function n(e) {
						u[f++] = e
					}

					var r, i, a, s, l, u;
					if (t.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
					var c = t.length;
					l = "=" === t.charAt(c - 2) ? 2 : "=" === t.charAt(c - 1) ? 1 : 0, u = new o(3 * t.length / 4 - l), a = l > 0 ? t.length - 4 : t.length;
					var f = 0;
					for (r = 0, i = 0; a > r; r += 4, i += 3) s = e(t.charAt(r)) << 18 | e(t.charAt(r + 1)) << 12 | e(t.charAt(r + 2)) << 6 | e(t.charAt(r + 3)), n((16711680 & s) >> 16), n((65280 & s) >> 8), n(255 & s);
					return 2 === l ? (s = e(t.charAt(r)) << 2 | e(t.charAt(r + 1)) >> 4, n(255 & s)) : 1 === l && (s = e(t.charAt(r)) << 10 | e(t.charAt(r + 1)) << 4 | e(t.charAt(r + 2)) >> 2, n(255 & s >> 8), n(255 & s)), u
				}

				function i(e) {
					function t(e) {
						return n.charAt(e)
					}

					function r(e) {
						return t(63 & e >> 18) + t(63 & e >> 12) + t(63 & e >> 6) + t(63 & e)
					}

					var i, o, a, s = e.length % 3, l = "";
					for (i = 0, a = e.length - s; a > i; i += 3) o = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], l += r(o);
					switch (s) {
						case 1:
							o = e[e.length - 1], l += t(o >> 2), l += t(63 & o << 4), l += "==";
							break;
						case 2:
							o = (e[e.length - 2] << 8) + e[e.length - 1], l += t(o >> 10), l += t(63 & o >> 4), l += t(63 & o << 2), l += "="
					}
					return l
				}

				var o = "undefined" != typeof Uint8Array ? Uint8Array : Array;
				"0".charCodeAt(0);
				var a = "+".charCodeAt(0), s = "/".charCodeAt(0), l = "0".charCodeAt(0), u = "a".charCodeAt(0),
					c = "A".charCodeAt(0);
				t.exports.toByteArray = r, t.exports.fromByteArray = i
			}()
		}, {}], 7: [function (e, t, n) {
			n.read = function (e, t, n, r, i) {
				var o, a, s = 8 * i - r - 1, l = (1 << s) - 1, u = l >> 1, c = -7, f = n ? i - 1 : 0, d = n ? -1 : 1,
					h = e[t + f];
				for (f += d, o = h & (1 << -c) - 1, h >>= -c, c += s; c > 0; o = 256 * o + e[t + f], f += d, c -= 8) ;
				for (a = o & (1 << -c) - 1, o >>= -c, c += r; c > 0; a = 256 * a + e[t + f], f += d, c -= 8) ;
				if (0 === o) o = 1 - u; else {
					if (o === l) return a ? 0 / 0 : 1 / 0 * (h ? -1 : 1);
					a += Math.pow(2, r), o -= u
				}
				return (h ? -1 : 1) * a * Math.pow(2, o - r)
			}, n.write = function (e, t, n, r, i, o) {
				var a, s, l, u = 8 * o - i - 1, c = (1 << u) - 1, f = c >> 1,
					d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = r ? 0 : o - 1, p = r ? 1 : -1,
					m = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
				for (t = Math.abs(t), isNaN(t) || 1 / 0 === t ? (s = isNaN(t) ? 1 : 0, a = c) : (a = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), t += a + f >= 1 ? d / l : d * Math.pow(2, 1 - f), t * l >= 2 && (a++, l /= 2), a + f >= c ? (s = 0, a = c) : a + f >= 1 ? (s = (t * l - 1) * Math.pow(2, i), a += f) : (s = t * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + h] = 255 & s, h += p, s /= 256, i -= 8) ;
				for (a = a << i | s, u += i; u > 0; e[n + h] = 255 & a, h += p, a /= 256, u -= 8) ;
				e[n + h - p] |= 128 * m
			}
		}, {}], 8: [function (e, t) {
			function n(e) {
				return this instanceof n ? (a.call(this, e), s.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", r), void 0) : new n(e)
			}

			function r() {
				if (!this.allowHalfOpen && !this._writableState.ended) {
					var e = this;
					o(function () {
						e.end()
					})
				}
			}

			t.exports = n;
			var i = e("inherits"), o = e("process/browser.js").nextTick, a = e("./readable.js"), s = e("./writable.js");
			i(n, a), n.prototype.write = s.prototype.write, n.prototype.end = s.prototype.end, n.prototype._write = s.prototype._write
		}, {"./readable.js": 12, "./writable.js": 14, inherits: 3, "process/browser.js": 10}], 9: [function (e, t) {
			function n() {
				r.call(this)
			}

			t.exports = n;
			var r = e("events").EventEmitter, i = e("inherits");
			i(n, r), n.Readable = e("./readable.js"), n.Writable = e("./writable.js"), n.Duplex = e("./duplex.js"), n.Transform = e("./transform.js"), n.PassThrough = e("./passthrough.js"), n.Stream = n, n.prototype.pipe = function (e, t) {
				function n(t) {
					e.writable && !1 === e.write(t) && u.pause && u.pause()
				}

				function i() {
					u.readable && u.resume && u.resume()
				}

				function o() {
					c || (c = !0, e.end())
				}

				function a() {
					c || (c = !0, "function" == typeof e.destroy && e.destroy())
				}

				function s(e) {
					if (l(), 0 === r.listenerCount(this, "error")) throw e
				}

				function l() {
					u.removeListener("data", n), e.removeListener("drain", i), u.removeListener("end", o), u.removeListener("close", a), u.removeListener("error", s), e.removeListener("error", s), u.removeListener("end", l), u.removeListener("close", l), e.removeListener("close", l)
				}

				var u = this;
				u.on("data", n), e.on("drain", i), e._isStdio || t && t.end === !1 || (u.on("end", o), u.on("close", a));
				var c = !1;
				return u.on("error", s), e.on("error", s), u.on("end", l), u.on("close", l), e.on("close", l), e.emit("pipe", u), e
			}
		}, {
			"./duplex.js": 8,
			"./passthrough.js": 11,
			"./readable.js": 12,
			"./transform.js": 13,
			"./writable.js": 14,
			events: 2,
			inherits: 3
		}], 10: [function (e, t) {
			t.exports = e(4)
		}, {}], 11: [function (e, t) {
			function n(e) {
				return this instanceof n ? (r.call(this, e), void 0) : new n(e)
			}

			t.exports = n;
			var r = e("./transform.js"), i = e("inherits");
			i(n, r), n.prototype._transform = function (e, t, n) {
				n(null, e)
			}
		}, {"./transform.js": 13, inherits: 3}], 12: [function (e, t) {
			!function (n) {
				function r(t) {
					t = t || {};
					var n = t.highWaterMark;
					this.highWaterMark = n || 0 === n ? n : 16384, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = !1, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.calledRead = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (k || (k = e("string_decoder").StringDecoder), this.decoder = new k(t.encoding), this.encoding = t.encoding)
				}

				function i(e) {
					return this instanceof i ? (this._readableState = new r(e, this), this.readable = !0, C.call(this), void 0) : new i(e)
				}

				function o(e, t, n, r, i) {
					var o = u(t, n);
					if (o) e.emit("error", o); else if (null === n || void 0 === n) t.reading = !1, t.ended || c(e, t); else if (t.objectMode || n && n.length > 0) if (t.ended && !i) {
						var s = new Error("stream.push() after EOF");
						e.emit("error", s)
					} else if (t.endEmitted && i) {
						var s = new Error("stream.unshift() after end event");
						e.emit("error", s)
					} else !t.decoder || i || r || (n = t.decoder.write(n)), t.length += t.objectMode ? 1 : n.length, i ? t.buffer.unshift(n) : (t.reading = !1, t.buffer.push(n)), t.needReadable && f(e), h(e, t); else i || (t.reading = !1);
					return a(t)
				}

				function a(e) {
					return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
				}

				function s(e) {
					if (e >= T) e = T; else {
						e--;
						for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
						e++
					}
					return e
				}

				function l(e, t) {
					return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || null === e ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = s(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
				}

				function u(e, t) {
					var n = null;
					return A.isBuffer(t) || "string" == typeof t || null === t || void 0 === t || e.objectMode || n || (n = new TypeError("Invalid non-string/buffer chunk")), n
				}

				function c(e, t) {
					if (t.decoder && !t.ended) {
						var n = t.decoder.end();
						n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length)
					}
					t.ended = !0, t.length > 0 ? f(e) : w(e)
				}

				function f(e) {
					var t = e._readableState;
					t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, t.sync ? E(function () {
						d(e)
					}) : d(e))
				}

				function d(e) {
					e.emit("readable")
				}

				function h(e, t) {
					t.readingMore || (t.readingMore = !0, E(function () {
						p(e, t)
					}))
				}

				function p(e, t) {
					for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (e.read(0), n !== t.length);) n = t.length;
					t.readingMore = !1
				}

				function m(e) {
					return function () {
						var t = e._readableState;
						t.awaitDrain--, 0 === t.awaitDrain && g(e)
					}
				}

				function g(e) {
					function t(e) {
						var t = e.write(n);
						!1 === t && r.awaitDrain++
					}

					var n, r = e._readableState;
					for (r.awaitDrain = 0; r.pipesCount && null !== (n = e.read());) if (1 === r.pipesCount ? t(r.pipes, 0, null) : _(r.pipes, t), e.emit("data", n), r.awaitDrain > 0) return;
					return 0 === r.pipesCount ? (r.flowing = !1, S.listenerCount(e, "data") > 0 && b(e), void 0) : (r.ranOut = !0, void 0)
				}

				function v() {
					this._readableState.ranOut && (this._readableState.ranOut = !1, g(this))
				}

				function b(e, t) {
					var n = e._readableState;
					if (n.flowing) throw new Error("Cannot switch to old mode now.");
					var r = t || !1, i = !1;
					e.readable = !0, e.pipe = C.prototype.pipe, e.on = e.addListener = C.prototype.on, e.on("readable", function () {
						i = !0;
						for (var t; !r && null !== (t = e.read());) e.emit("data", t);
						null === t && (i = !1, e._readableState.needReadable = !0)
					}), e.pause = function () {
						r = !0, this.emit("pause")
					}, e.resume = function () {
						r = !1, i ? E(function () {
							e.emit("readable")
						}) : this.read(0), this.emit("resume")
					}, e.emit("readable")
				}

				function y(e, t) {
					var n, r = t.buffer, i = t.length, o = !!t.decoder, a = !!t.objectMode;
					if (0 === r.length) return null;
					if (0 === i) n = null; else if (a) n = r.shift(); else if (!e || e >= i) n = o ? r.join("") : A.concat(r, i), r.length = 0; else if (e < r[0].length) {
						var s = r[0];
						n = s.slice(0, e), r[0] = s.slice(e)
					} else if (e === r[0].length) n = r.shift(); else {
						n = o ? "" : new A(e);
						for (var l = 0, u = 0, c = r.length; c > u && e > l; u++) {
							var s = r[0], f = Math.min(e - l, s.length);
							o ? n += s.slice(0, f) : s.copy(n, l, 0, f), f < s.length ? r[0] = s.slice(f) : r.shift(), l += f
						}
					}
					return n
				}

				function w(e) {
					var t = e._readableState;
					if (t.length > 0) throw new Error("endReadable called on non-empty stream");
					!t.endEmitted && t.calledRead && (t.ended = !0, E(function () {
						t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
					}))
				}

				function _(e, t) {
					for (var n = 0, r = e.length; r > n; n++) t(e[n], n)
				}

				function x(e, t) {
					for (var n = 0, r = e.length; r > n; n++) if (e[n] === t) return n;
					return -1
				}

				t.exports = i, i.ReadableState = r;
				var k, S = e("events").EventEmitter, C = e("./index.js"), A = e("buffer").Buffer,
					E = e("process/browser.js").nextTick, L = e("inherits");
				L(i, C), i.prototype.push = function (e, t) {
					var n = this._readableState;
					return "string" != typeof e || n.objectMode || (t = t || n.defaultEncoding, t !== n.encoding && (e = new A(e, t), t = "")), o(this, n, e, t, !1)
				}, i.prototype.unshift = function (e) {
					var t = this._readableState;
					return o(this, t, e, "", !0)
				}, i.prototype.setEncoding = function (t) {
					k || (k = e("string_decoder").StringDecoder), this._readableState.decoder = new k(t), this._readableState.encoding = t
				};
				var T = 8388608;
				i.prototype.read = function (e) {
					var t = this._readableState;
					t.calledRead = !0;
					var n = e;
					if (("number" != typeof e || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return f(this), null;
					if (e = l(e, t), 0 === e && t.ended) return 0 === t.length && w(this), null;
					var r = t.needReadable;
					t.length - e <= t.highWaterMark && (r = !0), (t.ended || t.reading) && (r = !1), r && (t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), r && !t.reading && (e = l(n, t));
					var i;
					return i = e > 0 ? y(e, t) : null, null === i && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), t.ended && !t.endEmitted && 0 === t.length && w(this), i
				}, i.prototype._read = function () {
					this.emit("error", new Error("not implemented"))
				}, i.prototype.pipe = function (e, t) {
					function r(e) {
						e === c && o()
					}

					function i() {
						e.end()
					}

					function o() {
						e.removeListener("close", s), e.removeListener("finish", l), e.removeListener("drain", p), e.removeListener("error", a), e.removeListener("unpipe", r), c.removeListener("end", i), c.removeListener("end", o), (!e._writableState || e._writableState.needDrain) && p()
					}

					function a(t) {
						u(), 0 === b && 0 === S.listenerCount(e, "error") && e.emit("error", t)
					}

					function s() {
						e.removeListener("finish", l), u()
					}

					function l() {
						e.removeListener("close", s), u()
					}

					function u() {
						c.unpipe(e)
					}

					var c = this, f = this._readableState;
					switch (f.pipesCount) {
						case 0:
							f.pipes = e;
							break;
						case 1:
							f.pipes = [f.pipes, e];
							break;
						default:
							f.pipes.push(e)
					}
					f.pipesCount += 1;
					var d = (!t || t.end !== !1) && e !== n.stdout && e !== n.stderr, h = d ? i : o;
					f.endEmitted ? E(h) : c.once("end", h), e.on("unpipe", r);
					var p = m(c);
					e.on("drain", p);
					var b = S.listenerCount(e, "error");
					return e.once("error", a), e.once("close", s), e.once("finish", l), e.emit("pipe", c), f.flowing || (this.on("readable", v), f.flowing = !0, E(function () {
						g(c)
					})), e
				}, i.prototype.unpipe = function (e) {
					var t = this._readableState;
					if (0 === t.pipesCount) return this;
					if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, this.removeListener("readable", v), t.flowing = !1, e && e.emit("unpipe", this), this);
					if (!e) {
						var n = t.pipes, r = t.pipesCount;
						t.pipes = null, t.pipesCount = 0, this.removeListener("readable", v), t.flowing = !1;
						for (var i = 0; r > i; i++) n[i].emit("unpipe", this);
						return this
					}
					var i = x(t.pipes, e);
					return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
				}, i.prototype.on = function (e, t) {
					var n = C.prototype.on.call(this, e, t);
					if ("data" !== e || this._readableState.flowing || b(this), "readable" === e && this.readable) {
						var r = this._readableState;
						r.readableListening || (r.readableListening = !0, r.emittedReadable = !1, r.needReadable = !0, r.reading ? r.length && f(this, r) : this.read(0))
					}
					return n
				}, i.prototype.addListener = i.prototype.on, i.prototype.resume = function () {
					b(this), this.read(0), this.emit("resume")
				}, i.prototype.pause = function () {
					b(this, !0), this.emit("pause")
				}, i.prototype.wrap = function (e) {
					var t = this._readableState, n = !1, r = this;
					e.on("end", function () {
						if (t.decoder && !t.ended) {
							var e = t.decoder.end();
							e && e.length && r.push(e)
						}
						r.push(null)
					}), e.on("data", function (i) {
						if (t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
							var o = r.push(i);
							o || (n = !0, e.pause())
						}
					});
					for (var i in e) "function" == typeof e[i] && "undefined" == typeof this[i] && (this[i] = function (t) {
						return function () {
							return e[t].apply(e, arguments)
						}
					}(i));
					var o = ["error", "close", "destroy", "pause", "resume"];
					return _(o, function (t) {
						e.on(t, function (e) {
							return r.emit.apply(r, t, e)
						})
					}), r._read = function () {
						n && (n = !1, e.resume())
					}, r
				}, i._fromList = y
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"./index.js": 9,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			events: 2,
			inherits: 3,
			"process/browser.js": 10,
			string_decoder: 15
		}], 13: [function (e, t) {
			function n(e, t) {
				this.afterTransform = function (e, n) {
					return r(t, e, n)
				}, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
			}

			function r(e, t, n) {
				var r = e._transformState;
				r.transforming = !1;
				var i = r.writecb;
				if (!i) return e.emit("error", new Error("no writecb in Transform class"));
				r.writechunk = null, r.writecb = null, null !== n && void 0 !== n && e.push(n), i && i(t);
				var o = e._readableState;
				o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
			}

			function i(e) {
				if (!(this instanceof i)) return new i(e);
				a.call(this, e), this._transformState = new n(e, this);
				var t = this;
				this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("finish", function () {
					"function" == typeof this._flush ? this._flush(function (e) {
						o(t, e)
					}) : o(t)
				})
			}

			function o(e, t) {
				if (t) return e.emit("error", t);
				var n = e._writableState;
				e._readableState;
				var r = e._transformState;
				if (n.length) throw new Error("calling transform done when ws.length != 0");
				if (r.transforming) throw new Error("calling transform done when still transforming");
				return e.push(null)
			}

			t.exports = i;
			var a = e("./duplex.js"), s = e("inherits");
			s(i, a), i.prototype.push = function (e, t) {
				return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t)
			}, i.prototype._transform = function () {
				throw new Error("not implemented")
			}, i.prototype._write = function (e, t, n) {
				var r = this._transformState;
				if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
					var i = this._readableState;
					(r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
				}
			}, i.prototype._read = function () {
				var e = this._transformState;
				e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0
			}
		}, {"./duplex.js": 8, inherits: 3}], 14: [function (e, t) {
			function n(e, t, n) {
				this.chunk = e, this.encoding = t, this.callback = n
			}

			function r(e, t) {
				e = e || {};
				var n = e.highWaterMark;
				this.highWaterMark = n || 0 === n ? n : 16384, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
				var r = e.decodeStrings === !1;
				this.decodeStrings = !r, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
					d(t, e)
				}, this.writecb = null, this.writelen = 0, this.buffer = []
			}

			function i(e) {
				return this instanceof i || this instanceof x.Duplex ? (this._writableState = new r(e, this), this.writable = !0, x.call(this), void 0) : new i(e)
			}

			function o(e, t, n) {
				var r = new Error("write after end");
				e.emit("error", r), k(function () {
					n(r)
				})
			}

			function a(e, t, n, r) {
				var i = !0;
				if (!S.isBuffer(n) && "string" != typeof n && null !== n && void 0 !== n && !t.objectMode) {
					var o = new TypeError("Invalid non-string/buffer chunk");
					e.emit("error", o), k(function () {
						r(o)
					}), i = !1
				}
				return i
			}

			function s(e, t, n) {
				return e.objectMode || e.decodeStrings === !1 || "string" != typeof t || (t = new S(t, n)), t
			}

			function l(e, t, r, i, o) {
				r = s(t, r, i);
				var a = t.objectMode ? 1 : r.length;
				t.length += a;
				var l = t.length < t.highWaterMark;
				return t.needDrain = !l, t.writing ? t.buffer.push(new n(r, i, o)) : u(e, t, a, r, i, o), l
			}

			function u(e, t, n, r, i, o) {
				t.writelen = n, t.writecb = o, t.writing = !0, t.sync = !0, e._write(r, i, t.onwrite), t.sync = !1
			}

			function c(e, t, n, r, i) {
				n ? k(function () {
					i(r)
				}) : i(r), e.emit("error", r)
			}

			function f(e) {
				e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
			}

			function d(e, t) {
				var n = e._writableState, r = n.sync, i = n.writecb;
				if (f(n), t) c(e, n, r, t, i); else {
					var o = g(e, n);
					o || n.bufferProcessing || !n.buffer.length || m(e, n), r ? k(function () {
						h(e, n, o, i)
					}) : h(e, n, o, i)
				}
			}

			function h(e, t, n, r) {
				n || p(e, t), r(), n && v(e, t)
			}

			function p(e, t) {
				0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
			}

			function m(e, t) {
				t.bufferProcessing = !0;
				for (var n = 0; n < t.buffer.length; n++) {
					var r = t.buffer[n], i = r.chunk, o = r.encoding, a = r.callback, s = t.objectMode ? 1 : i.length;
					if (u(e, t, s, i, o, a), t.writing) {
						n++;
						break
					}
				}
				t.bufferProcessing = !1, n < t.buffer.length ? t.buffer = t.buffer.slice(n) : t.buffer.length = 0
			}

			function g(e, t) {
				return t.ending && 0 === t.length && !t.finished && !t.writing
			}

			function v(e, t) {
				var n = g(e, t);
				return n && (t.finished = !0, e.emit("finish")), n
			}

			function b(e, t, n) {
				t.ending = !0, v(e, t), n && (t.finished ? k(n) : e.once("finish", n)), t.ended = !0
			}

			t.exports = i, i.WritableState = r;
			var y = "undefined" != typeof Uint8Array ? function (e) {
				return e instanceof Uint8Array
			} : function (e) {
				return e && e.constructor && "Uint8Array" === e.constructor.name
			}, w = "undefined" != typeof ArrayBuffer ? function (e) {
				return e instanceof ArrayBuffer
			} : function (e) {
				return e && e.constructor && "ArrayBuffer" === e.constructor.name
			}, _ = e("inherits"), x = e("./index.js"), k = e("process/browser.js").nextTick, S = e("buffer").Buffer;
			_(i, x), i.prototype.pipe = function () {
				this.emit("error", new Error("Cannot pipe. Not readable."))
			}, i.prototype.write = function (e, t, n) {
				var r = this._writableState, i = !1;
				return "function" == typeof t && (n = t, t = null), !S.isBuffer(e) && y(e) && (e = new S(e)), w(e) && "undefined" != typeof Uint8Array && (e = new S(new Uint8Array(e))), S.isBuffer(e) ? t = "buffer" : t || (t = r.defaultEncoding), "function" != typeof n && (n = function () {
				}), r.ended ? o(this, r, n) : a(this, r, e, n) && (i = l(this, r, e, t, n)), i
			}, i.prototype._write = function (e, t, n) {
				n(new Error("not implemented"))
			}, i.prototype.end = function (e, t, n) {
				var r = this._writableState;
				"function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), "undefined" != typeof e && null !== e && this.write(e, t), r.ending || r.finished || b(this, r, n)
			}
		}, {"./index.js": 9, buffer: 5, inherits: 3, "process/browser.js": 10}], 15: [function (e, t, n) {
			function r(e) {
				if (e && !s.isEncoding(e)) throw new Error("Unknown encoding: " + e)
			}

			function i(e) {
				return e.toString(this.encoding)
			}

			function o(e) {
				var t = this.charReceived = e.length % 2;
				return this.charLength = t ? 2 : 0, t
			}

			function a(e) {
				var t = this.charReceived = e.length % 3;
				return this.charLength = t ? 3 : 0, t
			}

			var s = e("buffer").Buffer, l = n.StringDecoder = function (e) {
				switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), r(e), this.encoding) {
					case"utf8":
						this.surrogateSize = 3;
						break;
					case"ucs2":
					case"utf16le":
						this.surrogateSize = 2, this.detectIncompleteChar = o;
						break;
					case"base64":
						this.surrogateSize = 3, this.detectIncompleteChar = a;
						break;
					default:
						return this.write = i, void 0
				}
				this.charBuffer = new s(6), this.charReceived = 0, this.charLength = 0
			};
			l.prototype.write = function (e) {
				for (var t = "", n = 0; this.charLength;) {
					var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
					if (e.copy(this.charBuffer, this.charReceived, n, r), this.charReceived += r - n, n = r, this.charReceived < this.charLength) return "";
					t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
					var i = t.charCodeAt(t.length - 1);
					if (!(i >= 55296 && 56319 >= i)) {
						if (this.charReceived = this.charLength = 0, r == e.length) return t;
						e = e.slice(r, e.length);
						break
					}
					this.charLength += this.surrogateSize, t = ""
				}
				var o = this.detectIncompleteChar(e), a = e.length;
				this.charLength && (e.copy(this.charBuffer, 0, e.length - o, a), this.charReceived = o, a -= o), t += e.toString(this.encoding, 0, a);
				var a = t.length - 1, i = t.charCodeAt(a);
				if (i >= 55296 && 56319 >= i) {
					var s = this.surrogateSize;
					return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), this.charBuffer.write(t.charAt(t.length - 1), this.encoding), t.substring(0, a)
				}
				return t
			}, l.prototype.detectIncompleteChar = function (e) {
				for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
					var n = e[e.length - t];
					if (1 == t && 6 == n >> 5) {
						this.charLength = 2;
						break
					}
					if (2 >= t && 14 == n >> 4) {
						this.charLength = 3;
						break
					}
					if (3 >= t && 30 == n >> 3) {
						this.charLength = 4;
						break
					}
				}
				return t
			}, l.prototype.end = function (e) {
				var t = "";
				if (e && e.length && (t = this.write(e)), this.charReceived) {
					var n = this.charReceived, r = this.charBuffer, i = this.encoding;
					t += r.slice(0, n).toString(i)
				}
				return t
			}
		}, {buffer: 5}], 16: [function (e, t) {
			t.exports = function (e) {
				return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
			}
		}, {}], 17: [function (e, t, n) {
			!function (t, r) {
				function i(e, t) {
					var r = {seen: [], stylize: a};
					return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), m(t) ? r.showHidden = t : t && n._extend(r, t), _(r.showHidden) && (r.showHidden = !1), _(r.depth) && (r.depth = 2), _(r.colors) && (r.colors = !1), _(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = o), l(r, e, r.depth)
				}

				function o(e, t) {
					var n = i.styles[t];
					return n ? "[" + i.colors[n][0] + "m" + e + "[" + i.colors[n][1] + "m" : e
				}

				function a(e) {
					return e
				}

				function s(e) {
					var t = {};
					return e.forEach(function (e) {
						t[e] = !0
					}), t
				}

				function l(e, t, r) {
					if (e.customInspect && t && A(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) {
						var i = t.inspect(r, e);
						return y(i) || (i = l(e, i, r)), i
					}
					var o = u(e, t);
					if (o) return o;
					var a = Object.keys(t), m = s(a);
					if (e.showHidden && (a = Object.getOwnPropertyNames(t)), C(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0)) return c(t);
					if (0 === a.length) {
						if (A(t)) {
							var g = t.name ? ": " + t.name : "";
							return e.stylize("[Function" + g + "]", "special")
						}
						if (x(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
						if (S(t)) return e.stylize(Date.prototype.toString.call(t), "date");
						if (C(t)) return c(t)
					}
					var v = "", b = !1, w = ["{", "}"];
					if (p(t) && (b = !0, w = ["[", "]"]), A(t)) {
						var _ = t.name ? ": " + t.name : "";
						v = " [Function" + _ + "]"
					}
					if (x(t) && (v = " " + RegExp.prototype.toString.call(t)), S(t) && (v = " " + Date.prototype.toUTCString.call(t)), C(t) && (v = " " + c(t)), 0 === a.length && (!b || 0 == t.length)) return w[0] + v + w[1];
					if (0 > r) return x(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
					e.seen.push(t);
					var k;
					return k = b ? f(e, t, r, m, a) : a.map(function (n) {
						return d(e, t, r, m, n, b)
					}), e.seen.pop(), h(k, v, w)
				}

				function u(e, t) {
					if (_(t)) return e.stylize("undefined", "undefined");
					if (y(t)) {
						var n = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
						return e.stylize(n, "string")
					}
					return b(t) ? e.stylize("" + t, "number") : m(t) ? e.stylize("" + t, "boolean") : g(t) ? e.stylize("null", "null") : void 0
				}

				function c(e) {
					return "[" + Error.prototype.toString.call(e) + "]"
				}

				function f(e, t, n, r, i) {
					for (var o = [], a = 0, s = t.length; s > a; ++a) M(t, String(a)) ? o.push(d(e, t, n, r, String(a), !0)) : o.push("");
					return i.forEach(function (i) {
						i.match(/^\d+$/) || o.push(d(e, t, n, r, i, !0))
					}), o
				}

				function d(e, t, n, r, i, o) {
					var a, s, u;
					if (u = Object.getOwnPropertyDescriptor(t, i) || {value: t[i]}, u.get ? s = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (s = e.stylize("[Setter]", "special")), M(r, i) || (a = "[" + i + "]"), s || (e.seen.indexOf(u.value) < 0 ? (s = g(n) ? l(e, u.value, null) : l(e, u.value, n - 1), s.indexOf("\n") > -1 && (s = o ? s.split("\n").map(function (e) {
							return "  " + e
						}).join("\n").substr(2) : "\n" + s.split("\n").map(function (e) {
							return "   " + e
						}).join("\n"))) : s = e.stylize("[Circular]", "special")), _(a)) {
						if (o && i.match(/^\d+$/)) return s;
						a = JSON.stringify("" + i), a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"))
					}
					return a + ": " + s
				}

				function h(e, t, n) {
					var r = 0, i = e.reduce(function (e, t) {
						return r++, t.indexOf("\n") >= 0 && r++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
					}, 0);
					return i > 60 ? n[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + n[1] : n[0] + t + " " + e.join(", ") + " " + n[1]
				}

				function p(e) {
					return Array.isArray(e)
				}

				function m(e) {
					return "boolean" == typeof e
				}

				function g(e) {
					return null === e
				}

				function v(e) {
					return null == e
				}

				function b(e) {
					return "number" == typeof e
				}

				function y(e) {
					return "string" == typeof e
				}

				function w(e) {
					return "symbol" == typeof e
				}

				function _(e) {
					return void 0 === e
				}

				function x(e) {
					return k(e) && "[object RegExp]" === L(e)
				}

				function k(e) {
					return "object" == typeof e && null !== e
				}

				function S(e) {
					return k(e) && "[object Date]" === L(e)
				}

				function C(e) {
					return k(e) && ("[object Error]" === L(e) || e instanceof Error)
				}

				function A(e) {
					return "function" == typeof e
				}

				function E(e) {
					return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
				}

				function L(e) {
					return Object.prototype.toString.call(e)
				}

				function T(e) {
					return 10 > e ? "0" + e.toString(10) : e.toString(10)
				}

				function D() {
					var e = new Date, t = [T(e.getHours()), T(e.getMinutes()), T(e.getSeconds())].join(":");
					return [e.getDate(), F[e.getMonth()], t].join(" ")
				}

				function M(e, t) {
					return Object.prototype.hasOwnProperty.call(e, t)
				}

				var N = /%[sdj%]/g;
				n.format = function (e) {
					if (!y(e)) {
						for (var t = [], n = 0; n < arguments.length; n++) t.push(i(arguments[n]));
						return t.join(" ")
					}
					for (var n = 1, r = arguments, o = r.length, a = String(e).replace(N, function (e) {
						if ("%%" === e) return "%";
						if (n >= o) return e;
						switch (e) {
							case"%s":
								return String(r[n++]);
							case"%d":
								return Number(r[n++]);
							case"%j":
								try {
									return JSON.stringify(r[n++])
								} catch (t) {
									return "[Circular]"
								}
							default:
								return e
						}
					}), s = r[n]; o > n; s = r[++n]) a += g(s) || !k(s) ? " " + s : " " + i(s);
					return a
				}, n.deprecate = function (e, i) {
					function o() {
						if (!a) {
							if (t.throwDeprecation) throw new Error(i);
							t.traceDeprecation ? console.trace(i) : console.error(i), a = !0
						}
						return e.apply(this, arguments)
					}

					if (_(r.process)) return function () {
						return n.deprecate(e, i).apply(this, arguments)
					};
					if (t.noDeprecation === !0) return e;
					var a = !1;
					return o
				};
				var B, O = {};
				n.debuglog = function (e) {
					if (_(B) && (B = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !O[e]) if (new RegExp("\\b" + e + "\\b", "i").test(B)) {
						var r = t.pid;
						O[e] = function () {
							var t = n.format.apply(n, arguments);
							console.error("%s %d: %s", e, r, t)
						}
					} else O[e] = function () {
					};
					return O[e]
				}, n.inspect = i, i.colors = {
					bold: [1, 22],
					italic: [3, 23],
					underline: [4, 24],
					inverse: [7, 27],
					white: [37, 39],
					grey: [90, 39],
					black: [30, 39],
					blue: [34, 39],
					cyan: [36, 39],
					green: [32, 39],
					magenta: [35, 39],
					red: [31, 39],
					yellow: [33, 39]
				}, i.styles = {
					special: "cyan",
					number: "yellow",
					"boolean": "yellow",
					undefined: "grey",
					"null": "bold",
					string: "green",
					date: "magenta",
					regexp: "red"
				}, n.isArray = p, n.isBoolean = m, n.isNull = g, n.isNullOrUndefined = v, n.isNumber = b, n.isString = y, n.isSymbol = w, n.isUndefined = _, n.isRegExp = x, n.isObject = k, n.isDate = S, n.isError = C, n.isFunction = A, n.isPrimitive = E, n.isBuffer = e("./support/isBuffer");
				var F = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				n.log = function () {
					console.log("%s - %s", D(), n.format.apply(n, arguments))
				}, n.inherits = e("inherits"), n._extend = function (e, t) {
					if (!t || !k(t)) return e;
					for (var n = Object.keys(t), r = n.length; r--;) e[n[r]] = t[n[r]];
					return e
				}
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"./support/isBuffer": 16,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			inherits: 3
		}], 18: [function (e, t) {
			t.exports = function () {
				"use strict";

				function e(n, r) {
					if (!(this instanceof e)) return new e(n, r);
					this.options = r = r || {};
					for (var i in _o) !r.hasOwnProperty(i) && _o.hasOwnProperty(i) && (r[i] = _o[i]);
					h(r);
					var o = "string" == typeof r.value ? 0 : r.value.first, a = this.display = t(n, o);
					a.wrapper.CodeMirror = this, c(this), r.autofocus && !eo && mt(this), this.state = {
						keyMaps: [],
						overlays: [],
						modeGen: 0,
						overwrite: !1,
						focused: !1,
						suppressEdits: !1,
						pasteIncoming: !1,
						cutIncoming: !1,
						draggingText: !1,
						highlight: new ii
					}, l(this), r.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap");
					var s = r.value;
					"string" == typeof s && (s = new Ho(r.value, r.mode)), st(this, kr)(this, s), Ii && setTimeout(hi(pt, this, !0), 20), bt(this);
					var u;
					try {
						u = document.activeElement == a.input
					} catch (f) {
					}
					u || r.autofocus && !eo ? setTimeout(hi(jt, this), 20) : It(this), st(this, function () {
						for (var e in wo) wo.propertyIsEnumerable(e) && wo[e](this, r[e], xo);
						for (var t = 0; t < Ao.length; ++t) Ao[t](this)
					})()
				}

				function t(e, t) {
					var n = {},
						r = n.input = vi("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
					return Ui ? r.style.width = "1000px" : r.setAttribute("wrap", "off"), Qi && (r.style.border = "1px solid black"), r.setAttribute("autocorrect", "off"), r.setAttribute("autocapitalize", "off"), r.setAttribute("spellcheck", "false"), n.inputDiv = vi("div", [r], null, "overflow: hidden; position: relative; width: 3px; height: 0px;"), n.scrollbarH = vi("div", [vi("div", null, null, "height: 1px")], "CodeMirror-hscrollbar"), n.scrollbarV = vi("div", [vi("div", null, null, "width: 1px")], "CodeMirror-vscrollbar"), n.scrollbarFiller = vi("div", null, "CodeMirror-scrollbar-filler"), n.gutterFiller = vi("div", null, "CodeMirror-gutter-filler"), n.lineDiv = vi("div", null, "CodeMirror-code"), n.selectionDiv = vi("div", null, null, "position: relative; z-index: 1"), n.cursor = vi("div", " ", "CodeMirror-cursor"), n.otherCursor = vi("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"), n.measure = vi("div", null, "CodeMirror-measure"), n.lineSpace = vi("div", [n.measure, n.selectionDiv, n.lineDiv, n.cursor, n.otherCursor], null, "position: relative; outline: none"), n.mover = vi("div", [vi("div", [n.lineSpace], "CodeMirror-lines")], null, "position: relative"), n.sizer = vi("div", [n.mover], "CodeMirror-sizer"), n.heightForcer = vi("div", null, null, "position: absolute; height: " + Wo + "px; width: 1px;"), n.gutters = vi("div", null, "CodeMirror-gutters"), n.lineGutter = null, n.scroller = vi("div", [n.sizer, n.heightForcer, n.gutters], "CodeMirror-scroll"), n.scroller.setAttribute("tabIndex", "-1"), n.wrapper = vi("div", [n.inputDiv, n.scrollbarH, n.scrollbarV, n.scrollbarFiller, n.gutterFiller, n.scroller], "CodeMirror"), zi && (n.gutters.style.zIndex = -1, n.scroller.style.paddingRight = 0), e.appendChild ? e.appendChild(n.wrapper) : e(n.wrapper), Qi && (r.style.width = "0px"), Ui || (n.scroller.draggable = !0), Yi ? (n.inputDiv.style.height = "1px", n.inputDiv.style.position = "absolute") : zi && (n.scrollbarH.style.minWidth = n.scrollbarV.style.minWidth = "18px"), n.viewOffset = n.lastSizeC = 0, n.showingFrom = n.showingTo = t, n.lineNumWidth = n.lineNumInnerWidth = n.lineNumChars = null, n.prevInput = "", n.alignWidgets = !1, n.pollingFast = !1, n.poll = new ii, n.cachedCharWidth = n.cachedTextHeight = n.cachedPaddingH = null, n.measureLineCache = [], n.measureLineCachePos = 0, n.inaccurateSelection = !1, n.maxLine = null, n.maxLineLength = 0, n.maxLineChanged = !1, n.wheelDX = n.wheelDY = n.wheelStartX = n.wheelStartY = null, n
				}

				function n(t) {
					t.doc.mode = e.getMode(t.options, t.doc.modeOption), r(t)
				}

				function r(e) {
					e.doc.iter(function (e) {
						e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
					}), e.doc.frontier = e.doc.first, B(e, 100), e.state.modeGen++, e.curOp && ct(e)
				}

				function i(e) {
					e.options.lineWrapping ? (e.display.wrapper.className += " CodeMirror-wrap", e.display.sizer.style.minWidth = "") : (e.display.wrapper.className = e.display.wrapper.className.replace(" CodeMirror-wrap", ""), d(e)), a(e), ct(e), $(e), setTimeout(function () {
						p(e)
					}, 100)
				}

				function o(e) {
					var t = rt(e.display), n = e.options.lineWrapping,
						r = n && Math.max(5, e.display.scroller.clientWidth / it(e.display) - 3);
					return function (i) {
						return Zn(e.doc, i) ? 0 : n ? (Math.ceil(i.text.length / r) || 1) * t : t
					}
				}

				function a(e) {
					var t = e.doc, n = o(e);
					t.iter(function (e) {
						var t = n(e);
						t != e.height && Er(e, t)
					})
				}

				function s(e) {
					var t = To[e.options.keyMap], n = t.style;
					e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") + (n ? " cm-keymap-" + n : "")
				}

				function l(e) {
					e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), $(e)
				}

				function u(e) {
					c(e), ct(e), setTimeout(function () {
						g(e)
					}, 20)
				}

				function c(e) {
					var t = e.display.gutters, n = e.options.gutters;
					bi(t);
					for (var r = 0; r < n.length; ++r) {
						var i = n[r], o = t.appendChild(vi("div", null, "CodeMirror-gutter " + i));
						"CodeMirror-linenumbers" == i && (e.display.lineGutter = o, o.style.width = (e.display.lineNumWidth || 1) + "px")
					}
					t.style.display = r ? "" : "none"
				}

				function f(e, t) {
					if (0 == t.height) return 0;
					for (var n, r = t.text.length, i = t; n = Kn(i);) {
						var o = n.find();
						i = Sr(e, o.from.line), r += o.from.ch - o.to.ch
					}
					for (i = t; n = Yn(i);) {
						var o = n.find();
						r -= i.text.length - o.from.ch, i = Sr(e, o.to.line), r += i.text.length - o.to.ch
					}
					return r
				}

				function d(e) {
					var t = e.display, n = e.doc;
					t.maxLine = Sr(n, n.first), t.maxLineLength = f(n, t.maxLine), t.maxLineChanged = !0, n.iter(function (e) {
						var r = f(n, e);
						r > t.maxLineLength && (t.maxLineLength = r, t.maxLine = e)
					})
				}

				function h(e) {
					var t = ui(e.gutters, "CodeMirror-linenumbers");
					-1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
				}

				function p(e) {
					var t = e.display, n = e.doc.height, r = n + I(t);
					t.sizer.style.minHeight = t.heightForcer.style.top = r + "px", t.gutters.style.height = Math.max(r, t.scroller.clientHeight - Wo) + "px";
					var i = Math.max(r, t.scroller.scrollHeight), o = t.scroller.scrollWidth > t.scroller.clientWidth + 1,
						a = i > t.scroller.clientHeight + 1;
					a ? (t.scrollbarV.style.display = "block", t.scrollbarV.style.bottom = o ? ki(t.measure) + "px" : "0", t.scrollbarV.firstChild.style.height = Math.max(0, i - t.scroller.clientHeight + t.scrollbarV.clientHeight) + "px") : (t.scrollbarV.style.display = "", t.scrollbarV.firstChild.style.height = "0"), o ? (t.scrollbarH.style.display = "block", t.scrollbarH.style.right = a ? ki(t.measure) + "px" : "0", t.scrollbarH.firstChild.style.width = t.scroller.scrollWidth - t.scroller.clientWidth + t.scrollbarH.clientWidth + "px") : (t.scrollbarH.style.display = "", t.scrollbarH.firstChild.style.width = "0"), o && a ? (t.scrollbarFiller.style.display = "block", t.scrollbarFiller.style.height = t.scrollbarFiller.style.width = ki(t.measure) + "px") : t.scrollbarFiller.style.display = "", o && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (t.gutterFiller.style.display = "block", t.gutterFiller.style.height = ki(t.measure) + "px", t.gutterFiller.style.width = t.gutters.offsetWidth + "px") : t.gutterFiller.style.display = "", Xi && 0 === ki(t.measure) && (t.scrollbarV.style.minWidth = t.scrollbarH.style.minHeight = Ji ? "18px" : "12px", t.scrollbarV.style.pointerEvents = t.scrollbarH.style.pointerEvents = "none")
				}

				function m(e, t, n) {
					var r = e.scroller.scrollTop, i = e.wrapper.clientHeight;
					"number" == typeof n ? r = n : n && (r = n.top, i = n.bottom - n.top), r = Math.floor(r - j(e));
					var o = Math.ceil(r + i);
					return {from: Tr(t, r), to: Tr(t, o)}
				}

				function g(e) {
					var t = e.display;
					if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
						for (var n = y(t) - t.scroller.scrollLeft + e.doc.scrollLeft, r = t.gutters.offsetWidth, i = n + "px", o = t.lineDiv.firstChild; o; o = o.nextSibling) if (o.alignable) for (var a = 0, s = o.alignable; a < s.length; ++a) s[a].style.left = i;
						e.options.fixedGutter && (t.gutters.style.left = n + r + "px")
					}
				}

				function v(e) {
					if (!e.options.lineNumbers) return !1;
					var t = e.doc, n = b(e.options, t.first + t.size - 1), r = e.display;
					if (n.length != r.lineNumChars) {
						var i = r.measure.appendChild(vi("div", [vi("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
							o = i.firstChild.offsetWidth, a = i.offsetWidth - o;
						return r.lineGutter.style.width = "", r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - a), r.lineNumWidth = r.lineNumInnerWidth + a, r.lineNumChars = r.lineNumInnerWidth ? n.length : -1, r.lineGutter.style.width = r.lineNumWidth + "px", !0
					}
					return !1
				}

				function b(e, t) {
					return String(e.lineNumberFormatter(t + e.firstLineNumber))
				}

				function y(e) {
					return _i(e.scroller).left - _i(e.sizer).left
				}

				function w(e, t, n, r) {
					for (var i, o = e.display.showingFrom, a = e.display.showingTo, s = m(e.display, e.doc, n), l = !0; ; l = !1) {
						var u = e.display.scroller.clientWidth;
						if (!_(e, t, s, r)) break;
						if (i = !0, t = [], T(e), p(e), l && e.options.lineWrapping && u != e.display.scroller.clientWidth) r = !0; else if (r = !1, n && (n = Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, "number" == typeof n ? n : n.top)), s = m(e.display, e.doc, n), s.from >= e.display.showingFrom && s.to <= e.display.showingTo) break
					}
					return i && (Qr(e, "update", e), (e.display.showingFrom != o || e.display.showingTo != a) && Qr(e, "viewportChange", e, e.display.showingFrom, e.display.showingTo)), i
				}

				function _(e, t, n, r) {
					var i = e.display, o = e.doc;
					if (!i.wrapper.offsetWidth) return i.showingFrom = i.showingTo = o.first, i.viewOffset = 0, void 0;
					if (!(!r && 0 == t.length && n.from > i.showingFrom && n.to < i.showingTo)) {
						v(e) && (t = [{from: o.first, to: o.first + o.size}]);
						var a = i.sizer.style.marginLeft = i.gutters.offsetWidth + "px";
						i.scrollbarH.style.left = e.options.fixedGutter ? a : "0";
						var s = 1 / 0;
						if (e.options.lineNumbers) for (var l = 0; l < t.length; ++l) t[l].diff && t[l].from < s && (s = t[l].from);
						var u = o.first + o.size, c = Math.max(n.from - e.options.viewportMargin, o.first),
							f = Math.min(u, n.to + e.options.viewportMargin);
						if (i.showingFrom < c && c - i.showingFrom < 20 && (c = Math.max(o.first, i.showingFrom)), i.showingTo > f && i.showingTo - f < 20 && (f = Math.min(u, i.showingTo)), co) for (c = Lr(Jn(o, Sr(o, c))); u > f && Zn(o, Sr(o, f));) ++f;
						var d = [{from: Math.max(i.showingFrom, o.first), to: Math.min(i.showingTo, u)}];
						if (d = d[0].from >= d[0].to ? [] : S(d, t), co) for (var l = 0; l < d.length; ++l) for (var h, p = d[l]; h = Yn(Sr(o, p.to - 1));) {
							var m = h.find().from.line;
							if (!(m > p.from)) {
								d.splice(l--, 1);
								break
							}
							p.to = m
						}
						for (var g = 0, l = 0; l < d.length; ++l) {
							var p = d[l];
							p.from < c && (p.from = c), p.to > f && (p.to = f), p.from >= p.to ? d.splice(l--, 1) : g += p.to - p.from
						}
						if (!r && g == f - c && c == i.showingFrom && f == i.showingTo) return k(e), void 0;
						d.sort(function (e, t) {
							return e.from - t.from
						});
						try {
							var b = document.activeElement
						} catch (y) {
						}
						.7 * (f - c) > g && (i.lineDiv.style.display = "none"), A(e, c, f, d, s), i.lineDiv.style.display = "", b && document.activeElement != b && b.offsetHeight && b.focus();
						var w = c != i.showingFrom || f != i.showingTo || i.lastSizeC != i.wrapper.clientHeight;
						return w && (i.lastSizeC = i.wrapper.clientHeight, B(e, 400)), i.showingFrom = c, i.showingTo = f, i.gutters.style.height = "", x(e), k(e), !0
					}
				}

				function x(e) {
					for (var t, n = e.display, r = n.lineDiv.offsetTop, i = n.lineDiv.firstChild; i; i = i.nextSibling) if (i.lineObj) {
						if (zi) {
							var o = i.offsetTop + i.offsetHeight;
							t = o - r, r = o
						} else {
							var a = _i(i);
							t = a.bottom - a.top
						}
						var s = i.lineObj.height - t;
						if (2 > t && (t = rt(n)), s > .001 || -.001 > s) {
							Er(i.lineObj, t);
							var l = i.lineObj.widgets;
							if (l) for (var u = 0; u < l.length; ++u) l[u].height = l[u].node.offsetHeight
						}
					}
				}

				function k(e) {
					var t = e.display.viewOffset = Dr(e, Sr(e.doc, e.display.showingFrom));
					e.display.mover.style.top = t + "px"
				}

				function S(e, t) {
					for (var n = 0, r = t.length || 0; r > n; ++n) {
						for (var i = t[n], o = [], a = i.diff || 0, s = 0, l = e.length; l > s; ++s) {
							var u = e[s];
							i.to <= u.from && i.diff ? o.push({
								from: u.from + a,
								to: u.to + a
							}) : i.to <= u.from || i.from >= u.to ? o.push(u) : (i.from > u.from && o.push({
								from: u.from,
								to: i.from
							}), i.to < u.to && o.push({from: i.to + a, to: u.to + a}))
						}
						e = o
					}
					return e
				}

				function C(e) {
					for (var t = e.display, n = {}, r = {}, i = t.gutters.firstChild, o = 0; i; i = i.nextSibling, ++o) n[e.options.gutters[o]] = i.offsetLeft, r[e.options.gutters[o]] = i.offsetWidth;
					return {
						fixedPos: y(t),
						gutterTotalWidth: t.gutters.offsetWidth,
						gutterLeft: n,
						gutterWidth: r,
						wrapperWidth: t.wrapper.clientWidth
					}
				}

				function A(e, t, n, r, i) {
					function o(t) {
						var n = t.nextSibling;
						return Ui && to && e.display.currentWheelTarget == t ? (t.style.display = "none", t.lineObj = null) : t.parentNode.removeChild(t), n
					}

					var a = C(e), s = e.display, l = e.options.lineNumbers;
					r.length || Ui && e.display.currentWheelTarget || bi(s.lineDiv);
					var u = s.lineDiv, c = u.firstChild, f = r.shift(), d = t;
					for (e.doc.iter(t, n, function (t) {
						if (f && f.to == d && (f = r.shift()), Zn(e.doc, t)) {
							if (0 != t.height && Er(t, 0), t.widgets && c && c.previousSibling) for (var n = 0; n < t.widgets.length; ++n) {
								var s = t.widgets[n];
								if (s.showIfHidden) {
									var h = c.previousSibling;
									if (/pre/i.test(h.nodeName)) {
										var p = vi("div", null, null, "position: relative");
										h.parentNode.replaceChild(p, h), p.appendChild(h), h = p
									}
									var m = h.appendChild(vi("div", [s.node], "CodeMirror-linewidget"));
									s.handleMouseEvents || (m.ignoreEvents = !0), L(s, m, h, a)
								}
							}
						} else if (f && f.from <= d && f.to > d) {
							for (; c.lineObj != t;) c = o(c);
							l && d >= i && c.lineNumber && wi(c.lineNumber, b(e.options, d)), c = c.nextSibling
						} else {
							if (t.widgets) for (var g, v = 0, y = c; y && 20 > v; ++v, y = y.nextSibling) if (y.lineObj == t && /div/i.test(y.nodeName)) {
								g = y;
								break
							}
							var w = E(e, t, d, a, g);
							if (w != g) u.insertBefore(w, c); else {
								for (; c != g;) c = o(c);
								c = c.nextSibling
							}
							w.lineObj = t
						}
						++d
					}); c;) c = o(c)
				}

				function E(e, t, n, r, i) {
					var o, a = dr(e, t), s = a.pre, l = t.gutterMarkers, u = e.display,
						c = a.bgClass ? a.bgClass + " " + (t.bgClass || "") : t.bgClass;
					if (!(e.options.lineNumbers || l || c || t.wrapClass || t.widgets)) return s;
					if (i) {
						i.alignable = null;
						for (var f, d = !0, h = 0, p = null, m = i.firstChild; m; m = f) if (f = m.nextSibling, /\bCodeMirror-linewidget\b/.test(m.className)) {
							for (var g = 0; g < t.widgets.length; ++g) {
								var v = t.widgets[g];
								if (v.node == m.firstChild) {
									v.above || p || (p = m), L(v, m, i, r), ++h;
									break
								}
							}
							if (g == t.widgets.length) {
								d = !1;
								break
							}
						} else i.removeChild(m);
						i.insertBefore(s, p), d && h == t.widgets.length && (o = i, i.className = t.wrapClass || "")
					}
					if (o || (o = vi("div", null, t.wrapClass, "position: relative"), o.appendChild(s)), c && o.insertBefore(vi("div", null, c + " CodeMirror-linebackground"), o.firstChild), e.options.lineNumbers || l) {
						var y = o.insertBefore(vi("div", null, "CodeMirror-gutter-wrapper", "position: absolute; left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px"), s);
						if (e.options.fixedGutter && (o.alignable || (o.alignable = [])).push(y), !e.options.lineNumbers || l && l["CodeMirror-linenumbers"] || (o.lineNumber = y.appendChild(vi("div", b(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + u.lineNumInnerWidth + "px"))), l) for (var w = 0; w < e.options.gutters.length; ++w) {
							var _ = e.options.gutters[w], x = l.hasOwnProperty(_) && l[_];
							x && y.appendChild(vi("div", [x], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[_] + "px; width: " + r.gutterWidth[_] + "px"))
						}
					}
					if (zi && (o.style.zIndex = 2), t.widgets && o != i) for (var g = 0, k = t.widgets; g < k.length; ++g) {
						var v = k[g], S = vi("div", [v.node], "CodeMirror-linewidget");
						v.handleMouseEvents || (S.ignoreEvents = !0), L(v, S, o, r), v.above ? o.insertBefore(S, e.options.lineNumbers && 0 != t.height ? y : s) : o.appendChild(S), Qr(v, "redraw")
					}
					return o
				}

				function L(e, t, n, r) {
					if (e.noHScroll) {
						(n.alignable || (n.alignable = [])).push(t);
						var i = r.wrapperWidth;
						t.style.left = r.fixedPos + "px", e.coverGutter || (i -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = i + "px"
					}
					e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"))
				}

				function T(e) {
					var t = e.display, n = Jt(e.doc.sel.from, e.doc.sel.to);
					if (n || e.options.showCursorWhenSelecting ? D(e) : t.cursor.style.display = t.otherCursor.style.display = "none", n ? t.selectionDiv.style.display = "none" : M(e), e.options.moveInputWithCursor) {
						var r = Q(e, e.doc.sel.head, "div"), i = _i(t.wrapper), o = _i(t.lineDiv);
						t.inputDiv.style.top = Math.max(0, Math.min(t.wrapper.clientHeight - 10, r.top + o.top - i.top)) + "px", t.inputDiv.style.left = Math.max(0, Math.min(t.wrapper.clientWidth - 10, r.left + o.left - i.left)) + "px"
					}
				}

				function D(e) {
					var t = e.display, n = Q(e, e.doc.sel.head, "div");
					t.cursor.style.left = n.left + "px", t.cursor.style.top = n.top + "px", t.cursor.style.height = Math.max(0, n.bottom - n.top) * e.options.cursorHeight + "px", t.cursor.style.display = "", n.other ? (t.otherCursor.style.display = "", t.otherCursor.style.left = n.other.left + "px", t.otherCursor.style.top = n.other.top + "px", t.otherCursor.style.height = .85 * (n.other.bottom - n.other.top) + "px") : t.otherCursor.style.display = "none"
				}

				function M(e) {
					function t(e, t, n, r) {
						0 > t && (t = 0), a.appendChild(vi("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == n ? u - e : n) + "px; height: " + (r - t) + "px"))
					}

					function n(n, r, o) {
						function a(t, r) {
							return Z(e, Xt(n, t), "div", f, r)
						}

						var s, c, f = Sr(i, n), d = f.text.length;
						return Ci(Mr(f), r || 0, null == o ? d : o, function (e, n, i) {
							var f, h, p, m = a(e, "left");
							if (e == n) f = m, h = p = m.left; else {
								if (f = a(n - 1, "right"), "rtl" == i) {
									var g = m;
									m = f, f = g
								}
								h = m.left, p = f.right
							}
							null == r && 0 == e && (h = l), f.top - m.top > 3 && (t(h, m.top, null, m.bottom), h = l, m.bottom < f.top && t(h, m.bottom, null, f.top)), null == o && n == d && (p = u), (!s || m.top < s.top || m.top == s.top && m.left < s.left) && (s = m), (!c || f.bottom > c.bottom || f.bottom == c.bottom && f.right > c.right) && (c = f), l + 1 > h && (h = l), t(h, f.top, p - h, f.bottom)
						}), {start: s, end: c}
					}

					var r = e.display, i = e.doc, o = e.doc.sel, a = document.createDocumentFragment(), s = z(e.display),
						l = s.left, u = r.lineSpace.offsetWidth - s.right;
					if (o.from.line == o.to.line) n(o.from.line, o.from.ch, o.to.ch);
					else {
						var c = Sr(i, o.from.line), f = Sr(i, o.to.line), d = Jn(i, c) == Jn(i, f),
							h = n(o.from.line, o.from.ch, d ? c.text.length : null).end,
							p = n(o.to.line, d ? 0 : null, o.to.ch).start;
						d && (h.top < p.top - 2 ? (t(h.right, h.top, null, h.bottom), t(l, p.top, p.left, p.bottom)) : t(h.right, h.top, p.left - h.right, h.bottom)), h.bottom < p.top && t(l, h.bottom, null, p.top)
					}
					yi(r.selectionDiv, a), r.selectionDiv.style.display = ""
				}

				function N(e) {
					if (e.state.focused) {
						var t = e.display;
						clearInterval(t.blinker);
						var n = !0;
						t.cursor.style.visibility = t.otherCursor.style.visibility = "", e.options.cursorBlinkRate > 0 && (t.blinker = setInterval(function () {
							t.cursor.style.visibility = t.otherCursor.style.visibility = (n = !n) ? "" : "hidden"
						}, e.options.cursorBlinkRate))
					}
				}

				function B(e, t) {
					e.doc.mode.startState && e.doc.frontier < e.display.showingTo && e.state.highlight.set(t, hi(O, e))
				}

				function O(e) {
					var t = e.doc;
					if (t.frontier < t.first && (t.frontier = t.first), !(t.frontier >= e.display.showingTo)) {
						var n, r = +new Date + e.options.workTime, i = Sn(t.mode, H(e, t.frontier)), o = [];
						t.iter(t.frontier, Math.min(t.first + t.size, e.display.showingTo + 500), function (a) {
							if (t.frontier >= e.display.showingFrom) {
								var s = a.styles;
								a.styles = lr(e, a, i, !0);
								for (var l = !s || s.length != a.styles.length, u = 0; !l && u < s.length; ++u) l = s[u] != a.styles[u];
								l && (n && n.end == t.frontier ? n.end++ : o.push(n = {
									start: t.frontier,
									end: t.frontier + 1
								})), a.stateAfter = Sn(t.mode, i)
							} else cr(e, a.text, i), a.stateAfter = 0 == t.frontier % 5 ? Sn(t.mode, i) : null;
							return ++t.frontier, +new Date > r ? (B(e, e.options.workDelay), !0) : void 0
						}), o.length && st(e, function () {
							for (var e = 0; e < o.length; ++e) ct(this, o[e].start, o[e].end)
						})()
					}
				}

				function F(e, t, n) {
					for (var r, i, o = e.doc, a = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), s = t; s > a; --s) {
						if (s <= o.first) return o.first;
						var l = Sr(o, s - 1);
						if (l.stateAfter && (!n || s <= o.frontier)) return s;
						var u = oi(l.text, null, e.options.tabSize);
						(null == i || r > u) && (i = s - 1, r = u)
					}
					return i
				}

				function H(e, t, n) {
					var r = e.doc, i = e.display;
					if (!r.mode.startState) return !0;
					var o = F(e, t, n), a = o > r.first && Sr(r, o - 1).stateAfter;
					return a = a ? Sn(r.mode, a) : Cn(r.mode), r.iter(o, t, function (n) {
						cr(e, n.text, a);
						var s = o == t - 1 || 0 == o % 5 || o >= i.showingFrom && o < i.showingTo;
						n.stateAfter = s ? Sn(r.mode, a) : null, ++o
					}), n && (r.frontier = o), a
				}

				function j(e) {
					return e.lineSpace.offsetTop
				}

				function I(e) {
					return e.mover.offsetHeight - e.lineSpace.offsetHeight
				}

				function z(e) {
					if (e.cachedPaddingH) return e.cachedPaddingH;
					var t = yi(e.measure, vi("pre", "x")),
						n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle;
					return e.cachedPaddingH = {left: parseInt(n.paddingLeft), right: parseInt(n.paddingRight)}
				}

				function R(e, t, n, r, i) {
					var o = -1;
					if (r = r || q(e, t), r.crude) {
						var a = r.left + n * r.width;
						return {left: a, right: a + r.width, top: r.top, bottom: r.bottom}
					}
					for (var s = n; ; s += o) {
						var l = r[s];
						if (l) break;
						0 > o && 0 == s && (o = 1)
					}
					return i = s > n ? "left" : n > s ? "right" : i, "left" == i && l.leftSide ? l = l.leftSide : "right" == i && l.rightSide && (l = l.rightSide), {
						left: n > s ? l.right : l.left,
						right: s > n ? l.left : l.right,
						top: l.top,
						bottom: l.bottom
					}
				}

				function W(e, t) {
					for (var n = e.display.measureLineCache, r = 0; r < n.length; ++r) {
						var i = n[r];
						if (i.text == t.text && i.markedSpans == t.markedSpans && e.display.scroller.clientWidth == i.width && i.classes == t.textClass + "|" + t.wrapClass) return i
					}
				}

				function P(e, t) {
					var n = W(e, t);
					n && (n.text = n.measure = n.markedSpans = null)
				}

				function q(e, t) {
					var n = W(e, t);
					if (n) return n.measure;
					var r = U(e, t), i = e.display.measureLineCache, o = {
						text: t.text,
						width: e.display.scroller.clientWidth,
						markedSpans: t.markedSpans,
						measure: r,
						classes: t.textClass + "|" + t.wrapClass
					};
					return 16 == i.length ? i[++e.display.measureLineCachePos % 16] = o : i.push(o), r
				}

				function U(e, t) {
					function n(e) {
						var t = e.top - p.top, n = e.bottom - p.top;
						n > v && (n = v), 0 > t && (t = 0);
						for (var r = m.length - 2; r >= 0; r -= 2) {
							var i = m[r], o = m[r + 1];
							if (!(i > n || t > o) && (t >= i && o >= n || i >= t && n >= o || Math.min(n, o) - Math.max(t, i) >= n - t >> 1)) {
								m[r] = Math.min(t, i), m[r + 1] = Math.max(n, o);
								break
							}
						}
						return 0 > r && (r = m.length, m.push(t, n)), {
							left: e.left - p.left,
							right: e.right - p.left,
							top: r,
							bottom: null
						}
					}

					function r(e) {
						e.bottom = m[e.top + 1], e.top = m[e.top]
					}

					if (!e.options.lineWrapping && t.text.length >= e.options.crudeMeasuringFrom) return V(e, t);
					var i = e.display, o = di(t.text.length), a = dr(e, t, o, !0).pre;
					if (Ii && !zi && !e.options.lineWrapping && a.childNodes.length > 100) {
						for (var s = document.createDocumentFragment(), l = 10, u = a.childNodes.length, c = 0, f = Math.ceil(u / l); f > c; ++c) {
							for (var d = vi("div", null, null, "display: inline-block"), h = 0; l > h && u; ++h) d.appendChild(a.firstChild), --u;
							s.appendChild(d)
						}
						a.appendChild(s)
					}
					yi(i.measure, a);
					var p = _i(i.lineDiv), m = [], g = di(t.text.length), v = a.offsetHeight;
					Ri && i.measure.first != a && yi(i.measure, a);
					for (var b, c = 0; c < o.length; ++c) if (b = o[c]) {
						var y = b, w = null;
						if (/\bCodeMirror-widget\b/.test(b.className) && b.getClientRects) {
							1 == b.firstChild.nodeType && (y = b.firstChild);
							var _ = y.getClientRects();
							_.length > 1 && (w = g[c] = n(_[0]), w.rightSide = n(_[_.length - 1]))
						}
						w || (w = g[c] = n(_i(y))), b.measureRight && (w.right = _i(b.measureRight).left - p.left), b.leftSide && (w.leftSide = n(_i(b.leftSide)))
					}
					bi(e.display.measure);
					for (var b, c = 0; c < g.length; ++c) (b = g[c]) && (r(b), b.leftSide && r(b.leftSide), b.rightSide && r(b.rightSide));
					return g
				}

				function V(e, t) {
					var n = new No(t.text.slice(0, 100), null);
					t.textClass && (n.textClass = t.textClass);
					var r = U(e, n), i = R(e, n, 0, r, "left"), o = R(e, n, 99, r, "right");
					return {crude: !0, top: i.top, left: i.left, bottom: i.bottom, width: (o.right - i.left) / 100}
				}

				function G(e, t) {
					var n = !1;
					if (t.markedSpans) for (var r = 0; r < t.markedSpans; ++r) {
						var i = t.markedSpans[r];
						!i.collapsed || null != i.to && i.to != t.text.length || (n = !0)
					}
					var o = !n && W(e, t);
					if (o || t.text.length >= e.options.crudeMeasuringFrom) return R(e, t, t.text.length, o && o.measure, "right").right;
					var a = dr(e, t, null, !0).pre, s = a.appendChild(Si(e.display.measure));
					return yi(e.display.measure, a), _i(s).right - _i(e.display.lineDiv).left
				}

				function $(e) {
					e.display.measureLineCache.length = e.display.measureLineCachePos = 0, e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
				}

				function K() {
					return window.pageXOffset || (document.documentElement || document.body).scrollLeft
				}

				function Y() {
					return window.pageYOffset || (document.documentElement || document.body).scrollTop
				}

				function X(e, t, n, r) {
					if (t.widgets) for (var i = 0; i < t.widgets.length; ++i) if (t.widgets[i].above) {
						var o = rr(t.widgets[i]);
						n.top += o, n.bottom += o
					}
					if ("line" == r) return n;
					r || (r = "local");
					var a = Dr(e, t);
					if ("local" == r ? a += j(e.display) : a -= e.display.viewOffset, "page" == r || "window" == r) {
						var s = _i(e.display.lineSpace);
						a += s.top + ("window" == r ? 0 : Y());
						var l = s.left + ("window" == r ? 0 : K());
						n.left += l, n.right += l
					}
					return n.top += a, n.bottom += a, n
				}

				function J(e, t, n) {
					if ("div" == n) return t;
					var r = t.left, i = t.top;
					if ("page" == n) r -= K(), i -= Y(); else if ("local" == n || !n) {
						var o = _i(e.display.sizer);
						r += o.left, i += o.top
					}
					var a = _i(e.display.lineSpace);
					return {left: r - a.left, top: i - a.top}
				}

				function Z(e, t, n, r, i) {
					return r || (r = Sr(e.doc, t.line)), X(e, r, R(e, r, t.ch, null, i), n)
				}

				function Q(e, t, n, r, i) {
					function o(t, o) {
						var a = R(e, r, t, i, o ? "right" : "left");
						return o ? a.left = a.right : a.right = a.left, X(e, r, a, n)
					}

					function a(e, t) {
						var n = s[t], r = n.level % 2;
						return e == Ai(n) && t && n.level < s[t - 1].level ? (n = s[--t], e = Ei(n) - (n.level % 2 ? 0 : 1), r = !0) : e == Ei(n) && t < s.length - 1 && n.level < s[t + 1].level && (n = s[++t], e = Ai(n) - n.level % 2, r = !1), r && e == n.to && e > n.from ? o(e - 1) : o(e, r)
					}

					r = r || Sr(e.doc, t.line), i || (i = q(e, r));
					var s = Mr(r), l = t.ch;
					if (!s) return o(l);
					var u = Bi(s, l), c = a(l, u);
					return null != Qo && (c.other = a(l, Qo)), c
				}

				function et(e, t, n, r) {
					var i = new Xt(e, t);
					return i.xRel = r, n && (i.outside = !0), i
				}

				function tt(e, t, n) {
					var r = e.doc;
					if (n += e.display.viewOffset, 0 > n) return et(r.first, 0, !0, -1);
					var i = Tr(r, n), o = r.first + r.size - 1;
					if (i > o) return et(r.first + r.size - 1, Sr(r, o).text.length, !0, 1);
					for (0 > t && (t = 0); ;) {
						var a = Sr(r, i), s = nt(e, a, i, t, n), l = Yn(a), u = l && l.find();
						if (!l || !(s.ch > u.from.ch || s.ch == u.from.ch && s.xRel > 0)) return s;
						i = u.to.line
					}
				}

				function nt(e, t, n, r, i) {
					function o(r) {
						var i = Q(e, Xt(n, r), "line", t, u);
						return s = !0, a > i.bottom ? i.left - l : a < i.top ? i.left + l : (s = !1, i.left)
					}

					var a = i - Dr(e, t), s = !1, l = 2 * e.display.wrapper.clientWidth, u = q(e, t), c = Mr(t),
						f = t.text.length, d = Li(t), h = Ti(t), p = o(d), m = s, g = o(h), v = s;
					if (r > g) return et(n, h, v, 1);
					for (; ;) {
						if (c ? h == d || h == Fi(t, d, 1) : 1 >= h - d) {
							for (var b = p > r || g - r >= r - p ? d : h, y = r - (b == d ? p : g); gi(t.text.charAt(b));) ++b;
							var w = et(n, b, b == d ? m : v, 0 > y ? -1 : y ? 1 : 0);
							return w
						}
						var _ = Math.ceil(f / 2), x = d + _;
						if (c) {
							x = d;
							for (var k = 0; _ > k; ++k) x = Fi(t, x, 1)
						}
						var S = o(x);
						S > r ? (h = x, g = S, (v = s) && (g += 1e3), f = _) : (d = x, p = S, m = s, f -= _)
					}
				}

				function rt(e) {
					if (null != e.cachedTextHeight) return e.cachedTextHeight;
					if (null == io) {
						io = vi("pre");
						for (var t = 0; 49 > t; ++t) io.appendChild(document.createTextNode("x")), io.appendChild(vi("br"));
						io.appendChild(document.createTextNode("x"))
					}
					yi(e.measure, io);
					var n = io.offsetHeight / 50;
					return n > 3 && (e.cachedTextHeight = n), bi(e.measure), n || 1
				}

				function it(e) {
					if (null != e.cachedCharWidth) return e.cachedCharWidth;
					var t = vi("span", "x"), n = vi("pre", [t]);
					yi(e.measure, n);
					var r = t.offsetWidth;
					return r > 2 && (e.cachedCharWidth = r), r || 10
				}

				function ot(e) {
					e.curOp = {
						changes: [],
						forceUpdate: !1,
						updateInput: null,
						userSelChange: null,
						textChanged: null,
						selectionChanged: !1,
						cursorActivity: !1,
						updateMaxLine: !1,
						updateScrollPos: !1,
						id: ++fo
					}, Ro++ || (zo = [])
				}

				function at(e) {
					var t = e.curOp, n = e.doc, r = e.display;
					if (e.curOp = null, t.updateMaxLine && d(e), r.maxLineChanged && !e.options.lineWrapping && r.maxLine) {
						var i = G(e, r.maxLine);
						r.sizer.style.minWidth = Math.max(0, i + 3) + "px", r.maxLineChanged = !1;
						var o = Math.max(0, r.sizer.offsetLeft + r.sizer.offsetWidth - r.scroller.clientWidth);
						o < n.scrollLeft && !t.updateScrollPos && Lt(e, Math.min(r.scroller.scrollLeft, o), !0)
					}
					var a, s;
					if (t.updateScrollPos) a = t.updateScrollPos; else if (t.selectionChanged && r.scroller.clientHeight) {
						var l = Q(e, n.sel.head);
						a = pn(e, l.left, l.top, l.left, l.bottom)
					}
					if ((t.changes.length || t.forceUpdate || a && null != a.scrollTop) && (s = w(e, t.changes, a && a.scrollTop, t.forceUpdate), e.display.scroller.offsetHeight && (e.doc.scrollTop = e.display.scroller.scrollTop)), !s && t.selectionChanged && T(e), t.updateScrollPos) {
						var u = Math.max(0, Math.min(r.scroller.scrollHeight - r.scroller.clientHeight, a.scrollTop)),
							c = Math.max(0, Math.min(r.scroller.scrollWidth - r.scroller.clientWidth, a.scrollLeft));
						r.scroller.scrollTop = r.scrollbarV.scrollTop = n.scrollTop = u, r.scroller.scrollLeft = r.scrollbarH.scrollLeft = n.scrollLeft = c, g(e), t.scrollToPos && dn(e, nn(e.doc, t.scrollToPos.from), nn(e.doc, t.scrollToPos.to), t.scrollToPos.margin)
					} else a && fn(e);
					t.selectionChanged && N(e), e.state.focused && t.updateInput && pt(e, t.userSelChange);
					var f = t.maybeHiddenMarkers, h = t.maybeUnhiddenMarkers;
					if (f) for (var p = 0; p < f.length; ++p) f[p].lines.length || Zr(f[p], "hide");
					if (h) for (var p = 0; p < h.length; ++p) h[p].lines.length && Zr(h[p], "unhide");
					var m;
					if (--Ro || (m = zo, zo = null), t.textChanged && Zr(e, "change", e, t.textChanged), t.cursorActivity && Zr(e, "cursorActivity", e), m) for (var p = 0; p < m.length; ++p) m[p]()
				}

				function st(e, t) {
					return function () {
						var n = e || this, r = !n.curOp;
						r && ot(n);
						try {
							var i = t.apply(n, arguments)
						} finally {
							r && at(n)
						}
						return i
					}
				}

				function lt(e) {
					return function () {
						var t, n = this.cm && !this.cm.curOp;
						n && ot(this.cm);
						try {
							t = e.apply(this, arguments)
						} finally {
							n && at(this.cm)
						}
						return t
					}
				}

				function ut(e, t) {
					var n, r = !e.curOp;
					r && ot(e);
					try {
						n = t()
					} finally {
						r && at(e)
					}
					return n
				}

				function ct(e, t, n, r) {
					null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), e.curOp.changes.push({
						from: t,
						to: n,
						diff: r
					})
				}

				function ft(e) {
					e.display.pollingFast || e.display.poll.set(e.options.pollInterval, function () {
						ht(e), e.state.focused && ft(e)
					})
				}

				function dt(e) {
					function t() {
						var r = ht(e);
						r || n ? (e.display.pollingFast = !1, ft(e)) : (n = !0, e.display.poll.set(60, t))
					}

					var n = !1;
					e.display.pollingFast = !0, e.display.poll.set(20, t)
				}

				function ht(e) {
					var t = e.display.input, n = e.display.prevInput, r = e.doc, i = r.sel;
					if (!e.state.focused || Xo(t) || vt(e) || e.options.disableInput) return !1;
					e.state.pasteIncoming && e.state.fakedLastChar && (t.value = t.value.substring(0, t.value.length - 1), e.state.fakedLastChar = !1);
					var o = t.value;
					if (o == n && Jt(i.from, i.to)) return !1;
					if (qi && !Ri && e.display.inputHasSelection === o) return pt(e, !0), !1;
					var a = !e.curOp;
					a && ot(e), i.shift = !1;
					for (var s = 0, l = Math.min(n.length, o.length); l > s && n.charCodeAt(s) == o.charCodeAt(s);) ++s;
					var u = i.from, c = i.to, f = o.slice(s);
					s < n.length ? u = Xt(u.line, u.ch - (n.length - s)) : e.state.overwrite && Jt(u, c) && !e.state.pasteIncoming && (c = Xt(c.line, Math.min(Sr(r, c.line).text.length, c.ch + f.length)));
					var d = e.curOp.updateInput, h = {
						from: u,
						to: c,
						text: Yo(f),
						origin: e.state.pasteIncoming ? "paste" : e.state.cutIncoming ? "cut" : "+input"
					};
					if (qt(e.doc, h, "end"), e.curOp.updateInput = d, Qr(e, "inputRead", e, h), f && !e.state.pasteIncoming && e.options.electricChars && e.options.smartIndent && i.head.ch < 100) {
						var p = e.getModeAt(i.head).electricChars;
						if (p) for (var m = 0; m < p.length; m++) if (f.indexOf(p.charAt(m)) > -1) {
							vn(e, i.head.line, "smart");
							break
						}
					}
					return o.length > 1e3 || o.indexOf("\n") > -1 ? t.value = e.display.prevInput = "" : e.display.prevInput = o, a && at(e), e.state.pasteIncoming = e.state.cutIncoming = !1, !0
				}

				function pt(e, t) {
					var n, r, i = e.doc;
					if (Jt(i.sel.from, i.sel.to)) t && (e.display.prevInput = e.display.input.value = "", qi && !Ri && (e.display.inputHasSelection = null)); else {
						e.display.prevInput = "", n = Jo && (i.sel.to.line - i.sel.from.line > 100 || (r = e.getSelection()).length > 1e3);
						var o = n ? "-" : r || e.getSelection();
						e.display.input.value = o, e.state.focused && li(e.display.input), qi && !Ri && (e.display.inputHasSelection = o)
					}
					e.display.inaccurateSelection = n
				}

				function mt(e) {
					"nocursor" == e.options.readOnly || eo && document.activeElement == e.display.input || e.display.input.focus()
				}

				function gt(e) {
					e.state.focused || (mt(e), jt(e))
				}

				function vt(e) {
					return e.options.readOnly || e.doc.cantEdit
				}

				function bt(e) {
					function t() {
						e.state.focused && setTimeout(hi(mt, e), 0)
					}

					function n() {
						null == s && (s = setTimeout(function () {
							s = null, a.cachedCharWidth = a.cachedTextHeight = a.cachedPaddingH = $o = null, $(e), ut(e, hi(ct, e))
						}, 100))
					}

					function r() {
						for (var e = a.wrapper.parentNode; e && e != document.body; e = e.parentNode) ;
						e ? setTimeout(r, 5e3) : Jr(window, "resize", n)
					}

					function i(t) {
						ei(e, t) || e.options.onDragEvent && e.options.onDragEvent(e, qr(t)) || $r(t)
					}

					function o(t) {
						a.inaccurateSelection && (a.prevInput = "", a.inaccurateSelection = !1, a.input.value = e.getSelection(), li(a.input)), "cut" == t.type && (e.state.cutIncoming = !0)
					}

					var a = e.display;
					Xr(a.scroller, "mousedown", st(e, _t)), Ii ? Xr(a.scroller, "dblclick", st(e, function (t) {
						if (!ei(e, t)) {
							var n = wt(e, t);
							if (n && !St(e, t) && !yt(e.display, t)) {
								Ur(t);
								var r = _n(Sr(e.doc, n.line).text, n);
								an(e.doc, r.from, r.to)
							}
						}
					})) : Xr(a.scroller, "dblclick", function (t) {
						ei(e, t) || Ur(t)
					}), Xr(a.lineSpace, "selectstart", function (e) {
						yt(a, e) || Ur(e)
					}), lo || Xr(a.scroller, "contextmenu", function (t) {
						zt(e, t)
					}), Xr(a.scroller, "scroll", function () {
						a.scroller.clientHeight && (Et(e, a.scroller.scrollTop), Lt(e, a.scroller.scrollLeft, !0), Zr(e, "scroll", e))
					}), Xr(a.scrollbarV, "scroll", function () {
						a.scroller.clientHeight && Et(e, a.scrollbarV.scrollTop)
					}), Xr(a.scrollbarH, "scroll", function () {
						a.scroller.clientHeight && Lt(e, a.scrollbarH.scrollLeft)
					}), Xr(a.scroller, "mousewheel", function (t) {
						Tt(e, t)
					}), Xr(a.scroller, "DOMMouseScroll", function (t) {
						Tt(e, t)
					}), Xr(a.scrollbarH, "mousedown", t), Xr(a.scrollbarV, "mousedown", t), Xr(a.wrapper, "scroll", function () {
						a.wrapper.scrollTop = a.wrapper.scrollLeft = 0
					});
					var s;
					Xr(window, "resize", n), setTimeout(r, 5e3), Xr(a.input, "keyup", st(e, Ot)), Xr(a.input, "input", function () {
						qi && !Ri && e.display.inputHasSelection && (e.display.inputHasSelection = null), dt(e)
					}), Xr(a.input, "keydown", st(e, Ft)), Xr(a.input, "keypress", st(e, Ht)), Xr(a.input, "focus", hi(jt, e)), Xr(a.input, "blur", hi(It, e)), e.options.dragDrop && (Xr(a.scroller, "dragstart", function (t) {
						At(e, t)
					}), Xr(a.scroller, "dragenter", i), Xr(a.scroller, "dragover", i), Xr(a.scroller, "drop", st(e, Ct))), Xr(a.scroller, "paste", function (t) {
						yt(a, t) || (mt(e), dt(e))
					}), Xr(a.input, "paste", function () {
						if (Ui && !e.state.fakedLastChar && !(new Date - e.state.lastMiddleDown < 200)) {
							var t = a.input.selectionStart, n = a.input.selectionEnd;
							a.input.value += "$", a.input.selectionStart = t, a.input.selectionEnd = n, e.state.fakedLastChar = !0
						}
						e.state.pasteIncoming = !0, dt(e)
					}), Xr(a.input, "cut", o), Xr(a.input, "copy", o), Yi && Xr(a.sizer, "mouseup", function () {
						document.activeElement == a.input && a.input.blur(), mt(e)
					})
				}

				function yt(e, t) {
					for (var n = Kr(t); n != e.wrapper; n = n.parentNode) if (!n || n.ignoreEvents || n.parentNode == e.sizer && n != e.mover) return !0
				}

				function wt(e, t, n) {
					var r = e.display;
					if (!n) {
						var i = Kr(t);
						if (i == r.scrollbarH || i == r.scrollbarH.firstChild || i == r.scrollbarV || i == r.scrollbarV.firstChild || i == r.scrollbarFiller || i == r.gutterFiller) return null
					}
					var o, a, s = _i(r.lineSpace);
					try {
						o = t.clientX, a = t.clientY
					} catch (t) {
						return null
					}
					return tt(e, o - s.left, a - s.top)
				}

				function _t(e) {
					function t(e) {
						if (!Jt(v, e)) {
							if (v = e, "single" == c) return an(i.doc, nn(a, l), e), void 0;
							if (p = nn(a, p), g = nn(a, g), "double" == c) {
								var t = _n(Sr(a, e.line).text, e);
								Zt(e, p) ? an(i.doc, t.from, g) : an(i.doc, p, t.to)
							} else "triple" == c && (Zt(e, p) ? an(i.doc, g, nn(a, Xt(e.line, 0))) : an(i.doc, p, nn(a, Xt(e.line + 1, 0))))
						}
					}

					function n(e) {
						var r = ++y, s = wt(i, e, !0);
						if (s) if (Jt(s, d)) {
							var l = e.clientY < b.top ? -20 : e.clientY > b.bottom ? 20 : 0;
							l && setTimeout(st(i, function () {
								y == r && (o.scroller.scrollTop += l, n(e))
							}), 50)
						} else {
							gt(i), d = s, t(s);
							var u = m(o, a);
							(s.line >= u.to || s.line < u.from) && setTimeout(st(i, function () {
								y == r && n(e)
							}), 150)
						}
					}

					function r(e) {
						y = 1 / 0, Ur(e), mt(i), Jr(document, "mousemove", w), Jr(document, "mouseup", _)
					}

					if (!ei(this, e)) {
						var i = this, o = i.display, a = i.doc, s = a.sel;
						if (s.shift = e.shiftKey, yt(o, e)) return Ui || (o.scroller.draggable = !1, setTimeout(function () {
							o.scroller.draggable = !0
						}, 100)), void 0;
						if (!St(i, e)) {
							var l = wt(i, e);
							switch (window.focus(), Yr(e)) {
								case 3:
									return lo && zt.call(i, i, e), void 0;
								case 2:
									return Ui && (i.state.lastMiddleDown = +new Date), l && an(i.doc, l), setTimeout(hi(mt, i), 20), Ur(e), void 0
							}
							if (!l) return Kr(e) == o.scroller && Ur(e), void 0;
							setTimeout(hi(gt, i), 0);
							var u = +new Date, c = "single";
							if (ao && ao.time > u - 400 && Jt(ao.pos, l)) c = "triple", Ur(e), setTimeout(hi(mt, i), 20), xn(i, l.line); else if (oo && oo.time > u - 400 && Jt(oo.pos, l)) {
								c = "double", ao = {time: u, pos: l}, Ur(e);
								var f = _n(Sr(a, l.line).text, l);
								an(i.doc, f.from, f.to)
							} else oo = {time: u, pos: l};
							var d = l;
							if (i.options.dragDrop && Go && !vt(i) && !Jt(s.from, s.to) && !Zt(l, s.from) && !Zt(s.to, l) && "single" == c) {
								var h = st(i, function (t) {
									Ui && (o.scroller.draggable = !1), i.state.draggingText = !1, Jr(document, "mouseup", h), Jr(o.scroller, "drop", h), Math.abs(e.clientX - t.clientX) + Math.abs(e.clientY - t.clientY) < 10 && (Ur(t), an(i.doc, l), mt(i), Ii && !Ri && setTimeout(function () {
										document.body.focus(), mt(i)
									}, 20))
								});
								return Ui && (o.scroller.draggable = !0), i.state.draggingText = h, o.scroller.dragDrop && o.scroller.dragDrop(), Xr(document, "mouseup", h), Xr(o.scroller, "drop", h), void 0
							}
							Ur(e), "single" == c && an(i.doc, nn(a, l));
							var p = s.from, g = s.to, v = l, b = _i(o.wrapper), y = 0, w = st(i, function (e) {
								(qi && !Wi ? e.buttons : Yr(e)) ? n(e) : r(e)
							}), _ = st(i, r);
							Xr(document, "mousemove", w), Xr(document, "mouseup", _)
						}
					}
				}

				function xt(e, t, n, r, i) {
					try {
						var o = t.clientX, a = t.clientY
					} catch (t) {
						return !1
					}
					if (o >= Math.floor(_i(e.display.gutters).right)) return !1;
					r && Ur(t);
					var s = e.display, l = _i(s.lineDiv);
					if (a > l.bottom || !ni(e, n)) return Gr(t);
					a -= l.top - s.viewOffset;
					for (var u = 0; u < e.options.gutters.length; ++u) {
						var c = s.gutters.childNodes[u];
						if (c && _i(c).right >= o) {
							var f = Tr(e.doc, a), d = e.options.gutters[u];
							return i(e, n, e, f, d, t), Gr(t)
						}
					}
				}

				function kt(e, t) {
					return ni(e, "gutterContextMenu") ? xt(e, t, "gutterContextMenu", !1, Zr) : !1
				}

				function St(e, t) {
					return xt(e, t, "gutterClick", !0, Qr)
				}

				function Ct(e) {
					var t = this;
					if (!(ei(t, e) || yt(t.display, e) || t.options.onDragEvent && t.options.onDragEvent(t, qr(e)))) {
						Ur(e), qi && (ho = +new Date);
						var n = wt(t, e, !0), r = e.dataTransfer.files;
						if (n && !vt(t)) if (r && r.length && window.FileReader && window.File) for (var i = r.length, o = Array(i), a = 0, s = function (e, r) {
							var s = new FileReader;
							s.onload = function () {
								o[r] = s.result, ++a == i && (n = nn(t.doc, n), qt(t.doc, {
									from: n,
									to: n,
									text: Yo(o.join("\n")),
									origin: "paste"
								}, "around"))
							}, s.readAsText(e)
						}, l = 0; i > l; ++l) s(r[l], l); else {
							if (t.state.draggingText && !Zt(n, t.doc.sel.from) && !Zt(t.doc.sel.to, n)) return t.state.draggingText(e), setTimeout(hi(mt, t), 20), void 0;
							try {
								var o = e.dataTransfer.getData("Text");
								if (o) {
									var u = t.doc.sel.from, c = t.doc.sel.to;
									ln(t.doc, n, n), t.state.draggingText && Yt(t.doc, "", u, c, "paste"), t.replaceSelection(o, null, "paste"), mt(t)
								}
							} catch (e) {
							}
						}
					}
				}

				function At(e, t) {
					if (qi && (!e.state.draggingText || +new Date - ho < 100)) return $r(t), void 0;
					if (!ei(e, t) && !yt(e.display, t)) {
						var n = e.getSelection();
						if (t.dataTransfer.setData("Text", n), t.dataTransfer.setDragImage && !Ki) {
							var r = vi("img", null, null, "position: fixed; left: 0; top: 0;");
							r.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", $i && (r.width = r.height = 1, e.display.wrapper.appendChild(r), r._top = r.offsetTop), t.dataTransfer.setDragImage(r, 0, 0), $i && r.parentNode.removeChild(r)
						}
					}
				}

				function Et(e, t) {
					Math.abs(e.doc.scrollTop - t) < 2 || (e.doc.scrollTop = t, ji || w(e, [], t), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t), e.display.scrollbarV.scrollTop != t && (e.display.scrollbarV.scrollTop = t), ji && w(e, []), B(e, 100))
				}

				function Lt(e, t, n) {
					(n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), e.doc.scrollLeft = t, g(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbarH.scrollLeft != t && (e.display.scrollbarH.scrollLeft = t))
				}

				function Tt(e, t) {
					var n = t.wheelDeltaX, r = t.wheelDeltaY;
					null == n && t.detail && t.axis == t.HORIZONTAL_AXIS && (n = t.detail), null == r && t.detail && t.axis == t.VERTICAL_AXIS ? r = t.detail : null == r && (r = t.wheelDelta);
					var i = e.display, o = i.scroller;
					if (n && o.scrollWidth > o.clientWidth || r && o.scrollHeight > o.clientHeight) {
						if (r && to && Ui) for (var a = t.target; a != o; a = a.parentNode) if (a.lineObj) {
							e.display.currentWheelTarget = a;
							break
						}
						if (n && !ji && !$i && null != mo) return r && Et(e, Math.max(0, Math.min(o.scrollTop + r * mo, o.scrollHeight - o.clientHeight))), Lt(e, Math.max(0, Math.min(o.scrollLeft + n * mo, o.scrollWidth - o.clientWidth))), Ur(t), i.wheelStartX = null, void 0;
						if (r && null != mo) {
							var s = r * mo, l = e.doc.scrollTop, u = l + i.wrapper.clientHeight;
							0 > s ? l = Math.max(0, l + s - 50) : u = Math.min(e.doc.height, u + s + 50), w(e, [], {
								top: l,
								bottom: u
							})
						}
						20 > po && (null == i.wheelStartX ? (i.wheelStartX = o.scrollLeft, i.wheelStartY = o.scrollTop, i.wheelDX = n, i.wheelDY = r, setTimeout(function () {
							if (null != i.wheelStartX) {
								var e = o.scrollLeft - i.wheelStartX, t = o.scrollTop - i.wheelStartY,
									n = t && i.wheelDY && t / i.wheelDY || e && i.wheelDX && e / i.wheelDX;
								i.wheelStartX = i.wheelStartY = null, n && (mo = (mo * po + n) / (po + 1), ++po)
							}
						}, 200)) : (i.wheelDX += n, i.wheelDY += r))
					}
				}

				function Dt(e, t, n) {
					if ("string" == typeof t && (t = Lo[t], !t)) return !1;
					e.display.pollingFast && ht(e) && (e.display.pollingFast = !1);
					var r = e.doc, i = r.sel.shift, o = !1;
					try {
						vt(e) && (e.state.suppressEdits = !0), n && (r.sel.shift = !1), o = t(e) != Po
					} finally {
						r.sel.shift = i, e.state.suppressEdits = !1
					}
					return o
				}

				function Mt(e) {
					var t = e.state.keyMaps.slice(0);
					return e.options.extraKeys && t.push(e.options.extraKeys), t.push(e.options.keyMap), t
				}

				function Nt(e, t) {
					var n = An(e.options.keyMap), r = n.auto;
					clearTimeout(go), r && !Ln(t) && (go = setTimeout(function () {
						An(e.options.keyMap) == n && (e.options.keyMap = r.call ? r.call(null, e) : r, s(e))
					}, 50));
					var i = Tn(t, !0), o = !1;
					if (!i) return !1;
					var a = Mt(e);
					return o = t.shiftKey ? En("Shift-" + i, a, function (t) {
						return Dt(e, t, !0)
					}) || En(i, a, function (t) {
						return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? Dt(e, t) : void 0
					}) : En(i, a, function (t) {
						return Dt(e, t)
					}), o && (Ur(t), N(e), Ri && (t.oldKeyCode = t.keyCode, t.keyCode = 0), Qr(e, "keyHandled", e, i, t)), o
				}

				function Bt(e, t, n) {
					var r = En("'" + n + "'", Mt(e), function (t) {
						return Dt(e, t, !0)
					});
					return r && (Ur(t), N(e), Qr(e, "keyHandled", e, "'" + n + "'", t)), r
				}

				function Ot(e) {
					var t = this;
					ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)) || 16 == e.keyCode && (t.doc.sel.shift = !1)
				}

				function Ft(e) {
					var t = this;
					if (gt(t), !(ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)))) {
						Ii && 27 == e.keyCode && (e.returnValue = !1);
						var n = e.keyCode;
						t.doc.sel.shift = 16 == n || e.shiftKey;
						var r = Nt(t, e);
						$i && (bo = r ? n : null, !r && 88 == n && !Jo && (to ? e.metaKey : e.ctrlKey) && t.replaceSelection(""))
					}
				}

				function Ht(e) {
					var t = this;
					if (!(ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)))) {
						var n = e.keyCode, r = e.charCode;
						if ($i && n == bo) return bo = null, Ur(e), void 0;
						if (!($i && (!e.which || e.which < 10) || Yi) || !Nt(t, e)) {
							var i = String.fromCharCode(null == r ? n : r);
							Bt(t, e, i) || (qi && !Ri && (t.display.inputHasSelection = null), dt(t))
						}
					}
				}

				function jt(e) {
					"nocursor" != e.options.readOnly && (e.state.focused || (Zr(e, "focus", e), e.state.focused = !0, -1 == e.display.wrapper.className.search(/\bCodeMirror-focused\b/) && (e.display.wrapper.className += " CodeMirror-focused"), e.curOp || (pt(e, !0), Ui && setTimeout(hi(pt, e, !0), 0))), ft(e), N(e))
				}

				function It(e) {
					e.state.focused && (Zr(e, "blur", e), e.state.focused = !1, e.display.wrapper.className = e.display.wrapper.className.replace(" CodeMirror-focused", "")), clearInterval(e.display.blinker), setTimeout(function () {
						e.state.focused || (e.doc.sel.shift = !1)
					}, 150)
				}

				function zt(e, t) {
					function n() {
						if (null != i.input.selectionStart) {
							var e = i.input.value = "​" + (Jt(o.from, o.to) ? "" : i.input.value);
							i.prevInput = "​", i.input.selectionStart = 1, i.input.selectionEnd = e.length
						}
					}

					function r() {
						if (i.inputDiv.style.position = "relative", i.input.style.cssText = u, Ri && (i.scrollbarV.scrollTop = i.scroller.scrollTop = s), ft(e), null != i.input.selectionStart) {
							(!qi || Ri) && n(), clearTimeout(vo);
							var t = 0, r = function () {
								"​" == i.prevInput && 0 == i.input.selectionStart ? st(e, Lo.selectAll)(e) : t++ < 10 ? vo = setTimeout(r, 500) : pt(e)
							};
							vo = setTimeout(r, 200)
						}
					}

					if (!ei(e, t, "contextmenu")) {
						var i = e.display, o = e.doc.sel;
						if (!yt(i, t) && !kt(e, t)) {
							var a = wt(e, t), s = i.scroller.scrollTop;
							if (a && !$i) {
								var l = e.options.resetSelectionOnContextMenu;
								l && (Jt(o.from, o.to) || Zt(a, o.from) || !Zt(a, o.to)) && st(e, ln)(e.doc, a, a);
								var u = i.input.style.cssText;
								if (i.inputDiv.style.position = "absolute", i.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (t.clientY - 5) + "px; left: " + (t.clientX - 5) + "px; z-index: 1000; background: transparent; outline: none;" + "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);", mt(e), pt(e, !0), Jt(o.from, o.to) && (i.input.value = i.prevInput = " "), qi && !Ri && n(), lo) {
									$r(t);
									var c = function () {
										Jr(window, "mouseup", c), setTimeout(r, 20)
									};
									Xr(window, "mouseup", c)
								} else setTimeout(r, 50)
							}
						}
					}
				}

				function Rt(e, t, n) {
					if (!Zt(t.from, n)) return nn(e, n);
					var r = t.text.length - 1 - (t.to.line - t.from.line);
					if (n.line > t.to.line + r) {
						var i = n.line - r, o = e.first + e.size - 1;
						return i > o ? Xt(o, Sr(e, o).text.length) : rn(n, Sr(e, i).text.length)
					}
					if (n.line == t.to.line + r) return rn(n, si(t.text).length + (1 == t.text.length ? t.from.ch : 0) + Sr(e, t.to.line).text.length - t.to.ch);
					var a = n.line - t.from.line;
					return rn(n, t.text[a].length + (a ? 0 : t.from.ch))
				}

				function Wt(e, t, n) {
					if (n && "object" == typeof n) return {anchor: Rt(e, t, n.anchor), head: Rt(e, t, n.head)};
					if ("start" == n) return {anchor: t.from, head: t.from};
					var r = yo(t);
					if ("around" == n) return {anchor: t.from, head: r};
					if ("end" == n) return {anchor: r, head: r};
					var i = function (e) {
						if (Zt(e, t.from)) return e;
						if (!Zt(t.to, e)) return r;
						var n = e.line + t.text.length - (t.to.line - t.from.line) - 1, i = e.ch;
						return e.line == t.to.line && (i += r.ch - t.to.ch), Xt(n, i)
					};
					return {anchor: i(e.sel.anchor), head: i(e.sel.head)}
				}

				function Pt(e, t, n) {
					var r = {
						canceled: !1, from: t.from, to: t.to, text: t.text, origin: t.origin, cancel: function () {
							this.canceled = !0
						}
					};
					return n && (r.update = function (t, n, r, i) {
						t && (this.from = nn(e, t)), n && (this.to = nn(e, n)), r && (this.text = r), void 0 !== i && (this.origin = i)
					}), Zr(e, "beforeChange", e, r), e.cm && Zr(e.cm, "beforeChange", e.cm, r), r.canceled ? null : {
						from: r.from,
						to: r.to,
						text: r.text,
						origin: r.origin
					}
				}

				function qt(e, t, n, r) {
					if (e.cm) {
						if (!e.cm.curOp) return st(e.cm, qt)(e, t, n, r);
						if (e.cm.state.suppressEdits) return
					}
					if (!(ni(e, "beforeChange") || e.cm && ni(e.cm, "beforeChange")) || (t = Pt(e, t, !0))) {
						var i = uo && !r && qn(e, t.from, t.to);
						if (i) {
							for (var o = i.length - 1; o >= 1; --o) Ut(e, {from: i[o].from, to: i[o].to, text: [""]});
							i.length && Ut(e, {from: i[0].from, to: i[0].to, text: t.text}, n)
						} else Ut(e, t, n)
					}
				}

				function Ut(e, t, n) {
					if (1 != t.text.length || "" != t.text[0] || !Jt(t.from, t.to)) {
						var r = Wt(e, t, n);
						Fr(e, t, r, e.cm ? e.cm.curOp.id : 0 / 0), $t(e, t, r, Rn(e, t));
						var i = [];
						xr(e, function (e, n) {
							n || -1 != ui(i, e.history) || (Wr(e.history, t), i.push(e.history)), $t(e, t, null, Rn(e, t))
						})
					}
				}

				function Vt(e, t) {
					if (!e.cm || !e.cm.state.suppressEdits) {
						var n = e.history, r = ("undo" == t ? n.done : n.undone).pop();
						if (r) {
							var i = {
								changes: [],
								anchorBefore: r.anchorAfter,
								headBefore: r.headAfter,
								anchorAfter: r.anchorBefore,
								headAfter: r.headBefore,
								generation: n.generation
							};
							("undo" == t ? n.undone : n.done).push(i), n.generation = r.generation || ++n.maxGeneration;
							for (var o = ni(e, "beforeChange") || e.cm && ni(e.cm, "beforeChange"), a = r.changes.length - 1; a >= 0; --a) {
								var s = r.changes[a];
								if (s.origin = t, o && !Pt(e, s, !1)) return ("undo" == t ? n.done : n.undone).length = 0, void 0;
								i.changes.push(Or(e, s));
								var l = a ? Wt(e, s, null) : {anchor: r.anchorBefore, head: r.headBefore};
								$t(e, s, l, Pn(e, s));
								var u = [];
								xr(e, function (e, t) {
									t || -1 != ui(u, e.history) || (Wr(e.history, s), u.push(e.history)), $t(e, s, null, Pn(e, s))
								})
							}
						}
					}
				}

				function Gt(e, t) {
					function n(e) {
						return Xt(e.line + t, e.ch)
					}

					e.first += t, e.cm && ct(e.cm, e.first, e.first, t), e.sel.head = n(e.sel.head), e.sel.anchor = n(e.sel.anchor), e.sel.from = n(e.sel.from), e.sel.to = n(e.sel.to)
				}

				function $t(e, t, n, r) {
					if (e.cm && !e.cm.curOp) return st(e.cm, $t)(e, t, n, r);
					if (t.to.line < e.first) return Gt(e, t.text.length - 1 - (t.to.line - t.from.line)), void 0;
					if (!(t.from.line > e.lastLine())) {
						if (t.from.line < e.first) {
							var i = t.text.length - 1 - (e.first - t.from.line);
							Gt(e, i), t = {
								from: Xt(e.first, 0),
								to: Xt(t.to.line + i, t.to.ch),
								text: [si(t.text)],
								origin: t.origin
							}
						}
						var o = e.lastLine();
						t.to.line > o && (t = {
							from: t.from,
							to: Xt(o, Sr(e, o).text.length),
							text: [t.text[0]],
							origin: t.origin
						}), t.removed = Cr(e, t.from, t.to), n || (n = Wt(e, t, null)), e.cm ? Kt(e.cm, t, r, n) : yr(e, t, r, n)
					}
				}

				function Kt(e, t, n, r) {
					var i = e.doc, a = e.display, s = t.from, l = t.to, u = !1, c = s.line;
					e.options.lineWrapping || (c = Lr(Jn(i, Sr(i, s.line))), i.iter(c, l.line + 1, function (e) {
						return e == a.maxLine ? (u = !0, !0) : void 0
					})), Zt(i.sel.head, t.from) || Zt(t.to, i.sel.head) || (e.curOp.cursorActivity = !0), yr(i, t, n, r, o(e)), e.options.lineWrapping || (i.iter(c, s.line + t.text.length, function (e) {
						var t = f(i, e);
						t > a.maxLineLength && (a.maxLine = e, a.maxLineLength = t, a.maxLineChanged = !0, u = !1)
					}), u && (e.curOp.updateMaxLine = !0)), i.frontier = Math.min(i.frontier, s.line), B(e, 400);
					var d = t.text.length - (l.line - s.line) - 1;
					if (ct(e, s.line, l.line + 1, d), ni(e, "change")) {
						var h = {from: s, to: l, text: t.text, removed: t.removed, origin: t.origin};
						if (e.curOp.textChanged) {
							for (var p = e.curOp.textChanged; p.next; p = p.next) ;
							p.next = h
						} else e.curOp.textChanged = h
					}
				}

				function Yt(e, t, n, r, i) {
					if (r || (r = n), Zt(r, n)) {
						var o = r;
						r = n, n = o
					}
					"string" == typeof t && (t = Yo(t)), qt(e, {from: n, to: r, text: t, origin: i}, null)
				}

				function Xt(e, t) {
					return this instanceof Xt ? (this.line = e, this.ch = t, void 0) : new Xt(e, t)
				}

				function Jt(e, t) {
					return e.line == t.line && e.ch == t.ch
				}

				function Zt(e, t) {
					return e.line < t.line || e.line == t.line && e.ch < t.ch
				}

				function Qt(e, t) {
					return e.line - t.line || e.ch - t.ch
				}

				function en(e) {
					return Xt(e.line, e.ch)
				}

				function tn(e, t) {
					return Math.max(e.first, Math.min(t, e.first + e.size - 1))
				}

				function nn(e, t) {
					if (t.line < e.first) return Xt(e.first, 0);
					var n = e.first + e.size - 1;
					return t.line > n ? Xt(n, Sr(e, n).text.length) : rn(t, Sr(e, t.line).text.length)
				}

				function rn(e, t) {
					var n = e.ch;
					return null == n || n > t ? Xt(e.line, t) : 0 > n ? Xt(e.line, 0) : e
				}

				function on(e, t) {
					return t >= e.first && t < e.first + e.size
				}

				function an(e, t, n, r) {
					if (e.sel.shift || e.sel.extend) {
						var i = e.sel.anchor;
						if (n) {
							var o = Zt(t, i);
							o != Zt(n, i) ? (i = t, t = n) : o != Zt(t, n) && (t = n)
						}
						ln(e, i, t, r)
					} else ln(e, t, n || t, r);
					e.cm && (e.cm.curOp.userSelChange = !0)
				}

				function sn(e, t, n) {
					var r = {anchor: t, head: n};
					return Zr(e, "beforeSelectionChange", e, r), e.cm && Zr(e.cm, "beforeSelectionChange", e.cm, r), r.anchor = nn(e, r.anchor), r.head = nn(e, r.head), r
				}

				function ln(e, t, n, r, i) {
					if (!i && ni(e, "beforeSelectionChange") || e.cm && ni(e.cm, "beforeSelectionChange")) {
						var o = sn(e, t, n);
						n = o.head, t = o.anchor
					}
					var a = e.sel;
					if (a.goalColumn = null, null == r && (r = Zt(n, a.head) ? -1 : 1), (i || !Jt(t, a.anchor)) && (t = cn(e, t, r, "push" != i)), (i || !Jt(n, a.head)) && (n = cn(e, n, r, "push" != i)), !Jt(a.anchor, t) || !Jt(a.head, n)) {
						a.anchor = t, a.head = n;
						var s = Zt(n, t);
						a.from = s ? n : t, a.to = s ? t : n, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = e.cm.curOp.cursorActivity = !0), Qr(e, "cursorActivity", e)
					}
				}

				function un(e) {
					ln(e.doc, e.doc.sel.from, e.doc.sel.to, null, "push")
				}

				function cn(e, t, n, r) {
					var i = !1, o = t, a = n || 1;
					e.cantEdit = !1;
					e:for (; ;) {
						var s = Sr(e, o.line);
						if (s.markedSpans) for (var l = 0; l < s.markedSpans.length; ++l) {
							var u = s.markedSpans[l], c = u.marker;
							if ((null == u.from || (c.inclusiveLeft ? u.from <= o.ch : u.from < o.ch)) && (null == u.to || (c.inclusiveRight ? u.to >= o.ch : u.to > o.ch))) {
								if (r && (Zr(c, "beforeCursorEnter"), c.explicitlyCleared)) {
									if (s.markedSpans) {
										--l;
										continue
									}
									break
								}
								if (!c.atomic) continue;
								var f = c.find()[0 > a ? "from" : "to"];
								if (Jt(f, o) && (f.ch += a, f.ch < 0 ? f = f.line > e.first ? nn(e, Xt(f.line - 1)) : null : f.ch > s.text.length && (f = f.line < e.first + e.size - 1 ? Xt(f.line + 1, 0) : null), !f)) {
									if (i) return r ? (e.cantEdit = !0, Xt(e.first, 0)) : cn(e, t, n, !0);
									i = !0, f = t, a = -a
								}
								o = f;
								continue e
							}
						}
						return o
					}
				}

				function fn(e) {
					var t = dn(e, e.doc.sel.head, null, e.options.cursorScrollMargin);
					if (e.state.focused) {
						var n = e.display, r = _i(n.sizer), i = null;
						if (t.top + r.top < 0 ? i = !0 : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !Zi) {
							var o = vi("div", "​", null, "position: absolute; top: " + (t.top - n.viewOffset) + "px; height: " + (t.bottom - t.top + Wo) + "px; left: " + t.left + "px; width: 2px;");
							e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o)
						}
					}
				}

				function dn(e, t, n, r) {
					for (null == r && (r = 0); ;) {
						var i = !1, o = Q(e, t), a = n && n != t ? Q(e, n) : o,
							s = pn(e, Math.min(o.left, a.left), Math.min(o.top, a.top) - r, Math.max(o.left, a.left), Math.max(o.bottom, a.bottom) + r),
							l = e.doc.scrollTop, u = e.doc.scrollLeft;
						if (null != s.scrollTop && (Et(e, s.scrollTop), Math.abs(e.doc.scrollTop - l) > 1 && (i = !0)), null != s.scrollLeft && (Lt(e, s.scrollLeft), Math.abs(e.doc.scrollLeft - u) > 1 && (i = !0)), !i) return o
					}
				}

				function hn(e, t, n, r, i) {
					var o = pn(e, t, n, r, i);
					null != o.scrollTop && Et(e, o.scrollTop), null != o.scrollLeft && Lt(e, o.scrollLeft)
				}

				function pn(e, t, n, r, i) {
					var o = e.display, a = rt(e.display);
					0 > n && (n = 0);
					var s = o.scroller.clientHeight - Wo, l = o.scroller.scrollTop, u = {}, c = e.doc.height + I(o),
						f = a > n, d = i > c - a;
					if (l > n) u.scrollTop = f ? 0 : n; else if (i > l + s) {
						var h = Math.min(n, (d ? c : i) - s);
						h != l && (u.scrollTop = h)
					}
					var p = o.scroller.clientWidth - Wo, m = o.scroller.scrollLeft;
					t += o.gutters.offsetWidth, r += o.gutters.offsetWidth;
					var g = o.gutters.offsetWidth, v = g + 10 > t;
					return m + g > t || v ? (v && (t = 0), u.scrollLeft = Math.max(0, t - 10 - g)) : r > p + m - 3 && (u.scrollLeft = r + 10 - p), u
				}

				function mn(e, t, n) {
					e.curOp.updateScrollPos = {
						scrollLeft: null == t ? e.doc.scrollLeft : t,
						scrollTop: null == n ? e.doc.scrollTop : n
					}
				}

				function gn(e, t, n) {
					var r = e.curOp.updateScrollPos || (e.curOp.updateScrollPos = {
						scrollLeft: e.doc.scrollLeft,
						scrollTop: e.doc.scrollTop
					}), i = e.display.scroller;
					r.scrollTop = Math.max(0, Math.min(i.scrollHeight - i.clientHeight, r.scrollTop + n)), r.scrollLeft = Math.max(0, Math.min(i.scrollWidth - i.clientWidth, r.scrollLeft + t))
				}

				function vn(e, t, n, r) {
					var i, o = e.doc;
					null == n && (n = "add"), "smart" == n && (e.doc.mode.indent ? i = H(e, t) : n = "prev");
					var a = e.options.tabSize, s = Sr(o, t), l = oi(s.text, null, a);
					s.stateAfter && (s.stateAfter = null);
					var u, c = s.text.match(/^\s*/)[0];
					if (r || /\S/.test(s.text)) {
						if ("smart" == n && (u = e.doc.mode.indent(i, s.text.slice(c.length), s.text), u == Po)) {
							if (!r) return;
							n = "prev"
						}
					} else u = 0, n = "not";
					"prev" == n ? u = t > o.first ? oi(Sr(o, t - 1).text, null, a) : 0 : "add" == n ? u = l + e.options.indentUnit : "subtract" == n ? u = l - e.options.indentUnit : "number" == typeof n && (u = l + n), u = Math.max(0, u);
					var f = "", d = 0;
					if (e.options.indentWithTabs) for (var h = Math.floor(u / a); h; --h) d += a, f += "	";
					u > d && (f += ai(u - d)), f != c ? Yt(e.doc, f, Xt(t, 0), Xt(t, c.length), "+input") : o.sel.head.line == t && o.sel.head.ch < c.length && ln(o, Xt(t, c.length), Xt(t, c.length), 1), s.stateAfter = null
				}

				function bn(e, t, n) {
					var r = t, i = t, o = e.doc;
					return "number" == typeof t ? i = Sr(o, tn(o, t)) : r = Lr(t), null == r ? null : n(i, r) ? (ct(e, r, r + 1), i) : null
				}

				function yn(e, t, n, r, i) {
					function o() {
						var t = s + n;
						return t < e.first || t >= e.first + e.size ? f = !1 : (s = t, c = Sr(e, t))
					}

					function a(e) {
						var t = (i ? Fi : Hi)(c, l, n, !0);
						if (null == t) {
							if (e || !o()) return f = !1;
							l = i ? (0 > n ? Ti : Li)(c) : 0 > n ? c.text.length : 0
						} else l = t;
						return !0
					}

					var s = t.line, l = t.ch, u = n, c = Sr(e, s), f = !0;
					if ("char" == r) a(); else if ("column" == r) a(!0); else if ("word" == r || "group" == r) for (var d = null, h = "group" == r, p = !0; !(0 > n) || a(!p); p = !1) {
						var m = c.text.charAt(l) || "\n",
							g = pi(m) ? "w" : h && "\n" == m ? "n" : !h || /\s/.test(m) ? null : "p";
						if (!h || p || g || (g = "s"), d && d != g) {
							0 > n && (n = 1, a());
							break
						}
						if (g && (d = g), n > 0 && !a(!p)) break
					}
					var v = cn(e, Xt(s, l), u, !0);
					return f || (v.hitSide = !0), v
				}

				function wn(e, t, n, r) {
					var i, o = e.doc, a = t.left;
					if ("page" == r) {
						var s = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
						i = t.top + n * (s - (0 > n ? 1.5 : .5) * rt(e.display))
					} else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
					for (; ;) {
						var l = tt(e, a, i);
						if (!l.outside) break;
						if (0 > n ? 0 >= i : i >= o.height) {
							l.hitSide = !0;
							break
						}
						i += 5 * n
					}
					return l
				}

				function _n(e, t) {
					var n = t.ch, r = t.ch;
					if (e) {
						(t.xRel < 0 || r == e.length) && n ? --n : ++r;
						for (var i = e.charAt(n), o = pi(i) ? pi : /\s/.test(i) ? function (e) {
							return /\s/.test(e)
						} : function (e) {
							return !/\s/.test(e) && !pi(e)
						}; n > 0 && o(e.charAt(n - 1));) --n;
						for (; r < e.length && o(e.charAt(r));) ++r
					}
					return {from: Xt(t.line, n), to: Xt(t.line, r)}
				}

				function xn(e, t) {
					an(e.doc, Xt(t, 0), nn(e.doc, Xt(t + 1, 0)))
				}

				function kn(t, n, r, i) {
					e.defaults[t] = n, r && (wo[t] = i ? function (e, t, n) {
						n != xo && r(e, t, n)
					} : r)
				}

				function Sn(e, t) {
					if (t === !0) return t;
					if (e.copyState) return e.copyState(t);
					var n = {};
					for (var r in t) {
						var i = t[r];
						i instanceof Array && (i = i.concat([])), n[r] = i
					}
					return n
				}

				function Cn(e, t, n) {
					return e.startState ? e.startState(t, n) : !0
				}

				function An(e) {
					return "string" == typeof e ? To[e] : e
				}

				function En(e, t, n) {
					function r(t) {
						t = An(t);
						var i = t[e];
						if (i === !1) return "stop";
						if (null != i && n(i)) return !0;
						if (t.nofallthrough) return "stop";
						var o = t.fallthrough;
						if (null == o) return !1;
						if ("[object Array]" != Object.prototype.toString.call(o)) return r(o);
						for (var a = 0, s = o.length; s > a; ++a) {
							var l = r(o[a]);
							if (l) return l
						}
						return !1
					}

					for (var i = 0; i < t.length; ++i) {
						var o = r(t[i]);
						if (o) return "stop" != o
					}
				}

				function Ln(e) {
					var t = Zo[e.keyCode];
					return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
				}

				function Tn(e, t) {
					if ($i && 34 == e.keyCode && e["char"]) return !1;
					var n = Zo[e.keyCode];
					return null == n || e.altGraphKey ? !1 : (e.altKey && (n = "Alt-" + n), (so ? e.metaKey : e.ctrlKey) && (n = "Ctrl-" + n), (so ? e.ctrlKey : e.metaKey) && (n = "Cmd-" + n), !t && e.shiftKey && (n = "Shift-" + n), n)
				}

				function Dn(e, t) {
					this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0
				}

				function Mn(e, t) {
					this.lines = [], this.type = t, this.doc = e
				}

				function Nn(e, t, n, r, i) {
					if (r && r.shared) return On(e, t, n, r, i);
					if (e.cm && !e.cm.curOp) return st(e.cm, Nn)(e, t, n, r, i);
					var o = new Mn(e, i);
					if (r && fi(r, o), Zt(n, t) || Jt(t, n) && o.clearWhenEmpty !== !1) return o;
					if (o.replacedWith && (o.collapsed = !0, o.replacedWith = vi("span", [o.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || (o.replacedWith.ignoreEvents = !0)), o.collapsed) {
						if (Xn(e, t.line, t, n, o) || t.line != n.line && Xn(e, n.line, t, n, o)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
						co = !0
					}
					o.addToHistory && Fr(e, {from: t, to: n, origin: "markText"}, {
						head: e.sel.head,
						anchor: e.sel.anchor
					}, 0 / 0);
					var a, s = t.line, l = e.cm;
					return e.iter(s, n.line + 1, function (r) {
						l && o.collapsed && !l.options.lineWrapping && Jn(e, r) == l.display.maxLine && (a = !0);
						var i = {from: null, to: null, marker: o};
						s == t.line && (i.from = t.ch), s == n.line && (i.to = n.ch), o.collapsed && s != t.line && Er(r, 0), jn(r, i), ++s
					}), o.collapsed && e.iter(t.line, n.line + 1, function (t) {
						Zn(e, t) && Er(t, 0)
					}), o.clearOnEnter && Xr(o, "beforeCursorEnter", function () {
						o.clear()
					}), o.readOnly && (uo = !0, (e.history.done.length || e.history.undone.length) && e.clearHistory()), o.collapsed && (o.id = ++Do, o.atomic = !0), l && (a && (l.curOp.updateMaxLine = !0), (o.className || o.title || o.startStyle || o.endStyle || o.collapsed) && ct(l, t.line, n.line + 1), o.atomic && un(l)), o
				}

				function Bn(e, t) {
					this.markers = e, this.primary = t;
					for (var n = 0, r = this; n < e.length; ++n) e[n].parent = this, Xr(e[n], "clear", function () {
						r.clear()
					})
				}

				function On(e, t, n, r, i) {
					r = fi(r), r.shared = !1;
					var o = [Nn(e, t, n, r, i)], a = o[0], s = r.replacedWith;
					return xr(e, function (e) {
						s && (r.replacedWith = s.cloneNode(!0)), o.push(Nn(e, nn(e, t), nn(e, n), r, i));
						for (var l = 0; l < e.linked.length; ++l) if (e.linked[l].isParent) return;
						a = si(o)
					}), new Bn(o, a)
				}

				function Fn(e, t) {
					if (e) for (var n = 0; n < e.length; ++n) {
						var r = e[n];
						if (r.marker == t) return r
					}
				}

				function Hn(e, t) {
					for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
					return n
				}

				function jn(e, t) {
					e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
				}

				function In(e, t, n) {
					if (e) for (var r, i = 0; i < e.length; ++i) {
						var o = e[i], a = o.marker, s = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
						if (s || o.from == t && "bookmark" == a.type && (!n || !o.marker.insertLeft)) {
							var l = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
							(r || (r = [])).push({from: o.from, to: l ? null : o.to, marker: a})
						}
					}
					return r
				}

				function zn(e, t, n) {
					if (e) for (var r, i = 0; i < e.length; ++i) {
						var o = e[i], a = o.marker, s = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
						if (s || o.from == t && "bookmark" == a.type && (!n || o.marker.insertLeft)) {
							var l = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
							(r || (r = [])).push({
								from: l ? null : o.from - t,
								to: null == o.to ? null : o.to - t,
								marker: a
							})
						}
					}
					return r
				}

				function Rn(e, t) {
					var n = on(e, t.from.line) && Sr(e, t.from.line).markedSpans,
						r = on(e, t.to.line) && Sr(e, t.to.line).markedSpans;
					if (!n && !r) return null;
					var i = t.from.ch, o = t.to.ch, a = Jt(t.from, t.to), s = In(n, i, a), l = zn(r, o, a),
						u = 1 == t.text.length, c = si(t.text).length + (u ? i : 0);
					if (s) for (var f = 0; f < s.length; ++f) {
						var d = s[f];
						if (null == d.to) {
							var h = Fn(l, d.marker);
							h ? u && (d.to = null == h.to ? null : h.to + c) : d.to = i
						}
					}
					if (l) for (var f = 0; f < l.length; ++f) {
						var d = l[f];
						if (null != d.to && (d.to += c), null == d.from) {
							var h = Fn(s, d.marker);
							h || (d.from = c, u && (s || (s = [])).push(d))
						} else d.from += c, u && (s || (s = [])).push(d)
					}
					s && (s = Wn(s)), l && l != s && (l = Wn(l));
					var p = [s];
					if (!u) {
						var m, g = t.text.length - 2;
						if (g > 0 && s) for (var f = 0; f < s.length; ++f) null == s[f].to && (m || (m = [])).push({
							from: null,
							to: null,
							marker: s[f].marker
						});
						for (var f = 0; g > f; ++f) p.push(m);
						p.push(l)
					}
					return p
				}

				function Wn(e) {
					for (var t = 0; t < e.length; ++t) {
						var n = e[t];
						null != n.from && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
					}
					return e.length ? e : null
				}

				function Pn(e, t) {
					var n = jr(e, t), r = Rn(e, t);
					if (!n) return r;
					if (!r) return n;
					for (var i = 0; i < n.length; ++i) {
						var o = n[i], a = r[i];
						if (o && a) e:for (var s = 0; s < a.length; ++s) {
							for (var l = a[s], u = 0; u < o.length; ++u) if (o[u].marker == l.marker) continue e;
							o.push(l)
						} else a && (n[i] = a)
					}
					return n
				}

				function qn(e, t, n) {
					var r = null;
					if (e.iter(t.line, n.line + 1, function (e) {
							if (e.markedSpans) for (var t = 0; t < e.markedSpans.length; ++t) {
								var n = e.markedSpans[t].marker;
								!n.readOnly || r && -1 != ui(r, n) || (r || (r = [])).push(n)
							}
						}), !r) return null;
					for (var i = [{
						from: t,
						to: n
					}], o = 0; o < r.length; ++o) for (var a = r[o], s = a.find(), l = 0; l < i.length; ++l) {
						var u = i[l];
						if (!Zt(u.to, s.from) && !Zt(s.to, u.from)) {
							var c = [l, 1];
							(Zt(u.from, s.from) || !a.inclusiveLeft && Jt(u.from, s.from)) && c.push({
								from: u.from,
								to: s.from
							}), (Zt(s.to, u.to) || !a.inclusiveRight && Jt(u.to, s.to)) && c.push({
								from: s.to,
								to: u.to
							}), i.splice.apply(i, c), l += c.length - 1
						}
					}
					return i
				}

				function Un(e) {
					return e.inclusiveLeft ? -1 : 0
				}

				function Vn(e) {
					return e.inclusiveRight ? 1 : 0
				}

				function Gn(e, t) {
					var n = e.lines.length - t.lines.length;
					if (0 != n) return n;
					var r = e.find(), i = t.find(), o = Qt(r.from, i.from) || Un(e) - Un(t);
					if (o) return -o;
					var a = Qt(r.to, i.to) || Vn(e) - Vn(t);
					return a ? a : t.id - e.id
				}

				function $n(e, t) {
					var n, r = co && e.markedSpans;
					if (r) for (var i, o = 0; o < r.length; ++o) i = r[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!n || Gn(n, i.marker) < 0) && (n = i.marker);
					return n
				}

				function Kn(e) {
					return $n(e, !0)
				}

				function Yn(e) {
					return $n(e, !1)
				}

				function Xn(e, t, n, r, i) {
					var o = Sr(e, t), a = co && o.markedSpans;
					if (a) for (var s = 0; s < a.length; ++s) {
						var l = a[s];
						if (l.marker.collapsed) {
							var u = l.marker.find(!0), c = Qt(u.from, n) || Un(l.marker) - Un(i),
								f = Qt(u.to, r) || Vn(l.marker) - Vn(i);
							if (!(c >= 0 && 0 >= f || 0 >= c && f >= 0) && (0 >= c && (Qt(u.to, n) || Vn(l.marker) - Un(i)) > 0 || c >= 0 && (Qt(u.from, r) || Un(l.marker) - Vn(i)) < 0)) return !0
						}
					}
				}

				function Jn(e, t) {
					for (var n; n = Kn(t);) t = Sr(e, n.find().from.line);
					return t
				}

				function Zn(e, t) {
					var n = co && t.markedSpans;
					if (n) for (var r, i = 0; i < n.length; ++i) if (r = n[i], r.marker.collapsed) {
						if (null == r.from) return !0;
						if (!r.marker.replacedWith && 0 == r.from && r.marker.inclusiveLeft && Qn(e, t, r)) return !0
					}
				}

				function Qn(e, t, n) {
					if (null == n.to) {
						var r = n.marker.find().to, i = Sr(e, r.line);
						return Qn(e, i, Fn(i.markedSpans, n.marker))
					}
					if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
					for (var o, a = 0; a < t.markedSpans.length; ++a) if (o = t.markedSpans[a], o.marker.collapsed && !o.marker.replacedWith && o.from == n.to && (null == o.to || o.to != n.from) && (o.marker.inclusiveLeft || n.marker.inclusiveRight) && Qn(e, t, o)) return !0
				}

				function er(e) {
					var t = e.markedSpans;
					if (t) {
						for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
						e.markedSpans = null
					}
				}

				function tr(e, t) {
					if (t) {
						for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
						e.markedSpans = t
					}
				}

				function nr(e) {
					return function () {
						var t = !this.cm.curOp;
						t && ot(this.cm);
						try {
							var n = e.apply(this, arguments)
						} finally {
							t && at(this.cm)
						}
						return n
					}
				}

				function rr(e) {
					return null != e.height ? e.height : (e.node.parentNode && 1 == e.node.parentNode.nodeType || yi(e.cm.display.measure, vi("div", [e.node], null, "position: relative")), e.height = e.node.offsetHeight)
				}

				function ir(e, t, n, r) {
					var i = new Mo(e, n, r);
					return i.noHScroll && (e.display.alignWidgets = !0), bn(e, t, function (t) {
						var n = t.widgets || (t.widgets = []);
						if (null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, !Zn(e.doc, t) || i.showIfHidden) {
							var r = Dr(e, t) < e.doc.scrollTop;
							Er(t, t.height + rr(i)), r && gn(e, 0, i.height), e.curOp.forceUpdate = !0
						}
						return !0
					}), i
				}

				function or(e, t, n, r) {
					e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), er(e), tr(e, n);
					var i = r ? r(e) : 1;
					i != e.height && Er(e, i)
				}

				function ar(e) {
					e.parent = null, er(e)
				}

				function sr(t, n, r, i, o, a) {
					var s = r.flattenSpans;
					null == s && (s = t.options.flattenSpans);
					var l, u = 0, c = null, f = new Dn(n, t.options.tabSize);
					for ("" == n && r.blankLine && r.blankLine(i); !f.eol();) {
						if (f.pos > t.options.maxHighlightLength ? (s = !1, a && cr(t, n, i, f.pos), f.pos = n.length, l = null) : l = r.token(f, i), t.options.addModeClass) {
							var d = e.innerMode(r, i).mode.name;
							d && (l = "m-" + (l ? d + " " + l : d))
						}
						s && c == l || (u < f.start && o(f.start, c), u = f.start, c = l), f.start = f.pos
					}
					for (; u < f.pos;) {
						var h = Math.min(f.pos, u + 5e4);
						o(h, c), u = h
					}
				}

				function lr(e, t, n, r) {
					var i = [e.state.modeGen];
					sr(e, t.text, e.doc.mode, n, function (e, t) {
						i.push(e, t)
					}, r);
					for (var o = 0; o < e.state.overlays.length; ++o) {
						var a = e.state.overlays[o], s = 1, l = 0;
						sr(e, t.text, a.mode, !0, function (e, t) {
							for (var n = s; e > l;) {
								var r = i[s];
								r > e && i.splice(s, 1, e, i[s + 1], r), s += 2, l = Math.min(e, r)
							}
							if (t) if (a.opaque) i.splice(n, s - n, e, t), s = n + 2; else for (; s > n; n += 2) {
								var o = i[n + 1];
								i[n + 1] = o ? o + " " + t : t
							}
						})
					}
					return i
				}

				function ur(e, t) {
					return t.styles && t.styles[0] == e.state.modeGen || (t.styles = lr(e, t, t.stateAfter = H(e, Lr(t)))), t.styles
				}

				function cr(e, t, n, r) {
					var i = e.doc.mode, o = new Dn(t, e.options.tabSize);
					for (o.start = o.pos = r || 0, "" == t && i.blankLine && i.blankLine(n); !o.eol() && o.pos <= e.options.maxHighlightLength;) i.token(o, n), o.start = o.pos
				}

				function fr(e, t) {
					if (!e) return null;
					for (; ;) {
						var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
						if (!n) break;
						e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
						var r = n[1] ? "bgClass" : "textClass";
						null == t[r] ? t[r] = n[2] : new RegExp("(?:^|s)" + n[2] + "(?:$|s)").test(t[r]) || (t[r] += " " + n[2])
					}
					if (/^\s*$/.test(e)) return null;
					var i = t.cm.options.addModeClass ? Oo : Bo;
					return i[e] || (i[e] = e.replace(/\S+/g, "cm-$&"))
				}

				function dr(e, t, n, r) {
					for (var i, o = t, a = !0; i = Kn(o);) o = Sr(e.doc, i.find().from.line);
					var s = {pre: vi("pre"), col: 0, pos: 0, measure: null, measuredSomething: !1, cm: e, copyWidgets: r};
					do {
						o.text && (a = !1), s.measure = o == t && n, s.pos = 0, s.addToken = s.measure ? mr : pr, (qi || Ui) && e.getOption("lineWrapping") && (s.addToken = gr(s.addToken));
						var l = br(o, s, ur(e, o));
						n && o == t && !s.measuredSomething && (n[0] = s.pre.appendChild(Si(e.display.measure)), s.measuredSomething = !0), l && (o = Sr(e.doc, l.to.line))
					} while (l);
					!n || s.measuredSomething || n[0] || (n[0] = s.pre.appendChild(a ? vi("span", " ") : Si(e.display.measure))), s.pre.firstChild || Zn(e.doc, t) || s.pre.appendChild(document.createTextNode(" "));
					var u;
					if (n && qi && (u = Mr(o))) {
						var c = u.length - 1;
						u[c].from == u[c].to && --c;
						var f = u[c], d = u[c - 1];
						if (f.from + 1 == f.to && d && f.level < d.level) {
							var h = n[s.pos - 1];
							h && h.parentNode.insertBefore(h.measureRight = Si(e.display.measure), h.nextSibling)
						}
					}
					var p = s.textClass ? s.textClass + " " + (t.textClass || "") : t.textClass;
					return p && (s.pre.className = p), Zr(e, "renderLine", e, t, s.pre), s
				}

				function hr(e) {
					var t = vi("span", "•", "cm-invalidchar");
					return t.title = "\\u" + e.charCodeAt(0).toString(16), t
				}

				function pr(e, t, n, r, i, o) {
					if (t) {
						var a = e.cm.options.specialChars;
						if (a.test(t)) for (var s = document.createDocumentFragment(), l = 0; ;) {
							a.lastIndex = l;
							var u = a.exec(t), c = u ? u.index - l : t.length - l;
							if (c && (s.appendChild(document.createTextNode(t.slice(l, l + c))), e.col += c), !u) break;
							if (l += c + 1, "	" == u[0]) {
								var f = e.cm.options.tabSize, d = f - e.col % f;
								s.appendChild(vi("span", ai(d), "cm-tab")), e.col += d
							} else {
								var h = e.cm.options.specialCharPlaceholder(u[0]);
								s.appendChild(h), e.col += 1
							}
						} else {
							e.col += t.length;
							var s = document.createTextNode(t)
						}
						if (n || r || i || e.measure) {
							var p = n || "";
							r && (p += r), i && (p += i);
							var h = vi("span", [s], p);
							return o && (h.title = o), e.pre.appendChild(h)
						}
						e.pre.appendChild(s)
					}
				}

				function mr(e, t, n, r, i) {
					for (var o = e.cm.options.lineWrapping, a = 0; a < t.length; ++a) {
						for (var s = 0 == a, l = a + 1; l < t.length && gi(t.charAt(l));) ++l;
						var u = t.slice(a, l);
						a = l - 1, a && o && xi(t, a) && e.pre.appendChild(vi("wbr"));
						var c = e.measure[e.pos], f = e.measure[e.pos] = pr(e, u, n, s && r, a == t.length - 1 && i);
						c && (f.leftSide = c.leftSide || c), Ii && o && " " == u && a && !/\s/.test(t.charAt(a - 1)) && a < t.length - 1 && !/\s/.test(t.charAt(a + 1)) && (f.style.whiteSpace = "normal"), e.pos += u.length
					}
					t.length && (e.measuredSomething = !0)
				}

				function gr(e) {
					function t(e) {
						for (var t = " ", n = 0; n < e.length - 2; ++n) t += n % 2 ? " " : " ";
						return t += " "
					}

					return function (n, r, i, o, a, s) {
						return e(n, r.replace(/ {3,}/g, t), i, o, a, s)
					}
				}

				function vr(e, t, n, r) {
					var i = !r && n.replacedWith;
					if (i && (e.copyWidgets && (i = i.cloneNode(!0)), e.pre.appendChild(i), e.measure)) {
						if (t) e.measure[e.pos] = i; else {
							var o = Si(e.cm.display.measure);
							if ("bookmark" != n.type || n.insertLeft) {
								if (e.measure[e.pos]) return;
								e.measure[e.pos] = e.pre.insertBefore(o, i)
							} else e.measure[e.pos] = e.pre.appendChild(o)
						}
						e.measuredSomething = !0
					}
					e.pos += t
				}

				function br(e, t, n) {
					var r = e.markedSpans, i = e.text, o = 0;
					if (r) for (var a, s, l, u, c, f, d = i.length, h = 0, p = 1, m = "", g = 0; ;) {
						if (g == h) {
							s = l = u = c = "", f = null, g = 1 / 0;
							for (var v = [], b = 0; b < r.length; ++b) {
								var y = r[b], w = y.marker;
								y.from <= h && (null == y.to || y.to > h) ? (null != y.to && g > y.to && (g = y.to, l = ""), w.className && (s += " " + w.className), w.startStyle && y.from == h && (u += " " + w.startStyle), w.endStyle && y.to == g && (l += " " + w.endStyle), w.title && !c && (c = w.title), w.collapsed && (!f || Gn(f.marker, w) < 0) && (f = y)) : y.from > h && g > y.from && (g = y.from), "bookmark" == w.type && y.from == h && w.replacedWith && v.push(w)
							}
							if (f && (f.from || 0) == h && (vr(t, (null == f.to ? d : f.to) - h, f.marker, null == f.from), null == f.to)) return f.marker.find();
							if (!f && v.length) for (var b = 0; b < v.length; ++b) vr(t, 0, v[b])
						}
						if (h >= d) break;
						for (var _ = Math.min(d, g); ;) {
							if (m) {
								var x = h + m.length;
								if (!f) {
									var k = x > _ ? m.slice(0, _ - h) : m;
									t.addToken(t, k, a ? a + s : s, u, h + k.length == g ? l : "", c)
								}
								if (x >= _) {
									m = m.slice(_ - h), h = _;
									break
								}
								h = x, u = ""
							}
							m = i.slice(o, o = n[p++]), a = fr(n[p++], t)
						}
					} else for (var p = 1; p < n.length; p += 2) t.addToken(t, i.slice(o, o = n[p]), fr(n[p + 1], t))
				}

				function yr(e, t, n, r, i) {
					function o(e) {
						return n ? n[e] : null
					}

					function a(e, n, r) {
						or(e, n, r, i), Qr(e, "change", e, t)
					}

					var s = t.from, l = t.to, u = t.text, c = Sr(e, s.line), f = Sr(e, l.line), d = si(u),
						h = o(u.length - 1), p = l.line - s.line;
					if (0 != s.ch || 0 != l.ch || "" != d || e.cm && !e.cm.options.wholeLineUpdateBefore) if (c == f) if (1 == u.length) a(c, c.text.slice(0, s.ch) + d + c.text.slice(l.ch), h); else {
						for (var m = [], g = 1, v = u.length - 1; v > g; ++g) m.push(new No(u[g], o(g), i));
						m.push(new No(d + c.text.slice(l.ch), h, i)), a(c, c.text.slice(0, s.ch) + u[0], o(0)), e.insert(s.line + 1, m)
					} else if (1 == u.length) a(c, c.text.slice(0, s.ch) + u[0] + f.text.slice(l.ch), o(0)), e.remove(s.line + 1, p); else {
						a(c, c.text.slice(0, s.ch) + u[0], o(0)), a(f, d + f.text.slice(l.ch), h);
						for (var g = 1, v = u.length - 1, m = []; v > g; ++g) m.push(new No(u[g], o(g), i));
						p > 1 && e.remove(s.line + 1, p - 1), e.insert(s.line + 1, m)
					} else {
						for (var g = 0, v = u.length - 1, m = []; v > g; ++g) m.push(new No(u[g], o(g), i));
						a(f, f.text, h), p && e.remove(s.line, p), m.length && e.insert(s.line, m)
					}
					Qr(e, "change", e, t), ln(e, r.anchor, r.head, null, !0)
				}

				function wr(e) {
					this.lines = e, this.parent = null;
					for (var t = 0, n = e.length, r = 0; n > t; ++t) e[t].parent = this, r += e[t].height;
					this.height = r
				}

				function _r(e) {
					this.children = e;
					for (var t = 0, n = 0, r = 0, i = e.length; i > r; ++r) {
						var o = e[r];
						t += o.chunkSize(), n += o.height, o.parent = this
					}
					this.size = t, this.height = n, this.parent = null
				}

				function xr(e, t, n) {
					function r(e, i, o) {
						if (e.linked) for (var a = 0; a < e.linked.length; ++a) {
							var s = e.linked[a];
							if (s.doc != i) {
								var l = o && s.sharedHist;
								(!n || l) && (t(s.doc, l), r(s.doc, e, l))
							}
						}
					}

					r(e, null, !0)
				}

				function kr(e, t) {
					if (t.cm) throw new Error("This document is already in use.");
					e.doc = t, t.cm = e, a(e), n(e), e.options.lineWrapping || d(e), e.options.mode = t.modeOption, ct(e)
				}

				function Sr(e, t) {
					for (t -= e.first; !e.lines;) for (var n = 0; ; ++n) {
						var r = e.children[n], i = r.chunkSize();
						if (i > t) {
							e = r;
							break
						}
						t -= i
					}
					return e.lines[t]
				}

				function Cr(e, t, n) {
					var r = [], i = t.line;
					return e.iter(t.line, n.line + 1, function (e) {
						var o = e.text;
						i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i
					}), r
				}

				function Ar(e, t, n) {
					var r = [];
					return e.iter(t, n, function (e) {
						r.push(e.text)
					}), r
				}

				function Er(e, t) {
					for (var n = t - e.height, r = e; r; r = r.parent) r.height += n
				}

				function Lr(e) {
					if (null == e.parent) return null;
					for (var t = e.parent, n = ui(t.lines, e), r = t.parent; r; t = r, r = r.parent) for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
					return n + t.first
				}

				function Tr(e, t) {
					var n = e.first;
					e:do {
						for (var r = 0, i = e.children.length; i > r; ++r) {
							var o = e.children[r], a = o.height;
							if (a > t) {
								e = o;
								continue e
							}
							t -= a, n += o.chunkSize()
						}
						return n
					} while (!e.lines);
					for (var r = 0, i = e.lines.length; i > r; ++r) {
						var s = e.lines[r], l = s.height;
						if (l > t) break;
						t -= l
					}
					return n + r
				}

				function Dr(e, t) {
					t = Jn(e.doc, t);
					for (var n = 0, r = t.parent, i = 0; i < r.lines.length; ++i) {
						var o = r.lines[i];
						if (o == t) break;
						n += o.height
					}
					for (var a = r.parent; a; r = a, a = r.parent) for (var i = 0; i < a.children.length; ++i) {
						var s = a.children[i];
						if (s == r) break;
						n += s.height
					}
					return n
				}

				function Mr(e) {
					var t = e.order;
					return null == t && (t = e.order = ea(e.text)), t
				}

				function Nr(e) {
					return {
						done: [],
						undone: [],
						undoDepth: 1 / 0,
						lastTime: 0,
						lastOp: null,
						lastOrigin: null,
						generation: e || 1,
						maxGeneration: e || 1
					}
				}

				function Br(e, t, n, r) {
					var i = t["spans_" + e.id], o = 0;
					e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function (n) {
						n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o
					})
				}

				function Or(e, t) {
					var n = {line: t.from.line, ch: t.from.ch}, r = {from: n, to: yo(t), text: Cr(e, t.from, t.to)};
					return Br(e, r, t.from.line, t.to.line + 1), xr(e, function (e) {
						Br(e, r, t.from.line, t.to.line + 1)
					}, !0), r
				}

				function Fr(e, t, n, r) {
					var i = e.history;
					i.undone.length = 0;
					var o = +new Date, a = si(i.done);
					if (a && (i.lastOp == r || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastTime > o - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0)))) {
						var s = si(a.changes);
						Jt(t.from, t.to) && Jt(t.from, s.to) ? s.to = yo(t) : a.changes.push(Or(e, t)), a.anchorAfter = n.anchor, a.headAfter = n.head
					} else for (a = {
						changes: [Or(e, t)],
						generation: i.generation,
						anchorBefore: e.sel.anchor,
						headBefore: e.sel.head,
						anchorAfter: n.anchor,
						headAfter: n.head
					}, i.done.push(a); i.done.length > i.undoDepth;) i.done.shift();
					i.generation = ++i.maxGeneration, i.lastTime = o, i.lastOp = r, i.lastOrigin = t.origin, s || Zr(e, "historyAdded")
				}

				function Hr(e) {
					if (!e) return null;
					for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
					return t ? t.length ? t : null : e
				}

				function jr(e, t) {
					var n = t["spans_" + e.id];
					if (!n) return null;
					for (var r = 0, i = []; r < t.text.length; ++r) i.push(Hr(n[r]));
					return i
				}

				function Ir(e, t) {
					for (var n = 0, r = []; n < e.length; ++n) {
						var i = e[n], o = i.changes, a = [];
						r.push({
							changes: a,
							anchorBefore: i.anchorBefore,
							headBefore: i.headBefore,
							anchorAfter: i.anchorAfter,
							headAfter: i.headAfter
						});
						for (var s = 0; s < o.length; ++s) {
							var l, u = o[s];
							if (a.push({
									from: u.from,
									to: u.to,
									text: u.text
								}), t) for (var c in u) (l = c.match(/^spans_(\d+)$/)) && ui(t, Number(l[1])) > -1 && (si(a)[c] = u[c], delete u[c])
						}
					}
					return r
				}

				function zr(e, t, n, r) {
					n < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0)
				}

				function Rr(e, t, n, r) {
					for (var i = 0; i < e.length; ++i) {
						for (var o = e[i], a = !0, s = 0; s < o.changes.length; ++s) {
							var l = o.changes[s];
							if (o.copied || (l.from = en(l.from), l.to = en(l.to)), n < l.from.line) l.from.line += r, l.to.line += r; else if (t <= l.to.line) {
								a = !1;
								break
							}
						}
						o.copied || (o.anchorBefore = en(o.anchorBefore), o.headBefore = en(o.headBefore), o.anchorAfter = en(o.anchorAfter), o.readAfter = en(o.headAfter), o.copied = !0), a ? (zr(o.anchorBefore), zr(o.headBefore), zr(o.anchorAfter), zr(o.headAfter)) : (e.splice(0, i + 1), i = 0)
					}
				}

				function Wr(e, t) {
					var n = t.from.line, r = t.to.line, i = t.text.length - (r - n) - 1;
					Rr(e.done, n, r, i), Rr(e.undone, n, r, i)
				}

				function Pr() {
					$r(this)
				}

				function qr(e) {
					return e.stop || (e.stop = Pr), e
				}

				function Ur(e) {
					e.preventDefault ? e.preventDefault() : e.returnValue = !1
				}

				function Vr(e) {
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
				}

				function Gr(e) {
					return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
				}

				function $r(e) {
					Ur(e), Vr(e)
				}

				function Kr(e) {
					return e.target || e.srcElement
				}

				function Yr(e) {
					var t = e.which;
					return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), to && e.ctrlKey && 1 == t && (t = 3), t
				}

				function Xr(e, t, n) {
					if (e.addEventListener) e.addEventListener(t, n, !1); else if (e.attachEvent) e.attachEvent("on" + t, n); else {
						var r = e._handlers || (e._handlers = {}), i = r[t] || (r[t] = []);
						i.push(n)
					}
				}

				function Jr(e, t, n) {
					if (e.removeEventListener) e.removeEventListener(t, n, !1); else if (e.detachEvent) e.detachEvent("on" + t, n); else {
						var r = e._handlers && e._handlers[t];
						if (!r) return;
						for (var i = 0; i < r.length; ++i) if (r[i] == n) {
							r.splice(i, 1);
							break
						}
					}
				}

				function Zr(e, t) {
					var n = e._handlers && e._handlers[t];
					if (n) for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
				}

				function Qr(e, t) {
					function n(e) {
						return function () {
							e.apply(null, i)
						}
					}

					var r = e._handlers && e._handlers[t];
					if (r) {
						var i = Array.prototype.slice.call(arguments, 2);
						zo || (++Ro, zo = [], setTimeout(ti, 0));
						for (var o = 0; o < r.length; ++o) zo.push(n(r[o]))
					}
				}

				function ei(e, t, n) {
					return Zr(e, n || t.type, e, t), Gr(t) || t.codemirrorIgnore
				}

				function ti() {
					--Ro;
					var e = zo;
					zo = null;
					for (var t = 0; t < e.length; ++t) e[t]()
				}

				function ni(e, t) {
					var n = e._handlers && e._handlers[t];
					return n && n.length > 0
				}

				function ri(e) {
					e.prototype.on = function (e, t) {
						Xr(this, e, t)
					}, e.prototype.off = function (e, t) {
						Jr(this, e, t)
					}
				}

				function ii() {
					this.id = null
				}

				function oi(e, t, n, r, i) {
					null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
					for (var o = r || 0, a = i || 0; t > o; ++o) "	" == e.charAt(o) ? a += n - a % n : ++a;
					return a
				}

				function ai(e) {
					for (; qo.length <= e;) qo.push(si(qo) + " ");
					return qo[e]
				}

				function si(e) {
					return e[e.length - 1]
				}

				function li(e) {
					if (Qi) e.selectionStart = 0, e.selectionEnd = e.value.length; else try {
						e.select()
					} catch (t) {
					}
				}

				function ui(e, t) {
					if (e.indexOf) return e.indexOf(t);
					for (var n = 0, r = e.length; r > n; ++n) if (e[n] == t) return n;
					return -1
				}

				function ci(e, t) {
					function n() {
					}

					n.prototype = e;
					var r = new n;
					return t && fi(t, r), r
				}

				function fi(e, t) {
					t || (t = {});
					for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
					return t
				}

				function di(e) {
					for (var t = [], n = 0; e > n; ++n) t.push(void 0);
					return t
				}

				function hi(e) {
					var t = Array.prototype.slice.call(arguments, 1);
					return function () {
						return e.apply(null, t)
					}
				}

				function pi(e) {
					return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Uo.test(e))
				}

				function mi(e) {
					for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1;
					return !0
				}

				function gi(e) {
					return e.charCodeAt(0) >= 768 && Vo.test(e)
				}

				function vi(e, t, n, r) {
					var i = document.createElement(e);
					if (n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t) wi(i, t); else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
					return i
				}

				function bi(e) {
					for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
					return e
				}

				function yi(e, t) {
					return bi(e).appendChild(t)
				}

				function wi(e, t) {
					Ri ? (e.innerHTML = "", e.appendChild(document.createTextNode(t))) : e.textContent = t
				}

				function _i(e) {
					return e.getBoundingClientRect()
				}

				function xi() {
					return !1
				}

				function ki(e) {
					if (null != $o) return $o;
					var t = vi("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
					return yi(e, t), t.offsetWidth && ($o = t.offsetHeight - t.clientHeight), $o || 0
				}

				function Si(e) {
					if (null == Ko) {
						var t = vi("span", "​");
						yi(e, vi("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (Ko = t.offsetWidth <= 1 && t.offsetHeight > 2 && !zi)
					}
					return Ko ? vi("span", "​") : vi("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px")
				}

				function Ci(e, t, n, r) {
					if (!e) return r(t, n, "ltr");
					for (var i = !1, o = 0; o < e.length; ++o) {
						var a = e[o];
						(a.from < n && a.to > t || t == n && a.to == t) && (r(Math.max(a.from, t), Math.min(a.to, n), 1 == a.level ? "rtl" : "ltr"), i = !0)
					}
					i || r(t, n, "ltr")
				}

				function Ai(e) {
					return e.level % 2 ? e.to : e.from
				}

				function Ei(e) {
					return e.level % 2 ? e.from : e.to
				}

				function Li(e) {
					var t = Mr(e);
					return t ? Ai(t[0]) : 0
				}

				function Ti(e) {
					var t = Mr(e);
					return t ? Ei(si(t)) : e.text.length
				}

				function Di(e, t) {
					var n = Sr(e.doc, t), r = Jn(e.doc, n);
					r != n && (t = Lr(r));
					var i = Mr(r), o = i ? i[0].level % 2 ? Ti(r) : Li(r) : 0;
					return Xt(t, o)
				}

				function Mi(e, t) {
					for (var n, r; n = Yn(r = Sr(e.doc, t));) t = n.find().to.line;
					var i = Mr(r), o = i ? i[0].level % 2 ? Li(r) : Ti(r) : r.text.length;
					return Xt(t, o)
				}

				function Ni(e, t, n) {
					var r = e[0].level;
					return t == r ? !0 : n == r ? !1 : n > t
				}

				function Bi(e, t) {
					Qo = null;
					for (var n, r = 0; r < e.length; ++r) {
						var i = e[r];
						if (i.from < t && i.to > t) return r;
						if (i.from == t || i.to == t) {
							if (null != n) return Ni(e, i.level, e[n].level) ? (i.from != i.to && (Qo = n), r) : (i.from != i.to && (Qo = r), n);
							n = r
						}
					}
					return n
				}

				function Oi(e, t, n, r) {
					if (!r) return t + n;
					do t += n; while (t > 0 && gi(e.text.charAt(t)));
					return t
				}

				function Fi(e, t, n, r) {
					var i = Mr(e);
					if (!i) return Hi(e, t, n, r);
					for (var o = Bi(i, t), a = i[o], s = Oi(e, t, a.level % 2 ? -n : n, r); ;) {
						if (s > a.from && s < a.to) return s;
						if (s == a.from || s == a.to) return Bi(i, s) == o ? s : (a = i[o += n], n > 0 == a.level % 2 ? a.to : a.from);
						if (a = i[o += n], !a) return null;
						s = n > 0 == a.level % 2 ? Oi(e, a.to, -1, r) : Oi(e, a.from, 1, r)
					}
				}

				function Hi(e, t, n, r) {
					var i = t + n;
					if (r) for (; i > 0 && gi(e.text.charAt(i));) i += n;
					return 0 > i || i > e.text.length ? null : i
				}

				var ji = /gecko\/\d/i.test(navigator.userAgent), Ii = /MSIE \d/.test(navigator.userAgent),
					zi = Ii && (null == document.documentMode || document.documentMode < 8),
					Ri = Ii && (null == document.documentMode || document.documentMode < 9),
					Wi = Ii && (null == document.documentMode || document.documentMode < 10),
					Pi = /Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent), qi = Ii || Pi,
					Ui = /WebKit\//.test(navigator.userAgent), Vi = Ui && /Qt\/\d+\.\d+/.test(navigator.userAgent),
					Gi = /Chrome\//.test(navigator.userAgent), $i = /Opera\//.test(navigator.userAgent),
					Ki = /Apple Computer/.test(navigator.vendor), Yi = /KHTML\//.test(navigator.userAgent),
					Xi = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),
					Ji = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),
					Zi = /PhantomJS/.test(navigator.userAgent),
					Qi = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
					eo = Qi || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
					to = Qi || /Mac/.test(navigator.platform), no = /win/i.test(navigator.platform),
					ro = $i && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
				ro && (ro = Number(ro[1])), ro && ro >= 15 && ($i = !1, Ui = !0);
				var io, oo, ao, so = to && (Vi || $i && (null == ro || 12.11 > ro)), lo = ji || qi && !Ri, uo = !1, co = !1,
					fo = 0, ho = 0, po = 0, mo = null;
				qi ? mo = -.53 : ji ? mo = 15 : Gi ? mo = -.7 : Ki && (mo = -1 / 3);
				var go, vo, bo = null, yo = e.changeEnd = function (e) {
					return e.text ? Xt(e.from.line + e.text.length - 1, si(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
				};
				e.Pos = Xt, e.prototype = {
					constructor: e,
					focus: function () {
						window.focus(), mt(this), dt(this)
					},
					setOption: function (e, t) {
						var n = this.options, r = n[e];
						(n[e] != t || "mode" == e) && (n[e] = t, wo.hasOwnProperty(e) && st(this, wo[e])(this, t, r))
					},
					getOption: function (e) {
						return this.options[e]
					},
					getDoc: function () {
						return this.doc
					},
					addKeyMap: function (e, t) {
						this.state.keyMaps[t ? "push" : "unshift"](e)
					},
					removeKeyMap: function (e) {
						for (var t = this.state.keyMaps, n = 0; n < t.length; ++n) if (t[n] == e || "string" != typeof t[n] && t[n].name == e) return t.splice(n, 1), !0
					},
					addOverlay: st(null, function (t, n) {
						var r = t.token ? t : e.getMode(this.options, t);
						if (r.startState) throw new Error("Overlays may not be stateful.");
						this.state.overlays.push({
							mode: r,
							modeSpec: t,
							opaque: n && n.opaque
						}), this.state.modeGen++, ct(this)
					}),
					removeOverlay: st(null, function (e) {
						for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
							var r = t[n].modeSpec;
							if (r == e || "string" == typeof e && r.name == e) return t.splice(n, 1), this.state.modeGen++, ct(this), void 0
						}
					}),
					indentLine: st(null, function (e, t, n) {
						"string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), on(this.doc, e) && vn(this, e, t, n)
					}),
					indentSelection: st(null, function (e) {
						var t = this.doc.sel;
						if (Jt(t.from, t.to)) return vn(this, t.from.line, e, !0);
						for (var n = t.to.line - (t.to.ch ? 0 : 1), r = t.from.line; n >= r; ++r) vn(this, r, e)
					}),
					getTokenAt: function (e, t) {
						var n = this.doc;
						e = nn(n, e);
						for (var r = H(this, e.line, t), i = this.doc.mode, o = Sr(n, e.line), a = new Dn(o.text, this.options.tabSize); a.pos < e.ch && !a.eol();) {
							a.start = a.pos;
							var s = i.token(a, r)
						}
						return {
							start: a.start,
							end: a.pos,
							string: a.current(),
							className: s || null,
							type: s || null,
							state: r
						}
					},
					getTokenTypeAt: function (e) {
						e = nn(this.doc, e);
						var t = ur(this, Sr(this.doc, e.line)), n = 0, r = (t.length - 1) / 2, i = e.ch;
						if (0 == i) return t[2];
						for (; ;) {
							var o = n + r >> 1;
							if ((o ? t[2 * o - 1] : 0) >= i) r = o; else {
								if (!(t[2 * o + 1] < i)) return t[2 * o + 2];
								n = o + 1
							}
						}
					},
					getModeAt: function (t) {
						var n = this.doc.mode;
						return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n
					},
					getHelper: function (e, t) {
						return this.getHelpers(e, t)[0]
					},
					getHelpers: function (e, t) {
						var n = [];
						if (!Eo.hasOwnProperty(t)) return Eo;
						var r = Eo[t], i = this.getModeAt(e);
						if ("string" == typeof i[t]) r[i[t]] && n.push(r[i[t]]); else if (i[t]) for (var o = 0; o < i[t].length; o++) {
							var a = r[i[t][o]];
							a && n.push(a)
						} else i.helperType && r[i.helperType] ? n.push(r[i.helperType]) : r[i.name] && n.push(r[i.name]);
						for (var o = 0; o < r._global.length; o++) {
							var s = r._global[o];
							s.pred(i, this) && -1 == ui(n, s.val) && n.push(s.val)
						}
						return n
					},
					getStateAfter: function (e, t) {
						var n = this.doc;
						return e = tn(n, null == e ? n.first + n.size - 1 : e), H(this, e + 1, t)
					},
					cursorCoords: function (e, t) {
						var n, r = this.doc.sel;
						return n = null == e ? r.head : "object" == typeof e ? nn(this.doc, e) : e ? r.from : r.to, Q(this, n, t || "page")
					},
					charCoords: function (e, t) {
						return Z(this, nn(this.doc, e), t || "page")
					},
					coordsChar: function (e, t) {
						return e = J(this, e, t || "page"), tt(this, e.left, e.top)
					},
					lineAtHeight: function (e, t) {
						return e = J(this, {top: e, left: 0}, t || "page").top, Tr(this.doc, e + this.display.viewOffset)
					},
					heightAtLine: function (e, t) {
						var n = !1, r = this.doc.first + this.doc.size - 1;
						e < this.doc.first ? e = this.doc.first : e > r && (e = r, n = !0);
						var i = Sr(this.doc, e);
						return X(this, Sr(this.doc, e), {top: 0, left: 0}, t || "page").top + (n ? i.height : 0)
					},
					defaultTextHeight: function () {
						return rt(this.display)
					},
					defaultCharWidth: function () {
						return it(this.display)
					},
					setGutterMarker: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = e.gutterMarkers || (e.gutterMarkers = {});
							return r[t] = n, !n && mi(r) && (e.gutterMarkers = null), !0
						})
					}),
					clearGutter: st(null, function (e) {
						var t = this, n = t.doc, r = n.first;
						n.iter(function (n) {
							n.gutterMarkers && n.gutterMarkers[e] && (n.gutterMarkers[e] = null, ct(t, r, r + 1), mi(n.gutterMarkers) && (n.gutterMarkers = null)), ++r
						})
					}),
					addLineClass: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "wrapClass";
							if (e[r]) {
								if (new RegExp("(?:^|\\s)" + n + "(?:$|\\s)").test(e[r])) return !1;
								e[r] += " " + n
							} else e[r] = n;
							return !0
						})
					}),
					removeLineClass: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "wrapClass", i = e[r];
							if (!i) return !1;
							if (null == n) e[r] = null; else {
								var o = i.match(new RegExp("(?:^|\\s+)" + n + "(?:$|\\s+)"));
								if (!o) return !1;
								var a = o.index + o[0].length;
								e[r] = i.slice(0, o.index) + (o.index && a != i.length ? " " : "") + i.slice(a) || null
							}
							return !0
						})
					}),
					addLineWidget: st(null, function (e, t, n) {
						return ir(this, e, t, n)
					}),
					removeLineWidget: function (e) {
						e.clear()
					},
					lineInfo: function (e) {
						if ("number" == typeof e) {
							if (!on(this.doc, e)) return null;
							var t = e;
							if (e = Sr(this.doc, e), !e) return null
						} else {
							var t = Lr(e);
							if (null == t) return null
						}
						return {
							line: t,
							handle: e,
							text: e.text,
							gutterMarkers: e.gutterMarkers,
							textClass: e.textClass,
							bgClass: e.bgClass,
							wrapClass: e.wrapClass,
							widgets: e.widgets
						}
					},
					getViewport: function () {
						return {from: this.display.showingFrom, to: this.display.showingTo}
					},
					addWidget: function (e, t, n, r, i) {
						var o = this.display;
						e = Q(this, nn(this.doc, e));
						var a = e.bottom, s = e.left;
						if (t.style.position = "absolute", o.sizer.appendChild(t), "over" == r) a = e.top; else if ("above" == r || "near" == r) {
							var l = Math.max(o.wrapper.clientHeight, this.doc.height),
								u = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
							("above" == r || e.bottom + t.offsetHeight > l) && e.top > t.offsetHeight ? a = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= l && (a = e.bottom), s + t.offsetWidth > u && (s = u - t.offsetWidth)
						}
						t.style.top = a + "px", t.style.left = t.style.right = "", "right" == i ? (s = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? s = 0 : "middle" == i && (s = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = s + "px"), n && hn(this, s, a, s + t.offsetWidth, a + t.offsetHeight)
					},
					triggerOnKeyDown: st(null, Ft),
					triggerOnKeyPress: st(null, Ht),
					triggerOnKeyUp: st(null, Ot),
					execCommand: function (e) {
						return Lo.hasOwnProperty(e) ? Lo[e](this) : void 0
					},
					findPosH: function (e, t, n, r) {
						var i = 1;
						0 > t && (i = -1, t = -t);
						for (var o = 0, a = nn(this.doc, e); t > o && (a = yn(this.doc, a, i, n, r), !a.hitSide); ++o) ;
						return a
					},
					moveH: st(null, function (e, t) {
						var n, r = this.doc.sel;
						n = r.shift || r.extend || Jt(r.from, r.to) ? yn(this.doc, r.head, e, t, this.options.rtlMoveVisually) : 0 > e ? r.from : r.to, an(this.doc, n, n, e)
					}),
					deleteH: st(null, function (e, t) {
						var n = this.doc.sel;
						Jt(n.from, n.to) ? Yt(this.doc, "", n.from, yn(this.doc, n.head, e, t, !1), "+delete") : Yt(this.doc, "", n.from, n.to, "+delete"), this.curOp.userSelChange = !0
					}),
					findPosV: function (e, t, n, r) {
						var i = 1, o = r;
						0 > t && (i = -1, t = -t);
						for (var a = 0, s = nn(this.doc, e); t > a; ++a) {
							var l = Q(this, s, "div");
							if (null == o ? o = l.left : l.left = o, s = wn(this, l, i, n), s.hitSide) break
						}
						return s
					},
					moveV: st(null, function (e, t) {
						var n, r, i = this.doc.sel;
						if (i.shift || i.extend || Jt(i.from, i.to)) {
							var o = Q(this, i.head, "div");
							null != i.goalColumn && (o.left = i.goalColumn), n = wn(this, o, e, t), "page" == t && gn(this, 0, Z(this, n, "div").top - o.top), r = o.left
						} else n = 0 > e ? i.from : i.to;
						an(this.doc, n, n, e), null != r && (i.goalColumn = r)
					}),
					toggleOverwrite: function (e) {
						(null == e || e != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? this.display.cursor.className += " CodeMirror-overwrite" : this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", ""), Zr(this, "overwriteToggle", this, this.state.overwrite))
					},
					hasFocus: function () {
						return document.activeElement == this.display.input
					},
					scrollTo: st(null, function (e, t) {
						mn(this, e, t)
					}),
					getScrollInfo: function () {
						var e = this.display.scroller, t = Wo;
						return {
							left: e.scrollLeft,
							top: e.scrollTop,
							height: e.scrollHeight - t,
							width: e.scrollWidth - t,
							clientHeight: e.clientHeight - t,
							clientWidth: e.clientWidth - t
						}
					},
					scrollIntoView: st(null, function (e, t) {
						null == e ? e = {from: this.doc.sel.head, to: null} : "number" == typeof e ? e = {
							from: Xt(e, 0),
							to: null
						} : null == e.from && (e = {from: e, to: null}), e.to || (e.to = e.from), t || (t = 0);
						var n = e;
						null != e.from.line && (this.curOp.scrollToPos = {
							from: e.from,
							to: e.to,
							margin: t
						}, n = {from: Q(this, e.from), to: Q(this, e.to)});
						var r = pn(this, Math.min(n.from.left, n.to.left), Math.min(n.from.top, n.to.top) - t, Math.max(n.from.right, n.to.right), Math.max(n.from.bottom, n.to.bottom) + t);
						mn(this, r.scrollLeft, r.scrollTop)
					}),
					setSize: st(null, function (e, t) {
						function n(e) {
							return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
						}

						null != e && (this.display.wrapper.style.width = n(e)), null != t && (this.display.wrapper.style.height = n(t)), this.options.lineWrapping && (this.display.measureLineCache.length = this.display.measureLineCachePos = 0), this.curOp.forceUpdate = !0, Zr(this, "refresh", this)
					}),
					operation: function (e) {
						return ut(this, e)
					},
					refresh: st(null, function () {
						var e = this.display.cachedTextHeight;
						$(this), mn(this, this.doc.scrollLeft, this.doc.scrollTop), ct(this), (null == e || Math.abs(e - rt(this.display)) > .5) && a(this), Zr(this, "refresh", this)
					}),
					swapDoc: st(null, function (e) {
						var t = this.doc;
						return t.cm = null, kr(this, e), $(this), pt(this, !0), mn(this, e.scrollLeft, e.scrollTop), Qr(this, "swapDoc", this, t), t
					}),
					getInputField: function () {
						return this.display.input
					},
					getWrapperElement: function () {
						return this.display.wrapper
					},
					getScrollerElement: function () {
						return this.display.scroller
					},
					getGutterElement: function () {
						return this.display.gutters
					}
				}, ri(e);
				var wo = e.optionHandlers = {}, _o = e.defaults = {}, xo = e.Init = {
					toString: function () {
						return "CodeMirror.Init"
					}
				};
				kn("value", "", function (e, t) {
					e.setValue(t)
				}, !0), kn("mode", null, function (e, t) {
					e.doc.modeOption = t, n(e)
				}, !0), kn("indentUnit", 2, n, !0), kn("indentWithTabs", !1), kn("smartIndent", !0), kn("tabSize", 4, function (e) {
					r(e), $(e), ct(e)
				}, !0), kn("specialChars", /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g, function (e, t) {
					e.options.specialChars = new RegExp(t.source + (t.test("	") ? "" : "|	"), "g"), e.refresh()
				}, !0), kn("specialCharPlaceholder", hr, function (e) {
					e.refresh()
				}, !0), kn("electricChars", !0), kn("rtlMoveVisually", !no), kn("wholeLineUpdateBefore", !0), kn("theme", "default", function (e) {
					l(e), u(e)
				}, !0), kn("keyMap", "default", s), kn("extraKeys", null), kn("onKeyEvent", null), kn("onDragEvent", null), kn("lineWrapping", !1, i, !0), kn("gutters", [], function (e) {
					h(e.options), u(e)
				}, !0), kn("fixedGutter", !0, function (e, t) {
					e.display.gutters.style.left = t ? y(e.display) + "px" : "0", e.refresh()
				}, !0), kn("coverGutterNextToScrollbar", !1, p, !0), kn("lineNumbers", !1, function (e) {
					h(e.options), u(e)
				}, !0), kn("firstLineNumber", 1, u, !0), kn("lineNumberFormatter", function (e) {
					return e
				}, u, !0), kn("showCursorWhenSelecting", !1, T, !0), kn("resetSelectionOnContextMenu", !0), kn("readOnly", !1, function (e, t) {
					"nocursor" == t ? (It(e), e.display.input.blur(), e.display.disabled = !0) : (e.display.disabled = !1, t || pt(e, !0))
				}), kn("disableInput", !1, function (e, t) {
					t || pt(e, !0)
				}, !0), kn("dragDrop", !0), kn("cursorBlinkRate", 530), kn("cursorScrollMargin", 0), kn("cursorHeight", 1), kn("workTime", 100), kn("workDelay", 100), kn("flattenSpans", !0, r, !0), kn("addModeClass", !1, r, !0), kn("pollInterval", 100), kn("undoDepth", 40, function (e, t) {
					e.doc.history.undoDepth = t
				}), kn("historyEventDelay", 500), kn("viewportMargin", 10, function (e) {
					e.refresh()
				}, !0), kn("maxHighlightLength", 1e4, r, !0), kn("crudeMeasuringFrom", 1e4), kn("moveInputWithCursor", !0, function (e, t) {
					t || (e.display.inputDiv.style.top = e.display.inputDiv.style.left = 0)
				}), kn("tabindex", null, function (e, t) {
					e.display.input.tabIndex = t || ""
				}), kn("autofocus", null);
				var ko = e.modes = {}, So = e.mimeModes = {};
				e.defineMode = function (t, n) {
					if (e.defaults.mode || "null" == t || (e.defaults.mode = t), arguments.length > 2) {
						n.dependencies = [];
						for (var r = 2; r < arguments.length; ++r) n.dependencies.push(arguments[r])
					}
					ko[t] = n
				}, e.defineMIME = function (e, t) {
					So[e] = t
				}, e.resolveMode = function (t) {
					if ("string" == typeof t && So.hasOwnProperty(t)) t = So[t]; else if (t && "string" == typeof t.name && So.hasOwnProperty(t.name)) {
						var n = So[t.name];
						"string" == typeof n && (n = {name: n}), t = ci(n, t), t.name = n.name
					} else if ("string" == typeof t && /^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return e.resolveMode("application/xml");
					return "string" == typeof t ? {name: t} : t || {name: "null"}
				}, e.getMode = function (t, n) {
					var n = e.resolveMode(n), r = ko[n.name];
					if (!r) return e.getMode(t, "text/plain");
					var i = r(t, n);
					if (Co.hasOwnProperty(n.name)) {
						var o = Co[n.name];
						for (var a in o) o.hasOwnProperty(a) && (i.hasOwnProperty(a) && (i["_" + a] = i[a]), i[a] = o[a])
					}
					if (i.name = n.name, n.helperType && (i.helperType = n.helperType), n.modeProps) for (var a in n.modeProps) i[a] = n.modeProps[a];
					return i
				}, e.defineMode("null", function () {
					return {
						token: function (e) {
							e.skipToEnd()
						}
					}
				}), e.defineMIME("text/plain", "null");
				var Co = e.modeExtensions = {};
				e.extendMode = function (e, t) {
					var n = Co.hasOwnProperty(e) ? Co[e] : Co[e] = {};
					fi(t, n)
				}, e.defineExtension = function (t, n) {
					e.prototype[t] = n
				}, e.defineDocExtension = function (e, t) {
					Ho.prototype[e] = t
				}, e.defineOption = kn;
				var Ao = [];
				e.defineInitHook = function (e) {
					Ao.push(e)
				};
				var Eo = e.helpers = {};
				e.registerHelper = function (t, n, r) {
					Eo.hasOwnProperty(t) || (Eo[t] = e[t] = {_global: []}), Eo[t][n] = r
				}, e.registerGlobalHelper = function (t, n, r, i) {
					e.registerHelper(t, n, i), Eo[t]._global.push({pred: r, val: i})
				}, e.isWordChar = pi, e.copyState = Sn, e.startState = Cn, e.innerMode = function (e, t) {
					for (; e.innerMode;) {
						var n = e.innerMode(t);
						if (!n || n.mode == e) break;
						t = n.state, e = n.mode
					}
					return n || {mode: e, state: t}
				};
				var Lo = e.commands = {
					selectAll: function (e) {
						e.setSelection(Xt(e.firstLine(), 0), Xt(e.lastLine()))
					}, killLine: function (e) {
						var t = e.getCursor(!0), n = e.getCursor(!1), r = !Jt(t, n);
						r || e.getLine(t.line).length != t.ch ? e.replaceRange("", t, r ? n : Xt(t.line), "+delete") : e.replaceRange("", t, Xt(t.line + 1, 0), "+delete")
					}, deleteLine: function (e) {
						var t = e.getCursor().line;
						e.replaceRange("", Xt(t, 0), Xt(t + 1, 0), "+delete")
					}, delLineLeft: function (e) {
						var t = e.getCursor();
						e.replaceRange("", Xt(t.line, 0), t, "+delete")
					}, undo: function (e) {
						e.undo()
					}, redo: function (e) {
						e.redo()
					}, goDocStart: function (e) {
						e.extendSelection(Xt(e.firstLine(), 0))
					}, goDocEnd: function (e) {
						e.extendSelection(Xt(e.lastLine()))
					}, goLineStart: function (e) {
						e.extendSelection(Di(e, e.getCursor().line))
					}, goLineStartSmart: function (e) {
						var t = e.getCursor(), n = Di(e, t.line), r = e.getLineHandle(n.line), i = Mr(r);
						if (i && 0 != i[0].level) e.extendSelection(n); else {
							var o = Math.max(0, r.text.search(/\S/)), a = t.line == n.line && t.ch <= o && t.ch;
							e.extendSelection(Xt(n.line, a ? 0 : o))
						}
					}, goLineEnd: function (e) {
						e.extendSelection(Mi(e, e.getCursor().line))
					}, goLineRight: function (e) {
						var t = e.charCoords(e.getCursor(), "div").top + 5;
						e.extendSelection(e.coordsChar({left: e.display.lineDiv.offsetWidth + 100, top: t}, "div"))
					}, goLineLeft: function (e) {
						var t = e.charCoords(e.getCursor(), "div").top + 5;
						e.extendSelection(e.coordsChar({left: 0, top: t}, "div"))
					}, goLineUp: function (e) {
						e.moveV(-1, "line")
					}, goLineDown: function (e) {
						e.moveV(1, "line")
					}, goPageUp: function (e) {
						e.moveV(-1, "page")
					}, goPageDown: function (e) {
						e.moveV(1, "page")
					}, goCharLeft: function (e) {
						e.moveH(-1, "char")
					}, goCharRight: function (e) {
						e.moveH(1, "char")
					}, goColumnLeft: function (e) {
						e.moveH(-1, "column")
					}, goColumnRight: function (e) {
						e.moveH(1, "column")
					}, goWordLeft: function (e) {
						e.moveH(-1, "word")
					}, goGroupRight: function (e) {
						e.moveH(1, "group")
					}, goGroupLeft: function (e) {
						e.moveH(-1, "group")
					}, goWordRight: function (e) {
						e.moveH(1, "word")
					}, delCharBefore: function (e) {
						e.deleteH(-1, "char")
					}, delCharAfter: function (e) {
						e.deleteH(1, "char")
					}, delWordBefore: function (e) {
						e.deleteH(-1, "word")
					}, delWordAfter: function (e) {
						e.deleteH(1, "word")
					}, delGroupBefore: function (e) {
						e.deleteH(-1, "group")
					}, delGroupAfter: function (e) {
						e.deleteH(1, "group")
					}, indentAuto: function (e) {
						e.indentSelection("smart")
					}, indentMore: function (e) {
						e.indentSelection("add")
					}, indentLess: function (e) {
						e.indentSelection("subtract")
					}, insertTab: function (e) {
						e.replaceSelection("	", "end", "+input")
					}, defaultTab: function (e) {
						e.somethingSelected() ? e.indentSelection("add") : e.replaceSelection("	", "end", "+input")
					}, transposeChars: function (e) {
						var t = e.getCursor(), n = e.getLine(t.line);
						t.ch > 0 && t.ch < n.length - 1 && e.replaceRange(n.charAt(t.ch) + n.charAt(t.ch - 1), Xt(t.line, t.ch - 1), Xt(t.line, t.ch + 1))
					}, newlineAndIndent: function (e) {
						st(e, function () {
							e.replaceSelection("\n", "end", "+input"), e.indentLine(e.getCursor().line, null, !0)
						})()
					}, toggleOverwrite: function (e) {
						e.toggleOverwrite()
					}
				}, To = e.keyMap = {};
				To.basic = {
					Left: "goCharLeft",
					Right: "goCharRight",
					Up: "goLineUp",
					Down: "goLineDown",
					End: "goLineEnd",
					Home: "goLineStartSmart",
					PageUp: "goPageUp",
					PageDown: "goPageDown",
					Delete: "delCharAfter",
					Backspace: "delCharBefore",
					"Shift-Backspace": "delCharBefore",
					Tab: "defaultTab",
					"Shift-Tab": "indentAuto",
					Enter: "newlineAndIndent",
					Insert: "toggleOverwrite"
				}, To.pcDefault = {
					"Ctrl-A": "selectAll",
					"Ctrl-D": "deleteLine",
					"Ctrl-Z": "undo",
					"Shift-Ctrl-Z": "redo",
					"Ctrl-Y": "redo",
					"Ctrl-Home": "goDocStart",
					"Ctrl-Up": "goDocStart",
					"Ctrl-End": "goDocEnd",
					"Ctrl-Down": "goDocEnd",
					"Ctrl-Left": "goGroupLeft",
					"Ctrl-Right": "goGroupRight",
					"Alt-Left": "goLineStart",
					"Alt-Right": "goLineEnd",
					"Ctrl-Backspace": "delGroupBefore",
					"Ctrl-Delete": "delGroupAfter",
					"Ctrl-S": "save",
					"Ctrl-F": "find",
					"Ctrl-G": "findNext",
					"Shift-Ctrl-G": "findPrev",
					"Shift-Ctrl-F": "replace",
					"Shift-Ctrl-R": "replaceAll",
					"Ctrl-[": "indentLess",
					"Ctrl-]": "indentMore",
					fallthrough: "basic"
				}, To.macDefault = {
					"Cmd-A": "selectAll",
					"Cmd-D": "deleteLine",
					"Cmd-Z": "undo",
					"Shift-Cmd-Z": "redo",
					"Cmd-Y": "redo",
					"Cmd-Up": "goDocStart",
					"Cmd-End": "goDocEnd",
					"Cmd-Down": "goDocEnd",
					"Alt-Left": "goGroupLeft",
					"Alt-Right": "goGroupRight",
					"Cmd-Left": "goLineStart",
					"Cmd-Right": "goLineEnd",
					"Alt-Backspace": "delGroupBefore",
					"Ctrl-Alt-Backspace": "delGroupAfter",
					"Alt-Delete": "delGroupAfter",
					"Cmd-S": "save",
					"Cmd-F": "find",
					"Cmd-G": "findNext",
					"Shift-Cmd-G": "findPrev",
					"Cmd-Alt-F": "replace",
					"Shift-Cmd-Alt-F": "replaceAll",
					"Cmd-[": "indentLess",
					"Cmd-]": "indentMore",
					"Cmd-Backspace": "delLineLeft",
					fallthrough: ["basic", "emacsy"]
				}, To["default"] = to ? To.macDefault : To.pcDefault, To.emacsy = {
					"Ctrl-F": "goCharRight",
					"Ctrl-B": "goCharLeft",
					"Ctrl-P": "goLineUp",
					"Ctrl-N": "goLineDown",
					"Alt-F": "goWordRight",
					"Alt-B": "goWordLeft",
					"Ctrl-A": "goLineStart",
					"Ctrl-E": "goLineEnd",
					"Ctrl-V": "goPageDown",
					"Shift-Ctrl-V": "goPageUp",
					"Ctrl-D": "delCharAfter",
					"Ctrl-H": "delCharBefore",
					"Alt-D": "delWordAfter",
					"Alt-Backspace": "delWordBefore",
					"Ctrl-K": "killLine",
					"Ctrl-T": "transposeChars"
				}, e.lookupKey = En, e.isModifierKey = Ln, e.keyName = Tn, e.fromTextArea = function (t, n) {
					function r() {
						t.value = u.getValue()
					}

					if (n || (n = {}), n.value = t.value, !n.tabindex && t.tabindex && (n.tabindex = t.tabindex), !n.placeholder && t.placeholder && (n.placeholder = t.placeholder), null == n.autofocus) {
						var i = document.body;
						try {
							i = document.activeElement
						} catch (o) {
						}
						n.autofocus = i == t || null != t.getAttribute("autofocus") && i == document.body
					}
					if (t.form && (Xr(t.form, "submit", r), !n.leaveSubmitMethodAlone)) {
						var a = t.form, s = a.submit;
						try {
							var l = a.submit = function () {
								r(), a.submit = s, a.submit(), a.submit = l
							}
						} catch (o) {
						}
					}
					t.style.display = "none";
					var u = e(function (e) {
						t.parentNode.insertBefore(e, t.nextSibling)
					}, n);
					return u.save = r, u.getTextArea = function () {
						return t
					}, u.toTextArea = function () {
						r(), t.parentNode.removeChild(u.getWrapperElement()), t.style.display = "", t.form && (Jr(t.form, "submit", r), "function" == typeof t.form.submit && (t.form.submit = s))
					}, u
				}, Dn.prototype = {
					eol: function () {
						return this.pos >= this.string.length
					}, sol: function () {
						return this.pos == this.lineStart
					}, peek: function () {
						return this.string.charAt(this.pos) || void 0
					}, next: function () {
						return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
					}, eat: function (e) {
						var t = this.string.charAt(this.pos);
						if ("string" == typeof e) var n = t == e; else var n = t && (e.test ? e.test(t) : e(t));
						return n ? (++this.pos, t) : void 0
					}, eatWhile: function (e) {
						for (var t = this.pos; this.eat(e);) ;
						return this.pos > t
					}, eatSpace: function () {
						for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
						return this.pos > e
					}, skipToEnd: function () {
						this.pos = this.string.length
					}, skipTo: function (e) {
						var t = this.string.indexOf(e, this.pos);
						return t > -1 ? (this.pos = t, !0) : void 0
					}, backUp: function (e) {
						this.pos -= e
					}, column: function () {
						return this.lastColumnPos < this.start && (this.lastColumnValue = oi(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? oi(this.string, this.lineStart, this.tabSize) : 0)
					}, indentation: function () {
						return oi(this.string, null, this.tabSize) - (this.lineStart ? oi(this.string, this.lineStart, this.tabSize) : 0)
					}, match: function (e, t, n) {
						if ("string" != typeof e) {
							var r = this.string.slice(this.pos).match(e);
							return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r)
						}
						var i = function (e) {
							return n ? e.toLowerCase() : e
						}, o = this.string.substr(this.pos, e.length);
						return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
					}, current: function () {
						return this.string.slice(this.start, this.pos)
					}, hideFirstChars: function (e, t) {
						this.lineStart += e;
						try {
							return t()
						} finally {
							this.lineStart -= e
						}
					}
				}, e.StringStream = Dn, e.TextMarker = Mn, ri(Mn), Mn.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						var e = this.doc.cm, t = e && !e.curOp;
						if (t && ot(e), ni(this, "clear")) {
							var n = this.find();
							n && Qr(this, "clear", n.from, n.to)
						}
						for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
							var a = this.lines[o], s = Fn(a.markedSpans, this);
							null != s.to && (i = Lr(a)), a.markedSpans = Hn(a.markedSpans, s), null != s.from ? r = Lr(a) : this.collapsed && !Zn(this.doc, a) && e && Er(a, rt(e.display))
						}
						if (e && this.collapsed && !e.options.lineWrapping) for (var o = 0; o < this.lines.length; ++o) {
							var l = Jn(e.doc, this.lines[o]), u = f(e.doc, l);
							u > e.display.maxLineLength && (e.display.maxLine = l, e.display.maxLineLength = u, e.display.maxLineChanged = !0)
						}
						null != r && e && ct(e, r, i + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && un(e)), t && at(e)
					}
				}, Mn.prototype.find = function (e) {
					for (var t, n, r = 0; r < this.lines.length; ++r) {
						var i = this.lines[r], o = Fn(i.markedSpans, this);
						if (null != o.from || null != o.to) {
							var a = Lr(i);
							null != o.from && (t = Xt(a, o.from)), null != o.to && (n = Xt(a, o.to))
						}
					}
					return "bookmark" != this.type || e ? t && {from: t, to: n} : t
				}, Mn.prototype.changed = function () {
					var e = this.find(), t = this.doc.cm;
					if (e && t) {
						"bookmark" != this.type && (e = e.from);
						var n = Sr(this.doc, e.line);
						if (P(t, n), e.line >= t.display.showingFrom && e.line < t.display.showingTo) {
							for (var r = t.display.lineDiv.firstChild; r; r = r.nextSibling) if (r.lineObj == n) {
								r.offsetHeight != n.height && Er(n, r.offsetHeight);
								break
							}
							ut(t, function () {
								t.curOp.selectionChanged = t.curOp.forceUpdate = t.curOp.updateMaxLine = !0
							})
						}
					}
				}, Mn.prototype.attachLine = function (e) {
					if (!this.lines.length && this.doc.cm) {
						var t = this.doc.cm.curOp;
						t.maybeHiddenMarkers && -1 != ui(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
					}
					this.lines.push(e)
				}, Mn.prototype.detachLine = function (e) {
					if (this.lines.splice(ui(this.lines, e), 1), !this.lines.length && this.doc.cm) {
						var t = this.doc.cm.curOp;
						(t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
					}
				};
				var Do = 0;
				e.SharedTextMarker = Bn, ri(Bn), Bn.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						this.explicitlyCleared = !0;
						for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
						Qr(this, "clear")
					}
				}, Bn.prototype.find = function () {
					return this.primary.find()
				};
				var Mo = e.LineWidget = function (e, t, n) {
					if (n) for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
					this.cm = e, this.node = t
				};
				ri(Mo), Mo.prototype.clear = nr(function () {
					var e = this.line.widgets, t = Lr(this.line);
					if (null != t && e) {
						for (var n = 0; n < e.length; ++n) e[n] == this && e.splice(n--, 1);
						e.length || (this.line.widgets = null);
						var r = Dr(this.cm, this.line) < this.cm.doc.scrollTop;
						Er(this.line, Math.max(0, this.line.height - rr(this))), r && gn(this.cm, 0, -this.height), ct(this.cm, t, t + 1)
					}
				}), Mo.prototype.changed = nr(function () {
					var e = this.height;
					this.height = null;
					var t = rr(this) - e;
					if (t) {
						Er(this.line, this.line.height + t);
						var n = Lr(this.line);
						ct(this.cm, n, n + 1)
					}
				});
				var No = e.Line = function (e, t, n) {
					this.text = e, tr(this, t), this.height = n ? n(this) : 1
				};
				ri(No), No.prototype.lineNo = function () {
					return Lr(this)
				};
				var Bo = {}, Oo = {};
				wr.prototype = {
					chunkSize: function () {
						return this.lines.length
					}, removeInner: function (e, t) {
						for (var n = e, r = e + t; r > n; ++n) {
							var i = this.lines[n];
							this.height -= i.height, ar(i), Qr(i, "delete")
						}
						this.lines.splice(e, t)
					}, collapse: function (e) {
						e.splice.apply(e, [e.length, 0].concat(this.lines))
					}, insertInner: function (e, t, n) {
						this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
						for (var r = 0, i = t.length; i > r; ++r) t[r].parent = this
					}, iterN: function (e, t, n) {
						for (var r = e + t; r > e; ++e) if (n(this.lines[e])) return !0
					}
				}, _r.prototype = {
					chunkSize: function () {
						return this.size
					}, removeInner: function (e, t) {
						this.size -= t;
						for (var n = 0; n < this.children.length; ++n) {
							var r = this.children[n], i = r.chunkSize();
							if (i > e) {
								var o = Math.min(t, i - e), a = r.height;
								if (r.removeInner(e, o), this.height -= a - r.height, i == o && (this.children.splice(n--, 1), r.parent = null), 0 == (t -= o)) break;
								e = 0
							} else e -= i
						}
						if (this.size - t < 25) {
							var s = [];
							this.collapse(s), this.children = [new wr(s)], this.children[0].parent = this
						}
					}, collapse: function (e) {
						for (var t = 0, n = this.children.length; n > t; ++t) this.children[t].collapse(e)
					}, insertInner: function (e, t, n) {
						this.size += t.length, this.height += n;
						for (var r = 0, i = this.children.length; i > r; ++r) {
							var o = this.children[r], a = o.chunkSize();
							if (a >= e) {
								if (o.insertInner(e, t, n), o.lines && o.lines.length > 50) {
									for (; o.lines.length > 50;) {
										var s = o.lines.splice(o.lines.length - 25, 25), l = new wr(s);
										o.height -= l.height, this.children.splice(r + 1, 0, l), l.parent = this
									}
									this.maybeSpill()
								}
								break
							}
							e -= a
						}
					}, maybeSpill: function () {
						if (!(this.children.length <= 10)) {
							var e = this;
							do {
								var t = e.children.splice(e.children.length - 5, 5), n = new _r(t);
								if (e.parent) {
									e.size -= n.size, e.height -= n.height;
									var r = ui(e.parent.children, e);
									e.parent.children.splice(r + 1, 0, n)
								} else {
									var i = new _r(e.children);
									i.parent = e, e.children = [i, n], e = i
								}
								n.parent = e.parent
							} while (e.children.length > 10);
							e.parent.maybeSpill()
						}
					}, iterN: function (e, t, n) {
						for (var r = 0, i = this.children.length; i > r; ++r) {
							var o = this.children[r], a = o.chunkSize();
							if (a > e) {
								var s = Math.min(t, a - e);
								if (o.iterN(e, s, n)) return !0;
								if (0 == (t -= s)) break;
								e = 0
							} else e -= a
						}
					}
				};
				var Fo = 0, Ho = e.Doc = function (e, t, n) {
					if (!(this instanceof Ho)) return new Ho(e, t, n);
					null == n && (n = 0), _r.call(this, [new wr([new No("", null)])]), this.first = n, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.history = Nr(), this.cleanGeneration = 1, this.frontier = n;
					var r = Xt(n, 0);
					this.sel = {
						from: r,
						to: r,
						head: r,
						anchor: r,
						shift: !1,
						extend: !1,
						goalColumn: null
					}, this.id = ++Fo, this.modeOption = t, "string" == typeof e && (e = Yo(e)), yr(this, {
						from: r,
						to: r,
						text: e
					}, null, {head: r, anchor: r})
				};
				Ho.prototype = ci(_r.prototype, {
					constructor: Ho, iter: function (e, t, n) {
						n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
					}, insert: function (e, t) {
						for (var n = 0, r = 0, i = t.length; i > r; ++r) n += t[r].height;
						this.insertInner(e - this.first, t, n)
					}, remove: function (e, t) {
						this.removeInner(e - this.first, t)
					}, getValue: function (e) {
						var t = Ar(this, this.first, this.first + this.size);
						return e === !1 ? t : t.join(e || "\n")
					}, setValue: function (e) {
						var t = Xt(this.first, 0), n = this.first + this.size - 1;
						qt(this, {from: t, to: Xt(n, Sr(this, n).text.length), text: Yo(e), origin: "setValue"}, {
							head: t,
							anchor: t
						}, !0)
					}, replaceRange: function (e, t, n, r) {
						t = nn(this, t), n = n ? nn(this, n) : t, Yt(this, e, t, n, r)
					}, getRange: function (e, t, n) {
						var r = Cr(this, nn(this, e), nn(this, t));
						return n === !1 ? r : r.join(n || "\n")
					}, getLine: function (e) {
						var t = this.getLineHandle(e);
						return t && t.text
					}, setLine: function (e, t) {
						on(this, e) && Yt(this, t, Xt(e, 0), nn(this, Xt(e)))
					}, removeLine: function (e) {
						e ? Yt(this, "", nn(this, Xt(e - 1)), nn(this, Xt(e))) : Yt(this, "", Xt(0, 0), nn(this, Xt(1, 0)))
					}, getLineHandle: function (e) {
						return on(this, e) ? Sr(this, e) : void 0
					}, getLineNumber: function (e) {
						return Lr(e)
					}, getLineHandleVisualStart: function (e) {
						return "number" == typeof e && (e = Sr(this, e)), Jn(this, e)
					}, lineCount: function () {
						return this.size
					}, firstLine: function () {
						return this.first
					}, lastLine: function () {
						return this.first + this.size - 1
					}, clipPos: function (e) {
						return nn(this, e)
					}, getCursor: function (e) {
						var t, n = this.sel;
						return t = null == e || "head" == e ? n.head : "anchor" == e ? n.anchor : "end" == e || e === !1 ? n.to : n.from, en(t)
					}, somethingSelected: function () {
						return !Jt(this.sel.head, this.sel.anchor)
					}, setCursor: lt(function (e, t, n) {
						var r = nn(this, "number" == typeof e ? Xt(e, t || 0) : e);
						n ? an(this, r) : ln(this, r, r)
					}), setSelection: lt(function (e, t, n) {
						ln(this, nn(this, e), nn(this, t || e), n)
					}), extendSelection: lt(function (e, t, n) {
						an(this, nn(this, e), t && nn(this, t), n)
					}), getSelection: function (e) {
						return this.getRange(this.sel.from, this.sel.to, e)
					}, replaceSelection: function (e, t, n) {
						qt(this, {from: this.sel.from, to: this.sel.to, text: Yo(e), origin: n}, t || "around")
					}, undo: lt(function () {
						Vt(this, "undo")
					}), redo: lt(function () {
						Vt(this, "redo")
					}), setExtending: function (e) {
						this.sel.extend = e
					}, historySize: function () {
						var e = this.history;
						return {undo: e.done.length, redo: e.undone.length}
					}, clearHistory: function () {
						this.history = Nr(this.history.maxGeneration)
					}, markClean: function () {
						this.cleanGeneration = this.changeGeneration(!0)
					}, changeGeneration: function (e) {
						return e && (this.history.lastOp = this.history.lastOrigin = null), this.history.generation
					}, isClean: function (e) {
						return this.history.generation == (e || this.cleanGeneration)
					}, getHistory: function () {
						return {done: Ir(this.history.done), undone: Ir(this.history.undone)}
					}, setHistory: function (e) {
						var t = this.history = Nr(this.history.maxGeneration);
						t.done = e.done.slice(0), t.undone = e.undone.slice(0)
					}, markText: function (e, t, n) {
						return Nn(this, nn(this, e), nn(this, t), n, "range")
					}, setBookmark: function (e, t) {
						var n = {
							replacedWith: t && (null == t.nodeType ? t.widget : t),
							insertLeft: t && t.insertLeft,
							clearWhenEmpty: !1
						};
						return e = nn(this, e), Nn(this, e, e, n, "bookmark")
					}, findMarksAt: function (e) {
						e = nn(this, e);
						var t = [], n = Sr(this, e.line).markedSpans;
						if (n) for (var r = 0; r < n.length; ++r) {
							var i = n[r];
							(null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
						}
						return t
					}, findMarks: function (e, t) {
						e = nn(this, e), t = nn(this, t);
						var n = [], r = e.line;
						return this.iter(e.line, t.line + 1, function (i) {
							var o = i.markedSpans;
							if (o) for (var a = 0; a < o.length; a++) {
								var s = o[a];
								r == e.line && e.ch > s.to || null == s.from && r != e.line || r == t.line && s.from > t.ch || n.push(s.marker.parent || s.marker)
							}
							++r
						}), n
					}, getAllMarks: function () {
						var e = [];
						return this.iter(function (t) {
							var n = t.markedSpans;
							if (n) for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker)
						}), e
					}, posFromIndex: function (e) {
						var t, n = this.first;
						return this.iter(function (r) {
							var i = r.text.length + 1;
							return i > e ? (t = e, !0) : (e -= i, ++n, void 0)
						}), nn(this, Xt(n, t))
					}, indexFromPos: function (e) {
						e = nn(this, e);
						var t = e.ch;
						return e.line < this.first || e.ch < 0 ? 0 : (this.iter(this.first, e.line, function (e) {
							t += e.text.length + 1
						}), t)
					}, copy: function (e) {
						var t = new Ho(Ar(this, this.first, this.first + this.size), this.modeOption, this.first);
						return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = {
							from: this.sel.from,
							to: this.sel.to,
							head: this.sel.head,
							anchor: this.sel.anchor,
							shift: this.sel.shift,
							extend: !1,
							goalColumn: this.sel.goalColumn
						}, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
					}, linkedDoc: function (e) {
						e || (e = {});
						var t = this.first, n = this.first + this.size;
						null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
						var r = new Ho(Ar(this, t, n), e.mode || this.modeOption, t);
						return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({
							doc: r,
							sharedHist: e.sharedHist
						}), r.linked = [{doc: this, isParent: !0, sharedHist: e.sharedHist}], r
					}, unlinkDoc: function (t) {
						if (t instanceof e && (t = t.doc), this.linked) for (var n = 0; n < this.linked.length; ++n) {
							var r = this.linked[n];
							if (r.doc == t) {
								this.linked.splice(n, 1), t.unlinkDoc(this);
								break
							}
						}
						if (t.history == this.history) {
							var i = [t.id];
							xr(t, function (e) {
								i.push(e.id)
							}, !0), t.history = Nr(), t.history.done = Ir(this.history.done, i), t.history.undone = Ir(this.history.undone, i)
						}
					}, iterLinkedDocs: function (e) {
						xr(this, e)
					}, getMode: function () {
						return this.mode
					}, getEditor: function () {
						return this.cm
					}
				}), Ho.prototype.eachLine = Ho.prototype.iter;
				var jo = "iter insert remove copy getEditor".split(" ");
				for (var Io in Ho.prototype) Ho.prototype.hasOwnProperty(Io) && ui(jo, Io) < 0 && (e.prototype[Io] = function (e) {
					return function () {
						return e.apply(this.doc, arguments)
					}
				}(Ho.prototype[Io]));
				ri(Ho), e.e_stop = $r, e.e_preventDefault = Ur, e.e_stopPropagation = Vr;
				var zo, Ro = 0;
				e.on = Xr, e.off = Jr, e.signal = Zr;
				var Wo = 30, Po = e.Pass = {
					toString: function () {
						return "CodeMirror.Pass"
					}
				};
				ii.prototype = {
					set: function (e, t) {
						clearTimeout(this.id), this.id = setTimeout(t, e)
					}
				}, e.countColumn = oi;
				var qo = [""], Uo = /[\u00df\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
					Vo = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
				e.replaceGetRect = function (e) {
					_i = e
				};
				var Go = function () {
					if (Ri) return !1;
					var e = vi("div");
					return "draggable" in e || "dragDrop" in e
				}();
				ji ? xi = function (e, t) {
					return 36 == e.charCodeAt(t - 1) && 39 == e.charCodeAt(t)
				} : Ki && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent) ? xi = function (e, t) {
					return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(e.slice(t - 1, t + 1))
				} : Ui && /Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent) ? xi = function (e, t) {
					var n = e.charCodeAt(t - 1);
					return n >= 8208 && 8212 >= n
				} : Ui && (xi = function (e, t) {
					if (t > 1 && 45 == e.charCodeAt(t - 1)) {
						if (/\w/.test(e.charAt(t - 2)) && /[^\-?\.]/.test(e.charAt(t))) return !0;
						if (t > 2 && /[\d\.,]/.test(e.charAt(t - 2)) && /[\d\.,]/.test(e.charAt(t))) return !1
					}
					return /[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|\u2026[\w~`@#$%\^&*(_=+{[><]/.test(e.slice(t - 1, t + 1))
				});
				var $o, Ko, Yo = 3 != "\n\nb".split(/\n/).length ? function (e) {
					for (var t = 0, n = [], r = e.length; r >= t;) {
						var i = e.indexOf("\n", t);
						-1 == i && (i = e.length);
						var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i), a = o.indexOf("\r");
						-1 != a ? (n.push(o.slice(0, a)), t += a + 1) : (n.push(o), t = i + 1)
					}
					return n
				} : function (e) {
					return e.split(/\r\n?|\n/)
				};
				e.splitLines = Yo;
				var Xo = window.getSelection ? function (e) {
					try {
						return e.selectionStart != e.selectionEnd
					} catch (t) {
						return !1
					}
				} : function (e) {
					try {
						var t = e.ownerDocument.selection.createRange()
					} catch (n) {
					}
					return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
				}, Jo = function () {
					var e = vi("div");
					return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
				}(), Zo = {
					3: "Enter",
					8: "Backspace",
					9: "Tab",
					13: "Enter",
					16: "Shift",
					17: "Ctrl",
					18: "Alt",
					19: "Pause",
					20: "CapsLock",
					27: "Esc",
					32: "Space",
					33: "PageUp",
					34: "PageDown",
					35: "End",
					36: "Home",
					37: "Left",
					38: "Up",
					39: "Right",
					40: "Down",
					44: "PrintScrn",
					45: "Insert",
					46: "Delete",
					59: ";",
					61: "=",
					91: "Mod",
					92: "Mod",
					93: "Mod",
					107: "=",
					109: "-",
					127: "Delete",
					173: "-",
					186: ";",
					187: "=",
					188: ",",
					189: "-",
					190: ".",
					191: "/",
					192: "`",
					219: "[",
					220: "\\",
					221: "]",
					222: "'",
					63232: "Up",
					63233: "Down",
					63234: "Left",
					63235: "Right",
					63272: "Delete",
					63273: "Home",
					63275: "End",
					63276: "PageUp",
					63277: "PageDown",
					63302: "Insert"
				};
				e.keyNames = Zo, function () {
					for (var e = 0; 10 > e; e++) Zo[e + 48] = Zo[e + 96] = String(e);
					for (var e = 65; 90 >= e; e++) Zo[e] = String.fromCharCode(e);
					for (var e = 1; 12 >= e; e++) Zo[e + 111] = Zo[e + 63235] = "F" + e
				}();
				var Qo, ea = function () {
					function e(e) {
						return 255 >= e ? t.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1791 >= e ? n.charAt(e - 1536) : e >= 1792 && 2220 >= e ? "r" : "L"
					}

					var t = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL",
						n = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr",
						r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, i = /[stwN]/, o = /[LRr]/, a = /[Lb1n]/,
						s = /[1n]/, l = "L";
					return function (t) {
						if (!r.test(t)) return !1;
						for (var n, u = t.length, c = [], f = 0; u > f; ++f) c.push(n = e(t.charCodeAt(f)));
						for (var f = 0, d = l; u > f; ++f) {
							var n = c[f];
							"m" == n ? c[f] = d : d = n
						}
						for (var f = 0, h = l; u > f; ++f) {
							var n = c[f];
							"1" == n && "r" == h ? c[f] = "n" : o.test(n) && (h = n, "r" == n && (c[f] = "R"))
						}
						for (var f = 1, d = c[0]; u - 1 > f; ++f) {
							var n = c[f];
							"+" == n && "1" == d && "1" == c[f + 1] ? c[f] = "1" : "," != n || d != c[f + 1] || "1" != d && "n" != d || (c[f] = d), d = n
						}
						for (var f = 0; u > f; ++f) {
							var n = c[f];
							if ("," == n) c[f] = "N"; else if ("%" == n) {
								for (var p = f + 1; u > p && "%" == c[p]; ++p) ;
								for (var m = f && "!" == c[f - 1] || u > p && "1" == c[p] ? "1" : "N", g = f; p > g; ++g) c[g] = m;
								f = p - 1
							}
						}
						for (var f = 0, h = l; u > f; ++f) {
							var n = c[f];
							"L" == h && "1" == n ? c[f] = "L" : o.test(n) && (h = n)
						}
						for (var f = 0; u > f; ++f) if (i.test(c[f])) {
							for (var p = f + 1; u > p && i.test(c[p]); ++p) ;
							for (var v = "L" == (f ? c[f - 1] : l), b = "L" == (u > p ? c[p] : l), m = v || b ? "L" : "R", g = f; p > g; ++g) c[g] = m;
							f = p - 1
						}
						for (var y, w = [], f = 0; u > f;) if (a.test(c[f])) {
							var _ = f;
							for (++f; u > f && a.test(c[f]); ++f) ;
							w.push({from: _, to: f, level: 0})
						} else {
							var x = f, k = w.length;
							for (++f; u > f && "L" != c[f]; ++f) ;
							for (var g = x; f > g;) if (s.test(c[g])) {
								g > x && w.splice(k, 0, {from: x, to: g, level: 1});
								var S = g;
								for (++g; f > g && s.test(c[g]); ++g) ;
								w.splice(k, 0, {from: S, to: g, level: 2}), x = g
							} else ++g;
							f > x && w.splice(k, 0, {from: x, to: f, level: 1})
						}
						return 1 == w[0].level && (y = t.match(/^\s+/)) && (w[0].from = y[0].length, w.unshift({
							from: 0,
							to: y[0].length,
							level: 0
						})), 1 == si(w).level && (y = t.match(/\s+$/)) && (si(w).to -= y[0].length, w.push({
							from: u - y[0].length,
							to: u,
							level: 0
						})), w[0].level != si(w).level && w.push({from: u, to: u, level: w[0].level}), w
					}
				}();
				return e.version = "3.22.0", e
			}()
		}, {}], 19: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("css", function (e, t) {
				"use strict";

				function r(e, t) {
					return h = t, e
				}

				function i(e, t) {
					var n = e.next();
					if (g[n]) {
						var i = g[n](e, t);
						if (i !== !1) return i
					}
					return "@" == n ? (e.eatWhile(/[\w\\\-]/), r("def", e.current())) : "=" == n || ("~" == n || "|" == n) && e.eat("=") ? r(null, "compare") : '"' == n || "'" == n ? (t.tokenize = o(n), t.tokenize(e, t)) : "#" == n ? (e.eatWhile(/[\w\\\-]/), r("atom", "hash")) : "!" == n ? (e.match(/^\s*\w*/), r("keyword", "important")) : /\d/.test(n) || "." == n && e.eat(/\d/) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : "-" !== n ? /[,+>*\/]/.test(n) ? r(null, "select-op") : "." == n && e.match(/^-?[_a-z][_a-z0-9-]*/i) ? r("qualifier", "qualifier") : /[:;{}\[\]\(\)]/.test(n) ? r(null, n) : "u" == n && e.match("rl(") ? (e.backUp(1), t.tokenize = a, r("property", "word")) : /[\w\\\-]/.test(n) ? (e.eatWhile(/[\w\\\-]/), r("property", "word")) : r(null, null) : /[\d.]/.test(e.peek()) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : e.match(/^[^-]+-/) ? r("meta", "meta") : void 0
				}

				function o(e) {
					return function (t, n) {
						for (var i, o = !1; null != (i = t.next());) {
							if (i == e && !o) {
								")" == e && t.backUp(1);
								break
							}
							o = !o && "\\" == i
						}
						return (i == e || !o && ")" != e) && (n.tokenize = null), r("string", "string")
					}
				}

				function a(e, t) {
					return e.next(), t.tokenize = e.match(/\s*[\"\']/, !1) ? null : o(")"), r(null, "(")
				}

				function s(e, t, n) {
					this.type = e, this.indent = t, this.prev = n
				}

				function l(e, t, n) {
					return e.context = new s(n, t.indentation() + m, e.context), n
				}

				function u(e) {
					return e.context = e.context.prev, e.context.type
				}

				function c(e, t, n) {
					return S[n.context.type](e, t, n)
				}

				function f(e, t, n, r) {
					for (var i = r || 1; i > 0; i--) n.context = n.context.prev;
					return c(e, t, n)
				}

				function d(e) {
					var t = e.current().toLowerCase();
					p = _.hasOwnProperty(t) ? "atom" : w.hasOwnProperty(t) ? "keyword" : "variable"
				}

				t.propertyKeywords || (t = n.resolveMode("text/css"));
				var h, p, m = e.indentUnit, g = t.tokenHooks, v = t.mediaTypes || {}, b = t.mediaFeatures || {},
					y = t.propertyKeywords || {}, w = t.colorKeywords || {}, _ = t.valueKeywords || {},
					x = t.fontProperties || {}, k = t.allowNested, S = {};
				return S.top = function (e, t, n) {
					if ("{" == e) return l(n, t, "block");
					if ("}" == e && n.context.prev) return u(n);
					if ("@media" == e) return l(n, t, "media");
					if ("@font-face" == e) return "font_face_before";
					if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(e)) return "keyframes";
					if (e && "@" == e.charAt(0)) return l(n, t, "at");
					if ("hash" == e) p = "builtin"; else if ("word" == e) p = "tag"; else {
						if ("variable-definition" == e) return "maybeprop";
						if ("interpolation" == e) return l(n, t, "interpolation");
						if (":" == e) return "pseudo";
						if (k && "(" == e) return l(n, t, "params")
					}
					return n.context.type
				}, S.block = function (e, t, n) {
					return "word" == e ? y.hasOwnProperty(t.current().toLowerCase()) ? (p = "property", "maybeprop") : k ? (p = t.match(/^\s*:/, !1) ? "property" : "tag", "block") : (p += " error", "maybeprop") : "meta" == e ? "block" : k || "hash" != e && "qualifier" != e ? S.top(e, t, n) : (p = "error", "block")
				}, S.maybeprop = function (e, t, n) {
					return ":" == e ? l(n, t, "prop") : c(e, t, n)
				}, S.prop = function (e, t, n) {
					if (";" == e) return u(n);
					if ("{" == e && k) return l(n, t, "propBlock");
					if ("}" == e || "{" == e) return f(e, t, n);
					if ("(" == e) return l(n, t, "parens");
					if ("hash" != e || /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t.current())) {
						if ("word" == e) d(t); else if ("interpolation" == e) return l(n, t, "interpolation")
					} else p += " error";
					return "prop"
				}, S.propBlock = function (e, t, n) {
					return "}" == e ? u(n) : "word" == e ? (p = "property", "maybeprop") : n.context.type
				}, S.parens = function (e, t, n) {
					return "{" == e || "}" == e ? f(e, t, n) : ")" == e ? u(n) : "parens"
				}, S.pseudo = function (e, t, n) {
					return "word" == e ? (p = "variable-3", n.context.type) : c(e, t, n)
				}, S.media = function (e, t, n) {
					if ("(" == e) return l(n, t, "media_parens");
					if ("}" == e) return f(e, t, n);
					if ("{" == e) return u(n) && l(n, t, k ? "block" : "top");
					if ("word" == e) {
						var r = t.current().toLowerCase();
						p = "only" == r || "not" == r || "and" == r ? "keyword" : v.hasOwnProperty(r) ? "attribute" : b.hasOwnProperty(r) ? "property" : "error"
					}
					return n.context.type
				}, S.media_parens = function (e, t, n) {
					return ")" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n, 2) : S.media(e, t, n)
				}, S.font_face_before = function (e, t, n) {
					return "{" == e ? l(n, t, "font_face") : c(e, t, n)
				}, S.font_face = function (e, t, n) {
					return "}" == e ? u(n) : "word" == e ? (p = x.hasOwnProperty(t.current().toLowerCase()) ? "property" : "error", "maybeprop") : "font_face"
				}, S.keyframes = function (e, t, n) {
					return "word" == e ? (p = "variable", "keyframes") : "{" == e ? l(n, t, "top") : c(e, t, n)
				}, S.at = function (e, t, n) {
					return ";" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n) : ("word" == e ? p = "tag" : "hash" == e && (p = "builtin"), "at")
				}, S.interpolation = function (e, t, n) {
					return "}" == e ? u(n) : "{" == e || ";" == e ? f(e, t, n) : ("variable" != e && (p = "error"), "interpolation")
				}, S.params = function (e, t, n) {
					return ")" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n) : ("word" == e && d(t), "params")
				}, {
					startState: function (e) {
						return {tokenize: null, state: "top", context: new s("top", e || 0, null)}
					}, token: function (e, t) {
						if (!t.tokenize && e.eatSpace()) return null;
						var n = (t.tokenize || i)(e, t);
						return n && "object" == typeof n && (h = n[1], n = n[0]), p = n, t.state = S[t.state](h, e, t), p
					}, indent: function (e, t) {
						var n = e.context, r = t && t.charAt(0), i = n.indent;
						return "prop" == n.type && "}" == r && (n = n.prev), !n.prev || ("}" != r || "block" != n.type && "top" != n.type && "interpolation" != n.type && "font_face" != n.type) && (")" != r || "parens" != n.type && "params" != n.type && "media_parens" != n.type) && ("{" != r || "at" != n.type && "media" != n.type) || (i = n.indent - m, n = n.prev), i
					}, electricChars: "}", blockCommentStart: "/*", blockCommentEnd: "*/", fold: "brace"
				}
			}), function () {
				function e(e) {
					for (var t = {}, n = 0; n < e.length; ++n) t[e[n]] = !0;
					return t
				}

				function t(e, t) {
					for (var n, r = !1; null != (n = e.next());) {
						if (r && "/" == n) {
							t.tokenize = null;
							break
						}
						r = "*" == n
					}
					return ["comment", "comment"]
				}

				function r(e, t) {
					return e.skipTo("-->") ? (e.match("-->"), t.tokenize = null) : e.skipToEnd(), ["comment", "comment"]
				}

				var i = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"],
					o = e(i),
					a = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid"],
					s = e(a),
					l = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings", "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "justify-content", "left", "letter-spacing", "line-break", "line-height", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker-offset", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "max-height", "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "shape-inside", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index", "zoom", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "kerning", "text-anchor", "writing-mode"],
					u = e(l),
					c = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
					f = e(c),
					d = ["above", "absolute", "activeborder", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "column", "compact", "condensed", "contain", "content", "content-box", "context-menu", "continuous", "copy", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ew-resize", "expanded", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "landscape", "lao", "large", "larger", "left", "level", "lighter", "line-through", "linear", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "match", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif", "scroll", "scrollbar", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "single", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super", "sw-resize", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "x-large", "x-small", "xor", "xx-large", "xx-small"],
					h = e(d),
					p = ["font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"],
					m = e(p), g = i.concat(a).concat(l).concat(c).concat(d);
				n.registerHelper("hintWords", "css", g), n.defineMIME("text/css", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					tokenHooks: {
						"<": function (e, t) {
							return e.match("!--") ? (t.tokenize = r, r(e, t)) : !1
						}, "/": function (e, n) {
							return e.eat("*") ? (n.tokenize = t, t(e, n)) : !1
						}
					},
					name: "css"
				}), n.defineMIME("text/x-scss", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					allowNested: !0,
					tokenHooks: {
						"/": function (e, n) {
							return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (n.tokenize = t, t(e, n)) : ["operator", "operator"]
						}, ":": function (e) {
							return e.match(/\s*{/) ? [null, "{"] : !1
						}, $: function (e) {
							return e.match(/^[\w-]+/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"]
						}, "#": function (e) {
							return e.eat("{") ? [null, "interpolation"] : !1
						}
					},
					name: "css",
					helperType: "scss"
				}), n.defineMIME("text/x-less", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					allowNested: !0,
					tokenHooks: {
						"/": function (e, n) {
							return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (n.tokenize = t, t(e, n)) : ["operator", "operator"]
						}, "@": function (e) {
							return e.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, !1) ? !1 : (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"])
						}, "&": function () {
							return ["atom", "atom"]
						}
					},
					name: "css",
					helperType: "less"
				})
			}()
		}, {"code-mirror": 18}], 20: [function (e, t) {
			e("./xml.js"), e("./css.js"), e("./javascript.js");
			var n = t.exports = e("code-mirror");
			n.defineMode("htmlmixed", function (e, t) {
				function r(e, t) {
					var n = t.htmlState.tagName, r = s.token(e, t.htmlState);
					if ("script" == n && /\btag\b/.test(r) && ">" == e.current()) {
						var i = e.string.slice(Math.max(0, e.pos - 100), e.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);
						i = i ? i[1] : "", i && /[\"\']/.test(i.charAt(0)) && (i = i.slice(1, i.length - 1));
						for (var c = 0; c < u.length; ++c) {
							var f = u[c];
							if ("string" == typeof f.matches ? i == f.matches : f.matches.test(i)) {
								f.mode && (t.token = o, t.localMode = f.mode, t.localState = f.mode.startState && f.mode.startState(s.indent(t.htmlState, "")));
								break
							}
						}
					} else "style" == n && /\btag\b/.test(r) && ">" == e.current() && (t.token = a, t.localMode = l, t.localState = l.startState(s.indent(t.htmlState, "")));
					return r
				}

				function i(e, t, n) {
					var r, i = e.current(), o = i.search(t);
					return o > -1 ? e.backUp(i.length - o) : (r = i.match(/<\/?$/)) && (e.backUp(i.length), e.match(t, !1) || e.match(i)), n
				}

				function o(e, t) {
					return e.match(/^<\/\s*script\s*>/i, !1) ? (t.token = r, t.localState = t.localMode = null, r(e, t)) : i(e, /<\/\s*script\s*>/, t.localMode.token(e, t.localState))
				}

				function a(e, t) {
					return e.match(/^<\/\s*style\s*>/i, !1) ? (t.token = r, t.localState = t.localMode = null, r(e, t)) : i(e, /<\/\s*style\s*>/, l.token(e, t.localState))
				}

				var s = n.getMode(e, {
					name: "xml",
					htmlMode: !0,
					multilineTagIndentFactor: t.multilineTagIndentFactor,
					multilineTagIndentPastTag: t.multilineTagIndentPastTag
				}), l = n.getMode(e, "css"), u = [], c = t && t.scriptTypes;
				if (u.push({
						matches: /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,
						mode: n.getMode(e, "javascript")
					}), c) for (var f = 0; f < c.length; ++f) {
					var d = c[f];
					u.push({matches: d.matches, mode: d.mode && n.getMode(e, d.mode)})
				}
				return u.push({matches: /./, mode: n.getMode(e, "text/plain")}), {
					startState: function () {
						var e = s.startState();
						return {token: r, localMode: null, localState: null, htmlState: e}
					}, copyState: function (e) {
						if (e.localState) var t = n.copyState(e.localMode, e.localState);
						return {
							token: e.token,
							localMode: e.localMode,
							localState: t,
							htmlState: n.copyState(s, e.htmlState)
						}
					}, token: function (e, t) {
						return t.token(e, t)
					}, indent: function (e, t) {
						return !e.localMode || /^\s*<\//.test(t) ? s.indent(e.htmlState, t) : e.localMode.indent ? e.localMode.indent(e.localState, t) : n.Pass
					}, innerMode: function (e) {
						return {state: e.localState || e.htmlState, mode: e.localMode || s}
					}
				}
			}, "xml", "javascript", "css"), n.defineMIME("text/html", "htmlmixed")
		}, {"./css.js": 19, "./javascript.js": 21, "./xml.js": 22, "code-mirror": 18}], 21: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("javascript", function (e, t) {
				function r(e) {
					for (var t, n = !1, r = !1; null != (t = e.next());) {
						if (!n) {
							if ("/" == t && !r) return;
							"[" == t ? r = !0 : r && "]" == t && (r = !1)
						}
						n = !n && "\\" == t
					}
				}

				function i(e, t, n) {
					return ht = e, pt = n, t
				}

				function o(e, t) {
					var n = e.next();
					if ('"' == n || "'" == n) return t.tokenize = a(n), t.tokenize(e, t);
					if ("." == n && e.match(/^\d+(?:[eE][+\-]?\d+)?/)) return i("number", "number");
					if ("." == n && e.match("..")) return i("spread", "meta");
					if (/[\[\]{}\(\),;\:\.]/.test(n)) return i(n);
					if ("=" == n && e.eat(">")) return i("=>", "operator");
					if ("0" == n && e.eat(/x/i)) return e.eatWhile(/[\da-f]/i), i("number", "number");
					if (/\d/.test(n)) return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), i("number", "number");
					if ("/" == n) return e.eat("*") ? (t.tokenize = s, s(e, t)) : e.eat("/") ? (e.skipToEnd(), i("comment", "comment")) : "operator" == t.lastType || "keyword c" == t.lastType || "sof" == t.lastType || /^[\[{}\(,;:]$/.test(t.lastType) ? (r(e), e.eatWhile(/[gimy]/), i("regexp", "string-2")) : (e.eatWhile(_t), i("operator", "operator", e.current()));
					if ("`" == n) return t.tokenize = l, l(e, t);
					if ("#" == n) return e.skipToEnd(), i("error", "error");
					if (_t.test(n)) return e.eatWhile(_t), i("operator", "operator", e.current());
					e.eatWhile(/[\w\$_]/);
					var o = e.current(), u = wt.propertyIsEnumerable(o) && wt[o];
					return u && "." != t.lastType ? i(u.type, u.style, o) : i("variable", "variable", o)
				}

				function a(e) {
					return function (t, n) {
						var r, a = !1;
						if (vt && "@" == t.peek() && t.match(xt)) return n.tokenize = o, i("jsonld-keyword", "meta");
						for (; null != (r = t.next()) && (r != e || a);) a = !a && "\\" == r;
						return a || (n.tokenize = o), i("string", "string")
					}
				}

				function s(e, t) {
					for (var n, r = !1; n = e.next();) {
						if ("/" == n && r) {
							t.tokenize = o;
							break
						}
						r = "*" == n
					}
					return i("comment", "comment")
				}

				function l(e, t) {
					for (var n, r = !1; null != (n = e.next());) {
						if (!r && ("`" == n || "$" == n && e.eat("{"))) {
							t.tokenize = o;
							break
						}
						r = !r && "\\" == n
					}
					return i("quasi", "string-2", e.current())
				}

				function u(e, t) {
					t.fatArrowAt && (t.fatArrowAt = null);
					var n = e.string.indexOf("=>", e.start);
					if (!(0 > n)) {
						for (var r = 0, i = !1, o = n - 1; o >= 0; --o) {
							var a = e.string.charAt(o), s = kt.indexOf(a);
							if (s >= 0 && 3 > s) {
								if (!r) {
									++o;
									break
								}
								if (0 == --r) break
							} else if (s >= 3 && 6 > s) ++r; else if (/[$\w]/.test(a)) i = !0; else if (i && !r) {
								++o;
								break
							}
						}
						i && !r && (t.fatArrowAt = o)
					}
				}

				function c(e, t, n, r, i, o) {
					this.indented = e, this.column = t, this.type = n, this.prev = i, this.info = o, null != r && (this.align = r)
				}

				function f(e, t) {
					for (var n = e.localVars; n; n = n.next) if (n.name == t) return !0;
					for (var r = e.context; r; r = r.prev) for (var n = r.vars; n; n = n.next) if (n.name == t) return !0
				}

				function d(e, t, n, r, i) {
					var o = e.cc;
					for (Ct.state = e, Ct.stream = i, Ct.marked = null, Ct.cc = o, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0); ;) {
						var a = o.length ? o.pop() : bt ? x : _;
						if (a(n, r)) {
							for (; o.length && o[o.length - 1].lex;) o.pop()();
							return Ct.marked ? Ct.marked : "variable" == n && f(e, r) ? "variable-2" : t
						}
					}
				}

				function h() {
					for (var e = arguments.length - 1; e >= 0; e--) Ct.cc.push(arguments[e])
				}

				function p() {
					return h.apply(null, arguments), !0
				}

				function m(e) {
					function n(t) {
						for (var n = t; n; n = n.next) if (n.name == e) return !0;
						return !1
					}

					var r = Ct.state;
					if (r.context) {
						if (Ct.marked = "def", n(r.localVars)) return;
						r.localVars = {name: e, next: r.localVars}
					} else {
						if (n(r.globalVars)) return;
						t.globalVars && (r.globalVars = {name: e, next: r.globalVars})
					}
				}

				function g() {
					Ct.state.context = {prev: Ct.state.context, vars: Ct.state.localVars}, Ct.state.localVars = At
				}

				function v() {
					Ct.state.localVars = Ct.state.context.vars, Ct.state.context = Ct.state.context.prev
				}

				function b(e, t) {
					var n = function () {
						var n = Ct.state, r = n.indented;
						"stat" == n.lexical.type && (r = n.lexical.indented), n.lexical = new c(r, Ct.stream.column(), e, null, n.lexical, t)
					};
					return n.lex = !0, n
				}

				function y() {
					var e = Ct.state;
					e.lexical.prev && (")" == e.lexical.type && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
				}

				function w(e) {
					return function (t) {
						return t == e ? p() : ";" == e ? h() : p(arguments.callee)
					}
				}

				function _(e, t) {
					return "var" == e ? p(b("vardef", t.length), q, w(";"), y) : "keyword a" == e ? p(b("form"), x, _, y) : "keyword b" == e ? p(b("form"), _, y) : "{" == e ? p(b("}"), R, y) : ";" == e ? p() : "if" == e ? p(b("form"), x, _, y, K) : "function" == e ? p(et) : "for" == e ? p(b("form"), Y, _, y) : "variable" == e ? p(b("stat"), B) : "switch" == e ? p(b("form"), x, b("}", "switch"), w("{"), R, y, y) : "case" == e ? p(x, w(":")) : "default" == e ? p(w(":")) : "catch" == e ? p(b("form"), g, w("("), tt, w(")"), _, y, v) : "module" == e ? p(b("form"), g, ot, v, y) : "class" == e ? p(b("form"), nt, it, y) : "export" == e ? p(b("form"), at, y) : "import" == e ? p(b("form"), st, y) : h(b("stat"), x, w(";"), y)
				}

				function x(e) {
					return S(e, !1)
				}

				function k(e) {
					return S(e, !0)
				}

				function S(e, t) {
					if (Ct.state.fatArrowAt == Ct.stream.start) {
						var n = t ? N : M;
						if ("(" == e) return p(g, b(")"), I(U, ")"), y, w("=>"), n, v);
						if ("variable" == e) return h(g, U, w("=>"), n, v)
					}
					var r = t ? L : E;
					return St.hasOwnProperty(e) ? p(r) : "function" == e ? p(et) : "keyword c" == e ? p(t ? A : C) : "(" == e ? p(b(")"), C, dt, w(")"), y, r) : "operator" == e || "spread" == e ? p(t ? k : x) : "[" == e ? p(b("]"), ct, y, r) : "{" == e ? z(F, "}", null, r) : p()
				}

				function C(e) {
					return e.match(/[;\}\)\],]/) ? h() : h(x)
				}

				function A(e) {
					return e.match(/[;\}\)\],]/) ? h() : h(k)
				}

				function E(e, t) {
					return "," == e ? p(x) : L(e, t, !1)
				}

				function L(e, t, n) {
					var r = 0 == n ? E : L, i = 0 == n ? x : k;
					return "=>" == t ? p(g, n ? N : M, v) : "operator" == e ? /\+\+|--/.test(t) ? p(r) : "?" == t ? p(x, w(":"), i) : p(i) : "quasi" == e ? (Ct.cc.push(r), T(t)) : ";" != e ? "(" == e ? z(k, ")", "call", r) : "." == e ? p(O, r) : "[" == e ? p(b("]"), C, w("]"), y, r) : void 0 : void 0
				}

				function T(e) {
					return "${" != e.slice(e.length - 2) ? p() : p(x, D)
				}

				function D(e) {
					return "}" == e ? (Ct.marked = "string-2", Ct.state.tokenize = l, p()) : void 0
				}

				function M(e) {
					return u(Ct.stream, Ct.state), "{" == e ? h(_) : h(x)
				}

				function N(e) {
					return u(Ct.stream, Ct.state), "{" == e ? h(_) : h(k)
				}

				function B(e) {
					return ":" == e ? p(y, _) : h(E, w(";"), y)
				}

				function O(e) {
					return "variable" == e ? (Ct.marked = "property", p()) : void 0
				}

				function F(e, t) {
					if ("variable" == e) {
						if (Ct.marked = "property", "get" == t || "set" == t) return p(H)
					} else if ("number" == e || "string" == e) Ct.marked = vt ? "property" : e + " property"; else if ("[" == e) return p(x, w("]"), j);
					return St.hasOwnProperty(e) ? p(j) : void 0
				}

				function H(e) {
					return "variable" != e ? h(j) : (Ct.marked = "property", p(et))
				}

				function j(e) {
					return ":" == e ? p(k) : "(" == e ? h(et) : void 0
				}

				function I(e, t) {
					function n(r) {
						if ("," == r) {
							var i = Ct.state.lexical;
							return "call" == i.info && (i.pos = (i.pos || 0) + 1), p(e, n)
						}
						return r == t ? p() : p(w(t))
					}

					return function (r) {
						return r == t ? p() : h(e, n)
					}
				}

				function z(e, t, n) {
					for (var r = 3; r < arguments.length; r++) Ct.cc.push(arguments[r]);
					return p(b(t, n), I(e, t), y)
				}

				function R(e) {
					return "}" == e ? p() : h(_, R)
				}

				function W(e) {
					return yt && ":" == e ? p(P) : void 0
				}

				function P(e) {
					return "variable" == e ? (Ct.marked = "variable-3", p()) : void 0
				}

				function q() {
					return h(U, W, G, $)
				}

				function U(e, t) {
					return "variable" == e ? (m(t), p()) : "[" == e ? z(U, "]") : "{" == e ? z(V, "}") : void 0
				}

				function V(e, t) {
					return "variable" != e || Ct.stream.match(/^\s*:/, !1) ? ("variable" == e && (Ct.marked = "property"), p(w(":"), U, G)) : (m(t), p(G))
				}

				function G(e, t) {
					return "=" == t ? p(k) : void 0
				}

				function $(e) {
					return "," == e ? p(q) : void 0
				}

				function K(e, t) {
					return "keyword b" == e && "else" == t ? p(b("form"), _, y) : void 0
				}

				function Y(e) {
					return "(" == e ? p(b(")"), X, w(")"), y) : void 0
				}

				function X(e) {
					return "var" == e ? p(q, w(";"), Z) : ";" == e ? p(Z) : "variable" == e ? p(J) : h(x, w(";"), Z)
				}

				function J(e, t) {
					return "in" == t || "of" == t ? (Ct.marked = "keyword", p(x)) : p(E, Z)
				}

				function Z(e, t) {
					return ";" == e ? p(Q) : "in" == t || "of" == t ? (Ct.marked = "keyword", p(x)) : h(x, w(";"), Q)
				}

				function Q(e) {
					")" != e && p(x)
				}

				function et(e, t) {
					return "*" == t ? (Ct.marked = "keyword", p(et)) : "variable" == e ? (m(t), p(et)) : "(" == e ? p(g, b(")"), I(tt, ")"), y, _, v) : void 0
				}

				function tt(e) {
					return "spread" == e ? p(tt) : h(U, W)
				}

				function nt(e, t) {
					return "variable" == e ? (m(t), p(rt)) : void 0
				}

				function rt(e, t) {
					return "extends" == t ? p(x) : void 0
				}

				function it(e) {
					return "{" == e ? z(F, "}") : void 0
				}

				function ot(e, t) {
					return "string" == e ? p(_) : "variable" == e ? (m(t), p(ut)) : void 0
				}

				function at(e, t) {
					return "*" == t ? (Ct.marked = "keyword", p(ut, w(";"))) : "default" == t ? (Ct.marked = "keyword", p(x, w(";"))) : h(_)
				}

				function st(e) {
					return "string" == e ? p() : h(lt, ut)
				}

				function lt(e, t) {
					return "{" == e ? z(lt, "}") : ("variable" == e && m(t), p())
				}

				function ut(e, t) {
					return "from" == t ? (Ct.marked = "keyword", p(x)) : void 0
				}

				function ct(e) {
					return "]" == e ? p() : h(k, ft)
				}

				function ft(e) {
					return "for" == e ? h(dt, w("]")) : "," == e ? p(I(k, "]")) : h(I(k, "]"))
				}

				function dt(e) {
					return "for" == e ? p(Y, dt) : "if" == e ? p(x, dt) : void 0
				}

				var ht, pt, mt = e.indentUnit, gt = t.statementIndent, vt = t.jsonld, bt = t.json || vt, yt = t.typescript,
					wt = function () {
						function e(e) {
							return {type: e, style: "keyword"}
						}

						var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("operator"),
							o = {type: "atom", style: "atom"}, a = {
								"if": e("if"),
								"while": t,
								"with": t,
								"else": n,
								"do": n,
								"try": n,
								"finally": n,
								"return": r,
								"break": r,
								"continue": r,
								"new": r,
								"delete": r,
								"throw": r,
								"debugger": r,
								"var": e("var"),
								"const": e("var"),
								let: e("var"),
								"function": e("function"),
								"catch": e("catch"),
								"for": e("for"),
								"switch": e("switch"),
								"case": e("case"),
								"default": e("default"),
								"in": i,
								"typeof": i,
								"instanceof": i,
								"true": o,
								"false": o,
								"null": o,
								undefined: o,
								NaN: o,
								Infinity: o,
								"this": e("this"),
								module: e("module"),
								"class": e("class"),
								"super": e("atom"),
								yield: r,
								"export": e("export"),
								"import": e("import"),
								"extends": r
							};
						if (yt) {
							var s = {type: "variable", style: "variable-3"}, l = {
								"interface": e("interface"),
								"extends": e("extends"),
								constructor: e("constructor"),
								"public": e("public"),
								"private": e("private"),
								"protected": e("protected"),
								"static": e("static"),
								string: s,
								number: s,
								bool: s,
								any: s
							};
							for (var u in l) a[u] = l[u]
						}
						return a
					}(), _t = /[+\-*&%=<>!?|~^]/,
					xt = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,
					kt = "([{}])",
					St = {atom: !0, number: !0, variable: !0, string: !0, regexp: !0, "this": !0, "jsonld-keyword": !0},
					Ct = {state: null, column: null, marked: null, cc: null},
					At = {name: "this", next: {name: "arguments"}};
				return y.lex = !0, {
					startState: function (e) {
						var n = {
							tokenize: o,
							lastType: "sof",
							cc: [],
							lexical: new c((e || 0) - mt, 0, "block", !1),
							localVars: t.localVars,
							context: t.localVars && {vars: t.localVars},
							indented: 0
						};
						return t.globalVars && (n.globalVars = t.globalVars), n
					},
					token: function (e, t) {
						if (e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation(), u(e, t)), t.tokenize != s && e.eatSpace()) return null;
						var n = t.tokenize(e, t);
						return "comment" == ht ? n : (t.lastType = "operator" != ht || "++" != pt && "--" != pt ? ht : "incdec", d(t, n, ht, pt, e))
					},
					indent: function (e, r) {
						if (e.tokenize == s) return n.Pass;
						if (e.tokenize != o) return 0;
						for (var i = r && r.charAt(0), a = e.lexical, l = e.cc.length - 1; l >= 0; --l) {
							var u = e.cc[l];
							if (u == y) a = a.prev; else if (u != K) break
						}
						"stat" == a.type && "}" == i && (a = a.prev), gt && ")" == a.type && "stat" == a.prev.type && (a = a.prev);
						var c = a.type, f = i == c;
						return "vardef" == c ? a.indented + ("operator" == e.lastType || "," == e.lastType ? a.info + 1 : 0) : "form" == c && "{" == i ? a.indented : "form" == c ? a.indented + mt : "stat" == c ? a.indented + ("operator" == e.lastType || "," == e.lastType ? gt || mt : 0) : "switch" != a.info || f || 0 == t.doubleIndentSwitch ? a.align ? a.column + (f ? 0 : 1) : a.indented + (f ? 0 : mt) : a.indented + (/^(?:case|default)\b/.test(r) ? mt : 2 * mt)
					},
					electricChars: ":{}",
					blockCommentStart: bt ? null : "/*",
					blockCommentEnd: bt ? null : "*/",
					lineComment: bt ? null : "//",
					fold: "brace",
					helperType: bt ? "json" : "javascript",
					jsonldMode: vt,
					jsonMode: bt
				}
			}), n.defineMIME("text/javascript", "javascript"), n.defineMIME("text/ecmascript", "javascript"), n.defineMIME("application/javascript", "javascript"), n.defineMIME("application/ecmascript", "javascript"), n.defineMIME("application/json", {
				name: "javascript",
				json: !0
			}), n.defineMIME("application/x-json", {
				name: "javascript",
				json: !0
			}), n.defineMIME("application/ld+json", {
				name: "javascript",
				jsonld: !0
			}), n.defineMIME("text/typescript", {
				name: "javascript",
				typescript: !0
			}), n.defineMIME("application/typescript", {name: "javascript", typescript: !0})
		}, {"code-mirror": 18}], 22: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("xml", function (e, t) {
				function r(e, t) {
					function n(n) {
						return t.tokenize = n, n(e, t)
					}

					var r = e.next();
					if ("<" == r) {
						if (e.eat("!")) return e.eat("[") ? e.match("CDATA[") ? n(a("atom", "]]>")) : null : e.match("--") ? n(a("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(s(1))) : null;
						if (e.eat("?")) return e.eatWhile(/[\w\._\-]/), t.tokenize = a("meta", "?>"), "meta";
						var o = e.eat("/");
						_ = "";
						for (var l; l = e.eat(/[^\s\u00a0=<>\"\'\/?]/);) _ += l;
						return _ ? (x = o ? "closeTag" : "openTag", t.tokenize = i, "tag") : "tag error"
					}
					if ("&" == r) {
						var u;
						return u = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), u ? "atom" : "error"
					}
					return e.eatWhile(/[^&<]/), null
				}

				function i(e, t) {
					var n = e.next();
					if (">" == n || "/" == n && e.eat(">")) return t.tokenize = r, x = ">" == n ? "endTag" : "selfcloseTag", "tag";
					if ("=" == n) return x = "equals", null;
					if ("<" == n) {
						t.tokenize = r, t.state = f, t.tagName = t.tagStart = null;
						var i = t.tokenize(e, t);
						return i ? i + " error" : "error"
					}
					return /[\'\"]/.test(n) ? (t.tokenize = o(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.eatWhile(/[^\s\u00a0=<>\"\']/), "word")
				}

				function o(e) {
					var t = function (t, n) {
						for (; !t.eol();) if (t.next() == e) {
							n.tokenize = i;
							break
						}
						return "string"
					};
					return t.isInAttribute = !0, t
				}

				function a(e, t) {
					return function (n, i) {
						for (; !n.eol();) {
							if (n.match(t)) {
								i.tokenize = r;
								break
							}
							n.next()
						}
						return e
					}
				}

				function s(e) {
					return function (t, n) {
						for (var i; null != (i = t.next());) {
							if ("<" == i) return n.tokenize = s(e + 1), n.tokenize(t, n);
							if (">" == i) {
								if (1 == e) {
									n.tokenize = r;
									break
								}
								return n.tokenize = s(e - 1), n.tokenize(t, n)
							}
						}
						return "meta"
					}
				}

				function l(e, t, n) {
					this.prev = e.context, this.tagName = t, this.indent = e.indented, this.startOfLine = n, (S.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
				}

				function u(e) {
					e.context && (e.context = e.context.prev)
				}

				function c(e, t) {
					for (var n; ;) {
						if (!e.context) return;
						if (n = e.context.tagName.toLowerCase(), !S.contextGrabbers.hasOwnProperty(n) || !S.contextGrabbers[n].hasOwnProperty(t)) return;
						u(e)
					}
				}

				function f(e, t, n) {
					if ("openTag" == e) return n.tagName = _, n.tagStart = t.column(), p;
					if ("closeTag" == e) {
						var r = !1;
						return n.context ? n.context.tagName != _ && (S.implicitlyClosed.hasOwnProperty(n.context.tagName.toLowerCase()) && u(n), r = !n.context || n.context.tagName != _) : r = !0, r && (k = "error"), r ? h : d
					}
					return f
				}

				function d(e, t, n) {
					return "endTag" != e ? (k = "error", d) : (u(n), f)
				}

				function h(e, t, n) {
					return k = "error", d(e, t, n)
				}

				function p(e, t, n) {
					if ("word" == e) return k = "attribute", m;
					if ("endTag" == e || "selfcloseTag" == e) {
						var r = n.tagName, i = n.tagStart;
						return n.tagName = n.tagStart = null, "selfcloseTag" == e || S.autoSelfClosers.hasOwnProperty(r.toLowerCase()) ? c(n, r.toLowerCase()) : (c(n, r.toLowerCase()), n.context = new l(n, r, i == n.indented)), f
					}
					return k = "error", p
				}

				function m(e, t, n) {
					return "equals" == e ? g : (S.allowMissing || (k = "error"), p(e, t, n))
				}

				function g(e, t, n) {
					return "string" == e ? v : "word" == e && S.allowUnquoted ? (k = "string", p) : (k = "error", p(e, t, n))
				}

				function v(e, t, n) {
					return "string" == e ? v : p(e, t, n)
				}

				var b = e.indentUnit, y = t.multilineTagIndentFactor || 1, w = t.multilineTagIndentPastTag;
				null == w && (w = !0);
				var _, x, k, S = t.htmlMode ? {
					autoSelfClosers: {
						area: !0,
						base: !0,
						br: !0,
						col: !0,
						command: !0,
						embed: !0,
						frame: !0,
						hr: !0,
						img: !0,
						input: !0,
						keygen: !0,
						link: !0,
						meta: !0,
						param: !0,
						source: !0,
						track: !0,
						wbr: !0
					},
					implicitlyClosed: {
						dd: !0,
						li: !0,
						optgroup: !0,
						option: !0,
						p: !0,
						rp: !0,
						rt: !0,
						tbody: !0,
						td: !0,
						tfoot: !0,
						th: !0,
						tr: !0
					},
					contextGrabbers: {
						dd: {dd: !0, dt: !0},
						dt: {dd: !0, dt: !0},
						li: {li: !0},
						option: {option: !0, optgroup: !0},
						optgroup: {optgroup: !0},
						p: {
							address: !0,
							article: !0,
							aside: !0,
							blockquote: !0,
							dir: !0,
							div: !0,
							dl: !0,
							fieldset: !0,
							footer: !0,
							form: !0,
							h1: !0,
							h2: !0,
							h3: !0,
							h4: !0,
							h5: !0,
							h6: !0,
							header: !0,
							hgroup: !0,
							hr: !0,
							menu: !0,
							nav: !0,
							ol: !0,
							p: !0,
							pre: !0,
							section: !0,
							table: !0,
							ul: !0
						},
						rp: {rp: !0, rt: !0},
						rt: {rp: !0, rt: !0},
						tbody: {tbody: !0, tfoot: !0},
						td: {td: !0, th: !0},
						tfoot: {tbody: !0},
						th: {td: !0, th: !0},
						thead: {tbody: !0, tfoot: !0},
						tr: {tr: !0}
					},
					doNotIndent: {pre: !0},
					allowUnquoted: !0,
					allowMissing: !0
				} : {
					autoSelfClosers: {},
					implicitlyClosed: {},
					contextGrabbers: {},
					doNotIndent: {},
					allowUnquoted: !1,
					allowMissing: !1
				}, C = t.alignCDATA;
				return {
					startState: function () {
						return {tokenize: r, state: f, indented: 0, tagName: null, tagStart: null, context: null}
					},
					token: function (e, t) {
						if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
						_ = x = null;
						var n = t.tokenize(e, t);
						return (n || x) && "comment" != n && (k = null, t.state = t.state(x || n, e, t), k && (n = "error" == k ? n + " error" : k)), n
					},
					indent: function (e, t, o) {
						var a = e.context;
						if (e.tokenize.isInAttribute) return e.stringStartCol + 1;
						if (a && a.noIndent) return n.Pass;
						if (e.tokenize != i && e.tokenize != r) return o ? o.match(/^(\s*)/)[0].length : 0;
						if (e.tagName) return w ? e.tagStart + e.tagName.length + 2 : e.tagStart + b * y;
						if (C && /<!\[CDATA\[/.test(t)) return 0;
						for (a && /^<\//.test(t) && (a = a.prev); a && !a.startOfLine;) a = a.prev;
						return a ? a.indent + b : 0
					},
					electricChars: "/",
					blockCommentStart: "<!--",
					blockCommentEnd: "-->",
					configuration: t.htmlMode ? "html" : "xml",
					helperType: t.htmlMode ? "html" : "xml"
				}
			}), n.defineMIME("text/xml", "xml"), n.defineMIME("application/xml", "xml"), n.mimeModes.hasOwnProperty("text/html") || n.defineMIME("text/html", {
				name: "xml",
				htmlMode: !0
			})
		}, {"code-mirror": 18}], 23: [function (e, t) {
			function n(e) {
				this._cbs = e || {}, this.events = []
			}

			t.exports = n;
			var r = e("./").EVENTS;
			Object.keys(r).forEach(function (e) {
				if (0 === r[e]) e = "on" + e, n.prototype[e] = function () {
					this.events.push([e]), this._cbs[e] && this._cbs[e]()
				}; else if (1 === r[e]) e = "on" + e, n.prototype[e] = function (t) {
					this.events.push([e, t]), this._cbs[e] && this._cbs[e](t)
				}; else {
					if (2 !== r[e]) throw Error("wrong number of arguments");
					e = "on" + e, n.prototype[e] = function (t, n) {
						this.events.push([e, t, n]), this._cbs[e] && this._cbs[e](t, n)
					}
				}
			}), n.prototype.onreset = function () {
				this.events = [], this._cbs.onreset && this._cbs.onreset()
			}, n.prototype.restart = function () {
				this._cbs.onreset && this._cbs.onreset();
				for (var e = 0, t = this.events.length; t > e; e++) if (this._cbs[this.events[e][0]]) {
					var n = this.events[e].length;
					1 === n ? this._cbs[this.events[e][0]]() : 2 === n ? this._cbs[this.events[e][0]](this.events[e][1]) : this._cbs[this.events[e][0]](this.events[e][1], this.events[e][2])
				}
			}
		}, {"./": 34}], 24: [function (e, t) {
			function n(e, t) {
				this.init(e, t)
			}

			function r(e, t) {
				return u.getElementsByTagName(e, t, !0)
			}

			function i(e, t) {
				return u.getElementsByTagName(e, t, !0, 1)[0]
			}

			function o(e, t, n) {
				return u.getText(u.getElementsByTagName(e, t, n, 1)).trim()
			}

			function a(e, t, n, r, i) {
				var a = o(n, r, i);
				a && (e[t] = a)
			}

			var s = e("./index.js"), l = s.DomHandler, u = s.DomUtils;
			e("util").inherits(n, l), n.prototype.init = l;
			var c = function (e) {
				return "rss" === e || "feed" === e || "rdf:RDF" === e
			};
			n.prototype.onend = function () {
				var e, t, n = {}, s = i(c, this.dom);
				s && ("feed" === s.name ? (t = s.children, n.type = "atom", a(n, "id", "id", t), a(n, "title", "title", t), (e = i("link", t)) && (e = e.attribs) && (e = e.href) && (n.link = e), a(n, "description", "subtitle", t), (e = o("updated", t)) && (n.updated = new Date(e)), a(n, "author", "email", t, !0), n.items = r("entry", t).map(function (e) {
					var t, n = {};
					return e = e.children, a(n, "id", "id", e), a(n, "title", "title", e), (t = i("link", e)) && (t = t.attribs) && (t = t.href) && (n.link = t), a(n, "description", "summary", e), (t = o("updated", e)) && (n.pubDate = new Date(t)), n
				})) : (t = i("channel", s.children).children, n.type = s.name.substr(0, 3), n.id = "", a(n, "title", "title", t), a(n, "link", "link", t), a(n, "description", "description", t), (e = o("lastBuildDate", t)) && (n.updated = new Date(e)), a(n, "author", "managingEditor", t, !0), n.items = r("item", s.children).map(function (e) {
					var t, n = {};
					return e = e.children, a(n, "id", "guid", e), a(n, "title", "title", e), a(n, "link", "link", e), a(n, "description", "description", e), (t = o("pubDate", e)) && (n.pubDate = new Date(t)), n
				}))), this.dom = n, l.prototype._handleCallback.call(this, s ? null : Error("couldn't find root of feed"))
			}, t.exports = n
		}, {"./index.js": 34, util: 17}], 25: [function (e, t) {
			function n(e, t) {
				this._options = t || {}, this._cbs = e || {}, this._tagname = "", this._attribname = "", this._attribvalue = "", this._attribs = null, this._stack = [], this._done = !1, this.startIndex = 0, this.endIndex = null, this._lowerCaseTagNames = "lowerCaseTags" in this._options ? !!this._options.lowerCaseTags : !this._options.xmlMode, this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ? !!this._options.lowerCaseAttributeNames : !this._options.xmlMode, this._tokenizer = new r(this._options, this)
			}

			var r = e("./Tokenizer.js"),
				i = {input: !0, option: !0, optgroup: !0, select: !0, button: !0, datalist: !0, textarea: !0}, o = {
					tr: {tr: !0, th: !0, td: !0},
					th: {th: !0},
					td: {thead: !0, td: !0},
					body: {head: !0, link: !0, script: !0},
					li: {li: !0},
					p: {p: !0},
					select: i,
					input: i,
					output: i,
					button: i,
					datalist: i,
					textarea: i,
					option: {option: !0},
					optgroup: {optgroup: !0}
				}, a = {
					__proto__: null,
					area: !0,
					base: !0,
					basefont: !0,
					br: !0,
					col: !0,
					command: !0,
					embed: !0,
					frame: !0,
					hr: !0,
					img: !0,
					input: !0,
					isindex: !0,
					keygen: !0,
					link: !0,
					meta: !0,
					param: !0,
					source: !0,
					track: !0,
					wbr: !0,
					path: !0,
					circle: !0,
					ellipse: !0,
					line: !0,
					rect: !0,
					use: !0
				}, s = /\s|\//;
			e("util").inherits(n, e("events").EventEmitter), n.prototype._updatePosition = function (e) {
				this.startIndex = null === this.endIndex ? this._tokenizer._sectionStart <= e ? 0 : this._tokenizer._sectionStart - e : this.endIndex + 1, this.endIndex = this._tokenizer._index
			}, n.prototype.ontext = function (e) {
				this._updatePosition(1), this.endIndex--, this._cbs.ontext && this._cbs.ontext(e)
			}, n.prototype.onopentagname = function (e) {
				if (this._lowerCaseTagNames && (e = e.toLowerCase()), this._tagname = e, !this._options.xmlMode && e in o) for (var t; (t = this._stack[this._stack.length - 1]) in o[e]; this.onclosetag(t)) ;
				!this._options.xmlMode && e in a || this._stack.push(e), this._cbs.onopentagname && this._cbs.onopentagname(e), this._cbs.onopentag && (this._attribs = {})
			}, n.prototype.onopentagend = function () {
				this._updatePosition(1), this._attribs && (this._cbs.onopentag && this._cbs.onopentag(this._tagname, this._attribs), this._attribs = null), !this._options.xmlMode && this._cbs.onclosetag && this._tagname in a && this._cbs.onclosetag(this._tagname), this._tagname = ""
			}, n.prototype.onclosetag = function (e) {
				if (this._updatePosition(1), this._lowerCaseTagNames && (e = e.toLowerCase()), !this._stack.length || e in a && !this._options.xmlMode) this._options.xmlMode || "br" !== e && "p" !== e || (this.onopentagname(e), this._closeCurrentTag()); else {
					var t = this._stack.lastIndexOf(e);
					if (-1 !== t) if (this._cbs.onclosetag) for (t = this._stack.length - t; t--;) this._cbs.onclosetag(this._stack.pop()); else this._stack.length = t; else "p" !== e || this._options.xmlMode || (this.onopentagname(e), this._closeCurrentTag())
				}
			}, n.prototype.onselfclosingtag = function () {
				this._options.xmlMode || this._options.recognizeSelfClosing ? this._closeCurrentTag() : this.onopentagend()
			}, n.prototype._closeCurrentTag = function () {
				var e = this._tagname;
				this.onopentagend(), this._stack[this._stack.length - 1] === e && (this._cbs.onclosetag && this._cbs.onclosetag(e), this._stack.pop())
			}, n.prototype.onattribname = function (e) {
				this._lowerCaseAttributeNames && (e = e.toLowerCase()), this._attribname = e
			}, n.prototype.onattribdata = function (e) {
				this._attribvalue += e
			}, n.prototype.onattribend = function () {
				this._cbs.onattribute && this._cbs.onattribute(this._attribname, this._attribvalue), this._attribs && !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname) && (this._attribs[this._attribname] = this._attribvalue), this._attribname = "", this._attribvalue = ""
			}, n.prototype.ondeclaration = function (e) {
				if (this._cbs.onprocessinginstruction) {
					var t = e.search(s), n = 0 > t ? e : e.substr(0, t);
					this._lowerCaseTagNames && (n = n.toLowerCase()), this._cbs.onprocessinginstruction("!" + n, "!" + e)
				}
			}, n.prototype.onprocessinginstruction = function (e) {
				if (this._cbs.onprocessinginstruction) {
					var t = e.search(s), n = 0 > t ? e : e.substr(0, t);
					this._lowerCaseTagNames && (n = n.toLowerCase()), this._cbs.onprocessinginstruction("?" + n, "?" + e)
				}
			}, n.prototype.oncomment = function (e) {
				this._updatePosition(4), this._cbs.oncomment && this._cbs.oncomment(e), this._cbs.oncommentend && this._cbs.oncommentend()
			}, n.prototype.oncdata = function (e) {
				this._updatePosition(1), this._options.xmlMode || this._options.recognizeCDATA ? (this._cbs.oncdatastart && this._cbs.oncdatastart(), this._cbs.ontext && this._cbs.ontext(e), this._cbs.oncdataend && this._cbs.oncdataend()) : this.oncomment("[CDATA[" + e + "]]")
			}, n.prototype.onerror = function (e) {
				this._cbs.onerror && this._cbs.onerror(e)
			}, n.prototype.onend = function () {
				if (this._cbs.onclosetag) for (var e = this._stack.length; e > 0; this._cbs.onclosetag(this._stack[--e])) ;
				this._cbs.onend && this._cbs.onend()
			}, n.prototype.reset = function () {
				this._cbs.onreset && this._cbs.onreset(), this._tokenizer.reset(), this._tagname = "", this._attribname = "", this._attribs = null, this._stack = [], this._done = !1
			}, n.prototype.parseComplete = function (e) {
				this.reset(), this.end(e)
			}, n.prototype.write = function (e) {
				this._done && this.onerror(Error(".write() after done!")), this._tokenizer.write(e)
			}, n.prototype.end = function (e) {
				this._done && this.onerror(Error(".end() after done!")), this._tokenizer.end(e), this._done = !0
			}, n.prototype.parseChunk = n.prototype.write, n.prototype.done = n.prototype.end, t.exports = n
		}, {"./Tokenizer.js": 28, events: 2, util: 17}], 26: [function (e, t) {
			t.exports = n;
			var n = function (e) {
				this._cbs = e || {}
			}, r = e("./").EVENTS;
			Object.keys(r).forEach(function (e) {
				if (0 === r[e]) e = "on" + e, n.prototype[e] = function () {
					this._cbs[e] && this._cbs[e]()
				}; else if (1 === r[e]) e = "on" + e, n.prototype[e] = function (t) {
					this._cbs[e] && this._cbs[e](t)
				}; else {
					if (2 !== r[e]) throw Error("wrong number of arguments");
					e = "on" + e, n.prototype[e] = function (t, n) {
						this._cbs[e] && this._cbs[e](t, n)
					}
				}
			})
		}, {"./": 34}], 27: [function (e, t) {
			function n(e) {
				i.call(this, new r(this), e)
			}

			function r(e) {
				this.scope = e
			}

			t.exports = n;
			var i = e("./WritableStream.js");
			e("util").inherits(n, i), n.prototype.readable = !0;
			var o = e("../").EVENTS;
			Object.keys(o).forEach(function (e) {
				if (0 === o[e]) r.prototype["on" + e] = function () {
					this.scope.emit(e)
				}; else if (1 === o[e]) r.prototype["on" + e] = function (t) {
					this.scope.emit(e, t)
				}; else {
					if (2 !== o[e]) throw Error("wrong number of arguments!");
					r.prototype["on" + e] = function (t, n) {
						this.scope.emit(e, t, n)
					}
				}
			})
		}, {"../": 34, "./WritableStream.js": 29, util: 17}], 28: [function (e, t) {
			function n(e) {
				return " " === e || "\n" === e || "	" === e || "\f" === e || "\r" === e
			}

			function r(e, t, n) {
				var r = e.toLowerCase();
				return e === r ? function (e) {
					this._state = e === r ? t : n
				} : function (i) {
					this._state = i === r || i === e ? t : n
				}
			}

			function i(e, t) {
				var n = e.toLowerCase();
				return function (r) {
					r === n || r === e ? this._state = t : (this._state = p, this._index--)
				}
			}

			function o(e, t) {
				this._state = d, this._buffer = "", this._sectionStart = 0, this._index = 0, this._baseState = d, this._special = pt, this._cbs = t, this._running = !0, this._xmlMode = !(!e || !e.xmlMode), this._decodeEntities = !(!e || !e.decodeEntities)
			}

			function a(e) {
				var t = "";
				return e >= 55296 && 57343 >= e || e > 1114111 ? "�" : (e in c && (e = c[e]), e > 65535 && (e -= 65536, t += String.fromCharCode(55296 | 1023 & e >>> 10), e = 56320 | 1023 & e), t += String.fromCharCode(e))
			}

			t.exports = o;
			var s = e("./entities/entities.json"), l = e("./entities/legacy.json"), u = e("./entities/xml.json"),
				c = e("./entities/decode.json"), f = 0, d = f++, h = f++, p = f++, m = f++, g = f++, v = f++, b = f++,
				y = f++, w = f++, _ = f++, x = f++, k = f++, S = f++, C = f++, A = f++, E = f++, L = f++, T = f++, D = f++,
				M = f++, N = f++, B = f++, O = f++, F = f++, H = f++, j = f++, I = f++, z = f++, R = f++, W = f++, P = f++,
				q = f++, U = f++, V = f++, G = f++, $ = f++, K = f++, Y = f++, X = f++, J = f++, Z = f++, Q = f++, et = f++,
				tt = f++, nt = f++, rt = f++, it = f++, ot = f++, at = f++, st = f++, lt = f++, ut = f++, ct = f++,
				ft = f++, dt = f++, ht = 0, pt = ht++, mt = ht++, gt = ht++;
			o.prototype._stateText = function (e) {
				"<" === e ? (this._index > this._sectionStart && this._cbs.ontext(this._getSection()), this._state = h, this._sectionStart = this._index) : this._decodeEntities && this._special === pt && "&" === e && (this._index > this._sectionStart && this._cbs.ontext(this._getSection()), this._baseState = d, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateBeforeTagName = function (e) {
				"/" === e ? this._state = g : ">" === e || this._special !== pt || n(e) ? this._state = d : "!" === e ? (this._state = A, this._sectionStart = this._index + 1) : "?" === e ? (this._state = L, this._sectionStart = this._index + 1) : "<" === e ? (this._cbs.ontext(this._getSection()), this._sectionStart = this._index) : (this._state = this._xmlMode || "s" !== e && "S" !== e ? p : P, this._sectionStart = this._index)
			}, o.prototype._stateInTagName = function (e) {
				("/" === e || ">" === e || n(e)) && (this._emitToken("onopentagname"), this._state = y, this._index--)
			}, o.prototype._stateBeforeCloseingTagName = function (e) {
				n(e) || (">" === e ? this._state = d : this._special !== pt ? "s" === e || "S" === e ? this._state = q : (this._state = d, this._index--) : (this._state = v, this._sectionStart = this._index))
			}, o.prototype._stateInCloseingTagName = function (e) {
				(">" === e || n(e)) && (this._emitToken("onclosetag"), this._state = b, this._index--)
			}, o.prototype._stateAfterCloseingTagName = function (e) {
				">" === e && (this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateBeforeAttributeName = function (e) {
				">" === e ? (this._cbs.onopentagend(), this._state = d, this._sectionStart = this._index + 1) : "/" === e ? this._state = m : n(e) || (this._state = w, this._sectionStart = this._index)
			}, o.prototype._stateInSelfClosingTag = function (e) {
				">" === e ? (this._cbs.onselfclosingtag(), this._state = d, this._sectionStart = this._index + 1) : n(e) || (this._state = y, this._index--)
			}, o.prototype._stateInAttributeName = function (e) {
				("=" === e || "/" === e || ">" === e || n(e)) && (this._index > this._sectionStart && this._cbs.onattribname(this._getSection()), this._sectionStart = -1, this._state = _, this._index--)
			}, o.prototype._stateAfterAttributeName = function (e) {
				"=" === e ? this._state = x : "/" === e || ">" === e ? (this._cbs.onattribend(), this._state = y, this._index--) : n(e) || (this._cbs.onattribend(), this._state = w, this._sectionStart = this._index)
			}, o.prototype._stateBeforeAttributeValue = function (e) {
				'"' === e ? (this._state = k, this._sectionStart = this._index + 1) : "'" === e ? (this._state = S, this._sectionStart = this._index + 1) : n(e) || (this._state = C, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueDoubleQuotes = function (e) {
				'"' === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueSingleQuotes = function (e) {
				"'" === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueNoQuotes = function (e) {
				n(e) || ">" === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y, this._index--) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateBeforeDeclaration = function (e) {
				this._state = "[" === e ? B : "-" === e ? T : E
			}, o.prototype._stateInDeclaration = function (e) {
				">" === e && (this._cbs.ondeclaration(this._getSection()), this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateInProcessingInstruction = function (e) {
				">" === e && (this._cbs.onprocessinginstruction(this._getSection()), this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateBeforeComment = function (e) {
				"-" === e ? (this._state = D, this._sectionStart = this._index + 1) : this._state = E
			}, o.prototype._stateInComment = function (e) {
				"-" === e && (this._state = M)
			}, o.prototype._stateAfterComment1 = r("-", N, D), o.prototype._stateAfterComment2 = function (e) {
				">" === e ? (this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2)), this._state = d, this._sectionStart = this._index + 1) : "-" !== e && (this._state = D)
			}, o.prototype._stateBeforeCdata1 = r("C", O, E), o.prototype._stateBeforeCdata2 = r("D", F, E), o.prototype._stateBeforeCdata3 = r("A", H, E), o.prototype._stateBeforeCdata4 = r("T", j, E), o.prototype._stateBeforeCdata5 = r("A", I, E), o.prototype._stateBeforeCdata6 = function (e) {
				"[" === e ? (this._state = z, this._sectionStart = this._index + 1) : this._state = E
			}, o.prototype._stateInCdata = function (e) {
				"]" === e && (this._state = R)
			}, o.prototype._stateAfterCdata1 = r("]", W, z), o.prototype._stateAfterCdata2 = function (e) {
				">" === e ? (this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2)), this._state = d, this._sectionStart = this._index + 1) : "]" !== e && (this._state = z)
			}, o.prototype._stateBeforeSpecial = function (e) {
				"c" === e || "C" === e ? this._state = U : "t" === e || "T" === e ? this._state = et : (this._state = p, this._index--)
			}, o.prototype._stateBeforeSpecialEnd = function (e) {
				this._state = this._special !== mt || "c" !== e && "C" !== e ? this._special !== gt || "t" !== e && "T" !== e ? d : it : Y
			}, o.prototype._stateBeforeScript1 = i("R", V), o.prototype._stateBeforeScript2 = i("I", G), o.prototype._stateBeforeScript3 = i("P", $), o.prototype._stateBeforeScript4 = i("T", K), o.prototype._stateBeforeScript5 = function (e) {
				("/" === e || ">" === e || n(e)) && (this._special = mt), this._state = p, this._index--
			}, o.prototype._stateAfterScript1 = r("R", X, d), o.prototype._stateAfterScript2 = r("I", J, d), o.prototype._stateAfterScript3 = r("P", Z, d), o.prototype._stateAfterScript4 = r("T", Q, d), o.prototype._stateAfterScript5 = function (e) {
				">" === e || n(e) ? (this._special = pt, this._state = v, this._sectionStart = this._index - 6, this._index--) : this._state = d
			}, o.prototype._stateBeforeStyle1 = i("Y", tt), o.prototype._stateBeforeStyle2 = i("L", nt), o.prototype._stateBeforeStyle3 = i("E", rt), o.prototype._stateBeforeStyle4 = function (e) {
				("/" === e || ">" === e || n(e)) && (this._special = gt), this._state = p, this._index--
			}, o.prototype._stateAfterStyle1 = r("Y", ot, d), o.prototype._stateAfterStyle2 = r("L", at, d), o.prototype._stateAfterStyle3 = r("E", st, d), o.prototype._stateAfterStyle4 = function (e) {
				">" === e || n(e) ? (this._special = pt, this._state = v, this._sectionStart = this._index - 5, this._index--) : this._state = d
			}, o.prototype._stateBeforeEntity = r("#", ut, ct), o.prototype._stateBeforeNumericEntity = r("X", dt, ft), o.prototype._parseNamedEntityStrict = function () {
				if (this._sectionStart + 1 < this._index) {
					var e = this._buffer.substring(this._sectionStart + 1, this._index), t = this._xmlMode ? u : s;
					t.hasOwnProperty(e) && (this._emitPartial(t[e]), this._sectionStart = this._index + 1)
				}
			}, o.prototype._parseLegacyEntity = function () {
				var e = this._sectionStart + 1, t = this._index - e;
				for (t > 6 && (t = 6); t >= 2;) {
					var n = this._buffer.substr(e, t);
					if (l.hasOwnProperty(n)) return this._emitPartial(l[n]), this._sectionStart += t + 2, void 0;
					t--
				}
				this._sectionStart -= 1
			}, o.prototype._stateInNamedEntity = function (e) {
				";" === e ? (this._parseNamedEntityStrict(), this._sectionStart + 1 < this._index && !this._xmlMode && this._parseLegacyEntity(), this._state = this._baseState) : ("a" > e || e > "z") && ("A" > e || e > "Z") && ("0" > e || e > "9") && (this._xmlMode || (this._baseState !== d ? "=" !== e && (this._parseNamedEntityStrict(), this._sectionStart--) : (this._parseLegacyEntity(), this._sectionStart--)), this._state = this._baseState, this._index--)
			}, o.prototype._decodeNumericEntity = function (e, t) {
				var n = this._sectionStart + e;
				if (n !== this._index) {
					var r = this._buffer.substring(n, this._index), i = parseInt(r, t);
					i === i && (this._emitPartial(a(i)), this._sectionStart = this._index)
				}
				this._state = this._baseState
			}, o.prototype._stateInNumericEntity = function (e) {
				";" === e ? (this._decodeNumericEntity(2, 10), this._sectionStart++) : ("0" > e || e > "9") && (this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(2, 10), this._index--)
			}, o.prototype._stateInHexEntity = function (e) {
				";" === e ? (this._decodeNumericEntity(3, 16), this._sectionStart++) : ("a" > e || e > "f") && ("A" > e || e > "F") && ("0" > e || e > "9") && (this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(3, 16), this._index--)
			}, o.prototype._cleanup = function () {
				this._sectionStart < 0 ? (this._buffer = "", this._index = 0) : (this._state === d ? (this._sectionStart !== this._index && this._cbs.ontext(this._buffer.substr(this._sectionStart)), this._buffer = "", this._index = 0) : this._sectionStart === this._index ? (this._buffer = "", this._index = 0) : (this._buffer = this._buffer.substr(this._sectionStart), this._index -= this._sectionStart), this._sectionStart = 0)
			}, o.prototype.write = function (e) {
				for (this._buffer += e; this._index < this._buffer.length && this._running;) {
					var t = this._buffer.charAt(this._index);
					this._state === d ? this._stateText(t) : this._state === h ? this._stateBeforeTagName(t) : this._state === p ? this._stateInTagName(t) : this._state === g ? this._stateBeforeCloseingTagName(t) : this._state === v ? this._stateInCloseingTagName(t) : this._state === b ? this._stateAfterCloseingTagName(t) : this._state === m ? this._stateInSelfClosingTag(t) : this._state === y ? this._stateBeforeAttributeName(t) : this._state === w ? this._stateInAttributeName(t) : this._state === _ ? this._stateAfterAttributeName(t) : this._state === x ? this._stateBeforeAttributeValue(t) : this._state === k ? this._stateInAttributeValueDoubleQuotes(t) : this._state === S ? this._stateInAttributeValueSingleQuotes(t) : this._state === C ? this._stateInAttributeValueNoQuotes(t) : this._state === A ? this._stateBeforeDeclaration(t) : this._state === E ? this._stateInDeclaration(t) : this._state === L ? this._stateInProcessingInstruction(t) : this._state === T ? this._stateBeforeComment(t) : this._state === D ? this._stateInComment(t) : this._state === M ? this._stateAfterComment1(t) : this._state === N ? this._stateAfterComment2(t) : this._state === B ? this._stateBeforeCdata1(t) : this._state === O ? this._stateBeforeCdata2(t) : this._state === F ? this._stateBeforeCdata3(t) : this._state === H ? this._stateBeforeCdata4(t) : this._state === j ? this._stateBeforeCdata5(t) : this._state === I ? this._stateBeforeCdata6(t) : this._state === z ? this._stateInCdata(t) : this._state === R ? this._stateAfterCdata1(t) : this._state === W ? this._stateAfterCdata2(t) : this._state === P ? this._stateBeforeSpecial(t) : this._state === q ? this._stateBeforeSpecialEnd(t) : this._state === U ? this._stateBeforeScript1(t) : this._state === V ? this._stateBeforeScript2(t) : this._state === G ? this._stateBeforeScript3(t) : this._state === $ ? this._stateBeforeScript4(t) : this._state === K ? this._stateBeforeScript5(t) : this._state === Y ? this._stateAfterScript1(t) : this._state === X ? this._stateAfterScript2(t) : this._state === J ? this._stateAfterScript3(t) : this._state === Z ? this._stateAfterScript4(t) : this._state === Q ? this._stateAfterScript5(t) : this._state === et ? this._stateBeforeStyle1(t) : this._state === tt ? this._stateBeforeStyle2(t) : this._state === nt ? this._stateBeforeStyle3(t) : this._state === rt ? this._stateBeforeStyle4(t) : this._state === it ? this._stateAfterStyle1(t) : this._state === ot ? this._stateAfterStyle2(t) : this._state === at ? this._stateAfterStyle3(t) : this._state === st ? this._stateAfterStyle4(t) : this._state === lt ? this._stateBeforeEntity(t) : this._state === ut ? this._stateBeforeNumericEntity(t) : this._state === ct ? this._stateInNamedEntity(t) : this._state === ft ? this._stateInNumericEntity(t) : this._state === dt ? this._stateInHexEntity(t) : this._cbs.onerror(Error("unknown _state"), this._state), this._index++
				}
				this._cleanup()
			}, o.prototype.pause = function () {
				this._running = !1
			}, o.prototype.resume = function () {
				this._running = !0
			}, o.prototype.end = function (e) {
				e && this.write(e), this._sectionStart < this._index && this._handleTrailingData(), this._cbs.onend()
			}, o.prototype._handleTrailingData = function () {
				var e = this._buffer.substr(this._sectionStart);
				this._state === z || this._state === R || this._state === W ? this._cbs.oncdata(e) : this._state === D || this._state === M || this._state === N ? this._cbs.oncomment(e) : this._state === p ? this._cbs.onopentagname(e) : this._state === y || this._state === x || this._state === _ ? this._cbs.onopentagend() : this._state === w ? this._cbs.onattribname(e) : this._state === S || this._state === k || this._state === C ? (this._cbs.onattribdata(e), this._cbs.onattribend()) : this._state === v ? this._cbs.onclosetag(e) : this._state !== ct || this._xmlMode ? this._state !== ft || this._xmlMode ? this._state !== dt || this._xmlMode ? this._cbs.ontext(e) : (this._decodeNumericEntity(3, 16), this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData())) : (this._decodeNumericEntity(2, 10), this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData())) : (this._parseLegacyEntity(), --this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData()))
			}, o.prototype.reset = function () {
				o.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs)
			}, o.prototype._getSection = function () {
				return this._buffer.substring(this._sectionStart, this._index)
			}, o.prototype._emitToken = function (e) {
				this._cbs[e](this._getSection()), this._sectionStart = -1
			}, o.prototype._emitPartial = function (e) {
				this._baseState !== d ? this._cbs.onattribdata(e) : this._cbs.ontext(e)
			}
		}, {
			"./entities/decode.json": 30,
			"./entities/entities.json": 31,
			"./entities/legacy.json": 32,
			"./entities/xml.json": 33
		}], 29: [function (e, t) {
			function n(e, t) {
				var n = this._parser = new r(e, t);
				i.call(this, {decodeStrings: !1}), this.once("finish", function () {
					n.end()
				})
			}

			t.exports = n;
			var r = e("./Parser.js"), i = e("stream").Writable || e("readable-stream").Writable;
			e("util").inherits(n, i), i.prototype._write = function (e, t, n) {
				this._parser.write(e), n()
			}
		}, {"./Parser.js": 25, "readable-stream": 46, stream: 9, util: 17}], 30: [function (e, t) {
			t.exports = {
				0: "�",
				128: "€",
				130: "‚",
				131: "ƒ",
				132: "„",
				133: "…",
				134: "†",
				135: "‡",
				136: "ˆ",
				137: "‰",
				138: "Š",
				139: "‹",
				140: "Œ",
				142: "Ž",
				145: "‘",
				146: "’",
				147: "“",
				148: "”",
				149: "•",
				150: "–",
				151: "—",
				152: "˜",
				153: "™",
				154: "š",
				155: "›",
				156: "œ",
				158: "ž",
				159: "Ÿ"
			}
		}, {}], 31: [function (e, t) {
			t.exports = {
				Aacute: "Á",
				aacute: "á",
				Abreve: "Ă",
				abreve: "ă",
				ac: "∾",
				acd: "∿",
				acE: "∾̳",
				Acirc: "Â",
				acirc: "â",
				acute: "´",
				Acy: "А",
				acy: "а",
				AElig: "Æ",
				aelig: "æ",
				af: "⁡",
				Afr: "𝔄",
				afr: "𝔞",
				Agrave: "À",
				agrave: "à",
				alefsym: "ℵ",
				aleph: "ℵ",
				Alpha: "Α",
				alpha: "α",
				Amacr: "Ā",
				amacr: "ā",
				amalg: "⨿",
				amp: "&",
				AMP: "&",
				andand: "⩕",
				And: "⩓",
				and: "∧",
				andd: "⩜",
				andslope: "⩘",
				andv: "⩚",
				ang: "∠",
				ange: "⦤",
				angle: "∠",
				angmsdaa: "⦨",
				angmsdab: "⦩",
				angmsdac: "⦪",
				angmsdad: "⦫",
				angmsdae: "⦬",
				angmsdaf: "⦭",
				angmsdag: "⦮",
				angmsdah: "⦯",
				angmsd: "∡",
				angrt: "∟",
				angrtvb: "⊾",
				angrtvbd: "⦝",
				angsph: "∢",
				angst: "Å",
				angzarr: "⍼",
				Aogon: "Ą",
				aogon: "ą",
				Aopf: "𝔸",
				aopf: "𝕒",
				apacir: "⩯",
				ap: "≈",
				apE: "⩰",
				ape: "≊",
				apid: "≋",
				apos: "'",
				ApplyFunction: "⁡",
				approx: "≈",
				approxeq: "≊",
				Aring: "Å",
				aring: "å",
				Ascr: "𝒜",
				ascr: "𝒶",
				Assign: "≔",
				ast: "*",
				asymp: "≈",
				asympeq: "≍",
				Atilde: "Ã",
				atilde: "ã",
				Auml: "Ä",
				auml: "ä",
				awconint: "∳",
				awint: "⨑",
				backcong: "≌",
				backepsilon: "϶",
				backprime: "‵",
				backsim: "∽",
				backsimeq: "⋍",
				Backslash: "∖",
				Barv: "⫧",
				barvee: "⊽",
				barwed: "⌅",
				Barwed: "⌆",
				barwedge: "⌅",
				bbrk: "⎵",
				bbrktbrk: "⎶",
				bcong: "≌",
				Bcy: "Б",
				bcy: "б",
				bdquo: "„",
				becaus: "∵",
				because: "∵",
				Because: "∵",
				bemptyv: "⦰",
				bepsi: "϶",
				bernou: "ℬ",
				Bernoullis: "ℬ",
				Beta: "Β",
				beta: "β",
				beth: "ℶ",
				between: "≬",
				Bfr: "𝔅",
				bfr: "𝔟",
				bigcap: "⋂",
				bigcirc: "◯",
				bigcup: "⋃",
				bigodot: "⨀",
				bigoplus: "⨁",
				bigotimes: "⨂",
				bigsqcup: "⨆",
				bigstar: "★",
				bigtriangledown: "▽",
				bigtriangleup: "△",
				biguplus: "⨄",
				bigvee: "⋁",
				bigwedge: "⋀",
				bkarow: "⤍",
				blacklozenge: "⧫",
				blacksquare: "▪",
				blacktriangle: "▴",
				blacktriangledown: "▾",
				blacktriangleleft: "◂",
				blacktriangleright: "▸",
				blank: "␣",
				blk12: "▒",
				blk14: "░",
				blk34: "▓",
				block: "█",
				bne: "=⃥",
				bnequiv: "≡⃥",
				bNot: "⫭",
				bnot: "⌐",
				Bopf: "𝔹",
				bopf: "𝕓",
				bot: "⊥",
				bottom: "⊥",
				bowtie: "⋈",
				boxbox: "⧉",
				boxdl: "┐",
				boxdL: "╕",
				boxDl: "╖",
				boxDL: "╗",
				boxdr: "┌",
				boxdR: "╒",
				boxDr: "╓",
				boxDR: "╔",
				boxh: "─",
				boxH: "═",
				boxhd: "┬",
				boxHd: "╤",
				boxhD: "╥",
				boxHD: "╦",
				boxhu: "┴",
				boxHu: "╧",
				boxhU: "╨",
				boxHU: "╩",
				boxminus: "⊟",
				boxplus: "⊞",
				boxtimes: "⊠",
				boxul: "┘",
				boxuL: "╛",
				boxUl: "╜",
				boxUL: "╝",
				boxur: "└",
				boxuR: "╘",
				boxUr: "╙",
				boxUR: "╚",
				boxv: "│",
				boxV: "║",
				boxvh: "┼",
				boxvH: "╪",
				boxVh: "╫",
				boxVH: "╬",
				boxvl: "┤",
				boxvL: "╡",
				boxVl: "╢",
				boxVL: "╣",
				boxvr: "├",
				boxvR: "╞",
				boxVr: "╟",
				boxVR: "╠",
				bprime: "‵",
				breve: "˘",
				Breve: "˘",
				brvbar: "¦",
				bscr: "𝒷",
				Bscr: "ℬ",
				bsemi: "⁏",
				bsim: "∽",
				bsime: "⋍",
				bsolb: "⧅",
				bsol: "\\",
				bsolhsub: "⟈",
				bull: "•",
				bullet: "•",
				bump: "≎",
				bumpE: "⪮",
				bumpe: "≏",
				Bumpeq: "≎",
				bumpeq: "≏",
				Cacute: "Ć",
				cacute: "ć",
				capand: "⩄",
				capbrcup: "⩉",
				capcap: "⩋",
				cap: "∩",
				Cap: "⋒",
				capcup: "⩇",
				capdot: "⩀",
				CapitalDifferentialD: "ⅅ",
				caps: "∩︀",
				caret: "⁁",
				caron: "ˇ",
				Cayleys: "ℭ",
				ccaps: "⩍",
				Ccaron: "Č",
				ccaron: "č",
				Ccedil: "Ç",
				ccedil: "ç",
				Ccirc: "Ĉ",
				ccirc: "ĉ",
				Cconint: "∰",
				ccups: "⩌",
				ccupssm: "⩐",
				Cdot: "Ċ",
				cdot: "ċ",
				cedil: "¸",
				Cedilla: "¸",
				cemptyv: "⦲",
				cent: "¢",
				centerdot: "·",
				CenterDot: "·",
				cfr: "𝔠",
				Cfr: "ℭ",
				CHcy: "Ч",
				chcy: "ч",
				check: "✓",
				checkmark: "✓",
				Chi: "Χ",
				chi: "χ",
				circ: "ˆ",
				circeq: "≗",
				circlearrowleft: "↺",
				circlearrowright: "↻",
				circledast: "⊛",
				circledcirc: "⊚",
				circleddash: "⊝",
				CircleDot: "⊙",
				circledR: "®",
				circledS: "Ⓢ",
				CircleMinus: "⊖",
				CirclePlus: "⊕",
				CircleTimes: "⊗",
				cir: "○",
				cirE: "⧃",
				cire: "≗",
				cirfnint: "⨐",
				cirmid: "⫯",
				cirscir: "⧂",
				ClockwiseContourIntegral: "∲",
				CloseCurlyDoubleQuote: "”",
				CloseCurlyQuote: "’",
				clubs: "♣",
				clubsuit: "♣",
				colon: ":",
				Colon: "∷",
				Colone: "⩴",
				colone: "≔",
				coloneq: "≔",
				comma: ",",
				commat: "@",
				comp: "∁",
				compfn: "∘",
				complement: "∁",
				complexes: "ℂ",
				cong: "≅",
				congdot: "⩭",
				Congruent: "≡",
				conint: "∮",
				Conint: "∯",
				ContourIntegral: "∮",
				copf: "𝕔",
				Copf: "ℂ",
				coprod: "∐",
				Coproduct: "∐",
				copy: "©",
				COPY: "©",
				copysr: "℗",
				CounterClockwiseContourIntegral: "∳",
				crarr: "↵",
				cross: "✗",
				Cross: "⨯",
				Cscr: "𝒞",
				cscr: "𝒸",
				csub: "⫏",
				csube: "⫑",
				csup: "⫐",
				csupe: "⫒",
				ctdot: "⋯",
				cudarrl: "⤸",
				cudarrr: "⤵",
				cuepr: "⋞",
				cuesc: "⋟",
				cularr: "↶",
				cularrp: "⤽",
				cupbrcap: "⩈",
				cupcap: "⩆",
				CupCap: "≍",
				cup: "∪",
				Cup: "⋓",
				cupcup: "⩊",
				cupdot: "⊍",
				cupor: "⩅",
				cups: "∪︀",
				curarr: "↷",
				curarrm: "⤼",
				curlyeqprec: "⋞",
				curlyeqsucc: "⋟",
				curlyvee: "⋎",
				curlywedge: "⋏",
				curren: "¤",
				curvearrowleft: "↶",
				curvearrowright: "↷",
				cuvee: "⋎",
				cuwed: "⋏",
				cwconint: "∲",
				cwint: "∱",
				cylcty: "⌭",
				dagger: "†",
				Dagger: "‡",
				daleth: "ℸ",
				darr: "↓",
				Darr: "↡",
				dArr: "⇓",
				dash: "‐",
				Dashv: "⫤",
				dashv: "⊣",
				dbkarow: "⤏",
				dblac: "˝",
				Dcaron: "Ď",
				dcaron: "ď",
				Dcy: "Д",
				dcy: "д",
				ddagger: "‡",
				ddarr: "⇊",
				DD: "ⅅ",
				dd: "ⅆ",
				DDotrahd: "⤑",
				ddotseq: "⩷",
				deg: "°",
				Del: "∇",
				Delta: "Δ",
				delta: "δ",
				demptyv: "⦱",
				dfisht: "⥿",
				Dfr: "𝔇",
				dfr: "𝔡",
				dHar: "⥥",
				dharl: "⇃",
				dharr: "⇂",
				DiacriticalAcute: "´",
				DiacriticalDot: "˙",
				DiacriticalDoubleAcute: "˝",
				DiacriticalGrave: "`",
				DiacriticalTilde: "˜",
				diam: "⋄",
				diamond: "⋄",
				Diamond: "⋄",
				diamondsuit: "♦",
				diams: "♦",
				die: "¨",
				DifferentialD: "ⅆ",
				digamma: "ϝ",
				disin: "⋲",
				div: "÷",
				divide: "÷",
				divideontimes: "⋇",
				divonx: "⋇",
				DJcy: "Ђ",
				djcy: "ђ",
				dlcorn: "⌞",
				dlcrop: "⌍",
				dollar: "$",
				Dopf: "𝔻",
				dopf: "𝕕",
				Dot: "¨",
				dot: "˙",
				DotDot: "⃜",
				doteq: "≐",
				doteqdot: "≑",
				DotEqual: "≐",
				dotminus: "∸",
				dotplus: "∔",
				dotsquare: "⊡",
				doublebarwedge: "⌆",
				DoubleContourIntegral: "∯",
				DoubleDot: "¨",
				DoubleDownArrow: "⇓",
				DoubleLeftArrow: "⇐",
				DoubleLeftRightArrow: "⇔",
				DoubleLeftTee: "⫤",
				DoubleLongLeftArrow: "⟸",
				DoubleLongLeftRightArrow: "⟺",
				DoubleLongRightArrow: "⟹",
				DoubleRightArrow: "⇒",
				DoubleRightTee: "⊨",
				DoubleUpArrow: "⇑",
				DoubleUpDownArrow: "⇕",
				DoubleVerticalBar: "∥",
				DownArrowBar: "⤓",
				downarrow: "↓",
				DownArrow: "↓",
				Downarrow: "⇓",
				DownArrowUpArrow: "⇵",
				DownBreve: "̑",
				downdownarrows: "⇊",
				downharpoonleft: "⇃",
				downharpoonright: "⇂",
				DownLeftRightVector: "⥐",
				DownLeftTeeVector: "⥞",
				DownLeftVectorBar: "⥖",
				DownLeftVector: "↽",
				DownRightTeeVector: "⥟",
				DownRightVectorBar: "⥗",
				DownRightVector: "⇁",
				DownTeeArrow: "↧",
				DownTee: "⊤",
				drbkarow: "⤐",
				drcorn: "⌟",
				drcrop: "⌌",
				Dscr: "𝒟",
				dscr: "𝒹",
				DScy: "Ѕ",
				dscy: "ѕ",
				dsol: "⧶",
				Dstrok: "Đ",
				dstrok: "đ",
				dtdot: "⋱",
				dtri: "▿",
				dtrif: "▾",
				duarr: "⇵",
				duhar: "⥯",
				dwangle: "⦦",
				DZcy: "Џ",
				dzcy: "џ",
				dzigrarr: "⟿",
				Eacute: "É",
				eacute: "é",
				easter: "⩮",
				Ecaron: "Ě",
				ecaron: "ě",
				Ecirc: "Ê",
				ecirc: "ê",
				ecir: "≖",
				ecolon: "≕",
				Ecy: "Э",
				ecy: "э",
				eDDot: "⩷",
				Edot: "Ė",
				edot: "ė",
				eDot: "≑",
				ee: "ⅇ",
				efDot: "≒",
				Efr: "𝔈",
				efr: "𝔢",
				eg: "⪚",
				Egrave: "È",
				egrave: "è",
				egs: "⪖",
				egsdot: "⪘",
				el: "⪙",
				Element: "∈",
				elinters: "⏧",
				ell: "ℓ",
				els: "⪕",
				elsdot: "⪗",
				Emacr: "Ē",
				emacr: "ē",
				empty: "∅",
				emptyset: "∅",
				EmptySmallSquare: "◻",
				emptyv: "∅",
				EmptyVerySmallSquare: "▫",
				emsp13: " ",
				emsp14: " ",
				emsp: " ",
				ENG: "Ŋ",
				eng: "ŋ",
				ensp: " ",
				Eogon: "Ę",
				eogon: "ę",
				Eopf: "𝔼",
				eopf: "𝕖",
				epar: "⋕",
				eparsl: "⧣",
				eplus: "⩱",
				epsi: "ε",
				Epsilon: "Ε",
				epsilon: "ε",
				epsiv: "ϵ",
				eqcirc: "≖",
				eqcolon: "≕",
				eqsim: "≂",
				eqslantgtr: "⪖",
				eqslantless: "⪕",
				Equal: "⩵",
				equals: "=",
				EqualTilde: "≂",
				equest: "≟",
				Equilibrium: "⇌",
				equiv: "≡",
				equivDD: "⩸",
				eqvparsl: "⧥",
				erarr: "⥱",
				erDot: "≓",
				escr: "ℯ",
				Escr: "ℰ",
				esdot: "≐",
				Esim: "⩳",
				esim: "≂",
				Eta: "Η",
				eta: "η",
				ETH: "Ð",
				eth: "ð",
				Euml: "Ë",
				euml: "ë",
				euro: "€",
				excl: "!",
				exist: "∃",
				Exists: "∃",
				expectation: "ℰ",
				exponentiale: "ⅇ",
				ExponentialE: "ⅇ",
				fallingdotseq: "≒",
				Fcy: "Ф",
				fcy: "ф",
				female: "♀",
				ffilig: "ﬃ",
				fflig: "ﬀ",
				ffllig: "ﬄ",
				Ffr: "𝔉",
				ffr: "𝔣",
				filig: "ﬁ",
				FilledSmallSquare: "◼",
				FilledVerySmallSquare: "▪",
				fjlig: "fj",
				flat: "♭",
				fllig: "ﬂ",
				fltns: "▱",
				fnof: "ƒ",
				Fopf: "𝔽",
				fopf: "𝕗",
				forall: "∀",
				ForAll: "∀",
				fork: "⋔",
				forkv: "⫙",
				Fouriertrf: "ℱ",
				fpartint: "⨍",
				frac12: "½",
				frac13: "⅓",
				frac14: "¼",
				frac15: "⅕",
				frac16: "⅙",
				frac18: "⅛",
				frac23: "⅔",
				frac25: "⅖",
				frac34: "¾",
				frac35: "⅗",
				frac38: "⅜",
				frac45: "⅘",
				frac56: "⅚",
				frac58: "⅝",
				frac78: "⅞",
				frasl: "⁄",
				frown: "⌢",
				fscr: "𝒻",
				Fscr: "ℱ",
				gacute: "ǵ",
				Gamma: "Γ",
				gamma: "γ",
				Gammad: "Ϝ",
				gammad: "ϝ",
				gap: "⪆",
				Gbreve: "Ğ",
				gbreve: "ğ",
				Gcedil: "Ģ",
				Gcirc: "Ĝ",
				gcirc: "ĝ",
				Gcy: "Г",
				gcy: "г",
				Gdot: "Ġ",
				gdot: "ġ",
				ge: "≥",
				gE: "≧",
				gEl: "⪌",
				gel: "⋛",
				geq: "≥",
				geqq: "≧",
				geqslant: "⩾",
				gescc: "⪩",
				ges: "⩾",
				gesdot: "⪀",
				gesdoto: "⪂",
				gesdotol: "⪄",
				gesl: "⋛︀",
				gesles: "⪔",
				Gfr: "𝔊",
				gfr: "𝔤",
				gg: "≫",
				Gg: "⋙",
				ggg: "⋙",
				gimel: "ℷ",
				GJcy: "Ѓ",
				gjcy: "ѓ",
				gla: "⪥",
				gl: "≷",
				glE: "⪒",
				glj: "⪤",
				gnap: "⪊",
				gnapprox: "⪊",
				gne: "⪈",
				gnE: "≩",
				gneq: "⪈",
				gneqq: "≩",
				gnsim: "⋧",
				Gopf: "𝔾",
				gopf: "𝕘",
				grave: "`",
				GreaterEqual: "≥",
				GreaterEqualLess: "⋛",
				GreaterFullEqual: "≧",
				GreaterGreater: "⪢",
				GreaterLess: "≷",
				GreaterSlantEqual: "⩾",
				GreaterTilde: "≳",
				Gscr: "𝒢",
				gscr: "ℊ",
				gsim: "≳",
				gsime: "⪎",
				gsiml: "⪐",
				gtcc: "⪧",
				gtcir: "⩺",
				gt: ">",
				GT: ">",
				Gt: "≫",
				gtdot: "⋗",
				gtlPar: "⦕",
				gtquest: "⩼",
				gtrapprox: "⪆",
				gtrarr: "⥸",
				gtrdot: "⋗",
				gtreqless: "⋛",
				gtreqqless: "⪌",
				gtrless: "≷",
				gtrsim: "≳",
				gvertneqq: "≩︀",
				gvnE: "≩︀",
				Hacek: "ˇ",
				hairsp: " ",
				half: "½",
				hamilt: "ℋ",
				HARDcy: "Ъ",
				hardcy: "ъ",
				harrcir: "⥈",
				harr: "↔",
				hArr: "⇔",
				harrw: "↭",
				Hat: "^",
				hbar: "ℏ",
				Hcirc: "Ĥ",
				hcirc: "ĥ",
				hearts: "♥",
				heartsuit: "♥",
				hellip: "…",
				hercon: "⊹",
				hfr: "𝔥",
				Hfr: "ℌ",
				HilbertSpace: "ℋ",
				hksearow: "⤥",
				hkswarow: "⤦",
				hoarr: "⇿",
				homtht: "∻",
				hookleftarrow: "↩",
				hookrightarrow: "↪",
				hopf: "𝕙",
				Hopf: "ℍ",
				horbar: "―",
				HorizontalLine: "─",
				hscr: "𝒽",
				Hscr: "ℋ",
				hslash: "ℏ",
				Hstrok: "Ħ",
				hstrok: "ħ",
				HumpDownHump: "≎",
				HumpEqual: "≏",
				hybull: "⁃",
				hyphen: "‐",
				Iacute: "Í",
				iacute: "í",
				ic: "⁣",
				Icirc: "Î",
				icirc: "î",
				Icy: "И",
				icy: "и",
				Idot: "İ",
				IEcy: "Е",
				iecy: "е",
				iexcl: "¡",
				iff: "⇔",
				ifr: "𝔦",
				Ifr: "ℑ",
				Igrave: "Ì",
				igrave: "ì",
				ii: "ⅈ",
				iiiint: "⨌",
				iiint: "∭",
				iinfin: "⧜",
				iiota: "℩",
				IJlig: "Ĳ",
				ijlig: "ĳ",
				Imacr: "Ī",
				imacr: "ī",
				image: "ℑ",
				ImaginaryI: "ⅈ",
				imagline: "ℐ",
				imagpart: "ℑ",
				imath: "ı",
				Im: "ℑ",
				imof: "⊷",
				imped: "Ƶ",
				Implies: "⇒",
				incare: "℅",
				"in": "∈",
				infin: "∞",
				infintie: "⧝",
				inodot: "ı",
				intcal: "⊺",
				"int": "∫",
				Int: "∬",
				integers: "ℤ",
				Integral: "∫",
				intercal: "⊺",
				Intersection: "⋂",
				intlarhk: "⨗",
				intprod: "⨼",
				InvisibleComma: "⁣",
				InvisibleTimes: "⁢",
				IOcy: "Ё",
				iocy: "ё",
				Iogon: "Į",
				iogon: "į",
				Iopf: "𝕀",
				iopf: "𝕚",
				Iota: "Ι",
				iota: "ι",
				iprod: "⨼",
				iquest: "¿",
				iscr: "𝒾",
				Iscr: "ℐ",
				isin: "∈",
				isindot: "⋵",
				isinE: "⋹",
				isins: "⋴",
				isinsv: "⋳",
				isinv: "∈",
				it: "⁢",
				Itilde: "Ĩ",
				itilde: "ĩ",
				Iukcy: "І",
				iukcy: "і",
				Iuml: "Ï",
				iuml: "ï",
				Jcirc: "Ĵ",
				jcirc: "ĵ",
				Jcy: "Й",
				jcy: "й",
				Jfr: "𝔍",
				jfr: "𝔧",
				jmath: "ȷ",
				Jopf: "𝕁",
				jopf: "𝕛",
				Jscr: "𝒥",
				jscr: "𝒿",
				Jsercy: "Ј",
				jsercy: "ј",
				Jukcy: "Є",
				jukcy: "є",
				Kappa: "Κ",
				kappa: "κ",
				kappav: "ϰ",
				Kcedil: "Ķ",
				kcedil: "ķ",
				Kcy: "К",
				kcy: "к",
				Kfr: "𝔎",
				kfr: "𝔨",
				kgreen: "ĸ",
				KHcy: "Х",
				khcy: "х",
				KJcy: "Ќ",
				kjcy: "ќ",
				Kopf: "𝕂",
				kopf: "𝕜",
				Kscr: "𝒦",
				kscr: "𝓀",
				lAarr: "⇚",
				Lacute: "Ĺ",
				lacute: "ĺ",
				laemptyv: "⦴",
				lagran: "ℒ",
				Lambda: "Λ",
				lambda: "λ",
				lang: "⟨",
				Lang: "⟪",
				langd: "⦑",
				langle: "⟨",
				lap: "⪅",
				Laplacetrf: "ℒ",
				laquo: "«",
				larrb: "⇤",
				larrbfs: "⤟",
				larr: "←",
				Larr: "↞",
				lArr: "⇐",
				larrfs: "⤝",
				larrhk: "↩",
				larrlp: "↫",
				larrpl: "⤹",
				larrsim: "⥳",
				larrtl: "↢",
				latail: "⤙",
				lAtail: "⤛",
				lat: "⪫",
				late: "⪭",
				lates: "⪭︀",
				lbarr: "⤌",
				lBarr: "⤎",
				lbbrk: "❲",
				lbrace: "{",
				lbrack: "[",
				lbrke: "⦋",
				lbrksld: "⦏",
				lbrkslu: "⦍",
				Lcaron: "Ľ",
				lcaron: "ľ",
				Lcedil: "Ļ",
				lcedil: "ļ",
				lceil: "⌈",
				lcub: "{",
				Lcy: "Л",
				lcy: "л",
				ldca: "⤶",
				ldquo: "“",
				ldquor: "„",
				ldrdhar: "⥧",
				ldrushar: "⥋",
				ldsh: "↲",
				le: "≤",
				lE: "≦",
				LeftAngleBracket: "⟨",
				LeftArrowBar: "⇤",
				leftarrow: "←",
				LeftArrow: "←",
				Leftarrow: "⇐",
				LeftArrowRightArrow: "⇆",
				leftarrowtail: "↢",
				LeftCeiling: "⌈",
				LeftDoubleBracket: "⟦",
				LeftDownTeeVector: "⥡",
				LeftDownVectorBar: "⥙",
				LeftDownVector: "⇃",
				LeftFloor: "⌊",
				leftharpoondown: "↽",
				leftharpoonup: "↼",
				leftleftarrows: "⇇",
				leftrightarrow: "↔",
				LeftRightArrow: "↔",
				Leftrightarrow: "⇔",
				leftrightarrows: "⇆",
				leftrightharpoons: "⇋",
				leftrightsquigarrow: "↭",
				LeftRightVector: "⥎",
				LeftTeeArrow: "↤",
				LeftTee: "⊣",
				LeftTeeVector: "⥚",
				leftthreetimes: "⋋",
				LeftTriangleBar: "⧏",
				LeftTriangle: "⊲",
				LeftTriangleEqual: "⊴",
				LeftUpDownVector: "⥑",
				LeftUpTeeVector: "⥠",
				LeftUpVectorBar: "⥘",
				LeftUpVector: "↿",
				LeftVectorBar: "⥒",
				LeftVector: "↼",
				lEg: "⪋",
				leg: "⋚",
				leq: "≤",
				leqq: "≦",
				leqslant: "⩽",
				lescc: "⪨",
				les: "⩽",
				lesdot: "⩿",
				lesdoto: "⪁",
				lesdotor: "⪃",
				lesg: "⋚︀",
				lesges: "⪓",
				lessapprox: "⪅",
				lessdot: "⋖",
				lesseqgtr: "⋚",
				lesseqqgtr: "⪋",
				LessEqualGreater: "⋚",
				LessFullEqual: "≦",
				LessGreater: "≶",
				lessgtr: "≶",
				LessLess: "⪡",
				lesssim: "≲",
				LessSlantEqual: "⩽",
				LessTilde: "≲",
				lfisht: "⥼",
				lfloor: "⌊",
				Lfr: "𝔏",
				lfr: "𝔩",
				lg: "≶",
				lgE: "⪑",
				lHar: "⥢",
				lhard: "↽",
				lharu: "↼",
				lharul: "⥪",
				lhblk: "▄",
				LJcy: "Љ",
				ljcy: "љ",
				llarr: "⇇",
				ll: "≪",
				Ll: "⋘",
				llcorner: "⌞",
				Lleftarrow: "⇚",
				llhard: "⥫",
				lltri: "◺",
				Lmidot: "Ŀ",
				lmidot: "ŀ",
				lmoustache: "⎰",
				lmoust: "⎰",
				lnap: "⪉",
				lnapprox: "⪉",
				lne: "⪇",
				lnE: "≨",
				lneq: "⪇",
				lneqq: "≨",
				lnsim: "⋦",
				loang: "⟬",
				loarr: "⇽",
				lobrk: "⟦",
				longleftarrow: "⟵",
				LongLeftArrow: "⟵",
				Longleftarrow: "⟸",
				longleftrightarrow: "⟷",
				LongLeftRightArrow: "⟷",
				Longleftrightarrow: "⟺",
				longmapsto: "⟼",
				longrightarrow: "⟶",
				LongRightArrow: "⟶",
				Longrightarrow: "⟹",
				looparrowleft: "↫",
				looparrowright: "↬",
				lopar: "⦅",
				Lopf: "𝕃",
				lopf: "𝕝",
				loplus: "⨭",
				lotimes: "⨴",
				lowast: "∗",
				lowbar: "_",
				LowerLeftArrow: "↙",
				LowerRightArrow: "↘",
				loz: "◊",
				lozenge: "◊",
				lozf: "⧫",
				lpar: "(",
				lparlt: "⦓",
				lrarr: "⇆",
				lrcorner: "⌟",
				lrhar: "⇋",
				lrhard: "⥭",
				lrm: "‎",
				lrtri: "⊿",
				lsaquo: "‹",
				lscr: "𝓁",
				Lscr: "ℒ",
				lsh: "↰",
				Lsh: "↰",
				lsim: "≲",
				lsime: "⪍",
				lsimg: "⪏",
				lsqb: "[",
				lsquo: "‘",
				lsquor: "‚",
				Lstrok: "Ł",
				lstrok: "ł",
				ltcc: "⪦",
				ltcir: "⩹",
				lt: "<",
				LT: "<",
				Lt: "≪",
				ltdot: "⋖",
				lthree: "⋋",
				ltimes: "⋉",
				ltlarr: "⥶",
				ltquest: "⩻",
				ltri: "◃",
				ltrie: "⊴",
				ltrif: "◂",
				ltrPar: "⦖",
				lurdshar: "⥊",
				luruhar: "⥦",
				lvertneqq: "≨︀",
				lvnE: "≨︀",
				macr: "¯",
				male: "♂",
				malt: "✠",
				maltese: "✠",
				Map: "⤅",
				map: "↦",
				mapsto: "↦",
				mapstodown: "↧",
				mapstoleft: "↤",
				mapstoup: "↥",
				marker: "▮",
				mcomma: "⨩",
				Mcy: "М",
				mcy: "м",
				mdash: "—",
				mDDot: "∺",
				measuredangle: "∡",
				MediumSpace: " ",
				Mellintrf: "ℳ",
				Mfr: "𝔐",
				mfr: "𝔪",
				mho: "℧",
				micro: "µ",
				midast: "*",
				midcir: "⫰",
				mid: "∣",
				middot: "·",
				minusb: "⊟",
				minus: "−",
				minusd: "∸",
				minusdu: "⨪",
				MinusPlus: "∓",
				mlcp: "⫛",
				mldr: "…",
				mnplus: "∓",
				models: "⊧",
				Mopf: "𝕄",
				mopf: "𝕞",
				mp: "∓",
				mscr: "𝓂",
				Mscr: "ℳ",
				mstpos: "∾",
				Mu: "Μ",
				mu: "μ",
				multimap: "⊸",
				mumap: "⊸",
				nabla: "∇",
				Nacute: "Ń",
				nacute: "ń",
				nang: "∠⃒",
				nap: "≉",
				napE: "⩰̸",
				napid: "≋̸",
				napos: "ŉ",
				napprox: "≉",
				natural: "♮",
				naturals: "ℕ",
				natur: "♮",
				nbsp: " ",
				nbump: "≎̸",
				nbumpe: "≏̸",
				ncap: "⩃",
				Ncaron: "Ň",
				ncaron: "ň",
				Ncedil: "Ņ",
				ncedil: "ņ",
				ncong: "≇",
				ncongdot: "⩭̸",
				ncup: "⩂",
				Ncy: "Н",
				ncy: "н",
				ndash: "–",
				nearhk: "⤤",
				nearr: "↗",
				neArr: "⇗",
				nearrow: "↗",
				ne: "≠",
				nedot: "≐̸",
				NegativeMediumSpace: "​",
				NegativeThickSpace: "​",
				NegativeThinSpace: "​",
				NegativeVeryThinSpace: "​",
				nequiv: "≢",
				nesear: "⤨",
				nesim: "≂̸",
				NestedGreaterGreater: "≫",
				NestedLessLess: "≪",
				NewLine: "\n",
				nexist: "∄",
				nexists: "∄",
				Nfr: "𝔑",
				nfr: "𝔫",
				ngE: "≧̸",
				nge: "≱",
				ngeq: "≱",
				ngeqq: "≧̸",
				ngeqslant: "⩾̸",
				nges: "⩾̸",
				nGg: "⋙̸",
				ngsim: "≵",
				nGt: "≫⃒",
				ngt: "≯",
				ngtr: "≯",
				nGtv: "≫̸",
				nharr: "↮",
				nhArr: "⇎",
				nhpar: "⫲",
				ni: "∋",
				nis: "⋼",
				nisd: "⋺",
				niv: "∋",
				NJcy: "Њ",
				njcy: "њ",
				nlarr: "↚",
				nlArr: "⇍",
				nldr: "‥",
				nlE: "≦̸",
				nle: "≰",
				nleftarrow: "↚",
				nLeftarrow: "⇍",
				nleftrightarrow: "↮",
				nLeftrightarrow: "⇎",
				nleq: "≰",
				nleqq: "≦̸",
				nleqslant: "⩽̸",
				nles: "⩽̸",
				nless: "≮",
				nLl: "⋘̸",
				nlsim: "≴",
				nLt: "≪⃒",
				nlt: "≮",
				nltri: "⋪",
				nltrie: "⋬",
				nLtv: "≪̸",
				nmid: "∤",
				NoBreak: "⁠",
				NonBreakingSpace: " ",
				nopf: "𝕟",
				Nopf: "ℕ",
				Not: "⫬",
				not: "¬",
				NotCongruent: "≢",
				NotCupCap: "≭",
				NotDoubleVerticalBar: "∦",
				NotElement: "∉",
				NotEqual: "≠",
				NotEqualTilde: "≂̸",
				NotExists: "∄",
				NotGreater: "≯",
				NotGreaterEqual: "≱",
				NotGreaterFullEqual: "≧̸",
				NotGreaterGreater: "≫̸",
				NotGreaterLess: "≹",
				NotGreaterSlantEqual: "⩾̸",
				NotGreaterTilde: "≵",
				NotHumpDownHump: "≎̸",
				NotHumpEqual: "≏̸",
				notin: "∉",
				notindot: "⋵̸",
				notinE: "⋹̸",
				notinva: "∉",
				notinvb: "⋷",
				notinvc: "⋶",
				NotLeftTriangleBar: "⧏̸",
				NotLeftTriangle: "⋪",
				NotLeftTriangleEqual: "⋬",
				NotLess: "≮",
				NotLessEqual: "≰",
				NotLessGreater: "≸",
				NotLessLess: "≪̸",
				NotLessSlantEqual: "⩽̸",
				NotLessTilde: "≴",
				NotNestedGreaterGreater: "⪢̸",
				NotNestedLessLess: "⪡̸",
				notni: "∌",
				notniva: "∌",
				notnivb: "⋾",
				notnivc: "⋽",
				NotPrecedes: "⊀",
				NotPrecedesEqual: "⪯̸",
				NotPrecedesSlantEqual: "⋠",
				NotReverseElement: "∌",
				NotRightTriangleBar: "⧐̸",
				NotRightTriangle: "⋫",
				NotRightTriangleEqual: "⋭",
				NotSquareSubset: "⊏̸",
				NotSquareSubsetEqual: "⋢",
				NotSquareSuperset: "⊐̸",
				NotSquareSupersetEqual: "⋣",
				NotSubset: "⊂⃒",
				NotSubsetEqual: "⊈",
				NotSucceeds: "⊁",
				NotSucceedsEqual: "⪰̸",
				NotSucceedsSlantEqual: "⋡",
				NotSucceedsTilde: "≿̸",
				NotSuperset: "⊃⃒",
				NotSupersetEqual: "⊉",
				NotTilde: "≁",
				NotTildeEqual: "≄",
				NotTildeFullEqual: "≇",
				NotTildeTilde: "≉",
				NotVerticalBar: "∤",
				nparallel: "∦",
				npar: "∦",
				nparsl: "⫽⃥",
				npart: "∂̸",
				npolint: "⨔",
				npr: "⊀",
				nprcue: "⋠",
				nprec: "⊀",
				npreceq: "⪯̸",
				npre: "⪯̸",
				nrarrc: "⤳̸",
				nrarr: "↛",
				nrArr: "⇏",
				nrarrw: "↝̸",
				nrightarrow: "↛",
				nRightarrow: "⇏",
				nrtri: "⋫",
				nrtrie: "⋭",
				nsc: "⊁",
				nsccue: "⋡",
				nsce: "⪰̸",
				Nscr: "𝒩",
				nscr: "𝓃",
				nshortmid: "∤",
				nshortparallel: "∦",
				nsim: "≁",
				nsime: "≄",
				nsimeq: "≄",
				nsmid: "∤",
				nspar: "∦",
				nsqsube: "⋢",
				nsqsupe: "⋣",
				nsub: "⊄",
				nsubE: "⫅̸",
				nsube: "⊈",
				nsubset: "⊂⃒",
				nsubseteq: "⊈",
				nsubseteqq: "⫅̸",
				nsucc: "⊁",
				nsucceq: "⪰̸",
				nsup: "⊅",
				nsupE: "⫆̸",
				nsupe: "⊉",
				nsupset: "⊃⃒",
				nsupseteq: "⊉",
				nsupseteqq: "⫆̸",
				ntgl: "≹",
				Ntilde: "Ñ",
				ntilde: "ñ",
				ntlg: "≸",
				ntriangleleft: "⋪",
				ntrianglelefteq: "⋬",
				ntriangleright: "⋫",
				ntrianglerighteq: "⋭",
				Nu: "Ν",
				nu: "ν",
				num: "#",
				numero: "№",
				numsp: " ",
				nvap: "≍⃒",
				nvdash: "⊬",
				nvDash: "⊭",
				nVdash: "⊮",
				nVDash: "⊯",
				nvge: "≥⃒",
				nvgt: ">⃒",
				nvHarr: "⤄",
				nvinfin: "⧞",
				nvlArr: "⤂",
				nvle: "≤⃒",
				nvlt: "<⃒",
				nvltrie: "⊴⃒",
				nvrArr: "⤃",
				nvrtrie: "⊵⃒",
				nvsim: "∼⃒",
				nwarhk: "⤣",
				nwarr: "↖",
				nwArr: "⇖",
				nwarrow: "↖",
				nwnear: "⤧",
				Oacute: "Ó",
				oacute: "ó",
				oast: "⊛",
				Ocirc: "Ô",
				ocirc: "ô",
				ocir: "⊚",
				Ocy: "О",
				ocy: "о",
				odash: "⊝",
				Odblac: "Ő",
				odblac: "ő",
				odiv: "⨸",
				odot: "⊙",
				odsold: "⦼",
				OElig: "Œ",
				oelig: "œ",
				ofcir: "⦿",
				Ofr: "𝔒",
				ofr: "𝔬",
				ogon: "˛",
				Ograve: "Ò",
				ograve: "ò",
				ogt: "⧁",
				ohbar: "⦵",
				ohm: "Ω",
				oint: "∮",
				olarr: "↺",
				olcir: "⦾",
				olcross: "⦻",
				oline: "‾",
				olt: "⧀",
				Omacr: "Ō",
				omacr: "ō",
				Omega: "Ω",
				omega: "ω",
				Omicron: "Ο",
				omicron: "ο",
				omid: "⦶",
				ominus: "⊖",
				Oopf: "𝕆",
				oopf: "𝕠",
				opar: "⦷",
				OpenCurlyDoubleQuote: "“",
				OpenCurlyQuote: "‘",
				operp: "⦹",
				oplus: "⊕",
				orarr: "↻",
				Or: "⩔",
				or: "∨",
				ord: "⩝",
				order: "ℴ",
				orderof: "ℴ",
				ordf: "ª",
				ordm: "º",
				origof: "⊶",
				oror: "⩖",
				orslope: "⩗",
				orv: "⩛",
				oS: "Ⓢ",
				Oscr: "𝒪",
				oscr: "ℴ",
				Oslash: "Ø",
				oslash: "ø",
				osol: "⊘",
				Otilde: "Õ",
				otilde: "õ",
				otimesas: "⨶",
				Otimes: "⨷",
				otimes: "⊗",
				Ouml: "Ö",
				ouml: "ö",
				ovbar: "⌽",
				OverBar: "‾",
				OverBrace: "⏞",
				OverBracket: "⎴",
				OverParenthesis: "⏜",
				para: "¶",
				parallel: "∥",
				par: "∥",
				parsim: "⫳",
				parsl: "⫽",
				part: "∂",
				PartialD: "∂",
				Pcy: "П",
				pcy: "п",
				percnt: "%",
				period: ".",
				permil: "‰",
				perp: "⊥",
				pertenk: "‱",
				Pfr: "𝔓",
				pfr: "𝔭",
				Phi: "Φ",
				phi: "φ",
				phiv: "ϕ",
				phmmat: "ℳ",
				phone: "☎",
				Pi: "Π",
				pi: "π",
				pitchfork: "⋔",
				piv: "ϖ",
				planck: "ℏ",
				planckh: "ℎ",
				plankv: "ℏ",
				plusacir: "⨣",
				plusb: "⊞",
				pluscir: "⨢",
				plus: "+",
				plusdo: "∔",
				plusdu: "⨥",
				pluse: "⩲",
				PlusMinus: "±",
				plusmn: "±",
				plussim: "⨦",
				plustwo: "⨧",
				pm: "±",
				Poincareplane: "ℌ",
				pointint: "⨕",
				popf: "𝕡",
				Popf: "ℙ",
				pound: "£",
				prap: "⪷",
				Pr: "⪻",
				pr: "≺",
				prcue: "≼",
				precapprox: "⪷",
				prec: "≺",
				preccurlyeq: "≼",
				Precedes: "≺",
				PrecedesEqual: "⪯",
				PrecedesSlantEqual: "≼",
				PrecedesTilde: "≾",
				preceq: "⪯",
				precnapprox: "⪹",
				precneqq: "⪵",
				precnsim: "⋨",
				pre: "⪯",
				prE: "⪳",
				precsim: "≾",
				prime: "′",
				Prime: "″",
				primes: "ℙ",
				prnap: "⪹",
				prnE: "⪵",
				prnsim: "⋨",
				prod: "∏",
				Product: "∏",
				profalar: "⌮",
				profline: "⌒",
				profsurf: "⌓",
				prop: "∝",
				Proportional: "∝",
				Proportion: "∷",
				propto: "∝",
				prsim: "≾",
				prurel: "⊰",
				Pscr: "𝒫",
				pscr: "𝓅",
				Psi: "Ψ",
				psi: "ψ",
				puncsp: " ",
				Qfr: "𝔔",
				qfr: "𝔮",
				qint: "⨌",
				qopf: "𝕢",
				Qopf: "ℚ",
				qprime: "⁗",
				Qscr: "𝒬",
				qscr: "𝓆",
				quaternions: "ℍ",
				quatint: "⨖",
				quest: "?",
				questeq: "≟",
				quot: '"',
				QUOT: '"',
				rAarr: "⇛",
				race: "∽̱",
				Racute: "Ŕ",
				racute: "ŕ",
				radic: "√",
				raemptyv: "⦳",
				rang: "⟩",
				Rang: "⟫",
				rangd: "⦒",
				range: "⦥",
				rangle: "⟩",
				raquo: "»",
				rarrap: "⥵",
				rarrb: "⇥",
				rarrbfs: "⤠",
				rarrc: "⤳",
				rarr: "→",
				Rarr: "↠",
				rArr: "⇒",
				rarrfs: "⤞",
				rarrhk: "↪",
				rarrlp: "↬",
				rarrpl: "⥅",
				rarrsim: "⥴",
				Rarrtl: "⤖",
				rarrtl: "↣",
				rarrw: "↝",
				ratail: "⤚",
				rAtail: "⤜",
				ratio: "∶",
				rationals: "ℚ",
				rbarr: "⤍",
				rBarr: "⤏",
				RBarr: "⤐",
				rbbrk: "❳",
				rbrace: "}",
				rbrack: "]",
				rbrke: "⦌",
				rbrksld: "⦎",
				rbrkslu: "⦐",
				Rcaron: "Ř",
				rcaron: "ř",
				Rcedil: "Ŗ",
				rcedil: "ŗ",
				rceil: "⌉",
				rcub: "}",
				Rcy: "Р",
				rcy: "р",
				rdca: "⤷",
				rdldhar: "⥩",
				rdquo: "”",
				rdquor: "”",
				rdsh: "↳",
				real: "ℜ",
				realine: "ℛ",
				realpart: "ℜ",
				reals: "ℝ",
				Re: "ℜ",
				rect: "▭",
				reg: "®",
				REG: "®",
				ReverseElement: "∋",
				ReverseEquilibrium: "⇋",
				ReverseUpEquilibrium: "⥯",
				rfisht: "⥽",
				rfloor: "⌋",
				rfr: "𝔯",
				Rfr: "ℜ",
				rHar: "⥤",
				rhard: "⇁",
				rharu: "⇀",
				rharul: "⥬",
				Rho: "Ρ",
				rho: "ρ",
				rhov: "ϱ",
				RightAngleBracket: "⟩",
				RightArrowBar: "⇥",
				rightarrow: "→",
				RightArrow: "→",
				Rightarrow: "⇒",
				RightArrowLeftArrow: "⇄",
				rightarrowtail: "↣",
				RightCeiling: "⌉",
				RightDoubleBracket: "⟧",
				RightDownTeeVector: "⥝",
				RightDownVectorBar: "⥕",
				RightDownVector: "⇂",
				RightFloor: "⌋",
				rightharpoondown: "⇁",
				rightharpoonup: "⇀",
				rightleftarrows: "⇄",
				rightleftharpoons: "⇌",
				rightrightarrows: "⇉",
				rightsquigarrow: "↝",
				RightTeeArrow: "↦",
				RightTee: "⊢",
				RightTeeVector: "⥛",
				rightthreetimes: "⋌",
				RightTriangleBar: "⧐",
				RightTriangle: "⊳",
				RightTriangleEqual: "⊵",
				RightUpDownVector: "⥏",
				RightUpTeeVector: "⥜",
				RightUpVectorBar: "⥔",
				RightUpVector: "↾",
				RightVectorBar: "⥓",
				RightVector: "⇀",
				ring: "˚",
				risingdotseq: "≓",
				rlarr: "⇄",
				rlhar: "⇌",
				rlm: "‏",
				rmoustache: "⎱",
				rmoust: "⎱",
				rnmid: "⫮",
				roang: "⟭",
				roarr: "⇾",
				robrk: "⟧",
				ropar: "⦆",
				ropf: "𝕣",
				Ropf: "ℝ",
				roplus: "⨮",
				rotimes: "⨵",
				RoundImplies: "⥰",
				rpar: ")",
				rpargt: "⦔",
				rppolint: "⨒",
				rrarr: "⇉",
				Rrightarrow: "⇛",
				rsaquo: "›",
				rscr: "𝓇",
				Rscr: "ℛ",
				rsh: "↱",
				Rsh: "↱",
				rsqb: "]",
				rsquo: "’",
				rsquor: "’",
				rthree: "⋌",
				rtimes: "⋊",
				rtri: "▹",
				rtrie: "⊵",
				rtrif: "▸",
				rtriltri: "⧎",
				RuleDelayed: "⧴",
				ruluhar: "⥨",
				rx: "℞",
				Sacute: "Ś",
				sacute: "ś",
				sbquo: "‚",
				scap: "⪸",
				Scaron: "Š",
				scaron: "š",
				Sc: "⪼",
				sc: "≻",
				sccue: "≽",
				sce: "⪰",
				scE: "⪴",
				Scedil: "Ş",
				scedil: "ş",
				Scirc: "Ŝ",
				scirc: "ŝ",
				scnap: "⪺",
				scnE: "⪶",
				scnsim: "⋩",
				scpolint: "⨓",
				scsim: "≿",
				Scy: "С",
				scy: "с",
				sdotb: "⊡",
				sdot: "⋅",
				sdote: "⩦",
				searhk: "⤥",
				searr: "↘",
				seArr: "⇘",
				searrow: "↘",
				sect: "§",
				semi: ";",
				seswar: "⤩",
				setminus: "∖",
				setmn: "∖",
				sext: "✶",
				Sfr: "𝔖",
				sfr: "𝔰",
				sfrown: "⌢",
				sharp: "♯",
				SHCHcy: "Щ",
				shchcy: "щ",
				SHcy: "Ш",
				shcy: "ш",
				ShortDownArrow: "↓",
				ShortLeftArrow: "←",
				shortmid: "∣",
				shortparallel: "∥",
				ShortRightArrow: "→",
				ShortUpArrow: "↑",
				shy: "­",
				Sigma: "Σ",
				sigma: "σ",
				sigmaf: "ς",
				sigmav: "ς",
				sim: "∼",
				simdot: "⩪",
				sime: "≃",
				simeq: "≃",
				simg: "⪞",
				simgE: "⪠",
				siml: "⪝",
				simlE: "⪟",
				simne: "≆",
				simplus: "⨤",
				simrarr: "⥲",
				slarr: "←",
				SmallCircle: "∘",
				smallsetminus: "∖",
				smashp: "⨳",
				smeparsl: "⧤",
				smid: "∣",
				smile: "⌣",
				smt: "⪪",
				smte: "⪬",
				smtes: "⪬︀",
				SOFTcy: "Ь",
				softcy: "ь",
				solbar: "⌿",
				solb: "⧄",
				sol: "/",
				Sopf: "𝕊",
				sopf: "𝕤",
				spades: "♠",
				spadesuit: "♠",
				spar: "∥",
				sqcap: "⊓",
				sqcaps: "⊓︀",
				sqcup: "⊔",
				sqcups: "⊔︀",
				Sqrt: "√",
				sqsub: "⊏",
				sqsube: "⊑",
				sqsubset: "⊏",
				sqsubseteq: "⊑",
				sqsup: "⊐",
				sqsupe: "⊒",
				sqsupset: "⊐",
				sqsupseteq: "⊒",
				square: "□",
				Square: "□",
				SquareIntersection: "⊓",
				SquareSubset: "⊏",
				SquareSubsetEqual: "⊑",
				SquareSuperset: "⊐",
				SquareSupersetEqual: "⊒",
				SquareUnion: "⊔",
				squarf: "▪",
				squ: "□",
				squf: "▪",
				srarr: "→",
				Sscr: "𝒮",
				sscr: "𝓈",
				ssetmn: "∖",
				ssmile: "⌣",
				sstarf: "⋆",
				Star: "⋆",
				star: "☆",
				starf: "★",
				straightepsilon: "ϵ",
				straightphi: "ϕ",
				strns: "¯",
				sub: "⊂",
				Sub: "⋐",
				subdot: "⪽",
				subE: "⫅",
				sube: "⊆",
				subedot: "⫃",
				submult: "⫁",
				subnE: "⫋",
				subne: "⊊",
				subplus: "⪿",
				subrarr: "⥹",
				subset: "⊂",
				Subset: "⋐",
				subseteq: "⊆",
				subseteqq: "⫅",
				SubsetEqual: "⊆",
				subsetneq: "⊊",
				subsetneqq: "⫋",
				subsim: "⫇",
				subsub: "⫕",
				subsup: "⫓",
				succapprox: "⪸",
				succ: "≻",
				succcurlyeq: "≽",
				Succeeds: "≻",
				SucceedsEqual: "⪰",
				SucceedsSlantEqual: "≽",
				SucceedsTilde: "≿",
				succeq: "⪰",
				succnapprox: "⪺",
				succneqq: "⪶",
				succnsim: "⋩",
				succsim: "≿",
				SuchThat: "∋",
				sum: "∑",
				Sum: "∑",
				sung: "♪",
				sup1: "¹",
				sup2: "²",
				sup3: "³",
				sup: "⊃",
				Sup: "⋑",
				supdot: "⪾",
				supdsub: "⫘",
				supE: "⫆",
				supe: "⊇",
				supedot: "⫄",
				Superset: "⊃",
				SupersetEqual: "⊇",
				suphsol: "⟉",
				suphsub: "⫗",
				suplarr: "⥻",
				supmult: "⫂",
				supnE: "⫌",
				supne: "⊋",
				supplus: "⫀",
				supset: "⊃",
				Supset: "⋑",
				supseteq: "⊇",
				supseteqq: "⫆",
				supsetneq: "⊋",
				supsetneqq: "⫌",
				supsim: "⫈",
				supsub: "⫔",
				supsup: "⫖",
				swarhk: "⤦",
				swarr: "↙",
				swArr: "⇙",
				swarrow: "↙",
				swnwar: "⤪",
				szlig: "ß",
				Tab: "	",
				target: "⌖",
				Tau: "Τ",
				tau: "τ",
				tbrk: "⎴",
				Tcaron: "Ť",
				tcaron: "ť",
				Tcedil: "Ţ",
				tcedil: "ţ",
				Tcy: "Т",
				tcy: "т",
				tdot: "⃛",
				telrec: "⌕",
				Tfr: "𝔗",
				tfr: "𝔱",
				there4: "∴",
				therefore: "∴",
				Therefore: "∴",
				Theta: "Θ",
				theta: "θ",
				thetasym: "ϑ",
				thetav: "ϑ",
				thickapprox: "≈",
				thicksim: "∼",
				ThickSpace: "  ",
				ThinSpace: " ",
				thinsp: " ",
				thkap: "≈",
				thksim: "∼",
				THORN: "Þ",
				thorn: "þ",
				tilde: "˜",
				Tilde: "∼",
				TildeEqual: "≃",
				TildeFullEqual: "≅",
				TildeTilde: "≈",
				timesbar: "⨱",
				timesb: "⊠",
				times: "×",
				timesd: "⨰",
				tint: "∭",
				toea: "⤨",
				topbot: "⌶",
				topcir: "⫱",
				top: "⊤",
				Topf: "𝕋",
				topf: "𝕥",
				topfork: "⫚",
				tosa: "⤩",
				tprime: "‴",
				trade: "™",
				TRADE: "™",
				triangle: "▵",
				triangledown: "▿",
				triangleleft: "◃",
				trianglelefteq: "⊴",
				triangleq: "≜",
				triangleright: "▹",
				trianglerighteq: "⊵",
				tridot: "◬",
				trie: "≜",
				triminus: "⨺",
				TripleDot: "⃛",
				triplus: "⨹",
				trisb: "⧍",
				tritime: "⨻",
				trpezium: "⏢",
				Tscr: "𝒯",
				tscr: "𝓉",
				TScy: "Ц",
				tscy: "ц",
				TSHcy: "Ћ",
				tshcy: "ћ",
				Tstrok: "Ŧ",
				tstrok: "ŧ",
				twixt: "≬",
				twoheadleftarrow: "↞",
				twoheadrightarrow: "↠",
				Uacute: "Ú",
				uacute: "ú",
				uarr: "↑",
				Uarr: "↟",
				uArr: "⇑",
				Uarrocir: "⥉",
				Ubrcy: "Ў",
				ubrcy: "ў",
				Ubreve: "Ŭ",
				ubreve: "ŭ",
				Ucirc: "Û",
				ucirc: "û",
				Ucy: "У",
				ucy: "у",
				udarr: "⇅",
				Udblac: "Ű",
				udblac: "ű",
				udhar: "⥮",
				ufisht: "⥾",
				Ufr: "𝔘",
				ufr: "𝔲",
				Ugrave: "Ù",
				ugrave: "ù",
				uHar: "⥣",
				uharl: "↿",
				uharr: "↾",
				uhblk: "▀",
				ulcorn: "⌜",
				ulcorner: "⌜",
				ulcrop: "⌏",
				ultri: "◸",
				Umacr: "Ū",
				umacr: "ū",
				uml: "¨",
				UnderBar: "_",
				UnderBrace: "⏟",
				UnderBracket: "⎵",
				UnderParenthesis: "⏝",
				Union: "⋃",
				UnionPlus: "⊎",
				Uogon: "Ų",
				uogon: "ų",
				Uopf: "𝕌",
				uopf: "𝕦",
				UpArrowBar: "⤒",
				uparrow: "↑",
				UpArrow: "↑",
				Uparrow: "⇑",
				UpArrowDownArrow: "⇅",
				updownarrow: "↕",
				UpDownArrow: "↕",
				Updownarrow: "⇕",
				UpEquilibrium: "⥮",
				upharpoonleft: "↿",
				upharpoonright: "↾",
				uplus: "⊎",
				UpperLeftArrow: "↖",
				UpperRightArrow: "↗",
				upsi: "υ",
				Upsi: "ϒ",
				upsih: "ϒ",
				Upsilon: "Υ",
				upsilon: "υ",
				UpTeeArrow: "↥",
				UpTee: "⊥",
				upuparrows: "⇈",
				urcorn: "⌝",
				urcorner: "⌝",
				urcrop: "⌎",
				Uring: "Ů",
				uring: "ů",
				urtri: "◹",
				Uscr: "𝒰",
				uscr: "𝓊",
				utdot: "⋰",
				Utilde: "Ũ",
				utilde: "ũ",
				utri: "▵",
				utrif: "▴",
				uuarr: "⇈",
				Uuml: "Ü",
				uuml: "ü",
				uwangle: "⦧",
				vangrt: "⦜",
				varepsilon: "ϵ",
				varkappa: "ϰ",
				varnothing: "∅",
				varphi: "ϕ",
				varpi: "ϖ",
				varpropto: "∝",
				varr: "↕",
				vArr: "⇕",
				varrho: "ϱ",
				varsigma: "ς",
				varsubsetneq: "⊊︀",
				varsubsetneqq: "⫋︀",
				varsupsetneq: "⊋︀",
				varsupsetneqq: "⫌︀",
				vartheta: "ϑ",
				vartriangleleft: "⊲",
				vartriangleright: "⊳",
				vBar: "⫨",
				Vbar: "⫫",
				vBarv: "⫩",
				Vcy: "В",
				vcy: "в",
				vdash: "⊢",
				vDash: "⊨",
				Vdash: "⊩",
				VDash: "⊫",
				Vdashl: "⫦",
				veebar: "⊻",
				vee: "∨",
				Vee: "⋁",
				veeeq: "≚",
				vellip: "⋮",
				verbar: "|",
				Verbar: "‖",
				vert: "|",
				Vert: "‖",
				VerticalBar: "∣",
				VerticalLine: "|",
				VerticalSeparator: "❘",
				VerticalTilde: "≀",
				VeryThinSpace: " ",
				Vfr: "𝔙",
				vfr: "𝔳",
				vltri: "⊲",
				vnsub: "⊂⃒",
				vnsup: "⊃⃒",
				Vopf: "𝕍",
				vopf: "𝕧",
				vprop: "∝",
				vrtri: "⊳",
				Vscr: "𝒱",
				vscr: "𝓋",
				vsubnE: "⫋︀",
				vsubne: "⊊︀",
				vsupnE: "⫌︀",
				vsupne: "⊋︀",
				Vvdash: "⊪",
				vzigzag: "⦚",
				Wcirc: "Ŵ",
				wcirc: "ŵ",
				wedbar: "⩟",
				wedge: "∧",
				Wedge: "⋀",
				wedgeq: "≙",
				weierp: "℘",
				Wfr: "𝔚",
				wfr: "𝔴",
				Wopf: "𝕎",
				wopf: "𝕨",
				wp: "℘",
				wr: "≀",
				wreath: "≀",
				Wscr: "𝒲",
				wscr: "𝓌",
				xcap: "⋂",
				xcirc: "◯",
				xcup: "⋃",
				xdtri: "▽",
				Xfr: "𝔛",
				xfr: "𝔵",
				xharr: "⟷",
				xhArr: "⟺",
				Xi: "Ξ",
				xi: "ξ",
				xlarr: "⟵",
				xlArr: "⟸",
				xmap: "⟼",
				xnis: "⋻",
				xodot: "⨀",
				Xopf: "𝕏",
				xopf: "𝕩",
				xoplus: "⨁",
				xotime: "⨂",
				xrarr: "⟶",
				xrArr: "⟹",
				Xscr: "𝒳",
				xscr: "𝓍",
				xsqcup: "⨆",
				xuplus: "⨄",
				xutri: "△",
				xvee: "⋁",
				xwedge: "⋀",
				Yacute: "Ý",
				yacute: "ý",
				YAcy: "Я",
				yacy: "я",
				Ycirc: "Ŷ",
				ycirc: "ŷ",
				Ycy: "Ы",
				ycy: "ы",
				yen: "¥",
				Yfr: "𝔜",
				yfr: "𝔶",
				YIcy: "Ї",
				yicy: "ї",
				Yopf: "𝕐",
				yopf: "𝕪",
				Yscr: "𝒴",
				yscr: "𝓎",
				YUcy: "Ю",
				yucy: "ю",
				yuml: "ÿ",
				Yuml: "Ÿ",
				Zacute: "Ź",
				zacute: "ź",
				Zcaron: "Ž",
				zcaron: "ž",
				Zcy: "З",
				zcy: "з",
				Zdot: "Ż",
				zdot: "ż",
				zeetrf: "ℨ",
				ZeroWidthSpace: "​",
				Zeta: "Ζ",
				zeta: "ζ",
				zfr: "𝔷",
				Zfr: "ℨ",
				ZHcy: "Ж",
				zhcy: "ж",
				zigrarr: "⇝",
				zopf: "𝕫",
				Zopf: "ℤ",
				Zscr: "𝒵",
				zscr: "𝓏",
				zwj: "‍",
				zwnj: "‌"
			}
		}, {}], 32: [function (e, t) {
			t.exports = {
				Aacute: "Á",
				aacute: "á",
				Acirc: "Â",
				acirc: "â",
				acute: "´",
				AElig: "Æ",
				aelig: "æ",
				Agrave: "À",
				agrave: "à",
				amp: "&",
				AMP: "&",
				Aring: "Å",
				aring: "å",
				Atilde: "Ã",
				atilde: "ã",
				Auml: "Ä",
				auml: "ä",
				brvbar: "¦",
				Ccedil: "Ç",
				ccedil: "ç",
				cedil: "¸",
				cent: "¢",
				copy: "©",
				COPY: "©",
				curren: "¤",
				deg: "°",
				divide: "÷",
				Eacute: "É",
				eacute: "é",
				Ecirc: "Ê",
				ecirc: "ê",
				Egrave: "È",
				egrave: "è",
				ETH: "Ð",
				eth: "ð",
				Euml: "Ë",
				euml: "ë",
				frac12: "½",
				frac14: "¼",
				frac34: "¾",
				gt: ">",
				GT: ">",
				Iacute: "Í",
				iacute: "í",
				Icirc: "Î",
				icirc: "î",
				iexcl: "¡",
				Igrave: "Ì",
				igrave: "ì",
				iquest: "¿",
				Iuml: "Ï",
				iuml: "ï",
				laquo: "«",
				lt: "<",
				LT: "<",
				macr: "¯",
				micro: "µ",
				middot: "·",
				nbsp: " ",
				not: "¬",
				Ntilde: "Ñ",
				ntilde: "ñ",
				Oacute: "Ó",
				oacute: "ó",
				Ocirc: "Ô",
				ocirc: "ô",
				Ograve: "Ò",
				ograve: "ò",
				ordf: "ª",
				ordm: "º",
				Oslash: "Ø",
				oslash: "ø",
				Otilde: "Õ",
				otilde: "õ",
				Ouml: "Ö",
				ouml: "ö",
				para: "¶",
				plusmn: "±",
				pound: "£",
				quot: '"',
				QUOT: '"',
				raquo: "»",
				reg: "®",
				REG: "®",
				sect: "§",
				shy: "­",
				sup1: "¹",
				sup2: "²",
				sup3: "³",
				szlig: "ß",
				THORN: "Þ",
				thorn: "þ",
				times: "×",
				Uacute: "Ú",
				uacute: "ú",
				Ucirc: "Û",
				ucirc: "û",
				Ugrave: "Ù",
				ugrave: "ù",
				uml: "¨",
				Uuml: "Ü",
				uuml: "ü",
				Yacute: "Ý",
				yacute: "ý",
				yen: "¥",
				yuml: "ÿ"
			}
		}, {}], 33: [function (e, t) {
			t.exports = {amp: "&", apos: "'", gt: ">", lt: "<", quot: '"'}
		}, {}], 34: [function (e, t) {
			function n(e, n) {
				return delete t.exports[e], t.exports[e] = n, n
			}

			var r = e("./Parser.js"), i = e("domhandler");
			t.exports = {
				Parser: r,
				Tokenizer: e("./Tokenizer.js"),
				ElementType: e("domelementtype"),
				DomHandler: i,
				get FeedHandler() {
					return n("FeedHandler", e("./FeedHandler.js"))
				},
				get Stream() {
					return n("Stream", e("./Stream.js"))
				},
				get WritableStream() {
					return n("WritableStream", e("./WritableStream.js"))
				},
				get ProxyHandler() {
					return n("ProxyHandler", e("./ProxyHandler.js"))
				},
				get DomUtils() {
					return n("DomUtils", e("domutils"))
				},
				get CollectingHandler() {
					return n("CollectingHandler", e("./CollectingHandler.js"))
				},
				DefaultHandler: i,
				get RssHandler() {
					return n("RssHandler", this.FeedHandler)
				},
				parseDOM: function (e, t) {
					var n = new i(t), o = new r(n, t);
					return o.end(e), n.dom
				},
				parseFeed: function (e, n) {
					var i = new t.exports.FeedHandler(n), o = new r(i, n);
					return o.end(e), i.dom
				},
				createDomStream: function (e, t, n) {
					var o = new i(e, t, n);
					return new r(o, t)
				},
				EVENTS: {
					attribute: 2,
					cdatastart: 0,
					cdataend: 0,
					text: 1,
					processinginstruction: 2,
					comment: 1,
					commentend: 0,
					closetag: 1,
					opentag: 2,
					opentagname: 1,
					error: 1,
					end: 0
				}
			}
		}, {
			"./CollectingHandler.js": 23,
			"./FeedHandler.js": 24,
			"./Parser.js": 25,
			"./ProxyHandler.js": 26,
			"./Stream.js": 27,
			"./Tokenizer.js": 28,
			"./WritableStream.js": 29,
			domelementtype: 35,
			domhandler: 36,
			domutils: 37
		}], 35: [function (e, t) {
			t.exports = {
				Text: "text",
				Directive: "directive",
				Comment: "comment",
				Script: "script",
				Style: "style",
				Tag: "tag",
				CDATA: "cdata",
				isTag: function (e) {
					return "tag" === e.type || "script" === e.type || "style" === e.type
				}
			}
		}, {}], 36: [function (e, t) {
			function n(e, t, n) {
				"object" == typeof e ? (n = t, t = e, e = null) : "function" == typeof t && (n = t, t = o), this._callback = e, this._options = t || o, this._elementCB = n, this.dom = [], this._done = !1, this._tagStack = []
			}

			var r = e("domelementtype"), i = /\s+/g, o = {normalizeWhitespace: !1};
			n.prototype.onreset = function () {
				n.call(this, this._callback, this._options, this._elementCB)
			}, n.prototype.onend = function () {
				this._done || (this._done = !0, this._handleCallback(null))
			}, n.prototype._handleCallback = n.prototype.onerror = function (e) {
				if ("function" == typeof this._callback) this._callback(e, this.dom); else if (e) throw e
			}, n.prototype.onclosetag = function () {
				var e = this._tagStack.pop();
				this._elementCB && this._elementCB(e)
			}, n.prototype._addDomElement = function (e) {
				var t = this._tagStack[this._tagStack.length - 1], n = t ? t.children : this.dom, r = n[n.length - 1];
				e.next = null, this._options.withDomLvl1 && (e.__proto__ = a), r ? (e.prev = r, r.next = e) : e.prev = null, n.push(e), e.parent = t || null
			};
			var a = {
				get firstChild() {
					var e = this.children;
					return e && e[0] || null
				}, get lastChild() {
					var e = this.children;
					return e && e[e.length - 1] || null
				}, get nodeType() {
					return l[this.type] || l.element
				}
			}, s = {
				tagName: "name",
				childNodes: "children",
				parentNode: "parent",
				previousSibling: "prev",
				nextSibling: "next",
				nodeValue: "data"
			}, l = {element: 1, text: 3, cdata: 4, comment: 8};
			Object.keys(s).forEach(function (e) {
				var t = s[e];
				Object.defineProperty(a, e, {
					get: function () {
						return this[t] || null
					}, set: function (e) {
						return this[t] = e, e
					}
				})
			}), n.prototype.onopentag = function (e, t) {
				var n = {
					type: "script" === e ? r.Script : "style" === e ? r.Style : r.Tag,
					name: e,
					attribs: t,
					children: []
				};
				this._addDomElement(n), this._tagStack.push(n)
			}, n.prototype.ontext = function (e) {
				var t, n = this._options.normalizeWhitespace || this._options.ignoreWhitespace;
				!this._tagStack.length && this.dom.length && (t = this.dom[this.dom.length - 1]).type === r.Text ? n ? t.data = (t.data + e).replace(i, " ") : t.data += e : this._tagStack.length && (t = this._tagStack[this._tagStack.length - 1]) && (t = t.children[t.children.length - 1]) && t.type === r.Text ? n ? t.data = (t.data + e).replace(i, " ") : t.data += e : (n && (e = e.replace(i, " ")), this._addDomElement({
					data: e,
					type: r.Text
				}))
			}, n.prototype.oncomment = function (e) {
				var t = this._tagStack[this._tagStack.length - 1];
				if (t && t.type === r.Comment) return t.data += e, void 0;
				var n = {data: e, type: r.Comment};
				this._addDomElement(n), this._tagStack.push(n)
			}, n.prototype.oncdatastart = function () {
				var e = {children: [{data: "", type: r.Text}], type: r.CDATA};
				this._addDomElement(e), this._tagStack.push(e)
			}, n.prototype.oncommentend = n.prototype.oncdataend = function () {
				this._tagStack.pop()
			}, n.prototype.onprocessinginstruction = function (e, t) {
				this._addDomElement({name: e, data: t, type: r.Directive})
			}, t.exports = n
		}, {domelementtype: 35}], 37: [function (e, t) {
			var n = t.exports;
			["stringify", "traversal", "manipulation", "querying", "legacy", "helpers"].forEach(function (t) {
				var r = e("./lib/" + t);
				Object.keys(r).forEach(function (e) {
					n[e] = r[e].bind(n)
				})
			})
		}, {}], 38: [function (e, t) {
			!function (n) {
				function r(e) {
					return this instanceof r ? (l.call(this, e), u.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", i), void 0) : new r(e)
				}

				function i() {
					this.allowHalfOpen || this._writableState.ended || n.nextTick(this.end.bind(this))
				}

				t.exports = r;
				var o = e("util");
				if (!o.isUndefined) {
					var a = e("core-util-is");
					for (var s in a) o[s] = a[s]
				}
				var l = e("./_stream_readable"), u = e("./_stream_writable");
				o.inherits(r, l), Object.keys(u.prototype).forEach(function (e) {
					r.prototype[e] || (r.prototype[e] = u.prototype[e])
				})
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"./_stream_readable": 40,
			"./_stream_writable": 42,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			"core-util-is": 43,
			util: 17
		}], 39: [function (e, t) {
			function n(e) {
				return this instanceof n ? (r.call(this, e), void 0) : new n(e)
			}

			t.exports = n;
			var r = e("./_stream_transform"), i = e("util");
			if (!i.isUndefined) {
				var o = e("core-util-is");
				for (var a in o) i[a] = o[a]
			}
			i.inherits(n, r), n.prototype._transform = function (e, t, n) {
				n(null, e)
			}
		}, {"./_stream_transform": 41, "core-util-is": 43, util: 17}], 40: [function (e, t) {
			!function (n, r) {
				function i(t) {
					t = t || {};
					var n = t.highWaterMark, r = t.objectMode ? 16 : 16384;
					this.highWaterMark = n || 0 === n ? n : r, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (L || (L = e("string_decoder/").StringDecoder), this.decoder = new L(t.encoding), this.encoding = t.encoding)
				}

				function o(e) {
					return this instanceof o ? (this._readableState = new i(e, this), this.readable = !0, k.call(this), void 0) : new o(e)
				}

				function a(e, t, n, r, i) {
					var o = c(t, n);
					if (o) e.emit("error", o); else if (S.isNullOrUndefined(n)) t.reading = !1, t.ended || f(e, t); else if (t.objectMode || n && n.length > 0) if (t.ended && !i) {
						var a = new Error("stream.push() after EOF");
						e.emit("error", a)
					} else if (t.endEmitted && i) {
						var a = new Error("stream.unshift() after end event");
						e.emit("error", a)
					} else !t.decoder || i || r || (n = t.decoder.write(n)), i || (t.reading = !1), t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (t.length += t.objectMode ? 1 : n.length, i ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && d(e)), p(e, t); else i || (t.reading = !1);
					return s(t)
				}

				function s(e) {
					return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
				}

				function l(e) {
					if (e >= M) e = M; else {
						e--;
						for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
						e++
					}
					return e
				}

				function u(e, t) {
					return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || S.isNull(e) ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = l(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
				}

				function c(e, t) {
					var n = null;
					return S.isBuffer(t) || S.isString(t) || S.isNullOrUndefined(t) || e.objectMode || n || (n = new TypeError("Invalid non-string/buffer chunk")), n
				}

				function f(e, t) {
					if (t.decoder && !t.ended) {
						var n = t.decoder.end();
						n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length)
					}
					t.ended = !0, d(e)
				}

				function d(e) {
					var t = e._readableState;
					t.needReadable = !1, t.emittedReadable || (T("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? n.nextTick(function () {
						h(e)
					}) : h(e))
				}

				function h(e) {
					T("emit readable"), e.emit("readable"), y(e)
				}

				function p(e, t) {
					t.readingMore || (t.readingMore = !0, n.nextTick(function () {
						m(e, t)
					}))
				}

				function m(e, t) {
					for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (T("maybeReadMore read 0"), e.read(0), n !== t.length);) n = t.length;
					t.readingMore = !1
				}

				function g(e) {
					return function () {
						var t = e._readableState;
						T("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && x.listenerCount(e, "data") && (t.flowing = !0, y(e))
					}
				}

				function v(e, t) {
					t.resumeScheduled || (t.resumeScheduled = !0, n.nextTick(function () {
						b(e, t)
					}))
				}

				function b(e, t) {
					t.resumeScheduled = !1, e.emit("resume"), y(e), t.flowing && !t.reading && e.read(0)
				}

				function y(e) {
					var t = e._readableState;
					if (T("flow", t.flowing), t.flowing) do var n = e.read(); while (null !== n && t.flowing)
				}

				function w(e, t) {
					var n, r = t.buffer, i = t.length, o = !!t.decoder, a = !!t.objectMode;
					if (0 === r.length) return null;
					if (0 === i) n = null; else if (a) n = r.shift(); else if (!e || e >= i) n = o ? r.join("") : C.concat(r, i), r.length = 0; else if (e < r[0].length) {
						var s = r[0];
						n = s.slice(0, e), r[0] = s.slice(e)
					} else if (e === r[0].length) n = r.shift(); else {
						n = o ? "" : new C(e);
						for (var l = 0, u = 0, c = r.length; c > u && e > l; u++) {
							var s = r[0], f = Math.min(e - l, s.length);
							o ? n += s.slice(0, f) : s.copy(n, l, 0, f), f < s.length ? r[0] = s.slice(f) : r.shift(), l += f
						}
					}
					return n
				}

				function _(e) {
					var t = e._readableState;
					if (t.length > 0) throw new Error("endReadable called on non-empty stream");
					t.endEmitted || (t.ended = !0, n.nextTick(function () {
						t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
					}))
				}

				t.exports = o, o.ReadableState = i;
				var x = e("events").EventEmitter;
				x.listenerCount || (x.listenerCount = function (e, t) {
					return e.listeners(t).length
				}), r.setImmediate || (r.setImmediate = function (e) {
					return setTimeout(e, 0)
				}), r.clearImmediate || (r.clearImmediate = function (e) {
					return clearTimeout(e)
				});
				var k = e("stream"), S = e("util"), C = e("buffer").Buffer;
				if (!S.isUndefined) {
					var A = e("core-util-is");
					for (var E in A) S[E] = A[E]
				}
				var L, T;
				if (S.debuglog) T = S.debuglog("stream"); else try {
					T = e("debuglog")("stream")
				} catch (D) {
					T = function () {
					}
				}
				S.inherits(o, k), o.prototype.push = function (e, t) {
					var n = this._readableState;
					return S.isString(e) && !n.objectMode && (t = t || n.defaultEncoding, t !== n.encoding && (e = new C(e, t), t = "")), a(this, n, e, t, !1)
				}, o.prototype.unshift = function (e) {
					var t = this._readableState;
					return a(this, t, e, "", !0)
				}, o.prototype.setEncoding = function (t) {
					return L || (L = e("string_decoder/").StringDecoder), this._readableState.decoder = new L(t), this._readableState.encoding = t, this
				};
				var M = 8388608;
				o.prototype.read = function (e) {
					T("read", e);
					var t = this._readableState, n = e;
					if ((!S.isNumber(e) || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return T("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? _(this) : d(this), null;
					if (e = u(e, t), 0 === e && t.ended) return 0 === t.length && _(this), null;
					var r = t.needReadable;
					T("need readable", r), (0 === t.length || t.length - e < t.highWaterMark) && (r = !0, T("length less than watermark", r)), (t.ended || t.reading) && (r = !1, T("reading or ended", r)), r && (T("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), r && !t.reading && (e = u(n, t));
					var i;
					return i = e > 0 ? w(e, t) : null, S.isNull(i) && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), n !== e && t.ended && 0 === t.length && _(this), S.isNull(i) || this.emit("data", i), i
				}, o.prototype._read = function () {
					this.emit("error", new Error("not implemented"))
				}, o.prototype.pipe = function (e, t) {
					function r(e) {
						T("onunpipe"), e === f && o()
					}

					function i() {
						T("onend"), e.end()
					}

					function o() {
						T("cleanup"), e.removeListener("close", l), e.removeListener("finish", u), e.removeListener("drain", m), e.removeListener("error", s), e.removeListener("unpipe", r), f.removeListener("end", i), f.removeListener("end", o), f.removeListener("data", a), !d.awaitDrain || e._writableState && !e._writableState.needDrain || m()
					}

					function a(t) {
						T("ondata");
						var n = e.write(t);
						!1 === n && (T("false write response, pause", f._readableState.awaitDrain), f._readableState.awaitDrain++, f.pause())
					}

					function s(t) {
						T("onerror", t), c(), e.removeListener("error", s), 0 === x.listenerCount(e, "error") && e.emit("error", t)
					}

					function l() {
						e.removeListener("finish", u), c()
					}

					function u() {
						T("onfinish"), e.removeListener("close", l), c()
					}

					function c() {
						T("unpipe"), f.unpipe(e)
					}

					var f = this, d = this._readableState;
					switch (d.pipesCount) {
						case 0:
							d.pipes = e;
							break;
						case 1:
							d.pipes = [d.pipes, e];
							break;
						default:
							d.pipes.push(e)
					}
					d.pipesCount += 1, T("pipe count=%d opts=%j", d.pipesCount, t);
					var h = (!t || t.end !== !1) && e !== n.stdout && e !== n.stderr, p = h ? i : o;
					d.endEmitted ? n.nextTick(p) : f.once("end", p), e.on("unpipe", r);
					var m = g(f);
					return e.on("drain", m), f.on("data", a), e._events && e._events.error ? Array.isArray(e._events.error) ? e._events.error.unshift(s) : e._events.error = [s, e._events.error] : e.on("error", s), e.once("close", l), e.once("finish", u), e.emit("pipe", f), d.flowing || (T("pipe resume"), f.resume()), e
				}, o.prototype.unpipe = function (e) {
					var t = this._readableState;
					if (0 === t.pipesCount) return this;
					if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);
					if (!e) {
						var n = t.pipes, r = t.pipesCount;
						t.pipes = null, t.pipesCount = 0, t.flowing = !1;
						for (var i = 0; r > i; i++) n[i].emit("unpipe", this);
						return this
					}
					var i = t.pipes.indexOf(e);
					return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
				}, o.prototype.on = function (e, t) {
					var r = k.prototype.on.call(this, e, t);
					if ("data" === e && !1 !== this._readableState.flowing && this.resume(), "readable" === e && this.readable) {
						var i = this._readableState;
						if (!i.readableListening) if (i.readableListening = !0, i.emittedReadable = !1, i.needReadable = !0, i.reading) i.length && d(this, i); else {
							var o = this;
							n.nextTick(function () {
								T("readable nexttick read 0"), o.read(0)
							})
						}
					}
					return r
				}, o.prototype.addListener = o.prototype.on, o.prototype.resume = function () {
					var e = this._readableState;
					return e.flowing || (T("resume"), e.flowing = !0, e.reading || (T("resume read 0"), this.read(0)), v(this, e)), this
				}, o.prototype.pause = function () {
					return T("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (T("pause"), this._readableState.flowing = !1, this.emit("pause")), this
				}, o.prototype.wrap = function (e) {
					var t = this._readableState, n = !1, r = this;
					e.on("end", function () {
						if (T("wrapped end"), t.decoder && !t.ended) {
							var e = t.decoder.end();
							e && e.length && r.push(e)
						}
						r.push(null)
					}), e.on("data", function (i) {
						if (T("wrapped data"), t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
							var o = r.push(i);
							o || (n = !0, e.pause())
						}
					});
					for (var i in e) S.isFunction(e[i]) && S.isUndefined(this[i]) && (this[i] = function (t) {
						return function () {
							return e[t].apply(e, arguments)
						}
					}(i));
					var o = ["error", "close", "destroy", "pause", "resume"];
					return o.forEach(function (t) {
						e.on(t, r.emit.bind(r, t))
					}), r._read = function (t) {
						T("wrapped _read", t), n && (n = !1, e.resume())
					}, r
				}, o._fromList = w
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			"core-util-is": 43,
			debuglog: 44,
			events: 2,
			stream: 9,
			"string_decoder/": 45,
			util: 17
		}], 41: [function (e, t) {
			function n(e, t) {
				this.afterTransform = function (e, n) {
					return r(t, e, n)
				}, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
			}

			function r(e, t, n) {
				var r = e._transformState;
				r.transforming = !1;
				var i = r.writecb;
				if (!i) return e.emit("error", new Error("no writecb in Transform class"));
				r.writechunk = null, r.writecb = null, s.isNullOrUndefined(n) || e.push(n), i && i(t);
				var o = e._readableState;
				o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
			}

			function i(e) {
				if (!(this instanceof i)) return new i(e);
				a.call(this, e), this._transformState = new n(e, this);
				var t = this;
				this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("prefinish", function () {
					s.isFunction(this._flush) ? this._flush(function (e) {
						o(t, e)
					}) : o(t)
				})
			}

			function o(e, t) {
				if (t) return e.emit("error", t);
				var n = e._writableState, r = e._transformState;
				if (n.length) throw new Error("calling transform done when ws.length != 0");
				if (r.transforming) throw new Error("calling transform done when still transforming");
				return e.push(null)
			}

			t.exports = i;
			var a = e("./_stream_duplex"), s = e("util");
			if (!s.isUndefined) {
				var l = e("core-util-is");
				for (var u in l) s[u] = l[u]
			}
			s.inherits(i, a), i.prototype.push = function (e, t) {
				return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t)
			}, i.prototype._transform = function () {
				throw new Error("not implemented")
			}, i.prototype._write = function (e, t, n) {
				var r = this._transformState;
				if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
					var i = this._readableState;
					(r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
				}
			}, i.prototype._read = function () {
				var e = this._transformState;
				s.isNull(e.writechunk) || !e.writecb || e.transforming ? e.needTransform = !0 : (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform))
			}
		}, {"./_stream_duplex": 38, "core-util-is": 43, util: 17}], 42: [function (e, t) {
			!function (n) {
				function r(e, t, n) {
					this.chunk = e, this.encoding = t, this.callback = n
				}

				function i(e, t) {
					e = e || {};
					var n = e.highWaterMark, r = e.objectMode ? 16 : 16384;
					this.highWaterMark = n || 0 === n ? n : r, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
					var i = e.decodeStrings === !1;
					this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
						h(t, e)
					}, this.writecb = null, this.writelen = 0, this.buffer = [], this.pendingcb = 0, this.prefinished = !1, this._errorEmitted = !1
				}

				function o(t) {
					return this instanceof o || this instanceof e("./_stream_duplex") ? (this._writableState = new i(t, this), this.writable = !0, C.call(this), void 0) : new o(t)
				}

				function a(e, t, r) {
					var i = new Error("write after end");
					e.emit("error", i), n.nextTick(function () {
						r(i)
					})
				}

				function s(e, t, r, i) {
					var o = !0;
					if (!(_.isBuffer(r) || _.isString(r) || _.isNullOrUndefined(r) || t.objectMode)) {
						var a = new TypeError("Invalid non-string/buffer chunk");
						e.emit("error", a), n.nextTick(function () {
							i(a)
						}), o = !1
					}
					return o
				}

				function l(e, t, n) {
					return !e.objectMode && e.decodeStrings !== !1 && _.isString(t) && (t = new x(t, n)), t
				}

				function u(e, t, n, i, o) {
					n = l(t, n, i), _.isBuffer(n) && (i = "buffer");
					var a = t.objectMode ? 1 : n.length;
					t.length += a;
					var s = t.length < t.highWaterMark;
					return s || (t.needDrain = !0), t.writing || t.corked ? t.buffer.push(new r(n, i, o)) : c(e, t, !1, a, n, i, o), s
				}

				function c(e, t, n, r, i, o, a) {
					t.writelen = r, t.writecb = a, t.writing = !0, t.sync = !0, n ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1
				}

				function f(e, t, r, i, o) {
					r ? n.nextTick(function () {
						t.pendingcb--, o(i)
					}) : (t.pendingcb--, o(i)), e.emit("error", i), e._errorEmitted = !0
				}

				function d(e) {
					e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
				}

				function h(e, t) {
					var r = e._writableState, i = r.sync, o = r.writecb;
					if (d(r), t) f(e, r, i, t, o); else {
						var a = v(e, r);
						a || r.corked || r.bufferProcessing || !r.buffer.length || g(e, r), i ? n.nextTick(function () {
							p(e, r, a, o)
						}) : p(e, r, a, o)
					}
				}

				function p(e, t, n, r) {
					n || m(e, t), t.pendingcb--, r(), y(e, t)
				}

				function m(e, t) {
					0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
				}

				function g(e, t) {
					if (t.bufferProcessing = !0, e._writev && t.buffer.length > 1) {
						for (var n = [], r = 0; r < t.buffer.length; r++) n.push(t.buffer[r].callback);
						t.pendingcb++, c(e, t, !0, t.length, t.buffer, "", function (e) {
							for (var r = 0; r < n.length; r++) t.pendingcb--, n[r](e)
						}), t.buffer = []
					} else {
						for (var r = 0; r < t.buffer.length; r++) {
							var i = t.buffer[r], o = i.chunk, a = i.encoding, s = i.callback,
								l = t.objectMode ? 1 : o.length;
							if (c(e, t, !1, l, o, a, s), t.writing) {
								r++;
								break
							}
						}
						r < t.buffer.length ? t.buffer = t.buffer.slice(r) : t.buffer.length = 0
					}
					t.bufferProcessing = !1
				}

				function v(e, t) {
					return t.ending && 0 === t.length && !t.finished && !t.writing
				}

				function b(e, t) {
					t.prefinished || (t.prefinished = !0, e.emit("prefinish"))
				}

				function y(e, t) {
					var n = v(e, t);
					return n && (0 === t.pendingcb ? (b(e, t), t.finished = !0, e.emit("finish")) : b(e, t)), n
				}

				function w(e, t, r) {
					t.ending = !0, y(e, t), r && (t.finished ? n.nextTick(r) : e.once("finish", r)), t.ended = !0
				}

				t.exports = o, o.WritableState = i;
				var _ = e("util"), x = e("buffer").Buffer;
				if (!_.isUndefined) {
					var k = e("core-util-is");
					for (var S in k) _[S] = k[S]
				}
				var C = e("stream");
				_.inherits(o, C), o.prototype.pipe = function () {
					this.emit("error", new Error("Cannot pipe. Not readable."))
				}, o.prototype.write = function (e, t, n) {
					var r = this._writableState, i = !1;
					return _.isFunction(t) && (n = t, t = null), _.isBuffer(e) ? t = "buffer" : t || (t = r.defaultEncoding), _.isFunction(n) || (n = function () {
					}), r.ended ? a(this, r, n) : s(this, r, e, n) && (r.pendingcb++, i = u(this, r, e, t, n)), i
				}, o.prototype.cork = function () {
					var e = this._writableState;
					e.corked++
				}, o.prototype.uncork = function () {
					var e = this._writableState;
					e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.buffer.length || g(this, e))
				}, o.prototype._write = function (e, t, n) {
					n(new Error("not implemented"))
				}, o.prototype._writev = null, o.prototype.end = function (e, t, n) {
					var r = this._writableState;
					_.isFunction(e) ? (n = e, e = null, t = null) : _.isFunction(t) && (n = t, t = null), _.isNullOrUndefined(e) || this.write(e, t), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || w(this, r, n)
				}
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			"core-util-is": 43,
			stream: 9,
			util: 17
		}], 43: [function (e, t, n) {
			!function (e) {
				function t(e) {
					return Array.isArray(e)
				}

				function r(e) {
					return "boolean" == typeof e
				}

				function i(e) {
					return null === e
				}

				function o(e) {
					return null == e
				}

				function a(e) {
					return "number" == typeof e
				}

				function s(e) {
					return "string" == typeof e
				}

				function l(e) {
					return "symbol" == typeof e
				}

				function u(e) {
					return void 0 === e
				}

				function c(e) {
					return f(e) && "[object RegExp]" === v(e)
				}

				function f(e) {
					return "object" == typeof e && null !== e
				}

				function d(e) {
					return f(e) && "[object Date]" === v(e)
				}

				function h(e) {
					return f(e) && ("[object Error]" === v(e) || e instanceof Error)
				}

				function p(e) {
					return "function" == typeof e
				}

				function m(e) {
					return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
				}

				function g(t) {
					return e.isBuffer(t)
				}

				function v(e) {
					return Object.prototype.toString.call(e)
				}

				n.isArray = t, n.isBoolean = r, n.isNull = i, n.isNullOrUndefined = o, n.isNumber = a, n.isString = s, n.isSymbol = l, n.isUndefined = u, n.isRegExp = c, n.isObject = f, n.isDate = d, n.isError = h, n.isFunction = p, n.isPrimitive = m, n.isBuffer = g
			}.call(this, e("buffer").Buffer)
		}, {buffer: 5}], 44: [function (e, t, n) {
			!function (r) {
				function i(e) {
					if (e = e.toUpperCase(), !a[e]) if (new RegExp("\\b" + e + "\\b", "i").test(s)) {
						var t = r.pid;
						a[e] = function () {
							var r = o.format.apply(n, arguments);
							console.error("%s %d: %s", e, t, r)
						}
					} else a[e] = function () {
					};
					return a[e]
				}

				var o = e("util");
				t.exports = o.debuglog || i;
				var a = {}, s = r.env.NODE_DEBUG || ""
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			util: 17
		}], 45: [function (e, t, n) {
			function r(e) {
				if (e && !l(e)) throw new Error("Unknown encoding: " + e)
			}

			function i(e) {
				return e.toString(this.encoding)
			}

			function o(e) {
				var t = this.charReceived = e.length % 2;
				return this.charLength = t ? 2 : 0, t
			}

			function a(e) {
				var t = this.charReceived = e.length % 3;
				return this.charLength = t ? 3 : 0, t
			}

			var s = e("buffer").Buffer, l = s.isEncoding || function (e) {
				switch (e && e.toLowerCase()) {
					case"hex":
					case"utf8":
					case"utf-8":
					case"ascii":
					case"binary":
					case"base64":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
					case"raw":
						return !0;
					default:
						return !1
				}
			}, u = n.StringDecoder = function (e) {
				switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), r(e), this.encoding) {
					case"utf8":
						this.surrogateSize = 3;
						break;
					case"ucs2":
					case"utf16le":
						this.surrogateSize = 2, this.detectIncompleteChar = o;
						break;
					case"base64":
						this.surrogateSize = 3, this.detectIncompleteChar = a;
						break;
					default:
						return this.write = i, void 0
				}
				this.charBuffer = new s(6), this.charReceived = 0, this.charLength = 0
			};
			u.prototype.write = function (e) {
				for (var t = "", n = 0; this.charLength;) {
					var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
					if (e.copy(this.charBuffer, this.charReceived, n, r), this.charReceived += r - n, n = r, this.charReceived < this.charLength) return "";
					t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
					var i = t.charCodeAt(t.length - 1);
					if (!(i >= 55296 && 56319 >= i)) {
						if (this.charReceived = this.charLength = 0, r == e.length) return t;
						e = e.slice(r, e.length);
						break
					}
					this.charLength += this.surrogateSize, t = ""
				}
				var o = this.detectIncompleteChar(e), a = e.length;
				this.charLength && (e.copy(this.charBuffer, 0, e.length - o, a), this.charReceived = o, a -= o), t += e.toString(this.encoding, 0, a);
				var a = t.length - 1, i = t.charCodeAt(a);
				if (i >= 55296 && 56319 >= i) {
					var s = this.surrogateSize;
					return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), this.charBuffer.write(t.charAt(t.length - 1), this.encoding), t.substring(0, a)
				}
				return t
			}, u.prototype.detectIncompleteChar = function (e) {
				for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
					var n = e[e.length - t];
					if (1 == t && 6 == n >> 5) {
						this.charLength = 2;
						break
					}
					if (2 >= t && 14 == n >> 4) {
						this.charLength = 3;
						break
					}
					if (3 >= t && 30 == n >> 3) {
						this.charLength = 4;
						break
					}
				}
				return t
			}, u.prototype.end = function (e) {
				var t = "";
				if (e && e.length && (t = this.write(e)), this.charReceived) {
					var n = this.charReceived, r = this.charBuffer, i = this.encoding;
					t += r.slice(0, n).toString(i)
				}
				return t
			}
		}, {buffer: 5}], 46: [function (e, t, n) {
			n = t.exports = e("./lib/_stream_readable.js"), n.Stream = e("stream"), n.Readable = n, n.Writable = e("./lib/_stream_writable.js"), n.Duplex = e("./lib/_stream_duplex.js"), n.Transform = e("./lib/_stream_transform.js"), n.PassThrough = e("./lib/_stream_passthrough.js")
		}, {
			"./lib/_stream_duplex.js": 38,
			"./lib/_stream_passthrough.js": 39,
			"./lib/_stream_readable.js": 40,
			"./lib/_stream_transform.js": 41,
			"./lib/_stream_writable.js": 42,
			stream: 9
		}], 47: [function (e, t) {
			"use strict";

			function n() {
			}

			function r(e, t) {
				this.object = e, this.state = t && t.state || t || new n
			}

			function i(e, t) {
				"string" == typeof t && (t = document.createTextNode(t));
				var n = document.createElement("span");
				return n.setAttribute("class", e), n.appendChild(t), n
			}

			var o = e("util"), a = e("insert-css");
			a(".object-explorer {background: white;padding: 1em;white-space: nowrap;overflow: auto;}.object-explorer .indent {padding-left: 1em;}.object-explorer .property-left {min-width: 10em;display: inline-block;}.object-explorer .expand-button {padding: 0.1em;margin: 0;font-size: 1em; height: auto;width: auto;background: none;border: none;color: black;outline: none;}.object-explorer .expand-button:hover {background: none;color: gray;}.object-explorer .property {color: #2AA198;}.object-explorer .number {color: #D33682;}.object-explorer .string {color: #859900;}.object-explorer .atom {color: #D33682;}"), t.exports = r, n.prototype.expand = function (e) {
				this["key:" + e.join(".")] = !0
			}, n.prototype.contract = function (e) {
				this["key:" + e.join(".")] = !1
			}, n.prototype.isExpanded = function (e) {
				return this["key:" + e.join(".")]
			}, r.prototype.appendTo = function (e) {
				var t = document.createElement("div");
				return t.setAttribute("class", "object-explorer"), t.appendChild(this.getNode(this.object, [])), e.appendChild(t)
			}, r.prototype.isExpanded = function (e) {
				return this.state.isExpanded(e)
			}, r.prototype.isInline = function (e) {
				return "string" == typeof e || "number" == typeof e ? !0 : e === !0 || e === !1 || null === e || void 0 === e ? !0 : Array.isArray(e) && 0 === e.length ? !0 : !Array.isArray(e) && e && "object" == typeof e && 0 === Object.keys(e).length ? !0 : !1
			}, r.prototype.getNode = function (e, t) {
				return "string" == typeof e || "number" == typeof e ? i(typeof e, o.inspect(e)) : e === !0 || e === !1 || null === e || void 0 === e ? i("atom", o.inspect(e)) : "[object Date]" === Object.prototype.toString.call(e) ? i("atom", e.toISOString()) : "[object RegExp]" === Object.prototype.toString.call(e) ? i("atom", e.toString()) : Array.isArray(e) ? this.getNodeForArray(e, t) : "object" == typeof e ? this.getNodeForObject(e, t) : void 0
			}, r.prototype.getExpandButton = function (e, t) {
				function n(e, t) {
					l[e] = t
				}

				function r() {
					a = !a, s.textContent = a ? o : i, a ? (l.expanded(), u.expand(t)) : (l.contracted(), u.contract(t))
				}

				var i = Array.isArray(e) ? "[+]" : "object" == typeof e ? "{+}" : "(+)",
					o = Array.isArray(e) ? "[-]" : "object" == typeof e ? "{-}" : "(-)", a = !1,
					s = document.createElement("button");
				s.setAttribute("class", "expand-button"), s.textContent = i;
				var l = {}, u = this.state;
				return s.addEventListener("click", r, !1), {node: s, on: n, toggle: r}
			}, r.prototype.getContractedNode = r.prototype.getNode, r.prototype.getNodeForArray = function (e, t) {
				if (0 === e.length) return document.createTextNode("[]");
				var n = this;
				e = e.map(function (e, r) {
					return n.getContractedNode(e, t.concat(r.toString()))
				});
				var r = document.createElement("div");
				return r.appendChild(document.createTextNode("[")), e.forEach(function (e) {
					var t = document.createElement("div");
					t.setAttribute("class", "indent"), t.appendChild(e), r.appendChild(t)
				}), r.appendChild(document.createTextNode("]")), r
			}, r.prototype.getNodeForObject = function (e, t) {
				if (0 === Object.keys(e).length) return document.createTextNode("{}");
				var n = this, r = document.createElement("div");
				return r.appendChild(document.createTextNode("{")), Object.keys(e).forEach(function (i) {
					r.appendChild(n.getNodeForProperty(i, e[i], "", t.concat(i)))
				}), r.appendChild(document.createTextNode("}")), r
			}, r.prototype.getNodeForProperty = function (e, t, n, r) {
				var o = document.createElement("div");
				o.setAttribute("class", "indent");
				var a = document.createElement("span");
				a.setAttribute("class", "property-left"), a.appendChild(i("property", e)), a.appendChild(document.createTextNode(": "));
				var s = i("property-right", n || "");
				if (this.isInline(t, r)) a.appendChild(this.getNode(t, r)), o.appendChild(a), o.appendChild(s); else {
					var l = this.getExpandButton(t, r);
					a.appendChild(l.node), o.appendChild(a), o.appendChild(s);
					var u = null, c = this;
					l.on("expanded", function () {
						null === u ? (u = c.getNode(t, r), o.appendChild(u)) : u.style.display = "block"
					}), l.on("contracted", function () {
						u.style.display = "none"
					}), this.isExpanded(r) && l.toggle()
				}
				return o
			}
		}, {"insert-css": 48, util: 17}], 48: [function (e, t) {
			var n = [];
			t.exports = function (e) {
				if (!(n.indexOf(e) >= 0)) {
					n.push(e);
					var t = document.createElement("style"), r = document.createTextNode(e);
					t.appendChild(r), document.head.childNodes.length ? document.head.insertBefore(t, document.head.childNodes[0]) : document.head.appendChild(t)
				}
			}
		}, {}]
	}, {}, 1);
})(function(){
	return function e(t, n, r) {
		function i(a, s) {
			if (!n[a]) {
				if (!t[a]) {
					var l = "function" == typeof require && require;
					if (!s && l) return l(a, !0);
					if (o) return o(a, !0);
					throw new Error("Cannot find module '" + a + "'")
				}
				var u = n[a] = {exports: {}};
				t[a][0].call(u.exports, function (e) {
					var n = t[a][1][e];
					return i(n ? n : e)
				}, u, u.exports, e, t, n, r)
			}
			return n[a].exports
		}

		return i(r);
	}({
		1: [function (e,t) {
			"use strict";

			t.exports=e("htmlparser2");
		}, {"code-mirror/mode/htmlmixed": 20, htmlparser2: 34, "object-explorer": 47}], 2: [function (e, t) {
			function n() {
				this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
			}

			function r(e) {
				return "function" == typeof e
			}

			function i(e) {
				return "number" == typeof e
			}

			function o(e) {
				return "object" == typeof e && null !== e
			}

			function a(e) {
				return void 0 === e
			}

			t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) {
				if (!i(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
				return this._maxListeners = e, this
			}, n.prototype.emit = function (e) {
				var t, n, i, s, l, u;
				if (this._events || (this._events = {}), "error" === e && (!this._events.error || o(this._events.error) && !this._events.error.length)) throw t = arguments[1], t instanceof Error ? t : TypeError('Uncaught, unspecified "error" event.');
				if (n = this._events[e], a(n)) return !1;
				if (r(n)) switch (arguments.length) {
					case 1:
						n.call(this);
						break;
					case 2:
						n.call(this, arguments[1]);
						break;
					case 3:
						n.call(this, arguments[1], arguments[2]);
						break;
					default:
						for (i = arguments.length, s = new Array(i - 1), l = 1; i > l; l++) s[l - 1] = arguments[l];
						n.apply(this, s)
				} else if (o(n)) {
					for (i = arguments.length, s = new Array(i - 1), l = 1; i > l; l++) s[l - 1] = arguments[l];
					for (u = n.slice(), i = u.length, l = 0; i > l; l++) u[l].apply(this, s)
				}
				return !0
			}, n.prototype.addListener = function (e, t) {
				var i;
				if (!r(t)) throw TypeError("listener must be a function");
				if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, r(t.listener) ? t.listener : t), this._events[e] ? o(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, o(this._events[e]) && !this._events[e].warned) {
					var i;
					i = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners, i && i > 0 && this._events[e].length > i && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), console.trace())
				}
				return this
			}, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) {
				function n() {
					this.removeListener(e, n), i || (i = !0, t.apply(this, arguments))
				}

				if (!r(t)) throw TypeError("listener must be a function");
				var i = !1;
				return n.listener = t, this.on(e, n), this
			}, n.prototype.removeListener = function (e, t) {
				var n, i, a, s;
				if (!r(t)) throw TypeError("listener must be a function");
				if (!this._events || !this._events[e]) return this;
				if (n = this._events[e], a = n.length, i = -1, n === t || r(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t); else if (o(n)) {
					for (s = a; s-- > 0;) if (n[s] === t || n[s].listener && n[s].listener === t) {
						i = s;
						break
					}
					if (0 > i) return this;
					1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
				}
				return this
			}, n.prototype.removeAllListeners = function (e) {
				var t, n;
				if (!this._events) return this;
				if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
				if (0 === arguments.length) {
					for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
					return this.removeAllListeners("removeListener"), this._events = {}, this
				}
				if (n = this._events[e], r(n)) this.removeListener(e, n); else for (; n.length;) this.removeListener(e, n[n.length - 1]);
				return delete this._events[e], this
			}, n.prototype.listeners = function (e) {
				var t;
				return t = this._events && this._events[e] ? r(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
			}, n.listenerCount = function (e, t) {
				var n;
				return n = e._events && e._events[t] ? r(e._events[t]) ? 1 : e._events[t].length : 0
			}
		}, {}], 3: [function (e, t) {
			t.exports = "function" == typeof Object.create ? function (e, t) {
				e.super_ = t, e.prototype = Object.create(t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				})
			} : function (e, t) {
				e.super_ = t;
				var n = function () {
				};
				n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
			}
		}, {}], 4: [function (e, t) {
			var n = t.exports = {};
			n.nextTick = function () {
				var e = "undefined" != typeof window && window.setImmediate,
					t = "undefined" != typeof window && window.postMessage && window.addEventListener;
				if (e) return function (e) {
					return window.setImmediate(e)
				};
				if (t) {
					var n = [];
					return window.addEventListener("message", function (e) {
						var t = e.source;
						if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), n.length > 0)) {
							var r = n.shift();
							r()
						}
					}, !0), function (e) {
						n.push(e), window.postMessage("process-tick", "*")
					}
				}
				return function (e) {
					setTimeout(e, 0)
				}
			}(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.binding = function () {
				throw new Error("process.binding is not supported")
			}, n.cwd = function () {
				return "/"
			}, n.chdir = function () {
				throw new Error("process.chdir is not supported")
			}
		}, {}], 5: [function (e, t, n) {
			function r(e, t, n) {
				if (!(this instanceof r)) return new r(e, t, n);
				var i = typeof e;
				if ("base64" === t && "string" === i) for (e = A(e); 0 !== e.length % 4;) e += "=";
				var o;
				if ("number" === i) o = T(e); else if ("string" === i) o = r.byteLength(e, t); else {
					if ("object" !== i) throw new Error("First argument needs to be a number, array or string.");
					o = T(e.length)
				}
				var a;
				r._useTypedArrays ? a = E(new Uint8Array(o)) : (a = this, a.length = o, a._isBuffer = !0);
				var s;
				if (r._useTypedArrays && "function" == typeof Uint8Array && e instanceof Uint8Array) a._set(e); else if (M(e)) for (s = 0; o > s; s++) a[s] = r.isBuffer(e) ? e.readUInt8(s) : e[s]; else if ("string" === i) a.write(e, 0, t); else if ("number" === i && !r._useTypedArrays && !n) for (s = 0; o > s; s++) a[s] = 0;
				return a
			}

			function i(e, t, n, i) {
				n = Number(n) || 0;
				var o = e.length - n;
				i ? (i = Number(i), i > o && (i = o)) : i = o;
				var a = t.length;
				W(0 === a % 2, "Invalid hex string"), i > a / 2 && (i = a / 2);
				for (var s = 0; i > s; s++) {
					var l = parseInt(t.substr(2 * s, 2), 16);
					W(!isNaN(l), "Invalid hex string"), e[n + s] = l
				}
				return r._charsWritten = 2 * s, s
			}

			function o(e, t, n, i) {
				var o = r._charsWritten = H(B(t), e, n, i);
				return o
			}

			function a(e, t, n, i) {
				var o = r._charsWritten = H(O(t), e, n, i);
				return o
			}

			function s(e, t, n, r) {
				return a(e, t, n, r)
			}

			function l(e, t, n, i) {
				var o = r._charsWritten = H(F(t), e, n, i);
				return o
			}

			function u(e, t, n) {
				return 0 === t && n === e.length ? P.fromByteArray(e) : P.fromByteArray(e.slice(t, n))
			}

			function c(e, t, n) {
				var r = "", i = "";
				n = Math.min(e.length, n);
				for (var o = t; n > o; o++) e[o] <= 127 ? (r += j(i) + String.fromCharCode(e[o]), i = "") : i += "%" + e[o].toString(16);
				return r + j(i)
			}

			function f(e, t, n) {
				var r = "";
				n = Math.min(e.length, n);
				for (var i = t; n > i; i++) r += String.fromCharCode(e[i]);
				return r
			}

			function d(e, t, n) {
				return f(e, t, n)
			}

			function h(e, t, n) {
				var r = e.length;
				(!t || 0 > t) && (t = 0), (!n || 0 > n || n > r) && (n = r);
				for (var i = "", o = t; n > o; o++) i += N(e[o]);
				return i
			}

			function p(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 1 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o;
					return n ? (o = e[t], i > t + 1 && (o |= e[t + 1] << 8)) : (o = e[t] << 8, i > t + 1 && (o |= e[t + 1])), o
				}
			}

			function m(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 3 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o;
					return n ? (i > t + 2 && (o = e[t + 2] << 16), i > t + 1 && (o |= e[t + 1] << 8), o |= e[t], i > t + 3 && (o += e[t + 3] << 24 >>> 0)) : (i > t + 1 && (o = e[t + 1] << 16), i > t + 2 && (o |= e[t + 2] << 8), i > t + 3 && (o |= e[t + 3]), o += e[t] << 24 >>> 0), o
				}
			}

			function g(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 1 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o = p(e, t, n, !0), a = 32768 & o;
					return a ? -1 * (65535 - o + 1) : o
				}
			}

			function v(e, t, n, r) {
				r || (W("boolean" == typeof n, "missing or invalid endian"), W(void 0 !== t && null !== t, "missing offset"), W(t + 3 < e.length, "Trying to read beyond buffer length"));
				var i = e.length;
				if (!(t >= i)) {
					var o = m(e, t, n, !0), a = 2147483648 & o;
					return a ? -1 * (4294967295 - o + 1) : o
				}
			}

			function b(e, t, n, r) {
				return r || (W("boolean" == typeof n, "missing or invalid endian"), W(t + 3 < e.length, "Trying to read beyond buffer length")), q.read(e, t, n, 23, 4)
			}

			function y(e, t, n, r) {
				return r || (W("boolean" == typeof n, "missing or invalid endian"), W(t + 7 < e.length, "Trying to read beyond buffer length")), q.read(e, t, n, 52, 8)
			}

			function w(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 1 < e.length, "trying to write beyond buffer length"), I(t, 65535));
				var o = e.length;
				if (!(n >= o)) for (var a = 0, s = Math.min(o - n, 2); s > a; a++) e[n + a] = (t & 255 << 8 * (r ? a : 1 - a)) >>> 8 * (r ? a : 1 - a)
			}

			function _(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "trying to write beyond buffer length"), I(t, 4294967295));
				var o = e.length;
				if (!(n >= o)) for (var a = 0, s = Math.min(o - n, 4); s > a; a++) e[n + a] = 255 & t >>> 8 * (r ? a : 3 - a)
			}

			function x(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 1 < e.length, "Trying to write beyond buffer length"), z(t, 32767, -32768));
				var o = e.length;
				n >= o || (t >= 0 ? w(e, t, n, r, i) : w(e, 65535 + t + 1, n, r, i))
			}

			function k(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "Trying to write beyond buffer length"), z(t, 2147483647, -2147483648));
				var o = e.length;
				n >= o || (t >= 0 ? _(e, t, n, r, i) : _(e, 4294967295 + t + 1, n, r, i))
			}

			function S(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 3 < e.length, "Trying to write beyond buffer length"), R(t, 3.4028234663852886e38, -3.4028234663852886e38));
				var o = e.length;
				n >= o || q.write(e, t, n, r, 23, 4)
			}

			function C(e, t, n, r, i) {
				i || (W(void 0 !== t && null !== t, "missing value"), W("boolean" == typeof r, "missing or invalid endian"), W(void 0 !== n && null !== n, "missing offset"), W(n + 7 < e.length, "Trying to write beyond buffer length"), R(t, 1.7976931348623157e308, -1.7976931348623157e308));
				var o = e.length;
				n >= o || q.write(e, t, n, r, 52, 8)
			}

			function A(e) {
				return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
			}

			function E(e) {
				return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = U.get, e.set = U.set, e.write = U.write, e.toString = U.toString, e.toLocaleString = U.toString, e.toJSON = U.toJSON, e.copy = U.copy, e.slice = U.slice, e.readUInt8 = U.readUInt8, e.readUInt16LE = U.readUInt16LE, e.readUInt16BE = U.readUInt16BE, e.readUInt32LE = U.readUInt32LE, e.readUInt32BE = U.readUInt32BE, e.readInt8 = U.readInt8, e.readInt16LE = U.readInt16LE, e.readInt16BE = U.readInt16BE, e.readInt32LE = U.readInt32LE, e.readInt32BE = U.readInt32BE, e.readFloatLE = U.readFloatLE, e.readFloatBE = U.readFloatBE, e.readDoubleLE = U.readDoubleLE, e.readDoubleBE = U.readDoubleBE, e.writeUInt8 = U.writeUInt8, e.writeUInt16LE = U.writeUInt16LE, e.writeUInt16BE = U.writeUInt16BE, e.writeUInt32LE = U.writeUInt32LE, e.writeUInt32BE = U.writeUInt32BE, e.writeInt8 = U.writeInt8, e.writeInt16LE = U.writeInt16LE, e.writeInt16BE = U.writeInt16BE, e.writeInt32LE = U.writeInt32LE, e.writeInt32BE = U.writeInt32BE, e.writeFloatLE = U.writeFloatLE, e.writeFloatBE = U.writeFloatBE, e.writeDoubleLE = U.writeDoubleLE, e.writeDoubleBE = U.writeDoubleBE, e.fill = U.fill, e.inspect = U.inspect, e.toArrayBuffer = U.toArrayBuffer, e
			}

			function L(e, t, n) {
				return "number" != typeof e ? n : (e = ~~e, e >= t ? t : e >= 0 ? e : (e += t, e >= 0 ? e : 0))
			}

			function T(e) {
				return e = ~~Math.ceil(+e), 0 > e ? 0 : e
			}

			function D(e) {
				return (Array.isArray || function (e) {
					return "[object Array]" === Object.prototype.toString.call(e)
				})(e)
			}

			function M(e) {
				return D(e) || r.isBuffer(e) || e && "object" == typeof e && "number" == typeof e.length
			}

			function N(e) {
				return 16 > e ? "0" + e.toString(16) : e.toString(16)
			}

			function B(e) {
				for (var t = [], n = 0; n < e.length; n++) {
					var r = e.charCodeAt(n);
					if (127 >= r) t.push(e.charCodeAt(n)); else {
						var i = n;
						r >= 55296 && 57343 >= r && n++;
						for (var o = encodeURIComponent(e.slice(i, n + 1)).substr(1).split("%"), a = 0; a < o.length; a++) t.push(parseInt(o[a], 16))
					}
				}
				return t
			}

			function O(e) {
				for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
				return t
			}

			function F(e) {
				return P.toByteArray(e)
			}

			function H(e, t, n, r) {
				for (var i = 0; r > i && !(i + n >= t.length || i >= e.length); i++) t[i + n] = e[i];
				return i
			}

			function j(e) {
				try {
					return decodeURIComponent(e)
				} catch (t) {
					return String.fromCharCode(65533)
				}
			}

			function I(e, t) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(e >= 0, "specified a negative value for writing an unsigned value"), W(t >= e, "value is larger than maximum value for type"), W(Math.floor(e) === e, "value has a fractional component")
			}

			function z(e, t, n) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(t >= e, "value larger than maximum allowed value"), W(e >= n, "value smaller than minimum allowed value"), W(Math.floor(e) === e, "value has a fractional component")
			}

			function R(e, t, n) {
				W("number" == typeof e, "cannot write a non-number as a number"), W(t >= e, "value larger than maximum allowed value"), W(e >= n, "value smaller than minimum allowed value")
			}

			function W(e, t) {
				if (!e) throw new Error(t || "Failed assertion")
			}

			var P = e("base64-js"), q = e("ieee754");
			n.Buffer = r, n.SlowBuffer = r, n.INSPECT_MAX_BYTES = 50, r.poolSize = 8192, r._useTypedArrays = function () {
				if ("undefined" == typeof Uint8Array || "undefined" == typeof ArrayBuffer) return !1;
				try {
					var e = new Uint8Array(0);
					return e.foo = function () {
						return 42
					}, 42 === e.foo() && "function" == typeof e.subarray
				} catch (t) {
					return !1
				}
			}(), r.isEncoding = function (e) {
				switch (String(e).toLowerCase()) {
					case"hex":
					case"utf8":
					case"utf-8":
					case"ascii":
					case"binary":
					case"base64":
					case"raw":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return !0;
					default:
						return !1
				}
			}, r.isBuffer = function (e) {
				return !(null === e || void 0 === e || !e._isBuffer)
			}, r.byteLength = function (e, t) {
				var n;
				switch (e += "", t || "utf8") {
					case"hex":
						n = e.length / 2;
						break;
					case"utf8":
					case"utf-8":
						n = B(e).length;
						break;
					case"ascii":
					case"binary":
					case"raw":
						n = e.length;
						break;
					case"base64":
						n = F(e).length;
						break;
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						n = 2 * e.length;
						break;
					default:
						throw new Error("Unknown encoding")
				}
				return n
			}, r.concat = function (e, t) {
				if (W(D(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new r(0);
				if (1 === e.length) return e[0];
				var n;
				if ("number" != typeof t) for (t = 0, n = 0; n < e.length; n++) t += e[n].length;
				var i = new r(t), o = 0;
				for (n = 0; n < e.length; n++) {
					var a = e[n];
					a.copy(i, o), o += a.length
				}
				return i
			}, r.prototype.write = function (e, t, n, r) {
				if (isFinite(t)) isFinite(n) || (r = n, n = void 0); else {
					var u = r;
					r = t, t = n, n = u
				}
				t = Number(t) || 0;
				var c = this.length - t;
				switch (n ? (n = Number(n), n > c && (n = c)) : n = c, r = String(r || "utf8").toLowerCase()) {
					case"hex":
						return i(this, e, t, n);
					case"utf8":
					case"utf-8":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return o(this, e, t, n);
					case"ascii":
						return a(this, e, t, n);
					case"binary":
						return s(this, e, t, n);
					case"base64":
						return l(this, e, t, n);
					default:
						throw new Error("Unknown encoding")
				}
			}, r.prototype.toString = function (e, t, n) {
				var r = this;
				if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, n = void 0 !== n ? Number(n) : n = r.length, n === t) return "";
				switch (e) {
					case"hex":
						return h(r, t, n);
					case"utf8":
					case"utf-8":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
						return c(r, t, n);
					case"ascii":
						return f(r, t, n);
					case"binary":
						return d(r, t, n);
					case"base64":
						return u(r, t, n);
					default:
						throw new Error("Unknown encoding")
				}
			}, r.prototype.toJSON = function () {
				return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
			}, r.prototype.copy = function (e, t, n, r) {
				var i = this;
				if (n || (n = 0), r || 0 === r || (r = this.length), t || (t = 0), r !== n && 0 !== e.length && 0 !== i.length) {
					W(r >= n, "sourceEnd < sourceStart"), W(t >= 0 && t < e.length, "targetStart out of bounds"), W(n >= 0 && n < i.length, "sourceStart out of bounds"), W(r >= 0 && r <= i.length, "sourceEnd out of bounds"), r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
					for (var o = 0; r - n > o; o++) e[o + t] = this[o + n]
				}
			}, r.prototype.slice = function (e, t) {
				var n = this.length;
				if (e = L(e, n, 0), t = L(t, n, n), r._useTypedArrays) return E(this.subarray(e, t));
				for (var i = t - e, o = new r(i, void 0, !0), a = 0; i > a; a++) o[a] = this[a + e];
				return o
			}, r.prototype.get = function (e) {
				return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
			}, r.prototype.set = function (e, t) {
				return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
			}, r.prototype.readUInt8 = function (e, t) {
				return t || (W(void 0 !== e && null !== e, "missing offset"), W(e < this.length, "Trying to read beyond buffer length")), e >= this.length ? void 0 : this[e]
			}, r.prototype.readUInt16LE = function (e, t) {
				return p(this, e, !0, t)
			}, r.prototype.readUInt16BE = function (e, t) {
				return p(this, e, !1, t)
			}, r.prototype.readUInt32LE = function (e, t) {
				return m(this, e, !0, t)
			}, r.prototype.readUInt32BE = function (e, t) {
				return m(this, e, !1, t)
			}, r.prototype.readInt8 = function (e, t) {
				if (t || (W(void 0 !== e && null !== e, "missing offset"), W(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) {
					var n = 128 & this[e];
					return n ? -1 * (255 - this[e] + 1) : this[e]
				}
			}, r.prototype.readInt16LE = function (e, t) {
				return g(this, e, !0, t)
			}, r.prototype.readInt16BE = function (e, t) {
				return g(this, e, !1, t)
			}, r.prototype.readInt32LE = function (e, t) {
				return v(this, e, !0, t)
			}, r.prototype.readInt32BE = function (e, t) {
				return v(this, e, !1, t)
			}, r.prototype.readFloatLE = function (e, t) {
				return b(this, e, !0, t)
			}, r.prototype.readFloatBE = function (e, t) {
				return b(this, e, !1, t)
			}, r.prototype.readDoubleLE = function (e, t) {
				return y(this, e, !0, t)
			}, r.prototype.readDoubleBE = function (e, t) {
				return y(this, e, !1, t)
			}, r.prototype.writeUInt8 = function (e, t, n) {
				n || (W(void 0 !== e && null !== e, "missing value"), W(void 0 !== t && null !== t, "missing offset"), W(t < this.length, "trying to write beyond buffer length"), I(e, 255)), t >= this.length || (this[t] = e)
			}, r.prototype.writeUInt16LE = function (e, t, n) {
				w(this, e, t, !0, n)
			}, r.prototype.writeUInt16BE = function (e, t, n) {
				w(this, e, t, !1, n)
			}, r.prototype.writeUInt32LE = function (e, t, n) {
				_(this, e, t, !0, n)
			}, r.prototype.writeUInt32BE = function (e, t, n) {
				_(this, e, t, !1, n)
			}, r.prototype.writeInt8 = function (e, t, n) {
				n || (W(void 0 !== e && null !== e, "missing value"), W(void 0 !== t && null !== t, "missing offset"), W(t < this.length, "Trying to write beyond buffer length"), z(e, 127, -128)), t >= this.length || (e >= 0 ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n))
			}, r.prototype.writeInt16LE = function (e, t, n) {
				x(this, e, t, !0, n)
			}, r.prototype.writeInt16BE = function (e, t, n) {
				x(this, e, t, !1, n)
			}, r.prototype.writeInt32LE = function (e, t, n) {
				k(this, e, t, !0, n)
			}, r.prototype.writeInt32BE = function (e, t, n) {
				k(this, e, t, !1, n)
			}, r.prototype.writeFloatLE = function (e, t, n) {
				S(this, e, t, !0, n)
			}, r.prototype.writeFloatBE = function (e, t, n) {
				S(this, e, t, !1, n)
			}, r.prototype.writeDoubleLE = function (e, t, n) {
				C(this, e, t, !0, n)
			}, r.prototype.writeDoubleBE = function (e, t, n) {
				C(this, e, t, !1, n)
			}, r.prototype.fill = function (e, t, n) {
				if (e || (e = 0), t || (t = 0), n || (n = this.length), "string" == typeof e && (e = e.charCodeAt(0)), W("number" == typeof e && !isNaN(e), "value is not a number"), W(n >= t, "end < start"), n !== t && 0 !== this.length) {
					W(t >= 0 && t < this.length, "start out of bounds"), W(n >= 0 && n <= this.length, "end out of bounds");
					for (var r = t; n > r; r++) this[r] = e
				}
			}, r.prototype.inspect = function () {
				for (var e = [], t = this.length, r = 0; t > r; r++) if (e[r] = N(this[r]), r === n.INSPECT_MAX_BYTES) {
					e[r + 1] = "...";
					break
				}
				return "<Buffer " + e.join(" ") + ">"
			}, r.prototype.toArrayBuffer = function () {
				if ("function" == typeof Uint8Array) {
					if (r._useTypedArrays) return new r(this).buffer;
					for (var e = new Uint8Array(this.length), t = 0, n = e.length; n > t; t += 1) e[t] = this[t];
					return e.buffer
				}
				throw new Error("Buffer.toArrayBuffer not supported in this browser")
			};
			var U = r.prototype
		}, {"base64-js": 6, ieee754: 7}], 6: [function (e, t) {
			var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			!function () {
				"use strict";

				function e(e) {
					var t = e.charCodeAt(0);
					return t === a ? 62 : t === s ? 63 : l > t ? -1 : l + 10 > t ? t - l + 26 + 26 : c + 26 > t ? t - c : u + 26 > t ? t - u + 26 : void 0
				}

				function r(t) {
					function n(e) {
						u[f++] = e
					}

					var r, i, a, s, l, u;
					if (t.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
					var c = t.length;
					l = "=" === t.charAt(c - 2) ? 2 : "=" === t.charAt(c - 1) ? 1 : 0, u = new o(3 * t.length / 4 - l), a = l > 0 ? t.length - 4 : t.length;
					var f = 0;
					for (r = 0, i = 0; a > r; r += 4, i += 3) s = e(t.charAt(r)) << 18 | e(t.charAt(r + 1)) << 12 | e(t.charAt(r + 2)) << 6 | e(t.charAt(r + 3)), n((16711680 & s) >> 16), n((65280 & s) >> 8), n(255 & s);
					return 2 === l ? (s = e(t.charAt(r)) << 2 | e(t.charAt(r + 1)) >> 4, n(255 & s)) : 1 === l && (s = e(t.charAt(r)) << 10 | e(t.charAt(r + 1)) << 4 | e(t.charAt(r + 2)) >> 2, n(255 & s >> 8), n(255 & s)), u
				}

				function i(e) {
					function t(e) {
						return n.charAt(e)
					}

					function r(e) {
						return t(63 & e >> 18) + t(63 & e >> 12) + t(63 & e >> 6) + t(63 & e)
					}

					var i, o, a, s = e.length % 3, l = "";
					for (i = 0, a = e.length - s; a > i; i += 3) o = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], l += r(o);
					switch (s) {
						case 1:
							o = e[e.length - 1], l += t(o >> 2), l += t(63 & o << 4), l += "==";
							break;
						case 2:
							o = (e[e.length - 2] << 8) + e[e.length - 1], l += t(o >> 10), l += t(63 & o >> 4), l += t(63 & o << 2), l += "="
					}
					return l
				}

				var o = "undefined" != typeof Uint8Array ? Uint8Array : Array;
				"0".charCodeAt(0);
				var a = "+".charCodeAt(0), s = "/".charCodeAt(0), l = "0".charCodeAt(0), u = "a".charCodeAt(0),
					c = "A".charCodeAt(0);
				t.exports.toByteArray = r, t.exports.fromByteArray = i
			}()
		}, {}], 7: [function (e, t, n) {
			n.read = function (e, t, n, r, i) {
				var o, a, s = 8 * i - r - 1, l = (1 << s) - 1, u = l >> 1, c = -7, f = n ? i - 1 : 0, d = n ? -1 : 1,
					h = e[t + f];
				for (f += d, o = h & (1 << -c) - 1, h >>= -c, c += s; c > 0; o = 256 * o + e[t + f], f += d, c -= 8) ;
				for (a = o & (1 << -c) - 1, o >>= -c, c += r; c > 0; a = 256 * a + e[t + f], f += d, c -= 8) ;
				if (0 === o) o = 1 - u; else {
					if (o === l) return a ? 0 / 0 : 1 / 0 * (h ? -1 : 1);
					a += Math.pow(2, r), o -= u
				}
				return (h ? -1 : 1) * a * Math.pow(2, o - r)
			}, n.write = function (e, t, n, r, i, o) {
				var a, s, l, u = 8 * o - i - 1, c = (1 << u) - 1, f = c >> 1,
					d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = r ? 0 : o - 1, p = r ? 1 : -1,
					m = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
				for (t = Math.abs(t), isNaN(t) || 1 / 0 === t ? (s = isNaN(t) ? 1 : 0, a = c) : (a = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), t += a + f >= 1 ? d / l : d * Math.pow(2, 1 - f), t * l >= 2 && (a++, l /= 2), a + f >= c ? (s = 0, a = c) : a + f >= 1 ? (s = (t * l - 1) * Math.pow(2, i), a += f) : (s = t * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + h] = 255 & s, h += p, s /= 256, i -= 8) ;
				for (a = a << i | s, u += i; u > 0; e[n + h] = 255 & a, h += p, a /= 256, u -= 8) ;
				e[n + h - p] |= 128 * m
			}
		}, {}], 8: [function (e, t) {
			function n(e) {
				return this instanceof n ? (a.call(this, e), s.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", r), void 0) : new n(e)
			}

			function r() {
				if (!this.allowHalfOpen && !this._writableState.ended) {
					var e = this;
					o(function () {
						e.end()
					})
				}
			}

			t.exports = n;
			var i = e("inherits"), o = e("process/browser.js").nextTick, a = e("./readable.js"), s = e("./writable.js");
			i(n, a), n.prototype.write = s.prototype.write, n.prototype.end = s.prototype.end, n.prototype._write = s.prototype._write
		}, {"./readable.js": 12, "./writable.js": 14, inherits: 3, "process/browser.js": 10}], 9: [function (e, t) {
			function n() {
				r.call(this)
			}

			t.exports = n;
			var r = e("events").EventEmitter, i = e("inherits");
			i(n, r), n.Readable = e("./readable.js"), n.Writable = e("./writable.js"), n.Duplex = e("./duplex.js"), n.Transform = e("./transform.js"), n.PassThrough = e("./passthrough.js"), n.Stream = n, n.prototype.pipe = function (e, t) {
				function n(t) {
					e.writable && !1 === e.write(t) && u.pause && u.pause()
				}

				function i() {
					u.readable && u.resume && u.resume()
				}

				function o() {
					c || (c = !0, e.end())
				}

				function a() {
					c || (c = !0, "function" == typeof e.destroy && e.destroy())
				}

				function s(e) {
					if (l(), 0 === r.listenerCount(this, "error")) throw e
				}

				function l() {
					u.removeListener("data", n), e.removeListener("drain", i), u.removeListener("end", o), u.removeListener("close", a), u.removeListener("error", s), e.removeListener("error", s), u.removeListener("end", l), u.removeListener("close", l), e.removeListener("close", l)
				}

				var u = this;
				u.on("data", n), e.on("drain", i), e._isStdio || t && t.end === !1 || (u.on("end", o), u.on("close", a));
				var c = !1;
				return u.on("error", s), e.on("error", s), u.on("end", l), u.on("close", l), e.on("close", l), e.emit("pipe", u), e
			}
		}, {
			"./duplex.js": 8,
			"./passthrough.js": 11,
			"./readable.js": 12,
			"./transform.js": 13,
			"./writable.js": 14,
			events: 2,
			inherits: 3
		}], 10: [function (e, t) {
			t.exports = e(4)
		}, {}], 11: [function (e, t) {
			function n(e) {
				return this instanceof n ? (r.call(this, e), void 0) : new n(e)
			}

			t.exports = n;
			var r = e("./transform.js"), i = e("inherits");
			i(n, r), n.prototype._transform = function (e, t, n) {
				n(null, e)
			}
		}, {"./transform.js": 13, inherits: 3}], 12: [function (e, t) {
			!function (n) {
				function r(t) {
					t = t || {};
					var n = t.highWaterMark;
					this.highWaterMark = n || 0 === n ? n : 16384, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = !1, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.calledRead = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (k || (k = e("string_decoder").StringDecoder), this.decoder = new k(t.encoding), this.encoding = t.encoding)
				}

				function i(e) {
					return this instanceof i ? (this._readableState = new r(e, this), this.readable = !0, C.call(this), void 0) : new i(e)
				}

				function o(e, t, n, r, i) {
					var o = u(t, n);
					if (o) e.emit("error", o); else if (null === n || void 0 === n) t.reading = !1, t.ended || c(e, t); else if (t.objectMode || n && n.length > 0) if (t.ended && !i) {
						var s = new Error("stream.push() after EOF");
						e.emit("error", s)
					} else if (t.endEmitted && i) {
						var s = new Error("stream.unshift() after end event");
						e.emit("error", s)
					} else !t.decoder || i || r || (n = t.decoder.write(n)), t.length += t.objectMode ? 1 : n.length, i ? t.buffer.unshift(n) : (t.reading = !1, t.buffer.push(n)), t.needReadable && f(e), h(e, t); else i || (t.reading = !1);
					return a(t)
				}

				function a(e) {
					return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
				}

				function s(e) {
					if (e >= T) e = T; else {
						e--;
						for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
						e++
					}
					return e
				}

				function l(e, t) {
					return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || null === e ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = s(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
				}

				function u(e, t) {
					var n = null;
					return A.isBuffer(t) || "string" == typeof t || null === t || void 0 === t || e.objectMode || n || (n = new TypeError("Invalid non-string/buffer chunk")), n
				}

				function c(e, t) {
					if (t.decoder && !t.ended) {
						var n = t.decoder.end();
						n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length)
					}
					t.ended = !0, t.length > 0 ? f(e) : w(e)
				}

				function f(e) {
					var t = e._readableState;
					t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, t.sync ? E(function () {
						d(e)
					}) : d(e))
				}

				function d(e) {
					e.emit("readable")
				}

				function h(e, t) {
					t.readingMore || (t.readingMore = !0, E(function () {
						p(e, t)
					}))
				}

				function p(e, t) {
					for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (e.read(0), n !== t.length);) n = t.length;
					t.readingMore = !1
				}

				function m(e) {
					return function () {
						var t = e._readableState;
						t.awaitDrain--, 0 === t.awaitDrain && g(e)
					}
				}

				function g(e) {
					function t(e) {
						var t = e.write(n);
						!1 === t && r.awaitDrain++
					}

					var n, r = e._readableState;
					for (r.awaitDrain = 0; r.pipesCount && null !== (n = e.read());) if (1 === r.pipesCount ? t(r.pipes, 0, null) : _(r.pipes, t), e.emit("data", n), r.awaitDrain > 0) return;
					return 0 === r.pipesCount ? (r.flowing = !1, S.listenerCount(e, "data") > 0 && b(e), void 0) : (r.ranOut = !0, void 0)
				}

				function v() {
					this._readableState.ranOut && (this._readableState.ranOut = !1, g(this))
				}

				function b(e, t) {
					var n = e._readableState;
					if (n.flowing) throw new Error("Cannot switch to old mode now.");
					var r = t || !1, i = !1;
					e.readable = !0, e.pipe = C.prototype.pipe, e.on = e.addListener = C.prototype.on, e.on("readable", function () {
						i = !0;
						for (var t; !r && null !== (t = e.read());) e.emit("data", t);
						null === t && (i = !1, e._readableState.needReadable = !0)
					}), e.pause = function () {
						r = !0, this.emit("pause")
					}, e.resume = function () {
						r = !1, i ? E(function () {
							e.emit("readable")
						}) : this.read(0), this.emit("resume")
					}, e.emit("readable")
				}

				function y(e, t) {
					var n, r = t.buffer, i = t.length, o = !!t.decoder, a = !!t.objectMode;
					if (0 === r.length) return null;
					if (0 === i) n = null; else if (a) n = r.shift(); else if (!e || e >= i) n = o ? r.join("") : A.concat(r, i), r.length = 0; else if (e < r[0].length) {
						var s = r[0];
						n = s.slice(0, e), r[0] = s.slice(e)
					} else if (e === r[0].length) n = r.shift(); else {
						n = o ? "" : new A(e);
						for (var l = 0, u = 0, c = r.length; c > u && e > l; u++) {
							var s = r[0], f = Math.min(e - l, s.length);
							o ? n += s.slice(0, f) : s.copy(n, l, 0, f), f < s.length ? r[0] = s.slice(f) : r.shift(), l += f
						}
					}
					return n
				}

				function w(e) {
					var t = e._readableState;
					if (t.length > 0) throw new Error("endReadable called on non-empty stream");
					!t.endEmitted && t.calledRead && (t.ended = !0, E(function () {
						t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
					}))
				}

				function _(e, t) {
					for (var n = 0, r = e.length; r > n; n++) t(e[n], n)
				}

				function x(e, t) {
					for (var n = 0, r = e.length; r > n; n++) if (e[n] === t) return n;
					return -1
				}

				t.exports = i, i.ReadableState = r;
				var k, S = e("events").EventEmitter, C = e("./index.js"), A = e("buffer").Buffer,
					E = e("process/browser.js").nextTick, L = e("inherits");
				L(i, C), i.prototype.push = function (e, t) {
					var n = this._readableState;
					return "string" != typeof e || n.objectMode || (t = t || n.defaultEncoding, t !== n.encoding && (e = new A(e, t), t = "")), o(this, n, e, t, !1)
				}, i.prototype.unshift = function (e) {
					var t = this._readableState;
					return o(this, t, e, "", !0)
				}, i.prototype.setEncoding = function (t) {
					k || (k = e("string_decoder").StringDecoder), this._readableState.decoder = new k(t), this._readableState.encoding = t
				};
				var T = 8388608;
				i.prototype.read = function (e) {
					var t = this._readableState;
					t.calledRead = !0;
					var n = e;
					if (("number" != typeof e || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return f(this), null;
					if (e = l(e, t), 0 === e && t.ended) return 0 === t.length && w(this), null;
					var r = t.needReadable;
					t.length - e <= t.highWaterMark && (r = !0), (t.ended || t.reading) && (r = !1), r && (t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), r && !t.reading && (e = l(n, t));
					var i;
					return i = e > 0 ? y(e, t) : null, null === i && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), t.ended && !t.endEmitted && 0 === t.length && w(this), i
				}, i.prototype._read = function () {
					this.emit("error", new Error("not implemented"))
				}, i.prototype.pipe = function (e, t) {
					function r(e) {
						e === c && o()
					}

					function i() {
						e.end()
					}

					function o() {
						e.removeListener("close", s), e.removeListener("finish", l), e.removeListener("drain", p), e.removeListener("error", a), e.removeListener("unpipe", r), c.removeListener("end", i), c.removeListener("end", o), (!e._writableState || e._writableState.needDrain) && p()
					}

					function a(t) {
						u(), 0 === b && 0 === S.listenerCount(e, "error") && e.emit("error", t)
					}

					function s() {
						e.removeListener("finish", l), u()
					}

					function l() {
						e.removeListener("close", s), u()
					}

					function u() {
						c.unpipe(e)
					}

					var c = this, f = this._readableState;
					switch (f.pipesCount) {
						case 0:
							f.pipes = e;
							break;
						case 1:
							f.pipes = [f.pipes, e];
							break;
						default:
							f.pipes.push(e)
					}
					f.pipesCount += 1;
					var d = (!t || t.end !== !1) && e !== n.stdout && e !== n.stderr, h = d ? i : o;
					f.endEmitted ? E(h) : c.once("end", h), e.on("unpipe", r);
					var p = m(c);
					e.on("drain", p);
					var b = S.listenerCount(e, "error");
					return e.once("error", a), e.once("close", s), e.once("finish", l), e.emit("pipe", c), f.flowing || (this.on("readable", v), f.flowing = !0, E(function () {
						g(c)
					})), e
				}, i.prototype.unpipe = function (e) {
					var t = this._readableState;
					if (0 === t.pipesCount) return this;
					if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, this.removeListener("readable", v), t.flowing = !1, e && e.emit("unpipe", this), this);
					if (!e) {
						var n = t.pipes, r = t.pipesCount;
						t.pipes = null, t.pipesCount = 0, this.removeListener("readable", v), t.flowing = !1;
						for (var i = 0; r > i; i++) n[i].emit("unpipe", this);
						return this
					}
					var i = x(t.pipes, e);
					return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
				}, i.prototype.on = function (e, t) {
					var n = C.prototype.on.call(this, e, t);
					if ("data" !== e || this._readableState.flowing || b(this), "readable" === e && this.readable) {
						var r = this._readableState;
						r.readableListening || (r.readableListening = !0, r.emittedReadable = !1, r.needReadable = !0, r.reading ? r.length && f(this, r) : this.read(0))
					}
					return n
				}, i.prototype.addListener = i.prototype.on, i.prototype.resume = function () {
					b(this), this.read(0), this.emit("resume")
				}, i.prototype.pause = function () {
					b(this, !0), this.emit("pause")
				}, i.prototype.wrap = function (e) {
					var t = this._readableState, n = !1, r = this;
					e.on("end", function () {
						if (t.decoder && !t.ended) {
							var e = t.decoder.end();
							e && e.length && r.push(e)
						}
						r.push(null)
					}), e.on("data", function (i) {
						if (t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
							var o = r.push(i);
							o || (n = !0, e.pause())
						}
					});
					for (var i in e) "function" == typeof e[i] && "undefined" == typeof this[i] && (this[i] = function (t) {
						return function () {
							return e[t].apply(e, arguments)
						}
					}(i));
					var o = ["error", "close", "destroy", "pause", "resume"];
					return _(o, function (t) {
						e.on(t, function (e) {
							return r.emit.apply(r, t, e)
						})
					}), r._read = function () {
						n && (n = !1, e.resume())
					}, r
				}, i._fromList = y
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"./index.js": 9,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			events: 2,
			inherits: 3,
			"process/browser.js": 10,
			string_decoder: 15
		}], 13: [function (e, t) {
			function n(e, t) {
				this.afterTransform = function (e, n) {
					return r(t, e, n)
				}, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
			}

			function r(e, t, n) {
				var r = e._transformState;
				r.transforming = !1;
				var i = r.writecb;
				if (!i) return e.emit("error", new Error("no writecb in Transform class"));
				r.writechunk = null, r.writecb = null, null !== n && void 0 !== n && e.push(n), i && i(t);
				var o = e._readableState;
				o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
			}

			function i(e) {
				if (!(this instanceof i)) return new i(e);
				a.call(this, e), this._transformState = new n(e, this);
				var t = this;
				this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("finish", function () {
					"function" == typeof this._flush ? this._flush(function (e) {
						o(t, e)
					}) : o(t)
				})
			}

			function o(e, t) {
				if (t) return e.emit("error", t);
				var n = e._writableState;
				e._readableState;
				var r = e._transformState;
				if (n.length) throw new Error("calling transform done when ws.length != 0");
				if (r.transforming) throw new Error("calling transform done when still transforming");
				return e.push(null)
			}

			t.exports = i;
			var a = e("./duplex.js"), s = e("inherits");
			s(i, a), i.prototype.push = function (e, t) {
				return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t)
			}, i.prototype._transform = function () {
				throw new Error("not implemented")
			}, i.prototype._write = function (e, t, n) {
				var r = this._transformState;
				if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
					var i = this._readableState;
					(r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
				}
			}, i.prototype._read = function () {
				var e = this._transformState;
				e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0
			}
		}, {"./duplex.js": 8, inherits: 3}], 14: [function (e, t) {
			function n(e, t, n) {
				this.chunk = e, this.encoding = t, this.callback = n
			}

			function r(e, t) {
				e = e || {};
				var n = e.highWaterMark;
				this.highWaterMark = n || 0 === n ? n : 16384, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
				var r = e.decodeStrings === !1;
				this.decodeStrings = !r, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
					d(t, e)
				}, this.writecb = null, this.writelen = 0, this.buffer = []
			}

			function i(e) {
				return this instanceof i || this instanceof x.Duplex ? (this._writableState = new r(e, this), this.writable = !0, x.call(this), void 0) : new i(e)
			}

			function o(e, t, n) {
				var r = new Error("write after end");
				e.emit("error", r), k(function () {
					n(r)
				})
			}

			function a(e, t, n, r) {
				var i = !0;
				if (!S.isBuffer(n) && "string" != typeof n && null !== n && void 0 !== n && !t.objectMode) {
					var o = new TypeError("Invalid non-string/buffer chunk");
					e.emit("error", o), k(function () {
						r(o)
					}), i = !1
				}
				return i
			}

			function s(e, t, n) {
				return e.objectMode || e.decodeStrings === !1 || "string" != typeof t || (t = new S(t, n)), t
			}

			function l(e, t, r, i, o) {
				r = s(t, r, i);
				var a = t.objectMode ? 1 : r.length;
				t.length += a;
				var l = t.length < t.highWaterMark;
				return t.needDrain = !l, t.writing ? t.buffer.push(new n(r, i, o)) : u(e, t, a, r, i, o), l
			}

			function u(e, t, n, r, i, o) {
				t.writelen = n, t.writecb = o, t.writing = !0, t.sync = !0, e._write(r, i, t.onwrite), t.sync = !1
			}

			function c(e, t, n, r, i) {
				n ? k(function () {
					i(r)
				}) : i(r), e.emit("error", r)
			}

			function f(e) {
				e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
			}

			function d(e, t) {
				var n = e._writableState, r = n.sync, i = n.writecb;
				if (f(n), t) c(e, n, r, t, i); else {
					var o = g(e, n);
					o || n.bufferProcessing || !n.buffer.length || m(e, n), r ? k(function () {
						h(e, n, o, i)
					}) : h(e, n, o, i)
				}
			}

			function h(e, t, n, r) {
				n || p(e, t), r(), n && v(e, t)
			}

			function p(e, t) {
				0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
			}

			function m(e, t) {
				t.bufferProcessing = !0;
				for (var n = 0; n < t.buffer.length; n++) {
					var r = t.buffer[n], i = r.chunk, o = r.encoding, a = r.callback, s = t.objectMode ? 1 : i.length;
					if (u(e, t, s, i, o, a), t.writing) {
						n++;
						break
					}
				}
				t.bufferProcessing = !1, n < t.buffer.length ? t.buffer = t.buffer.slice(n) : t.buffer.length = 0
			}

			function g(e, t) {
				return t.ending && 0 === t.length && !t.finished && !t.writing
			}

			function v(e, t) {
				var n = g(e, t);
				return n && (t.finished = !0, e.emit("finish")), n
			}

			function b(e, t, n) {
				t.ending = !0, v(e, t), n && (t.finished ? k(n) : e.once("finish", n)), t.ended = !0
			}

			t.exports = i, i.WritableState = r;
			var y = "undefined" != typeof Uint8Array ? function (e) {
				return e instanceof Uint8Array
			} : function (e) {
				return e && e.constructor && "Uint8Array" === e.constructor.name
			}, w = "undefined" != typeof ArrayBuffer ? function (e) {
				return e instanceof ArrayBuffer
			} : function (e) {
				return e && e.constructor && "ArrayBuffer" === e.constructor.name
			}, _ = e("inherits"), x = e("./index.js"), k = e("process/browser.js").nextTick, S = e("buffer").Buffer;
			_(i, x), i.prototype.pipe = function () {
				this.emit("error", new Error("Cannot pipe. Not readable."))
			}, i.prototype.write = function (e, t, n) {
				var r = this._writableState, i = !1;
				return "function" == typeof t && (n = t, t = null), !S.isBuffer(e) && y(e) && (e = new S(e)), w(e) && "undefined" != typeof Uint8Array && (e = new S(new Uint8Array(e))), S.isBuffer(e) ? t = "buffer" : t || (t = r.defaultEncoding), "function" != typeof n && (n = function () {
				}), r.ended ? o(this, r, n) : a(this, r, e, n) && (i = l(this, r, e, t, n)), i
			}, i.prototype._write = function (e, t, n) {
				n(new Error("not implemented"))
			}, i.prototype.end = function (e, t, n) {
				var r = this._writableState;
				"function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), "undefined" != typeof e && null !== e && this.write(e, t), r.ending || r.finished || b(this, r, n)
			}
		}, {"./index.js": 9, buffer: 5, inherits: 3, "process/browser.js": 10}], 15: [function (e, t, n) {
			function r(e) {
				if (e && !s.isEncoding(e)) throw new Error("Unknown encoding: " + e)
			}

			function i(e) {
				return e.toString(this.encoding)
			}

			function o(e) {
				var t = this.charReceived = e.length % 2;
				return this.charLength = t ? 2 : 0, t
			}

			function a(e) {
				var t = this.charReceived = e.length % 3;
				return this.charLength = t ? 3 : 0, t
			}

			var s = e("buffer").Buffer, l = n.StringDecoder = function (e) {
				switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), r(e), this.encoding) {
					case"utf8":
						this.surrogateSize = 3;
						break;
					case"ucs2":
					case"utf16le":
						this.surrogateSize = 2, this.detectIncompleteChar = o;
						break;
					case"base64":
						this.surrogateSize = 3, this.detectIncompleteChar = a;
						break;
					default:
						return this.write = i, void 0
				}
				this.charBuffer = new s(6), this.charReceived = 0, this.charLength = 0
			};
			l.prototype.write = function (e) {
				for (var t = "", n = 0; this.charLength;) {
					var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
					if (e.copy(this.charBuffer, this.charReceived, n, r), this.charReceived += r - n, n = r, this.charReceived < this.charLength) return "";
					t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
					var i = t.charCodeAt(t.length - 1);
					if (!(i >= 55296 && 56319 >= i)) {
						if (this.charReceived = this.charLength = 0, r == e.length) return t;
						e = e.slice(r, e.length);
						break
					}
					this.charLength += this.surrogateSize, t = ""
				}
				var o = this.detectIncompleteChar(e), a = e.length;
				this.charLength && (e.copy(this.charBuffer, 0, e.length - o, a), this.charReceived = o, a -= o), t += e.toString(this.encoding, 0, a);
				var a = t.length - 1, i = t.charCodeAt(a);
				if (i >= 55296 && 56319 >= i) {
					var s = this.surrogateSize;
					return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), this.charBuffer.write(t.charAt(t.length - 1), this.encoding), t.substring(0, a)
				}
				return t
			}, l.prototype.detectIncompleteChar = function (e) {
				for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
					var n = e[e.length - t];
					if (1 == t && 6 == n >> 5) {
						this.charLength = 2;
						break
					}
					if (2 >= t && 14 == n >> 4) {
						this.charLength = 3;
						break
					}
					if (3 >= t && 30 == n >> 3) {
						this.charLength = 4;
						break
					}
				}
				return t
			}, l.prototype.end = function (e) {
				var t = "";
				if (e && e.length && (t = this.write(e)), this.charReceived) {
					var n = this.charReceived, r = this.charBuffer, i = this.encoding;
					t += r.slice(0, n).toString(i)
				}
				return t
			}
		}, {buffer: 5}], 16: [function (e, t) {
			t.exports = function (e) {
				return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
			}
		}, {}], 17: [function (e, t, n) {
			!function (t, r) {
				function i(e, t) {
					var r = {seen: [], stylize: a};
					return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), m(t) ? r.showHidden = t : t && n._extend(r, t), _(r.showHidden) && (r.showHidden = !1), _(r.depth) && (r.depth = 2), _(r.colors) && (r.colors = !1), _(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = o), l(r, e, r.depth)
				}

				function o(e, t) {
					var n = i.styles[t];
					return n ? "[" + i.colors[n][0] + "m" + e + "[" + i.colors[n][1] + "m" : e
				}

				function a(e) {
					return e
				}

				function s(e) {
					var t = {};
					return e.forEach(function (e) {
						t[e] = !0
					}), t
				}

				function l(e, t, r) {
					if (e.customInspect && t && A(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) {
						var i = t.inspect(r, e);
						return y(i) || (i = l(e, i, r)), i
					}
					var o = u(e, t);
					if (o) return o;
					var a = Object.keys(t), m = s(a);
					if (e.showHidden && (a = Object.getOwnPropertyNames(t)), C(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0)) return c(t);
					if (0 === a.length) {
						if (A(t)) {
							var g = t.name ? ": " + t.name : "";
							return e.stylize("[Function" + g + "]", "special")
						}
						if (x(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
						if (S(t)) return e.stylize(Date.prototype.toString.call(t), "date");
						if (C(t)) return c(t)
					}
					var v = "", b = !1, w = ["{", "}"];
					if (p(t) && (b = !0, w = ["[", "]"]), A(t)) {
						var _ = t.name ? ": " + t.name : "";
						v = " [Function" + _ + "]"
					}
					if (x(t) && (v = " " + RegExp.prototype.toString.call(t)), S(t) && (v = " " + Date.prototype.toUTCString.call(t)), C(t) && (v = " " + c(t)), 0 === a.length && (!b || 0 == t.length)) return w[0] + v + w[1];
					if (0 > r) return x(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
					e.seen.push(t);
					var k;
					return k = b ? f(e, t, r, m, a) : a.map(function (n) {
						return d(e, t, r, m, n, b)
					}), e.seen.pop(), h(k, v, w)
				}

				function u(e, t) {
					if (_(t)) return e.stylize("undefined", "undefined");
					if (y(t)) {
						var n = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
						return e.stylize(n, "string")
					}
					return b(t) ? e.stylize("" + t, "number") : m(t) ? e.stylize("" + t, "boolean") : g(t) ? e.stylize("null", "null") : void 0
				}

				function c(e) {
					return "[" + Error.prototype.toString.call(e) + "]"
				}

				function f(e, t, n, r, i) {
					for (var o = [], a = 0, s = t.length; s > a; ++a) M(t, String(a)) ? o.push(d(e, t, n, r, String(a), !0)) : o.push("");
					return i.forEach(function (i) {
						i.match(/^\d+$/) || o.push(d(e, t, n, r, i, !0))
					}), o
				}

				function d(e, t, n, r, i, o) {
					var a, s, u;
					if (u = Object.getOwnPropertyDescriptor(t, i) || {value: t[i]}, u.get ? s = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (s = e.stylize("[Setter]", "special")), M(r, i) || (a = "[" + i + "]"), s || (e.seen.indexOf(u.value) < 0 ? (s = g(n) ? l(e, u.value, null) : l(e, u.value, n - 1), s.indexOf("\n") > -1 && (s = o ? s.split("\n").map(function (e) {
							return "  " + e
						}).join("\n").substr(2) : "\n" + s.split("\n").map(function (e) {
							return "   " + e
						}).join("\n"))) : s = e.stylize("[Circular]", "special")), _(a)) {
						if (o && i.match(/^\d+$/)) return s;
						a = JSON.stringify("" + i), a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"))
					}
					return a + ": " + s
				}

				function h(e, t, n) {
					var r = 0, i = e.reduce(function (e, t) {
						return r++, t.indexOf("\n") >= 0 && r++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
					}, 0);
					return i > 60 ? n[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + n[1] : n[0] + t + " " + e.join(", ") + " " + n[1]
				}

				function p(e) {
					return Array.isArray(e)
				}

				function m(e) {
					return "boolean" == typeof e
				}

				function g(e) {
					return null === e
				}

				function v(e) {
					return null == e
				}

				function b(e) {
					return "number" == typeof e
				}

				function y(e) {
					return "string" == typeof e
				}

				function w(e) {
					return "symbol" == typeof e
				}

				function _(e) {
					return void 0 === e
				}

				function x(e) {
					return k(e) && "[object RegExp]" === L(e)
				}

				function k(e) {
					return "object" == typeof e && null !== e
				}

				function S(e) {
					return k(e) && "[object Date]" === L(e)
				}

				function C(e) {
					return k(e) && ("[object Error]" === L(e) || e instanceof Error)
				}

				function A(e) {
					return "function" == typeof e
				}

				function E(e) {
					return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
				}

				function L(e) {
					return Object.prototype.toString.call(e)
				}

				function T(e) {
					return 10 > e ? "0" + e.toString(10) : e.toString(10)
				}

				function D() {
					var e = new Date, t = [T(e.getHours()), T(e.getMinutes()), T(e.getSeconds())].join(":");
					return [e.getDate(), F[e.getMonth()], t].join(" ")
				}

				function M(e, t) {
					return Object.prototype.hasOwnProperty.call(e, t)
				}

				var N = /%[sdj%]/g;
				n.format = function (e) {
					if (!y(e)) {
						for (var t = [], n = 0; n < arguments.length; n++) t.push(i(arguments[n]));
						return t.join(" ")
					}
					for (var n = 1, r = arguments, o = r.length, a = String(e).replace(N, function (e) {
						if ("%%" === e) return "%";
						if (n >= o) return e;
						switch (e) {
							case"%s":
								return String(r[n++]);
							case"%d":
								return Number(r[n++]);
							case"%j":
								try {
									return JSON.stringify(r[n++])
								} catch (t) {
									return "[Circular]"
								}
							default:
								return e
						}
					}), s = r[n]; o > n; s = r[++n]) a += g(s) || !k(s) ? " " + s : " " + i(s);
					return a
				}, n.deprecate = function (e, i) {
					function o() {
						if (!a) {
							if (t.throwDeprecation) throw new Error(i);
							t.traceDeprecation ? console.trace(i) : console.error(i), a = !0
						}
						return e.apply(this, arguments)
					}

					if (_(r.process)) return function () {
						return n.deprecate(e, i).apply(this, arguments)
					};
					if (t.noDeprecation === !0) return e;
					var a = !1;
					return o
				};
				var B, O = {};
				n.debuglog = function (e) {
					if (_(B) && (B = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !O[e]) if (new RegExp("\\b" + e + "\\b", "i").test(B)) {
						var r = t.pid;
						O[e] = function () {
							var t = n.format.apply(n, arguments);
							console.error("%s %d: %s", e, r, t)
						}
					} else O[e] = function () {
					};
					return O[e]
				}, n.inspect = i, i.colors = {
					bold: [1, 22],
					italic: [3, 23],
					underline: [4, 24],
					inverse: [7, 27],
					white: [37, 39],
					grey: [90, 39],
					black: [30, 39],
					blue: [34, 39],
					cyan: [36, 39],
					green: [32, 39],
					magenta: [35, 39],
					red: [31, 39],
					yellow: [33, 39]
				}, i.styles = {
					special: "cyan",
					number: "yellow",
					"boolean": "yellow",
					undefined: "grey",
					"null": "bold",
					string: "green",
					date: "magenta",
					regexp: "red"
				}, n.isArray = p, n.isBoolean = m, n.isNull = g, n.isNullOrUndefined = v, n.isNumber = b, n.isString = y, n.isSymbol = w, n.isUndefined = _, n.isRegExp = x, n.isObject = k, n.isDate = S, n.isError = C, n.isFunction = A, n.isPrimitive = E, n.isBuffer = e("./support/isBuffer");
				var F = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				n.log = function () {
					console.log("%s - %s", D(), n.format.apply(n, arguments))
				}, n.inherits = e("inherits"), n._extend = function (e, t) {
					if (!t || !k(t)) return e;
					for (var n = Object.keys(t), r = n.length; r--;) e[n[r]] = t[n[r]];
					return e
				}
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"./support/isBuffer": 16,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			inherits: 3
		}], 18: [function (e, t) {
			t.exports = function () {
				"use strict";

				function e(n, r) {
					if (!(this instanceof e)) return new e(n, r);
					this.options = r = r || {};
					for (var i in _o) !r.hasOwnProperty(i) && _o.hasOwnProperty(i) && (r[i] = _o[i]);
					h(r);
					var o = "string" == typeof r.value ? 0 : r.value.first, a = this.display = t(n, o);
					a.wrapper.CodeMirror = this, c(this), r.autofocus && !eo && mt(this), this.state = {
						keyMaps: [],
						overlays: [],
						modeGen: 0,
						overwrite: !1,
						focused: !1,
						suppressEdits: !1,
						pasteIncoming: !1,
						cutIncoming: !1,
						draggingText: !1,
						highlight: new ii
					}, l(this), r.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap");
					var s = r.value;
					"string" == typeof s && (s = new Ho(r.value, r.mode)), st(this, kr)(this, s), Ii && setTimeout(hi(pt, this, !0), 20), bt(this);
					var u;
					try {
						u = document.activeElement == a.input
					} catch (f) {
					}
					u || r.autofocus && !eo ? setTimeout(hi(jt, this), 20) : It(this), st(this, function () {
						for (var e in wo) wo.propertyIsEnumerable(e) && wo[e](this, r[e], xo);
						for (var t = 0; t < Ao.length; ++t) Ao[t](this)
					})()
				}

				function t(e, t) {
					var n = {},
						r = n.input = vi("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
					return Ui ? r.style.width = "1000px" : r.setAttribute("wrap", "off"), Qi && (r.style.border = "1px solid black"), r.setAttribute("autocorrect", "off"), r.setAttribute("autocapitalize", "off"), r.setAttribute("spellcheck", "false"), n.inputDiv = vi("div", [r], null, "overflow: hidden; position: relative; width: 3px; height: 0px;"), n.scrollbarH = vi("div", [vi("div", null, null, "height: 1px")], "CodeMirror-hscrollbar"), n.scrollbarV = vi("div", [vi("div", null, null, "width: 1px")], "CodeMirror-vscrollbar"), n.scrollbarFiller = vi("div", null, "CodeMirror-scrollbar-filler"), n.gutterFiller = vi("div", null, "CodeMirror-gutter-filler"), n.lineDiv = vi("div", null, "CodeMirror-code"), n.selectionDiv = vi("div", null, null, "position: relative; z-index: 1"), n.cursor = vi("div", " ", "CodeMirror-cursor"), n.otherCursor = vi("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"), n.measure = vi("div", null, "CodeMirror-measure"), n.lineSpace = vi("div", [n.measure, n.selectionDiv, n.lineDiv, n.cursor, n.otherCursor], null, "position: relative; outline: none"), n.mover = vi("div", [vi("div", [n.lineSpace], "CodeMirror-lines")], null, "position: relative"), n.sizer = vi("div", [n.mover], "CodeMirror-sizer"), n.heightForcer = vi("div", null, null, "position: absolute; height: " + Wo + "px; width: 1px;"), n.gutters = vi("div", null, "CodeMirror-gutters"), n.lineGutter = null, n.scroller = vi("div", [n.sizer, n.heightForcer, n.gutters], "CodeMirror-scroll"), n.scroller.setAttribute("tabIndex", "-1"), n.wrapper = vi("div", [n.inputDiv, n.scrollbarH, n.scrollbarV, n.scrollbarFiller, n.gutterFiller, n.scroller], "CodeMirror"), zi && (n.gutters.style.zIndex = -1, n.scroller.style.paddingRight = 0), e.appendChild ? e.appendChild(n.wrapper) : e(n.wrapper), Qi && (r.style.width = "0px"), Ui || (n.scroller.draggable = !0), Yi ? (n.inputDiv.style.height = "1px", n.inputDiv.style.position = "absolute") : zi && (n.scrollbarH.style.minWidth = n.scrollbarV.style.minWidth = "18px"), n.viewOffset = n.lastSizeC = 0, n.showingFrom = n.showingTo = t, n.lineNumWidth = n.lineNumInnerWidth = n.lineNumChars = null, n.prevInput = "", n.alignWidgets = !1, n.pollingFast = !1, n.poll = new ii, n.cachedCharWidth = n.cachedTextHeight = n.cachedPaddingH = null, n.measureLineCache = [], n.measureLineCachePos = 0, n.inaccurateSelection = !1, n.maxLine = null, n.maxLineLength = 0, n.maxLineChanged = !1, n.wheelDX = n.wheelDY = n.wheelStartX = n.wheelStartY = null, n
				}

				function n(t) {
					t.doc.mode = e.getMode(t.options, t.doc.modeOption), r(t)
				}

				function r(e) {
					e.doc.iter(function (e) {
						e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
					}), e.doc.frontier = e.doc.first, B(e, 100), e.state.modeGen++, e.curOp && ct(e)
				}

				function i(e) {
					e.options.lineWrapping ? (e.display.wrapper.className += " CodeMirror-wrap", e.display.sizer.style.minWidth = "") : (e.display.wrapper.className = e.display.wrapper.className.replace(" CodeMirror-wrap", ""), d(e)), a(e), ct(e), $(e), setTimeout(function () {
						p(e)
					}, 100)
				}

				function o(e) {
					var t = rt(e.display), n = e.options.lineWrapping,
						r = n && Math.max(5, e.display.scroller.clientWidth / it(e.display) - 3);
					return function (i) {
						return Zn(e.doc, i) ? 0 : n ? (Math.ceil(i.text.length / r) || 1) * t : t
					}
				}

				function a(e) {
					var t = e.doc, n = o(e);
					t.iter(function (e) {
						var t = n(e);
						t != e.height && Er(e, t)
					})
				}

				function s(e) {
					var t = To[e.options.keyMap], n = t.style;
					e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") + (n ? " cm-keymap-" + n : "")
				}

				function l(e) {
					e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), $(e)
				}

				function u(e) {
					c(e), ct(e), setTimeout(function () {
						g(e)
					}, 20)
				}

				function c(e) {
					var t = e.display.gutters, n = e.options.gutters;
					bi(t);
					for (var r = 0; r < n.length; ++r) {
						var i = n[r], o = t.appendChild(vi("div", null, "CodeMirror-gutter " + i));
						"CodeMirror-linenumbers" == i && (e.display.lineGutter = o, o.style.width = (e.display.lineNumWidth || 1) + "px")
					}
					t.style.display = r ? "" : "none"
				}

				function f(e, t) {
					if (0 == t.height) return 0;
					for (var n, r = t.text.length, i = t; n = Kn(i);) {
						var o = n.find();
						i = Sr(e, o.from.line), r += o.from.ch - o.to.ch
					}
					for (i = t; n = Yn(i);) {
						var o = n.find();
						r -= i.text.length - o.from.ch, i = Sr(e, o.to.line), r += i.text.length - o.to.ch
					}
					return r
				}

				function d(e) {
					var t = e.display, n = e.doc;
					t.maxLine = Sr(n, n.first), t.maxLineLength = f(n, t.maxLine), t.maxLineChanged = !0, n.iter(function (e) {
						var r = f(n, e);
						r > t.maxLineLength && (t.maxLineLength = r, t.maxLine = e)
					})
				}

				function h(e) {
					var t = ui(e.gutters, "CodeMirror-linenumbers");
					-1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
				}

				function p(e) {
					var t = e.display, n = e.doc.height, r = n + I(t);
					t.sizer.style.minHeight = t.heightForcer.style.top = r + "px", t.gutters.style.height = Math.max(r, t.scroller.clientHeight - Wo) + "px";
					var i = Math.max(r, t.scroller.scrollHeight), o = t.scroller.scrollWidth > t.scroller.clientWidth + 1,
						a = i > t.scroller.clientHeight + 1;
					a ? (t.scrollbarV.style.display = "block", t.scrollbarV.style.bottom = o ? ki(t.measure) + "px" : "0", t.scrollbarV.firstChild.style.height = Math.max(0, i - t.scroller.clientHeight + t.scrollbarV.clientHeight) + "px") : (t.scrollbarV.style.display = "", t.scrollbarV.firstChild.style.height = "0"), o ? (t.scrollbarH.style.display = "block", t.scrollbarH.style.right = a ? ki(t.measure) + "px" : "0", t.scrollbarH.firstChild.style.width = t.scroller.scrollWidth - t.scroller.clientWidth + t.scrollbarH.clientWidth + "px") : (t.scrollbarH.style.display = "", t.scrollbarH.firstChild.style.width = "0"), o && a ? (t.scrollbarFiller.style.display = "block", t.scrollbarFiller.style.height = t.scrollbarFiller.style.width = ki(t.measure) + "px") : t.scrollbarFiller.style.display = "", o && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (t.gutterFiller.style.display = "block", t.gutterFiller.style.height = ki(t.measure) + "px", t.gutterFiller.style.width = t.gutters.offsetWidth + "px") : t.gutterFiller.style.display = "", Xi && 0 === ki(t.measure) && (t.scrollbarV.style.minWidth = t.scrollbarH.style.minHeight = Ji ? "18px" : "12px", t.scrollbarV.style.pointerEvents = t.scrollbarH.style.pointerEvents = "none")
				}

				function m(e, t, n) {
					var r = e.scroller.scrollTop, i = e.wrapper.clientHeight;
					"number" == typeof n ? r = n : n && (r = n.top, i = n.bottom - n.top), r = Math.floor(r - j(e));
					var o = Math.ceil(r + i);
					return {from: Tr(t, r), to: Tr(t, o)}
				}

				function g(e) {
					var t = e.display;
					if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
						for (var n = y(t) - t.scroller.scrollLeft + e.doc.scrollLeft, r = t.gutters.offsetWidth, i = n + "px", o = t.lineDiv.firstChild; o; o = o.nextSibling) if (o.alignable) for (var a = 0, s = o.alignable; a < s.length; ++a) s[a].style.left = i;
						e.options.fixedGutter && (t.gutters.style.left = n + r + "px")
					}
				}

				function v(e) {
					if (!e.options.lineNumbers) return !1;
					var t = e.doc, n = b(e.options, t.first + t.size - 1), r = e.display;
					if (n.length != r.lineNumChars) {
						var i = r.measure.appendChild(vi("div", [vi("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
							o = i.firstChild.offsetWidth, a = i.offsetWidth - o;
						return r.lineGutter.style.width = "", r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - a), r.lineNumWidth = r.lineNumInnerWidth + a, r.lineNumChars = r.lineNumInnerWidth ? n.length : -1, r.lineGutter.style.width = r.lineNumWidth + "px", !0
					}
					return !1
				}

				function b(e, t) {
					return String(e.lineNumberFormatter(t + e.firstLineNumber))
				}

				function y(e) {
					return _i(e.scroller).left - _i(e.sizer).left
				}

				function w(e, t, n, r) {
					for (var i, o = e.display.showingFrom, a = e.display.showingTo, s = m(e.display, e.doc, n), l = !0; ; l = !1) {
						var u = e.display.scroller.clientWidth;
						if (!_(e, t, s, r)) break;
						if (i = !0, t = [], T(e), p(e), l && e.options.lineWrapping && u != e.display.scroller.clientWidth) r = !0; else if (r = !1, n && (n = Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, "number" == typeof n ? n : n.top)), s = m(e.display, e.doc, n), s.from >= e.display.showingFrom && s.to <= e.display.showingTo) break
					}
					return i && (Qr(e, "update", e), (e.display.showingFrom != o || e.display.showingTo != a) && Qr(e, "viewportChange", e, e.display.showingFrom, e.display.showingTo)), i
				}

				function _(e, t, n, r) {
					var i = e.display, o = e.doc;
					if (!i.wrapper.offsetWidth) return i.showingFrom = i.showingTo = o.first, i.viewOffset = 0, void 0;
					if (!(!r && 0 == t.length && n.from > i.showingFrom && n.to < i.showingTo)) {
						v(e) && (t = [{from: o.first, to: o.first + o.size}]);
						var a = i.sizer.style.marginLeft = i.gutters.offsetWidth + "px";
						i.scrollbarH.style.left = e.options.fixedGutter ? a : "0";
						var s = 1 / 0;
						if (e.options.lineNumbers) for (var l = 0; l < t.length; ++l) t[l].diff && t[l].from < s && (s = t[l].from);
						var u = o.first + o.size, c = Math.max(n.from - e.options.viewportMargin, o.first),
							f = Math.min(u, n.to + e.options.viewportMargin);
						if (i.showingFrom < c && c - i.showingFrom < 20 && (c = Math.max(o.first, i.showingFrom)), i.showingTo > f && i.showingTo - f < 20 && (f = Math.min(u, i.showingTo)), co) for (c = Lr(Jn(o, Sr(o, c))); u > f && Zn(o, Sr(o, f));) ++f;
						var d = [{from: Math.max(i.showingFrom, o.first), to: Math.min(i.showingTo, u)}];
						if (d = d[0].from >= d[0].to ? [] : S(d, t), co) for (var l = 0; l < d.length; ++l) for (var h, p = d[l]; h = Yn(Sr(o, p.to - 1));) {
							var m = h.find().from.line;
							if (!(m > p.from)) {
								d.splice(l--, 1);
								break
							}
							p.to = m
						}
						for (var g = 0, l = 0; l < d.length; ++l) {
							var p = d[l];
							p.from < c && (p.from = c), p.to > f && (p.to = f), p.from >= p.to ? d.splice(l--, 1) : g += p.to - p.from
						}
						if (!r && g == f - c && c == i.showingFrom && f == i.showingTo) return k(e), void 0;
						d.sort(function (e, t) {
							return e.from - t.from
						});
						try {
							var b = document.activeElement
						} catch (y) {
						}
						.7 * (f - c) > g && (i.lineDiv.style.display = "none"), A(e, c, f, d, s), i.lineDiv.style.display = "", b && document.activeElement != b && b.offsetHeight && b.focus();
						var w = c != i.showingFrom || f != i.showingTo || i.lastSizeC != i.wrapper.clientHeight;
						return w && (i.lastSizeC = i.wrapper.clientHeight, B(e, 400)), i.showingFrom = c, i.showingTo = f, i.gutters.style.height = "", x(e), k(e), !0
					}
				}

				function x(e) {
					for (var t, n = e.display, r = n.lineDiv.offsetTop, i = n.lineDiv.firstChild; i; i = i.nextSibling) if (i.lineObj) {
						if (zi) {
							var o = i.offsetTop + i.offsetHeight;
							t = o - r, r = o
						} else {
							var a = _i(i);
							t = a.bottom - a.top
						}
						var s = i.lineObj.height - t;
						if (2 > t && (t = rt(n)), s > .001 || -.001 > s) {
							Er(i.lineObj, t);
							var l = i.lineObj.widgets;
							if (l) for (var u = 0; u < l.length; ++u) l[u].height = l[u].node.offsetHeight
						}
					}
				}

				function k(e) {
					var t = e.display.viewOffset = Dr(e, Sr(e.doc, e.display.showingFrom));
					e.display.mover.style.top = t + "px"
				}

				function S(e, t) {
					for (var n = 0, r = t.length || 0; r > n; ++n) {
						for (var i = t[n], o = [], a = i.diff || 0, s = 0, l = e.length; l > s; ++s) {
							var u = e[s];
							i.to <= u.from && i.diff ? o.push({
								from: u.from + a,
								to: u.to + a
							}) : i.to <= u.from || i.from >= u.to ? o.push(u) : (i.from > u.from && o.push({
								from: u.from,
								to: i.from
							}), i.to < u.to && o.push({from: i.to + a, to: u.to + a}))
						}
						e = o
					}
					return e
				}

				function C(e) {
					for (var t = e.display, n = {}, r = {}, i = t.gutters.firstChild, o = 0; i; i = i.nextSibling, ++o) n[e.options.gutters[o]] = i.offsetLeft, r[e.options.gutters[o]] = i.offsetWidth;
					return {
						fixedPos: y(t),
						gutterTotalWidth: t.gutters.offsetWidth,
						gutterLeft: n,
						gutterWidth: r,
						wrapperWidth: t.wrapper.clientWidth
					}
				}

				function A(e, t, n, r, i) {
					function o(t) {
						var n = t.nextSibling;
						return Ui && to && e.display.currentWheelTarget == t ? (t.style.display = "none", t.lineObj = null) : t.parentNode.removeChild(t), n
					}

					var a = C(e), s = e.display, l = e.options.lineNumbers;
					r.length || Ui && e.display.currentWheelTarget || bi(s.lineDiv);
					var u = s.lineDiv, c = u.firstChild, f = r.shift(), d = t;
					for (e.doc.iter(t, n, function (t) {
						if (f && f.to == d && (f = r.shift()), Zn(e.doc, t)) {
							if (0 != t.height && Er(t, 0), t.widgets && c && c.previousSibling) for (var n = 0; n < t.widgets.length; ++n) {
								var s = t.widgets[n];
								if (s.showIfHidden) {
									var h = c.previousSibling;
									if (/pre/i.test(h.nodeName)) {
										var p = vi("div", null, null, "position: relative");
										h.parentNode.replaceChild(p, h), p.appendChild(h), h = p
									}
									var m = h.appendChild(vi("div", [s.node], "CodeMirror-linewidget"));
									s.handleMouseEvents || (m.ignoreEvents = !0), L(s, m, h, a)
								}
							}
						} else if (f && f.from <= d && f.to > d) {
							for (; c.lineObj != t;) c = o(c);
							l && d >= i && c.lineNumber && wi(c.lineNumber, b(e.options, d)), c = c.nextSibling
						} else {
							if (t.widgets) for (var g, v = 0, y = c; y && 20 > v; ++v, y = y.nextSibling) if (y.lineObj == t && /div/i.test(y.nodeName)) {
								g = y;
								break
							}
							var w = E(e, t, d, a, g);
							if (w != g) u.insertBefore(w, c); else {
								for (; c != g;) c = o(c);
								c = c.nextSibling
							}
							w.lineObj = t
						}
						++d
					}); c;) c = o(c)
				}

				function E(e, t, n, r, i) {
					var o, a = dr(e, t), s = a.pre, l = t.gutterMarkers, u = e.display,
						c = a.bgClass ? a.bgClass + " " + (t.bgClass || "") : t.bgClass;
					if (!(e.options.lineNumbers || l || c || t.wrapClass || t.widgets)) return s;
					if (i) {
						i.alignable = null;
						for (var f, d = !0, h = 0, p = null, m = i.firstChild; m; m = f) if (f = m.nextSibling, /\bCodeMirror-linewidget\b/.test(m.className)) {
							for (var g = 0; g < t.widgets.length; ++g) {
								var v = t.widgets[g];
								if (v.node == m.firstChild) {
									v.above || p || (p = m), L(v, m, i, r), ++h;
									break
								}
							}
							if (g == t.widgets.length) {
								d = !1;
								break
							}
						} else i.removeChild(m);
						i.insertBefore(s, p), d && h == t.widgets.length && (o = i, i.className = t.wrapClass || "")
					}
					if (o || (o = vi("div", null, t.wrapClass, "position: relative"), o.appendChild(s)), c && o.insertBefore(vi("div", null, c + " CodeMirror-linebackground"), o.firstChild), e.options.lineNumbers || l) {
						var y = o.insertBefore(vi("div", null, "CodeMirror-gutter-wrapper", "position: absolute; left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px"), s);
						if (e.options.fixedGutter && (o.alignable || (o.alignable = [])).push(y), !e.options.lineNumbers || l && l["CodeMirror-linenumbers"] || (o.lineNumber = y.appendChild(vi("div", b(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + u.lineNumInnerWidth + "px"))), l) for (var w = 0; w < e.options.gutters.length; ++w) {
							var _ = e.options.gutters[w], x = l.hasOwnProperty(_) && l[_];
							x && y.appendChild(vi("div", [x], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[_] + "px; width: " + r.gutterWidth[_] + "px"))
						}
					}
					if (zi && (o.style.zIndex = 2), t.widgets && o != i) for (var g = 0, k = t.widgets; g < k.length; ++g) {
						var v = k[g], S = vi("div", [v.node], "CodeMirror-linewidget");
						v.handleMouseEvents || (S.ignoreEvents = !0), L(v, S, o, r), v.above ? o.insertBefore(S, e.options.lineNumbers && 0 != t.height ? y : s) : o.appendChild(S), Qr(v, "redraw")
					}
					return o
				}

				function L(e, t, n, r) {
					if (e.noHScroll) {
						(n.alignable || (n.alignable = [])).push(t);
						var i = r.wrapperWidth;
						t.style.left = r.fixedPos + "px", e.coverGutter || (i -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = i + "px"
					}
					e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"))
				}

				function T(e) {
					var t = e.display, n = Jt(e.doc.sel.from, e.doc.sel.to);
					if (n || e.options.showCursorWhenSelecting ? D(e) : t.cursor.style.display = t.otherCursor.style.display = "none", n ? t.selectionDiv.style.display = "none" : M(e), e.options.moveInputWithCursor) {
						var r = Q(e, e.doc.sel.head, "div"), i = _i(t.wrapper), o = _i(t.lineDiv);
						t.inputDiv.style.top = Math.max(0, Math.min(t.wrapper.clientHeight - 10, r.top + o.top - i.top)) + "px", t.inputDiv.style.left = Math.max(0, Math.min(t.wrapper.clientWidth - 10, r.left + o.left - i.left)) + "px"
					}
				}

				function D(e) {
					var t = e.display, n = Q(e, e.doc.sel.head, "div");
					t.cursor.style.left = n.left + "px", t.cursor.style.top = n.top + "px", t.cursor.style.height = Math.max(0, n.bottom - n.top) * e.options.cursorHeight + "px", t.cursor.style.display = "", n.other ? (t.otherCursor.style.display = "", t.otherCursor.style.left = n.other.left + "px", t.otherCursor.style.top = n.other.top + "px", t.otherCursor.style.height = .85 * (n.other.bottom - n.other.top) + "px") : t.otherCursor.style.display = "none"
				}

				function M(e) {
					function t(e, t, n, r) {
						0 > t && (t = 0), a.appendChild(vi("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == n ? u - e : n) + "px; height: " + (r - t) + "px"))
					}

					function n(n, r, o) {
						function a(t, r) {
							return Z(e, Xt(n, t), "div", f, r)
						}

						var s, c, f = Sr(i, n), d = f.text.length;
						return Ci(Mr(f), r || 0, null == o ? d : o, function (e, n, i) {
							var f, h, p, m = a(e, "left");
							if (e == n) f = m, h = p = m.left; else {
								if (f = a(n - 1, "right"), "rtl" == i) {
									var g = m;
									m = f, f = g
								}
								h = m.left, p = f.right
							}
							null == r && 0 == e && (h = l), f.top - m.top > 3 && (t(h, m.top, null, m.bottom), h = l, m.bottom < f.top && t(h, m.bottom, null, f.top)), null == o && n == d && (p = u), (!s || m.top < s.top || m.top == s.top && m.left < s.left) && (s = m), (!c || f.bottom > c.bottom || f.bottom == c.bottom && f.right > c.right) && (c = f), l + 1 > h && (h = l), t(h, f.top, p - h, f.bottom)
						}), {start: s, end: c}
					}

					var r = e.display, i = e.doc, o = e.doc.sel, a = document.createDocumentFragment(), s = z(e.display),
						l = s.left, u = r.lineSpace.offsetWidth - s.right;
					if (o.from.line == o.to.line) n(o.from.line, o.from.ch, o.to.ch);
					else {
						var c = Sr(i, o.from.line), f = Sr(i, o.to.line), d = Jn(i, c) == Jn(i, f),
							h = n(o.from.line, o.from.ch, d ? c.text.length : null).end,
							p = n(o.to.line, d ? 0 : null, o.to.ch).start;
						d && (h.top < p.top - 2 ? (t(h.right, h.top, null, h.bottom), t(l, p.top, p.left, p.bottom)) : t(h.right, h.top, p.left - h.right, h.bottom)), h.bottom < p.top && t(l, h.bottom, null, p.top)
					}
					yi(r.selectionDiv, a), r.selectionDiv.style.display = ""
				}

				function N(e) {
					if (e.state.focused) {
						var t = e.display;
						clearInterval(t.blinker);
						var n = !0;
						t.cursor.style.visibility = t.otherCursor.style.visibility = "", e.options.cursorBlinkRate > 0 && (t.blinker = setInterval(function () {
							t.cursor.style.visibility = t.otherCursor.style.visibility = (n = !n) ? "" : "hidden"
						}, e.options.cursorBlinkRate))
					}
				}

				function B(e, t) {
					e.doc.mode.startState && e.doc.frontier < e.display.showingTo && e.state.highlight.set(t, hi(O, e))
				}

				function O(e) {
					var t = e.doc;
					if (t.frontier < t.first && (t.frontier = t.first), !(t.frontier >= e.display.showingTo)) {
						var n, r = +new Date + e.options.workTime, i = Sn(t.mode, H(e, t.frontier)), o = [];
						t.iter(t.frontier, Math.min(t.first + t.size, e.display.showingTo + 500), function (a) {
							if (t.frontier >= e.display.showingFrom) {
								var s = a.styles;
								a.styles = lr(e, a, i, !0);
								for (var l = !s || s.length != a.styles.length, u = 0; !l && u < s.length; ++u) l = s[u] != a.styles[u];
								l && (n && n.end == t.frontier ? n.end++ : o.push(n = {
									start: t.frontier,
									end: t.frontier + 1
								})), a.stateAfter = Sn(t.mode, i)
							} else cr(e, a.text, i), a.stateAfter = 0 == t.frontier % 5 ? Sn(t.mode, i) : null;
							return ++t.frontier, +new Date > r ? (B(e, e.options.workDelay), !0) : void 0
						}), o.length && st(e, function () {
							for (var e = 0; e < o.length; ++e) ct(this, o[e].start, o[e].end)
						})()
					}
				}

				function F(e, t, n) {
					for (var r, i, o = e.doc, a = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), s = t; s > a; --s) {
						if (s <= o.first) return o.first;
						var l = Sr(o, s - 1);
						if (l.stateAfter && (!n || s <= o.frontier)) return s;
						var u = oi(l.text, null, e.options.tabSize);
						(null == i || r > u) && (i = s - 1, r = u)
					}
					return i
				}

				function H(e, t, n) {
					var r = e.doc, i = e.display;
					if (!r.mode.startState) return !0;
					var o = F(e, t, n), a = o > r.first && Sr(r, o - 1).stateAfter;
					return a = a ? Sn(r.mode, a) : Cn(r.mode), r.iter(o, t, function (n) {
						cr(e, n.text, a);
						var s = o == t - 1 || 0 == o % 5 || o >= i.showingFrom && o < i.showingTo;
						n.stateAfter = s ? Sn(r.mode, a) : null, ++o
					}), n && (r.frontier = o), a
				}

				function j(e) {
					return e.lineSpace.offsetTop
				}

				function I(e) {
					return e.mover.offsetHeight - e.lineSpace.offsetHeight
				}

				function z(e) {
					if (e.cachedPaddingH) return e.cachedPaddingH;
					var t = yi(e.measure, vi("pre", "x")),
						n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle;
					return e.cachedPaddingH = {left: parseInt(n.paddingLeft), right: parseInt(n.paddingRight)}
				}

				function R(e, t, n, r, i) {
					var o = -1;
					if (r = r || q(e, t), r.crude) {
						var a = r.left + n * r.width;
						return {left: a, right: a + r.width, top: r.top, bottom: r.bottom}
					}
					for (var s = n; ; s += o) {
						var l = r[s];
						if (l) break;
						0 > o && 0 == s && (o = 1)
					}
					return i = s > n ? "left" : n > s ? "right" : i, "left" == i && l.leftSide ? l = l.leftSide : "right" == i && l.rightSide && (l = l.rightSide), {
						left: n > s ? l.right : l.left,
						right: s > n ? l.left : l.right,
						top: l.top,
						bottom: l.bottom
					}
				}

				function W(e, t) {
					for (var n = e.display.measureLineCache, r = 0; r < n.length; ++r) {
						var i = n[r];
						if (i.text == t.text && i.markedSpans == t.markedSpans && e.display.scroller.clientWidth == i.width && i.classes == t.textClass + "|" + t.wrapClass) return i
					}
				}

				function P(e, t) {
					var n = W(e, t);
					n && (n.text = n.measure = n.markedSpans = null)
				}

				function q(e, t) {
					var n = W(e, t);
					if (n) return n.measure;
					var r = U(e, t), i = e.display.measureLineCache, o = {
						text: t.text,
						width: e.display.scroller.clientWidth,
						markedSpans: t.markedSpans,
						measure: r,
						classes: t.textClass + "|" + t.wrapClass
					};
					return 16 == i.length ? i[++e.display.measureLineCachePos % 16] = o : i.push(o), r
				}

				function U(e, t) {
					function n(e) {
						var t = e.top - p.top, n = e.bottom - p.top;
						n > v && (n = v), 0 > t && (t = 0);
						for (var r = m.length - 2; r >= 0; r -= 2) {
							var i = m[r], o = m[r + 1];
							if (!(i > n || t > o) && (t >= i && o >= n || i >= t && n >= o || Math.min(n, o) - Math.max(t, i) >= n - t >> 1)) {
								m[r] = Math.min(t, i), m[r + 1] = Math.max(n, o);
								break
							}
						}
						return 0 > r && (r = m.length, m.push(t, n)), {
							left: e.left - p.left,
							right: e.right - p.left,
							top: r,
							bottom: null
						}
					}

					function r(e) {
						e.bottom = m[e.top + 1], e.top = m[e.top]
					}

					if (!e.options.lineWrapping && t.text.length >= e.options.crudeMeasuringFrom) return V(e, t);
					var i = e.display, o = di(t.text.length), a = dr(e, t, o, !0).pre;
					if (Ii && !zi && !e.options.lineWrapping && a.childNodes.length > 100) {
						for (var s = document.createDocumentFragment(), l = 10, u = a.childNodes.length, c = 0, f = Math.ceil(u / l); f > c; ++c) {
							for (var d = vi("div", null, null, "display: inline-block"), h = 0; l > h && u; ++h) d.appendChild(a.firstChild), --u;
							s.appendChild(d)
						}
						a.appendChild(s)
					}
					yi(i.measure, a);
					var p = _i(i.lineDiv), m = [], g = di(t.text.length), v = a.offsetHeight;
					Ri && i.measure.first != a && yi(i.measure, a);
					for (var b, c = 0; c < o.length; ++c) if (b = o[c]) {
						var y = b, w = null;
						if (/\bCodeMirror-widget\b/.test(b.className) && b.getClientRects) {
							1 == b.firstChild.nodeType && (y = b.firstChild);
							var _ = y.getClientRects();
							_.length > 1 && (w = g[c] = n(_[0]), w.rightSide = n(_[_.length - 1]))
						}
						w || (w = g[c] = n(_i(y))), b.measureRight && (w.right = _i(b.measureRight).left - p.left), b.leftSide && (w.leftSide = n(_i(b.leftSide)))
					}
					bi(e.display.measure);
					for (var b, c = 0; c < g.length; ++c) (b = g[c]) && (r(b), b.leftSide && r(b.leftSide), b.rightSide && r(b.rightSide));
					return g
				}

				function V(e, t) {
					var n = new No(t.text.slice(0, 100), null);
					t.textClass && (n.textClass = t.textClass);
					var r = U(e, n), i = R(e, n, 0, r, "left"), o = R(e, n, 99, r, "right");
					return {crude: !0, top: i.top, left: i.left, bottom: i.bottom, width: (o.right - i.left) / 100}
				}

				function G(e, t) {
					var n = !1;
					if (t.markedSpans) for (var r = 0; r < t.markedSpans; ++r) {
						var i = t.markedSpans[r];
						!i.collapsed || null != i.to && i.to != t.text.length || (n = !0)
					}
					var o = !n && W(e, t);
					if (o || t.text.length >= e.options.crudeMeasuringFrom) return R(e, t, t.text.length, o && o.measure, "right").right;
					var a = dr(e, t, null, !0).pre, s = a.appendChild(Si(e.display.measure));
					return yi(e.display.measure, a), _i(s).right - _i(e.display.lineDiv).left
				}

				function $(e) {
					e.display.measureLineCache.length = e.display.measureLineCachePos = 0, e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
				}

				function K() {
					return window.pageXOffset || (document.documentElement || document.body).scrollLeft
				}

				function Y() {
					return window.pageYOffset || (document.documentElement || document.body).scrollTop
				}

				function X(e, t, n, r) {
					if (t.widgets) for (var i = 0; i < t.widgets.length; ++i) if (t.widgets[i].above) {
						var o = rr(t.widgets[i]);
						n.top += o, n.bottom += o
					}
					if ("line" == r) return n;
					r || (r = "local");
					var a = Dr(e, t);
					if ("local" == r ? a += j(e.display) : a -= e.display.viewOffset, "page" == r || "window" == r) {
						var s = _i(e.display.lineSpace);
						a += s.top + ("window" == r ? 0 : Y());
						var l = s.left + ("window" == r ? 0 : K());
						n.left += l, n.right += l
					}
					return n.top += a, n.bottom += a, n
				}

				function J(e, t, n) {
					if ("div" == n) return t;
					var r = t.left, i = t.top;
					if ("page" == n) r -= K(), i -= Y(); else if ("local" == n || !n) {
						var o = _i(e.display.sizer);
						r += o.left, i += o.top
					}
					var a = _i(e.display.lineSpace);
					return {left: r - a.left, top: i - a.top}
				}

				function Z(e, t, n, r, i) {
					return r || (r = Sr(e.doc, t.line)), X(e, r, R(e, r, t.ch, null, i), n)
				}

				function Q(e, t, n, r, i) {
					function o(t, o) {
						var a = R(e, r, t, i, o ? "right" : "left");
						return o ? a.left = a.right : a.right = a.left, X(e, r, a, n)
					}

					function a(e, t) {
						var n = s[t], r = n.level % 2;
						return e == Ai(n) && t && n.level < s[t - 1].level ? (n = s[--t], e = Ei(n) - (n.level % 2 ? 0 : 1), r = !0) : e == Ei(n) && t < s.length - 1 && n.level < s[t + 1].level && (n = s[++t], e = Ai(n) - n.level % 2, r = !1), r && e == n.to && e > n.from ? o(e - 1) : o(e, r)
					}

					r = r || Sr(e.doc, t.line), i || (i = q(e, r));
					var s = Mr(r), l = t.ch;
					if (!s) return o(l);
					var u = Bi(s, l), c = a(l, u);
					return null != Qo && (c.other = a(l, Qo)), c
				}

				function et(e, t, n, r) {
					var i = new Xt(e, t);
					return i.xRel = r, n && (i.outside = !0), i
				}

				function tt(e, t, n) {
					var r = e.doc;
					if (n += e.display.viewOffset, 0 > n) return et(r.first, 0, !0, -1);
					var i = Tr(r, n), o = r.first + r.size - 1;
					if (i > o) return et(r.first + r.size - 1, Sr(r, o).text.length, !0, 1);
					for (0 > t && (t = 0); ;) {
						var a = Sr(r, i), s = nt(e, a, i, t, n), l = Yn(a), u = l && l.find();
						if (!l || !(s.ch > u.from.ch || s.ch == u.from.ch && s.xRel > 0)) return s;
						i = u.to.line
					}
				}

				function nt(e, t, n, r, i) {
					function o(r) {
						var i = Q(e, Xt(n, r), "line", t, u);
						return s = !0, a > i.bottom ? i.left - l : a < i.top ? i.left + l : (s = !1, i.left)
					}

					var a = i - Dr(e, t), s = !1, l = 2 * e.display.wrapper.clientWidth, u = q(e, t), c = Mr(t),
						f = t.text.length, d = Li(t), h = Ti(t), p = o(d), m = s, g = o(h), v = s;
					if (r > g) return et(n, h, v, 1);
					for (; ;) {
						if (c ? h == d || h == Fi(t, d, 1) : 1 >= h - d) {
							for (var b = p > r || g - r >= r - p ? d : h, y = r - (b == d ? p : g); gi(t.text.charAt(b));) ++b;
							var w = et(n, b, b == d ? m : v, 0 > y ? -1 : y ? 1 : 0);
							return w
						}
						var _ = Math.ceil(f / 2), x = d + _;
						if (c) {
							x = d;
							for (var k = 0; _ > k; ++k) x = Fi(t, x, 1)
						}
						var S = o(x);
						S > r ? (h = x, g = S, (v = s) && (g += 1e3), f = _) : (d = x, p = S, m = s, f -= _)
					}
				}

				function rt(e) {
					if (null != e.cachedTextHeight) return e.cachedTextHeight;
					if (null == io) {
						io = vi("pre");
						for (var t = 0; 49 > t; ++t) io.appendChild(document.createTextNode("x")), io.appendChild(vi("br"));
						io.appendChild(document.createTextNode("x"))
					}
					yi(e.measure, io);
					var n = io.offsetHeight / 50;
					return n > 3 && (e.cachedTextHeight = n), bi(e.measure), n || 1
				}

				function it(e) {
					if (null != e.cachedCharWidth) return e.cachedCharWidth;
					var t = vi("span", "x"), n = vi("pre", [t]);
					yi(e.measure, n);
					var r = t.offsetWidth;
					return r > 2 && (e.cachedCharWidth = r), r || 10
				}

				function ot(e) {
					e.curOp = {
						changes: [],
						forceUpdate: !1,
						updateInput: null,
						userSelChange: null,
						textChanged: null,
						selectionChanged: !1,
						cursorActivity: !1,
						updateMaxLine: !1,
						updateScrollPos: !1,
						id: ++fo
					}, Ro++ || (zo = [])
				}

				function at(e) {
					var t = e.curOp, n = e.doc, r = e.display;
					if (e.curOp = null, t.updateMaxLine && d(e), r.maxLineChanged && !e.options.lineWrapping && r.maxLine) {
						var i = G(e, r.maxLine);
						r.sizer.style.minWidth = Math.max(0, i + 3) + "px", r.maxLineChanged = !1;
						var o = Math.max(0, r.sizer.offsetLeft + r.sizer.offsetWidth - r.scroller.clientWidth);
						o < n.scrollLeft && !t.updateScrollPos && Lt(e, Math.min(r.scroller.scrollLeft, o), !0)
					}
					var a, s;
					if (t.updateScrollPos) a = t.updateScrollPos; else if (t.selectionChanged && r.scroller.clientHeight) {
						var l = Q(e, n.sel.head);
						a = pn(e, l.left, l.top, l.left, l.bottom)
					}
					if ((t.changes.length || t.forceUpdate || a && null != a.scrollTop) && (s = w(e, t.changes, a && a.scrollTop, t.forceUpdate), e.display.scroller.offsetHeight && (e.doc.scrollTop = e.display.scroller.scrollTop)), !s && t.selectionChanged && T(e), t.updateScrollPos) {
						var u = Math.max(0, Math.min(r.scroller.scrollHeight - r.scroller.clientHeight, a.scrollTop)),
							c = Math.max(0, Math.min(r.scroller.scrollWidth - r.scroller.clientWidth, a.scrollLeft));
						r.scroller.scrollTop = r.scrollbarV.scrollTop = n.scrollTop = u, r.scroller.scrollLeft = r.scrollbarH.scrollLeft = n.scrollLeft = c, g(e), t.scrollToPos && dn(e, nn(e.doc, t.scrollToPos.from), nn(e.doc, t.scrollToPos.to), t.scrollToPos.margin)
					} else a && fn(e);
					t.selectionChanged && N(e), e.state.focused && t.updateInput && pt(e, t.userSelChange);
					var f = t.maybeHiddenMarkers, h = t.maybeUnhiddenMarkers;
					if (f) for (var p = 0; p < f.length; ++p) f[p].lines.length || Zr(f[p], "hide");
					if (h) for (var p = 0; p < h.length; ++p) h[p].lines.length && Zr(h[p], "unhide");
					var m;
					if (--Ro || (m = zo, zo = null), t.textChanged && Zr(e, "change", e, t.textChanged), t.cursorActivity && Zr(e, "cursorActivity", e), m) for (var p = 0; p < m.length; ++p) m[p]()
				}

				function st(e, t) {
					return function () {
						var n = e || this, r = !n.curOp;
						r && ot(n);
						try {
							var i = t.apply(n, arguments)
						} finally {
							r && at(n)
						}
						return i
					}
				}

				function lt(e) {
					return function () {
						var t, n = this.cm && !this.cm.curOp;
						n && ot(this.cm);
						try {
							t = e.apply(this, arguments)
						} finally {
							n && at(this.cm)
						}
						return t
					}
				}

				function ut(e, t) {
					var n, r = !e.curOp;
					r && ot(e);
					try {
						n = t()
					} finally {
						r && at(e)
					}
					return n
				}

				function ct(e, t, n, r) {
					null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), e.curOp.changes.push({
						from: t,
						to: n,
						diff: r
					})
				}

				function ft(e) {
					e.display.pollingFast || e.display.poll.set(e.options.pollInterval, function () {
						ht(e), e.state.focused && ft(e)
					})
				}

				function dt(e) {
					function t() {
						var r = ht(e);
						r || n ? (e.display.pollingFast = !1, ft(e)) : (n = !0, e.display.poll.set(60, t))
					}

					var n = !1;
					e.display.pollingFast = !0, e.display.poll.set(20, t)
				}

				function ht(e) {
					var t = e.display.input, n = e.display.prevInput, r = e.doc, i = r.sel;
					if (!e.state.focused || Xo(t) || vt(e) || e.options.disableInput) return !1;
					e.state.pasteIncoming && e.state.fakedLastChar && (t.value = t.value.substring(0, t.value.length - 1), e.state.fakedLastChar = !1);
					var o = t.value;
					if (o == n && Jt(i.from, i.to)) return !1;
					if (qi && !Ri && e.display.inputHasSelection === o) return pt(e, !0), !1;
					var a = !e.curOp;
					a && ot(e), i.shift = !1;
					for (var s = 0, l = Math.min(n.length, o.length); l > s && n.charCodeAt(s) == o.charCodeAt(s);) ++s;
					var u = i.from, c = i.to, f = o.slice(s);
					s < n.length ? u = Xt(u.line, u.ch - (n.length - s)) : e.state.overwrite && Jt(u, c) && !e.state.pasteIncoming && (c = Xt(c.line, Math.min(Sr(r, c.line).text.length, c.ch + f.length)));
					var d = e.curOp.updateInput, h = {
						from: u,
						to: c,
						text: Yo(f),
						origin: e.state.pasteIncoming ? "paste" : e.state.cutIncoming ? "cut" : "+input"
					};
					if (qt(e.doc, h, "end"), e.curOp.updateInput = d, Qr(e, "inputRead", e, h), f && !e.state.pasteIncoming && e.options.electricChars && e.options.smartIndent && i.head.ch < 100) {
						var p = e.getModeAt(i.head).electricChars;
						if (p) for (var m = 0; m < p.length; m++) if (f.indexOf(p.charAt(m)) > -1) {
							vn(e, i.head.line, "smart");
							break
						}
					}
					return o.length > 1e3 || o.indexOf("\n") > -1 ? t.value = e.display.prevInput = "" : e.display.prevInput = o, a && at(e), e.state.pasteIncoming = e.state.cutIncoming = !1, !0
				}

				function pt(e, t) {
					var n, r, i = e.doc;
					if (Jt(i.sel.from, i.sel.to)) t && (e.display.prevInput = e.display.input.value = "", qi && !Ri && (e.display.inputHasSelection = null)); else {
						e.display.prevInput = "", n = Jo && (i.sel.to.line - i.sel.from.line > 100 || (r = e.getSelection()).length > 1e3);
						var o = n ? "-" : r || e.getSelection();
						e.display.input.value = o, e.state.focused && li(e.display.input), qi && !Ri && (e.display.inputHasSelection = o)
					}
					e.display.inaccurateSelection = n
				}

				function mt(e) {
					"nocursor" == e.options.readOnly || eo && document.activeElement == e.display.input || e.display.input.focus()
				}

				function gt(e) {
					e.state.focused || (mt(e), jt(e))
				}

				function vt(e) {
					return e.options.readOnly || e.doc.cantEdit
				}

				function bt(e) {
					function t() {
						e.state.focused && setTimeout(hi(mt, e), 0)
					}

					function n() {
						null == s && (s = setTimeout(function () {
							s = null, a.cachedCharWidth = a.cachedTextHeight = a.cachedPaddingH = $o = null, $(e), ut(e, hi(ct, e))
						}, 100))
					}

					function r() {
						for (var e = a.wrapper.parentNode; e && e != document.body; e = e.parentNode) ;
						e ? setTimeout(r, 5e3) : Jr(window, "resize", n)
					}

					function i(t) {
						ei(e, t) || e.options.onDragEvent && e.options.onDragEvent(e, qr(t)) || $r(t)
					}

					function o(t) {
						a.inaccurateSelection && (a.prevInput = "", a.inaccurateSelection = !1, a.input.value = e.getSelection(), li(a.input)), "cut" == t.type && (e.state.cutIncoming = !0)
					}

					var a = e.display;
					Xr(a.scroller, "mousedown", st(e, _t)), Ii ? Xr(a.scroller, "dblclick", st(e, function (t) {
						if (!ei(e, t)) {
							var n = wt(e, t);
							if (n && !St(e, t) && !yt(e.display, t)) {
								Ur(t);
								var r = _n(Sr(e.doc, n.line).text, n);
								an(e.doc, r.from, r.to)
							}
						}
					})) : Xr(a.scroller, "dblclick", function (t) {
						ei(e, t) || Ur(t)
					}), Xr(a.lineSpace, "selectstart", function (e) {
						yt(a, e) || Ur(e)
					}), lo || Xr(a.scroller, "contextmenu", function (t) {
						zt(e, t)
					}), Xr(a.scroller, "scroll", function () {
						a.scroller.clientHeight && (Et(e, a.scroller.scrollTop), Lt(e, a.scroller.scrollLeft, !0), Zr(e, "scroll", e))
					}), Xr(a.scrollbarV, "scroll", function () {
						a.scroller.clientHeight && Et(e, a.scrollbarV.scrollTop)
					}), Xr(a.scrollbarH, "scroll", function () {
						a.scroller.clientHeight && Lt(e, a.scrollbarH.scrollLeft)
					}), Xr(a.scroller, "mousewheel", function (t) {
						Tt(e, t)
					}), Xr(a.scroller, "DOMMouseScroll", function (t) {
						Tt(e, t)
					}), Xr(a.scrollbarH, "mousedown", t), Xr(a.scrollbarV, "mousedown", t), Xr(a.wrapper, "scroll", function () {
						a.wrapper.scrollTop = a.wrapper.scrollLeft = 0
					});
					var s;
					Xr(window, "resize", n), setTimeout(r, 5e3), Xr(a.input, "keyup", st(e, Ot)), Xr(a.input, "input", function () {
						qi && !Ri && e.display.inputHasSelection && (e.display.inputHasSelection = null), dt(e)
					}), Xr(a.input, "keydown", st(e, Ft)), Xr(a.input, "keypress", st(e, Ht)), Xr(a.input, "focus", hi(jt, e)), Xr(a.input, "blur", hi(It, e)), e.options.dragDrop && (Xr(a.scroller, "dragstart", function (t) {
						At(e, t)
					}), Xr(a.scroller, "dragenter", i), Xr(a.scroller, "dragover", i), Xr(a.scroller, "drop", st(e, Ct))), Xr(a.scroller, "paste", function (t) {
						yt(a, t) || (mt(e), dt(e))
					}), Xr(a.input, "paste", function () {
						if (Ui && !e.state.fakedLastChar && !(new Date - e.state.lastMiddleDown < 200)) {
							var t = a.input.selectionStart, n = a.input.selectionEnd;
							a.input.value += "$", a.input.selectionStart = t, a.input.selectionEnd = n, e.state.fakedLastChar = !0
						}
						e.state.pasteIncoming = !0, dt(e)
					}), Xr(a.input, "cut", o), Xr(a.input, "copy", o), Yi && Xr(a.sizer, "mouseup", function () {
						document.activeElement == a.input && a.input.blur(), mt(e)
					})
				}

				function yt(e, t) {
					for (var n = Kr(t); n != e.wrapper; n = n.parentNode) if (!n || n.ignoreEvents || n.parentNode == e.sizer && n != e.mover) return !0
				}

				function wt(e, t, n) {
					var r = e.display;
					if (!n) {
						var i = Kr(t);
						if (i == r.scrollbarH || i == r.scrollbarH.firstChild || i == r.scrollbarV || i == r.scrollbarV.firstChild || i == r.scrollbarFiller || i == r.gutterFiller) return null
					}
					var o, a, s = _i(r.lineSpace);
					try {
						o = t.clientX, a = t.clientY
					} catch (t) {
						return null
					}
					return tt(e, o - s.left, a - s.top)
				}

				function _t(e) {
					function t(e) {
						if (!Jt(v, e)) {
							if (v = e, "single" == c) return an(i.doc, nn(a, l), e), void 0;
							if (p = nn(a, p), g = nn(a, g), "double" == c) {
								var t = _n(Sr(a, e.line).text, e);
								Zt(e, p) ? an(i.doc, t.from, g) : an(i.doc, p, t.to)
							} else "triple" == c && (Zt(e, p) ? an(i.doc, g, nn(a, Xt(e.line, 0))) : an(i.doc, p, nn(a, Xt(e.line + 1, 0))))
						}
					}

					function n(e) {
						var r = ++y, s = wt(i, e, !0);
						if (s) if (Jt(s, d)) {
							var l = e.clientY < b.top ? -20 : e.clientY > b.bottom ? 20 : 0;
							l && setTimeout(st(i, function () {
								y == r && (o.scroller.scrollTop += l, n(e))
							}), 50)
						} else {
							gt(i), d = s, t(s);
							var u = m(o, a);
							(s.line >= u.to || s.line < u.from) && setTimeout(st(i, function () {
								y == r && n(e)
							}), 150)
						}
					}

					function r(e) {
						y = 1 / 0, Ur(e), mt(i), Jr(document, "mousemove", w), Jr(document, "mouseup", _)
					}

					if (!ei(this, e)) {
						var i = this, o = i.display, a = i.doc, s = a.sel;
						if (s.shift = e.shiftKey, yt(o, e)) return Ui || (o.scroller.draggable = !1, setTimeout(function () {
							o.scroller.draggable = !0
						}, 100)), void 0;
						if (!St(i, e)) {
							var l = wt(i, e);
							switch (window.focus(), Yr(e)) {
								case 3:
									return lo && zt.call(i, i, e), void 0;
								case 2:
									return Ui && (i.state.lastMiddleDown = +new Date), l && an(i.doc, l), setTimeout(hi(mt, i), 20), Ur(e), void 0
							}
							if (!l) return Kr(e) == o.scroller && Ur(e), void 0;
							setTimeout(hi(gt, i), 0);
							var u = +new Date, c = "single";
							if (ao && ao.time > u - 400 && Jt(ao.pos, l)) c = "triple", Ur(e), setTimeout(hi(mt, i), 20), xn(i, l.line); else if (oo && oo.time > u - 400 && Jt(oo.pos, l)) {
								c = "double", ao = {time: u, pos: l}, Ur(e);
								var f = _n(Sr(a, l.line).text, l);
								an(i.doc, f.from, f.to)
							} else oo = {time: u, pos: l};
							var d = l;
							if (i.options.dragDrop && Go && !vt(i) && !Jt(s.from, s.to) && !Zt(l, s.from) && !Zt(s.to, l) && "single" == c) {
								var h = st(i, function (t) {
									Ui && (o.scroller.draggable = !1), i.state.draggingText = !1, Jr(document, "mouseup", h), Jr(o.scroller, "drop", h), Math.abs(e.clientX - t.clientX) + Math.abs(e.clientY - t.clientY) < 10 && (Ur(t), an(i.doc, l), mt(i), Ii && !Ri && setTimeout(function () {
										document.body.focus(), mt(i)
									}, 20))
								});
								return Ui && (o.scroller.draggable = !0), i.state.draggingText = h, o.scroller.dragDrop && o.scroller.dragDrop(), Xr(document, "mouseup", h), Xr(o.scroller, "drop", h), void 0
							}
							Ur(e), "single" == c && an(i.doc, nn(a, l));
							var p = s.from, g = s.to, v = l, b = _i(o.wrapper), y = 0, w = st(i, function (e) {
								(qi && !Wi ? e.buttons : Yr(e)) ? n(e) : r(e)
							}), _ = st(i, r);
							Xr(document, "mousemove", w), Xr(document, "mouseup", _)
						}
					}
				}

				function xt(e, t, n, r, i) {
					try {
						var o = t.clientX, a = t.clientY
					} catch (t) {
						return !1
					}
					if (o >= Math.floor(_i(e.display.gutters).right)) return !1;
					r && Ur(t);
					var s = e.display, l = _i(s.lineDiv);
					if (a > l.bottom || !ni(e, n)) return Gr(t);
					a -= l.top - s.viewOffset;
					for (var u = 0; u < e.options.gutters.length; ++u) {
						var c = s.gutters.childNodes[u];
						if (c && _i(c).right >= o) {
							var f = Tr(e.doc, a), d = e.options.gutters[u];
							return i(e, n, e, f, d, t), Gr(t)
						}
					}
				}

				function kt(e, t) {
					return ni(e, "gutterContextMenu") ? xt(e, t, "gutterContextMenu", !1, Zr) : !1
				}

				function St(e, t) {
					return xt(e, t, "gutterClick", !0, Qr)
				}

				function Ct(e) {
					var t = this;
					if (!(ei(t, e) || yt(t.display, e) || t.options.onDragEvent && t.options.onDragEvent(t, qr(e)))) {
						Ur(e), qi && (ho = +new Date);
						var n = wt(t, e, !0), r = e.dataTransfer.files;
						if (n && !vt(t)) if (r && r.length && window.FileReader && window.File) for (var i = r.length, o = Array(i), a = 0, s = function (e, r) {
							var s = new FileReader;
							s.onload = function () {
								o[r] = s.result, ++a == i && (n = nn(t.doc, n), qt(t.doc, {
									from: n,
									to: n,
									text: Yo(o.join("\n")),
									origin: "paste"
								}, "around"))
							}, s.readAsText(e)
						}, l = 0; i > l; ++l) s(r[l], l); else {
							if (t.state.draggingText && !Zt(n, t.doc.sel.from) && !Zt(t.doc.sel.to, n)) return t.state.draggingText(e), setTimeout(hi(mt, t), 20), void 0;
							try {
								var o = e.dataTransfer.getData("Text");
								if (o) {
									var u = t.doc.sel.from, c = t.doc.sel.to;
									ln(t.doc, n, n), t.state.draggingText && Yt(t.doc, "", u, c, "paste"), t.replaceSelection(o, null, "paste"), mt(t)
								}
							} catch (e) {
							}
						}
					}
				}

				function At(e, t) {
					if (qi && (!e.state.draggingText || +new Date - ho < 100)) return $r(t), void 0;
					if (!ei(e, t) && !yt(e.display, t)) {
						var n = e.getSelection();
						if (t.dataTransfer.setData("Text", n), t.dataTransfer.setDragImage && !Ki) {
							var r = vi("img", null, null, "position: fixed; left: 0; top: 0;");
							r.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", $i && (r.width = r.height = 1, e.display.wrapper.appendChild(r), r._top = r.offsetTop), t.dataTransfer.setDragImage(r, 0, 0), $i && r.parentNode.removeChild(r)
						}
					}
				}

				function Et(e, t) {
					Math.abs(e.doc.scrollTop - t) < 2 || (e.doc.scrollTop = t, ji || w(e, [], t), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t), e.display.scrollbarV.scrollTop != t && (e.display.scrollbarV.scrollTop = t), ji && w(e, []), B(e, 100))
				}

				function Lt(e, t, n) {
					(n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), e.doc.scrollLeft = t, g(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbarH.scrollLeft != t && (e.display.scrollbarH.scrollLeft = t))
				}

				function Tt(e, t) {
					var n = t.wheelDeltaX, r = t.wheelDeltaY;
					null == n && t.detail && t.axis == t.HORIZONTAL_AXIS && (n = t.detail), null == r && t.detail && t.axis == t.VERTICAL_AXIS ? r = t.detail : null == r && (r = t.wheelDelta);
					var i = e.display, o = i.scroller;
					if (n && o.scrollWidth > o.clientWidth || r && o.scrollHeight > o.clientHeight) {
						if (r && to && Ui) for (var a = t.target; a != o; a = a.parentNode) if (a.lineObj) {
							e.display.currentWheelTarget = a;
							break
						}
						if (n && !ji && !$i && null != mo) return r && Et(e, Math.max(0, Math.min(o.scrollTop + r * mo, o.scrollHeight - o.clientHeight))), Lt(e, Math.max(0, Math.min(o.scrollLeft + n * mo, o.scrollWidth - o.clientWidth))), Ur(t), i.wheelStartX = null, void 0;
						if (r && null != mo) {
							var s = r * mo, l = e.doc.scrollTop, u = l + i.wrapper.clientHeight;
							0 > s ? l = Math.max(0, l + s - 50) : u = Math.min(e.doc.height, u + s + 50), w(e, [], {
								top: l,
								bottom: u
							})
						}
						20 > po && (null == i.wheelStartX ? (i.wheelStartX = o.scrollLeft, i.wheelStartY = o.scrollTop, i.wheelDX = n, i.wheelDY = r, setTimeout(function () {
							if (null != i.wheelStartX) {
								var e = o.scrollLeft - i.wheelStartX, t = o.scrollTop - i.wheelStartY,
									n = t && i.wheelDY && t / i.wheelDY || e && i.wheelDX && e / i.wheelDX;
								i.wheelStartX = i.wheelStartY = null, n && (mo = (mo * po + n) / (po + 1), ++po)
							}
						}, 200)) : (i.wheelDX += n, i.wheelDY += r))
					}
				}

				function Dt(e, t, n) {
					if ("string" == typeof t && (t = Lo[t], !t)) return !1;
					e.display.pollingFast && ht(e) && (e.display.pollingFast = !1);
					var r = e.doc, i = r.sel.shift, o = !1;
					try {
						vt(e) && (e.state.suppressEdits = !0), n && (r.sel.shift = !1), o = t(e) != Po
					} finally {
						r.sel.shift = i, e.state.suppressEdits = !1
					}
					return o
				}

				function Mt(e) {
					var t = e.state.keyMaps.slice(0);
					return e.options.extraKeys && t.push(e.options.extraKeys), t.push(e.options.keyMap), t
				}

				function Nt(e, t) {
					var n = An(e.options.keyMap), r = n.auto;
					clearTimeout(go), r && !Ln(t) && (go = setTimeout(function () {
						An(e.options.keyMap) == n && (e.options.keyMap = r.call ? r.call(null, e) : r, s(e))
					}, 50));
					var i = Tn(t, !0), o = !1;
					if (!i) return !1;
					var a = Mt(e);
					return o = t.shiftKey ? En("Shift-" + i, a, function (t) {
						return Dt(e, t, !0)
					}) || En(i, a, function (t) {
						return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? Dt(e, t) : void 0
					}) : En(i, a, function (t) {
						return Dt(e, t)
					}), o && (Ur(t), N(e), Ri && (t.oldKeyCode = t.keyCode, t.keyCode = 0), Qr(e, "keyHandled", e, i, t)), o
				}

				function Bt(e, t, n) {
					var r = En("'" + n + "'", Mt(e), function (t) {
						return Dt(e, t, !0)
					});
					return r && (Ur(t), N(e), Qr(e, "keyHandled", e, "'" + n + "'", t)), r
				}

				function Ot(e) {
					var t = this;
					ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)) || 16 == e.keyCode && (t.doc.sel.shift = !1)
				}

				function Ft(e) {
					var t = this;
					if (gt(t), !(ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)))) {
						Ii && 27 == e.keyCode && (e.returnValue = !1);
						var n = e.keyCode;
						t.doc.sel.shift = 16 == n || e.shiftKey;
						var r = Nt(t, e);
						$i && (bo = r ? n : null, !r && 88 == n && !Jo && (to ? e.metaKey : e.ctrlKey) && t.replaceSelection(""))
					}
				}

				function Ht(e) {
					var t = this;
					if (!(ei(t, e) || t.options.onKeyEvent && t.options.onKeyEvent(t, qr(e)))) {
						var n = e.keyCode, r = e.charCode;
						if ($i && n == bo) return bo = null, Ur(e), void 0;
						if (!($i && (!e.which || e.which < 10) || Yi) || !Nt(t, e)) {
							var i = String.fromCharCode(null == r ? n : r);
							Bt(t, e, i) || (qi && !Ri && (t.display.inputHasSelection = null), dt(t))
						}
					}
				}

				function jt(e) {
					"nocursor" != e.options.readOnly && (e.state.focused || (Zr(e, "focus", e), e.state.focused = !0, -1 == e.display.wrapper.className.search(/\bCodeMirror-focused\b/) && (e.display.wrapper.className += " CodeMirror-focused"), e.curOp || (pt(e, !0), Ui && setTimeout(hi(pt, e, !0), 0))), ft(e), N(e))
				}

				function It(e) {
					e.state.focused && (Zr(e, "blur", e), e.state.focused = !1, e.display.wrapper.className = e.display.wrapper.className.replace(" CodeMirror-focused", "")), clearInterval(e.display.blinker), setTimeout(function () {
						e.state.focused || (e.doc.sel.shift = !1)
					}, 150)
				}

				function zt(e, t) {
					function n() {
						if (null != i.input.selectionStart) {
							var e = i.input.value = "​" + (Jt(o.from, o.to) ? "" : i.input.value);
							i.prevInput = "​", i.input.selectionStart = 1, i.input.selectionEnd = e.length
						}
					}

					function r() {
						if (i.inputDiv.style.position = "relative", i.input.style.cssText = u, Ri && (i.scrollbarV.scrollTop = i.scroller.scrollTop = s), ft(e), null != i.input.selectionStart) {
							(!qi || Ri) && n(), clearTimeout(vo);
							var t = 0, r = function () {
								"​" == i.prevInput && 0 == i.input.selectionStart ? st(e, Lo.selectAll)(e) : t++ < 10 ? vo = setTimeout(r, 500) : pt(e)
							};
							vo = setTimeout(r, 200)
						}
					}

					if (!ei(e, t, "contextmenu")) {
						var i = e.display, o = e.doc.sel;
						if (!yt(i, t) && !kt(e, t)) {
							var a = wt(e, t), s = i.scroller.scrollTop;
							if (a && !$i) {
								var l = e.options.resetSelectionOnContextMenu;
								l && (Jt(o.from, o.to) || Zt(a, o.from) || !Zt(a, o.to)) && st(e, ln)(e.doc, a, a);
								var u = i.input.style.cssText;
								if (i.inputDiv.style.position = "absolute", i.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (t.clientY - 5) + "px; left: " + (t.clientX - 5) + "px; z-index: 1000; background: transparent; outline: none;" + "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);", mt(e), pt(e, !0), Jt(o.from, o.to) && (i.input.value = i.prevInput = " "), qi && !Ri && n(), lo) {
									$r(t);
									var c = function () {
										Jr(window, "mouseup", c), setTimeout(r, 20)
									};
									Xr(window, "mouseup", c)
								} else setTimeout(r, 50)
							}
						}
					}
				}

				function Rt(e, t, n) {
					if (!Zt(t.from, n)) return nn(e, n);
					var r = t.text.length - 1 - (t.to.line - t.from.line);
					if (n.line > t.to.line + r) {
						var i = n.line - r, o = e.first + e.size - 1;
						return i > o ? Xt(o, Sr(e, o).text.length) : rn(n, Sr(e, i).text.length)
					}
					if (n.line == t.to.line + r) return rn(n, si(t.text).length + (1 == t.text.length ? t.from.ch : 0) + Sr(e, t.to.line).text.length - t.to.ch);
					var a = n.line - t.from.line;
					return rn(n, t.text[a].length + (a ? 0 : t.from.ch))
				}

				function Wt(e, t, n) {
					if (n && "object" == typeof n) return {anchor: Rt(e, t, n.anchor), head: Rt(e, t, n.head)};
					if ("start" == n) return {anchor: t.from, head: t.from};
					var r = yo(t);
					if ("around" == n) return {anchor: t.from, head: r};
					if ("end" == n) return {anchor: r, head: r};
					var i = function (e) {
						if (Zt(e, t.from)) return e;
						if (!Zt(t.to, e)) return r;
						var n = e.line + t.text.length - (t.to.line - t.from.line) - 1, i = e.ch;
						return e.line == t.to.line && (i += r.ch - t.to.ch), Xt(n, i)
					};
					return {anchor: i(e.sel.anchor), head: i(e.sel.head)}
				}

				function Pt(e, t, n) {
					var r = {
						canceled: !1, from: t.from, to: t.to, text: t.text, origin: t.origin, cancel: function () {
							this.canceled = !0
						}
					};
					return n && (r.update = function (t, n, r, i) {
						t && (this.from = nn(e, t)), n && (this.to = nn(e, n)), r && (this.text = r), void 0 !== i && (this.origin = i)
					}), Zr(e, "beforeChange", e, r), e.cm && Zr(e.cm, "beforeChange", e.cm, r), r.canceled ? null : {
						from: r.from,
						to: r.to,
						text: r.text,
						origin: r.origin
					}
				}

				function qt(e, t, n, r) {
					if (e.cm) {
						if (!e.cm.curOp) return st(e.cm, qt)(e, t, n, r);
						if (e.cm.state.suppressEdits) return
					}
					if (!(ni(e, "beforeChange") || e.cm && ni(e.cm, "beforeChange")) || (t = Pt(e, t, !0))) {
						var i = uo && !r && qn(e, t.from, t.to);
						if (i) {
							for (var o = i.length - 1; o >= 1; --o) Ut(e, {from: i[o].from, to: i[o].to, text: [""]});
							i.length && Ut(e, {from: i[0].from, to: i[0].to, text: t.text}, n)
						} else Ut(e, t, n)
					}
				}

				function Ut(e, t, n) {
					if (1 != t.text.length || "" != t.text[0] || !Jt(t.from, t.to)) {
						var r = Wt(e, t, n);
						Fr(e, t, r, e.cm ? e.cm.curOp.id : 0 / 0), $t(e, t, r, Rn(e, t));
						var i = [];
						xr(e, function (e, n) {
							n || -1 != ui(i, e.history) || (Wr(e.history, t), i.push(e.history)), $t(e, t, null, Rn(e, t))
						})
					}
				}

				function Vt(e, t) {
					if (!e.cm || !e.cm.state.suppressEdits) {
						var n = e.history, r = ("undo" == t ? n.done : n.undone).pop();
						if (r) {
							var i = {
								changes: [],
								anchorBefore: r.anchorAfter,
								headBefore: r.headAfter,
								anchorAfter: r.anchorBefore,
								headAfter: r.headBefore,
								generation: n.generation
							};
							("undo" == t ? n.undone : n.done).push(i), n.generation = r.generation || ++n.maxGeneration;
							for (var o = ni(e, "beforeChange") || e.cm && ni(e.cm, "beforeChange"), a = r.changes.length - 1; a >= 0; --a) {
								var s = r.changes[a];
								if (s.origin = t, o && !Pt(e, s, !1)) return ("undo" == t ? n.done : n.undone).length = 0, void 0;
								i.changes.push(Or(e, s));
								var l = a ? Wt(e, s, null) : {anchor: r.anchorBefore, head: r.headBefore};
								$t(e, s, l, Pn(e, s));
								var u = [];
								xr(e, function (e, t) {
									t || -1 != ui(u, e.history) || (Wr(e.history, s), u.push(e.history)), $t(e, s, null, Pn(e, s))
								})
							}
						}
					}
				}

				function Gt(e, t) {
					function n(e) {
						return Xt(e.line + t, e.ch)
					}

					e.first += t, e.cm && ct(e.cm, e.first, e.first, t), e.sel.head = n(e.sel.head), e.sel.anchor = n(e.sel.anchor), e.sel.from = n(e.sel.from), e.sel.to = n(e.sel.to)
				}

				function $t(e, t, n, r) {
					if (e.cm && !e.cm.curOp) return st(e.cm, $t)(e, t, n, r);
					if (t.to.line < e.first) return Gt(e, t.text.length - 1 - (t.to.line - t.from.line)), void 0;
					if (!(t.from.line > e.lastLine())) {
						if (t.from.line < e.first) {
							var i = t.text.length - 1 - (e.first - t.from.line);
							Gt(e, i), t = {
								from: Xt(e.first, 0),
								to: Xt(t.to.line + i, t.to.ch),
								text: [si(t.text)],
								origin: t.origin
							}
						}
						var o = e.lastLine();
						t.to.line > o && (t = {
							from: t.from,
							to: Xt(o, Sr(e, o).text.length),
							text: [t.text[0]],
							origin: t.origin
						}), t.removed = Cr(e, t.from, t.to), n || (n = Wt(e, t, null)), e.cm ? Kt(e.cm, t, r, n) : yr(e, t, r, n)
					}
				}

				function Kt(e, t, n, r) {
					var i = e.doc, a = e.display, s = t.from, l = t.to, u = !1, c = s.line;
					e.options.lineWrapping || (c = Lr(Jn(i, Sr(i, s.line))), i.iter(c, l.line + 1, function (e) {
						return e == a.maxLine ? (u = !0, !0) : void 0
					})), Zt(i.sel.head, t.from) || Zt(t.to, i.sel.head) || (e.curOp.cursorActivity = !0), yr(i, t, n, r, o(e)), e.options.lineWrapping || (i.iter(c, s.line + t.text.length, function (e) {
						var t = f(i, e);
						t > a.maxLineLength && (a.maxLine = e, a.maxLineLength = t, a.maxLineChanged = !0, u = !1)
					}), u && (e.curOp.updateMaxLine = !0)), i.frontier = Math.min(i.frontier, s.line), B(e, 400);
					var d = t.text.length - (l.line - s.line) - 1;
					if (ct(e, s.line, l.line + 1, d), ni(e, "change")) {
						var h = {from: s, to: l, text: t.text, removed: t.removed, origin: t.origin};
						if (e.curOp.textChanged) {
							for (var p = e.curOp.textChanged; p.next; p = p.next) ;
							p.next = h
						} else e.curOp.textChanged = h
					}
				}

				function Yt(e, t, n, r, i) {
					if (r || (r = n), Zt(r, n)) {
						var o = r;
						r = n, n = o
					}
					"string" == typeof t && (t = Yo(t)), qt(e, {from: n, to: r, text: t, origin: i}, null)
				}

				function Xt(e, t) {
					return this instanceof Xt ? (this.line = e, this.ch = t, void 0) : new Xt(e, t)
				}

				function Jt(e, t) {
					return e.line == t.line && e.ch == t.ch
				}

				function Zt(e, t) {
					return e.line < t.line || e.line == t.line && e.ch < t.ch
				}

				function Qt(e, t) {
					return e.line - t.line || e.ch - t.ch
				}

				function en(e) {
					return Xt(e.line, e.ch)
				}

				function tn(e, t) {
					return Math.max(e.first, Math.min(t, e.first + e.size - 1))
				}

				function nn(e, t) {
					if (t.line < e.first) return Xt(e.first, 0);
					var n = e.first + e.size - 1;
					return t.line > n ? Xt(n, Sr(e, n).text.length) : rn(t, Sr(e, t.line).text.length)
				}

				function rn(e, t) {
					var n = e.ch;
					return null == n || n > t ? Xt(e.line, t) : 0 > n ? Xt(e.line, 0) : e
				}

				function on(e, t) {
					return t >= e.first && t < e.first + e.size
				}

				function an(e, t, n, r) {
					if (e.sel.shift || e.sel.extend) {
						var i = e.sel.anchor;
						if (n) {
							var o = Zt(t, i);
							o != Zt(n, i) ? (i = t, t = n) : o != Zt(t, n) && (t = n)
						}
						ln(e, i, t, r)
					} else ln(e, t, n || t, r);
					e.cm && (e.cm.curOp.userSelChange = !0)
				}

				function sn(e, t, n) {
					var r = {anchor: t, head: n};
					return Zr(e, "beforeSelectionChange", e, r), e.cm && Zr(e.cm, "beforeSelectionChange", e.cm, r), r.anchor = nn(e, r.anchor), r.head = nn(e, r.head), r
				}

				function ln(e, t, n, r, i) {
					if (!i && ni(e, "beforeSelectionChange") || e.cm && ni(e.cm, "beforeSelectionChange")) {
						var o = sn(e, t, n);
						n = o.head, t = o.anchor
					}
					var a = e.sel;
					if (a.goalColumn = null, null == r && (r = Zt(n, a.head) ? -1 : 1), (i || !Jt(t, a.anchor)) && (t = cn(e, t, r, "push" != i)), (i || !Jt(n, a.head)) && (n = cn(e, n, r, "push" != i)), !Jt(a.anchor, t) || !Jt(a.head, n)) {
						a.anchor = t, a.head = n;
						var s = Zt(n, t);
						a.from = s ? n : t, a.to = s ? t : n, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = e.cm.curOp.cursorActivity = !0), Qr(e, "cursorActivity", e)
					}
				}

				function un(e) {
					ln(e.doc, e.doc.sel.from, e.doc.sel.to, null, "push")
				}

				function cn(e, t, n, r) {
					var i = !1, o = t, a = n || 1;
					e.cantEdit = !1;
					e:for (; ;) {
						var s = Sr(e, o.line);
						if (s.markedSpans) for (var l = 0; l < s.markedSpans.length; ++l) {
							var u = s.markedSpans[l], c = u.marker;
							if ((null == u.from || (c.inclusiveLeft ? u.from <= o.ch : u.from < o.ch)) && (null == u.to || (c.inclusiveRight ? u.to >= o.ch : u.to > o.ch))) {
								if (r && (Zr(c, "beforeCursorEnter"), c.explicitlyCleared)) {
									if (s.markedSpans) {
										--l;
										continue
									}
									break
								}
								if (!c.atomic) continue;
								var f = c.find()[0 > a ? "from" : "to"];
								if (Jt(f, o) && (f.ch += a, f.ch < 0 ? f = f.line > e.first ? nn(e, Xt(f.line - 1)) : null : f.ch > s.text.length && (f = f.line < e.first + e.size - 1 ? Xt(f.line + 1, 0) : null), !f)) {
									if (i) return r ? (e.cantEdit = !0, Xt(e.first, 0)) : cn(e, t, n, !0);
									i = !0, f = t, a = -a
								}
								o = f;
								continue e
							}
						}
						return o
					}
				}

				function fn(e) {
					var t = dn(e, e.doc.sel.head, null, e.options.cursorScrollMargin);
					if (e.state.focused) {
						var n = e.display, r = _i(n.sizer), i = null;
						if (t.top + r.top < 0 ? i = !0 : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !Zi) {
							var o = vi("div", "​", null, "position: absolute; top: " + (t.top - n.viewOffset) + "px; height: " + (t.bottom - t.top + Wo) + "px; left: " + t.left + "px; width: 2px;");
							e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o)
						}
					}
				}

				function dn(e, t, n, r) {
					for (null == r && (r = 0); ;) {
						var i = !1, o = Q(e, t), a = n && n != t ? Q(e, n) : o,
							s = pn(e, Math.min(o.left, a.left), Math.min(o.top, a.top) - r, Math.max(o.left, a.left), Math.max(o.bottom, a.bottom) + r),
							l = e.doc.scrollTop, u = e.doc.scrollLeft;
						if (null != s.scrollTop && (Et(e, s.scrollTop), Math.abs(e.doc.scrollTop - l) > 1 && (i = !0)), null != s.scrollLeft && (Lt(e, s.scrollLeft), Math.abs(e.doc.scrollLeft - u) > 1 && (i = !0)), !i) return o
					}
				}

				function hn(e, t, n, r, i) {
					var o = pn(e, t, n, r, i);
					null != o.scrollTop && Et(e, o.scrollTop), null != o.scrollLeft && Lt(e, o.scrollLeft)
				}

				function pn(e, t, n, r, i) {
					var o = e.display, a = rt(e.display);
					0 > n && (n = 0);
					var s = o.scroller.clientHeight - Wo, l = o.scroller.scrollTop, u = {}, c = e.doc.height + I(o),
						f = a > n, d = i > c - a;
					if (l > n) u.scrollTop = f ? 0 : n; else if (i > l + s) {
						var h = Math.min(n, (d ? c : i) - s);
						h != l && (u.scrollTop = h)
					}
					var p = o.scroller.clientWidth - Wo, m = o.scroller.scrollLeft;
					t += o.gutters.offsetWidth, r += o.gutters.offsetWidth;
					var g = o.gutters.offsetWidth, v = g + 10 > t;
					return m + g > t || v ? (v && (t = 0), u.scrollLeft = Math.max(0, t - 10 - g)) : r > p + m - 3 && (u.scrollLeft = r + 10 - p), u
				}

				function mn(e, t, n) {
					e.curOp.updateScrollPos = {
						scrollLeft: null == t ? e.doc.scrollLeft : t,
						scrollTop: null == n ? e.doc.scrollTop : n
					}
				}

				function gn(e, t, n) {
					var r = e.curOp.updateScrollPos || (e.curOp.updateScrollPos = {
						scrollLeft: e.doc.scrollLeft,
						scrollTop: e.doc.scrollTop
					}), i = e.display.scroller;
					r.scrollTop = Math.max(0, Math.min(i.scrollHeight - i.clientHeight, r.scrollTop + n)), r.scrollLeft = Math.max(0, Math.min(i.scrollWidth - i.clientWidth, r.scrollLeft + t))
				}

				function vn(e, t, n, r) {
					var i, o = e.doc;
					null == n && (n = "add"), "smart" == n && (e.doc.mode.indent ? i = H(e, t) : n = "prev");
					var a = e.options.tabSize, s = Sr(o, t), l = oi(s.text, null, a);
					s.stateAfter && (s.stateAfter = null);
					var u, c = s.text.match(/^\s*/)[0];
					if (r || /\S/.test(s.text)) {
						if ("smart" == n && (u = e.doc.mode.indent(i, s.text.slice(c.length), s.text), u == Po)) {
							if (!r) return;
							n = "prev"
						}
					} else u = 0, n = "not";
					"prev" == n ? u = t > o.first ? oi(Sr(o, t - 1).text, null, a) : 0 : "add" == n ? u = l + e.options.indentUnit : "subtract" == n ? u = l - e.options.indentUnit : "number" == typeof n && (u = l + n), u = Math.max(0, u);
					var f = "", d = 0;
					if (e.options.indentWithTabs) for (var h = Math.floor(u / a); h; --h) d += a, f += "	";
					u > d && (f += ai(u - d)), f != c ? Yt(e.doc, f, Xt(t, 0), Xt(t, c.length), "+input") : o.sel.head.line == t && o.sel.head.ch < c.length && ln(o, Xt(t, c.length), Xt(t, c.length), 1), s.stateAfter = null
				}

				function bn(e, t, n) {
					var r = t, i = t, o = e.doc;
					return "number" == typeof t ? i = Sr(o, tn(o, t)) : r = Lr(t), null == r ? null : n(i, r) ? (ct(e, r, r + 1), i) : null
				}

				function yn(e, t, n, r, i) {
					function o() {
						var t = s + n;
						return t < e.first || t >= e.first + e.size ? f = !1 : (s = t, c = Sr(e, t))
					}

					function a(e) {
						var t = (i ? Fi : Hi)(c, l, n, !0);
						if (null == t) {
							if (e || !o()) return f = !1;
							l = i ? (0 > n ? Ti : Li)(c) : 0 > n ? c.text.length : 0
						} else l = t;
						return !0
					}

					var s = t.line, l = t.ch, u = n, c = Sr(e, s), f = !0;
					if ("char" == r) a(); else if ("column" == r) a(!0); else if ("word" == r || "group" == r) for (var d = null, h = "group" == r, p = !0; !(0 > n) || a(!p); p = !1) {
						var m = c.text.charAt(l) || "\n",
							g = pi(m) ? "w" : h && "\n" == m ? "n" : !h || /\s/.test(m) ? null : "p";
						if (!h || p || g || (g = "s"), d && d != g) {
							0 > n && (n = 1, a());
							break
						}
						if (g && (d = g), n > 0 && !a(!p)) break
					}
					var v = cn(e, Xt(s, l), u, !0);
					return f || (v.hitSide = !0), v
				}

				function wn(e, t, n, r) {
					var i, o = e.doc, a = t.left;
					if ("page" == r) {
						var s = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
						i = t.top + n * (s - (0 > n ? 1.5 : .5) * rt(e.display))
					} else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
					for (; ;) {
						var l = tt(e, a, i);
						if (!l.outside) break;
						if (0 > n ? 0 >= i : i >= o.height) {
							l.hitSide = !0;
							break
						}
						i += 5 * n
					}
					return l
				}

				function _n(e, t) {
					var n = t.ch, r = t.ch;
					if (e) {
						(t.xRel < 0 || r == e.length) && n ? --n : ++r;
						for (var i = e.charAt(n), o = pi(i) ? pi : /\s/.test(i) ? function (e) {
							return /\s/.test(e)
						} : function (e) {
							return !/\s/.test(e) && !pi(e)
						}; n > 0 && o(e.charAt(n - 1));) --n;
						for (; r < e.length && o(e.charAt(r));) ++r
					}
					return {from: Xt(t.line, n), to: Xt(t.line, r)}
				}

				function xn(e, t) {
					an(e.doc, Xt(t, 0), nn(e.doc, Xt(t + 1, 0)))
				}

				function kn(t, n, r, i) {
					e.defaults[t] = n, r && (wo[t] = i ? function (e, t, n) {
						n != xo && r(e, t, n)
					} : r)
				}

				function Sn(e, t) {
					if (t === !0) return t;
					if (e.copyState) return e.copyState(t);
					var n = {};
					for (var r in t) {
						var i = t[r];
						i instanceof Array && (i = i.concat([])), n[r] = i
					}
					return n
				}

				function Cn(e, t, n) {
					return e.startState ? e.startState(t, n) : !0
				}

				function An(e) {
					return "string" == typeof e ? To[e] : e
				}

				function En(e, t, n) {
					function r(t) {
						t = An(t);
						var i = t[e];
						if (i === !1) return "stop";
						if (null != i && n(i)) return !0;
						if (t.nofallthrough) return "stop";
						var o = t.fallthrough;
						if (null == o) return !1;
						if ("[object Array]" != Object.prototype.toString.call(o)) return r(o);
						for (var a = 0, s = o.length; s > a; ++a) {
							var l = r(o[a]);
							if (l) return l
						}
						return !1
					}

					for (var i = 0; i < t.length; ++i) {
						var o = r(t[i]);
						if (o) return "stop" != o
					}
				}

				function Ln(e) {
					var t = Zo[e.keyCode];
					return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
				}

				function Tn(e, t) {
					if ($i && 34 == e.keyCode && e["char"]) return !1;
					var n = Zo[e.keyCode];
					return null == n || e.altGraphKey ? !1 : (e.altKey && (n = "Alt-" + n), (so ? e.metaKey : e.ctrlKey) && (n = "Ctrl-" + n), (so ? e.ctrlKey : e.metaKey) && (n = "Cmd-" + n), !t && e.shiftKey && (n = "Shift-" + n), n)
				}

				function Dn(e, t) {
					this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0
				}

				function Mn(e, t) {
					this.lines = [], this.type = t, this.doc = e
				}

				function Nn(e, t, n, r, i) {
					if (r && r.shared) return On(e, t, n, r, i);
					if (e.cm && !e.cm.curOp) return st(e.cm, Nn)(e, t, n, r, i);
					var o = new Mn(e, i);
					if (r && fi(r, o), Zt(n, t) || Jt(t, n) && o.clearWhenEmpty !== !1) return o;
					if (o.replacedWith && (o.collapsed = !0, o.replacedWith = vi("span", [o.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || (o.replacedWith.ignoreEvents = !0)), o.collapsed) {
						if (Xn(e, t.line, t, n, o) || t.line != n.line && Xn(e, n.line, t, n, o)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
						co = !0
					}
					o.addToHistory && Fr(e, {from: t, to: n, origin: "markText"}, {
						head: e.sel.head,
						anchor: e.sel.anchor
					}, 0 / 0);
					var a, s = t.line, l = e.cm;
					return e.iter(s, n.line + 1, function (r) {
						l && o.collapsed && !l.options.lineWrapping && Jn(e, r) == l.display.maxLine && (a = !0);
						var i = {from: null, to: null, marker: o};
						s == t.line && (i.from = t.ch), s == n.line && (i.to = n.ch), o.collapsed && s != t.line && Er(r, 0), jn(r, i), ++s
					}), o.collapsed && e.iter(t.line, n.line + 1, function (t) {
						Zn(e, t) && Er(t, 0)
					}), o.clearOnEnter && Xr(o, "beforeCursorEnter", function () {
						o.clear()
					}), o.readOnly && (uo = !0, (e.history.done.length || e.history.undone.length) && e.clearHistory()), o.collapsed && (o.id = ++Do, o.atomic = !0), l && (a && (l.curOp.updateMaxLine = !0), (o.className || o.title || o.startStyle || o.endStyle || o.collapsed) && ct(l, t.line, n.line + 1), o.atomic && un(l)), o
				}

				function Bn(e, t) {
					this.markers = e, this.primary = t;
					for (var n = 0, r = this; n < e.length; ++n) e[n].parent = this, Xr(e[n], "clear", function () {
						r.clear()
					})
				}

				function On(e, t, n, r, i) {
					r = fi(r), r.shared = !1;
					var o = [Nn(e, t, n, r, i)], a = o[0], s = r.replacedWith;
					return xr(e, function (e) {
						s && (r.replacedWith = s.cloneNode(!0)), o.push(Nn(e, nn(e, t), nn(e, n), r, i));
						for (var l = 0; l < e.linked.length; ++l) if (e.linked[l].isParent) return;
						a = si(o)
					}), new Bn(o, a)
				}

				function Fn(e, t) {
					if (e) for (var n = 0; n < e.length; ++n) {
						var r = e[n];
						if (r.marker == t) return r
					}
				}

				function Hn(e, t) {
					for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
					return n
				}

				function jn(e, t) {
					e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
				}

				function In(e, t, n) {
					if (e) for (var r, i = 0; i < e.length; ++i) {
						var o = e[i], a = o.marker, s = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
						if (s || o.from == t && "bookmark" == a.type && (!n || !o.marker.insertLeft)) {
							var l = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
							(r || (r = [])).push({from: o.from, to: l ? null : o.to, marker: a})
						}
					}
					return r
				}

				function zn(e, t, n) {
					if (e) for (var r, i = 0; i < e.length; ++i) {
						var o = e[i], a = o.marker, s = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
						if (s || o.from == t && "bookmark" == a.type && (!n || o.marker.insertLeft)) {
							var l = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
							(r || (r = [])).push({
								from: l ? null : o.from - t,
								to: null == o.to ? null : o.to - t,
								marker: a
							})
						}
					}
					return r
				}

				function Rn(e, t) {
					var n = on(e, t.from.line) && Sr(e, t.from.line).markedSpans,
						r = on(e, t.to.line) && Sr(e, t.to.line).markedSpans;
					if (!n && !r) return null;
					var i = t.from.ch, o = t.to.ch, a = Jt(t.from, t.to), s = In(n, i, a), l = zn(r, o, a),
						u = 1 == t.text.length, c = si(t.text).length + (u ? i : 0);
					if (s) for (var f = 0; f < s.length; ++f) {
						var d = s[f];
						if (null == d.to) {
							var h = Fn(l, d.marker);
							h ? u && (d.to = null == h.to ? null : h.to + c) : d.to = i
						}
					}
					if (l) for (var f = 0; f < l.length; ++f) {
						var d = l[f];
						if (null != d.to && (d.to += c), null == d.from) {
							var h = Fn(s, d.marker);
							h || (d.from = c, u && (s || (s = [])).push(d))
						} else d.from += c, u && (s || (s = [])).push(d)
					}
					s && (s = Wn(s)), l && l != s && (l = Wn(l));
					var p = [s];
					if (!u) {
						var m, g = t.text.length - 2;
						if (g > 0 && s) for (var f = 0; f < s.length; ++f) null == s[f].to && (m || (m = [])).push({
							from: null,
							to: null,
							marker: s[f].marker
						});
						for (var f = 0; g > f; ++f) p.push(m);
						p.push(l)
					}
					return p
				}

				function Wn(e) {
					for (var t = 0; t < e.length; ++t) {
						var n = e[t];
						null != n.from && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
					}
					return e.length ? e : null
				}

				function Pn(e, t) {
					var n = jr(e, t), r = Rn(e, t);
					if (!n) return r;
					if (!r) return n;
					for (var i = 0; i < n.length; ++i) {
						var o = n[i], a = r[i];
						if (o && a) e:for (var s = 0; s < a.length; ++s) {
							for (var l = a[s], u = 0; u < o.length; ++u) if (o[u].marker == l.marker) continue e;
							o.push(l)
						} else a && (n[i] = a)
					}
					return n
				}

				function qn(e, t, n) {
					var r = null;
					if (e.iter(t.line, n.line + 1, function (e) {
							if (e.markedSpans) for (var t = 0; t < e.markedSpans.length; ++t) {
								var n = e.markedSpans[t].marker;
								!n.readOnly || r && -1 != ui(r, n) || (r || (r = [])).push(n)
							}
						}), !r) return null;
					for (var i = [{
						from: t,
						to: n
					}], o = 0; o < r.length; ++o) for (var a = r[o], s = a.find(), l = 0; l < i.length; ++l) {
						var u = i[l];
						if (!Zt(u.to, s.from) && !Zt(s.to, u.from)) {
							var c = [l, 1];
							(Zt(u.from, s.from) || !a.inclusiveLeft && Jt(u.from, s.from)) && c.push({
								from: u.from,
								to: s.from
							}), (Zt(s.to, u.to) || !a.inclusiveRight && Jt(u.to, s.to)) && c.push({
								from: s.to,
								to: u.to
							}), i.splice.apply(i, c), l += c.length - 1
						}
					}
					return i
				}

				function Un(e) {
					return e.inclusiveLeft ? -1 : 0
				}

				function Vn(e) {
					return e.inclusiveRight ? 1 : 0
				}

				function Gn(e, t) {
					var n = e.lines.length - t.lines.length;
					if (0 != n) return n;
					var r = e.find(), i = t.find(), o = Qt(r.from, i.from) || Un(e) - Un(t);
					if (o) return -o;
					var a = Qt(r.to, i.to) || Vn(e) - Vn(t);
					return a ? a : t.id - e.id
				}

				function $n(e, t) {
					var n, r = co && e.markedSpans;
					if (r) for (var i, o = 0; o < r.length; ++o) i = r[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!n || Gn(n, i.marker) < 0) && (n = i.marker);
					return n
				}

				function Kn(e) {
					return $n(e, !0)
				}

				function Yn(e) {
					return $n(e, !1)
				}

				function Xn(e, t, n, r, i) {
					var o = Sr(e, t), a = co && o.markedSpans;
					if (a) for (var s = 0; s < a.length; ++s) {
						var l = a[s];
						if (l.marker.collapsed) {
							var u = l.marker.find(!0), c = Qt(u.from, n) || Un(l.marker) - Un(i),
								f = Qt(u.to, r) || Vn(l.marker) - Vn(i);
							if (!(c >= 0 && 0 >= f || 0 >= c && f >= 0) && (0 >= c && (Qt(u.to, n) || Vn(l.marker) - Un(i)) > 0 || c >= 0 && (Qt(u.from, r) || Un(l.marker) - Vn(i)) < 0)) return !0
						}
					}
				}

				function Jn(e, t) {
					for (var n; n = Kn(t);) t = Sr(e, n.find().from.line);
					return t
				}

				function Zn(e, t) {
					var n = co && t.markedSpans;
					if (n) for (var r, i = 0; i < n.length; ++i) if (r = n[i], r.marker.collapsed) {
						if (null == r.from) return !0;
						if (!r.marker.replacedWith && 0 == r.from && r.marker.inclusiveLeft && Qn(e, t, r)) return !0
					}
				}

				function Qn(e, t, n) {
					if (null == n.to) {
						var r = n.marker.find().to, i = Sr(e, r.line);
						return Qn(e, i, Fn(i.markedSpans, n.marker))
					}
					if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
					for (var o, a = 0; a < t.markedSpans.length; ++a) if (o = t.markedSpans[a], o.marker.collapsed && !o.marker.replacedWith && o.from == n.to && (null == o.to || o.to != n.from) && (o.marker.inclusiveLeft || n.marker.inclusiveRight) && Qn(e, t, o)) return !0
				}

				function er(e) {
					var t = e.markedSpans;
					if (t) {
						for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
						e.markedSpans = null
					}
				}

				function tr(e, t) {
					if (t) {
						for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
						e.markedSpans = t
					}
				}

				function nr(e) {
					return function () {
						var t = !this.cm.curOp;
						t && ot(this.cm);
						try {
							var n = e.apply(this, arguments)
						} finally {
							t && at(this.cm)
						}
						return n
					}
				}

				function rr(e) {
					return null != e.height ? e.height : (e.node.parentNode && 1 == e.node.parentNode.nodeType || yi(e.cm.display.measure, vi("div", [e.node], null, "position: relative")), e.height = e.node.offsetHeight)
				}

				function ir(e, t, n, r) {
					var i = new Mo(e, n, r);
					return i.noHScroll && (e.display.alignWidgets = !0), bn(e, t, function (t) {
						var n = t.widgets || (t.widgets = []);
						if (null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, !Zn(e.doc, t) || i.showIfHidden) {
							var r = Dr(e, t) < e.doc.scrollTop;
							Er(t, t.height + rr(i)), r && gn(e, 0, i.height), e.curOp.forceUpdate = !0
						}
						return !0
					}), i
				}

				function or(e, t, n, r) {
					e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), er(e), tr(e, n);
					var i = r ? r(e) : 1;
					i != e.height && Er(e, i)
				}

				function ar(e) {
					e.parent = null, er(e)
				}

				function sr(t, n, r, i, o, a) {
					var s = r.flattenSpans;
					null == s && (s = t.options.flattenSpans);
					var l, u = 0, c = null, f = new Dn(n, t.options.tabSize);
					for ("" == n && r.blankLine && r.blankLine(i); !f.eol();) {
						if (f.pos > t.options.maxHighlightLength ? (s = !1, a && cr(t, n, i, f.pos), f.pos = n.length, l = null) : l = r.token(f, i), t.options.addModeClass) {
							var d = e.innerMode(r, i).mode.name;
							d && (l = "m-" + (l ? d + " " + l : d))
						}
						s && c == l || (u < f.start && o(f.start, c), u = f.start, c = l), f.start = f.pos
					}
					for (; u < f.pos;) {
						var h = Math.min(f.pos, u + 5e4);
						o(h, c), u = h
					}
				}

				function lr(e, t, n, r) {
					var i = [e.state.modeGen];
					sr(e, t.text, e.doc.mode, n, function (e, t) {
						i.push(e, t)
					}, r);
					for (var o = 0; o < e.state.overlays.length; ++o) {
						var a = e.state.overlays[o], s = 1, l = 0;
						sr(e, t.text, a.mode, !0, function (e, t) {
							for (var n = s; e > l;) {
								var r = i[s];
								r > e && i.splice(s, 1, e, i[s + 1], r), s += 2, l = Math.min(e, r)
							}
							if (t) if (a.opaque) i.splice(n, s - n, e, t), s = n + 2; else for (; s > n; n += 2) {
								var o = i[n + 1];
								i[n + 1] = o ? o + " " + t : t
							}
						})
					}
					return i
				}

				function ur(e, t) {
					return t.styles && t.styles[0] == e.state.modeGen || (t.styles = lr(e, t, t.stateAfter = H(e, Lr(t)))), t.styles
				}

				function cr(e, t, n, r) {
					var i = e.doc.mode, o = new Dn(t, e.options.tabSize);
					for (o.start = o.pos = r || 0, "" == t && i.blankLine && i.blankLine(n); !o.eol() && o.pos <= e.options.maxHighlightLength;) i.token(o, n), o.start = o.pos
				}

				function fr(e, t) {
					if (!e) return null;
					for (; ;) {
						var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
						if (!n) break;
						e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
						var r = n[1] ? "bgClass" : "textClass";
						null == t[r] ? t[r] = n[2] : new RegExp("(?:^|s)" + n[2] + "(?:$|s)").test(t[r]) || (t[r] += " " + n[2])
					}
					if (/^\s*$/.test(e)) return null;
					var i = t.cm.options.addModeClass ? Oo : Bo;
					return i[e] || (i[e] = e.replace(/\S+/g, "cm-$&"))
				}

				function dr(e, t, n, r) {
					for (var i, o = t, a = !0; i = Kn(o);) o = Sr(e.doc, i.find().from.line);
					var s = {pre: vi("pre"), col: 0, pos: 0, measure: null, measuredSomething: !1, cm: e, copyWidgets: r};
					do {
						o.text && (a = !1), s.measure = o == t && n, s.pos = 0, s.addToken = s.measure ? mr : pr, (qi || Ui) && e.getOption("lineWrapping") && (s.addToken = gr(s.addToken));
						var l = br(o, s, ur(e, o));
						n && o == t && !s.measuredSomething && (n[0] = s.pre.appendChild(Si(e.display.measure)), s.measuredSomething = !0), l && (o = Sr(e.doc, l.to.line))
					} while (l);
					!n || s.measuredSomething || n[0] || (n[0] = s.pre.appendChild(a ? vi("span", " ") : Si(e.display.measure))), s.pre.firstChild || Zn(e.doc, t) || s.pre.appendChild(document.createTextNode(" "));
					var u;
					if (n && qi && (u = Mr(o))) {
						var c = u.length - 1;
						u[c].from == u[c].to && --c;
						var f = u[c], d = u[c - 1];
						if (f.from + 1 == f.to && d && f.level < d.level) {
							var h = n[s.pos - 1];
							h && h.parentNode.insertBefore(h.measureRight = Si(e.display.measure), h.nextSibling)
						}
					}
					var p = s.textClass ? s.textClass + " " + (t.textClass || "") : t.textClass;
					return p && (s.pre.className = p), Zr(e, "renderLine", e, t, s.pre), s
				}

				function hr(e) {
					var t = vi("span", "•", "cm-invalidchar");
					return t.title = "\\u" + e.charCodeAt(0).toString(16), t
				}

				function pr(e, t, n, r, i, o) {
					if (t) {
						var a = e.cm.options.specialChars;
						if (a.test(t)) for (var s = document.createDocumentFragment(), l = 0; ;) {
							a.lastIndex = l;
							var u = a.exec(t), c = u ? u.index - l : t.length - l;
							if (c && (s.appendChild(document.createTextNode(t.slice(l, l + c))), e.col += c), !u) break;
							if (l += c + 1, "	" == u[0]) {
								var f = e.cm.options.tabSize, d = f - e.col % f;
								s.appendChild(vi("span", ai(d), "cm-tab")), e.col += d
							} else {
								var h = e.cm.options.specialCharPlaceholder(u[0]);
								s.appendChild(h), e.col += 1
							}
						} else {
							e.col += t.length;
							var s = document.createTextNode(t)
						}
						if (n || r || i || e.measure) {
							var p = n || "";
							r && (p += r), i && (p += i);
							var h = vi("span", [s], p);
							return o && (h.title = o), e.pre.appendChild(h)
						}
						e.pre.appendChild(s)
					}
				}

				function mr(e, t, n, r, i) {
					for (var o = e.cm.options.lineWrapping, a = 0; a < t.length; ++a) {
						for (var s = 0 == a, l = a + 1; l < t.length && gi(t.charAt(l));) ++l;
						var u = t.slice(a, l);
						a = l - 1, a && o && xi(t, a) && e.pre.appendChild(vi("wbr"));
						var c = e.measure[e.pos], f = e.measure[e.pos] = pr(e, u, n, s && r, a == t.length - 1 && i);
						c && (f.leftSide = c.leftSide || c), Ii && o && " " == u && a && !/\s/.test(t.charAt(a - 1)) && a < t.length - 1 && !/\s/.test(t.charAt(a + 1)) && (f.style.whiteSpace = "normal"), e.pos += u.length
					}
					t.length && (e.measuredSomething = !0)
				}

				function gr(e) {
					function t(e) {
						for (var t = " ", n = 0; n < e.length - 2; ++n) t += n % 2 ? " " : " ";
						return t += " "
					}

					return function (n, r, i, o, a, s) {
						return e(n, r.replace(/ {3,}/g, t), i, o, a, s)
					}
				}

				function vr(e, t, n, r) {
					var i = !r && n.replacedWith;
					if (i && (e.copyWidgets && (i = i.cloneNode(!0)), e.pre.appendChild(i), e.measure)) {
						if (t) e.measure[e.pos] = i; else {
							var o = Si(e.cm.display.measure);
							if ("bookmark" != n.type || n.insertLeft) {
								if (e.measure[e.pos]) return;
								e.measure[e.pos] = e.pre.insertBefore(o, i)
							} else e.measure[e.pos] = e.pre.appendChild(o)
						}
						e.measuredSomething = !0
					}
					e.pos += t
				}

				function br(e, t, n) {
					var r = e.markedSpans, i = e.text, o = 0;
					if (r) for (var a, s, l, u, c, f, d = i.length, h = 0, p = 1, m = "", g = 0; ;) {
						if (g == h) {
							s = l = u = c = "", f = null, g = 1 / 0;
							for (var v = [], b = 0; b < r.length; ++b) {
								var y = r[b], w = y.marker;
								y.from <= h && (null == y.to || y.to > h) ? (null != y.to && g > y.to && (g = y.to, l = ""), w.className && (s += " " + w.className), w.startStyle && y.from == h && (u += " " + w.startStyle), w.endStyle && y.to == g && (l += " " + w.endStyle), w.title && !c && (c = w.title), w.collapsed && (!f || Gn(f.marker, w) < 0) && (f = y)) : y.from > h && g > y.from && (g = y.from), "bookmark" == w.type && y.from == h && w.replacedWith && v.push(w)
							}
							if (f && (f.from || 0) == h && (vr(t, (null == f.to ? d : f.to) - h, f.marker, null == f.from), null == f.to)) return f.marker.find();
							if (!f && v.length) for (var b = 0; b < v.length; ++b) vr(t, 0, v[b])
						}
						if (h >= d) break;
						for (var _ = Math.min(d, g); ;) {
							if (m) {
								var x = h + m.length;
								if (!f) {
									var k = x > _ ? m.slice(0, _ - h) : m;
									t.addToken(t, k, a ? a + s : s, u, h + k.length == g ? l : "", c)
								}
								if (x >= _) {
									m = m.slice(_ - h), h = _;
									break
								}
								h = x, u = ""
							}
							m = i.slice(o, o = n[p++]), a = fr(n[p++], t)
						}
					} else for (var p = 1; p < n.length; p += 2) t.addToken(t, i.slice(o, o = n[p]), fr(n[p + 1], t))
				}

				function yr(e, t, n, r, i) {
					function o(e) {
						return n ? n[e] : null
					}

					function a(e, n, r) {
						or(e, n, r, i), Qr(e, "change", e, t)
					}

					var s = t.from, l = t.to, u = t.text, c = Sr(e, s.line), f = Sr(e, l.line), d = si(u),
						h = o(u.length - 1), p = l.line - s.line;
					if (0 != s.ch || 0 != l.ch || "" != d || e.cm && !e.cm.options.wholeLineUpdateBefore) if (c == f) if (1 == u.length) a(c, c.text.slice(0, s.ch) + d + c.text.slice(l.ch), h); else {
						for (var m = [], g = 1, v = u.length - 1; v > g; ++g) m.push(new No(u[g], o(g), i));
						m.push(new No(d + c.text.slice(l.ch), h, i)), a(c, c.text.slice(0, s.ch) + u[0], o(0)), e.insert(s.line + 1, m)
					} else if (1 == u.length) a(c, c.text.slice(0, s.ch) + u[0] + f.text.slice(l.ch), o(0)), e.remove(s.line + 1, p); else {
						a(c, c.text.slice(0, s.ch) + u[0], o(0)), a(f, d + f.text.slice(l.ch), h);
						for (var g = 1, v = u.length - 1, m = []; v > g; ++g) m.push(new No(u[g], o(g), i));
						p > 1 && e.remove(s.line + 1, p - 1), e.insert(s.line + 1, m)
					} else {
						for (var g = 0, v = u.length - 1, m = []; v > g; ++g) m.push(new No(u[g], o(g), i));
						a(f, f.text, h), p && e.remove(s.line, p), m.length && e.insert(s.line, m)
					}
					Qr(e, "change", e, t), ln(e, r.anchor, r.head, null, !0)
				}

				function wr(e) {
					this.lines = e, this.parent = null;
					for (var t = 0, n = e.length, r = 0; n > t; ++t) e[t].parent = this, r += e[t].height;
					this.height = r
				}

				function _r(e) {
					this.children = e;
					for (var t = 0, n = 0, r = 0, i = e.length; i > r; ++r) {
						var o = e[r];
						t += o.chunkSize(), n += o.height, o.parent = this
					}
					this.size = t, this.height = n, this.parent = null
				}

				function xr(e, t, n) {
					function r(e, i, o) {
						if (e.linked) for (var a = 0; a < e.linked.length; ++a) {
							var s = e.linked[a];
							if (s.doc != i) {
								var l = o && s.sharedHist;
								(!n || l) && (t(s.doc, l), r(s.doc, e, l))
							}
						}
					}

					r(e, null, !0)
				}

				function kr(e, t) {
					if (t.cm) throw new Error("This document is already in use.");
					e.doc = t, t.cm = e, a(e), n(e), e.options.lineWrapping || d(e), e.options.mode = t.modeOption, ct(e)
				}

				function Sr(e, t) {
					for (t -= e.first; !e.lines;) for (var n = 0; ; ++n) {
						var r = e.children[n], i = r.chunkSize();
						if (i > t) {
							e = r;
							break
						}
						t -= i
					}
					return e.lines[t]
				}

				function Cr(e, t, n) {
					var r = [], i = t.line;
					return e.iter(t.line, n.line + 1, function (e) {
						var o = e.text;
						i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i
					}), r
				}

				function Ar(e, t, n) {
					var r = [];
					return e.iter(t, n, function (e) {
						r.push(e.text)
					}), r
				}

				function Er(e, t) {
					for (var n = t - e.height, r = e; r; r = r.parent) r.height += n
				}

				function Lr(e) {
					if (null == e.parent) return null;
					for (var t = e.parent, n = ui(t.lines, e), r = t.parent; r; t = r, r = r.parent) for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
					return n + t.first
				}

				function Tr(e, t) {
					var n = e.first;
					e:do {
						for (var r = 0, i = e.children.length; i > r; ++r) {
							var o = e.children[r], a = o.height;
							if (a > t) {
								e = o;
								continue e
							}
							t -= a, n += o.chunkSize()
						}
						return n
					} while (!e.lines);
					for (var r = 0, i = e.lines.length; i > r; ++r) {
						var s = e.lines[r], l = s.height;
						if (l > t) break;
						t -= l
					}
					return n + r
				}

				function Dr(e, t) {
					t = Jn(e.doc, t);
					for (var n = 0, r = t.parent, i = 0; i < r.lines.length; ++i) {
						var o = r.lines[i];
						if (o == t) break;
						n += o.height
					}
					for (var a = r.parent; a; r = a, a = r.parent) for (var i = 0; i < a.children.length; ++i) {
						var s = a.children[i];
						if (s == r) break;
						n += s.height
					}
					return n
				}

				function Mr(e) {
					var t = e.order;
					return null == t && (t = e.order = ea(e.text)), t
				}

				function Nr(e) {
					return {
						done: [],
						undone: [],
						undoDepth: 1 / 0,
						lastTime: 0,
						lastOp: null,
						lastOrigin: null,
						generation: e || 1,
						maxGeneration: e || 1
					}
				}

				function Br(e, t, n, r) {
					var i = t["spans_" + e.id], o = 0;
					e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function (n) {
						n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o
					})
				}

				function Or(e, t) {
					var n = {line: t.from.line, ch: t.from.ch}, r = {from: n, to: yo(t), text: Cr(e, t.from, t.to)};
					return Br(e, r, t.from.line, t.to.line + 1), xr(e, function (e) {
						Br(e, r, t.from.line, t.to.line + 1)
					}, !0), r
				}

				function Fr(e, t, n, r) {
					var i = e.history;
					i.undone.length = 0;
					var o = +new Date, a = si(i.done);
					if (a && (i.lastOp == r || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastTime > o - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0)))) {
						var s = si(a.changes);
						Jt(t.from, t.to) && Jt(t.from, s.to) ? s.to = yo(t) : a.changes.push(Or(e, t)), a.anchorAfter = n.anchor, a.headAfter = n.head
					} else for (a = {
						changes: [Or(e, t)],
						generation: i.generation,
						anchorBefore: e.sel.anchor,
						headBefore: e.sel.head,
						anchorAfter: n.anchor,
						headAfter: n.head
					}, i.done.push(a); i.done.length > i.undoDepth;) i.done.shift();
					i.generation = ++i.maxGeneration, i.lastTime = o, i.lastOp = r, i.lastOrigin = t.origin, s || Zr(e, "historyAdded")
				}

				function Hr(e) {
					if (!e) return null;
					for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
					return t ? t.length ? t : null : e
				}

				function jr(e, t) {
					var n = t["spans_" + e.id];
					if (!n) return null;
					for (var r = 0, i = []; r < t.text.length; ++r) i.push(Hr(n[r]));
					return i
				}

				function Ir(e, t) {
					for (var n = 0, r = []; n < e.length; ++n) {
						var i = e[n], o = i.changes, a = [];
						r.push({
							changes: a,
							anchorBefore: i.anchorBefore,
							headBefore: i.headBefore,
							anchorAfter: i.anchorAfter,
							headAfter: i.headAfter
						});
						for (var s = 0; s < o.length; ++s) {
							var l, u = o[s];
							if (a.push({
									from: u.from,
									to: u.to,
									text: u.text
								}), t) for (var c in u) (l = c.match(/^spans_(\d+)$/)) && ui(t, Number(l[1])) > -1 && (si(a)[c] = u[c], delete u[c])
						}
					}
					return r
				}

				function zr(e, t, n, r) {
					n < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0)
				}

				function Rr(e, t, n, r) {
					for (var i = 0; i < e.length; ++i) {
						for (var o = e[i], a = !0, s = 0; s < o.changes.length; ++s) {
							var l = o.changes[s];
							if (o.copied || (l.from = en(l.from), l.to = en(l.to)), n < l.from.line) l.from.line += r, l.to.line += r; else if (t <= l.to.line) {
								a = !1;
								break
							}
						}
						o.copied || (o.anchorBefore = en(o.anchorBefore), o.headBefore = en(o.headBefore), o.anchorAfter = en(o.anchorAfter), o.readAfter = en(o.headAfter), o.copied = !0), a ? (zr(o.anchorBefore), zr(o.headBefore), zr(o.anchorAfter), zr(o.headAfter)) : (e.splice(0, i + 1), i = 0)
					}
				}

				function Wr(e, t) {
					var n = t.from.line, r = t.to.line, i = t.text.length - (r - n) - 1;
					Rr(e.done, n, r, i), Rr(e.undone, n, r, i)
				}

				function Pr() {
					$r(this)
				}

				function qr(e) {
					return e.stop || (e.stop = Pr), e
				}

				function Ur(e) {
					e.preventDefault ? e.preventDefault() : e.returnValue = !1
				}

				function Vr(e) {
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
				}

				function Gr(e) {
					return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
				}

				function $r(e) {
					Ur(e), Vr(e)
				}

				function Kr(e) {
					return e.target || e.srcElement
				}

				function Yr(e) {
					var t = e.which;
					return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), to && e.ctrlKey && 1 == t && (t = 3), t
				}

				function Xr(e, t, n) {
					if (e.addEventListener) e.addEventListener(t, n, !1); else if (e.attachEvent) e.attachEvent("on" + t, n); else {
						var r = e._handlers || (e._handlers = {}), i = r[t] || (r[t] = []);
						i.push(n)
					}
				}

				function Jr(e, t, n) {
					if (e.removeEventListener) e.removeEventListener(t, n, !1); else if (e.detachEvent) e.detachEvent("on" + t, n); else {
						var r = e._handlers && e._handlers[t];
						if (!r) return;
						for (var i = 0; i < r.length; ++i) if (r[i] == n) {
							r.splice(i, 1);
							break
						}
					}
				}

				function Zr(e, t) {
					var n = e._handlers && e._handlers[t];
					if (n) for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
				}

				function Qr(e, t) {
					function n(e) {
						return function () {
							e.apply(null, i)
						}
					}

					var r = e._handlers && e._handlers[t];
					if (r) {
						var i = Array.prototype.slice.call(arguments, 2);
						zo || (++Ro, zo = [], setTimeout(ti, 0));
						for (var o = 0; o < r.length; ++o) zo.push(n(r[o]))
					}
				}

				function ei(e, t, n) {
					return Zr(e, n || t.type, e, t), Gr(t) || t.codemirrorIgnore
				}

				function ti() {
					--Ro;
					var e = zo;
					zo = null;
					for (var t = 0; t < e.length; ++t) e[t]()
				}

				function ni(e, t) {
					var n = e._handlers && e._handlers[t];
					return n && n.length > 0
				}

				function ri(e) {
					e.prototype.on = function (e, t) {
						Xr(this, e, t)
					}, e.prototype.off = function (e, t) {
						Jr(this, e, t)
					}
				}

				function ii() {
					this.id = null
				}

				function oi(e, t, n, r, i) {
					null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
					for (var o = r || 0, a = i || 0; t > o; ++o) "	" == e.charAt(o) ? a += n - a % n : ++a;
					return a
				}

				function ai(e) {
					for (; qo.length <= e;) qo.push(si(qo) + " ");
					return qo[e]
				}

				function si(e) {
					return e[e.length - 1]
				}

				function li(e) {
					if (Qi) e.selectionStart = 0, e.selectionEnd = e.value.length; else try {
						e.select()
					} catch (t) {
					}
				}

				function ui(e, t) {
					if (e.indexOf) return e.indexOf(t);
					for (var n = 0, r = e.length; r > n; ++n) if (e[n] == t) return n;
					return -1
				}

				function ci(e, t) {
					function n() {
					}

					n.prototype = e;
					var r = new n;
					return t && fi(t, r), r
				}

				function fi(e, t) {
					t || (t = {});
					for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
					return t
				}

				function di(e) {
					for (var t = [], n = 0; e > n; ++n) t.push(void 0);
					return t
				}

				function hi(e) {
					var t = Array.prototype.slice.call(arguments, 1);
					return function () {
						return e.apply(null, t)
					}
				}

				function pi(e) {
					return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Uo.test(e))
				}

				function mi(e) {
					for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1;
					return !0
				}

				function gi(e) {
					return e.charCodeAt(0) >= 768 && Vo.test(e)
				}

				function vi(e, t, n, r) {
					var i = document.createElement(e);
					if (n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t) wi(i, t); else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
					return i
				}

				function bi(e) {
					for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
					return e
				}

				function yi(e, t) {
					return bi(e).appendChild(t)
				}

				function wi(e, t) {
					Ri ? (e.innerHTML = "", e.appendChild(document.createTextNode(t))) : e.textContent = t
				}

				function _i(e) {
					return e.getBoundingClientRect()
				}

				function xi() {
					return !1
				}

				function ki(e) {
					if (null != $o) return $o;
					var t = vi("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
					return yi(e, t), t.offsetWidth && ($o = t.offsetHeight - t.clientHeight), $o || 0
				}

				function Si(e) {
					if (null == Ko) {
						var t = vi("span", "​");
						yi(e, vi("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (Ko = t.offsetWidth <= 1 && t.offsetHeight > 2 && !zi)
					}
					return Ko ? vi("span", "​") : vi("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px")
				}

				function Ci(e, t, n, r) {
					if (!e) return r(t, n, "ltr");
					for (var i = !1, o = 0; o < e.length; ++o) {
						var a = e[o];
						(a.from < n && a.to > t || t == n && a.to == t) && (r(Math.max(a.from, t), Math.min(a.to, n), 1 == a.level ? "rtl" : "ltr"), i = !0)
					}
					i || r(t, n, "ltr")
				}

				function Ai(e) {
					return e.level % 2 ? e.to : e.from
				}

				function Ei(e) {
					return e.level % 2 ? e.from : e.to
				}

				function Li(e) {
					var t = Mr(e);
					return t ? Ai(t[0]) : 0
				}

				function Ti(e) {
					var t = Mr(e);
					return t ? Ei(si(t)) : e.text.length
				}

				function Di(e, t) {
					var n = Sr(e.doc, t), r = Jn(e.doc, n);
					r != n && (t = Lr(r));
					var i = Mr(r), o = i ? i[0].level % 2 ? Ti(r) : Li(r) : 0;
					return Xt(t, o)
				}

				function Mi(e, t) {
					for (var n, r; n = Yn(r = Sr(e.doc, t));) t = n.find().to.line;
					var i = Mr(r), o = i ? i[0].level % 2 ? Li(r) : Ti(r) : r.text.length;
					return Xt(t, o)
				}

				function Ni(e, t, n) {
					var r = e[0].level;
					return t == r ? !0 : n == r ? !1 : n > t
				}

				function Bi(e, t) {
					Qo = null;
					for (var n, r = 0; r < e.length; ++r) {
						var i = e[r];
						if (i.from < t && i.to > t) return r;
						if (i.from == t || i.to == t) {
							if (null != n) return Ni(e, i.level, e[n].level) ? (i.from != i.to && (Qo = n), r) : (i.from != i.to && (Qo = r), n);
							n = r
						}
					}
					return n
				}

				function Oi(e, t, n, r) {
					if (!r) return t + n;
					do t += n; while (t > 0 && gi(e.text.charAt(t)));
					return t
				}

				function Fi(e, t, n, r) {
					var i = Mr(e);
					if (!i) return Hi(e, t, n, r);
					for (var o = Bi(i, t), a = i[o], s = Oi(e, t, a.level % 2 ? -n : n, r); ;) {
						if (s > a.from && s < a.to) return s;
						if (s == a.from || s == a.to) return Bi(i, s) == o ? s : (a = i[o += n], n > 0 == a.level % 2 ? a.to : a.from);
						if (a = i[o += n], !a) return null;
						s = n > 0 == a.level % 2 ? Oi(e, a.to, -1, r) : Oi(e, a.from, 1, r)
					}
				}

				function Hi(e, t, n, r) {
					var i = t + n;
					if (r) for (; i > 0 && gi(e.text.charAt(i));) i += n;
					return 0 > i || i > e.text.length ? null : i
				}

				var ji = /gecko\/\d/i.test(navigator.userAgent), Ii = /MSIE \d/.test(navigator.userAgent),
					zi = Ii && (null == document.documentMode || document.documentMode < 8),
					Ri = Ii && (null == document.documentMode || document.documentMode < 9),
					Wi = Ii && (null == document.documentMode || document.documentMode < 10),
					Pi = /Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent), qi = Ii || Pi,
					Ui = /WebKit\//.test(navigator.userAgent), Vi = Ui && /Qt\/\d+\.\d+/.test(navigator.userAgent),
					Gi = /Chrome\//.test(navigator.userAgent), $i = /Opera\//.test(navigator.userAgent),
					Ki = /Apple Computer/.test(navigator.vendor), Yi = /KHTML\//.test(navigator.userAgent),
					Xi = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),
					Ji = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),
					Zi = /PhantomJS/.test(navigator.userAgent),
					Qi = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
					eo = Qi || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
					to = Qi || /Mac/.test(navigator.platform), no = /win/i.test(navigator.platform),
					ro = $i && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
				ro && (ro = Number(ro[1])), ro && ro >= 15 && ($i = !1, Ui = !0);
				var io, oo, ao, so = to && (Vi || $i && (null == ro || 12.11 > ro)), lo = ji || qi && !Ri, uo = !1, co = !1,
					fo = 0, ho = 0, po = 0, mo = null;
				qi ? mo = -.53 : ji ? mo = 15 : Gi ? mo = -.7 : Ki && (mo = -1 / 3);
				var go, vo, bo = null, yo = e.changeEnd = function (e) {
					return e.text ? Xt(e.from.line + e.text.length - 1, si(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
				};
				e.Pos = Xt, e.prototype = {
					constructor: e,
					focus: function () {
						window.focus(), mt(this), dt(this)
					},
					setOption: function (e, t) {
						var n = this.options, r = n[e];
						(n[e] != t || "mode" == e) && (n[e] = t, wo.hasOwnProperty(e) && st(this, wo[e])(this, t, r))
					},
					getOption: function (e) {
						return this.options[e]
					},
					getDoc: function () {
						return this.doc
					},
					addKeyMap: function (e, t) {
						this.state.keyMaps[t ? "push" : "unshift"](e)
					},
					removeKeyMap: function (e) {
						for (var t = this.state.keyMaps, n = 0; n < t.length; ++n) if (t[n] == e || "string" != typeof t[n] && t[n].name == e) return t.splice(n, 1), !0
					},
					addOverlay: st(null, function (t, n) {
						var r = t.token ? t : e.getMode(this.options, t);
						if (r.startState) throw new Error("Overlays may not be stateful.");
						this.state.overlays.push({
							mode: r,
							modeSpec: t,
							opaque: n && n.opaque
						}), this.state.modeGen++, ct(this)
					}),
					removeOverlay: st(null, function (e) {
						for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
							var r = t[n].modeSpec;
							if (r == e || "string" == typeof e && r.name == e) return t.splice(n, 1), this.state.modeGen++, ct(this), void 0
						}
					}),
					indentLine: st(null, function (e, t, n) {
						"string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), on(this.doc, e) && vn(this, e, t, n)
					}),
					indentSelection: st(null, function (e) {
						var t = this.doc.sel;
						if (Jt(t.from, t.to)) return vn(this, t.from.line, e, !0);
						for (var n = t.to.line - (t.to.ch ? 0 : 1), r = t.from.line; n >= r; ++r) vn(this, r, e)
					}),
					getTokenAt: function (e, t) {
						var n = this.doc;
						e = nn(n, e);
						for (var r = H(this, e.line, t), i = this.doc.mode, o = Sr(n, e.line), a = new Dn(o.text, this.options.tabSize); a.pos < e.ch && !a.eol();) {
							a.start = a.pos;
							var s = i.token(a, r)
						}
						return {
							start: a.start,
							end: a.pos,
							string: a.current(),
							className: s || null,
							type: s || null,
							state: r
						}
					},
					getTokenTypeAt: function (e) {
						e = nn(this.doc, e);
						var t = ur(this, Sr(this.doc, e.line)), n = 0, r = (t.length - 1) / 2, i = e.ch;
						if (0 == i) return t[2];
						for (; ;) {
							var o = n + r >> 1;
							if ((o ? t[2 * o - 1] : 0) >= i) r = o; else {
								if (!(t[2 * o + 1] < i)) return t[2 * o + 2];
								n = o + 1
							}
						}
					},
					getModeAt: function (t) {
						var n = this.doc.mode;
						return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n
					},
					getHelper: function (e, t) {
						return this.getHelpers(e, t)[0]
					},
					getHelpers: function (e, t) {
						var n = [];
						if (!Eo.hasOwnProperty(t)) return Eo;
						var r = Eo[t], i = this.getModeAt(e);
						if ("string" == typeof i[t]) r[i[t]] && n.push(r[i[t]]); else if (i[t]) for (var o = 0; o < i[t].length; o++) {
							var a = r[i[t][o]];
							a && n.push(a)
						} else i.helperType && r[i.helperType] ? n.push(r[i.helperType]) : r[i.name] && n.push(r[i.name]);
						for (var o = 0; o < r._global.length; o++) {
							var s = r._global[o];
							s.pred(i, this) && -1 == ui(n, s.val) && n.push(s.val)
						}
						return n
					},
					getStateAfter: function (e, t) {
						var n = this.doc;
						return e = tn(n, null == e ? n.first + n.size - 1 : e), H(this, e + 1, t)
					},
					cursorCoords: function (e, t) {
						var n, r = this.doc.sel;
						return n = null == e ? r.head : "object" == typeof e ? nn(this.doc, e) : e ? r.from : r.to, Q(this, n, t || "page")
					},
					charCoords: function (e, t) {
						return Z(this, nn(this.doc, e), t || "page")
					},
					coordsChar: function (e, t) {
						return e = J(this, e, t || "page"), tt(this, e.left, e.top)
					},
					lineAtHeight: function (e, t) {
						return e = J(this, {top: e, left: 0}, t || "page").top, Tr(this.doc, e + this.display.viewOffset)
					},
					heightAtLine: function (e, t) {
						var n = !1, r = this.doc.first + this.doc.size - 1;
						e < this.doc.first ? e = this.doc.first : e > r && (e = r, n = !0);
						var i = Sr(this.doc, e);
						return X(this, Sr(this.doc, e), {top: 0, left: 0}, t || "page").top + (n ? i.height : 0)
					},
					defaultTextHeight: function () {
						return rt(this.display)
					},
					defaultCharWidth: function () {
						return it(this.display)
					},
					setGutterMarker: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = e.gutterMarkers || (e.gutterMarkers = {});
							return r[t] = n, !n && mi(r) && (e.gutterMarkers = null), !0
						})
					}),
					clearGutter: st(null, function (e) {
						var t = this, n = t.doc, r = n.first;
						n.iter(function (n) {
							n.gutterMarkers && n.gutterMarkers[e] && (n.gutterMarkers[e] = null, ct(t, r, r + 1), mi(n.gutterMarkers) && (n.gutterMarkers = null)), ++r
						})
					}),
					addLineClass: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "wrapClass";
							if (e[r]) {
								if (new RegExp("(?:^|\\s)" + n + "(?:$|\\s)").test(e[r])) return !1;
								e[r] += " " + n
							} else e[r] = n;
							return !0
						})
					}),
					removeLineClass: st(null, function (e, t, n) {
						return bn(this, e, function (e) {
							var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "wrapClass", i = e[r];
							if (!i) return !1;
							if (null == n) e[r] = null; else {
								var o = i.match(new RegExp("(?:^|\\s+)" + n + "(?:$|\\s+)"));
								if (!o) return !1;
								var a = o.index + o[0].length;
								e[r] = i.slice(0, o.index) + (o.index && a != i.length ? " " : "") + i.slice(a) || null
							}
							return !0
						})
					}),
					addLineWidget: st(null, function (e, t, n) {
						return ir(this, e, t, n)
					}),
					removeLineWidget: function (e) {
						e.clear()
					},
					lineInfo: function (e) {
						if ("number" == typeof e) {
							if (!on(this.doc, e)) return null;
							var t = e;
							if (e = Sr(this.doc, e), !e) return null
						} else {
							var t = Lr(e);
							if (null == t) return null
						}
						return {
							line: t,
							handle: e,
							text: e.text,
							gutterMarkers: e.gutterMarkers,
							textClass: e.textClass,
							bgClass: e.bgClass,
							wrapClass: e.wrapClass,
							widgets: e.widgets
						}
					},
					getViewport: function () {
						return {from: this.display.showingFrom, to: this.display.showingTo}
					},
					addWidget: function (e, t, n, r, i) {
						var o = this.display;
						e = Q(this, nn(this.doc, e));
						var a = e.bottom, s = e.left;
						if (t.style.position = "absolute", o.sizer.appendChild(t), "over" == r) a = e.top; else if ("above" == r || "near" == r) {
							var l = Math.max(o.wrapper.clientHeight, this.doc.height),
								u = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
							("above" == r || e.bottom + t.offsetHeight > l) && e.top > t.offsetHeight ? a = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= l && (a = e.bottom), s + t.offsetWidth > u && (s = u - t.offsetWidth)
						}
						t.style.top = a + "px", t.style.left = t.style.right = "", "right" == i ? (s = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? s = 0 : "middle" == i && (s = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = s + "px"), n && hn(this, s, a, s + t.offsetWidth, a + t.offsetHeight)
					},
					triggerOnKeyDown: st(null, Ft),
					triggerOnKeyPress: st(null, Ht),
					triggerOnKeyUp: st(null, Ot),
					execCommand: function (e) {
						return Lo.hasOwnProperty(e) ? Lo[e](this) : void 0
					},
					findPosH: function (e, t, n, r) {
						var i = 1;
						0 > t && (i = -1, t = -t);
						for (var o = 0, a = nn(this.doc, e); t > o && (a = yn(this.doc, a, i, n, r), !a.hitSide); ++o) ;
						return a
					},
					moveH: st(null, function (e, t) {
						var n, r = this.doc.sel;
						n = r.shift || r.extend || Jt(r.from, r.to) ? yn(this.doc, r.head, e, t, this.options.rtlMoveVisually) : 0 > e ? r.from : r.to, an(this.doc, n, n, e)
					}),
					deleteH: st(null, function (e, t) {
						var n = this.doc.sel;
						Jt(n.from, n.to) ? Yt(this.doc, "", n.from, yn(this.doc, n.head, e, t, !1), "+delete") : Yt(this.doc, "", n.from, n.to, "+delete"), this.curOp.userSelChange = !0
					}),
					findPosV: function (e, t, n, r) {
						var i = 1, o = r;
						0 > t && (i = -1, t = -t);
						for (var a = 0, s = nn(this.doc, e); t > a; ++a) {
							var l = Q(this, s, "div");
							if (null == o ? o = l.left : l.left = o, s = wn(this, l, i, n), s.hitSide) break
						}
						return s
					},
					moveV: st(null, function (e, t) {
						var n, r, i = this.doc.sel;
						if (i.shift || i.extend || Jt(i.from, i.to)) {
							var o = Q(this, i.head, "div");
							null != i.goalColumn && (o.left = i.goalColumn), n = wn(this, o, e, t), "page" == t && gn(this, 0, Z(this, n, "div").top - o.top), r = o.left
						} else n = 0 > e ? i.from : i.to;
						an(this.doc, n, n, e), null != r && (i.goalColumn = r)
					}),
					toggleOverwrite: function (e) {
						(null == e || e != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? this.display.cursor.className += " CodeMirror-overwrite" : this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", ""), Zr(this, "overwriteToggle", this, this.state.overwrite))
					},
					hasFocus: function () {
						return document.activeElement == this.display.input
					},
					scrollTo: st(null, function (e, t) {
						mn(this, e, t)
					}),
					getScrollInfo: function () {
						var e = this.display.scroller, t = Wo;
						return {
							left: e.scrollLeft,
							top: e.scrollTop,
							height: e.scrollHeight - t,
							width: e.scrollWidth - t,
							clientHeight: e.clientHeight - t,
							clientWidth: e.clientWidth - t
						}
					},
					scrollIntoView: st(null, function (e, t) {
						null == e ? e = {from: this.doc.sel.head, to: null} : "number" == typeof e ? e = {
							from: Xt(e, 0),
							to: null
						} : null == e.from && (e = {from: e, to: null}), e.to || (e.to = e.from), t || (t = 0);
						var n = e;
						null != e.from.line && (this.curOp.scrollToPos = {
							from: e.from,
							to: e.to,
							margin: t
						}, n = {from: Q(this, e.from), to: Q(this, e.to)});
						var r = pn(this, Math.min(n.from.left, n.to.left), Math.min(n.from.top, n.to.top) - t, Math.max(n.from.right, n.to.right), Math.max(n.from.bottom, n.to.bottom) + t);
						mn(this, r.scrollLeft, r.scrollTop)
					}),
					setSize: st(null, function (e, t) {
						function n(e) {
							return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
						}

						null != e && (this.display.wrapper.style.width = n(e)), null != t && (this.display.wrapper.style.height = n(t)), this.options.lineWrapping && (this.display.measureLineCache.length = this.display.measureLineCachePos = 0), this.curOp.forceUpdate = !0, Zr(this, "refresh", this)
					}),
					operation: function (e) {
						return ut(this, e)
					},
					refresh: st(null, function () {
						var e = this.display.cachedTextHeight;
						$(this), mn(this, this.doc.scrollLeft, this.doc.scrollTop), ct(this), (null == e || Math.abs(e - rt(this.display)) > .5) && a(this), Zr(this, "refresh", this)
					}),
					swapDoc: st(null, function (e) {
						var t = this.doc;
						return t.cm = null, kr(this, e), $(this), pt(this, !0), mn(this, e.scrollLeft, e.scrollTop), Qr(this, "swapDoc", this, t), t
					}),
					getInputField: function () {
						return this.display.input
					},
					getWrapperElement: function () {
						return this.display.wrapper
					},
					getScrollerElement: function () {
						return this.display.scroller
					},
					getGutterElement: function () {
						return this.display.gutters
					}
				}, ri(e);
				var wo = e.optionHandlers = {}, _o = e.defaults = {}, xo = e.Init = {
					toString: function () {
						return "CodeMirror.Init"
					}
				};
				kn("value", "", function (e, t) {
					e.setValue(t)
				}, !0), kn("mode", null, function (e, t) {
					e.doc.modeOption = t, n(e)
				}, !0), kn("indentUnit", 2, n, !0), kn("indentWithTabs", !1), kn("smartIndent", !0), kn("tabSize", 4, function (e) {
					r(e), $(e), ct(e)
				}, !0), kn("specialChars", /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g, function (e, t) {
					e.options.specialChars = new RegExp(t.source + (t.test("	") ? "" : "|	"), "g"), e.refresh()
				}, !0), kn("specialCharPlaceholder", hr, function (e) {
					e.refresh()
				}, !0), kn("electricChars", !0), kn("rtlMoveVisually", !no), kn("wholeLineUpdateBefore", !0), kn("theme", "default", function (e) {
					l(e), u(e)
				}, !0), kn("keyMap", "default", s), kn("extraKeys", null), kn("onKeyEvent", null), kn("onDragEvent", null), kn("lineWrapping", !1, i, !0), kn("gutters", [], function (e) {
					h(e.options), u(e)
				}, !0), kn("fixedGutter", !0, function (e, t) {
					e.display.gutters.style.left = t ? y(e.display) + "px" : "0", e.refresh()
				}, !0), kn("coverGutterNextToScrollbar", !1, p, !0), kn("lineNumbers", !1, function (e) {
					h(e.options), u(e)
				}, !0), kn("firstLineNumber", 1, u, !0), kn("lineNumberFormatter", function (e) {
					return e
				}, u, !0), kn("showCursorWhenSelecting", !1, T, !0), kn("resetSelectionOnContextMenu", !0), kn("readOnly", !1, function (e, t) {
					"nocursor" == t ? (It(e), e.display.input.blur(), e.display.disabled = !0) : (e.display.disabled = !1, t || pt(e, !0))
				}), kn("disableInput", !1, function (e, t) {
					t || pt(e, !0)
				}, !0), kn("dragDrop", !0), kn("cursorBlinkRate", 530), kn("cursorScrollMargin", 0), kn("cursorHeight", 1), kn("workTime", 100), kn("workDelay", 100), kn("flattenSpans", !0, r, !0), kn("addModeClass", !1, r, !0), kn("pollInterval", 100), kn("undoDepth", 40, function (e, t) {
					e.doc.history.undoDepth = t
				}), kn("historyEventDelay", 500), kn("viewportMargin", 10, function (e) {
					e.refresh()
				}, !0), kn("maxHighlightLength", 1e4, r, !0), kn("crudeMeasuringFrom", 1e4), kn("moveInputWithCursor", !0, function (e, t) {
					t || (e.display.inputDiv.style.top = e.display.inputDiv.style.left = 0)
				}), kn("tabindex", null, function (e, t) {
					e.display.input.tabIndex = t || ""
				}), kn("autofocus", null);
				var ko = e.modes = {}, So = e.mimeModes = {};
				e.defineMode = function (t, n) {
					if (e.defaults.mode || "null" == t || (e.defaults.mode = t), arguments.length > 2) {
						n.dependencies = [];
						for (var r = 2; r < arguments.length; ++r) n.dependencies.push(arguments[r])
					}
					ko[t] = n
				}, e.defineMIME = function (e, t) {
					So[e] = t
				}, e.resolveMode = function (t) {
					if ("string" == typeof t && So.hasOwnProperty(t)) t = So[t]; else if (t && "string" == typeof t.name && So.hasOwnProperty(t.name)) {
						var n = So[t.name];
						"string" == typeof n && (n = {name: n}), t = ci(n, t), t.name = n.name
					} else if ("string" == typeof t && /^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return e.resolveMode("application/xml");
					return "string" == typeof t ? {name: t} : t || {name: "null"}
				}, e.getMode = function (t, n) {
					var n = e.resolveMode(n), r = ko[n.name];
					if (!r) return e.getMode(t, "text/plain");
					var i = r(t, n);
					if (Co.hasOwnProperty(n.name)) {
						var o = Co[n.name];
						for (var a in o) o.hasOwnProperty(a) && (i.hasOwnProperty(a) && (i["_" + a] = i[a]), i[a] = o[a])
					}
					if (i.name = n.name, n.helperType && (i.helperType = n.helperType), n.modeProps) for (var a in n.modeProps) i[a] = n.modeProps[a];
					return i
				}, e.defineMode("null", function () {
					return {
						token: function (e) {
							e.skipToEnd()
						}
					}
				}), e.defineMIME("text/plain", "null");
				var Co = e.modeExtensions = {};
				e.extendMode = function (e, t) {
					var n = Co.hasOwnProperty(e) ? Co[e] : Co[e] = {};
					fi(t, n)
				}, e.defineExtension = function (t, n) {
					e.prototype[t] = n
				}, e.defineDocExtension = function (e, t) {
					Ho.prototype[e] = t
				}, e.defineOption = kn;
				var Ao = [];
				e.defineInitHook = function (e) {
					Ao.push(e)
				};
				var Eo = e.helpers = {};
				e.registerHelper = function (t, n, r) {
					Eo.hasOwnProperty(t) || (Eo[t] = e[t] = {_global: []}), Eo[t][n] = r
				}, e.registerGlobalHelper = function (t, n, r, i) {
					e.registerHelper(t, n, i), Eo[t]._global.push({pred: r, val: i})
				}, e.isWordChar = pi, e.copyState = Sn, e.startState = Cn, e.innerMode = function (e, t) {
					for (; e.innerMode;) {
						var n = e.innerMode(t);
						if (!n || n.mode == e) break;
						t = n.state, e = n.mode
					}
					return n || {mode: e, state: t}
				};
				var Lo = e.commands = {
					selectAll: function (e) {
						e.setSelection(Xt(e.firstLine(), 0), Xt(e.lastLine()))
					}, killLine: function (e) {
						var t = e.getCursor(!0), n = e.getCursor(!1), r = !Jt(t, n);
						r || e.getLine(t.line).length != t.ch ? e.replaceRange("", t, r ? n : Xt(t.line), "+delete") : e.replaceRange("", t, Xt(t.line + 1, 0), "+delete")
					}, deleteLine: function (e) {
						var t = e.getCursor().line;
						e.replaceRange("", Xt(t, 0), Xt(t + 1, 0), "+delete")
					}, delLineLeft: function (e) {
						var t = e.getCursor();
						e.replaceRange("", Xt(t.line, 0), t, "+delete")
					}, undo: function (e) {
						e.undo()
					}, redo: function (e) {
						e.redo()
					}, goDocStart: function (e) {
						e.extendSelection(Xt(e.firstLine(), 0))
					}, goDocEnd: function (e) {
						e.extendSelection(Xt(e.lastLine()))
					}, goLineStart: function (e) {
						e.extendSelection(Di(e, e.getCursor().line))
					}, goLineStartSmart: function (e) {
						var t = e.getCursor(), n = Di(e, t.line), r = e.getLineHandle(n.line), i = Mr(r);
						if (i && 0 != i[0].level) e.extendSelection(n); else {
							var o = Math.max(0, r.text.search(/\S/)), a = t.line == n.line && t.ch <= o && t.ch;
							e.extendSelection(Xt(n.line, a ? 0 : o))
						}
					}, goLineEnd: function (e) {
						e.extendSelection(Mi(e, e.getCursor().line))
					}, goLineRight: function (e) {
						var t = e.charCoords(e.getCursor(), "div").top + 5;
						e.extendSelection(e.coordsChar({left: e.display.lineDiv.offsetWidth + 100, top: t}, "div"))
					}, goLineLeft: function (e) {
						var t = e.charCoords(e.getCursor(), "div").top + 5;
						e.extendSelection(e.coordsChar({left: 0, top: t}, "div"))
					}, goLineUp: function (e) {
						e.moveV(-1, "line")
					}, goLineDown: function (e) {
						e.moveV(1, "line")
					}, goPageUp: function (e) {
						e.moveV(-1, "page")
					}, goPageDown: function (e) {
						e.moveV(1, "page")
					}, goCharLeft: function (e) {
						e.moveH(-1, "char")
					}, goCharRight: function (e) {
						e.moveH(1, "char")
					}, goColumnLeft: function (e) {
						e.moveH(-1, "column")
					}, goColumnRight: function (e) {
						e.moveH(1, "column")
					}, goWordLeft: function (e) {
						e.moveH(-1, "word")
					}, goGroupRight: function (e) {
						e.moveH(1, "group")
					}, goGroupLeft: function (e) {
						e.moveH(-1, "group")
					}, goWordRight: function (e) {
						e.moveH(1, "word")
					}, delCharBefore: function (e) {
						e.deleteH(-1, "char")
					}, delCharAfter: function (e) {
						e.deleteH(1, "char")
					}, delWordBefore: function (e) {
						e.deleteH(-1, "word")
					}, delWordAfter: function (e) {
						e.deleteH(1, "word")
					}, delGroupBefore: function (e) {
						e.deleteH(-1, "group")
					}, delGroupAfter: function (e) {
						e.deleteH(1, "group")
					}, indentAuto: function (e) {
						e.indentSelection("smart")
					}, indentMore: function (e) {
						e.indentSelection("add")
					}, indentLess: function (e) {
						e.indentSelection("subtract")
					}, insertTab: function (e) {
						e.replaceSelection("	", "end", "+input")
					}, defaultTab: function (e) {
						e.somethingSelected() ? e.indentSelection("add") : e.replaceSelection("	", "end", "+input")
					}, transposeChars: function (e) {
						var t = e.getCursor(), n = e.getLine(t.line);
						t.ch > 0 && t.ch < n.length - 1 && e.replaceRange(n.charAt(t.ch) + n.charAt(t.ch - 1), Xt(t.line, t.ch - 1), Xt(t.line, t.ch + 1))
					}, newlineAndIndent: function (e) {
						st(e, function () {
							e.replaceSelection("\n", "end", "+input"), e.indentLine(e.getCursor().line, null, !0)
						})()
					}, toggleOverwrite: function (e) {
						e.toggleOverwrite()
					}
				}, To = e.keyMap = {};
				To.basic = {
					Left: "goCharLeft",
					Right: "goCharRight",
					Up: "goLineUp",
					Down: "goLineDown",
					End: "goLineEnd",
					Home: "goLineStartSmart",
					PageUp: "goPageUp",
					PageDown: "goPageDown",
					Delete: "delCharAfter",
					Backspace: "delCharBefore",
					"Shift-Backspace": "delCharBefore",
					Tab: "defaultTab",
					"Shift-Tab": "indentAuto",
					Enter: "newlineAndIndent",
					Insert: "toggleOverwrite"
				}, To.pcDefault = {
					"Ctrl-A": "selectAll",
					"Ctrl-D": "deleteLine",
					"Ctrl-Z": "undo",
					"Shift-Ctrl-Z": "redo",
					"Ctrl-Y": "redo",
					"Ctrl-Home": "goDocStart",
					"Ctrl-Up": "goDocStart",
					"Ctrl-End": "goDocEnd",
					"Ctrl-Down": "goDocEnd",
					"Ctrl-Left": "goGroupLeft",
					"Ctrl-Right": "goGroupRight",
					"Alt-Left": "goLineStart",
					"Alt-Right": "goLineEnd",
					"Ctrl-Backspace": "delGroupBefore",
					"Ctrl-Delete": "delGroupAfter",
					"Ctrl-S": "save",
					"Ctrl-F": "find",
					"Ctrl-G": "findNext",
					"Shift-Ctrl-G": "findPrev",
					"Shift-Ctrl-F": "replace",
					"Shift-Ctrl-R": "replaceAll",
					"Ctrl-[": "indentLess",
					"Ctrl-]": "indentMore",
					fallthrough: "basic"
				}, To.macDefault = {
					"Cmd-A": "selectAll",
					"Cmd-D": "deleteLine",
					"Cmd-Z": "undo",
					"Shift-Cmd-Z": "redo",
					"Cmd-Y": "redo",
					"Cmd-Up": "goDocStart",
					"Cmd-End": "goDocEnd",
					"Cmd-Down": "goDocEnd",
					"Alt-Left": "goGroupLeft",
					"Alt-Right": "goGroupRight",
					"Cmd-Left": "goLineStart",
					"Cmd-Right": "goLineEnd",
					"Alt-Backspace": "delGroupBefore",
					"Ctrl-Alt-Backspace": "delGroupAfter",
					"Alt-Delete": "delGroupAfter",
					"Cmd-S": "save",
					"Cmd-F": "find",
					"Cmd-G": "findNext",
					"Shift-Cmd-G": "findPrev",
					"Cmd-Alt-F": "replace",
					"Shift-Cmd-Alt-F": "replaceAll",
					"Cmd-[": "indentLess",
					"Cmd-]": "indentMore",
					"Cmd-Backspace": "delLineLeft",
					fallthrough: ["basic", "emacsy"]
				}, To["default"] = to ? To.macDefault : To.pcDefault, To.emacsy = {
					"Ctrl-F": "goCharRight",
					"Ctrl-B": "goCharLeft",
					"Ctrl-P": "goLineUp",
					"Ctrl-N": "goLineDown",
					"Alt-F": "goWordRight",
					"Alt-B": "goWordLeft",
					"Ctrl-A": "goLineStart",
					"Ctrl-E": "goLineEnd",
					"Ctrl-V": "goPageDown",
					"Shift-Ctrl-V": "goPageUp",
					"Ctrl-D": "delCharAfter",
					"Ctrl-H": "delCharBefore",
					"Alt-D": "delWordAfter",
					"Alt-Backspace": "delWordBefore",
					"Ctrl-K": "killLine",
					"Ctrl-T": "transposeChars"
				}, e.lookupKey = En, e.isModifierKey = Ln, e.keyName = Tn, e.fromTextArea = function (t, n) {
					function r() {
						t.value = u.getValue()
					}

					if (n || (n = {}), n.value = t.value, !n.tabindex && t.tabindex && (n.tabindex = t.tabindex), !n.placeholder && t.placeholder && (n.placeholder = t.placeholder), null == n.autofocus) {
						var i = document.body;
						try {
							i = document.activeElement
						} catch (o) {
						}
						n.autofocus = i == t || null != t.getAttribute("autofocus") && i == document.body
					}
					if (t.form && (Xr(t.form, "submit", r), !n.leaveSubmitMethodAlone)) {
						var a = t.form, s = a.submit;
						try {
							var l = a.submit = function () {
								r(), a.submit = s, a.submit(), a.submit = l
							}
						} catch (o) {
						}
					}
					t.style.display = "none";
					var u = e(function (e) {
						t.parentNode.insertBefore(e, t.nextSibling)
					}, n);
					return u.save = r, u.getTextArea = function () {
						return t
					}, u.toTextArea = function () {
						r(), t.parentNode.removeChild(u.getWrapperElement()), t.style.display = "", t.form && (Jr(t.form, "submit", r), "function" == typeof t.form.submit && (t.form.submit = s))
					}, u
				}, Dn.prototype = {
					eol: function () {
						return this.pos >= this.string.length
					}, sol: function () {
						return this.pos == this.lineStart
					}, peek: function () {
						return this.string.charAt(this.pos) || void 0
					}, next: function () {
						return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
					}, eat: function (e) {
						var t = this.string.charAt(this.pos);
						if ("string" == typeof e) var n = t == e; else var n = t && (e.test ? e.test(t) : e(t));
						return n ? (++this.pos, t) : void 0
					}, eatWhile: function (e) {
						for (var t = this.pos; this.eat(e);) ;
						return this.pos > t
					}, eatSpace: function () {
						for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
						return this.pos > e
					}, skipToEnd: function () {
						this.pos = this.string.length
					}, skipTo: function (e) {
						var t = this.string.indexOf(e, this.pos);
						return t > -1 ? (this.pos = t, !0) : void 0
					}, backUp: function (e) {
						this.pos -= e
					}, column: function () {
						return this.lastColumnPos < this.start && (this.lastColumnValue = oi(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? oi(this.string, this.lineStart, this.tabSize) : 0)
					}, indentation: function () {
						return oi(this.string, null, this.tabSize) - (this.lineStart ? oi(this.string, this.lineStart, this.tabSize) : 0)
					}, match: function (e, t, n) {
						if ("string" != typeof e) {
							var r = this.string.slice(this.pos).match(e);
							return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r)
						}
						var i = function (e) {
							return n ? e.toLowerCase() : e
						}, o = this.string.substr(this.pos, e.length);
						return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
					}, current: function () {
						return this.string.slice(this.start, this.pos)
					}, hideFirstChars: function (e, t) {
						this.lineStart += e;
						try {
							return t()
						} finally {
							this.lineStart -= e
						}
					}
				}, e.StringStream = Dn, e.TextMarker = Mn, ri(Mn), Mn.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						var e = this.doc.cm, t = e && !e.curOp;
						if (t && ot(e), ni(this, "clear")) {
							var n = this.find();
							n && Qr(this, "clear", n.from, n.to)
						}
						for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
							var a = this.lines[o], s = Fn(a.markedSpans, this);
							null != s.to && (i = Lr(a)), a.markedSpans = Hn(a.markedSpans, s), null != s.from ? r = Lr(a) : this.collapsed && !Zn(this.doc, a) && e && Er(a, rt(e.display))
						}
						if (e && this.collapsed && !e.options.lineWrapping) for (var o = 0; o < this.lines.length; ++o) {
							var l = Jn(e.doc, this.lines[o]), u = f(e.doc, l);
							u > e.display.maxLineLength && (e.display.maxLine = l, e.display.maxLineLength = u, e.display.maxLineChanged = !0)
						}
						null != r && e && ct(e, r, i + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && un(e)), t && at(e)
					}
				}, Mn.prototype.find = function (e) {
					for (var t, n, r = 0; r < this.lines.length; ++r) {
						var i = this.lines[r], o = Fn(i.markedSpans, this);
						if (null != o.from || null != o.to) {
							var a = Lr(i);
							null != o.from && (t = Xt(a, o.from)), null != o.to && (n = Xt(a, o.to))
						}
					}
					return "bookmark" != this.type || e ? t && {from: t, to: n} : t
				}, Mn.prototype.changed = function () {
					var e = this.find(), t = this.doc.cm;
					if (e && t) {
						"bookmark" != this.type && (e = e.from);
						var n = Sr(this.doc, e.line);
						if (P(t, n), e.line >= t.display.showingFrom && e.line < t.display.showingTo) {
							for (var r = t.display.lineDiv.firstChild; r; r = r.nextSibling) if (r.lineObj == n) {
								r.offsetHeight != n.height && Er(n, r.offsetHeight);
								break
							}
							ut(t, function () {
								t.curOp.selectionChanged = t.curOp.forceUpdate = t.curOp.updateMaxLine = !0
							})
						}
					}
				}, Mn.prototype.attachLine = function (e) {
					if (!this.lines.length && this.doc.cm) {
						var t = this.doc.cm.curOp;
						t.maybeHiddenMarkers && -1 != ui(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
					}
					this.lines.push(e)
				}, Mn.prototype.detachLine = function (e) {
					if (this.lines.splice(ui(this.lines, e), 1), !this.lines.length && this.doc.cm) {
						var t = this.doc.cm.curOp;
						(t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
					}
				};
				var Do = 0;
				e.SharedTextMarker = Bn, ri(Bn), Bn.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						this.explicitlyCleared = !0;
						for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
						Qr(this, "clear")
					}
				}, Bn.prototype.find = function () {
					return this.primary.find()
				};
				var Mo = e.LineWidget = function (e, t, n) {
					if (n) for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
					this.cm = e, this.node = t
				};
				ri(Mo), Mo.prototype.clear = nr(function () {
					var e = this.line.widgets, t = Lr(this.line);
					if (null != t && e) {
						for (var n = 0; n < e.length; ++n) e[n] == this && e.splice(n--, 1);
						e.length || (this.line.widgets = null);
						var r = Dr(this.cm, this.line) < this.cm.doc.scrollTop;
						Er(this.line, Math.max(0, this.line.height - rr(this))), r && gn(this.cm, 0, -this.height), ct(this.cm, t, t + 1)
					}
				}), Mo.prototype.changed = nr(function () {
					var e = this.height;
					this.height = null;
					var t = rr(this) - e;
					if (t) {
						Er(this.line, this.line.height + t);
						var n = Lr(this.line);
						ct(this.cm, n, n + 1)
					}
				});
				var No = e.Line = function (e, t, n) {
					this.text = e, tr(this, t), this.height = n ? n(this) : 1
				};
				ri(No), No.prototype.lineNo = function () {
					return Lr(this)
				};
				var Bo = {}, Oo = {};
				wr.prototype = {
					chunkSize: function () {
						return this.lines.length
					}, removeInner: function (e, t) {
						for (var n = e, r = e + t; r > n; ++n) {
							var i = this.lines[n];
							this.height -= i.height, ar(i), Qr(i, "delete")
						}
						this.lines.splice(e, t)
					}, collapse: function (e) {
						e.splice.apply(e, [e.length, 0].concat(this.lines))
					}, insertInner: function (e, t, n) {
						this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
						for (var r = 0, i = t.length; i > r; ++r) t[r].parent = this
					}, iterN: function (e, t, n) {
						for (var r = e + t; r > e; ++e) if (n(this.lines[e])) return !0
					}
				}, _r.prototype = {
					chunkSize: function () {
						return this.size
					}, removeInner: function (e, t) {
						this.size -= t;
						for (var n = 0; n < this.children.length; ++n) {
							var r = this.children[n], i = r.chunkSize();
							if (i > e) {
								var o = Math.min(t, i - e), a = r.height;
								if (r.removeInner(e, o), this.height -= a - r.height, i == o && (this.children.splice(n--, 1), r.parent = null), 0 == (t -= o)) break;
								e = 0
							} else e -= i
						}
						if (this.size - t < 25) {
							var s = [];
							this.collapse(s), this.children = [new wr(s)], this.children[0].parent = this
						}
					}, collapse: function (e) {
						for (var t = 0, n = this.children.length; n > t; ++t) this.children[t].collapse(e)
					}, insertInner: function (e, t, n) {
						this.size += t.length, this.height += n;
						for (var r = 0, i = this.children.length; i > r; ++r) {
							var o = this.children[r], a = o.chunkSize();
							if (a >= e) {
								if (o.insertInner(e, t, n), o.lines && o.lines.length > 50) {
									for (; o.lines.length > 50;) {
										var s = o.lines.splice(o.lines.length - 25, 25), l = new wr(s);
										o.height -= l.height, this.children.splice(r + 1, 0, l), l.parent = this
									}
									this.maybeSpill()
								}
								break
							}
							e -= a
						}
					}, maybeSpill: function () {
						if (!(this.children.length <= 10)) {
							var e = this;
							do {
								var t = e.children.splice(e.children.length - 5, 5), n = new _r(t);
								if (e.parent) {
									e.size -= n.size, e.height -= n.height;
									var r = ui(e.parent.children, e);
									e.parent.children.splice(r + 1, 0, n)
								} else {
									var i = new _r(e.children);
									i.parent = e, e.children = [i, n], e = i
								}
								n.parent = e.parent
							} while (e.children.length > 10);
							e.parent.maybeSpill()
						}
					}, iterN: function (e, t, n) {
						for (var r = 0, i = this.children.length; i > r; ++r) {
							var o = this.children[r], a = o.chunkSize();
							if (a > e) {
								var s = Math.min(t, a - e);
								if (o.iterN(e, s, n)) return !0;
								if (0 == (t -= s)) break;
								e = 0
							} else e -= a
						}
					}
				};
				var Fo = 0, Ho = e.Doc = function (e, t, n) {
					if (!(this instanceof Ho)) return new Ho(e, t, n);
					null == n && (n = 0), _r.call(this, [new wr([new No("", null)])]), this.first = n, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.history = Nr(), this.cleanGeneration = 1, this.frontier = n;
					var r = Xt(n, 0);
					this.sel = {
						from: r,
						to: r,
						head: r,
						anchor: r,
						shift: !1,
						extend: !1,
						goalColumn: null
					}, this.id = ++Fo, this.modeOption = t, "string" == typeof e && (e = Yo(e)), yr(this, {
						from: r,
						to: r,
						text: e
					}, null, {head: r, anchor: r})
				};
				Ho.prototype = ci(_r.prototype, {
					constructor: Ho, iter: function (e, t, n) {
						n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
					}, insert: function (e, t) {
						for (var n = 0, r = 0, i = t.length; i > r; ++r) n += t[r].height;
						this.insertInner(e - this.first, t, n)
					}, remove: function (e, t) {
						this.removeInner(e - this.first, t)
					}, getValue: function (e) {
						var t = Ar(this, this.first, this.first + this.size);
						return e === !1 ? t : t.join(e || "\n")
					}, setValue: function (e) {
						var t = Xt(this.first, 0), n = this.first + this.size - 1;
						qt(this, {from: t, to: Xt(n, Sr(this, n).text.length), text: Yo(e), origin: "setValue"}, {
							head: t,
							anchor: t
						}, !0)
					}, replaceRange: function (e, t, n, r) {
						t = nn(this, t), n = n ? nn(this, n) : t, Yt(this, e, t, n, r)
					}, getRange: function (e, t, n) {
						var r = Cr(this, nn(this, e), nn(this, t));
						return n === !1 ? r : r.join(n || "\n")
					}, getLine: function (e) {
						var t = this.getLineHandle(e);
						return t && t.text
					}, setLine: function (e, t) {
						on(this, e) && Yt(this, t, Xt(e, 0), nn(this, Xt(e)))
					}, removeLine: function (e) {
						e ? Yt(this, "", nn(this, Xt(e - 1)), nn(this, Xt(e))) : Yt(this, "", Xt(0, 0), nn(this, Xt(1, 0)))
					}, getLineHandle: function (e) {
						return on(this, e) ? Sr(this, e) : void 0
					}, getLineNumber: function (e) {
						return Lr(e)
					}, getLineHandleVisualStart: function (e) {
						return "number" == typeof e && (e = Sr(this, e)), Jn(this, e)
					}, lineCount: function () {
						return this.size
					}, firstLine: function () {
						return this.first
					}, lastLine: function () {
						return this.first + this.size - 1
					}, clipPos: function (e) {
						return nn(this, e)
					}, getCursor: function (e) {
						var t, n = this.sel;
						return t = null == e || "head" == e ? n.head : "anchor" == e ? n.anchor : "end" == e || e === !1 ? n.to : n.from, en(t)
					}, somethingSelected: function () {
						return !Jt(this.sel.head, this.sel.anchor)
					}, setCursor: lt(function (e, t, n) {
						var r = nn(this, "number" == typeof e ? Xt(e, t || 0) : e);
						n ? an(this, r) : ln(this, r, r)
					}), setSelection: lt(function (e, t, n) {
						ln(this, nn(this, e), nn(this, t || e), n)
					}), extendSelection: lt(function (e, t, n) {
						an(this, nn(this, e), t && nn(this, t), n)
					}), getSelection: function (e) {
						return this.getRange(this.sel.from, this.sel.to, e)
					}, replaceSelection: function (e, t, n) {
						qt(this, {from: this.sel.from, to: this.sel.to, text: Yo(e), origin: n}, t || "around")
					}, undo: lt(function () {
						Vt(this, "undo")
					}), redo: lt(function () {
						Vt(this, "redo")
					}), setExtending: function (e) {
						this.sel.extend = e
					}, historySize: function () {
						var e = this.history;
						return {undo: e.done.length, redo: e.undone.length}
					}, clearHistory: function () {
						this.history = Nr(this.history.maxGeneration)
					}, markClean: function () {
						this.cleanGeneration = this.changeGeneration(!0)
					}, changeGeneration: function (e) {
						return e && (this.history.lastOp = this.history.lastOrigin = null), this.history.generation
					}, isClean: function (e) {
						return this.history.generation == (e || this.cleanGeneration)
					}, getHistory: function () {
						return {done: Ir(this.history.done), undone: Ir(this.history.undone)}
					}, setHistory: function (e) {
						var t = this.history = Nr(this.history.maxGeneration);
						t.done = e.done.slice(0), t.undone = e.undone.slice(0)
					}, markText: function (e, t, n) {
						return Nn(this, nn(this, e), nn(this, t), n, "range")
					}, setBookmark: function (e, t) {
						var n = {
							replacedWith: t && (null == t.nodeType ? t.widget : t),
							insertLeft: t && t.insertLeft,
							clearWhenEmpty: !1
						};
						return e = nn(this, e), Nn(this, e, e, n, "bookmark")
					}, findMarksAt: function (e) {
						e = nn(this, e);
						var t = [], n = Sr(this, e.line).markedSpans;
						if (n) for (var r = 0; r < n.length; ++r) {
							var i = n[r];
							(null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
						}
						return t
					}, findMarks: function (e, t) {
						e = nn(this, e), t = nn(this, t);
						var n = [], r = e.line;
						return this.iter(e.line, t.line + 1, function (i) {
							var o = i.markedSpans;
							if (o) for (var a = 0; a < o.length; a++) {
								var s = o[a];
								r == e.line && e.ch > s.to || null == s.from && r != e.line || r == t.line && s.from > t.ch || n.push(s.marker.parent || s.marker)
							}
							++r
						}), n
					}, getAllMarks: function () {
						var e = [];
						return this.iter(function (t) {
							var n = t.markedSpans;
							if (n) for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker)
						}), e
					}, posFromIndex: function (e) {
						var t, n = this.first;
						return this.iter(function (r) {
							var i = r.text.length + 1;
							return i > e ? (t = e, !0) : (e -= i, ++n, void 0)
						}), nn(this, Xt(n, t))
					}, indexFromPos: function (e) {
						e = nn(this, e);
						var t = e.ch;
						return e.line < this.first || e.ch < 0 ? 0 : (this.iter(this.first, e.line, function (e) {
							t += e.text.length + 1
						}), t)
					}, copy: function (e) {
						var t = new Ho(Ar(this, this.first, this.first + this.size), this.modeOption, this.first);
						return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = {
							from: this.sel.from,
							to: this.sel.to,
							head: this.sel.head,
							anchor: this.sel.anchor,
							shift: this.sel.shift,
							extend: !1,
							goalColumn: this.sel.goalColumn
						}, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
					}, linkedDoc: function (e) {
						e || (e = {});
						var t = this.first, n = this.first + this.size;
						null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
						var r = new Ho(Ar(this, t, n), e.mode || this.modeOption, t);
						return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({
							doc: r,
							sharedHist: e.sharedHist
						}), r.linked = [{doc: this, isParent: !0, sharedHist: e.sharedHist}], r
					}, unlinkDoc: function (t) {
						if (t instanceof e && (t = t.doc), this.linked) for (var n = 0; n < this.linked.length; ++n) {
							var r = this.linked[n];
							if (r.doc == t) {
								this.linked.splice(n, 1), t.unlinkDoc(this);
								break
							}
						}
						if (t.history == this.history) {
							var i = [t.id];
							xr(t, function (e) {
								i.push(e.id)
							}, !0), t.history = Nr(), t.history.done = Ir(this.history.done, i), t.history.undone = Ir(this.history.undone, i)
						}
					}, iterLinkedDocs: function (e) {
						xr(this, e)
					}, getMode: function () {
						return this.mode
					}, getEditor: function () {
						return this.cm
					}
				}), Ho.prototype.eachLine = Ho.prototype.iter;
				var jo = "iter insert remove copy getEditor".split(" ");
				for (var Io in Ho.prototype) Ho.prototype.hasOwnProperty(Io) && ui(jo, Io) < 0 && (e.prototype[Io] = function (e) {
					return function () {
						return e.apply(this.doc, arguments)
					}
				}(Ho.prototype[Io]));
				ri(Ho), e.e_stop = $r, e.e_preventDefault = Ur, e.e_stopPropagation = Vr;
				var zo, Ro = 0;
				e.on = Xr, e.off = Jr, e.signal = Zr;
				var Wo = 30, Po = e.Pass = {
					toString: function () {
						return "CodeMirror.Pass"
					}
				};
				ii.prototype = {
					set: function (e, t) {
						clearTimeout(this.id), this.id = setTimeout(t, e)
					}
				}, e.countColumn = oi;
				var qo = [""], Uo = /[\u00df\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
					Vo = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
				e.replaceGetRect = function (e) {
					_i = e
				};
				var Go = function () {
					if (Ri) return !1;
					var e = vi("div");
					return "draggable" in e || "dragDrop" in e
				}();
				ji ? xi = function (e, t) {
					return 36 == e.charCodeAt(t - 1) && 39 == e.charCodeAt(t)
				} : Ki && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent) ? xi = function (e, t) {
					return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(e.slice(t - 1, t + 1))
				} : Ui && /Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent) ? xi = function (e, t) {
					var n = e.charCodeAt(t - 1);
					return n >= 8208 && 8212 >= n
				} : Ui && (xi = function (e, t) {
					if (t > 1 && 45 == e.charCodeAt(t - 1)) {
						if (/\w/.test(e.charAt(t - 2)) && /[^\-?\.]/.test(e.charAt(t))) return !0;
						if (t > 2 && /[\d\.,]/.test(e.charAt(t - 2)) && /[\d\.,]/.test(e.charAt(t))) return !1
					}
					return /[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|\u2026[\w~`@#$%\^&*(_=+{[><]/.test(e.slice(t - 1, t + 1))
				});
				var $o, Ko, Yo = 3 != "\n\nb".split(/\n/).length ? function (e) {
					for (var t = 0, n = [], r = e.length; r >= t;) {
						var i = e.indexOf("\n", t);
						-1 == i && (i = e.length);
						var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i), a = o.indexOf("\r");
						-1 != a ? (n.push(o.slice(0, a)), t += a + 1) : (n.push(o), t = i + 1)
					}
					return n
				} : function (e) {
					return e.split(/\r\n?|\n/)
				};
				e.splitLines = Yo;
				var Xo = window.getSelection ? function (e) {
					try {
						return e.selectionStart != e.selectionEnd
					} catch (t) {
						return !1
					}
				} : function (e) {
					try {
						var t = e.ownerDocument.selection.createRange()
					} catch (n) {
					}
					return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
				}, Jo = function () {
					var e = vi("div");
					return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
				}(), Zo = {
					3: "Enter",
					8: "Backspace",
					9: "Tab",
					13: "Enter",
					16: "Shift",
					17: "Ctrl",
					18: "Alt",
					19: "Pause",
					20: "CapsLock",
					27: "Esc",
					32: "Space",
					33: "PageUp",
					34: "PageDown",
					35: "End",
					36: "Home",
					37: "Left",
					38: "Up",
					39: "Right",
					40: "Down",
					44: "PrintScrn",
					45: "Insert",
					46: "Delete",
					59: ";",
					61: "=",
					91: "Mod",
					92: "Mod",
					93: "Mod",
					107: "=",
					109: "-",
					127: "Delete",
					173: "-",
					186: ";",
					187: "=",
					188: ",",
					189: "-",
					190: ".",
					191: "/",
					192: "`",
					219: "[",
					220: "\\",
					221: "]",
					222: "'",
					63232: "Up",
					63233: "Down",
					63234: "Left",
					63235: "Right",
					63272: "Delete",
					63273: "Home",
					63275: "End",
					63276: "PageUp",
					63277: "PageDown",
					63302: "Insert"
				};
				e.keyNames = Zo, function () {
					for (var e = 0; 10 > e; e++) Zo[e + 48] = Zo[e + 96] = String(e);
					for (var e = 65; 90 >= e; e++) Zo[e] = String.fromCharCode(e);
					for (var e = 1; 12 >= e; e++) Zo[e + 111] = Zo[e + 63235] = "F" + e
				}();
				var Qo, ea = function () {
					function e(e) {
						return 255 >= e ? t.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1791 >= e ? n.charAt(e - 1536) : e >= 1792 && 2220 >= e ? "r" : "L"
					}

					var t = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL",
						n = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr",
						r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, i = /[stwN]/, o = /[LRr]/, a = /[Lb1n]/,
						s = /[1n]/, l = "L";
					return function (t) {
						if (!r.test(t)) return !1;
						for (var n, u = t.length, c = [], f = 0; u > f; ++f) c.push(n = e(t.charCodeAt(f)));
						for (var f = 0, d = l; u > f; ++f) {
							var n = c[f];
							"m" == n ? c[f] = d : d = n
						}
						for (var f = 0, h = l; u > f; ++f) {
							var n = c[f];
							"1" == n && "r" == h ? c[f] = "n" : o.test(n) && (h = n, "r" == n && (c[f] = "R"))
						}
						for (var f = 1, d = c[0]; u - 1 > f; ++f) {
							var n = c[f];
							"+" == n && "1" == d && "1" == c[f + 1] ? c[f] = "1" : "," != n || d != c[f + 1] || "1" != d && "n" != d || (c[f] = d), d = n
						}
						for (var f = 0; u > f; ++f) {
							var n = c[f];
							if ("," == n) c[f] = "N"; else if ("%" == n) {
								for (var p = f + 1; u > p && "%" == c[p]; ++p) ;
								for (var m = f && "!" == c[f - 1] || u > p && "1" == c[p] ? "1" : "N", g = f; p > g; ++g) c[g] = m;
								f = p - 1
							}
						}
						for (var f = 0, h = l; u > f; ++f) {
							var n = c[f];
							"L" == h && "1" == n ? c[f] = "L" : o.test(n) && (h = n)
						}
						for (var f = 0; u > f; ++f) if (i.test(c[f])) {
							for (var p = f + 1; u > p && i.test(c[p]); ++p) ;
							for (var v = "L" == (f ? c[f - 1] : l), b = "L" == (u > p ? c[p] : l), m = v || b ? "L" : "R", g = f; p > g; ++g) c[g] = m;
							f = p - 1
						}
						for (var y, w = [], f = 0; u > f;) if (a.test(c[f])) {
							var _ = f;
							for (++f; u > f && a.test(c[f]); ++f) ;
							w.push({from: _, to: f, level: 0})
						} else {
							var x = f, k = w.length;
							for (++f; u > f && "L" != c[f]; ++f) ;
							for (var g = x; f > g;) if (s.test(c[g])) {
								g > x && w.splice(k, 0, {from: x, to: g, level: 1});
								var S = g;
								for (++g; f > g && s.test(c[g]); ++g) ;
								w.splice(k, 0, {from: S, to: g, level: 2}), x = g
							} else ++g;
							f > x && w.splice(k, 0, {from: x, to: f, level: 1})
						}
						return 1 == w[0].level && (y = t.match(/^\s+/)) && (w[0].from = y[0].length, w.unshift({
							from: 0,
							to: y[0].length,
							level: 0
						})), 1 == si(w).level && (y = t.match(/\s+$/)) && (si(w).to -= y[0].length, w.push({
							from: u - y[0].length,
							to: u,
							level: 0
						})), w[0].level != si(w).level && w.push({from: u, to: u, level: w[0].level}), w
					}
				}();
				return e.version = "3.22.0", e
			}()
		}, {}], 19: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("css", function (e, t) {
				"use strict";

				function r(e, t) {
					return h = t, e
				}

				function i(e, t) {
					var n = e.next();
					if (g[n]) {
						var i = g[n](e, t);
						if (i !== !1) return i
					}
					return "@" == n ? (e.eatWhile(/[\w\\\-]/), r("def", e.current())) : "=" == n || ("~" == n || "|" == n) && e.eat("=") ? r(null, "compare") : '"' == n || "'" == n ? (t.tokenize = o(n), t.tokenize(e, t)) : "#" == n ? (e.eatWhile(/[\w\\\-]/), r("atom", "hash")) : "!" == n ? (e.match(/^\s*\w*/), r("keyword", "important")) : /\d/.test(n) || "." == n && e.eat(/\d/) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : "-" !== n ? /[,+>*\/]/.test(n) ? r(null, "select-op") : "." == n && e.match(/^-?[_a-z][_a-z0-9-]*/i) ? r("qualifier", "qualifier") : /[:;{}\[\]\(\)]/.test(n) ? r(null, n) : "u" == n && e.match("rl(") ? (e.backUp(1), t.tokenize = a, r("property", "word")) : /[\w\\\-]/.test(n) ? (e.eatWhile(/[\w\\\-]/), r("property", "word")) : r(null, null) : /[\d.]/.test(e.peek()) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : e.match(/^[^-]+-/) ? r("meta", "meta") : void 0
				}

				function o(e) {
					return function (t, n) {
						for (var i, o = !1; null != (i = t.next());) {
							if (i == e && !o) {
								")" == e && t.backUp(1);
								break
							}
							o = !o && "\\" == i
						}
						return (i == e || !o && ")" != e) && (n.tokenize = null), r("string", "string")
					}
				}

				function a(e, t) {
					return e.next(), t.tokenize = e.match(/\s*[\"\']/, !1) ? null : o(")"), r(null, "(")
				}

				function s(e, t, n) {
					this.type = e, this.indent = t, this.prev = n
				}

				function l(e, t, n) {
					return e.context = new s(n, t.indentation() + m, e.context), n
				}

				function u(e) {
					return e.context = e.context.prev, e.context.type
				}

				function c(e, t, n) {
					return S[n.context.type](e, t, n)
				}

				function f(e, t, n, r) {
					for (var i = r || 1; i > 0; i--) n.context = n.context.prev;
					return c(e, t, n)
				}

				function d(e) {
					var t = e.current().toLowerCase();
					p = _.hasOwnProperty(t) ? "atom" : w.hasOwnProperty(t) ? "keyword" : "variable"
				}

				t.propertyKeywords || (t = n.resolveMode("text/css"));
				var h, p, m = e.indentUnit, g = t.tokenHooks, v = t.mediaTypes || {}, b = t.mediaFeatures || {},
					y = t.propertyKeywords || {}, w = t.colorKeywords || {}, _ = t.valueKeywords || {},
					x = t.fontProperties || {}, k = t.allowNested, S = {};
				return S.top = function (e, t, n) {
					if ("{" == e) return l(n, t, "block");
					if ("}" == e && n.context.prev) return u(n);
					if ("@media" == e) return l(n, t, "media");
					if ("@font-face" == e) return "font_face_before";
					if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(e)) return "keyframes";
					if (e && "@" == e.charAt(0)) return l(n, t, "at");
					if ("hash" == e) p = "builtin"; else if ("word" == e) p = "tag"; else {
						if ("variable-definition" == e) return "maybeprop";
						if ("interpolation" == e) return l(n, t, "interpolation");
						if (":" == e) return "pseudo";
						if (k && "(" == e) return l(n, t, "params")
					}
					return n.context.type
				}, S.block = function (e, t, n) {
					return "word" == e ? y.hasOwnProperty(t.current().toLowerCase()) ? (p = "property", "maybeprop") : k ? (p = t.match(/^\s*:/, !1) ? "property" : "tag", "block") : (p += " error", "maybeprop") : "meta" == e ? "block" : k || "hash" != e && "qualifier" != e ? S.top(e, t, n) : (p = "error", "block")
				}, S.maybeprop = function (e, t, n) {
					return ":" == e ? l(n, t, "prop") : c(e, t, n)
				}, S.prop = function (e, t, n) {
					if (";" == e) return u(n);
					if ("{" == e && k) return l(n, t, "propBlock");
					if ("}" == e || "{" == e) return f(e, t, n);
					if ("(" == e) return l(n, t, "parens");
					if ("hash" != e || /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t.current())) {
						if ("word" == e) d(t); else if ("interpolation" == e) return l(n, t, "interpolation")
					} else p += " error";
					return "prop"
				}, S.propBlock = function (e, t, n) {
					return "}" == e ? u(n) : "word" == e ? (p = "property", "maybeprop") : n.context.type
				}, S.parens = function (e, t, n) {
					return "{" == e || "}" == e ? f(e, t, n) : ")" == e ? u(n) : "parens"
				}, S.pseudo = function (e, t, n) {
					return "word" == e ? (p = "variable-3", n.context.type) : c(e, t, n)
				}, S.media = function (e, t, n) {
					if ("(" == e) return l(n, t, "media_parens");
					if ("}" == e) return f(e, t, n);
					if ("{" == e) return u(n) && l(n, t, k ? "block" : "top");
					if ("word" == e) {
						var r = t.current().toLowerCase();
						p = "only" == r || "not" == r || "and" == r ? "keyword" : v.hasOwnProperty(r) ? "attribute" : b.hasOwnProperty(r) ? "property" : "error"
					}
					return n.context.type
				}, S.media_parens = function (e, t, n) {
					return ")" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n, 2) : S.media(e, t, n)
				}, S.font_face_before = function (e, t, n) {
					return "{" == e ? l(n, t, "font_face") : c(e, t, n)
				}, S.font_face = function (e, t, n) {
					return "}" == e ? u(n) : "word" == e ? (p = x.hasOwnProperty(t.current().toLowerCase()) ? "property" : "error", "maybeprop") : "font_face"
				}, S.keyframes = function (e, t, n) {
					return "word" == e ? (p = "variable", "keyframes") : "{" == e ? l(n, t, "top") : c(e, t, n)
				}, S.at = function (e, t, n) {
					return ";" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n) : ("word" == e ? p = "tag" : "hash" == e && (p = "builtin"), "at")
				}, S.interpolation = function (e, t, n) {
					return "}" == e ? u(n) : "{" == e || ";" == e ? f(e, t, n) : ("variable" != e && (p = "error"), "interpolation")
				}, S.params = function (e, t, n) {
					return ")" == e ? u(n) : "{" == e || "}" == e ? f(e, t, n) : ("word" == e && d(t), "params")
				}, {
					startState: function (e) {
						return {tokenize: null, state: "top", context: new s("top", e || 0, null)}
					}, token: function (e, t) {
						if (!t.tokenize && e.eatSpace()) return null;
						var n = (t.tokenize || i)(e, t);
						return n && "object" == typeof n && (h = n[1], n = n[0]), p = n, t.state = S[t.state](h, e, t), p
					}, indent: function (e, t) {
						var n = e.context, r = t && t.charAt(0), i = n.indent;
						return "prop" == n.type && "}" == r && (n = n.prev), !n.prev || ("}" != r || "block" != n.type && "top" != n.type && "interpolation" != n.type && "font_face" != n.type) && (")" != r || "parens" != n.type && "params" != n.type && "media_parens" != n.type) && ("{" != r || "at" != n.type && "media" != n.type) || (i = n.indent - m, n = n.prev), i
					}, electricChars: "}", blockCommentStart: "/*", blockCommentEnd: "*/", fold: "brace"
				}
			}), function () {
				function e(e) {
					for (var t = {}, n = 0; n < e.length; ++n) t[e[n]] = !0;
					return t
				}

				function t(e, t) {
					for (var n, r = !1; null != (n = e.next());) {
						if (r && "/" == n) {
							t.tokenize = null;
							break
						}
						r = "*" == n
					}
					return ["comment", "comment"]
				}

				function r(e, t) {
					return e.skipTo("-->") ? (e.match("-->"), t.tokenize = null) : e.skipToEnd(), ["comment", "comment"]
				}

				var i = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"],
					o = e(i),
					a = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid"],
					s = e(a),
					l = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings", "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "justify-content", "left", "letter-spacing", "line-break", "line-height", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker-offset", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "max-height", "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "shape-inside", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index", "zoom", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "kerning", "text-anchor", "writing-mode"],
					u = e(l),
					c = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
					f = e(c),
					d = ["above", "absolute", "activeborder", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "column", "compact", "condensed", "contain", "content", "content-box", "context-menu", "continuous", "copy", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ew-resize", "expanded", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "landscape", "lao", "large", "larger", "left", "level", "lighter", "line-through", "linear", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "match", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif", "scroll", "scrollbar", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "single", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super", "sw-resize", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "x-large", "x-small", "xor", "xx-large", "xx-small"],
					h = e(d),
					p = ["font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"],
					m = e(p), g = i.concat(a).concat(l).concat(c).concat(d);
				n.registerHelper("hintWords", "css", g), n.defineMIME("text/css", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					tokenHooks: {
						"<": function (e, t) {
							return e.match("!--") ? (t.tokenize = r, r(e, t)) : !1
						}, "/": function (e, n) {
							return e.eat("*") ? (n.tokenize = t, t(e, n)) : !1
						}
					},
					name: "css"
				}), n.defineMIME("text/x-scss", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					allowNested: !0,
					tokenHooks: {
						"/": function (e, n) {
							return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (n.tokenize = t, t(e, n)) : ["operator", "operator"]
						}, ":": function (e) {
							return e.match(/\s*{/) ? [null, "{"] : !1
						}, $: function (e) {
							return e.match(/^[\w-]+/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"]
						}, "#": function (e) {
							return e.eat("{") ? [null, "interpolation"] : !1
						}
					},
					name: "css",
					helperType: "scss"
				}), n.defineMIME("text/x-less", {
					mediaTypes: o,
					mediaFeatures: s,
					propertyKeywords: u,
					colorKeywords: f,
					valueKeywords: h,
					fontProperties: m,
					allowNested: !0,
					tokenHooks: {
						"/": function (e, n) {
							return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (n.tokenize = t, t(e, n)) : ["operator", "operator"]
						}, "@": function (e) {
							return e.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, !1) ? !1 : (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"])
						}, "&": function () {
							return ["atom", "atom"]
						}
					},
					name: "css",
					helperType: "less"
				})
			}()
		}, {"code-mirror": 18}], 20: [function (e, t) {
			e("./xml.js"), e("./css.js"), e("./javascript.js");
			var n = t.exports = e("code-mirror");
			n.defineMode("htmlmixed", function (e, t) {
				function r(e, t) {
					var n = t.htmlState.tagName, r = s.token(e, t.htmlState);
					if ("script" == n && /\btag\b/.test(r) && ">" == e.current()) {
						var i = e.string.slice(Math.max(0, e.pos - 100), e.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);
						i = i ? i[1] : "", i && /[\"\']/.test(i.charAt(0)) && (i = i.slice(1, i.length - 1));
						for (var c = 0; c < u.length; ++c) {
							var f = u[c];
							if ("string" == typeof f.matches ? i == f.matches : f.matches.test(i)) {
								f.mode && (t.token = o, t.localMode = f.mode, t.localState = f.mode.startState && f.mode.startState(s.indent(t.htmlState, "")));
								break
							}
						}
					} else "style" == n && /\btag\b/.test(r) && ">" == e.current() && (t.token = a, t.localMode = l, t.localState = l.startState(s.indent(t.htmlState, "")));
					return r
				}

				function i(e, t, n) {
					var r, i = e.current(), o = i.search(t);
					return o > -1 ? e.backUp(i.length - o) : (r = i.match(/<\/?$/)) && (e.backUp(i.length), e.match(t, !1) || e.match(i)), n
				}

				function o(e, t) {
					return e.match(/^<\/\s*script\s*>/i, !1) ? (t.token = r, t.localState = t.localMode = null, r(e, t)) : i(e, /<\/\s*script\s*>/, t.localMode.token(e, t.localState))
				}

				function a(e, t) {
					return e.match(/^<\/\s*style\s*>/i, !1) ? (t.token = r, t.localState = t.localMode = null, r(e, t)) : i(e, /<\/\s*style\s*>/, l.token(e, t.localState))
				}

				var s = n.getMode(e, {
					name: "xml",
					htmlMode: !0,
					multilineTagIndentFactor: t.multilineTagIndentFactor,
					multilineTagIndentPastTag: t.multilineTagIndentPastTag
				}), l = n.getMode(e, "css"), u = [], c = t && t.scriptTypes;
				if (u.push({
						matches: /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,
						mode: n.getMode(e, "javascript")
					}), c) for (var f = 0; f < c.length; ++f) {
					var d = c[f];
					u.push({matches: d.matches, mode: d.mode && n.getMode(e, d.mode)})
				}
				return u.push({matches: /./, mode: n.getMode(e, "text/plain")}), {
					startState: function () {
						var e = s.startState();
						return {token: r, localMode: null, localState: null, htmlState: e}
					}, copyState: function (e) {
						if (e.localState) var t = n.copyState(e.localMode, e.localState);
						return {
							token: e.token,
							localMode: e.localMode,
							localState: t,
							htmlState: n.copyState(s, e.htmlState)
						}
					}, token: function (e, t) {
						return t.token(e, t)
					}, indent: function (e, t) {
						return !e.localMode || /^\s*<\//.test(t) ? s.indent(e.htmlState, t) : e.localMode.indent ? e.localMode.indent(e.localState, t) : n.Pass
					}, innerMode: function (e) {
						return {state: e.localState || e.htmlState, mode: e.localMode || s}
					}
				}
			}, "xml", "javascript", "css"), n.defineMIME("text/html", "htmlmixed")
		}, {"./css.js": 19, "./javascript.js": 21, "./xml.js": 22, "code-mirror": 18}], 21: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("javascript", function (e, t) {
				function r(e) {
					for (var t, n = !1, r = !1; null != (t = e.next());) {
						if (!n) {
							if ("/" == t && !r) return;
							"[" == t ? r = !0 : r && "]" == t && (r = !1)
						}
						n = !n && "\\" == t
					}
				}

				function i(e, t, n) {
					return ht = e, pt = n, t
				}

				function o(e, t) {
					var n = e.next();
					if ('"' == n || "'" == n) return t.tokenize = a(n), t.tokenize(e, t);
					if ("." == n && e.match(/^\d+(?:[eE][+\-]?\d+)?/)) return i("number", "number");
					if ("." == n && e.match("..")) return i("spread", "meta");
					if (/[\[\]{}\(\),;\:\.]/.test(n)) return i(n);
					if ("=" == n && e.eat(">")) return i("=>", "operator");
					if ("0" == n && e.eat(/x/i)) return e.eatWhile(/[\da-f]/i), i("number", "number");
					if (/\d/.test(n)) return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), i("number", "number");
					if ("/" == n) return e.eat("*") ? (t.tokenize = s, s(e, t)) : e.eat("/") ? (e.skipToEnd(), i("comment", "comment")) : "operator" == t.lastType || "keyword c" == t.lastType || "sof" == t.lastType || /^[\[{}\(,;:]$/.test(t.lastType) ? (r(e), e.eatWhile(/[gimy]/), i("regexp", "string-2")) : (e.eatWhile(_t), i("operator", "operator", e.current()));
					if ("`" == n) return t.tokenize = l, l(e, t);
					if ("#" == n) return e.skipToEnd(), i("error", "error");
					if (_t.test(n)) return e.eatWhile(_t), i("operator", "operator", e.current());
					e.eatWhile(/[\w\$_]/);
					var o = e.current(), u = wt.propertyIsEnumerable(o) && wt[o];
					return u && "." != t.lastType ? i(u.type, u.style, o) : i("variable", "variable", o)
				}

				function a(e) {
					return function (t, n) {
						var r, a = !1;
						if (vt && "@" == t.peek() && t.match(xt)) return n.tokenize = o, i("jsonld-keyword", "meta");
						for (; null != (r = t.next()) && (r != e || a);) a = !a && "\\" == r;
						return a || (n.tokenize = o), i("string", "string")
					}
				}

				function s(e, t) {
					for (var n, r = !1; n = e.next();) {
						if ("/" == n && r) {
							t.tokenize = o;
							break
						}
						r = "*" == n
					}
					return i("comment", "comment")
				}

				function l(e, t) {
					for (var n, r = !1; null != (n = e.next());) {
						if (!r && ("`" == n || "$" == n && e.eat("{"))) {
							t.tokenize = o;
							break
						}
						r = !r && "\\" == n
					}
					return i("quasi", "string-2", e.current())
				}

				function u(e, t) {
					t.fatArrowAt && (t.fatArrowAt = null);
					var n = e.string.indexOf("=>", e.start);
					if (!(0 > n)) {
						for (var r = 0, i = !1, o = n - 1; o >= 0; --o) {
							var a = e.string.charAt(o), s = kt.indexOf(a);
							if (s >= 0 && 3 > s) {
								if (!r) {
									++o;
									break
								}
								if (0 == --r) break
							} else if (s >= 3 && 6 > s) ++r; else if (/[$\w]/.test(a)) i = !0; else if (i && !r) {
								++o;
								break
							}
						}
						i && !r && (t.fatArrowAt = o)
					}
				}

				function c(e, t, n, r, i, o) {
					this.indented = e, this.column = t, this.type = n, this.prev = i, this.info = o, null != r && (this.align = r)
				}

				function f(e, t) {
					for (var n = e.localVars; n; n = n.next) if (n.name == t) return !0;
					for (var r = e.context; r; r = r.prev) for (var n = r.vars; n; n = n.next) if (n.name == t) return !0
				}

				function d(e, t, n, r, i) {
					var o = e.cc;
					for (Ct.state = e, Ct.stream = i, Ct.marked = null, Ct.cc = o, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0); ;) {
						var a = o.length ? o.pop() : bt ? x : _;
						if (a(n, r)) {
							for (; o.length && o[o.length - 1].lex;) o.pop()();
							return Ct.marked ? Ct.marked : "variable" == n && f(e, r) ? "variable-2" : t
						}
					}
				}

				function h() {
					for (var e = arguments.length - 1; e >= 0; e--) Ct.cc.push(arguments[e])
				}

				function p() {
					return h.apply(null, arguments), !0
				}

				function m(e) {
					function n(t) {
						for (var n = t; n; n = n.next) if (n.name == e) return !0;
						return !1
					}

					var r = Ct.state;
					if (r.context) {
						if (Ct.marked = "def", n(r.localVars)) return;
						r.localVars = {name: e, next: r.localVars}
					} else {
						if (n(r.globalVars)) return;
						t.globalVars && (r.globalVars = {name: e, next: r.globalVars})
					}
				}

				function g() {
					Ct.state.context = {prev: Ct.state.context, vars: Ct.state.localVars}, Ct.state.localVars = At
				}

				function v() {
					Ct.state.localVars = Ct.state.context.vars, Ct.state.context = Ct.state.context.prev
				}

				function b(e, t) {
					var n = function () {
						var n = Ct.state, r = n.indented;
						"stat" == n.lexical.type && (r = n.lexical.indented), n.lexical = new c(r, Ct.stream.column(), e, null, n.lexical, t)
					};
					return n.lex = !0, n
				}

				function y() {
					var e = Ct.state;
					e.lexical.prev && (")" == e.lexical.type && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
				}

				function w(e) {
					return function (t) {
						return t == e ? p() : ";" == e ? h() : p(arguments.callee)
					}
				}

				function _(e, t) {
					return "var" == e ? p(b("vardef", t.length), q, w(";"), y) : "keyword a" == e ? p(b("form"), x, _, y) : "keyword b" == e ? p(b("form"), _, y) : "{" == e ? p(b("}"), R, y) : ";" == e ? p() : "if" == e ? p(b("form"), x, _, y, K) : "function" == e ? p(et) : "for" == e ? p(b("form"), Y, _, y) : "variable" == e ? p(b("stat"), B) : "switch" == e ? p(b("form"), x, b("}", "switch"), w("{"), R, y, y) : "case" == e ? p(x, w(":")) : "default" == e ? p(w(":")) : "catch" == e ? p(b("form"), g, w("("), tt, w(")"), _, y, v) : "module" == e ? p(b("form"), g, ot, v, y) : "class" == e ? p(b("form"), nt, it, y) : "export" == e ? p(b("form"), at, y) : "import" == e ? p(b("form"), st, y) : h(b("stat"), x, w(";"), y)
				}

				function x(e) {
					return S(e, !1)
				}

				function k(e) {
					return S(e, !0)
				}

				function S(e, t) {
					if (Ct.state.fatArrowAt == Ct.stream.start) {
						var n = t ? N : M;
						if ("(" == e) return p(g, b(")"), I(U, ")"), y, w("=>"), n, v);
						if ("variable" == e) return h(g, U, w("=>"), n, v)
					}
					var r = t ? L : E;
					return St.hasOwnProperty(e) ? p(r) : "function" == e ? p(et) : "keyword c" == e ? p(t ? A : C) : "(" == e ? p(b(")"), C, dt, w(")"), y, r) : "operator" == e || "spread" == e ? p(t ? k : x) : "[" == e ? p(b("]"), ct, y, r) : "{" == e ? z(F, "}", null, r) : p()
				}

				function C(e) {
					return e.match(/[;\}\)\],]/) ? h() : h(x)
				}

				function A(e) {
					return e.match(/[;\}\)\],]/) ? h() : h(k)
				}

				function E(e, t) {
					return "," == e ? p(x) : L(e, t, !1)
				}

				function L(e, t, n) {
					var r = 0 == n ? E : L, i = 0 == n ? x : k;
					return "=>" == t ? p(g, n ? N : M, v) : "operator" == e ? /\+\+|--/.test(t) ? p(r) : "?" == t ? p(x, w(":"), i) : p(i) : "quasi" == e ? (Ct.cc.push(r), T(t)) : ";" != e ? "(" == e ? z(k, ")", "call", r) : "." == e ? p(O, r) : "[" == e ? p(b("]"), C, w("]"), y, r) : void 0 : void 0
				}

				function T(e) {
					return "${" != e.slice(e.length - 2) ? p() : p(x, D)
				}

				function D(e) {
					return "}" == e ? (Ct.marked = "string-2", Ct.state.tokenize = l, p()) : void 0
				}

				function M(e) {
					return u(Ct.stream, Ct.state), "{" == e ? h(_) : h(x)
				}

				function N(e) {
					return u(Ct.stream, Ct.state), "{" == e ? h(_) : h(k)
				}

				function B(e) {
					return ":" == e ? p(y, _) : h(E, w(";"), y)
				}

				function O(e) {
					return "variable" == e ? (Ct.marked = "property", p()) : void 0
				}

				function F(e, t) {
					if ("variable" == e) {
						if (Ct.marked = "property", "get" == t || "set" == t) return p(H)
					} else if ("number" == e || "string" == e) Ct.marked = vt ? "property" : e + " property"; else if ("[" == e) return p(x, w("]"), j);
					return St.hasOwnProperty(e) ? p(j) : void 0
				}

				function H(e) {
					return "variable" != e ? h(j) : (Ct.marked = "property", p(et))
				}

				function j(e) {
					return ":" == e ? p(k) : "(" == e ? h(et) : void 0
				}

				function I(e, t) {
					function n(r) {
						if ("," == r) {
							var i = Ct.state.lexical;
							return "call" == i.info && (i.pos = (i.pos || 0) + 1), p(e, n)
						}
						return r == t ? p() : p(w(t))
					}

					return function (r) {
						return r == t ? p() : h(e, n)
					}
				}

				function z(e, t, n) {
					for (var r = 3; r < arguments.length; r++) Ct.cc.push(arguments[r]);
					return p(b(t, n), I(e, t), y)
				}

				function R(e) {
					return "}" == e ? p() : h(_, R)
				}

				function W(e) {
					return yt && ":" == e ? p(P) : void 0
				}

				function P(e) {
					return "variable" == e ? (Ct.marked = "variable-3", p()) : void 0
				}

				function q() {
					return h(U, W, G, $)
				}

				function U(e, t) {
					return "variable" == e ? (m(t), p()) : "[" == e ? z(U, "]") : "{" == e ? z(V, "}") : void 0
				}

				function V(e, t) {
					return "variable" != e || Ct.stream.match(/^\s*:/, !1) ? ("variable" == e && (Ct.marked = "property"), p(w(":"), U, G)) : (m(t), p(G))
				}

				function G(e, t) {
					return "=" == t ? p(k) : void 0
				}

				function $(e) {
					return "," == e ? p(q) : void 0
				}

				function K(e, t) {
					return "keyword b" == e && "else" == t ? p(b("form"), _, y) : void 0
				}

				function Y(e) {
					return "(" == e ? p(b(")"), X, w(")"), y) : void 0
				}

				function X(e) {
					return "var" == e ? p(q, w(";"), Z) : ";" == e ? p(Z) : "variable" == e ? p(J) : h(x, w(";"), Z)
				}

				function J(e, t) {
					return "in" == t || "of" == t ? (Ct.marked = "keyword", p(x)) : p(E, Z)
				}

				function Z(e, t) {
					return ";" == e ? p(Q) : "in" == t || "of" == t ? (Ct.marked = "keyword", p(x)) : h(x, w(";"), Q)
				}

				function Q(e) {
					")" != e && p(x)
				}

				function et(e, t) {
					return "*" == t ? (Ct.marked = "keyword", p(et)) : "variable" == e ? (m(t), p(et)) : "(" == e ? p(g, b(")"), I(tt, ")"), y, _, v) : void 0
				}

				function tt(e) {
					return "spread" == e ? p(tt) : h(U, W)
				}

				function nt(e, t) {
					return "variable" == e ? (m(t), p(rt)) : void 0
				}

				function rt(e, t) {
					return "extends" == t ? p(x) : void 0
				}

				function it(e) {
					return "{" == e ? z(F, "}") : void 0
				}

				function ot(e, t) {
					return "string" == e ? p(_) : "variable" == e ? (m(t), p(ut)) : void 0
				}

				function at(e, t) {
					return "*" == t ? (Ct.marked = "keyword", p(ut, w(";"))) : "default" == t ? (Ct.marked = "keyword", p(x, w(";"))) : h(_)
				}

				function st(e) {
					return "string" == e ? p() : h(lt, ut)
				}

				function lt(e, t) {
					return "{" == e ? z(lt, "}") : ("variable" == e && m(t), p())
				}

				function ut(e, t) {
					return "from" == t ? (Ct.marked = "keyword", p(x)) : void 0
				}

				function ct(e) {
					return "]" == e ? p() : h(k, ft)
				}

				function ft(e) {
					return "for" == e ? h(dt, w("]")) : "," == e ? p(I(k, "]")) : h(I(k, "]"))
				}

				function dt(e) {
					return "for" == e ? p(Y, dt) : "if" == e ? p(x, dt) : void 0
				}

				var ht, pt, mt = e.indentUnit, gt = t.statementIndent, vt = t.jsonld, bt = t.json || vt, yt = t.typescript,
					wt = function () {
						function e(e) {
							return {type: e, style: "keyword"}
						}

						var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("operator"),
							o = {type: "atom", style: "atom"}, a = {
								"if": e("if"),
								"while": t,
								"with": t,
								"else": n,
								"do": n,
								"try": n,
								"finally": n,
								"return": r,
								"break": r,
								"continue": r,
								"new": r,
								"delete": r,
								"throw": r,
								"debugger": r,
								"var": e("var"),
								"const": e("var"),
								let: e("var"),
								"function": e("function"),
								"catch": e("catch"),
								"for": e("for"),
								"switch": e("switch"),
								"case": e("case"),
								"default": e("default"),
								"in": i,
								"typeof": i,
								"instanceof": i,
								"true": o,
								"false": o,
								"null": o,
								undefined: o,
								NaN: o,
								Infinity: o,
								"this": e("this"),
								module: e("module"),
								"class": e("class"),
								"super": e("atom"),
								yield: r,
								"export": e("export"),
								"import": e("import"),
								"extends": r
							};
						if (yt) {
							var s = {type: "variable", style: "variable-3"}, l = {
								"interface": e("interface"),
								"extends": e("extends"),
								constructor: e("constructor"),
								"public": e("public"),
								"private": e("private"),
								"protected": e("protected"),
								"static": e("static"),
								string: s,
								number: s,
								bool: s,
								any: s
							};
							for (var u in l) a[u] = l[u]
						}
						return a
					}(), _t = /[+\-*&%=<>!?|~^]/,
					xt = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,
					kt = "([{}])",
					St = {atom: !0, number: !0, variable: !0, string: !0, regexp: !0, "this": !0, "jsonld-keyword": !0},
					Ct = {state: null, column: null, marked: null, cc: null},
					At = {name: "this", next: {name: "arguments"}};
				return y.lex = !0, {
					startState: function (e) {
						var n = {
							tokenize: o,
							lastType: "sof",
							cc: [],
							lexical: new c((e || 0) - mt, 0, "block", !1),
							localVars: t.localVars,
							context: t.localVars && {vars: t.localVars},
							indented: 0
						};
						return t.globalVars && (n.globalVars = t.globalVars), n
					},
					token: function (e, t) {
						if (e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation(), u(e, t)), t.tokenize != s && e.eatSpace()) return null;
						var n = t.tokenize(e, t);
						return "comment" == ht ? n : (t.lastType = "operator" != ht || "++" != pt && "--" != pt ? ht : "incdec", d(t, n, ht, pt, e))
					},
					indent: function (e, r) {
						if (e.tokenize == s) return n.Pass;
						if (e.tokenize != o) return 0;
						for (var i = r && r.charAt(0), a = e.lexical, l = e.cc.length - 1; l >= 0; --l) {
							var u = e.cc[l];
							if (u == y) a = a.prev; else if (u != K) break
						}
						"stat" == a.type && "}" == i && (a = a.prev), gt && ")" == a.type && "stat" == a.prev.type && (a = a.prev);
						var c = a.type, f = i == c;
						return "vardef" == c ? a.indented + ("operator" == e.lastType || "," == e.lastType ? a.info + 1 : 0) : "form" == c && "{" == i ? a.indented : "form" == c ? a.indented + mt : "stat" == c ? a.indented + ("operator" == e.lastType || "," == e.lastType ? gt || mt : 0) : "switch" != a.info || f || 0 == t.doubleIndentSwitch ? a.align ? a.column + (f ? 0 : 1) : a.indented + (f ? 0 : mt) : a.indented + (/^(?:case|default)\b/.test(r) ? mt : 2 * mt)
					},
					electricChars: ":{}",
					blockCommentStart: bt ? null : "/*",
					blockCommentEnd: bt ? null : "*/",
					lineComment: bt ? null : "//",
					fold: "brace",
					helperType: bt ? "json" : "javascript",
					jsonldMode: vt,
					jsonMode: bt
				}
			}), n.defineMIME("text/javascript", "javascript"), n.defineMIME("text/ecmascript", "javascript"), n.defineMIME("application/javascript", "javascript"), n.defineMIME("application/ecmascript", "javascript"), n.defineMIME("application/json", {
				name: "javascript",
				json: !0
			}), n.defineMIME("application/x-json", {
				name: "javascript",
				json: !0
			}), n.defineMIME("application/ld+json", {
				name: "javascript",
				jsonld: !0
			}), n.defineMIME("text/typescript", {
				name: "javascript",
				typescript: !0
			}), n.defineMIME("application/typescript", {name: "javascript", typescript: !0})
		}, {"code-mirror": 18}], 22: [function (e, t) {
			var n = t.exports = e("code-mirror");
			n.defineMode("xml", function (e, t) {
				function r(e, t) {
					function n(n) {
						return t.tokenize = n, n(e, t)
					}

					var r = e.next();
					if ("<" == r) {
						if (e.eat("!")) return e.eat("[") ? e.match("CDATA[") ? n(a("atom", "]]>")) : null : e.match("--") ? n(a("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(s(1))) : null;
						if (e.eat("?")) return e.eatWhile(/[\w\._\-]/), t.tokenize = a("meta", "?>"), "meta";
						var o = e.eat("/");
						_ = "";
						for (var l; l = e.eat(/[^\s\u00a0=<>\"\'\/?]/);) _ += l;
						return _ ? (x = o ? "closeTag" : "openTag", t.tokenize = i, "tag") : "tag error"
					}
					if ("&" == r) {
						var u;
						return u = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), u ? "atom" : "error"
					}
					return e.eatWhile(/[^&<]/), null
				}

				function i(e, t) {
					var n = e.next();
					if (">" == n || "/" == n && e.eat(">")) return t.tokenize = r, x = ">" == n ? "endTag" : "selfcloseTag", "tag";
					if ("=" == n) return x = "equals", null;
					if ("<" == n) {
						t.tokenize = r, t.state = f, t.tagName = t.tagStart = null;
						var i = t.tokenize(e, t);
						return i ? i + " error" : "error"
					}
					return /[\'\"]/.test(n) ? (t.tokenize = o(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.eatWhile(/[^\s\u00a0=<>\"\']/), "word")
				}

				function o(e) {
					var t = function (t, n) {
						for (; !t.eol();) if (t.next() == e) {
							n.tokenize = i;
							break
						}
						return "string"
					};
					return t.isInAttribute = !0, t
				}

				function a(e, t) {
					return function (n, i) {
						for (; !n.eol();) {
							if (n.match(t)) {
								i.tokenize = r;
								break
							}
							n.next()
						}
						return e
					}
				}

				function s(e) {
					return function (t, n) {
						for (var i; null != (i = t.next());) {
							if ("<" == i) return n.tokenize = s(e + 1), n.tokenize(t, n);
							if (">" == i) {
								if (1 == e) {
									n.tokenize = r;
									break
								}
								return n.tokenize = s(e - 1), n.tokenize(t, n)
							}
						}
						return "meta"
					}
				}

				function l(e, t, n) {
					this.prev = e.context, this.tagName = t, this.indent = e.indented, this.startOfLine = n, (S.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
				}

				function u(e) {
					e.context && (e.context = e.context.prev)
				}

				function c(e, t) {
					for (var n; ;) {
						if (!e.context) return;
						if (n = e.context.tagName.toLowerCase(), !S.contextGrabbers.hasOwnProperty(n) || !S.contextGrabbers[n].hasOwnProperty(t)) return;
						u(e)
					}
				}

				function f(e, t, n) {
					if ("openTag" == e) return n.tagName = _, n.tagStart = t.column(), p;
					if ("closeTag" == e) {
						var r = !1;
						return n.context ? n.context.tagName != _ && (S.implicitlyClosed.hasOwnProperty(n.context.tagName.toLowerCase()) && u(n), r = !n.context || n.context.tagName != _) : r = !0, r && (k = "error"), r ? h : d
					}
					return f
				}

				function d(e, t, n) {
					return "endTag" != e ? (k = "error", d) : (u(n), f)
				}

				function h(e, t, n) {
					return k = "error", d(e, t, n)
				}

				function p(e, t, n) {
					if ("word" == e) return k = "attribute", m;
					if ("endTag" == e || "selfcloseTag" == e) {
						var r = n.tagName, i = n.tagStart;
						return n.tagName = n.tagStart = null, "selfcloseTag" == e || S.autoSelfClosers.hasOwnProperty(r.toLowerCase()) ? c(n, r.toLowerCase()) : (c(n, r.toLowerCase()), n.context = new l(n, r, i == n.indented)), f
					}
					return k = "error", p
				}

				function m(e, t, n) {
					return "equals" == e ? g : (S.allowMissing || (k = "error"), p(e, t, n))
				}

				function g(e, t, n) {
					return "string" == e ? v : "word" == e && S.allowUnquoted ? (k = "string", p) : (k = "error", p(e, t, n))
				}

				function v(e, t, n) {
					return "string" == e ? v : p(e, t, n)
				}

				var b = e.indentUnit, y = t.multilineTagIndentFactor || 1, w = t.multilineTagIndentPastTag;
				null == w && (w = !0);
				var _, x, k, S = t.htmlMode ? {
					autoSelfClosers: {
						area: !0,
						base: !0,
						br: !0,
						col: !0,
						command: !0,
						embed: !0,
						frame: !0,
						hr: !0,
						img: !0,
						input: !0,
						keygen: !0,
						link: !0,
						meta: !0,
						param: !0,
						source: !0,
						track: !0,
						wbr: !0
					},
					implicitlyClosed: {
						dd: !0,
						li: !0,
						optgroup: !0,
						option: !0,
						p: !0,
						rp: !0,
						rt: !0,
						tbody: !0,
						td: !0,
						tfoot: !0,
						th: !0,
						tr: !0
					},
					contextGrabbers: {
						dd: {dd: !0, dt: !0},
						dt: {dd: !0, dt: !0},
						li: {li: !0},
						option: {option: !0, optgroup: !0},
						optgroup: {optgroup: !0},
						p: {
							address: !0,
							article: !0,
							aside: !0,
							blockquote: !0,
							dir: !0,
							div: !0,
							dl: !0,
							fieldset: !0,
							footer: !0,
							form: !0,
							h1: !0,
							h2: !0,
							h3: !0,
							h4: !0,
							h5: !0,
							h6: !0,
							header: !0,
							hgroup: !0,
							hr: !0,
							menu: !0,
							nav: !0,
							ol: !0,
							p: !0,
							pre: !0,
							section: !0,
							table: !0,
							ul: !0
						},
						rp: {rp: !0, rt: !0},
						rt: {rp: !0, rt: !0},
						tbody: {tbody: !0, tfoot: !0},
						td: {td: !0, th: !0},
						tfoot: {tbody: !0},
						th: {td: !0, th: !0},
						thead: {tbody: !0, tfoot: !0},
						tr: {tr: !0}
					},
					doNotIndent: {pre: !0},
					allowUnquoted: !0,
					allowMissing: !0
				} : {
					autoSelfClosers: {},
					implicitlyClosed: {},
					contextGrabbers: {},
					doNotIndent: {},
					allowUnquoted: !1,
					allowMissing: !1
				}, C = t.alignCDATA;
				return {
					startState: function () {
						return {tokenize: r, state: f, indented: 0, tagName: null, tagStart: null, context: null}
					},
					token: function (e, t) {
						if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
						_ = x = null;
						var n = t.tokenize(e, t);
						return (n || x) && "comment" != n && (k = null, t.state = t.state(x || n, e, t), k && (n = "error" == k ? n + " error" : k)), n
					},
					indent: function (e, t, o) {
						var a = e.context;
						if (e.tokenize.isInAttribute) return e.stringStartCol + 1;
						if (a && a.noIndent) return n.Pass;
						if (e.tokenize != i && e.tokenize != r) return o ? o.match(/^(\s*)/)[0].length : 0;
						if (e.tagName) return w ? e.tagStart + e.tagName.length + 2 : e.tagStart + b * y;
						if (C && /<!\[CDATA\[/.test(t)) return 0;
						for (a && /^<\//.test(t) && (a = a.prev); a && !a.startOfLine;) a = a.prev;
						return a ? a.indent + b : 0
					},
					electricChars: "/",
					blockCommentStart: "<!--",
					blockCommentEnd: "-->",
					configuration: t.htmlMode ? "html" : "xml",
					helperType: t.htmlMode ? "html" : "xml"
				}
			}), n.defineMIME("text/xml", "xml"), n.defineMIME("application/xml", "xml"), n.mimeModes.hasOwnProperty("text/html") || n.defineMIME("text/html", {
				name: "xml",
				htmlMode: !0
			})
		}, {"code-mirror": 18}], 23: [function (e, t) {
			function n(e) {
				this._cbs = e || {}, this.events = []
			}

			t.exports = n;
			var r = e("./").EVENTS;
			Object.keys(r).forEach(function (e) {
				if (0 === r[e]) e = "on" + e, n.prototype[e] = function () {
					this.events.push([e]), this._cbs[e] && this._cbs[e]()
				}; else if (1 === r[e]) e = "on" + e, n.prototype[e] = function (t) {
					this.events.push([e, t]), this._cbs[e] && this._cbs[e](t)
				}; else {
					if (2 !== r[e]) throw Error("wrong number of arguments");
					e = "on" + e, n.prototype[e] = function (t, n) {
						this.events.push([e, t, n]), this._cbs[e] && this._cbs[e](t, n)
					}
				}
			}), n.prototype.onreset = function () {
				this.events = [], this._cbs.onreset && this._cbs.onreset()
			}, n.prototype.restart = function () {
				this._cbs.onreset && this._cbs.onreset();
				for (var e = 0, t = this.events.length; t > e; e++) if (this._cbs[this.events[e][0]]) {
					var n = this.events[e].length;
					1 === n ? this._cbs[this.events[e][0]]() : 2 === n ? this._cbs[this.events[e][0]](this.events[e][1]) : this._cbs[this.events[e][0]](this.events[e][1], this.events[e][2])
				}
			}
		}, {"./": 34}], 24: [function (e, t) {
			function n(e, t) {
				this.init(e, t)
			}

			function r(e, t) {
				return u.getElementsByTagName(e, t, !0)
			}

			function i(e, t) {
				return u.getElementsByTagName(e, t, !0, 1)[0]
			}

			function o(e, t, n) {
				return u.getText(u.getElementsByTagName(e, t, n, 1)).trim()
			}

			function a(e, t, n, r, i) {
				var a = o(n, r, i);
				a && (e[t] = a)
			}

			var s = e("./index.js"), l = s.DomHandler, u = s.DomUtils;
			e("util").inherits(n, l), n.prototype.init = l;
			var c = function (e) {
				return "rss" === e || "feed" === e || "rdf:RDF" === e
			};
			n.prototype.onend = function () {
				var e, t, n = {}, s = i(c, this.dom);
				s && ("feed" === s.name ? (t = s.children, n.type = "atom", a(n, "id", "id", t), a(n, "title", "title", t), (e = i("link", t)) && (e = e.attribs) && (e = e.href) && (n.link = e), a(n, "description", "subtitle", t), (e = o("updated", t)) && (n.updated = new Date(e)), a(n, "author", "email", t, !0), n.items = r("entry", t).map(function (e) {
					var t, n = {};
					return e = e.children, a(n, "id", "id", e), a(n, "title", "title", e), (t = i("link", e)) && (t = t.attribs) && (t = t.href) && (n.link = t), a(n, "description", "summary", e), (t = o("updated", e)) && (n.pubDate = new Date(t)), n
				})) : (t = i("channel", s.children).children, n.type = s.name.substr(0, 3), n.id = "", a(n, "title", "title", t), a(n, "link", "link", t), a(n, "description", "description", t), (e = o("lastBuildDate", t)) && (n.updated = new Date(e)), a(n, "author", "managingEditor", t, !0), n.items = r("item", s.children).map(function (e) {
					var t, n = {};
					return e = e.children, a(n, "id", "guid", e), a(n, "title", "title", e), a(n, "link", "link", e), a(n, "description", "description", e), (t = o("pubDate", e)) && (n.pubDate = new Date(t)), n
				}))), this.dom = n, l.prototype._handleCallback.call(this, s ? null : Error("couldn't find root of feed"))
			}, t.exports = n
		}, {"./index.js": 34, util: 17}], 25: [function (e, t) {
			function n(e, t) {
				this._options = t || {}, this._cbs = e || {}, this._tagname = "", this._attribname = "", this._attribvalue = "", this._attribs = null, this._stack = [], this._done = !1, this.startIndex = 0, this.endIndex = null, this._lowerCaseTagNames = "lowerCaseTags" in this._options ? !!this._options.lowerCaseTags : !this._options.xmlMode, this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ? !!this._options.lowerCaseAttributeNames : !this._options.xmlMode, this._tokenizer = new r(this._options, this)
			}

			var r = e("./Tokenizer.js"),
				i = {input: !0, option: !0, optgroup: !0, select: !0, button: !0, datalist: !0, textarea: !0}, o = {
					tr: {tr: !0, th: !0, td: !0},
					th: {th: !0},
					td: {thead: !0, td: !0},
					body: {head: !0, link: !0, script: !0},
					li: {li: !0},
					p: {p: !0},
					select: i,
					input: i,
					output: i,
					button: i,
					datalist: i,
					textarea: i,
					option: {option: !0},
					optgroup: {optgroup: !0}
				}, a = {
					__proto__: null,
					area: !0,
					base: !0,
					basefont: !0,
					br: !0,
					col: !0,
					command: !0,
					embed: !0,
					frame: !0,
					hr: !0,
					img: !0,
					input: !0,
					isindex: !0,
					keygen: !0,
					link: !0,
					meta: !0,
					param: !0,
					source: !0,
					track: !0,
					wbr: !0,
					path: !0,
					circle: !0,
					ellipse: !0,
					line: !0,
					rect: !0,
					use: !0
				}, s = /\s|\//;
			e("util").inherits(n, e("events").EventEmitter), n.prototype._updatePosition = function (e) {
				this.startIndex = null === this.endIndex ? this._tokenizer._sectionStart <= e ? 0 : this._tokenizer._sectionStart - e : this.endIndex + 1, this.endIndex = this._tokenizer._index
			}, n.prototype.ontext = function (e) {
				this._updatePosition(1), this.endIndex--, this._cbs.ontext && this._cbs.ontext(e)
			}, n.prototype.onopentagname = function (e) {
				if (this._lowerCaseTagNames && (e = e.toLowerCase()), this._tagname = e, !this._options.xmlMode && e in o) for (var t; (t = this._stack[this._stack.length - 1]) in o[e]; this.onclosetag(t)) ;
				!this._options.xmlMode && e in a || this._stack.push(e), this._cbs.onopentagname && this._cbs.onopentagname(e), this._cbs.onopentag && (this._attribs = {})
			}, n.prototype.onopentagend = function () {
				this._updatePosition(1), this._attribs && (this._cbs.onopentag && this._cbs.onopentag(this._tagname, this._attribs), this._attribs = null), !this._options.xmlMode && this._cbs.onclosetag && this._tagname in a && this._cbs.onclosetag(this._tagname), this._tagname = ""
			}, n.prototype.onclosetag = function (e) {
				if (this._updatePosition(1), this._lowerCaseTagNames && (e = e.toLowerCase()), !this._stack.length || e in a && !this._options.xmlMode) this._options.xmlMode || "br" !== e && "p" !== e || (this.onopentagname(e), this._closeCurrentTag()); else {
					var t = this._stack.lastIndexOf(e);
					if (-1 !== t) if (this._cbs.onclosetag) for (t = this._stack.length - t; t--;) this._cbs.onclosetag(this._stack.pop()); else this._stack.length = t; else "p" !== e || this._options.xmlMode || (this.onopentagname(e), this._closeCurrentTag())
				}
			}, n.prototype.onselfclosingtag = function () {
				this._options.xmlMode || this._options.recognizeSelfClosing ? this._closeCurrentTag() : this.onopentagend()
			}, n.prototype._closeCurrentTag = function () {
				var e = this._tagname;
				this.onopentagend(), this._stack[this._stack.length - 1] === e && (this._cbs.onclosetag && this._cbs.onclosetag(e), this._stack.pop())
			}, n.prototype.onattribname = function (e) {
				this._lowerCaseAttributeNames && (e = e.toLowerCase()), this._attribname = e
			}, n.prototype.onattribdata = function (e) {
				this._attribvalue += e
			}, n.prototype.onattribend = function () {
				this._cbs.onattribute && this._cbs.onattribute(this._attribname, this._attribvalue), this._attribs && !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname) && (this._attribs[this._attribname] = this._attribvalue), this._attribname = "", this._attribvalue = ""
			}, n.prototype.ondeclaration = function (e) {
				if (this._cbs.onprocessinginstruction) {
					var t = e.search(s), n = 0 > t ? e : e.substr(0, t);
					this._lowerCaseTagNames && (n = n.toLowerCase()), this._cbs.onprocessinginstruction("!" + n, "!" + e)
				}
			}, n.prototype.onprocessinginstruction = function (e) {
				if (this._cbs.onprocessinginstruction) {
					var t = e.search(s), n = 0 > t ? e : e.substr(0, t);
					this._lowerCaseTagNames && (n = n.toLowerCase()), this._cbs.onprocessinginstruction("?" + n, "?" + e)
				}
			}, n.prototype.oncomment = function (e) {
				this._updatePosition(4), this._cbs.oncomment && this._cbs.oncomment(e), this._cbs.oncommentend && this._cbs.oncommentend()
			}, n.prototype.oncdata = function (e) {
				this._updatePosition(1), this._options.xmlMode || this._options.recognizeCDATA ? (this._cbs.oncdatastart && this._cbs.oncdatastart(), this._cbs.ontext && this._cbs.ontext(e), this._cbs.oncdataend && this._cbs.oncdataend()) : this.oncomment("[CDATA[" + e + "]]")
			}, n.prototype.onerror = function (e) {
				this._cbs.onerror && this._cbs.onerror(e)
			}, n.prototype.onend = function () {
				if (this._cbs.onclosetag) for (var e = this._stack.length; e > 0; this._cbs.onclosetag(this._stack[--e])) ;
				this._cbs.onend && this._cbs.onend()
			}, n.prototype.reset = function () {
				this._cbs.onreset && this._cbs.onreset(), this._tokenizer.reset(), this._tagname = "", this._attribname = "", this._attribs = null, this._stack = [], this._done = !1
			}, n.prototype.parseComplete = function (e) {
				this.reset(), this.end(e)
			}, n.prototype.write = function (e) {
				this._done && this.onerror(Error(".write() after done!")), this._tokenizer.write(e)
			}, n.prototype.end = function (e) {
				this._done && this.onerror(Error(".end() after done!")), this._tokenizer.end(e), this._done = !0
			}, n.prototype.parseChunk = n.prototype.write, n.prototype.done = n.prototype.end, t.exports = n
		}, {"./Tokenizer.js": 28, events: 2, util: 17}], 26: [function (e, t) {
			t.exports = n;
			var n = function (e) {
				this._cbs = e || {}
			}, r = e("./").EVENTS;
			Object.keys(r).forEach(function (e) {
				if (0 === r[e]) e = "on" + e, n.prototype[e] = function () {
					this._cbs[e] && this._cbs[e]()
				}; else if (1 === r[e]) e = "on" + e, n.prototype[e] = function (t) {
					this._cbs[e] && this._cbs[e](t)
				}; else {
					if (2 !== r[e]) throw Error("wrong number of arguments");
					e = "on" + e, n.prototype[e] = function (t, n) {
						this._cbs[e] && this._cbs[e](t, n)
					}
				}
			})
		}, {"./": 34}], 27: [function (e, t) {
			function n(e) {
				i.call(this, new r(this), e)
			}

			function r(e) {
				this.scope = e
			}

			t.exports = n;
			var i = e("./WritableStream.js");
			e("util").inherits(n, i), n.prototype.readable = !0;
			var o = e("../").EVENTS;
			Object.keys(o).forEach(function (e) {
				if (0 === o[e]) r.prototype["on" + e] = function () {
					this.scope.emit(e)
				}; else if (1 === o[e]) r.prototype["on" + e] = function (t) {
					this.scope.emit(e, t)
				}; else {
					if (2 !== o[e]) throw Error("wrong number of arguments!");
					r.prototype["on" + e] = function (t, n) {
						this.scope.emit(e, t, n)
					}
				}
			})
		}, {"../": 34, "./WritableStream.js": 29, util: 17}], 28: [function (e, t) {
			function n(e) {
				return " " === e || "\n" === e || "	" === e || "\f" === e || "\r" === e
			}

			function r(e, t, n) {
				var r = e.toLowerCase();
				return e === r ? function (e) {
					this._state = e === r ? t : n
				} : function (i) {
					this._state = i === r || i === e ? t : n
				}
			}

			function i(e, t) {
				var n = e.toLowerCase();
				return function (r) {
					r === n || r === e ? this._state = t : (this._state = p, this._index--)
				}
			}

			function o(e, t) {
				this._state = d, this._buffer = "", this._sectionStart = 0, this._index = 0, this._baseState = d, this._special = pt, this._cbs = t, this._running = !0, this._xmlMode = !(!e || !e.xmlMode), this._decodeEntities = !(!e || !e.decodeEntities)
			}

			function a(e) {
				var t = "";
				return e >= 55296 && 57343 >= e || e > 1114111 ? "�" : (e in c && (e = c[e]), e > 65535 && (e -= 65536, t += String.fromCharCode(55296 | 1023 & e >>> 10), e = 56320 | 1023 & e), t += String.fromCharCode(e))
			}

			t.exports = o;
			var s = e("./entities/entities.json"), l = e("./entities/legacy.json"), u = e("./entities/xml.json"),
				c = e("./entities/decode.json"), f = 0, d = f++, h = f++, p = f++, m = f++, g = f++, v = f++, b = f++,
				y = f++, w = f++, _ = f++, x = f++, k = f++, S = f++, C = f++, A = f++, E = f++, L = f++, T = f++, D = f++,
				M = f++, N = f++, B = f++, O = f++, F = f++, H = f++, j = f++, I = f++, z = f++, R = f++, W = f++, P = f++,
				q = f++, U = f++, V = f++, G = f++, $ = f++, K = f++, Y = f++, X = f++, J = f++, Z = f++, Q = f++, et = f++,
				tt = f++, nt = f++, rt = f++, it = f++, ot = f++, at = f++, st = f++, lt = f++, ut = f++, ct = f++,
				ft = f++, dt = f++, ht = 0, pt = ht++, mt = ht++, gt = ht++;
			o.prototype._stateText = function (e) {
				"<" === e ? (this._index > this._sectionStart && this._cbs.ontext(this._getSection()), this._state = h, this._sectionStart = this._index) : this._decodeEntities && this._special === pt && "&" === e && (this._index > this._sectionStart && this._cbs.ontext(this._getSection()), this._baseState = d, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateBeforeTagName = function (e) {
				"/" === e ? this._state = g : ">" === e || this._special !== pt || n(e) ? this._state = d : "!" === e ? (this._state = A, this._sectionStart = this._index + 1) : "?" === e ? (this._state = L, this._sectionStart = this._index + 1) : "<" === e ? (this._cbs.ontext(this._getSection()), this._sectionStart = this._index) : (this._state = this._xmlMode || "s" !== e && "S" !== e ? p : P, this._sectionStart = this._index)
			}, o.prototype._stateInTagName = function (e) {
				("/" === e || ">" === e || n(e)) && (this._emitToken("onopentagname"), this._state = y, this._index--)
			}, o.prototype._stateBeforeCloseingTagName = function (e) {
				n(e) || (">" === e ? this._state = d : this._special !== pt ? "s" === e || "S" === e ? this._state = q : (this._state = d, this._index--) : (this._state = v, this._sectionStart = this._index))
			}, o.prototype._stateInCloseingTagName = function (e) {
				(">" === e || n(e)) && (this._emitToken("onclosetag"), this._state = b, this._index--)
			}, o.prototype._stateAfterCloseingTagName = function (e) {
				">" === e && (this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateBeforeAttributeName = function (e) {
				">" === e ? (this._cbs.onopentagend(), this._state = d, this._sectionStart = this._index + 1) : "/" === e ? this._state = m : n(e) || (this._state = w, this._sectionStart = this._index)
			}, o.prototype._stateInSelfClosingTag = function (e) {
				">" === e ? (this._cbs.onselfclosingtag(), this._state = d, this._sectionStart = this._index + 1) : n(e) || (this._state = y, this._index--)
			}, o.prototype._stateInAttributeName = function (e) {
				("=" === e || "/" === e || ">" === e || n(e)) && (this._index > this._sectionStart && this._cbs.onattribname(this._getSection()), this._sectionStart = -1, this._state = _, this._index--)
			}, o.prototype._stateAfterAttributeName = function (e) {
				"=" === e ? this._state = x : "/" === e || ">" === e ? (this._cbs.onattribend(), this._state = y, this._index--) : n(e) || (this._cbs.onattribend(), this._state = w, this._sectionStart = this._index)
			}, o.prototype._stateBeforeAttributeValue = function (e) {
				'"' === e ? (this._state = k, this._sectionStart = this._index + 1) : "'" === e ? (this._state = S, this._sectionStart = this._index + 1) : n(e) || (this._state = C, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueDoubleQuotes = function (e) {
				'"' === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueSingleQuotes = function (e) {
				"'" === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateInAttributeValueNoQuotes = function (e) {
				n(e) || ">" === e ? (this._emitToken("onattribdata"), this._cbs.onattribend(), this._state = y, this._index--) : this._decodeEntities && "&" === e && (this._emitToken("onattribdata"), this._baseState = this._state, this._state = lt, this._sectionStart = this._index)
			}, o.prototype._stateBeforeDeclaration = function (e) {
				this._state = "[" === e ? B : "-" === e ? T : E
			}, o.prototype._stateInDeclaration = function (e) {
				">" === e && (this._cbs.ondeclaration(this._getSection()), this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateInProcessingInstruction = function (e) {
				">" === e && (this._cbs.onprocessinginstruction(this._getSection()), this._state = d, this._sectionStart = this._index + 1)
			}, o.prototype._stateBeforeComment = function (e) {
				"-" === e ? (this._state = D, this._sectionStart = this._index + 1) : this._state = E
			}, o.prototype._stateInComment = function (e) {
				"-" === e && (this._state = M)
			}, o.prototype._stateAfterComment1 = r("-", N, D), o.prototype._stateAfterComment2 = function (e) {
				">" === e ? (this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2)), this._state = d, this._sectionStart = this._index + 1) : "-" !== e && (this._state = D)
			}, o.prototype._stateBeforeCdata1 = r("C", O, E), o.prototype._stateBeforeCdata2 = r("D", F, E), o.prototype._stateBeforeCdata3 = r("A", H, E), o.prototype._stateBeforeCdata4 = r("T", j, E), o.prototype._stateBeforeCdata5 = r("A", I, E), o.prototype._stateBeforeCdata6 = function (e) {
				"[" === e ? (this._state = z, this._sectionStart = this._index + 1) : this._state = E
			}, o.prototype._stateInCdata = function (e) {
				"]" === e && (this._state = R)
			}, o.prototype._stateAfterCdata1 = r("]", W, z), o.prototype._stateAfterCdata2 = function (e) {
				">" === e ? (this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2)), this._state = d, this._sectionStart = this._index + 1) : "]" !== e && (this._state = z)
			}, o.prototype._stateBeforeSpecial = function (e) {
				"c" === e || "C" === e ? this._state = U : "t" === e || "T" === e ? this._state = et : (this._state = p, this._index--)
			}, o.prototype._stateBeforeSpecialEnd = function (e) {
				this._state = this._special !== mt || "c" !== e && "C" !== e ? this._special !== gt || "t" !== e && "T" !== e ? d : it : Y
			}, o.prototype._stateBeforeScript1 = i("R", V), o.prototype._stateBeforeScript2 = i("I", G), o.prototype._stateBeforeScript3 = i("P", $), o.prototype._stateBeforeScript4 = i("T", K), o.prototype._stateBeforeScript5 = function (e) {
				("/" === e || ">" === e || n(e)) && (this._special = mt), this._state = p, this._index--
			}, o.prototype._stateAfterScript1 = r("R", X, d), o.prototype._stateAfterScript2 = r("I", J, d), o.prototype._stateAfterScript3 = r("P", Z, d), o.prototype._stateAfterScript4 = r("T", Q, d), o.prototype._stateAfterScript5 = function (e) {
				">" === e || n(e) ? (this._special = pt, this._state = v, this._sectionStart = this._index - 6, this._index--) : this._state = d
			}, o.prototype._stateBeforeStyle1 = i("Y", tt), o.prototype._stateBeforeStyle2 = i("L", nt), o.prototype._stateBeforeStyle3 = i("E", rt), o.prototype._stateBeforeStyle4 = function (e) {
				("/" === e || ">" === e || n(e)) && (this._special = gt), this._state = p, this._index--
			}, o.prototype._stateAfterStyle1 = r("Y", ot, d), o.prototype._stateAfterStyle2 = r("L", at, d), o.prototype._stateAfterStyle3 = r("E", st, d), o.prototype._stateAfterStyle4 = function (e) {
				">" === e || n(e) ? (this._special = pt, this._state = v, this._sectionStart = this._index - 5, this._index--) : this._state = d
			}, o.prototype._stateBeforeEntity = r("#", ut, ct), o.prototype._stateBeforeNumericEntity = r("X", dt, ft), o.prototype._parseNamedEntityStrict = function () {
				if (this._sectionStart + 1 < this._index) {
					var e = this._buffer.substring(this._sectionStart + 1, this._index), t = this._xmlMode ? u : s;
					t.hasOwnProperty(e) && (this._emitPartial(t[e]), this._sectionStart = this._index + 1)
				}
			}, o.prototype._parseLegacyEntity = function () {
				var e = this._sectionStart + 1, t = this._index - e;
				for (t > 6 && (t = 6); t >= 2;) {
					var n = this._buffer.substr(e, t);
					if (l.hasOwnProperty(n)) return this._emitPartial(l[n]), this._sectionStart += t + 2, void 0;
					t--
				}
				this._sectionStart -= 1
			}, o.prototype._stateInNamedEntity = function (e) {
				";" === e ? (this._parseNamedEntityStrict(), this._sectionStart + 1 < this._index && !this._xmlMode && this._parseLegacyEntity(), this._state = this._baseState) : ("a" > e || e > "z") && ("A" > e || e > "Z") && ("0" > e || e > "9") && (this._xmlMode || (this._baseState !== d ? "=" !== e && (this._parseNamedEntityStrict(), this._sectionStart--) : (this._parseLegacyEntity(), this._sectionStart--)), this._state = this._baseState, this._index--)
			}, o.prototype._decodeNumericEntity = function (e, t) {
				var n = this._sectionStart + e;
				if (n !== this._index) {
					var r = this._buffer.substring(n, this._index), i = parseInt(r, t);
					i === i && (this._emitPartial(a(i)), this._sectionStart = this._index)
				}
				this._state = this._baseState
			}, o.prototype._stateInNumericEntity = function (e) {
				";" === e ? (this._decodeNumericEntity(2, 10), this._sectionStart++) : ("0" > e || e > "9") && (this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(2, 10), this._index--)
			}, o.prototype._stateInHexEntity = function (e) {
				";" === e ? (this._decodeNumericEntity(3, 16), this._sectionStart++) : ("a" > e || e > "f") && ("A" > e || e > "F") && ("0" > e || e > "9") && (this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(3, 16), this._index--)
			}, o.prototype._cleanup = function () {
				this._sectionStart < 0 ? (this._buffer = "", this._index = 0) : (this._state === d ? (this._sectionStart !== this._index && this._cbs.ontext(this._buffer.substr(this._sectionStart)), this._buffer = "", this._index = 0) : this._sectionStart === this._index ? (this._buffer = "", this._index = 0) : (this._buffer = this._buffer.substr(this._sectionStart), this._index -= this._sectionStart), this._sectionStart = 0)
			}, o.prototype.write = function (e) {
				for (this._buffer += e; this._index < this._buffer.length && this._running;) {
					var t = this._buffer.charAt(this._index);
					this._state === d ? this._stateText(t) : this._state === h ? this._stateBeforeTagName(t) : this._state === p ? this._stateInTagName(t) : this._state === g ? this._stateBeforeCloseingTagName(t) : this._state === v ? this._stateInCloseingTagName(t) : this._state === b ? this._stateAfterCloseingTagName(t) : this._state === m ? this._stateInSelfClosingTag(t) : this._state === y ? this._stateBeforeAttributeName(t) : this._state === w ? this._stateInAttributeName(t) : this._state === _ ? this._stateAfterAttributeName(t) : this._state === x ? this._stateBeforeAttributeValue(t) : this._state === k ? this._stateInAttributeValueDoubleQuotes(t) : this._state === S ? this._stateInAttributeValueSingleQuotes(t) : this._state === C ? this._stateInAttributeValueNoQuotes(t) : this._state === A ? this._stateBeforeDeclaration(t) : this._state === E ? this._stateInDeclaration(t) : this._state === L ? this._stateInProcessingInstruction(t) : this._state === T ? this._stateBeforeComment(t) : this._state === D ? this._stateInComment(t) : this._state === M ? this._stateAfterComment1(t) : this._state === N ? this._stateAfterComment2(t) : this._state === B ? this._stateBeforeCdata1(t) : this._state === O ? this._stateBeforeCdata2(t) : this._state === F ? this._stateBeforeCdata3(t) : this._state === H ? this._stateBeforeCdata4(t) : this._state === j ? this._stateBeforeCdata5(t) : this._state === I ? this._stateBeforeCdata6(t) : this._state === z ? this._stateInCdata(t) : this._state === R ? this._stateAfterCdata1(t) : this._state === W ? this._stateAfterCdata2(t) : this._state === P ? this._stateBeforeSpecial(t) : this._state === q ? this._stateBeforeSpecialEnd(t) : this._state === U ? this._stateBeforeScript1(t) : this._state === V ? this._stateBeforeScript2(t) : this._state === G ? this._stateBeforeScript3(t) : this._state === $ ? this._stateBeforeScript4(t) : this._state === K ? this._stateBeforeScript5(t) : this._state === Y ? this._stateAfterScript1(t) : this._state === X ? this._stateAfterScript2(t) : this._state === J ? this._stateAfterScript3(t) : this._state === Z ? this._stateAfterScript4(t) : this._state === Q ? this._stateAfterScript5(t) : this._state === et ? this._stateBeforeStyle1(t) : this._state === tt ? this._stateBeforeStyle2(t) : this._state === nt ? this._stateBeforeStyle3(t) : this._state === rt ? this._stateBeforeStyle4(t) : this._state === it ? this._stateAfterStyle1(t) : this._state === ot ? this._stateAfterStyle2(t) : this._state === at ? this._stateAfterStyle3(t) : this._state === st ? this._stateAfterStyle4(t) : this._state === lt ? this._stateBeforeEntity(t) : this._state === ut ? this._stateBeforeNumericEntity(t) : this._state === ct ? this._stateInNamedEntity(t) : this._state === ft ? this._stateInNumericEntity(t) : this._state === dt ? this._stateInHexEntity(t) : this._cbs.onerror(Error("unknown _state"), this._state), this._index++
				}
				this._cleanup()
			}, o.prototype.pause = function () {
				this._running = !1
			}, o.prototype.resume = function () {
				this._running = !0
			}, o.prototype.end = function (e) {
				e && this.write(e), this._sectionStart < this._index && this._handleTrailingData(), this._cbs.onend()
			}, o.prototype._handleTrailingData = function () {
				var e = this._buffer.substr(this._sectionStart);
				this._state === z || this._state === R || this._state === W ? this._cbs.oncdata(e) : this._state === D || this._state === M || this._state === N ? this._cbs.oncomment(e) : this._state === p ? this._cbs.onopentagname(e) : this._state === y || this._state === x || this._state === _ ? this._cbs.onopentagend() : this._state === w ? this._cbs.onattribname(e) : this._state === S || this._state === k || this._state === C ? (this._cbs.onattribdata(e), this._cbs.onattribend()) : this._state === v ? this._cbs.onclosetag(e) : this._state !== ct || this._xmlMode ? this._state !== ft || this._xmlMode ? this._state !== dt || this._xmlMode ? this._cbs.ontext(e) : (this._decodeNumericEntity(3, 16), this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData())) : (this._decodeNumericEntity(2, 10), this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData())) : (this._parseLegacyEntity(), --this._sectionStart < this._index && (this._state = this._baseState, this._handleTrailingData()))
			}, o.prototype.reset = function () {
				o.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs)
			}, o.prototype._getSection = function () {
				return this._buffer.substring(this._sectionStart, this._index)
			}, o.prototype._emitToken = function (e) {
				this._cbs[e](this._getSection()), this._sectionStart = -1
			}, o.prototype._emitPartial = function (e) {
				this._baseState !== d ? this._cbs.onattribdata(e) : this._cbs.ontext(e)
			}
		}, {
			"./entities/decode.json": 30,
			"./entities/entities.json": 31,
			"./entities/legacy.json": 32,
			"./entities/xml.json": 33
		}], 29: [function (e, t) {
			function n(e, t) {
				var n = this._parser = new r(e, t);
				i.call(this, {decodeStrings: !1}), this.once("finish", function () {
					n.end()
				})
			}

			t.exports = n;
			var r = e("./Parser.js"), i = e("stream").Writable || e("readable-stream").Writable;
			e("util").inherits(n, i), i.prototype._write = function (e, t, n) {
				this._parser.write(e), n()
			}
		}, {"./Parser.js": 25, "readable-stream": 46, stream: 9, util: 17}], 30: [function (e, t) {
			t.exports = {
				0: "�",
				128: "€",
				130: "‚",
				131: "ƒ",
				132: "„",
				133: "…",
				134: "†",
				135: "‡",
				136: "ˆ",
				137: "‰",
				138: "Š",
				139: "‹",
				140: "Œ",
				142: "Ž",
				145: "‘",
				146: "’",
				147: "“",
				148: "”",
				149: "•",
				150: "–",
				151: "—",
				152: "˜",
				153: "™",
				154: "š",
				155: "›",
				156: "œ",
				158: "ž",
				159: "Ÿ"
			}
		}, {}], 31: [function (e, t) {
			t.exports = {
				Aacute: "Á",
				aacute: "á",
				Abreve: "Ă",
				abreve: "ă",
				ac: "∾",
				acd: "∿",
				acE: "∾̳",
				Acirc: "Â",
				acirc: "â",
				acute: "´",
				Acy: "А",
				acy: "а",
				AElig: "Æ",
				aelig: "æ",
				af: "⁡",
				Afr: "𝔄",
				afr: "𝔞",
				Agrave: "À",
				agrave: "à",
				alefsym: "ℵ",
				aleph: "ℵ",
				Alpha: "Α",
				alpha: "α",
				Amacr: "Ā",
				amacr: "ā",
				amalg: "⨿",
				amp: "&",
				AMP: "&",
				andand: "⩕",
				And: "⩓",
				and: "∧",
				andd: "⩜",
				andslope: "⩘",
				andv: "⩚",
				ang: "∠",
				ange: "⦤",
				angle: "∠",
				angmsdaa: "⦨",
				angmsdab: "⦩",
				angmsdac: "⦪",
				angmsdad: "⦫",
				angmsdae: "⦬",
				angmsdaf: "⦭",
				angmsdag: "⦮",
				angmsdah: "⦯",
				angmsd: "∡",
				angrt: "∟",
				angrtvb: "⊾",
				angrtvbd: "⦝",
				angsph: "∢",
				angst: "Å",
				angzarr: "⍼",
				Aogon: "Ą",
				aogon: "ą",
				Aopf: "𝔸",
				aopf: "𝕒",
				apacir: "⩯",
				ap: "≈",
				apE: "⩰",
				ape: "≊",
				apid: "≋",
				apos: "'",
				ApplyFunction: "⁡",
				approx: "≈",
				approxeq: "≊",
				Aring: "Å",
				aring: "å",
				Ascr: "𝒜",
				ascr: "𝒶",
				Assign: "≔",
				ast: "*",
				asymp: "≈",
				asympeq: "≍",
				Atilde: "Ã",
				atilde: "ã",
				Auml: "Ä",
				auml: "ä",
				awconint: "∳",
				awint: "⨑",
				backcong: "≌",
				backepsilon: "϶",
				backprime: "‵",
				backsim: "∽",
				backsimeq: "⋍",
				Backslash: "∖",
				Barv: "⫧",
				barvee: "⊽",
				barwed: "⌅",
				Barwed: "⌆",
				barwedge: "⌅",
				bbrk: "⎵",
				bbrktbrk: "⎶",
				bcong: "≌",
				Bcy: "Б",
				bcy: "б",
				bdquo: "„",
				becaus: "∵",
				because: "∵",
				Because: "∵",
				bemptyv: "⦰",
				bepsi: "϶",
				bernou: "ℬ",
				Bernoullis: "ℬ",
				Beta: "Β",
				beta: "β",
				beth: "ℶ",
				between: "≬",
				Bfr: "𝔅",
				bfr: "𝔟",
				bigcap: "⋂",
				bigcirc: "◯",
				bigcup: "⋃",
				bigodot: "⨀",
				bigoplus: "⨁",
				bigotimes: "⨂",
				bigsqcup: "⨆",
				bigstar: "★",
				bigtriangledown: "▽",
				bigtriangleup: "△",
				biguplus: "⨄",
				bigvee: "⋁",
				bigwedge: "⋀",
				bkarow: "⤍",
				blacklozenge: "⧫",
				blacksquare: "▪",
				blacktriangle: "▴",
				blacktriangledown: "▾",
				blacktriangleleft: "◂",
				blacktriangleright: "▸",
				blank: "␣",
				blk12: "▒",
				blk14: "░",
				blk34: "▓",
				block: "█",
				bne: "=⃥",
				bnequiv: "≡⃥",
				bNot: "⫭",
				bnot: "⌐",
				Bopf: "𝔹",
				bopf: "𝕓",
				bot: "⊥",
				bottom: "⊥",
				bowtie: "⋈",
				boxbox: "⧉",
				boxdl: "┐",
				boxdL: "╕",
				boxDl: "╖",
				boxDL: "╗",
				boxdr: "┌",
				boxdR: "╒",
				boxDr: "╓",
				boxDR: "╔",
				boxh: "─",
				boxH: "═",
				boxhd: "┬",
				boxHd: "╤",
				boxhD: "╥",
				boxHD: "╦",
				boxhu: "┴",
				boxHu: "╧",
				boxhU: "╨",
				boxHU: "╩",
				boxminus: "⊟",
				boxplus: "⊞",
				boxtimes: "⊠",
				boxul: "┘",
				boxuL: "╛",
				boxUl: "╜",
				boxUL: "╝",
				boxur: "└",
				boxuR: "╘",
				boxUr: "╙",
				boxUR: "╚",
				boxv: "│",
				boxV: "║",
				boxvh: "┼",
				boxvH: "╪",
				boxVh: "╫",
				boxVH: "╬",
				boxvl: "┤",
				boxvL: "╡",
				boxVl: "╢",
				boxVL: "╣",
				boxvr: "├",
				boxvR: "╞",
				boxVr: "╟",
				boxVR: "╠",
				bprime: "‵",
				breve: "˘",
				Breve: "˘",
				brvbar: "¦",
				bscr: "𝒷",
				Bscr: "ℬ",
				bsemi: "⁏",
				bsim: "∽",
				bsime: "⋍",
				bsolb: "⧅",
				bsol: "\\",
				bsolhsub: "⟈",
				bull: "•",
				bullet: "•",
				bump: "≎",
				bumpE: "⪮",
				bumpe: "≏",
				Bumpeq: "≎",
				bumpeq: "≏",
				Cacute: "Ć",
				cacute: "ć",
				capand: "⩄",
				capbrcup: "⩉",
				capcap: "⩋",
				cap: "∩",
				Cap: "⋒",
				capcup: "⩇",
				capdot: "⩀",
				CapitalDifferentialD: "ⅅ",
				caps: "∩︀",
				caret: "⁁",
				caron: "ˇ",
				Cayleys: "ℭ",
				ccaps: "⩍",
				Ccaron: "Č",
				ccaron: "č",
				Ccedil: "Ç",
				ccedil: "ç",
				Ccirc: "Ĉ",
				ccirc: "ĉ",
				Cconint: "∰",
				ccups: "⩌",
				ccupssm: "⩐",
				Cdot: "Ċ",
				cdot: "ċ",
				cedil: "¸",
				Cedilla: "¸",
				cemptyv: "⦲",
				cent: "¢",
				centerdot: "·",
				CenterDot: "·",
				cfr: "𝔠",
				Cfr: "ℭ",
				CHcy: "Ч",
				chcy: "ч",
				check: "✓",
				checkmark: "✓",
				Chi: "Χ",
				chi: "χ",
				circ: "ˆ",
				circeq: "≗",
				circlearrowleft: "↺",
				circlearrowright: "↻",
				circledast: "⊛",
				circledcirc: "⊚",
				circleddash: "⊝",
				CircleDot: "⊙",
				circledR: "®",
				circledS: "Ⓢ",
				CircleMinus: "⊖",
				CirclePlus: "⊕",
				CircleTimes: "⊗",
				cir: "○",
				cirE: "⧃",
				cire: "≗",
				cirfnint: "⨐",
				cirmid: "⫯",
				cirscir: "⧂",
				ClockwiseContourIntegral: "∲",
				CloseCurlyDoubleQuote: "”",
				CloseCurlyQuote: "’",
				clubs: "♣",
				clubsuit: "♣",
				colon: ":",
				Colon: "∷",
				Colone: "⩴",
				colone: "≔",
				coloneq: "≔",
				comma: ",",
				commat: "@",
				comp: "∁",
				compfn: "∘",
				complement: "∁",
				complexes: "ℂ",
				cong: "≅",
				congdot: "⩭",
				Congruent: "≡",
				conint: "∮",
				Conint: "∯",
				ContourIntegral: "∮",
				copf: "𝕔",
				Copf: "ℂ",
				coprod: "∐",
				Coproduct: "∐",
				copy: "©",
				COPY: "©",
				copysr: "℗",
				CounterClockwiseContourIntegral: "∳",
				crarr: "↵",
				cross: "✗",
				Cross: "⨯",
				Cscr: "𝒞",
				cscr: "𝒸",
				csub: "⫏",
				csube: "⫑",
				csup: "⫐",
				csupe: "⫒",
				ctdot: "⋯",
				cudarrl: "⤸",
				cudarrr: "⤵",
				cuepr: "⋞",
				cuesc: "⋟",
				cularr: "↶",
				cularrp: "⤽",
				cupbrcap: "⩈",
				cupcap: "⩆",
				CupCap: "≍",
				cup: "∪",
				Cup: "⋓",
				cupcup: "⩊",
				cupdot: "⊍",
				cupor: "⩅",
				cups: "∪︀",
				curarr: "↷",
				curarrm: "⤼",
				curlyeqprec: "⋞",
				curlyeqsucc: "⋟",
				curlyvee: "⋎",
				curlywedge: "⋏",
				curren: "¤",
				curvearrowleft: "↶",
				curvearrowright: "↷",
				cuvee: "⋎",
				cuwed: "⋏",
				cwconint: "∲",
				cwint: "∱",
				cylcty: "⌭",
				dagger: "†",
				Dagger: "‡",
				daleth: "ℸ",
				darr: "↓",
				Darr: "↡",
				dArr: "⇓",
				dash: "‐",
				Dashv: "⫤",
				dashv: "⊣",
				dbkarow: "⤏",
				dblac: "˝",
				Dcaron: "Ď",
				dcaron: "ď",
				Dcy: "Д",
				dcy: "д",
				ddagger: "‡",
				ddarr: "⇊",
				DD: "ⅅ",
				dd: "ⅆ",
				DDotrahd: "⤑",
				ddotseq: "⩷",
				deg: "°",
				Del: "∇",
				Delta: "Δ",
				delta: "δ",
				demptyv: "⦱",
				dfisht: "⥿",
				Dfr: "𝔇",
				dfr: "𝔡",
				dHar: "⥥",
				dharl: "⇃",
				dharr: "⇂",
				DiacriticalAcute: "´",
				DiacriticalDot: "˙",
				DiacriticalDoubleAcute: "˝",
				DiacriticalGrave: "`",
				DiacriticalTilde: "˜",
				diam: "⋄",
				diamond: "⋄",
				Diamond: "⋄",
				diamondsuit: "♦",
				diams: "♦",
				die: "¨",
				DifferentialD: "ⅆ",
				digamma: "ϝ",
				disin: "⋲",
				div: "÷",
				divide: "÷",
				divideontimes: "⋇",
				divonx: "⋇",
				DJcy: "Ђ",
				djcy: "ђ",
				dlcorn: "⌞",
				dlcrop: "⌍",
				dollar: "$",
				Dopf: "𝔻",
				dopf: "𝕕",
				Dot: "¨",
				dot: "˙",
				DotDot: "⃜",
				doteq: "≐",
				doteqdot: "≑",
				DotEqual: "≐",
				dotminus: "∸",
				dotplus: "∔",
				dotsquare: "⊡",
				doublebarwedge: "⌆",
				DoubleContourIntegral: "∯",
				DoubleDot: "¨",
				DoubleDownArrow: "⇓",
				DoubleLeftArrow: "⇐",
				DoubleLeftRightArrow: "⇔",
				DoubleLeftTee: "⫤",
				DoubleLongLeftArrow: "⟸",
				DoubleLongLeftRightArrow: "⟺",
				DoubleLongRightArrow: "⟹",
				DoubleRightArrow: "⇒",
				DoubleRightTee: "⊨",
				DoubleUpArrow: "⇑",
				DoubleUpDownArrow: "⇕",
				DoubleVerticalBar: "∥",
				DownArrowBar: "⤓",
				downarrow: "↓",
				DownArrow: "↓",
				Downarrow: "⇓",
				DownArrowUpArrow: "⇵",
				DownBreve: "̑",
				downdownarrows: "⇊",
				downharpoonleft: "⇃",
				downharpoonright: "⇂",
				DownLeftRightVector: "⥐",
				DownLeftTeeVector: "⥞",
				DownLeftVectorBar: "⥖",
				DownLeftVector: "↽",
				DownRightTeeVector: "⥟",
				DownRightVectorBar: "⥗",
				DownRightVector: "⇁",
				DownTeeArrow: "↧",
				DownTee: "⊤",
				drbkarow: "⤐",
				drcorn: "⌟",
				drcrop: "⌌",
				Dscr: "𝒟",
				dscr: "𝒹",
				DScy: "Ѕ",
				dscy: "ѕ",
				dsol: "⧶",
				Dstrok: "Đ",
				dstrok: "đ",
				dtdot: "⋱",
				dtri: "▿",
				dtrif: "▾",
				duarr: "⇵",
				duhar: "⥯",
				dwangle: "⦦",
				DZcy: "Џ",
				dzcy: "џ",
				dzigrarr: "⟿",
				Eacute: "É",
				eacute: "é",
				easter: "⩮",
				Ecaron: "Ě",
				ecaron: "ě",
				Ecirc: "Ê",
				ecirc: "ê",
				ecir: "≖",
				ecolon: "≕",
				Ecy: "Э",
				ecy: "э",
				eDDot: "⩷",
				Edot: "Ė",
				edot: "ė",
				eDot: "≑",
				ee: "ⅇ",
				efDot: "≒",
				Efr: "𝔈",
				efr: "𝔢",
				eg: "⪚",
				Egrave: "È",
				egrave: "è",
				egs: "⪖",
				egsdot: "⪘",
				el: "⪙",
				Element: "∈",
				elinters: "⏧",
				ell: "ℓ",
				els: "⪕",
				elsdot: "⪗",
				Emacr: "Ē",
				emacr: "ē",
				empty: "∅",
				emptyset: "∅",
				EmptySmallSquare: "◻",
				emptyv: "∅",
				EmptyVerySmallSquare: "▫",
				emsp13: " ",
				emsp14: " ",
				emsp: " ",
				ENG: "Ŋ",
				eng: "ŋ",
				ensp: " ",
				Eogon: "Ę",
				eogon: "ę",
				Eopf: "𝔼",
				eopf: "𝕖",
				epar: "⋕",
				eparsl: "⧣",
				eplus: "⩱",
				epsi: "ε",
				Epsilon: "Ε",
				epsilon: "ε",
				epsiv: "ϵ",
				eqcirc: "≖",
				eqcolon: "≕",
				eqsim: "≂",
				eqslantgtr: "⪖",
				eqslantless: "⪕",
				Equal: "⩵",
				equals: "=",
				EqualTilde: "≂",
				equest: "≟",
				Equilibrium: "⇌",
				equiv: "≡",
				equivDD: "⩸",
				eqvparsl: "⧥",
				erarr: "⥱",
				erDot: "≓",
				escr: "ℯ",
				Escr: "ℰ",
				esdot: "≐",
				Esim: "⩳",
				esim: "≂",
				Eta: "Η",
				eta: "η",
				ETH: "Ð",
				eth: "ð",
				Euml: "Ë",
				euml: "ë",
				euro: "€",
				excl: "!",
				exist: "∃",
				Exists: "∃",
				expectation: "ℰ",
				exponentiale: "ⅇ",
				ExponentialE: "ⅇ",
				fallingdotseq: "≒",
				Fcy: "Ф",
				fcy: "ф",
				female: "♀",
				ffilig: "ﬃ",
				fflig: "ﬀ",
				ffllig: "ﬄ",
				Ffr: "𝔉",
				ffr: "𝔣",
				filig: "ﬁ",
				FilledSmallSquare: "◼",
				FilledVerySmallSquare: "▪",
				fjlig: "fj",
				flat: "♭",
				fllig: "ﬂ",
				fltns: "▱",
				fnof: "ƒ",
				Fopf: "𝔽",
				fopf: "𝕗",
				forall: "∀",
				ForAll: "∀",
				fork: "⋔",
				forkv: "⫙",
				Fouriertrf: "ℱ",
				fpartint: "⨍",
				frac12: "½",
				frac13: "⅓",
				frac14: "¼",
				frac15: "⅕",
				frac16: "⅙",
				frac18: "⅛",
				frac23: "⅔",
				frac25: "⅖",
				frac34: "¾",
				frac35: "⅗",
				frac38: "⅜",
				frac45: "⅘",
				frac56: "⅚",
				frac58: "⅝",
				frac78: "⅞",
				frasl: "⁄",
				frown: "⌢",
				fscr: "𝒻",
				Fscr: "ℱ",
				gacute: "ǵ",
				Gamma: "Γ",
				gamma: "γ",
				Gammad: "Ϝ",
				gammad: "ϝ",
				gap: "⪆",
				Gbreve: "Ğ",
				gbreve: "ğ",
				Gcedil: "Ģ",
				Gcirc: "Ĝ",
				gcirc: "ĝ",
				Gcy: "Г",
				gcy: "г",
				Gdot: "Ġ",
				gdot: "ġ",
				ge: "≥",
				gE: "≧",
				gEl: "⪌",
				gel: "⋛",
				geq: "≥",
				geqq: "≧",
				geqslant: "⩾",
				gescc: "⪩",
				ges: "⩾",
				gesdot: "⪀",
				gesdoto: "⪂",
				gesdotol: "⪄",
				gesl: "⋛︀",
				gesles: "⪔",
				Gfr: "𝔊",
				gfr: "𝔤",
				gg: "≫",
				Gg: "⋙",
				ggg: "⋙",
				gimel: "ℷ",
				GJcy: "Ѓ",
				gjcy: "ѓ",
				gla: "⪥",
				gl: "≷",
				glE: "⪒",
				glj: "⪤",
				gnap: "⪊",
				gnapprox: "⪊",
				gne: "⪈",
				gnE: "≩",
				gneq: "⪈",
				gneqq: "≩",
				gnsim: "⋧",
				Gopf: "𝔾",
				gopf: "𝕘",
				grave: "`",
				GreaterEqual: "≥",
				GreaterEqualLess: "⋛",
				GreaterFullEqual: "≧",
				GreaterGreater: "⪢",
				GreaterLess: "≷",
				GreaterSlantEqual: "⩾",
				GreaterTilde: "≳",
				Gscr: "𝒢",
				gscr: "ℊ",
				gsim: "≳",
				gsime: "⪎",
				gsiml: "⪐",
				gtcc: "⪧",
				gtcir: "⩺",
				gt: ">",
				GT: ">",
				Gt: "≫",
				gtdot: "⋗",
				gtlPar: "⦕",
				gtquest: "⩼",
				gtrapprox: "⪆",
				gtrarr: "⥸",
				gtrdot: "⋗",
				gtreqless: "⋛",
				gtreqqless: "⪌",
				gtrless: "≷",
				gtrsim: "≳",
				gvertneqq: "≩︀",
				gvnE: "≩︀",
				Hacek: "ˇ",
				hairsp: " ",
				half: "½",
				hamilt: "ℋ",
				HARDcy: "Ъ",
				hardcy: "ъ",
				harrcir: "⥈",
				harr: "↔",
				hArr: "⇔",
				harrw: "↭",
				Hat: "^",
				hbar: "ℏ",
				Hcirc: "Ĥ",
				hcirc: "ĥ",
				hearts: "♥",
				heartsuit: "♥",
				hellip: "…",
				hercon: "⊹",
				hfr: "𝔥",
				Hfr: "ℌ",
				HilbertSpace: "ℋ",
				hksearow: "⤥",
				hkswarow: "⤦",
				hoarr: "⇿",
				homtht: "∻",
				hookleftarrow: "↩",
				hookrightarrow: "↪",
				hopf: "𝕙",
				Hopf: "ℍ",
				horbar: "―",
				HorizontalLine: "─",
				hscr: "𝒽",
				Hscr: "ℋ",
				hslash: "ℏ",
				Hstrok: "Ħ",
				hstrok: "ħ",
				HumpDownHump: "≎",
				HumpEqual: "≏",
				hybull: "⁃",
				hyphen: "‐",
				Iacute: "Í",
				iacute: "í",
				ic: "⁣",
				Icirc: "Î",
				icirc: "î",
				Icy: "И",
				icy: "и",
				Idot: "İ",
				IEcy: "Е",
				iecy: "е",
				iexcl: "¡",
				iff: "⇔",
				ifr: "𝔦",
				Ifr: "ℑ",
				Igrave: "Ì",
				igrave: "ì",
				ii: "ⅈ",
				iiiint: "⨌",
				iiint: "∭",
				iinfin: "⧜",
				iiota: "℩",
				IJlig: "Ĳ",
				ijlig: "ĳ",
				Imacr: "Ī",
				imacr: "ī",
				image: "ℑ",
				ImaginaryI: "ⅈ",
				imagline: "ℐ",
				imagpart: "ℑ",
				imath: "ı",
				Im: "ℑ",
				imof: "⊷",
				imped: "Ƶ",
				Implies: "⇒",
				incare: "℅",
				"in": "∈",
				infin: "∞",
				infintie: "⧝",
				inodot: "ı",
				intcal: "⊺",
				"int": "∫",
				Int: "∬",
				integers: "ℤ",
				Integral: "∫",
				intercal: "⊺",
				Intersection: "⋂",
				intlarhk: "⨗",
				intprod: "⨼",
				InvisibleComma: "⁣",
				InvisibleTimes: "⁢",
				IOcy: "Ё",
				iocy: "ё",
				Iogon: "Į",
				iogon: "į",
				Iopf: "𝕀",
				iopf: "𝕚",
				Iota: "Ι",
				iota: "ι",
				iprod: "⨼",
				iquest: "¿",
				iscr: "𝒾",
				Iscr: "ℐ",
				isin: "∈",
				isindot: "⋵",
				isinE: "⋹",
				isins: "⋴",
				isinsv: "⋳",
				isinv: "∈",
				it: "⁢",
				Itilde: "Ĩ",
				itilde: "ĩ",
				Iukcy: "І",
				iukcy: "і",
				Iuml: "Ï",
				iuml: "ï",
				Jcirc: "Ĵ",
				jcirc: "ĵ",
				Jcy: "Й",
				jcy: "й",
				Jfr: "𝔍",
				jfr: "𝔧",
				jmath: "ȷ",
				Jopf: "𝕁",
				jopf: "𝕛",
				Jscr: "𝒥",
				jscr: "𝒿",
				Jsercy: "Ј",
				jsercy: "ј",
				Jukcy: "Є",
				jukcy: "є",
				Kappa: "Κ",
				kappa: "κ",
				kappav: "ϰ",
				Kcedil: "Ķ",
				kcedil: "ķ",
				Kcy: "К",
				kcy: "к",
				Kfr: "𝔎",
				kfr: "𝔨",
				kgreen: "ĸ",
				KHcy: "Х",
				khcy: "х",
				KJcy: "Ќ",
				kjcy: "ќ",
				Kopf: "𝕂",
				kopf: "𝕜",
				Kscr: "𝒦",
				kscr: "𝓀",
				lAarr: "⇚",
				Lacute: "Ĺ",
				lacute: "ĺ",
				laemptyv: "⦴",
				lagran: "ℒ",
				Lambda: "Λ",
				lambda: "λ",
				lang: "⟨",
				Lang: "⟪",
				langd: "⦑",
				langle: "⟨",
				lap: "⪅",
				Laplacetrf: "ℒ",
				laquo: "«",
				larrb: "⇤",
				larrbfs: "⤟",
				larr: "←",
				Larr: "↞",
				lArr: "⇐",
				larrfs: "⤝",
				larrhk: "↩",
				larrlp: "↫",
				larrpl: "⤹",
				larrsim: "⥳",
				larrtl: "↢",
				latail: "⤙",
				lAtail: "⤛",
				lat: "⪫",
				late: "⪭",
				lates: "⪭︀",
				lbarr: "⤌",
				lBarr: "⤎",
				lbbrk: "❲",
				lbrace: "{",
				lbrack: "[",
				lbrke: "⦋",
				lbrksld: "⦏",
				lbrkslu: "⦍",
				Lcaron: "Ľ",
				lcaron: "ľ",
				Lcedil: "Ļ",
				lcedil: "ļ",
				lceil: "⌈",
				lcub: "{",
				Lcy: "Л",
				lcy: "л",
				ldca: "⤶",
				ldquo: "“",
				ldquor: "„",
				ldrdhar: "⥧",
				ldrushar: "⥋",
				ldsh: "↲",
				le: "≤",
				lE: "≦",
				LeftAngleBracket: "⟨",
				LeftArrowBar: "⇤",
				leftarrow: "←",
				LeftArrow: "←",
				Leftarrow: "⇐",
				LeftArrowRightArrow: "⇆",
				leftarrowtail: "↢",
				LeftCeiling: "⌈",
				LeftDoubleBracket: "⟦",
				LeftDownTeeVector: "⥡",
				LeftDownVectorBar: "⥙",
				LeftDownVector: "⇃",
				LeftFloor: "⌊",
				leftharpoondown: "↽",
				leftharpoonup: "↼",
				leftleftarrows: "⇇",
				leftrightarrow: "↔",
				LeftRightArrow: "↔",
				Leftrightarrow: "⇔",
				leftrightarrows: "⇆",
				leftrightharpoons: "⇋",
				leftrightsquigarrow: "↭",
				LeftRightVector: "⥎",
				LeftTeeArrow: "↤",
				LeftTee: "⊣",
				LeftTeeVector: "⥚",
				leftthreetimes: "⋋",
				LeftTriangleBar: "⧏",
				LeftTriangle: "⊲",
				LeftTriangleEqual: "⊴",
				LeftUpDownVector: "⥑",
				LeftUpTeeVector: "⥠",
				LeftUpVectorBar: "⥘",
				LeftUpVector: "↿",
				LeftVectorBar: "⥒",
				LeftVector: "↼",
				lEg: "⪋",
				leg: "⋚",
				leq: "≤",
				leqq: "≦",
				leqslant: "⩽",
				lescc: "⪨",
				les: "⩽",
				lesdot: "⩿",
				lesdoto: "⪁",
				lesdotor: "⪃",
				lesg: "⋚︀",
				lesges: "⪓",
				lessapprox: "⪅",
				lessdot: "⋖",
				lesseqgtr: "⋚",
				lesseqqgtr: "⪋",
				LessEqualGreater: "⋚",
				LessFullEqual: "≦",
				LessGreater: "≶",
				lessgtr: "≶",
				LessLess: "⪡",
				lesssim: "≲",
				LessSlantEqual: "⩽",
				LessTilde: "≲",
				lfisht: "⥼",
				lfloor: "⌊",
				Lfr: "𝔏",
				lfr: "𝔩",
				lg: "≶",
				lgE: "⪑",
				lHar: "⥢",
				lhard: "↽",
				lharu: "↼",
				lharul: "⥪",
				lhblk: "▄",
				LJcy: "Љ",
				ljcy: "љ",
				llarr: "⇇",
				ll: "≪",
				Ll: "⋘",
				llcorner: "⌞",
				Lleftarrow: "⇚",
				llhard: "⥫",
				lltri: "◺",
				Lmidot: "Ŀ",
				lmidot: "ŀ",
				lmoustache: "⎰",
				lmoust: "⎰",
				lnap: "⪉",
				lnapprox: "⪉",
				lne: "⪇",
				lnE: "≨",
				lneq: "⪇",
				lneqq: "≨",
				lnsim: "⋦",
				loang: "⟬",
				loarr: "⇽",
				lobrk: "⟦",
				longleftarrow: "⟵",
				LongLeftArrow: "⟵",
				Longleftarrow: "⟸",
				longleftrightarrow: "⟷",
				LongLeftRightArrow: "⟷",
				Longleftrightarrow: "⟺",
				longmapsto: "⟼",
				longrightarrow: "⟶",
				LongRightArrow: "⟶",
				Longrightarrow: "⟹",
				looparrowleft: "↫",
				looparrowright: "↬",
				lopar: "⦅",
				Lopf: "𝕃",
				lopf: "𝕝",
				loplus: "⨭",
				lotimes: "⨴",
				lowast: "∗",
				lowbar: "_",
				LowerLeftArrow: "↙",
				LowerRightArrow: "↘",
				loz: "◊",
				lozenge: "◊",
				lozf: "⧫",
				lpar: "(",
				lparlt: "⦓",
				lrarr: "⇆",
				lrcorner: "⌟",
				lrhar: "⇋",
				lrhard: "⥭",
				lrm: "‎",
				lrtri: "⊿",
				lsaquo: "‹",
				lscr: "𝓁",
				Lscr: "ℒ",
				lsh: "↰",
				Lsh: "↰",
				lsim: "≲",
				lsime: "⪍",
				lsimg: "⪏",
				lsqb: "[",
				lsquo: "‘",
				lsquor: "‚",
				Lstrok: "Ł",
				lstrok: "ł",
				ltcc: "⪦",
				ltcir: "⩹",
				lt: "<",
				LT: "<",
				Lt: "≪",
				ltdot: "⋖",
				lthree: "⋋",
				ltimes: "⋉",
				ltlarr: "⥶",
				ltquest: "⩻",
				ltri: "◃",
				ltrie: "⊴",
				ltrif: "◂",
				ltrPar: "⦖",
				lurdshar: "⥊",
				luruhar: "⥦",
				lvertneqq: "≨︀",
				lvnE: "≨︀",
				macr: "¯",
				male: "♂",
				malt: "✠",
				maltese: "✠",
				Map: "⤅",
				map: "↦",
				mapsto: "↦",
				mapstodown: "↧",
				mapstoleft: "↤",
				mapstoup: "↥",
				marker: "▮",
				mcomma: "⨩",
				Mcy: "М",
				mcy: "м",
				mdash: "—",
				mDDot: "∺",
				measuredangle: "∡",
				MediumSpace: " ",
				Mellintrf: "ℳ",
				Mfr: "𝔐",
				mfr: "𝔪",
				mho: "℧",
				micro: "µ",
				midast: "*",
				midcir: "⫰",
				mid: "∣",
				middot: "·",
				minusb: "⊟",
				minus: "−",
				minusd: "∸",
				minusdu: "⨪",
				MinusPlus: "∓",
				mlcp: "⫛",
				mldr: "…",
				mnplus: "∓",
				models: "⊧",
				Mopf: "𝕄",
				mopf: "𝕞",
				mp: "∓",
				mscr: "𝓂",
				Mscr: "ℳ",
				mstpos: "∾",
				Mu: "Μ",
				mu: "μ",
				multimap: "⊸",
				mumap: "⊸",
				nabla: "∇",
				Nacute: "Ń",
				nacute: "ń",
				nang: "∠⃒",
				nap: "≉",
				napE: "⩰̸",
				napid: "≋̸",
				napos: "ŉ",
				napprox: "≉",
				natural: "♮",
				naturals: "ℕ",
				natur: "♮",
				nbsp: " ",
				nbump: "≎̸",
				nbumpe: "≏̸",
				ncap: "⩃",
				Ncaron: "Ň",
				ncaron: "ň",
				Ncedil: "Ņ",
				ncedil: "ņ",
				ncong: "≇",
				ncongdot: "⩭̸",
				ncup: "⩂",
				Ncy: "Н",
				ncy: "н",
				ndash: "–",
				nearhk: "⤤",
				nearr: "↗",
				neArr: "⇗",
				nearrow: "↗",
				ne: "≠",
				nedot: "≐̸",
				NegativeMediumSpace: "​",
				NegativeThickSpace: "​",
				NegativeThinSpace: "​",
				NegativeVeryThinSpace: "​",
				nequiv: "≢",
				nesear: "⤨",
				nesim: "≂̸",
				NestedGreaterGreater: "≫",
				NestedLessLess: "≪",
				NewLine: "\n",
				nexist: "∄",
				nexists: "∄",
				Nfr: "𝔑",
				nfr: "𝔫",
				ngE: "≧̸",
				nge: "≱",
				ngeq: "≱",
				ngeqq: "≧̸",
				ngeqslant: "⩾̸",
				nges: "⩾̸",
				nGg: "⋙̸",
				ngsim: "≵",
				nGt: "≫⃒",
				ngt: "≯",
				ngtr: "≯",
				nGtv: "≫̸",
				nharr: "↮",
				nhArr: "⇎",
				nhpar: "⫲",
				ni: "∋",
				nis: "⋼",
				nisd: "⋺",
				niv: "∋",
				NJcy: "Њ",
				njcy: "њ",
				nlarr: "↚",
				nlArr: "⇍",
				nldr: "‥",
				nlE: "≦̸",
				nle: "≰",
				nleftarrow: "↚",
				nLeftarrow: "⇍",
				nleftrightarrow: "↮",
				nLeftrightarrow: "⇎",
				nleq: "≰",
				nleqq: "≦̸",
				nleqslant: "⩽̸",
				nles: "⩽̸",
				nless: "≮",
				nLl: "⋘̸",
				nlsim: "≴",
				nLt: "≪⃒",
				nlt: "≮",
				nltri: "⋪",
				nltrie: "⋬",
				nLtv: "≪̸",
				nmid: "∤",
				NoBreak: "⁠",
				NonBreakingSpace: " ",
				nopf: "𝕟",
				Nopf: "ℕ",
				Not: "⫬",
				not: "¬",
				NotCongruent: "≢",
				NotCupCap: "≭",
				NotDoubleVerticalBar: "∦",
				NotElement: "∉",
				NotEqual: "≠",
				NotEqualTilde: "≂̸",
				NotExists: "∄",
				NotGreater: "≯",
				NotGreaterEqual: "≱",
				NotGreaterFullEqual: "≧̸",
				NotGreaterGreater: "≫̸",
				NotGreaterLess: "≹",
				NotGreaterSlantEqual: "⩾̸",
				NotGreaterTilde: "≵",
				NotHumpDownHump: "≎̸",
				NotHumpEqual: "≏̸",
				notin: "∉",
				notindot: "⋵̸",
				notinE: "⋹̸",
				notinva: "∉",
				notinvb: "⋷",
				notinvc: "⋶",
				NotLeftTriangleBar: "⧏̸",
				NotLeftTriangle: "⋪",
				NotLeftTriangleEqual: "⋬",
				NotLess: "≮",
				NotLessEqual: "≰",
				NotLessGreater: "≸",
				NotLessLess: "≪̸",
				NotLessSlantEqual: "⩽̸",
				NotLessTilde: "≴",
				NotNestedGreaterGreater: "⪢̸",
				NotNestedLessLess: "⪡̸",
				notni: "∌",
				notniva: "∌",
				notnivb: "⋾",
				notnivc: "⋽",
				NotPrecedes: "⊀",
				NotPrecedesEqual: "⪯̸",
				NotPrecedesSlantEqual: "⋠",
				NotReverseElement: "∌",
				NotRightTriangleBar: "⧐̸",
				NotRightTriangle: "⋫",
				NotRightTriangleEqual: "⋭",
				NotSquareSubset: "⊏̸",
				NotSquareSubsetEqual: "⋢",
				NotSquareSuperset: "⊐̸",
				NotSquareSupersetEqual: "⋣",
				NotSubset: "⊂⃒",
				NotSubsetEqual: "⊈",
				NotSucceeds: "⊁",
				NotSucceedsEqual: "⪰̸",
				NotSucceedsSlantEqual: "⋡",
				NotSucceedsTilde: "≿̸",
				NotSuperset: "⊃⃒",
				NotSupersetEqual: "⊉",
				NotTilde: "≁",
				NotTildeEqual: "≄",
				NotTildeFullEqual: "≇",
				NotTildeTilde: "≉",
				NotVerticalBar: "∤",
				nparallel: "∦",
				npar: "∦",
				nparsl: "⫽⃥",
				npart: "∂̸",
				npolint: "⨔",
				npr: "⊀",
				nprcue: "⋠",
				nprec: "⊀",
				npreceq: "⪯̸",
				npre: "⪯̸",
				nrarrc: "⤳̸",
				nrarr: "↛",
				nrArr: "⇏",
				nrarrw: "↝̸",
				nrightarrow: "↛",
				nRightarrow: "⇏",
				nrtri: "⋫",
				nrtrie: "⋭",
				nsc: "⊁",
				nsccue: "⋡",
				nsce: "⪰̸",
				Nscr: "𝒩",
				nscr: "𝓃",
				nshortmid: "∤",
				nshortparallel: "∦",
				nsim: "≁",
				nsime: "≄",
				nsimeq: "≄",
				nsmid: "∤",
				nspar: "∦",
				nsqsube: "⋢",
				nsqsupe: "⋣",
				nsub: "⊄",
				nsubE: "⫅̸",
				nsube: "⊈",
				nsubset: "⊂⃒",
				nsubseteq: "⊈",
				nsubseteqq: "⫅̸",
				nsucc: "⊁",
				nsucceq: "⪰̸",
				nsup: "⊅",
				nsupE: "⫆̸",
				nsupe: "⊉",
				nsupset: "⊃⃒",
				nsupseteq: "⊉",
				nsupseteqq: "⫆̸",
				ntgl: "≹",
				Ntilde: "Ñ",
				ntilde: "ñ",
				ntlg: "≸",
				ntriangleleft: "⋪",
				ntrianglelefteq: "⋬",
				ntriangleright: "⋫",
				ntrianglerighteq: "⋭",
				Nu: "Ν",
				nu: "ν",
				num: "#",
				numero: "№",
				numsp: " ",
				nvap: "≍⃒",
				nvdash: "⊬",
				nvDash: "⊭",
				nVdash: "⊮",
				nVDash: "⊯",
				nvge: "≥⃒",
				nvgt: ">⃒",
				nvHarr: "⤄",
				nvinfin: "⧞",
				nvlArr: "⤂",
				nvle: "≤⃒",
				nvlt: "<⃒",
				nvltrie: "⊴⃒",
				nvrArr: "⤃",
				nvrtrie: "⊵⃒",
				nvsim: "∼⃒",
				nwarhk: "⤣",
				nwarr: "↖",
				nwArr: "⇖",
				nwarrow: "↖",
				nwnear: "⤧",
				Oacute: "Ó",
				oacute: "ó",
				oast: "⊛",
				Ocirc: "Ô",
				ocirc: "ô",
				ocir: "⊚",
				Ocy: "О",
				ocy: "о",
				odash: "⊝",
				Odblac: "Ő",
				odblac: "ő",
				odiv: "⨸",
				odot: "⊙",
				odsold: "⦼",
				OElig: "Œ",
				oelig: "œ",
				ofcir: "⦿",
				Ofr: "𝔒",
				ofr: "𝔬",
				ogon: "˛",
				Ograve: "Ò",
				ograve: "ò",
				ogt: "⧁",
				ohbar: "⦵",
				ohm: "Ω",
				oint: "∮",
				olarr: "↺",
				olcir: "⦾",
				olcross: "⦻",
				oline: "‾",
				olt: "⧀",
				Omacr: "Ō",
				omacr: "ō",
				Omega: "Ω",
				omega: "ω",
				Omicron: "Ο",
				omicron: "ο",
				omid: "⦶",
				ominus: "⊖",
				Oopf: "𝕆",
				oopf: "𝕠",
				opar: "⦷",
				OpenCurlyDoubleQuote: "“",
				OpenCurlyQuote: "‘",
				operp: "⦹",
				oplus: "⊕",
				orarr: "↻",
				Or: "⩔",
				or: "∨",
				ord: "⩝",
				order: "ℴ",
				orderof: "ℴ",
				ordf: "ª",
				ordm: "º",
				origof: "⊶",
				oror: "⩖",
				orslope: "⩗",
				orv: "⩛",
				oS: "Ⓢ",
				Oscr: "𝒪",
				oscr: "ℴ",
				Oslash: "Ø",
				oslash: "ø",
				osol: "⊘",
				Otilde: "Õ",
				otilde: "õ",
				otimesas: "⨶",
				Otimes: "⨷",
				otimes: "⊗",
				Ouml: "Ö",
				ouml: "ö",
				ovbar: "⌽",
				OverBar: "‾",
				OverBrace: "⏞",
				OverBracket: "⎴",
				OverParenthesis: "⏜",
				para: "¶",
				parallel: "∥",
				par: "∥",
				parsim: "⫳",
				parsl: "⫽",
				part: "∂",
				PartialD: "∂",
				Pcy: "П",
				pcy: "п",
				percnt: "%",
				period: ".",
				permil: "‰",
				perp: "⊥",
				pertenk: "‱",
				Pfr: "𝔓",
				pfr: "𝔭",
				Phi: "Φ",
				phi: "φ",
				phiv: "ϕ",
				phmmat: "ℳ",
				phone: "☎",
				Pi: "Π",
				pi: "π",
				pitchfork: "⋔",
				piv: "ϖ",
				planck: "ℏ",
				planckh: "ℎ",
				plankv: "ℏ",
				plusacir: "⨣",
				plusb: "⊞",
				pluscir: "⨢",
				plus: "+",
				plusdo: "∔",
				plusdu: "⨥",
				pluse: "⩲",
				PlusMinus: "±",
				plusmn: "±",
				plussim: "⨦",
				plustwo: "⨧",
				pm: "±",
				Poincareplane: "ℌ",
				pointint: "⨕",
				popf: "𝕡",
				Popf: "ℙ",
				pound: "£",
				prap: "⪷",
				Pr: "⪻",
				pr: "≺",
				prcue: "≼",
				precapprox: "⪷",
				prec: "≺",
				preccurlyeq: "≼",
				Precedes: "≺",
				PrecedesEqual: "⪯",
				PrecedesSlantEqual: "≼",
				PrecedesTilde: "≾",
				preceq: "⪯",
				precnapprox: "⪹",
				precneqq: "⪵",
				precnsim: "⋨",
				pre: "⪯",
				prE: "⪳",
				precsim: "≾",
				prime: "′",
				Prime: "″",
				primes: "ℙ",
				prnap: "⪹",
				prnE: "⪵",
				prnsim: "⋨",
				prod: "∏",
				Product: "∏",
				profalar: "⌮",
				profline: "⌒",
				profsurf: "⌓",
				prop: "∝",
				Proportional: "∝",
				Proportion: "∷",
				propto: "∝",
				prsim: "≾",
				prurel: "⊰",
				Pscr: "𝒫",
				pscr: "𝓅",
				Psi: "Ψ",
				psi: "ψ",
				puncsp: " ",
				Qfr: "𝔔",
				qfr: "𝔮",
				qint: "⨌",
				qopf: "𝕢",
				Qopf: "ℚ",
				qprime: "⁗",
				Qscr: "𝒬",
				qscr: "𝓆",
				quaternions: "ℍ",
				quatint: "⨖",
				quest: "?",
				questeq: "≟",
				quot: '"',
				QUOT: '"',
				rAarr: "⇛",
				race: "∽̱",
				Racute: "Ŕ",
				racute: "ŕ",
				radic: "√",
				raemptyv: "⦳",
				rang: "⟩",
				Rang: "⟫",
				rangd: "⦒",
				range: "⦥",
				rangle: "⟩",
				raquo: "»",
				rarrap: "⥵",
				rarrb: "⇥",
				rarrbfs: "⤠",
				rarrc: "⤳",
				rarr: "→",
				Rarr: "↠",
				rArr: "⇒",
				rarrfs: "⤞",
				rarrhk: "↪",
				rarrlp: "↬",
				rarrpl: "⥅",
				rarrsim: "⥴",
				Rarrtl: "⤖",
				rarrtl: "↣",
				rarrw: "↝",
				ratail: "⤚",
				rAtail: "⤜",
				ratio: "∶",
				rationals: "ℚ",
				rbarr: "⤍",
				rBarr: "⤏",
				RBarr: "⤐",
				rbbrk: "❳",
				rbrace: "}",
				rbrack: "]",
				rbrke: "⦌",
				rbrksld: "⦎",
				rbrkslu: "⦐",
				Rcaron: "Ř",
				rcaron: "ř",
				Rcedil: "Ŗ",
				rcedil: "ŗ",
				rceil: "⌉",
				rcub: "}",
				Rcy: "Р",
				rcy: "р",
				rdca: "⤷",
				rdldhar: "⥩",
				rdquo: "”",
				rdquor: "”",
				rdsh: "↳",
				real: "ℜ",
				realine: "ℛ",
				realpart: "ℜ",
				reals: "ℝ",
				Re: "ℜ",
				rect: "▭",
				reg: "®",
				REG: "®",
				ReverseElement: "∋",
				ReverseEquilibrium: "⇋",
				ReverseUpEquilibrium: "⥯",
				rfisht: "⥽",
				rfloor: "⌋",
				rfr: "𝔯",
				Rfr: "ℜ",
				rHar: "⥤",
				rhard: "⇁",
				rharu: "⇀",
				rharul: "⥬",
				Rho: "Ρ",
				rho: "ρ",
				rhov: "ϱ",
				RightAngleBracket: "⟩",
				RightArrowBar: "⇥",
				rightarrow: "→",
				RightArrow: "→",
				Rightarrow: "⇒",
				RightArrowLeftArrow: "⇄",
				rightarrowtail: "↣",
				RightCeiling: "⌉",
				RightDoubleBracket: "⟧",
				RightDownTeeVector: "⥝",
				RightDownVectorBar: "⥕",
				RightDownVector: "⇂",
				RightFloor: "⌋",
				rightharpoondown: "⇁",
				rightharpoonup: "⇀",
				rightleftarrows: "⇄",
				rightleftharpoons: "⇌",
				rightrightarrows: "⇉",
				rightsquigarrow: "↝",
				RightTeeArrow: "↦",
				RightTee: "⊢",
				RightTeeVector: "⥛",
				rightthreetimes: "⋌",
				RightTriangleBar: "⧐",
				RightTriangle: "⊳",
				RightTriangleEqual: "⊵",
				RightUpDownVector: "⥏",
				RightUpTeeVector: "⥜",
				RightUpVectorBar: "⥔",
				RightUpVector: "↾",
				RightVectorBar: "⥓",
				RightVector: "⇀",
				ring: "˚",
				risingdotseq: "≓",
				rlarr: "⇄",
				rlhar: "⇌",
				rlm: "‏",
				rmoustache: "⎱",
				rmoust: "⎱",
				rnmid: "⫮",
				roang: "⟭",
				roarr: "⇾",
				robrk: "⟧",
				ropar: "⦆",
				ropf: "𝕣",
				Ropf: "ℝ",
				roplus: "⨮",
				rotimes: "⨵",
				RoundImplies: "⥰",
				rpar: ")",
				rpargt: "⦔",
				rppolint: "⨒",
				rrarr: "⇉",
				Rrightarrow: "⇛",
				rsaquo: "›",
				rscr: "𝓇",
				Rscr: "ℛ",
				rsh: "↱",
				Rsh: "↱",
				rsqb: "]",
				rsquo: "’",
				rsquor: "’",
				rthree: "⋌",
				rtimes: "⋊",
				rtri: "▹",
				rtrie: "⊵",
				rtrif: "▸",
				rtriltri: "⧎",
				RuleDelayed: "⧴",
				ruluhar: "⥨",
				rx: "℞",
				Sacute: "Ś",
				sacute: "ś",
				sbquo: "‚",
				scap: "⪸",
				Scaron: "Š",
				scaron: "š",
				Sc: "⪼",
				sc: "≻",
				sccue: "≽",
				sce: "⪰",
				scE: "⪴",
				Scedil: "Ş",
				scedil: "ş",
				Scirc: "Ŝ",
				scirc: "ŝ",
				scnap: "⪺",
				scnE: "⪶",
				scnsim: "⋩",
				scpolint: "⨓",
				scsim: "≿",
				Scy: "С",
				scy: "с",
				sdotb: "⊡",
				sdot: "⋅",
				sdote: "⩦",
				searhk: "⤥",
				searr: "↘",
				seArr: "⇘",
				searrow: "↘",
				sect: "§",
				semi: ";",
				seswar: "⤩",
				setminus: "∖",
				setmn: "∖",
				sext: "✶",
				Sfr: "𝔖",
				sfr: "𝔰",
				sfrown: "⌢",
				sharp: "♯",
				SHCHcy: "Щ",
				shchcy: "щ",
				SHcy: "Ш",
				shcy: "ш",
				ShortDownArrow: "↓",
				ShortLeftArrow: "←",
				shortmid: "∣",
				shortparallel: "∥",
				ShortRightArrow: "→",
				ShortUpArrow: "↑",
				shy: "­",
				Sigma: "Σ",
				sigma: "σ",
				sigmaf: "ς",
				sigmav: "ς",
				sim: "∼",
				simdot: "⩪",
				sime: "≃",
				simeq: "≃",
				simg: "⪞",
				simgE: "⪠",
				siml: "⪝",
				simlE: "⪟",
				simne: "≆",
				simplus: "⨤",
				simrarr: "⥲",
				slarr: "←",
				SmallCircle: "∘",
				smallsetminus: "∖",
				smashp: "⨳",
				smeparsl: "⧤",
				smid: "∣",
				smile: "⌣",
				smt: "⪪",
				smte: "⪬",
				smtes: "⪬︀",
				SOFTcy: "Ь",
				softcy: "ь",
				solbar: "⌿",
				solb: "⧄",
				sol: "/",
				Sopf: "𝕊",
				sopf: "𝕤",
				spades: "♠",
				spadesuit: "♠",
				spar: "∥",
				sqcap: "⊓",
				sqcaps: "⊓︀",
				sqcup: "⊔",
				sqcups: "⊔︀",
				Sqrt: "√",
				sqsub: "⊏",
				sqsube: "⊑",
				sqsubset: "⊏",
				sqsubseteq: "⊑",
				sqsup: "⊐",
				sqsupe: "⊒",
				sqsupset: "⊐",
				sqsupseteq: "⊒",
				square: "□",
				Square: "□",
				SquareIntersection: "⊓",
				SquareSubset: "⊏",
				SquareSubsetEqual: "⊑",
				SquareSuperset: "⊐",
				SquareSupersetEqual: "⊒",
				SquareUnion: "⊔",
				squarf: "▪",
				squ: "□",
				squf: "▪",
				srarr: "→",
				Sscr: "𝒮",
				sscr: "𝓈",
				ssetmn: "∖",
				ssmile: "⌣",
				sstarf: "⋆",
				Star: "⋆",
				star: "☆",
				starf: "★",
				straightepsilon: "ϵ",
				straightphi: "ϕ",
				strns: "¯",
				sub: "⊂",
				Sub: "⋐",
				subdot: "⪽",
				subE: "⫅",
				sube: "⊆",
				subedot: "⫃",
				submult: "⫁",
				subnE: "⫋",
				subne: "⊊",
				subplus: "⪿",
				subrarr: "⥹",
				subset: "⊂",
				Subset: "⋐",
				subseteq: "⊆",
				subseteqq: "⫅",
				SubsetEqual: "⊆",
				subsetneq: "⊊",
				subsetneqq: "⫋",
				subsim: "⫇",
				subsub: "⫕",
				subsup: "⫓",
				succapprox: "⪸",
				succ: "≻",
				succcurlyeq: "≽",
				Succeeds: "≻",
				SucceedsEqual: "⪰",
				SucceedsSlantEqual: "≽",
				SucceedsTilde: "≿",
				succeq: "⪰",
				succnapprox: "⪺",
				succneqq: "⪶",
				succnsim: "⋩",
				succsim: "≿",
				SuchThat: "∋",
				sum: "∑",
				Sum: "∑",
				sung: "♪",
				sup1: "¹",
				sup2: "²",
				sup3: "³",
				sup: "⊃",
				Sup: "⋑",
				supdot: "⪾",
				supdsub: "⫘",
				supE: "⫆",
				supe: "⊇",
				supedot: "⫄",
				Superset: "⊃",
				SupersetEqual: "⊇",
				suphsol: "⟉",
				suphsub: "⫗",
				suplarr: "⥻",
				supmult: "⫂",
				supnE: "⫌",
				supne: "⊋",
				supplus: "⫀",
				supset: "⊃",
				Supset: "⋑",
				supseteq: "⊇",
				supseteqq: "⫆",
				supsetneq: "⊋",
				supsetneqq: "⫌",
				supsim: "⫈",
				supsub: "⫔",
				supsup: "⫖",
				swarhk: "⤦",
				swarr: "↙",
				swArr: "⇙",
				swarrow: "↙",
				swnwar: "⤪",
				szlig: "ß",
				Tab: "	",
				target: "⌖",
				Tau: "Τ",
				tau: "τ",
				tbrk: "⎴",
				Tcaron: "Ť",
				tcaron: "ť",
				Tcedil: "Ţ",
				tcedil: "ţ",
				Tcy: "Т",
				tcy: "т",
				tdot: "⃛",
				telrec: "⌕",
				Tfr: "𝔗",
				tfr: "𝔱",
				there4: "∴",
				therefore: "∴",
				Therefore: "∴",
				Theta: "Θ",
				theta: "θ",
				thetasym: "ϑ",
				thetav: "ϑ",
				thickapprox: "≈",
				thicksim: "∼",
				ThickSpace: "  ",
				ThinSpace: " ",
				thinsp: " ",
				thkap: "≈",
				thksim: "∼",
				THORN: "Þ",
				thorn: "þ",
				tilde: "˜",
				Tilde: "∼",
				TildeEqual: "≃",
				TildeFullEqual: "≅",
				TildeTilde: "≈",
				timesbar: "⨱",
				timesb: "⊠",
				times: "×",
				timesd: "⨰",
				tint: "∭",
				toea: "⤨",
				topbot: "⌶",
				topcir: "⫱",
				top: "⊤",
				Topf: "𝕋",
				topf: "𝕥",
				topfork: "⫚",
				tosa: "⤩",
				tprime: "‴",
				trade: "™",
				TRADE: "™",
				triangle: "▵",
				triangledown: "▿",
				triangleleft: "◃",
				trianglelefteq: "⊴",
				triangleq: "≜",
				triangleright: "▹",
				trianglerighteq: "⊵",
				tridot: "◬",
				trie: "≜",
				triminus: "⨺",
				TripleDot: "⃛",
				triplus: "⨹",
				trisb: "⧍",
				tritime: "⨻",
				trpezium: "⏢",
				Tscr: "𝒯",
				tscr: "𝓉",
				TScy: "Ц",
				tscy: "ц",
				TSHcy: "Ћ",
				tshcy: "ћ",
				Tstrok: "Ŧ",
				tstrok: "ŧ",
				twixt: "≬",
				twoheadleftarrow: "↞",
				twoheadrightarrow: "↠",
				Uacute: "Ú",
				uacute: "ú",
				uarr: "↑",
				Uarr: "↟",
				uArr: "⇑",
				Uarrocir: "⥉",
				Ubrcy: "Ў",
				ubrcy: "ў",
				Ubreve: "Ŭ",
				ubreve: "ŭ",
				Ucirc: "Û",
				ucirc: "û",
				Ucy: "У",
				ucy: "у",
				udarr: "⇅",
				Udblac: "Ű",
				udblac: "ű",
				udhar: "⥮",
				ufisht: "⥾",
				Ufr: "𝔘",
				ufr: "𝔲",
				Ugrave: "Ù",
				ugrave: "ù",
				uHar: "⥣",
				uharl: "↿",
				uharr: "↾",
				uhblk: "▀",
				ulcorn: "⌜",
				ulcorner: "⌜",
				ulcrop: "⌏",
				ultri: "◸",
				Umacr: "Ū",
				umacr: "ū",
				uml: "¨",
				UnderBar: "_",
				UnderBrace: "⏟",
				UnderBracket: "⎵",
				UnderParenthesis: "⏝",
				Union: "⋃",
				UnionPlus: "⊎",
				Uogon: "Ų",
				uogon: "ų",
				Uopf: "𝕌",
				uopf: "𝕦",
				UpArrowBar: "⤒",
				uparrow: "↑",
				UpArrow: "↑",
				Uparrow: "⇑",
				UpArrowDownArrow: "⇅",
				updownarrow: "↕",
				UpDownArrow: "↕",
				Updownarrow: "⇕",
				UpEquilibrium: "⥮",
				upharpoonleft: "↿",
				upharpoonright: "↾",
				uplus: "⊎",
				UpperLeftArrow: "↖",
				UpperRightArrow: "↗",
				upsi: "υ",
				Upsi: "ϒ",
				upsih: "ϒ",
				Upsilon: "Υ",
				upsilon: "υ",
				UpTeeArrow: "↥",
				UpTee: "⊥",
				upuparrows: "⇈",
				urcorn: "⌝",
				urcorner: "⌝",
				urcrop: "⌎",
				Uring: "Ů",
				uring: "ů",
				urtri: "◹",
				Uscr: "𝒰",
				uscr: "𝓊",
				utdot: "⋰",
				Utilde: "Ũ",
				utilde: "ũ",
				utri: "▵",
				utrif: "▴",
				uuarr: "⇈",
				Uuml: "Ü",
				uuml: "ü",
				uwangle: "⦧",
				vangrt: "⦜",
				varepsilon: "ϵ",
				varkappa: "ϰ",
				varnothing: "∅",
				varphi: "ϕ",
				varpi: "ϖ",
				varpropto: "∝",
				varr: "↕",
				vArr: "⇕",
				varrho: "ϱ",
				varsigma: "ς",
				varsubsetneq: "⊊︀",
				varsubsetneqq: "⫋︀",
				varsupsetneq: "⊋︀",
				varsupsetneqq: "⫌︀",
				vartheta: "ϑ",
				vartriangleleft: "⊲",
				vartriangleright: "⊳",
				vBar: "⫨",
				Vbar: "⫫",
				vBarv: "⫩",
				Vcy: "В",
				vcy: "в",
				vdash: "⊢",
				vDash: "⊨",
				Vdash: "⊩",
				VDash: "⊫",
				Vdashl: "⫦",
				veebar: "⊻",
				vee: "∨",
				Vee: "⋁",
				veeeq: "≚",
				vellip: "⋮",
				verbar: "|",
				Verbar: "‖",
				vert: "|",
				Vert: "‖",
				VerticalBar: "∣",
				VerticalLine: "|",
				VerticalSeparator: "❘",
				VerticalTilde: "≀",
				VeryThinSpace: " ",
				Vfr: "𝔙",
				vfr: "𝔳",
				vltri: "⊲",
				vnsub: "⊂⃒",
				vnsup: "⊃⃒",
				Vopf: "𝕍",
				vopf: "𝕧",
				vprop: "∝",
				vrtri: "⊳",
				Vscr: "𝒱",
				vscr: "𝓋",
				vsubnE: "⫋︀",
				vsubne: "⊊︀",
				vsupnE: "⫌︀",
				vsupne: "⊋︀",
				Vvdash: "⊪",
				vzigzag: "⦚",
				Wcirc: "Ŵ",
				wcirc: "ŵ",
				wedbar: "⩟",
				wedge: "∧",
				Wedge: "⋀",
				wedgeq: "≙",
				weierp: "℘",
				Wfr: "𝔚",
				wfr: "𝔴",
				Wopf: "𝕎",
				wopf: "𝕨",
				wp: "℘",
				wr: "≀",
				wreath: "≀",
				Wscr: "𝒲",
				wscr: "𝓌",
				xcap: "⋂",
				xcirc: "◯",
				xcup: "⋃",
				xdtri: "▽",
				Xfr: "𝔛",
				xfr: "𝔵",
				xharr: "⟷",
				xhArr: "⟺",
				Xi: "Ξ",
				xi: "ξ",
				xlarr: "⟵",
				xlArr: "⟸",
				xmap: "⟼",
				xnis: "⋻",
				xodot: "⨀",
				Xopf: "𝕏",
				xopf: "𝕩",
				xoplus: "⨁",
				xotime: "⨂",
				xrarr: "⟶",
				xrArr: "⟹",
				Xscr: "𝒳",
				xscr: "𝓍",
				xsqcup: "⨆",
				xuplus: "⨄",
				xutri: "△",
				xvee: "⋁",
				xwedge: "⋀",
				Yacute: "Ý",
				yacute: "ý",
				YAcy: "Я",
				yacy: "я",
				Ycirc: "Ŷ",
				ycirc: "ŷ",
				Ycy: "Ы",
				ycy: "ы",
				yen: "¥",
				Yfr: "𝔜",
				yfr: "𝔶",
				YIcy: "Ї",
				yicy: "ї",
				Yopf: "𝕐",
				yopf: "𝕪",
				Yscr: "𝒴",
				yscr: "𝓎",
				YUcy: "Ю",
				yucy: "ю",
				yuml: "ÿ",
				Yuml: "Ÿ",
				Zacute: "Ź",
				zacute: "ź",
				Zcaron: "Ž",
				zcaron: "ž",
				Zcy: "З",
				zcy: "з",
				Zdot: "Ż",
				zdot: "ż",
				zeetrf: "ℨ",
				ZeroWidthSpace: "​",
				Zeta: "Ζ",
				zeta: "ζ",
				zfr: "𝔷",
				Zfr: "ℨ",
				ZHcy: "Ж",
				zhcy: "ж",
				zigrarr: "⇝",
				zopf: "𝕫",
				Zopf: "ℤ",
				Zscr: "𝒵",
				zscr: "𝓏",
				zwj: "‍",
				zwnj: "‌"
			}
		}, {}], 32: [function (e, t) {
			t.exports = {
				Aacute: "Á",
				aacute: "á",
				Acirc: "Â",
				acirc: "â",
				acute: "´",
				AElig: "Æ",
				aelig: "æ",
				Agrave: "À",
				agrave: "à",
				amp: "&",
				AMP: "&",
				Aring: "Å",
				aring: "å",
				Atilde: "Ã",
				atilde: "ã",
				Auml: "Ä",
				auml: "ä",
				brvbar: "¦",
				Ccedil: "Ç",
				ccedil: "ç",
				cedil: "¸",
				cent: "¢",
				copy: "©",
				COPY: "©",
				curren: "¤",
				deg: "°",
				divide: "÷",
				Eacute: "É",
				eacute: "é",
				Ecirc: "Ê",
				ecirc: "ê",
				Egrave: "È",
				egrave: "è",
				ETH: "Ð",
				eth: "ð",
				Euml: "Ë",
				euml: "ë",
				frac12: "½",
				frac14: "¼",
				frac34: "¾",
				gt: ">",
				GT: ">",
				Iacute: "Í",
				iacute: "í",
				Icirc: "Î",
				icirc: "î",
				iexcl: "¡",
				Igrave: "Ì",
				igrave: "ì",
				iquest: "¿",
				Iuml: "Ï",
				iuml: "ï",
				laquo: "«",
				lt: "<",
				LT: "<",
				macr: "¯",
				micro: "µ",
				middot: "·",
				nbsp: " ",
				not: "¬",
				Ntilde: "Ñ",
				ntilde: "ñ",
				Oacute: "Ó",
				oacute: "ó",
				Ocirc: "Ô",
				ocirc: "ô",
				Ograve: "Ò",
				ograve: "ò",
				ordf: "ª",
				ordm: "º",
				Oslash: "Ø",
				oslash: "ø",
				Otilde: "Õ",
				otilde: "õ",
				Ouml: "Ö",
				ouml: "ö",
				para: "¶",
				plusmn: "±",
				pound: "£",
				quot: '"',
				QUOT: '"',
				raquo: "»",
				reg: "®",
				REG: "®",
				sect: "§",
				shy: "­",
				sup1: "¹",
				sup2: "²",
				sup3: "³",
				szlig: "ß",
				THORN: "Þ",
				thorn: "þ",
				times: "×",
				Uacute: "Ú",
				uacute: "ú",
				Ucirc: "Û",
				ucirc: "û",
				Ugrave: "Ù",
				ugrave: "ù",
				uml: "¨",
				Uuml: "Ü",
				uuml: "ü",
				Yacute: "Ý",
				yacute: "ý",
				yen: "¥",
				yuml: "ÿ"
			}
		}, {}], 33: [function (e, t) {
			t.exports = {amp: "&", apos: "'", gt: ">", lt: "<", quot: '"'}
		}, {}], 34: [function (e, t) {
			function n(e, n) {
				return delete t.exports[e], t.exports[e] = n, n
			}

			var r = e("./Parser.js"), i = e("domhandler");
			t.exports = {
				Parser: r,
				Tokenizer: e("./Tokenizer.js"),
				ElementType: e("domelementtype"),
				DomHandler: i,
				get FeedHandler() {
					return n("FeedHandler", e("./FeedHandler.js"))
				},
				get Stream() {
					return n("Stream", e("./Stream.js"))
				},
				get WritableStream() {
					return n("WritableStream", e("./WritableStream.js"))
				},
				get ProxyHandler() {
					return n("ProxyHandler", e("./ProxyHandler.js"))
				},
				get DomUtils() {
					return n("DomUtils", e("domutils"))
				},
				get CollectingHandler() {
					return n("CollectingHandler", e("./CollectingHandler.js"))
				},
				DefaultHandler: i,
				get RssHandler() {
					return n("RssHandler", this.FeedHandler)
				},
				parseDOM: function (e, t) {
					var n = new i(t), o = new r(n, t);
					return o.end(e), n.dom
				},
				parseFeed: function (e, n) {
					var i = new t.exports.FeedHandler(n), o = new r(i, n);
					return o.end(e), i.dom
				},
				createDomStream: function (e, t, n) {
					var o = new i(e, t, n);
					return new r(o, t)
				},
				EVENTS: {
					attribute: 2,
					cdatastart: 0,
					cdataend: 0,
					text: 1,
					processinginstruction: 2,
					comment: 1,
					commentend: 0,
					closetag: 1,
					opentag: 2,
					opentagname: 1,
					error: 1,
					end: 0
				}
			}
		}, {
			"./CollectingHandler.js": 23,
			"./FeedHandler.js": 24,
			"./Parser.js": 25,
			"./ProxyHandler.js": 26,
			"./Stream.js": 27,
			"./Tokenizer.js": 28,
			"./WritableStream.js": 29,
			domelementtype: 35,
			domhandler: 36,
			domutils: 37
		}], 35: [function (e, t) {
			t.exports = {
				Text: "text",
				Directive: "directive",
				Comment: "comment",
				Script: "script",
				Style: "style",
				Tag: "tag",
				CDATA: "cdata",
				isTag: function (e) {
					return "tag" === e.type || "script" === e.type || "style" === e.type
				}
			}
		}, {}], 36: [function (e, t) {
			function n(e, t, n) {
				"object" == typeof e ? (n = t, t = e, e = null) : "function" == typeof t && (n = t, t = o), this._callback = e, this._options = t || o, this._elementCB = n, this.dom = [], this._done = !1, this._tagStack = []
			}

			var r = e("domelementtype"), i = /\s+/g, o = {normalizeWhitespace: !1};
			n.prototype.onreset = function () {
				n.call(this, this._callback, this._options, this._elementCB)
			}, n.prototype.onend = function () {
				this._done || (this._done = !0, this._handleCallback(null))
			}, n.prototype._handleCallback = n.prototype.onerror = function (e) {
				if ("function" == typeof this._callback) this._callback(e, this.dom); else if (e) throw e
			}, n.prototype.onclosetag = function () {
				var e = this._tagStack.pop();
				this._elementCB && this._elementCB(e)
			}, n.prototype._addDomElement = function (e) {
				var t = this._tagStack[this._tagStack.length - 1], n = t ? t.children : this.dom, r = n[n.length - 1];
				e.next = null, this._options.withDomLvl1 && (e.__proto__ = a), r ? (e.prev = r, r.next = e) : e.prev = null, n.push(e), e.parent = t || null
			};
			var a = {
				get firstChild() {
					var e = this.children;
					return e && e[0] || null
				}, get lastChild() {
					var e = this.children;
					return e && e[e.length - 1] || null
				}, get nodeType() {
					return l[this.type] || l.element
				}
			}, s = {
				tagName: "name",
				childNodes: "children",
				parentNode: "parent",
				previousSibling: "prev",
				nextSibling: "next",
				nodeValue: "data"
			}, l = {element: 1, text: 3, cdata: 4, comment: 8};
			Object.keys(s).forEach(function (e) {
				var t = s[e];
				Object.defineProperty(a, e, {
					get: function () {
						return this[t] || null
					}, set: function (e) {
						return this[t] = e, e
					}
				})
			}), n.prototype.onopentag = function (e, t) {
				var n = {
					type: "script" === e ? r.Script : "style" === e ? r.Style : r.Tag,
					name: e,
					attribs: t,
					children: []
				};
				this._addDomElement(n), this._tagStack.push(n)
			}, n.prototype.ontext = function (e) {
				var t, n = this._options.normalizeWhitespace || this._options.ignoreWhitespace;
				!this._tagStack.length && this.dom.length && (t = this.dom[this.dom.length - 1]).type === r.Text ? n ? t.data = (t.data + e).replace(i, " ") : t.data += e : this._tagStack.length && (t = this._tagStack[this._tagStack.length - 1]) && (t = t.children[t.children.length - 1]) && t.type === r.Text ? n ? t.data = (t.data + e).replace(i, " ") : t.data += e : (n && (e = e.replace(i, " ")), this._addDomElement({
					data: e,
					type: r.Text
				}))
			}, n.prototype.oncomment = function (e) {
				var t = this._tagStack[this._tagStack.length - 1];
				if (t && t.type === r.Comment) return t.data += e, void 0;
				var n = {data: e, type: r.Comment};
				this._addDomElement(n), this._tagStack.push(n)
			}, n.prototype.oncdatastart = function () {
				var e = {children: [{data: "", type: r.Text}], type: r.CDATA};
				this._addDomElement(e), this._tagStack.push(e)
			}, n.prototype.oncommentend = n.prototype.oncdataend = function () {
				this._tagStack.pop()
			}, n.prototype.onprocessinginstruction = function (e, t) {
				this._addDomElement({name: e, data: t, type: r.Directive})
			}, t.exports = n
		}, {domelementtype: 35}], 37: [function (e, t) {
			var n = t.exports;
			["stringify", "traversal", "manipulation", "querying", "legacy", "helpers"].forEach(function (t) {
				var r = e("./lib/" + t);
				Object.keys(r).forEach(function (e) {
					n[e] = r[e].bind(n)
				})
			})
		}, {}], 38: [function (e, t) {
			!function (n) {
				function r(e) {
					return this instanceof r ? (l.call(this, e), u.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", i), void 0) : new r(e)
				}

				function i() {
					this.allowHalfOpen || this._writableState.ended || n.nextTick(this.end.bind(this))
				}

				t.exports = r;
				var o = e("util");
				if (!o.isUndefined) {
					var a = e("core-util-is");
					for (var s in a) o[s] = a[s]
				}
				var l = e("./_stream_readable"), u = e("./_stream_writable");
				o.inherits(r, l), Object.keys(u.prototype).forEach(function (e) {
					r.prototype[e] || (r.prototype[e] = u.prototype[e])
				})
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"./_stream_readable": 40,
			"./_stream_writable": 42,
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			"core-util-is": 43,
			util: 17
		}], 39: [function (e, t) {
			function n(e) {
				return this instanceof n ? (r.call(this, e), void 0) : new n(e)
			}

			t.exports = n;
			var r = e("./_stream_transform"), i = e("util");
			if (!i.isUndefined) {
				var o = e("core-util-is");
				for (var a in o) i[a] = o[a]
			}
			i.inherits(n, r), n.prototype._transform = function (e, t, n) {
				n(null, e)
			}
		}, {"./_stream_transform": 41, "core-util-is": 43, util: 17}], 40: [function (e, t) {
			!function (n, r) {
				function i(t) {
					t = t || {};
					var n = t.highWaterMark, r = t.objectMode ? 16 : 16384;
					this.highWaterMark = n || 0 === n ? n : r, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (L || (L = e("string_decoder/").StringDecoder), this.decoder = new L(t.encoding), this.encoding = t.encoding)
				}

				function o(e) {
					return this instanceof o ? (this._readableState = new i(e, this), this.readable = !0, k.call(this), void 0) : new o(e)
				}

				function a(e, t, n, r, i) {
					var o = c(t, n);
					if (o) e.emit("error", o); else if (S.isNullOrUndefined(n)) t.reading = !1, t.ended || f(e, t); else if (t.objectMode || n && n.length > 0) if (t.ended && !i) {
						var a = new Error("stream.push() after EOF");
						e.emit("error", a)
					} else if (t.endEmitted && i) {
						var a = new Error("stream.unshift() after end event");
						e.emit("error", a)
					} else !t.decoder || i || r || (n = t.decoder.write(n)), i || (t.reading = !1), t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (t.length += t.objectMode ? 1 : n.length, i ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && d(e)), p(e, t); else i || (t.reading = !1);
					return s(t)
				}

				function s(e) {
					return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
				}

				function l(e) {
					if (e >= M) e = M; else {
						e--;
						for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
						e++
					}
					return e
				}

				function u(e, t) {
					return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || S.isNull(e) ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = l(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
				}

				function c(e, t) {
					var n = null;
					return S.isBuffer(t) || S.isString(t) || S.isNullOrUndefined(t) || e.objectMode || n || (n = new TypeError("Invalid non-string/buffer chunk")), n
				}

				function f(e, t) {
					if (t.decoder && !t.ended) {
						var n = t.decoder.end();
						n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length)
					}
					t.ended = !0, d(e)
				}

				function d(e) {
					var t = e._readableState;
					t.needReadable = !1, t.emittedReadable || (T("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? n.nextTick(function () {
						h(e)
					}) : h(e))
				}

				function h(e) {
					T("emit readable"), e.emit("readable"), y(e)
				}

				function p(e, t) {
					t.readingMore || (t.readingMore = !0, n.nextTick(function () {
						m(e, t)
					}))
				}

				function m(e, t) {
					for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (T("maybeReadMore read 0"), e.read(0), n !== t.length);) n = t.length;
					t.readingMore = !1
				}

				function g(e) {
					return function () {
						var t = e._readableState;
						T("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && x.listenerCount(e, "data") && (t.flowing = !0, y(e))
					}
				}

				function v(e, t) {
					t.resumeScheduled || (t.resumeScheduled = !0, n.nextTick(function () {
						b(e, t)
					}))
				}

				function b(e, t) {
					t.resumeScheduled = !1, e.emit("resume"), y(e), t.flowing && !t.reading && e.read(0)
				}

				function y(e) {
					var t = e._readableState;
					if (T("flow", t.flowing), t.flowing) do var n = e.read(); while (null !== n && t.flowing)
				}

				function w(e, t) {
					var n, r = t.buffer, i = t.length, o = !!t.decoder, a = !!t.objectMode;
					if (0 === r.length) return null;
					if (0 === i) n = null; else if (a) n = r.shift(); else if (!e || e >= i) n = o ? r.join("") : C.concat(r, i), r.length = 0; else if (e < r[0].length) {
						var s = r[0];
						n = s.slice(0, e), r[0] = s.slice(e)
					} else if (e === r[0].length) n = r.shift(); else {
						n = o ? "" : new C(e);
						for (var l = 0, u = 0, c = r.length; c > u && e > l; u++) {
							var s = r[0], f = Math.min(e - l, s.length);
							o ? n += s.slice(0, f) : s.copy(n, l, 0, f), f < s.length ? r[0] = s.slice(f) : r.shift(), l += f
						}
					}
					return n
				}

				function _(e) {
					var t = e._readableState;
					if (t.length > 0) throw new Error("endReadable called on non-empty stream");
					t.endEmitted || (t.ended = !0, n.nextTick(function () {
						t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
					}))
				}

				t.exports = o, o.ReadableState = i;
				var x = e("events").EventEmitter;
				x.listenerCount || (x.listenerCount = function (e, t) {
					return e.listeners(t).length
				}), r.setImmediate || (r.setImmediate = function (e) {
					return setTimeout(e, 0)
				}), r.clearImmediate || (r.clearImmediate = function (e) {
					return clearTimeout(e)
				});
				var k = e("stream"), S = e("util"), C = e("buffer").Buffer;
				if (!S.isUndefined) {
					var A = e("core-util-is");
					for (var E in A) S[E] = A[E]
				}
				var L, T;
				if (S.debuglog) T = S.debuglog("stream"); else try {
					T = e("debuglog")("stream")
				} catch (D) {
					T = function () {
					}
				}
				S.inherits(o, k), o.prototype.push = function (e, t) {
					var n = this._readableState;
					return S.isString(e) && !n.objectMode && (t = t || n.defaultEncoding, t !== n.encoding && (e = new C(e, t), t = "")), a(this, n, e, t, !1)
				}, o.prototype.unshift = function (e) {
					var t = this._readableState;
					return a(this, t, e, "", !0)
				}, o.prototype.setEncoding = function (t) {
					return L || (L = e("string_decoder/").StringDecoder), this._readableState.decoder = new L(t), this._readableState.encoding = t, this
				};
				var M = 8388608;
				o.prototype.read = function (e) {
					T("read", e);
					var t = this._readableState, n = e;
					if ((!S.isNumber(e) || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return T("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? _(this) : d(this), null;
					if (e = u(e, t), 0 === e && t.ended) return 0 === t.length && _(this), null;
					var r = t.needReadable;
					T("need readable", r), (0 === t.length || t.length - e < t.highWaterMark) && (r = !0, T("length less than watermark", r)), (t.ended || t.reading) && (r = !1, T("reading or ended", r)), r && (T("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), r && !t.reading && (e = u(n, t));
					var i;
					return i = e > 0 ? w(e, t) : null, S.isNull(i) && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), n !== e && t.ended && 0 === t.length && _(this), S.isNull(i) || this.emit("data", i), i
				}, o.prototype._read = function () {
					this.emit("error", new Error("not implemented"))
				}, o.prototype.pipe = function (e, t) {
					function r(e) {
						T("onunpipe"), e === f && o()
					}

					function i() {
						T("onend"), e.end()
					}

					function o() {
						T("cleanup"), e.removeListener("close", l), e.removeListener("finish", u), e.removeListener("drain", m), e.removeListener("error", s), e.removeListener("unpipe", r), f.removeListener("end", i), f.removeListener("end", o), f.removeListener("data", a), !d.awaitDrain || e._writableState && !e._writableState.needDrain || m()
					}

					function a(t) {
						T("ondata");
						var n = e.write(t);
						!1 === n && (T("false write response, pause", f._readableState.awaitDrain), f._readableState.awaitDrain++, f.pause())
					}

					function s(t) {
						T("onerror", t), c(), e.removeListener("error", s), 0 === x.listenerCount(e, "error") && e.emit("error", t)
					}

					function l() {
						e.removeListener("finish", u), c()
					}

					function u() {
						T("onfinish"), e.removeListener("close", l), c()
					}

					function c() {
						T("unpipe"), f.unpipe(e)
					}

					var f = this, d = this._readableState;
					switch (d.pipesCount) {
						case 0:
							d.pipes = e;
							break;
						case 1:
							d.pipes = [d.pipes, e];
							break;
						default:
							d.pipes.push(e)
					}
					d.pipesCount += 1, T("pipe count=%d opts=%j", d.pipesCount, t);
					var h = (!t || t.end !== !1) && e !== n.stdout && e !== n.stderr, p = h ? i : o;
					d.endEmitted ? n.nextTick(p) : f.once("end", p), e.on("unpipe", r);
					var m = g(f);
					return e.on("drain", m), f.on("data", a), e._events && e._events.error ? Array.isArray(e._events.error) ? e._events.error.unshift(s) : e._events.error = [s, e._events.error] : e.on("error", s), e.once("close", l), e.once("finish", u), e.emit("pipe", f), d.flowing || (T("pipe resume"), f.resume()), e
				}, o.prototype.unpipe = function (e) {
					var t = this._readableState;
					if (0 === t.pipesCount) return this;
					if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);
					if (!e) {
						var n = t.pipes, r = t.pipesCount;
						t.pipes = null, t.pipesCount = 0, t.flowing = !1;
						for (var i = 0; r > i; i++) n[i].emit("unpipe", this);
						return this
					}
					var i = t.pipes.indexOf(e);
					return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
				}, o.prototype.on = function (e, t) {
					var r = k.prototype.on.call(this, e, t);
					if ("data" === e && !1 !== this._readableState.flowing && this.resume(), "readable" === e && this.readable) {
						var i = this._readableState;
						if (!i.readableListening) if (i.readableListening = !0, i.emittedReadable = !1, i.needReadable = !0, i.reading) i.length && d(this, i); else {
							var o = this;
							n.nextTick(function () {
								T("readable nexttick read 0"), o.read(0)
							})
						}
					}
					return r
				}, o.prototype.addListener = o.prototype.on, o.prototype.resume = function () {
					var e = this._readableState;
					return e.flowing || (T("resume"), e.flowing = !0, e.reading || (T("resume read 0"), this.read(0)), v(this, e)), this
				}, o.prototype.pause = function () {
					return T("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (T("pause"), this._readableState.flowing = !1, this.emit("pause")), this
				}, o.prototype.wrap = function (e) {
					var t = this._readableState, n = !1, r = this;
					e.on("end", function () {
						if (T("wrapped end"), t.decoder && !t.ended) {
							var e = t.decoder.end();
							e && e.length && r.push(e)
						}
						r.push(null)
					}), e.on("data", function (i) {
						if (T("wrapped data"), t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
							var o = r.push(i);
							o || (n = !0, e.pause())
						}
					});
					for (var i in e) S.isFunction(e[i]) && S.isUndefined(this[i]) && (this[i] = function (t) {
						return function () {
							return e[t].apply(e, arguments)
						}
					}(i));
					var o = ["error", "close", "destroy", "pause", "resume"];
					return o.forEach(function (t) {
						e.on(t, r.emit.bind(r, t))
					}), r._read = function (t) {
						T("wrapped _read", t), n && (n = !1, e.resume())
					}, r
				}, o._fromList = w
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			"core-util-is": 43,
			debuglog: 44,
			events: 2,
			stream: 9,
			"string_decoder/": 45,
			util: 17
		}], 41: [function (e, t) {
			function n(e, t) {
				this.afterTransform = function (e, n) {
					return r(t, e, n)
				}, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
			}

			function r(e, t, n) {
				var r = e._transformState;
				r.transforming = !1;
				var i = r.writecb;
				if (!i) return e.emit("error", new Error("no writecb in Transform class"));
				r.writechunk = null, r.writecb = null, s.isNullOrUndefined(n) || e.push(n), i && i(t);
				var o = e._readableState;
				o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
			}

			function i(e) {
				if (!(this instanceof i)) return new i(e);
				a.call(this, e), this._transformState = new n(e, this);
				var t = this;
				this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("prefinish", function () {
					s.isFunction(this._flush) ? this._flush(function (e) {
						o(t, e)
					}) : o(t)
				})
			}

			function o(e, t) {
				if (t) return e.emit("error", t);
				var n = e._writableState, r = e._transformState;
				if (n.length) throw new Error("calling transform done when ws.length != 0");
				if (r.transforming) throw new Error("calling transform done when still transforming");
				return e.push(null)
			}

			t.exports = i;
			var a = e("./_stream_duplex"), s = e("util");
			if (!s.isUndefined) {
				var l = e("core-util-is");
				for (var u in l) s[u] = l[u]
			}
			s.inherits(i, a), i.prototype.push = function (e, t) {
				return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t)
			}, i.prototype._transform = function () {
				throw new Error("not implemented")
			}, i.prototype._write = function (e, t, n) {
				var r = this._transformState;
				if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
					var i = this._readableState;
					(r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
				}
			}, i.prototype._read = function () {
				var e = this._transformState;
				s.isNull(e.writechunk) || !e.writecb || e.transforming ? e.needTransform = !0 : (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform))
			}
		}, {"./_stream_duplex": 38, "core-util-is": 43, util: 17}], 42: [function (e, t) {
			!function (n) {
				function r(e, t, n) {
					this.chunk = e, this.encoding = t, this.callback = n
				}

				function i(e, t) {
					e = e || {};
					var n = e.highWaterMark, r = e.objectMode ? 16 : 16384;
					this.highWaterMark = n || 0 === n ? n : r, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
					var i = e.decodeStrings === !1;
					this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
						h(t, e)
					}, this.writecb = null, this.writelen = 0, this.buffer = [], this.pendingcb = 0, this.prefinished = !1, this._errorEmitted = !1
				}

				function o(t) {
					return this instanceof o || this instanceof e("./_stream_duplex") ? (this._writableState = new i(t, this), this.writable = !0, C.call(this), void 0) : new o(t)
				}

				function a(e, t, r) {
					var i = new Error("write after end");
					e.emit("error", i), n.nextTick(function () {
						r(i)
					})
				}

				function s(e, t, r, i) {
					var o = !0;
					if (!(_.isBuffer(r) || _.isString(r) || _.isNullOrUndefined(r) || t.objectMode)) {
						var a = new TypeError("Invalid non-string/buffer chunk");
						e.emit("error", a), n.nextTick(function () {
							i(a)
						}), o = !1
					}
					return o
				}

				function l(e, t, n) {
					return !e.objectMode && e.decodeStrings !== !1 && _.isString(t) && (t = new x(t, n)), t
				}

				function u(e, t, n, i, o) {
					n = l(t, n, i), _.isBuffer(n) && (i = "buffer");
					var a = t.objectMode ? 1 : n.length;
					t.length += a;
					var s = t.length < t.highWaterMark;
					return s || (t.needDrain = !0), t.writing || t.corked ? t.buffer.push(new r(n, i, o)) : c(e, t, !1, a, n, i, o), s
				}

				function c(e, t, n, r, i, o, a) {
					t.writelen = r, t.writecb = a, t.writing = !0, t.sync = !0, n ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1
				}

				function f(e, t, r, i, o) {
					r ? n.nextTick(function () {
						t.pendingcb--, o(i)
					}) : (t.pendingcb--, o(i)), e.emit("error", i), e._errorEmitted = !0
				}

				function d(e) {
					e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
				}

				function h(e, t) {
					var r = e._writableState, i = r.sync, o = r.writecb;
					if (d(r), t) f(e, r, i, t, o); else {
						var a = v(e, r);
						a || r.corked || r.bufferProcessing || !r.buffer.length || g(e, r), i ? n.nextTick(function () {
							p(e, r, a, o)
						}) : p(e, r, a, o)
					}
				}

				function p(e, t, n, r) {
					n || m(e, t), t.pendingcb--, r(), y(e, t)
				}

				function m(e, t) {
					0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
				}

				function g(e, t) {
					if (t.bufferProcessing = !0, e._writev && t.buffer.length > 1) {
						for (var n = [], r = 0; r < t.buffer.length; r++) n.push(t.buffer[r].callback);
						t.pendingcb++, c(e, t, !0, t.length, t.buffer, "", function (e) {
							for (var r = 0; r < n.length; r++) t.pendingcb--, n[r](e)
						}), t.buffer = []
					} else {
						for (var r = 0; r < t.buffer.length; r++) {
							var i = t.buffer[r], o = i.chunk, a = i.encoding, s = i.callback,
								l = t.objectMode ? 1 : o.length;
							if (c(e, t, !1, l, o, a, s), t.writing) {
								r++;
								break
							}
						}
						r < t.buffer.length ? t.buffer = t.buffer.slice(r) : t.buffer.length = 0
					}
					t.bufferProcessing = !1
				}

				function v(e, t) {
					return t.ending && 0 === t.length && !t.finished && !t.writing
				}

				function b(e, t) {
					t.prefinished || (t.prefinished = !0, e.emit("prefinish"))
				}

				function y(e, t) {
					var n = v(e, t);
					return n && (0 === t.pendingcb ? (b(e, t), t.finished = !0, e.emit("finish")) : b(e, t)), n
				}

				function w(e, t, r) {
					t.ending = !0, y(e, t), r && (t.finished ? n.nextTick(r) : e.once("finish", r)), t.ended = !0
				}

				t.exports = o, o.WritableState = i;
				var _ = e("util"), x = e("buffer").Buffer;
				if (!_.isUndefined) {
					var k = e("core-util-is");
					for (var S in k) _[S] = k[S]
				}
				var C = e("stream");
				_.inherits(o, C), o.prototype.pipe = function () {
					this.emit("error", new Error("Cannot pipe. Not readable."))
				}, o.prototype.write = function (e, t, n) {
					var r = this._writableState, i = !1;
					return _.isFunction(t) && (n = t, t = null), _.isBuffer(e) ? t = "buffer" : t || (t = r.defaultEncoding), _.isFunction(n) || (n = function () {
					}), r.ended ? a(this, r, n) : s(this, r, e, n) && (r.pendingcb++, i = u(this, r, e, t, n)), i
				}, o.prototype.cork = function () {
					var e = this._writableState;
					e.corked++
				}, o.prototype.uncork = function () {
					var e = this._writableState;
					e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.buffer.length || g(this, e))
				}, o.prototype._write = function (e, t, n) {
					n(new Error("not implemented"))
				}, o.prototype._writev = null, o.prototype.end = function (e, t, n) {
					var r = this._writableState;
					_.isFunction(e) ? (n = e, e = null, t = null) : _.isFunction(t) && (n = t, t = null), _.isNullOrUndefined(e) || this.write(e, t), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || w(this, r, n)
				}
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			buffer: 5,
			"core-util-is": 43,
			stream: 9,
			util: 17
		}], 43: [function (e, t, n) {
			!function (e) {
				function t(e) {
					return Array.isArray(e)
				}

				function r(e) {
					return "boolean" == typeof e
				}

				function i(e) {
					return null === e
				}

				function o(e) {
					return null == e
				}

				function a(e) {
					return "number" == typeof e
				}

				function s(e) {
					return "string" == typeof e
				}

				function l(e) {
					return "symbol" == typeof e
				}

				function u(e) {
					return void 0 === e
				}

				function c(e) {
					return f(e) && "[object RegExp]" === v(e)
				}

				function f(e) {
					return "object" == typeof e && null !== e
				}

				function d(e) {
					return f(e) && "[object Date]" === v(e)
				}

				function h(e) {
					return f(e) && ("[object Error]" === v(e) || e instanceof Error)
				}

				function p(e) {
					return "function" == typeof e
				}

				function m(e) {
					return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
				}

				function g(t) {
					return e.isBuffer(t)
				}

				function v(e) {
					return Object.prototype.toString.call(e)
				}

				n.isArray = t, n.isBoolean = r, n.isNull = i, n.isNullOrUndefined = o, n.isNumber = a, n.isString = s, n.isSymbol = l, n.isUndefined = u, n.isRegExp = c, n.isObject = f, n.isDate = d, n.isError = h, n.isFunction = p, n.isPrimitive = m, n.isBuffer = g
			}.call(this, e("buffer").Buffer)
		}, {buffer: 5}], 44: [function (e, t, n) {
			!function (r) {
				function i(e) {
					if (e = e.toUpperCase(), !a[e]) if (new RegExp("\\b" + e + "\\b", "i").test(s)) {
						var t = r.pid;
						a[e] = function () {
							var r = o.format.apply(n, arguments);
							console.error("%s %d: %s", e, t, r)
						}
					} else a[e] = function () {
					};
					return a[e]
				}

				var o = e("util");
				t.exports = o.debuglog || i;
				var a = {}, s = r.env.NODE_DEBUG || ""
			}.call(this, e("/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
		}, {
			"/Users/forbeslindesay/GitHub/demos/node_modules/browserify-middleware/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 4,
			util: 17
		}], 45: [function (e, t, n) {
			function r(e) {
				if (e && !l(e)) throw new Error("Unknown encoding: " + e)
			}

			function i(e) {
				return e.toString(this.encoding)
			}

			function o(e) {
				var t = this.charReceived = e.length % 2;
				return this.charLength = t ? 2 : 0, t
			}

			function a(e) {
				var t = this.charReceived = e.length % 3;
				return this.charLength = t ? 3 : 0, t
			}

			var s = e("buffer").Buffer, l = s.isEncoding || function (e) {
				switch (e && e.toLowerCase()) {
					case"hex":
					case"utf8":
					case"utf-8":
					case"ascii":
					case"binary":
					case"base64":
					case"ucs2":
					case"ucs-2":
					case"utf16le":
					case"utf-16le":
					case"raw":
						return !0;
					default:
						return !1
				}
			}, u = n.StringDecoder = function (e) {
				switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), r(e), this.encoding) {
					case"utf8":
						this.surrogateSize = 3;
						break;
					case"ucs2":
					case"utf16le":
						this.surrogateSize = 2, this.detectIncompleteChar = o;
						break;
					case"base64":
						this.surrogateSize = 3, this.detectIncompleteChar = a;
						break;
					default:
						return this.write = i, void 0
				}
				this.charBuffer = new s(6), this.charReceived = 0, this.charLength = 0
			};
			u.prototype.write = function (e) {
				for (var t = "", n = 0; this.charLength;) {
					var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
					if (e.copy(this.charBuffer, this.charReceived, n, r), this.charReceived += r - n, n = r, this.charReceived < this.charLength) return "";
					t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
					var i = t.charCodeAt(t.length - 1);
					if (!(i >= 55296 && 56319 >= i)) {
						if (this.charReceived = this.charLength = 0, r == e.length) return t;
						e = e.slice(r, e.length);
						break
					}
					this.charLength += this.surrogateSize, t = ""
				}
				var o = this.detectIncompleteChar(e), a = e.length;
				this.charLength && (e.copy(this.charBuffer, 0, e.length - o, a), this.charReceived = o, a -= o), t += e.toString(this.encoding, 0, a);
				var a = t.length - 1, i = t.charCodeAt(a);
				if (i >= 55296 && 56319 >= i) {
					var s = this.surrogateSize;
					return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), this.charBuffer.write(t.charAt(t.length - 1), this.encoding), t.substring(0, a)
				}
				return t
			}, u.prototype.detectIncompleteChar = function (e) {
				for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
					var n = e[e.length - t];
					if (1 == t && 6 == n >> 5) {
						this.charLength = 2;
						break
					}
					if (2 >= t && 14 == n >> 4) {
						this.charLength = 3;
						break
					}
					if (3 >= t && 30 == n >> 3) {
						this.charLength = 4;
						break
					}
				}
				return t
			}, u.prototype.end = function (e) {
				var t = "";
				if (e && e.length && (t = this.write(e)), this.charReceived) {
					var n = this.charReceived, r = this.charBuffer, i = this.encoding;
					t += r.slice(0, n).toString(i)
				}
				return t
			}
		}, {buffer: 5}], 46: [function (e, t, n) {
			n = t.exports = e("./lib/_stream_readable.js"), n.Stream = e("stream"), n.Readable = n, n.Writable = e("./lib/_stream_writable.js"), n.Duplex = e("./lib/_stream_duplex.js"), n.Transform = e("./lib/_stream_transform.js"), n.PassThrough = e("./lib/_stream_passthrough.js")
		}, {
			"./lib/_stream_duplex.js": 38,
			"./lib/_stream_passthrough.js": 39,
			"./lib/_stream_readable.js": 40,
			"./lib/_stream_transform.js": 41,
			"./lib/_stream_writable.js": 42,
			stream: 9
		}], 47: [function (e, t) {
			"use strict";

			function n() {
			}

			function r(e, t) {
				this.object = e, this.state = t && t.state || t || new n
			}

			function i(e, t) {
				"string" == typeof t && (t = document.createTextNode(t));
				var n = document.createElement("span");
				return n.setAttribute("class", e), n.appendChild(t), n
			}

			var o = e("util"), a = e("insert-css");
			a(".object-explorer {background: white;padding: 1em;white-space: nowrap;overflow: auto;}.object-explorer .indent {padding-left: 1em;}.object-explorer .property-left {min-width: 10em;display: inline-block;}.object-explorer .expand-button {padding: 0.1em;margin: 0;font-size: 1em; height: auto;width: auto;background: none;border: none;color: black;outline: none;}.object-explorer .expand-button:hover {background: none;color: gray;}.object-explorer .property {color: #2AA198;}.object-explorer .number {color: #D33682;}.object-explorer .string {color: #859900;}.object-explorer .atom {color: #D33682;}"), t.exports = r, n.prototype.expand = function (e) {
				this["key:" + e.join(".")] = !0
			}, n.prototype.contract = function (e) {
				this["key:" + e.join(".")] = !1
			}, n.prototype.isExpanded = function (e) {
				return this["key:" + e.join(".")]
			}, r.prototype.appendTo = function (e) {
				var t = document.createElement("div");
				return t.setAttribute("class", "object-explorer"), t.appendChild(this.getNode(this.object, [])), e.appendChild(t)
			}, r.prototype.isExpanded = function (e) {
				return this.state.isExpanded(e)
			}, r.prototype.isInline = function (e) {
				return "string" == typeof e || "number" == typeof e ? !0 : e === !0 || e === !1 || null === e || void 0 === e ? !0 : Array.isArray(e) && 0 === e.length ? !0 : !Array.isArray(e) && e && "object" == typeof e && 0 === Object.keys(e).length ? !0 : !1
			}, r.prototype.getNode = function (e, t) {
				return "string" == typeof e || "number" == typeof e ? i(typeof e, o.inspect(e)) : e === !0 || e === !1 || null === e || void 0 === e ? i("atom", o.inspect(e)) : "[object Date]" === Object.prototype.toString.call(e) ? i("atom", e.toISOString()) : "[object RegExp]" === Object.prototype.toString.call(e) ? i("atom", e.toString()) : Array.isArray(e) ? this.getNodeForArray(e, t) : "object" == typeof e ? this.getNodeForObject(e, t) : void 0
			}, r.prototype.getExpandButton = function (e, t) {
				function n(e, t) {
					l[e] = t
				}

				function r() {
					a = !a, s.textContent = a ? o : i, a ? (l.expanded(), u.expand(t)) : (l.contracted(), u.contract(t))
				}

				var i = Array.isArray(e) ? "[+]" : "object" == typeof e ? "{+}" : "(+)",
					o = Array.isArray(e) ? "[-]" : "object" == typeof e ? "{-}" : "(-)", a = !1,
					s = document.createElement("button");
				s.setAttribute("class", "expand-button"), s.textContent = i;
				var l = {}, u = this.state;
				return s.addEventListener("click", r, !1), {node: s, on: n, toggle: r}
			}, r.prototype.getContractedNode = r.prototype.getNode, r.prototype.getNodeForArray = function (e, t) {
				if (0 === e.length) return document.createTextNode("[]");
				var n = this;
				e = e.map(function (e, r) {
					return n.getContractedNode(e, t.concat(r.toString()))
				});
				var r = document.createElement("div");
				return r.appendChild(document.createTextNode("[")), e.forEach(function (e) {
					var t = document.createElement("div");
					t.setAttribute("class", "indent"), t.appendChild(e), r.appendChild(t)
				}), r.appendChild(document.createTextNode("]")), r
			}, r.prototype.getNodeForObject = function (e, t) {
				if (0 === Object.keys(e).length) return document.createTextNode("{}");
				var n = this, r = document.createElement("div");
				return r.appendChild(document.createTextNode("{")), Object.keys(e).forEach(function (i) {
					r.appendChild(n.getNodeForProperty(i, e[i], "", t.concat(i)))
				}), r.appendChild(document.createTextNode("}")), r
			}, r.prototype.getNodeForProperty = function (e, t, n, r) {
				var o = document.createElement("div");
				o.setAttribute("class", "indent");
				var a = document.createElement("span");
				a.setAttribute("class", "property-left"), a.appendChild(i("property", e)), a.appendChild(document.createTextNode(": "));
				var s = i("property-right", n || "");
				if (this.isInline(t, r)) a.appendChild(this.getNode(t, r)), o.appendChild(a), o.appendChild(s); else {
					var l = this.getExpandButton(t, r);
					a.appendChild(l.node), o.appendChild(a), o.appendChild(s);
					var u = null, c = this;
					l.on("expanded", function () {
						null === u ? (u = c.getNode(t, r), o.appendChild(u)) : u.style.display = "block"
					}), l.on("contracted", function () {
						u.style.display = "none"
					}), this.isExpanded(r) && l.toggle()
				}
				return o
			}
		}, {"insert-css": 48, util: 17}], 48: [function (e, t) {
			var n = [];
			t.exports = function (e) {
				if (!(n.indexOf(e) >= 0)) {
					n.push(e);
					var t = document.createElement("style"), r = document.createTextNode(e);
					t.appendChild(r), document.head.childNodes.length ? document.head.insertBefore(t, document.head.childNodes[0]) : document.head.appendChild(t)
				}
			}
		}, {}]
	}, {}, 1);
}());


export {Parser};