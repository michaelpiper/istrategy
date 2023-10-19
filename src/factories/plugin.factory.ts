import { ErrorCode, ErrorDescription } from '../common/constants.js'
import { InternalServerError } from '../responses/serverErrors/internalServerError.serverError.js'
import { type ZeroantContext } from '../loaders/zeroant.context.js'
import { type AddonPluginConstructor, type AddonPlugin } from './addon.plugin.js'
import { type ConfigFactory } from 'factories/config.factory.js'
export class Plugin {
  private readonly _addons = new Set<AddonPlugin>()
  constructor (private readonly context: ZeroantContext<ConfigFactory>) { }
  values () {
    return this._addons.values()
  }

  get <T extends AddonPlugin>(Type: AddonPluginConstructor<T>): T {
    for (const addon of this._addons.values()) {
      if (addon instanceof Type) {
        return addon
      }
    }
    throw new InternalServerError(
      ErrorCode.UNIMPLEMENTED_EXCEPTION,
      ErrorDescription.UNIMPLEMENTED_EXCEPTION,
      `${Type.name} Plugin you trying to get is not registered check common/registry.ts from more information`
    )
  }

  add (Addon: AddonPluginConstructor<AddonPlugin>): this {
    this._addons.add(new Addon(this.context))
    return this
  }

  async initialize (): Promise<void> {
    for (const addon of this._addons.values()) {
      try {
        await addon.initialize()
      } catch (error: any) {
        throw new InternalServerError(
          ErrorCode.UNEXPECTED_ERROR,
          ErrorDescription.UNEXPECTED_ERROR,
        `Error while initializing plugin ${addon.constructor.name}: ${error.message as string}`
        ).withRootError(error)
      }
    }
  }
}
