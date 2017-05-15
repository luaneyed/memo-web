module.exports = {
  "extends": "airbnb",
  "globals": {
    "window": true,
  },
  "plugins": [
    "import",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    }
  },
  "rules": {
    "semi": ["error", "never"],
    "max-len": ["error", 120],
    "no-param-reassign": ["error", {"props": false}],
    "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
    "no-constant-condition": ["error", { "checkLoops": false }],
    "func-names": "off",
    "import/no-extraneous-dependencies": "off",
  }
};