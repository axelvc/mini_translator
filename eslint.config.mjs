import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import importPlugin from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  pluginPromise.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
   {
    extends: [
      js.configs.recommended,
      ...ts.configs.recommended,
      ...pluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'promise/always-return': 'off',
      'no-empty': 'off',
      'vue/no-textarea-mustache': 'off'
    },
  },
])
