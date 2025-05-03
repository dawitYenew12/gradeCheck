const globals = require('globals');
const pluginJs = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const securityPlugin = require('eslint-plugin-security');

module.exports = [
  pluginJs.configs.recommended,

  // Apply sourceType: 'module' to .js and .mjs files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'no-console': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'arrow-body-style': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];
