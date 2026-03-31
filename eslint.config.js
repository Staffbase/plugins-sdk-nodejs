const pluginN = require("eslint-plugin-n");

module.exports = [
  {
    ignores: ["coverage/**/*.js", "dist/**/*.js"],
  },
  pluginN.configs["flat/recommended"],
];
