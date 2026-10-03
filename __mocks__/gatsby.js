const React = require("react")
const gatsby = jest.requireActual("gatsby")

// eslint-disable-next-line no-unused-vars
const Link = ({ to, activeClassName, partiallyActive, getProps, ...rest }) =>
  React.createElement("a", { ...rest, href: `/cnlmq${to}` })

module.exports = {
  ...gatsby,
  withPrefix: (path) => `/cnlmq${path}`,
  graphql: (strings) => strings[0],
  Link,
  useStaticQuery: jest.fn(),
}
