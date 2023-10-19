import { type RedisClientOptions } from 'redis'
import { AddonConfig } from '../../factories/addon.config.js'
import { type RedisOptions as IORedisOptions } from 'ioredis'

export class RedisConfig extends AddonConfig {
  get redisUrl () {
    return this.config.get<string>('REDIS_URI')
  }

  get ioRedisUrl () {
    return this.config.get<string>('REDIS_URI')
  }

  get options (): RedisClientOptions {
    return {
      url: this.redisUrl
    }
  }

  get ioOptions (): IORedisOptions {
    return {}
  }
}
