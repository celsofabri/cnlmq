const React = require("react")
const gatsby = jest.requireActual("gatsby")

const Link = React.forwardRef(function Link(
  // eslint-disable-next-line no-unused-vars
  { to, activeClassName, partiallyActive, getProps, ...rest },
  ref
) {
  return React.createElement("a", { ...rest, ref, href: `/cnlmq${to}` })
})

module.exports = {
  ...gatsby,
  withPrefix: (path) => `/cnlmq${path}`,
  graphql: (strings) => strings[0],
  Link,
  useStaticQuery: jest.fn(),
}
