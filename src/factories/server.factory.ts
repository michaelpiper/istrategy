
import { type ZeroantContext } from '../loaders/zeroant.context.js'
import { type Http2ServerRequest, type Http2ServerResponse } from 'http2'
import { type IncomingMessage, type ServerResponse } from 'http'
import type Registry from 'common/registry.js'
import { type ConfigFactory } from './config.factory.js'
export type ServerFactoryConstructor<T extends ServerFactory> = new (context: ZeroantContext<ConfigFactory>) => T
export abstract class ServerFactory {
  debug
  constructor (protected context: ZeroantContext<ConfigFactory>) {
    this.debug = this.context.config.createDebugger((this as any).name ?? this.constructor.name)
  }

  onStart (): void {
  }

  initialize (registry: Registry): void { }
  beforeStart (): void {
  }

  callback (): (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => Promise<any> {
    return async (req, res) => {

    }
  }

  close (): void {

  }
}
