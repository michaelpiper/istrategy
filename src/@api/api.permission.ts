import { DBPlugin } from '../common/plugins/db.plugin.js'
import { Permissions } from '@idp/account/models/permissions.model.js'
import { type APIKey } from '@idp/account/models/apiKey.model.js'
import { type PermissionEntity } from '@idp/account/entities/permission.entity.js'
export class APIPermissions extends Permissions {
  constructor (apiKey: APIKey) {
    super(async () => {
      const { zeroant } = await import('../loaders/zeroant.js')
      const db = zeroant.getPlugin(DBPlugin)
      const repository = db.repository('aPIKeyToPermission')
      const apiPermissions = await repository.findMany({
        where: {
          api_key_ref: apiKey.ref
        },
        include: {
          permission: true
        }
      })
      return apiPermissions.map((toPermission): PermissionEntity => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { permission, permission_enabled } = toPermission
        if (permission?.permission_enabled === true) {
          permission.permission_enabled = permission_enabled
        }
        return permission as unknown as PermissionEntity
      })
    }, apiKey.ref)
  }
}
