import { type AdminConfig } from 'common/config/admin.config.js'
import { makeAPIKeyResource, makeAPIKeyToPermissionResource } from './api-key.resource.js'
import { type ResourceWithOptions } from 'adminjs'
import { makeResource } from './resources.js'
import { type DBPlugin } from 'common/plugins/db.plugin.js'

export const createResources = (config: AdminConfig, db: DBPlugin): ResourceWithOptions[] => {
  const builder = makeResource(config, db)
  return [
    builder('Article', {
      parentName: 'Dashboard',
      fields: {
      },
    }),
    builder('Provider', {
      parentName: 'Dashboard',
      fields: {
      },
    }),
    builder('Currency', {
      parentName: 'Dashboard',
      fields: {
      },
    }),
    builder('Permission', {
      parentName: 'API',
      fields: {
      },
    }),
    makeAPIKeyResource(config, db),
    makeAPIKeyToPermissionResource(config, db),
  ]
}
