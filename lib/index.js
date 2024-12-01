import { ESLint, Linter } from 'eslint'
import fg from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'

const eslint = new ESLint()
const linter = new Linter()

/**
 * @param {string} dir 
 */
const processDirectory = async (dir) => {
  const entries = await fg(`${dir}/*`, {
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
      if (config) {
        const { language, ...rest } = config
        console.log(rest)
        const text = await fs.readFile(entry, 'utf8')
        const result = linter.verify(text, rest, { filename: path.basename(entry) })
        console.log(result)
      }
    }
  }
}

await processDirectory(process.cwd())
