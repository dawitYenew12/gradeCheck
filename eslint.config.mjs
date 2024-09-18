import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import securityPlugin from 'eslint-plugin-security';

export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      security: securityPlugin,
    },
    rules: {
      ...prettier.rules,
      'no-console': 'off',
      'prettier/prettier': 'error',
      'consistent-return': 'off',
      'func-names': 'off',
      'arrow-body-style': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];
