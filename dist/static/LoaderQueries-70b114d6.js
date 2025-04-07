import {
  g as X,
  r as p,
  aV as H,
  aW as W,
  cb as L,
  cc as Q,
  u as Z,
  j as T,
  cd as k,
  ce as J,
} from './sanity-033f6ba9.js'
import {
  c as tt,
  a as et,
  g as rt,
  b as D,
} from './PresentationToolGrantsCheck-d4bc9173.js'
import { u as it, a as nt, b as st } from './hooks-677e236a.js'
import './DisplayedDocumentBroadcaster-d48e7790.js'
function I(e) {
  if (typeof e != 'function')
    throw new Error('obliterator/iterator: expecting a function!')
  this.next = e
}
typeof Symbol < 'u' &&
  (I.prototype[Symbol.iterator] = function () {
    return this
  })
I.of = function () {
  var e = arguments,
    r = e.length,
    t = 0
  return new I(function () {
    return t >= r ? { done: !0 } : { done: !1, value: e[t++] }
  })
}
I.empty = function () {
  var e = new I(function () {
    return { done: !0 }
  })
  return e
}
I.fromSequence = function (e) {
  var r = 0,
    t = e.length
  return new I(function () {
    return r >= t ? { done: !0 } : { done: !1, value: e[r++] }
  })
}
I.is = function (e) {
  return e instanceof I
    ? !0
    : typeof e == 'object' && e !== null && typeof e.next == 'function'
}
var ot = I,
  O = {}
O.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer < 'u'
O.SYMBOL_SUPPORT = typeof Symbol < 'u'
var $ = O,
  at = $.ARRAY_BUFFER_SUPPORT,
  ut = $.SYMBOL_SUPPORT,
  x = function (r, t) {
    var n, i, s, f, u
    if (!r) throw new Error('obliterator/forEach: invalid iterable.')
    if (typeof t != 'function')
      throw new Error('obliterator/forEach: expecting a callback.')
    if (
      Array.isArray(r) ||
      (at && ArrayBuffer.isView(r)) ||
      typeof r == 'string' ||
      r.toString() === '[object Arguments]'
    ) {
      for (s = 0, f = r.length; s < f; s++) t(r[s], s)
      return
    }
    if (typeof r.forEach == 'function') {
      r.forEach(t)
      return
    }
    if (
      (ut &&
        Symbol.iterator in r &&
        typeof r.next != 'function' &&
        (r = r[Symbol.iterator]()),
      typeof r.next == 'function')
    ) {
      for (n = r, s = 0; (u = n.next()), u.done !== !0; ) t(u.value, s), s++
      return
    }
    for (i in r) r.hasOwnProperty(i) && t(r[i], i)
  },
  j = {}
;(function (e) {
  var r = Math.pow(2, 8) - 1,
    t = Math.pow(2, 16) - 1,
    n = Math.pow(2, 32) - 1,
    i = Math.pow(2, 7) - 1,
    s = Math.pow(2, 15) - 1,
    f = Math.pow(2, 31) - 1
  ;(e.getPointerArray = function (o) {
    var a = o - 1
    if (a <= r) return Uint8Array
    if (a <= t) return Uint16Array
    if (a <= n) return Uint32Array
    throw new Error(
      'mnemonist: Pointer Array of size > 4294967295 is not supported.',
    )
  }),
    (e.getSignedPointerArray = function (o) {
      var a = o - 1
      return a <= i
        ? Int8Array
        : a <= s
          ? Int16Array
          : a <= f
            ? Int32Array
            : Float64Array
    }),
    (e.getNumberType = function (o) {
      return o === (o | 0)
        ? Math.sign(o) === -1
          ? o <= 127 && o >= -128
            ? Int8Array
            : o <= 32767 && o >= -32768
              ? Int16Array
              : Int32Array
          : o <= 255
            ? Uint8Array
            : o <= 65535
              ? Uint16Array
              : Uint32Array
        : Float64Array
    })
  var u = {
    Uint8Array: 1,
    Int8Array: 2,
    Uint16Array: 3,
    Int16Array: 4,
    Uint32Array: 5,
    Int32Array: 6,
    Float32Array: 7,
    Float64Array: 8,
  }
  ;(e.getMinimalRepresentation = function (o, a) {
    var c = null,
      l = 0,
      d,
      m,
      g,
      v,
      E
    for (v = 0, E = o.length; v < E; v++)
      (g = a ? a(o[v]) : o[v]),
        (m = e.getNumberType(g)),
        (d = u[m.name]),
        d > l && ((l = d), (c = m))
    return c
  }),
    (e.isTypedArray = function (o) {
      return typeof ArrayBuffer < 'u' && ArrayBuffer.isView(o)
    }),
    (e.concat = function () {
      var o = 0,
        a,
        c,
        l
      for (a = 0, l = arguments.length; a < l; a++) o += arguments[a].length
      var d = new arguments[0].constructor(o)
      for (a = 0, c = 0; a < l; a++)
        d.set(arguments[a], c), (c += arguments[a].length)
      return d
    }),
    (e.indices = function (o) {
      for (var a = e.getPointerArray(o), c = new a(o), l = 0; l < o; l++)
        c[l] = l
      return c
    })
})(j)
var C = {},
  G = x,
  Y = j
function ht(e) {
  return Array.isArray(e) || Y.isTypedArray(e)
}
function V(e) {
  if (typeof e.length == 'number') return e.length
  if (typeof e.size == 'number') return e.size
}
function ft(e) {
  var r = V(e),
    t = typeof r == 'number' ? new Array(r) : [],
    n = 0
  return (
    G(e, function (i) {
      t[n++] = i
    }),
    t
  )
}
function ct(e) {
  var r = V(e),
    t = typeof r == 'number' ? Y.getPointerArray(r) : Array,
    n = typeof r == 'number' ? new Array(r) : [],
    i = typeof r == 'number' ? new t(r) : [],
    s = 0
  return (
    G(e, function (f) {
      ;(n[s] = f), (i[s] = s++)
    }),
    [n, i]
  )
}
C.isArrayLike = ht
C.guessLength = V
C.toArray = ft
C.toArrayWithIndices = ct
var B = ot,
  dt = x,
  lt = j,
  pt = C
function y(e, r, t) {
  if (
    (arguments.length < 2 && ((t = e), (e = null), (r = null)),
    (this.capacity = t),
    typeof this.capacity != 'number' || this.capacity <= 0)
  )
    throw new Error('mnemonist/lru-cache: capacity should be positive number.')
  if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity)
    throw new Error(
      'mnemonist/lru-cache: capacity should be a finite positive integer.',
    )
  var n = lt.getPointerArray(t)
  ;(this.forward = new n(t)),
    (this.backward = new n(t)),
    (this.K = typeof e == 'function' ? new e(t) : new Array(t)),
    (this.V = typeof r == 'function' ? new r(t) : new Array(t)),
    (this.size = 0),
    (this.head = 0),
    (this.tail = 0),
    (this.items = {})
}
y.prototype.clear = function () {
  ;(this.size = 0), (this.head = 0), (this.tail = 0), (this.items = {})
}
y.prototype.splayOnTop = function (e) {
  var r = this.head
  if (this.head === e) return this
  var t = this.backward[e],
    n = this.forward[e]
  return (
    this.tail === e ? (this.tail = t) : (this.backward[n] = t),
    (this.forward[t] = n),
    (this.backward[r] = e),
    (this.head = e),
    (this.forward[e] = r),
    this
  )
}
y.prototype.set = function (e, r) {
  var t = this.items[e]
  if (typeof t < 'u') {
    this.splayOnTop(t), (this.V[t] = r)
    return
  }
  this.size < this.capacity
    ? (t = this.size++)
    : ((t = this.tail),
      (this.tail = this.backward[t]),
      delete this.items[this.K[t]]),
    (this.items[e] = t),
    (this.K[t] = e),
    (this.V[t] = r),
    (this.forward[t] = this.head),
    (this.backward[this.head] = t),
    (this.head = t)
}
y.prototype.setpop = function (e, r) {
  var t = null,
    n = null,
    i = this.items[e]
  return typeof i < 'u'
    ? (this.splayOnTop(i),
      (t = this.V[i]),
      (this.V[i] = r),
      { evicted: !1, key: e, value: t })
    : (this.size < this.capacity
        ? (i = this.size++)
        : ((i = this.tail),
          (this.tail = this.backward[i]),
          (t = this.V[i]),
          (n = this.K[i]),
          delete this.items[n]),
      (this.items[e] = i),
      (this.K[i] = e),
      (this.V[i] = r),
      (this.forward[i] = this.head),
      (this.backward[this.head] = i),
      (this.head = i),
      n ? { evicted: !0, key: n, value: t } : null)
}
y.prototype.has = function (e) {
  return e in this.items
}
y.prototype.get = function (e) {
  var r = this.items[e]
  if (!(typeof r > 'u')) return this.splayOnTop(r), this.V[r]
}
y.prototype.peek = function (e) {
  var r = this.items[e]
  if (!(typeof r > 'u')) return this.V[r]
}
y.prototype.forEach = function (e, r) {
  r = arguments.length > 1 ? r : this
  for (
    var t = 0,
      n = this.size,
      i = this.head,
      s = this.K,
      f = this.V,
      u = this.forward;
    t < n;

  )
    e.call(r, f[i], s[i], this), (i = u[i]), t++
}
y.prototype.keys = function () {
  var e = 0,
    r = this.size,
    t = this.head,
    n = this.K,
    i = this.forward
  return new B(function () {
    if (e >= r) return { done: !0 }
    var s = n[t]
    return e++, e < r && (t = i[t]), { done: !1, value: s }
  })
}
y.prototype.values = function () {
  var e = 0,
    r = this.size,
    t = this.head,
    n = this.V,
    i = this.forward
  return new B(function () {
    if (e >= r) return { done: !0 }
    var s = n[t]
    return e++, e < r && (t = i[t]), { done: !1, value: s }
  })
}
y.prototype.entries = function () {
  var e = 0,
    r = this.size,
    t = this.head,
    n = this.K,
    i = this.V,
    s = this.forward
  return new B(function () {
    if (e >= r) return { done: !0 }
    var f = n[t],
      u = i[t]
    return e++, e < r && (t = s[t]), { done: !1, value: [f, u] }
  })
}
typeof Symbol < 'u' && (y.prototype[Symbol.iterator] = y.prototype.entries)
y.prototype.inspect = function () {
  for (var e = new Map(), r = this.entries(), t; (t = r.next()), !t.done; )
    e.set(t.value[0], t.value[1])
  return (
    Object.defineProperty(e, 'constructor', { value: y, enumerable: !1 }), e
  )
}
typeof Symbol < 'u' &&
  (y.prototype[Symbol.for('nodejs.util.inspect.custom')] = y.prototype.inspect)
y.from = function (e, r, t, n) {
  if (arguments.length < 2) {
    if (((n = pt.guessLength(e)), typeof n != 'number'))
      throw new Error(
        'mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.',
      )
  } else arguments.length === 2 && ((n = r), (r = null), (t = null))
  var i = new y(r, t, n)
  return (
    dt(e, function (s, f) {
      i.set(f, s)
    }),
    i
  )
}
var yt = y,
  M = yt,
  mt = x,
  vt = j,
  wt = C
function S(e, r, t) {
  arguments.length < 2 ? M.call(this, e) : M.call(this, e, r, t)
  var n = vt.getPointerArray(this.capacity)
  ;(this.deleted = new n(this.capacity)), (this.deletedSize = 0)
}
for (var F in M.prototype) S.prototype[F] = M.prototype[F]
typeof Symbol < 'u' &&
  (S.prototype[Symbol.iterator] = M.prototype[Symbol.iterator])
S.prototype.clear = function () {
  M.prototype.clear.call(this), (this.deletedSize = 0)
}
S.prototype.set = function (e, r) {
  var t = this.items[e]
  if (typeof t < 'u') {
    this.splayOnTop(t), (this.V[t] = r)
    return
  }
  this.size < this.capacity
    ? (this.deletedSize > 0
        ? (t = this.deleted[--this.deletedSize])
        : (t = this.size),
      this.size++)
    : ((t = this.tail),
      (this.tail = this.backward[t]),
      delete this.items[this.K[t]]),
    (this.items[e] = t),
    (this.K[t] = e),
    (this.V[t] = r),
    (this.forward[t] = this.head),
    (this.backward[this.head] = t),
    (this.head = t)
}
S.prototype.setpop = function (e, r) {
  var t = null,
    n = null,
    i = this.items[e]
  return typeof i < 'u'
    ? (this.splayOnTop(i),
      (t = this.V[i]),
      (this.V[i] = r),
      { evicted: !1, key: e, value: t })
    : (this.size < this.capacity
        ? (this.deletedSize > 0
            ? (i = this.deleted[--this.deletedSize])
            : (i = this.size),
          this.size++)
        : ((i = this.tail),
          (this.tail = this.backward[i]),
          (t = this.V[i]),
          (n = this.K[i]),
          delete this.items[n]),
      (this.items[e] = i),
      (this.K[i] = e),
      (this.V[i] = r),
      (this.forward[i] = this.head),
      (this.backward[this.head] = i),
      (this.head = i),
      n ? { evicted: !0, key: n, value: t } : null)
}
S.prototype.delete = function (e) {
  var r = this.items[e]
  if (typeof r > 'u') return !1
  if ((delete this.items[e], this.size === 1))
    return (
      (this.size = 0),
      (this.head = 0),
      (this.tail = 0),
      (this.deletedSize = 0),
      !0
    )
  var t = this.backward[r],
    n = this.forward[r]
  return (
    this.head === r && (this.head = n),
    this.tail === r && (this.tail = t),
    (this.forward[t] = n),
    (this.backward[n] = t),
    this.size--,
    (this.deleted[this.deletedSize++] = r),
    !0
  )
}
S.prototype.remove = function (e, r = void 0) {
  var t = this.items[e]
  if (typeof t > 'u') return r
  var n = this.V[t]
  if ((delete this.items[e], this.size === 1))
    return (
      (this.size = 0),
      (this.head = 0),
      (this.tail = 0),
      (this.deletedSize = 0),
      n
    )
  var i = this.backward[t],
    s = this.forward[t]
  return (
    this.head === t && (this.head = s),
    this.tail === t && (this.tail = i),
    (this.forward[i] = s),
    (this.backward[s] = i),
    this.size--,
    (this.deleted[this.deletedSize++] = t),
    n
  )
}
S.from = function (e, r, t, n) {
  if (arguments.length < 2) {
    if (((n = wt.guessLength(e)), typeof n != 'number'))
      throw new Error(
        'mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.',
      )
  } else arguments.length === 2 && ((n = r), (r = null), (t = null))
  var i = new S(r, t, n)
  return (
    mt(e, function (s, f) {
      i.set(f, s)
    }),
    i
  )
}
var gt = S
const At = X(gt)
function zt(e) {
  const {
      liveDocument: r,
      controller: t,
      perspective: n,
      documentsOnPage: i,
      onLoadersConnection: s,
      onDocumentsOnPage: f,
    } = e,
    [u, o] = p.useState(),
    [a, c] = p.useState({}),
    l = H(),
    d = W()
  p.useEffect(() => {
    const w = setInterval(
      () =>
        c((h) => {
          if (Object.keys(h).length < 1) return h
          const b = Date.now()
          if (
            !Object.values(h).some(
              (R) => R.heartbeat !== !1 && b > R.receivedAt + R.heartbeat,
            )
          )
            return h
          const A = {}
          for (const [R, z] of Object.entries(h))
            (z.heartbeat !== !1 && b > z.receivedAt + z.heartbeat) || (A[R] = z)
          return A
        }),
      L,
    )
    return () => clearInterval(w)
  }, []),
    p.useEffect(() => {
      if (t) {
        const w = t.createConnection(
          { name: 'presentation', connectTo: 'loaders', heartbeat: !0 },
          tt().provide({ actors: et() }),
        )
        return (
          o(w),
          w.onStatus(s),
          w.on('loader/documents', (h) => {
            h.projectId === l &&
              h.dataset === d &&
              f('loaders', h.perspective, h.documents)
          }),
          w.on('loader/query-listen', (h) => {
            if (h.projectId === l && h.dataset === d) {
              if (typeof h.heartbeat == 'number' && h.heartbeat < L)
                throw new Error(
                  `Loader query listen heartbeat interval must be at least ${L}ms`,
                )
              c((b) => ({
                ...b,
                [rt(h.query, h.params)]: {
                  perspective: h.perspective,
                  query: h.query,
                  params: h.params,
                  receivedAt: Date.now(),
                  heartbeat: h.heartbeat ?? !1,
                },
              }))
            }
          }),
          w.start()
        )
      }
    }, [t, d, f, s, l])
  const [m] = p.useState(() => new At(Q)),
    g = Z({ apiVersion: '2023-10-16' }),
    v = p.useMemo(() => g.config(), [g]),
    E = p.useMemo(
      () => g.withConfig({ resultSourceMap: 'withKeyArraySelector' }),
      [g],
    )
  p.useEffect(() => {
    if (u) {
      const { projectId: w, dataset: h } = v
      u.post({
        type: 'loader/perspective',
        data: { projectId: w, dataset: h, perspective: n },
      })
    }
  }, [u, v, n])
  const U = p.useMemo(() => {
      const w = i.map(({ _id: A }) => A),
        h = [...new Set(w)],
        b = m.capacity
      return h.length >= b && (h.length = b), h
    }, [m.capacity, i]),
    [P, _] = p.useState(0)
  return T.jsxs(T.Fragment, {
    children: [
      T.jsx(bt, {
        cache: m,
        client: E,
        turboIds: U,
        setDocumentsCacheLastUpdated: _,
      }),
      Object.entries(a).map(([w, { query: h, params: b, perspective: A }]) =>
        T.jsx(
          It,
          {
            cache: m,
            projectId: v.projectId,
            dataset: v.dataset,
            perspective: A,
            query: h,
            params: b,
            comlink: u,
            client: E,
            refreshInterval: n ? 2e3 : 0,
            liveDocument: r,
            documentsCacheLastUpdated: P,
          },
          `${w}${A}`,
        ),
      ),
    ],
  })
}
const bt = p.memo(function (e) {
    const {
        cache: r,
        client: t,
        turboIds: n,
        setDocumentsCacheLastUpdated: i,
      } = e,
      [s, f] = p.useState([])
    return (
      p.useEffect(() => {
        const u = new Set(s.flat()),
          o = new Set()
        for (const c of n) !u.has(c) && !r.has(c) && o.add(c)
        const a = [...o].slice(0, k)
        a.length !== 0 && f((c) => [...c.slice(-k), a])
      }, [s, r, n]),
      p.useEffect(() => {
        const u = t
          .listen(
            '*',
            {},
            {
              events: ['mutation'],
              effectFormat: 'mendoza',
              includePreviousRevision: !1,
              includeResult: !1,
              tag: 'presentation-loader',
            },
          )
          .subscribe((o) => {
            var c, l
            if (
              (o.type === 'mutation' &&
                o.transition === 'disappear' &&
                r.delete(o.documentId) &&
                i(Date.now()),
              o.type !== 'mutation' ||
                !(
                  (l = (c = o.effects) == null ? void 0 : c.apply) != null &&
                  l.length
                ))
            )
              return
            const a = r.peek(o.documentId)
            if (a) {
              const d = { ...a }
              delete d._rev
              const m = J(d, o.effects.apply)
              r.set(o.documentId, m), i(Date.now())
            }
          })
        return () => u.unsubscribe()
      }, [r, t, i]),
      T.jsx(T.Fragment, {
        children: s.map((u) =>
          T.jsx(
            q,
            { cache: r, client: t, ids: u, setDocumentsCacheLastUpdated: i },
            JSON.stringify(u),
          ),
        ),
      })
    )
  }),
  q = p.memo(function (e) {
    const { client: r, cache: t, ids: n, setDocumentsCacheLastUpdated: i } = e
    return (
      p.useEffect(() => {
        const s = n.filter((f) => !t.has(f))
        s.length !== 0 &&
          r.getDocuments(s).then((f) => {
            for (const u of f)
              u && u != null && u._id && (t.set(u._id, u), i(Date.now()))
          }, console.error)
      }, [t, r, n, i]),
      null
    )
  })
q.displayName = 'GetDocuments'
function It(e) {
  const {
      cache: r,
      projectId: t,
      dataset: n,
      perspective: i,
      query: s,
      client: f,
      refreshInterval: u,
      liveDocument: o,
      comlink: a,
      documentsCacheLastUpdated: c,
    } = e,
    l = it(e.params),
    d = St({
      cache: r,
      client: f,
      liveDocument: o,
      params: l,
      perspective: i,
      query: s,
      refreshInterval: u,
      documentsCacheLastUpdated: c,
    }),
    m = d == null ? void 0 : d.result,
    g = d == null ? void 0 : d.resultSourceMap,
    v = d == null ? void 0 : d.tags
  return (
    p.useEffect(() => {
      g &&
        (a == null ||
          a.post({
            type: 'loader/query-change',
            data: {
              projectId: t,
              dataset: n,
              perspective: i,
              query: s,
              params: l,
              result: m,
              resultSourceMap: g,
              tags: v,
            },
          }))
    }, [a, n, l, i, t, s, m, g, v]),
    null
  )
}
function St(e) {
  const {
      cache: r,
      liveDocument: t,
      client: n,
      refreshInterval: i,
      query: s,
      params: f,
      perspective: u,
      documentsCacheLastUpdated: o,
    } = e,
    [a, c] = p.useState(null),
    { projectId: l, dataset: d } = p.useMemo(() => {
      const { projectId: P, dataset: _ } = n.config()
      return { projectId: P, dataset: _ }
    }, [n]),
    [m, g] = p.useState(null)
  if (m) throw m
  const [v, E] = nt({ refreshInterval: i }),
    U = v === 'refresh' || v === 'inflight'
  return (
    p.useEffect(() => {
      if (!U) return
      let P = !1,
        _ = !1
      const w = new AbortController()
      async function h() {
        const { signal: A } = w
        _ = !0
        const {
          result: R,
          resultSourceMap: z,
          syncTags: K,
        } = await n.fetch(s, f, {
          tag: 'presentation-loader',
          signal: A,
          perspective: u,
          filterResponse: !1,
        })
        ;(_ = !1),
          A.aborted || (c({ result: R, resultSourceMap: z, tags: K }), (P = !0))
      }
      const b = E()
      return (
        h()
          .catch((A) => {
            ;(_ = !1), A.name !== 'AbortError' && g(A)
          })
          .finally(b),
        () => {
          !P && !_ && w.abort()
        }
      )
    }, [n, d, t, f, u, l, s, U, E]),
    p.useMemo(
      () =>
        o && a != null && a.resultSourceMap
          ? {
              result: Et(r, t, a.result, u, a.resultSourceMap),
              resultSourceMap: a.resultSourceMap,
            }
          : a,
      [r, o, t, u, a],
    )
  )
}
let N = !1
function Et(e, r, t, n, i) {
  if (n === 'raw')
    throw new Error(
      'turboChargeResultIfSourceMap does not support raw perspective',
    )
  return st(
    t,
    i,
    (s) => {
      if (s._projectId) {
        N ||
          (console.warn(
            'Cross dataset references are not supported yet, ignoring source document',
            s,
          ),
          (N = !0))
        return
      }
      return r != null && r._id && D(r._id) === D(s._id) ? r : e.get(s._id)
    },
    (s, { previousValue: f }) =>
      typeof s == 'number' && typeof f == 'string' ? `${s}` : s,
    n,
  )
}
export { zt as default, Et as turboChargeResultIfSourceMap }
