import { r as s } from './sanity-033f6ba9.js'
const r = (t) => {
  const { comlink: e } = t
  return (
    s.useEffect(
      () =>
        e.on('visual-editing/features', () => ({
          features: { optimistic: !0 },
        })),
      [e],
    ),
    null
  )
}
var o = s.memo(r)
export { o as default }
