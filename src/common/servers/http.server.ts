import Koa from 'koa'
import { type Server } from 'http'
import { type RegistryRouteEntryFactory } from '../../factories/registry.factory.js'
import { ServerFactory } from '../../factories/server.factory.js'
import { type ConfigFactory } from '../../factories/config.factory.js'
import mount from 'koa-mount'
import koaQs from 'koa-qs'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import type Registry from 'common/registry.js'
export class HttpServer extends ServerFactory {
  _app: Koa
  protected _server!: Server
  protected _port!: number
  //   protected middleware: Koa.Middleware[] = []
  //   protected routes: RegistryRouteEntryFactory[] = []
  constructor (context: ZeroantContext<ConfigFactory>) {
    super(context)
    this._app = new Koa()
    koaQs(this._app)
  }

  get enabled () {
    return this.config.enableHTTP
  }

  initialize (registry: Registry): void {
    if (!this.enabled) {
      return
    }
    this.initMiddleware(registry.middleware)
    this.initRoutes(registry.routes)
    this.debug('info', 'Enabled')
  }

  initRoutes (routes: RegistryRouteEntryFactory[]) {
    const apps = this.config.serverApp.split(',')
    const mode = this.config.serverMode
    this._app.keys = this.config.appKeys
    this.debug('info', 'Mode', mode)
    for (const route of routes) {
      if (mode === 'combine') {
        this._initRoute(route)
      } else if (mode === 'standalone') {
        if (apps.includes(route.name)) {
          this._initRoute(route)
        }
      }
    }
  }

  isStandAlone (appName: string, _apps?: string[]): boolean {
    if (this.config.serverMode !== 'standalone') {
      return false
    }
    const apps = _apps ?? this.config.serverApp.split(',')
    return apps.includes(appName)
  }

  protected _initRoute (route: RegistryRouteEntryFactory) {
    this.debug('info', `Mounting app ${route.name}`)
    // build route before initializing
    route.buildRoutes()
    if (route.router instanceof Koa) {
      return this._app
        .use(mount(route.router))
    }
    return this._app
      .use(mount(route.router.routes()))
      .use(mount(route.router.allowedMethods()))
  }

  initMiddleware (middlewareList: Koa.Middleware[]) {
    for (const middleware of middlewareList) {
      this._app.use(middleware)
    }
  }

  callback () {
    return this._app.callback()
  }

  onStart () {
    super.onStart()
    if (!this.enabled) {
      return
    }
    this.debug('info', 'Is listening')
  }

  close () {
    if (!this.enabled) {
      return
    }
    this.debug('info', 'Stopped')
  }

  get config (): ConfigFactory { return this.context.config }
  get instance (): Koa { return this._app }
}
