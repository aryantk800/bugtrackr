/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "script",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "warn",
    "quotes": ["warn", "double", { allowTemplateLiterals: true }],
    "no-console": "off",
    "require-jsdoc": "off",
    "no-undef": "off", // 👈 KEY FIX
  },
};
