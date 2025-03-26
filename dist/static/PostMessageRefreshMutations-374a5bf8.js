import { r as i, bc as f, bb as l, j as m } from './sanity-033f6ba9.js'
function v(r) {
  const {
      comlink: s,
      type: e,
      previewKitConnection: t,
      loadersConnection: a,
    } = r,
    n = i.useMemo(() => f(r.id), [r.id]),
    { draft: u, published: o, ready: c } = l(n, e, 'low')
  return (c && u) || o
    ? m.jsx(
        _,
        {
          comlink: s,
          draft: u,
          livePreviewEnabled: t === 'connected' || a === 'connected',
          published: o,
        },
        n,
      )
    : null
}
function _(r) {
  const { comlink: s, draft: e, published: t, livePreviewEnabled: a } = r,
    [n, u] = i.useState(e),
    [o, c] = i.useState(t)
  return (
    i.useEffect(() => {
      ;(n == null ? void 0 : n._rev) !== (e == null ? void 0 : e._rev) &&
        (i.startTransition(() => u(e)),
        e &&
          (s == null ||
            s.post({
              type: 'presentation/refresh',
              data: {
                source: 'mutation',
                livePreviewEnabled: a,
                document: d(e),
              },
            }))),
        (o == null ? void 0 : o._rev) !== (t == null ? void 0 : t._rev) &&
          (i.startTransition(() => c(t)),
          t &&
            (s == null ||
              s.post({
                type: 'presentation/refresh',
                data: {
                  source: 'mutation',
                  livePreviewEnabled: a,
                  document: d(t),
                },
              })))
    }, [s, e, a, n == null ? void 0 : n._rev, o == null ? void 0 : o._rev, t]),
    null
  )
}
function d(r) {
  const { _id: s, _type: e, _rev: t, slug: a } = r
  return { _id: s, _type: e, _rev: t, slug: a }
}
var E = i.memo(v)
export { E as default }
