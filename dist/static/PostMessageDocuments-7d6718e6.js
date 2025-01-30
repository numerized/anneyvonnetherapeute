import {
  r as a,
  u as f,
  at as d,
  ad as i,
  ch as y,
  ci as b,
  cj as v,
} from './sanity-033f6ba9.js'
const g = (c) => {
  const { comlink: t } = c,
    n = f({ apiVersion: d })
  return (
    a.useEffect(() => {
      const s = n
          .listen(
            '*[!(_id in path("_.**"))]',
            {},
            {
              effectFormat: 'mendoza',
              events: ['welcome', 'mutation', 'reconnect'],
              includePreviousRevision: !1,
              includeResult: !1,
              tag: 'presentation-documents',
              visibility: 'transaction',
            },
          )
          .pipe(
            i(
              (e) =>
                e.type === 'welcome' ||
                e.type === 'reconnect' ||
                e.type === 'mutation',
            ),
          ),
        o = s.pipe(
          i((e) => e.type === 'welcome'),
          y({ bufferSize: 1, refCount: !1 }),
        ),
        u = t.on('visual-editing/snapshot-welcome', async () => ({
          event: await new Promise((e) => {
            o.pipe(b()).subscribe((l) => {
              e(l)
            })
          }),
        })),
        r = s.pipe(i((e) => e.type === 'reconnect')),
        p = s.pipe(i((e) => e.type === 'mutation')),
        m = v(o, p, r).subscribe((e) => {
          t.post({ type: 'presentation/snapshot-event', data: { event: e } })
        })
      return () => {
        u(), m.unsubscribe()
      }
    }, [n, t]),
    a.useEffect(
      () =>
        t.on('visual-editing/fetch-snapshot', async (s) => ({
          snapshot: await n.getDocument(s.documentId, {
            tag: 'document.snapshots',
          }),
        })),
      [n, t],
    ),
    a.useEffect(
      () =>
        t.on('visual-editing/mutate', async (s) =>
          n.dataRequest('mutate', s, {
            visibility: 'async',
            returnDocuments: !0,
          }),
        ),
      [n, t],
    ),
    null
  )
}
var w = a.memo(g)
export { w as default }
