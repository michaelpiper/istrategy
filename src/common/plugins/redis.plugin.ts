import redis from 'redis'
import { AddonPlugin } from '../../factories/addon.plugin.js'
import { Redis, type RedisOptions } from 'ioredis'
import { RedisConfig } from 'common/config/redis.config.js'
import { type JsonValue } from '@prisma/client/runtime/library.js'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { type ConfigFactory } from 'factories/config.factory.js'

export class RedisPlugin extends AddonPlugin {
  private readonly _redis
  private readonly _config
  constructor (context: ZeroantContext<ConfigFactory>) {
    super(context)
    this._config = context.config.addons.get(RedisConfig)
    this._redis = new Redis( this._config.redisUrl, this._config.ioOptions )
  }

  async initialize (): Promise<void> {
    if (this._redis != null || this._redis !== undefined) {
      console.info(new Date(), '[Redis]: Already Started')
    }

    // await this._redis.info().then(()=> { this.debug('info', 'Connected') })  
    //   .catch((e) => { this.debug('error', e) })
    // this.debug('info', 'Enabled')
  }

  async get <T = JsonValue>(key: string): Promise<T> {
    return await this._redis.get(key).then((value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch (_) {
        }
      }
      return null
    })
  }

  async has (key: string): Promise<boolean> {
    return await this._redis.exists(key).then((value) => {
      if (value > 0) {
        return true
      }
      return false
    })
  }

  async set (key: string, value: JsonValue, ttl?: number): Promise<boolean> {
    if(!ttl){
      return await this._redis.set(key, JSON.stringify(value)).then((value) => {
        if (value === 'OK') {
          return true
        }
        return false
      })
    }
    return await this._redis.set(key, JSON.stringify(value), 'PX', ttl ).then((value) => {
      if (value === 'OK') {
        return true
      }
      return false
    })
  }

  async del (key: string): Promise<boolean> {
    return await this._redis.del(key).then((value) => {
      if (value > 0) {
        return true
      }
      return false
    })
  }

  close () {
    this._redis.quit().catch((e) => { this.debug('error', e) })
    console.info(new Date(), '[RedisPlugin]: Stopped')
  }

  clone (): Redis {
    return new Redis(this._config.redisUrl, this.options)
  }

  get instance () {
    return this._redis
  }

  get options (): RedisOptions {
    return this._config.ioOptions
  }
}
