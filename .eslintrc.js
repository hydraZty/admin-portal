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
    'react/jsx-filename-extension': ['warn', {'extensions': ['.js', '.jsx']}],
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
