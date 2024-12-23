import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ),
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'object-shorthand': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      semi: ['error', 'always'],
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: 1,
          when: 'multiline'
        }
      ]
    }
  },
  {
    ignores: ['prisma/generated/**']
  }
];

export default eslintConfig;
