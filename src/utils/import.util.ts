import Module from 'node:module'
const require = Module.createRequire(import.meta.url)
export class ImportUtil {
  static require = require
}
