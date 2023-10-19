import { type ConfigFactory } from './config.factory.js'
export type AddonConfigConstructor<T extends AddonConfig> = new (config: ConfigFactory) => T
export type AddonConfigFactory = AddonConfigConstructor<AddonConfig>
export abstract class AddonConfig<T = ConfigFactory> {
  constructor (protected config: T) {}
}
