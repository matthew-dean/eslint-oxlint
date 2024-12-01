import { ESLint, Linter } from 'eslint'
import fg from 'fast-glob'

const eslint = new ESLint()
const linter = new Linter()

/**
 * @param {string} path 
 */
const processDirectory = async (path) => {
  const entries = await fg(`${path}/*`, {
    onlyFiles: false,
    markDirectories: true
  })
  for (const entry of entries) {
    if (entry.endsWith('node_modules/')) {
      continue
    }
    if (entry.endsWith('/')) {
      await processDirectory(entry)
    } else {
      const config = await eslint.calculateConfigForFile(entry)
      console.log(entry, !!config)
    }
  }
}

await processDirectory(process.cwd())
