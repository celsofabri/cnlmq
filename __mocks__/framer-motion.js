/* eslint-disable react/display-name */
const React = require("react")

const strip = ({ layout, layoutId, initial, animate, exit, transition, whileHover, whileTap, variants, ...rest }) => rest // eslint-disable-line no-unused-vars
const cache = {}
const m = new Proxy(
  {},
  {
    get: (_, tag) => {
      if (!cache[tag]) cache[tag] = React.forwardRef((props, ref) => React.createElement(tag, { ...strip(props), ref }))
      return cache[tag]
    },
  }
)
const Pass = ({ children }) => React.createElement(React.Fragment, null, children)

module.exports = { m, motion: m, AnimatePresence: Pass, LazyMotion: Pass, MotionConfig: Pass, domMax: {}, domAnimation: {} }
