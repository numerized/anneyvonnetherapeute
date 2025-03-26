import { r, bw as s } from './sanity-033f6ba9.js'
import { u } from './DisplayedDocumentBroadcaster-d48e7790.js'
function c(a) {
  const e = u(),
    t = s(!1)
  return (
    r.useEffect(() => {
      const o = setTimeout(() => (e == null ? void 0 : e(a.value)), 10)
      return () => clearTimeout(o)
    }, [t == null ? void 0 : t.perspective, a.value, e]),
    null
  )
}
var i = r.memo(c)
export { i as default }
