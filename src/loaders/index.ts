import { logger } from 'common/logger/console.js'
import Config from '../common/config/index.js'
import { Plugin } from '../factories/plugin.factory.js'
import Registry from '../common/registry.js'
import { type CustomConfig } from '../factories/config.factory.js'
export default async (customConfig: CustomConfig = {}) => {
  const { zeroant } = await import('loaders/zeroant.js')
  const plugins = new Plugin(zeroant)
  const config = Config.instance.append(customConfig as any)
  for (const addon of Registry.configs) {
    config.addons
      .set(addon)
  }
  await Promise.all([zeroant.initLogger(logger), zeroant.initConfig(config)])

  const registry = new Registry(zeroant)
  for (const plugin of registry.plugins ?? []) {
    plugins.add(plugin)
  }

  await zeroant.initPlugin(plugins)
  zeroant.initWorkers(registry.workers ?? [])
  for (const AddonServer of registry.servers ?? []) {
    zeroant.initServer(AddonServer, registry)
  }
  process.on('exit', () => {
    zeroant.close()
  }).on('SIGINT', () => {
    process.exit()
  }).on('SIGTERM', () => {
    process.exit()
  })

  return zeroant
}
