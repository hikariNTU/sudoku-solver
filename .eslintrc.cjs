// eslint-disable-next-line no-undef
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'import'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-trailing-spaces': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'no-multiple-empty-lines': 'warn',
    'eol-last': 'warn',
    eqeqeq: 'error',
    'import/order': [
      'warn',
      {
        distinctGroup: true,
        'newlines-between': 'always',
        groups: [
          'type',
          'builtin',
          'external',
          'index',
          'internal',
          'parent',
          'sibling',
          'object',
        ],
        alphabetize: {
          order: 'asc',
        },
        pathGroups: [
          {
            pattern: '+(react|recoil)',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '{.,..}/**/*.(scss|css|svg)',
            patternOptions: { matchBase: true },
            group: 'object',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'recoil'],
        warnOnUnassignedImports: true,
      },
    ],
  },
}
