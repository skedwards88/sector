module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
    "shared-node-browser": true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off",
  },
  ignorePatterns: ["dist/*"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
