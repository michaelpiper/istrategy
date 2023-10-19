import { type AdminConfig } from 'common/config/admin.config.js'
import { makeResource } from './resources.js'
import { type DBPlugin } from 'common/plugins/db.plugin.js'

export const makeAPIKeyToPermissionResource = (config: AdminConfig, db: DBPlugin) =>
  makeResource(config, db)('APIKeyToPermission', {
    parentName: 'API',
    title: 'api_key_to_permission_ref',
    fields: {
      api_key_to_permission_id: true
    },
    showFields: []
  })
export const makeAPIKeyResource = (config: AdminConfig, db: DBPlugin) => makeResource(config, db)('APIKey', {
  parentName: 'API',
  title: 'api_key_title',
  fields: {
    api_key_id: true,
    api_key_ref: true,
    api_key_title: true
  },
  editFields: ['api_key_ref','api_key_title'],
  showFields: ['api_key_ref', 'api_key_title'],
  listFields: ['api_key_title']

})
