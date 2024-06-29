// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['build/**', 'jest.config.js'],
    plugins: {
      jest
    },
    files: ["*.ts", "*.tsx"],
  }
);