const babelJest = require("babel-jest").default
module.exports = babelJest.createTransformer({
  presets: [["babel-preset-gatsby", { targets: { node: "current" }, reactRuntime: "automatic" }]],
})
