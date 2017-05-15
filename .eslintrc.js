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
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      // "imports": "never",
      "exports": "always-multiline",
      "functions": "never",
    }],
    "jsx-a11y/no-static-element-interactions": "off",
    "react/jsx-closing-bracket-location": "off",
    "brace-style": "off",
    "arrow-parens": "off",
    "react/no-unused-prop-types": "off",
    "no-underscore-dangle": ["error", { "allow": ["_refs", "_id"] }],
    "react/sort-comp": ["error", {
      order: [
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'getInitialState',
          'state',
          'getChildContext',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount'
        ]
      }
    }],
    "react/no-did-update-set-state": "off",
  }
};