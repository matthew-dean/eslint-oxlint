import { ESLint, Linter } from 'eslint'
import fg from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as Rules from 'eslint-plugin-oxlint/rules-by-category'

/** @type {Record<string, any>} */
const rules = {}

for (const obj of Object.values(Rules)) {
  Object.assign(rules, obj)
}

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
      const initialConfig = await eslint.calculateConfigForFile(entry)
      if (initialConfig) {
        const { language, ...config } = initialConfig
        for (const [key] of Object.entries(config.rules)) {
          if (rules[key]) {
            config.rules[key] = rules[key]
          }
        }
        const text = await fs.readFile(entry, 'utf8')
        const result = linter.verify(text, config, { filename: path.basename(entry) })
        console.log(entry, result)
      }
    }
  }
}

await processDirectory(process.cwd())
