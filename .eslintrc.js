module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/no-unstable-nested-components': [
      'off',
      {
        allowAsProps: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        'files.eol': '\n',
      },
    ],
  },
};
