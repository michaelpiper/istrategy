import { ErrorCode, ErrorDescription } from '../common/constants.js'
import { InternalServerError } from '../responses/serverErrors/internalServerError.serverError.js'
import { resolve } from 'path'
import { type AddonConfig, type AddonConfigConstructor } from './addon.config.js'
export const ABS_PATH = resolve('.')
export const APP_PATH = new URL('../', import.meta.url).pathname.replace(/\/$/, '')
export type SERVER_MODE = 'standalone' | 'combine'
export type LOG_LEVEL = '*' | 'debug' | 'info' | 'error' | 'off'
export interface CustomConfig {
  SERVER_MODE?: SERVER_MODE
  SERVER_APP?: string
  LOG_LEVEL?: LOG_LEVEL
  ENABLE_HTTP?: 'true' | 'false'
  ENABLE_SOCKET?: 'true' | 'false'
  USE_PUB_SOCKET?: 'true' | 'false'
}

export class ConfigFactory {
  serverPort!: number
  serverHostname!: string
  environment!: string
  appName!: string
  isProd!: boolean
  isTest!: boolean
  readonly productionEnvironments = ['prod', 'production']
  addons = new ConfigAddons<this>(this)
  readonly absPath = ABS_PATH
  serverMode: SERVER_MODE = 'combine'
  serverApp!: string
  serverMountAsRoot!: boolean
  appKeys: string[] = []
  LOG_LEVEL: string = '*'
  enableHTTP: boolean = true
  enableSocket: boolean = false
  readonly appPath = APP_PATH
  constructor (protected readonly _config: Record<Uppercase<string>, string | undefined>) {
    this._init()
  }

  _init () {
    this.environment = this.get('NODE_ENV', 'development')
    this.isProd = this.productionEnvironments.includes(this.environment)
    this.isTest = ['test'].includes(this.environment)
    this.serverPort = parseInt(this.get('PORT', '8080'), 10)
    this.serverHostname = this.get('HOSTNAME', '127.0.0.1')
    this.appName = this.get('APP_NAME', 'ZeroAnt')
    this.appKeys = this.get('APP_KEYS', 'shouldbereplace').split(',')
    this.serverMode = this.get<SERVER_MODE>('SERVER_MODE', 'combine')
    this.serverApp = this.get<string>('SERVER_APP', '*')
    this.LOG_LEVEL = this.get<string>('LOG_LEVEL', '*')
    this.enableHTTP = this.get<string>('ENABLE_HTTP', 'true').toLowerCase() === 'true'
    this.enableSocket = this.get<string>('ENABLE_SOCKET', 'false').toLowerCase() === 'true'
    this.serverMountAsRoot = this.get<string>('SERVER_MOUNT_AS_ROOT', 'on') === 'on'
  }

  logging (level: LOG_LEVEL, callback?: () => void): boolean {
    if (this.LOG_LEVEL === '*' || this.LOG_LEVEL.split(',').includes(level)) {
      if (callback !== undefined) {
        callback()
      }
      return true
    }
    return false
  }

  createDebugger (name: string) {
    return (level: LOG_LEVEL = 'info', message: string, ...args: any[]) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      this.logging(level, () => {
        const logger: (...arg: any[]) => void = (console as any)[level] ?? console.log
        logger(new Date(), `[${name}]:`, message, ...args)
      })
    }
  }

  get<T = any>(key: Uppercase<string>, defaultValue?: T): T {
    const value = this._config[key]
    if (value === null || value === undefined) {
      if (defaultValue === undefined) {
        throw new InternalServerError(ErrorCode.CONFIG_EXCEPTION, ErrorDescription.CONFIG_EXCEPTION, `Please provide a value for ${key} or a default fallback value in your config source`)
      }
      return defaultValue
    }
    return value as T
  }

  append (config: Record<Uppercase<string>, string | undefined>): this {
    Object.assign(this._config, config)
    this._init()
    return this
  }

  getAddon <T extends AddonConfig<ConfigFactory>>(Type: AddonConfigConstructor<T>): T {
    return this.addons.get<T>(Type)
  }

  setAddon (Addon: AddonConfigConstructor<AddonConfig<ConfigFactory>>): this {
    this.addons.set(Addon)
    return this
  }
}

class ConfigAddons<T extends ConfigFactory> {
  _addons = new Set()
  constructor (protected config: T) {
  }

  get<T extends AddonConfig<ConfigFactory>>(Type: AddonConfigConstructor<T>): T {
    for (const addon of this._addons.values()) {
      if (addon instanceof Type) {
        return addon
      }
    }
    throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, `${Type.name} you trying to get is not implemented`)
  }

  set (Addon: AddonConfigConstructor<AddonConfig<ConfigFactory>>): this {
    this._addons.add(new Addon(this.config))
    return this
  }
}
