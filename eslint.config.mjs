import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'public/**',
    'dist/**',
    '.venv/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      'max-len': [
        'error',
        { code: 100, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
]);

export default eslintConfig;
