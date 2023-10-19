import RegistryFactory from 'factories/registry.factory.js'
import ApiEntry from '@api/api.entry.js'
import morgan from 'koa-morgan'
import { RedisPlugin } from './plugins/redis.plugin.js'
import { AdminConfig } from './config/admin.config.js'
import { DBConfig } from './config/db.config.js'
import { DBPlugin } from './plugins/db.plugin.js'
import { CacheManagerPlugin } from './plugins/cacheManger.plugin.js'
import AdminEntry from '@admin/admin.entry.js'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { type Config } from './config/config.js'

import { RedisConfig } from './config/redis.config.js'
import { HttpServer } from './servers/http.server.js'
import { type Context } from 'koa'

declare module 'koa' {
  interface BaseContext {
    zeroant: ZeroantContext<Config>
  }
}
export class Registry extends RegistryFactory {
  config: Config
  constructor (protected context: ZeroantContext<Config>) {
    super()
    this.config = context.config
  }

  static configs = [
    AdminConfig,
    DBConfig,
    RedisConfig,
  ]

 get plugins (){
  if(this.config.isTest){
    return [
      DBPlugin,
      CacheManagerPlugin
    ]
  }
  return [
    RedisPlugin,
    DBPlugin,
    CacheManagerPlugin
  ]
}

  get middleware () {
    return [
      morgan('common'),
      async (ctx: Context, next: () => Promise<any>) => {
        ctx.zeroant = this.context
        return await next()
      }
    ]
  }

  servers = [
    HttpServer
  ]

  workers = [
  ]

  get routes () {
    return [
      new AdminEntry(this.context),
      new ApiEntry(this.context)
    ]
  }
}
export default Registry
