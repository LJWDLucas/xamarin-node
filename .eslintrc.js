module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'airbnb-base',
  "globals": {
    "Config": true,
    "Root": true
  },
  "rules": {
    "no-confusing-arrow": "off",
    "no-param-reassign": "off",
    "import/no-dynamic-require": "off",
    "no-undef": "error",
    "no-underscore-dangle": "off",
    "max-len": ["error", 160, 2],
    "comma-dangle": ["error", "never"],
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "node_modules",
          "src",
          "test"
        ]
      }
    }
  }
};
