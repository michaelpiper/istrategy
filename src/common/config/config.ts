import dotenv from 'dotenv'
import { join, resolve } from 'path'
// import { type AddonConfigConstructor, type AddonConfig } from '../../factories/addon.config.js'
import { ABS_PATH, ConfigFactory } from '../../factories/config.factory.js'
const ENV_FILE_PATH = resolve(join(ABS_PATH, '.env'))
const isEnvFound = dotenv.config({ path: ENV_FILE_PATH })
if (isEnvFound.error != null) {
  throw new Error('Cannot find .env file.')
}

export class Config extends ConfigFactory {
  platformAudience: string | null
  platformPublicKey: string
  baseUrl: string | null
  apiBaseUrl: string | null
  static #instance = new Config(process.env)
  static get instance (): Config {
    return this.#instance
  }

  constructor (protected readonly _config: Record<string, string | undefined>) {
    super(_config)
    this.baseUrl = this.get('BASE_URL', null)
    this.apiBaseUrl = this.get('API_BASE_URL', null)
    this.platformAudience = this.get('PLATFORM_AUDIENCE', null)
    this.platformPublicKey = this.get('PLATFORM_PUBLIC_KEY', '123123')
  }
}
