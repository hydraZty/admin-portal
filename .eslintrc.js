module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  parser: 'babel-eslint',
  rules: {
    'semi': [
      'error',
      'always',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'indent': ['error', 2],
    'arrow-parens': 'off',
    'import/extensions': ['off', 'never'],
    'operator-linebreak': ['error', 'after'],
    'react/jsx-one-expression-per-line': ['off', 'never'],
    'space-before-function-paren': ['off', 'always'],
    'react/destructuring-assignment': ['off', 'never'],
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': ['warn', {'extensions': ['.js', '.jsx']}],
    'react/jsx-props-no-spreading': 'off',
  },
  'overrides': [
    {
      'files': [
        'src/serviceWorker.js',
      ],
      'rules': {
        'no-console': 'off',
        'no-param-reassign': 'off',
      },
    },
  ],
};
