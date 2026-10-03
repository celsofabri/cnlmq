module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js" },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/file-mock.js",
  },
  testPathIgnorePatterns: ["node_modules", "\\.cache", "public"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}
