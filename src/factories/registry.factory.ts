import type Router from '@koa/router'
import type Koa from 'koa'
import { type ZeroantContext } from '../loaders/zeroant.context.js'
import { type AddonConfigFactory } from './addon.config.js'
import { type AddonPluginFactory } from './addon.plugin.js'
import { type ServerFactory, type ServerFactoryConstructor } from './server.factory.js'
import { type WorkerFactory, type WorkerFactoryConstructor } from './worker.factory.js'
import { type ConfigFactory } from './config.factory.js'

export abstract class RegistryRouteEntryFactory {
  name!: string
  abstract router: Router | Koa
  debug
  constructor (protected context: ZeroantContext<ConfigFactory>) {
    this.debug = this.context.config.createDebugger((this.name ?? this.constructor.name))
  }

  buildRoutes () {
  }
}

export default abstract class RegistryFactory {
  static readonly configs: AddonConfigFactory[]
  abstract readonly plugins: AddonPluginFactory[]
  abstract readonly servers: Array<ServerFactoryConstructor<ServerFactory>>
  abstract readonly middleware: Koa.Middleware[]
  abstract readonly routes: RegistryRouteEntryFactory[]
  abstract readonly workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>
}
