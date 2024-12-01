import globals from 'globals'

export default [
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": ['error', { ignoreRestSiblings: true }],
      "no-undef": "error"
    },
    languageOptions: {
      globals: {
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    files: ["**/*.js"],
    rules: {
      // "no-unused-vars": 'off',
      // "no-undef": 'off'
    },
    languageOptions: {
      globals: {
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
]