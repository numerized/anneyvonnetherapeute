import {
  f,
  r as l,
  cu as P,
  j as t,
  bV as h,
  cv as j,
  cw as b,
  bz as B,
  bW as E,
  cx as H,
  bT as k,
  bM as I,
  cy as y,
  o as C,
} from './sanity-033f6ba9.js'
const T = f(C)`
  position: relative;
`
function v(a) {
  const { children: o } = a,
    { collapsed: n } = b()
  return t.jsx(T, { hidden: n, height: 'fill', overflow: 'auto', children: o })
}
function w(a) {
  const {
      actionHandlers: o,
      index: n,
      menuItems: e,
      menuItemGroups: r,
      title: c,
    } = a,
    { features: s } = B()
  return !(e != null && e.length) && !c
    ? null
    : t.jsx(E, {
        actions: t.jsx(H, {
          menuItems: e,
          menuItemGroups: r,
          actionHandlers: o,
        }),
        backButton:
          s.backButton &&
          n > 0 &&
          t.jsx(k, {
            as: I,
            'data-as': 'a',
            icon: y,
            mode: 'bleed',
            tooltipProps: { content: 'Back' },
          }),
        title: c,
      })
}
function U(a) {
  const { index: o, pane: n, paneKey: e, ...r } = a,
    {
      child: c,
      component: s,
      menuItems: u,
      menuItemGroups: d,
      type: R,
      ...p
    } = n,
    [i, x] = l.useState(null),
    { title: m = '' } = P(n)
  return t.jsxs(h, {
    id: e,
    minWidth: 320,
    selected: r.isSelected,
    children: [
      t.jsx(w, {
        actionHandlers: i == null ? void 0 : i.actionHandlers,
        index: o,
        menuItems: u,
        menuItemGroups: d,
        title: m,
      }),
      t.jsxs(v, {
        children: [
          j.isValidElementType(s) &&
            l.createElement(s, { ...r, ...p, ref: x, child: c, paneKey: e }),
          l.isValidElement(s) && s,
        ],
      }),
    ],
  })
}
export { U as default }
