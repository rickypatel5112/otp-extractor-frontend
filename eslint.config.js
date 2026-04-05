import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,

      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,

      jsxA11y.flatConfigs.recommended,

      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,

      prettierConfig,
    ],

    plugins: {
      prettier,
    },

    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        },
      },
    },

    rules: {
      // React 17+ (no need to import React)
      'react/react-in-jsx-scope': 'off',

      // TypeScript tweaks
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import order (clean code)
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
        },
      ],

      // Prettier integration
      'prettier/prettier': 'warn',
    },
  },
])
