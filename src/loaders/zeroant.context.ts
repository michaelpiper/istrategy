import { createServer, type Server } from 'http'
import { InternalServerError } from '../responses/serverErrors/internalServerError.serverError.js'
import { ErrorCode, ErrorDescription, ServerEventType } from '../common/constants.js'
import { type ServerFactoryConstructor, type ServerFactory } from '../factories/server.factory.js'
import { type ConfigFactory } from '../factories/config.factory.js'
import { type Plugin } from '../factories/plugin.factory.js'
import { EventEmitter } from 'events'
import { type WorkerFactoryConstructor, type WorkerFactory } from '../factories/worker.factory.js'
import { type AddonPlugin, type AddonPluginConstructor } from 'factories/addon.plugin.js'
import { type Logger } from 'winston'
import type Registry from 'common/registry.js'

export class ZeroantContext< Config extends ConfigFactory> {
  static PORT = 8080
  static HOSTNAME = '127.0.0.1'
  protected _server!: Server
  protected _port!: number
  protected _hostname!: string
  #store = new Map()
  #workers = new Map<string, WorkerFactory<any, any>>()
  #event = new EventEmitter()
  _servers: ServerFactory[] = []
  constructor (private readonly Config: new (config: any) => Config) { }

  initWorkers (workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>) {
    for (const Worker of workers) {
      const worker = new Worker(this)
      this.#workers.set(worker.name, worker)
    }
  }

  getWorkerByName <T extends WorkerFactory<any, any> >(workerName: string): T | undefined {
    return this.#workers.get(workerName) as T ?? null
  }

  getWorkerNames (): IterableIterator<string> {
    return this.#workers.keys()
  }

  get workers () {
    return {
      get: <T extends WorkerFactory<any, any>>(Worker: WorkerFactoryConstructor<T>) => this.getWorker<T>(Worker)
    }
  }

  getWorkers (): Array<WorkerFactory<any, any>> {
    const workers = []
    for (const worker of this.#workers.values()) {
      workers.push(worker)
    }
    return workers
  }

  getWorker <T extends WorkerFactory<any, any> >(Worker: WorkerFactoryConstructor<T>): T {
    for (const worker of this.#workers.values()) {
      if (worker instanceof Worker) {
        return worker
      }
    }
    throw new InternalServerError(
      ErrorCode.UNIMPLEMENTED_EXCEPTION,
      ErrorDescription.UNIMPLEMENTED_EXCEPTION,
      `Worker ${Worker.name} not registered check common/registry.ts for more information`
    )
  }

  listen (callback?: () => void): void {
    this.beforeStart()
    const config = this.getConfig()
    this._port = (config as ConfigFactory).serverPort ?? ZeroantContext.PORT
    this._hostname = (config as ConfigFactory).serverHostname ?? ZeroantContext.HOSTNAME
    const callbacks = this._servers.map((server) => (server.callback()))
    this._server = createServer((req, res): void => {
      void (async (req, res) => {
        for (const callback of callbacks) {
          await callback(req, res)
        }
      })(req, res)
    })
    this._server.listen(this._port, this._hostname, () => {
      this.onStart()
      if (typeof callback === 'function') {
        callback()
      }
    })
  }

  onStart () {
    this.event.emit(ServerEventType.START)
    for (const plugin of this.plugin.values()) {
      plugin.onStart()
    }
    for (const server of this._servers) {
      server.onStart()
    }
    (this.config as ConfigFactory).logging('info', () => {
      console.info(new Date(), '[ZeroantContext]: Running On Port', this._port)
    })
  }

  beforeStart () {
    this.event.emit(ServerEventType.BEFORE_START)
    for (const plugin of this.plugin.values()) {
      plugin.beforeStart()
    }
    for (const server of this._servers) {
      server.beforeStart()
    }
  }

  has (key: string) {
    return this.#store.get(key) !== undefined && this.#store.get(key) !== null
  }

  close () {
    this.event.emit(ServerEventType.CLOSE)
    for (const plugin of this.plugin.values()) {
      plugin.close()
    }
    for (const server of this._servers) {
      server.close()
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this._server) {
      return
    }
    (this.config as ConfigFactory).logging('info', () => {
      console.info(new Date(), '[ZeroantContext]: Stopped')
    })
    this._server.close((err) => {
      if (err != null) { throw Error() }
    })
  }

  initServer (Server: ServerFactoryConstructor<ServerFactory>, registry: Registry) {
    const server = new Server(this)
    server.initialize(registry)
    this._servers.push(server)
    this.#store.set(`server:${Server.name}`, server)
  }

  getServer <T extends ServerFactory>(Server: ServerFactoryConstructor<T>): T {
    const server = this.#store.get(`server:${Server.name}`)
    if (server === null || server === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `${Server.name} Server Not Init`)
    }
    return server
  }

  async initPlugin (plugin: Plugin) {
    this.#store.set('plugin', plugin)
    await plugin.initialize()
  }

  getPlugins () {
    const plugin: Plugin = this.#store.get('plugin')
    if (plugin === null || plugin === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Plugin Not Init')
    }
    return plugin
  }

  async initConfig (config: Config) {
    this.#store.set('config', config)
  }

  async initLogger (logger: Logger) {
    this.#store.set('logger', logger)
  }

  getLogger <T extends Logger>(): T {
    const logger = this.#store.get('logger')
    if (logger === null || logger === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Logger Not Init')
    }
    return logger as T
  }

  getConfig (): Config {
    const config = this.#store.get('config')
    if (config === null || config === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Config Not Init')
    }
    return config as Config
  }

  getPlugin <T extends AddonPlugin>(addon: AddonPluginConstructor<T>): T {
    return this.plugin.get<T>(addon)
  }

  get log (): Logger { return this.getLogger() }
  get server (): Server { return this._server }
  get plugin (): Plugin { return this.getPlugins() }
  get config (): Config { return this.getConfig() }
  get event (): EventEmitter { return this.#event }
}
