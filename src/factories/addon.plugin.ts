import { type ZeroantContext } from '../loaders/zeroant.context.js'
import { type ConfigFactory } from './config.factory.js'
export type AddonPluginConstructor<T extends AddonPlugin> = new (context: ZeroantContext<ConfigFactory>) => T
export type AddonPluginFactory = AddonPluginConstructor<AddonPlugin>
export abstract class AddonPlugin {
  debug
  constructor (protected readonly context: ZeroantContext<ConfigFactory>) {
    this.debug = this.context.config.createDebugger((this as any).name ?? this.constructor.name)
  }

  async initialize (): Promise<void> {

  }

  onStart () {

  }

  beforeStart () {

  }

  close () {

  }
}
