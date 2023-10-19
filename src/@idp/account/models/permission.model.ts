import { ModelFactory } from 'factories/model.factory.js'
import { type PermissionEntity } from '../entities/permission.entity.js'
import { type PermissionScope } from '../enums/permission.enum.js'
export class Permission extends ModelFactory {
  name!: string
  group!: string | null
  scope!: PermissionScope
  description!: string | null
  enabled!: boolean
  createdAt!: Date
  updatedAt!: Date

  static fromEntity (entity: PermissionEntity) {
    const model = new Permission()
    model.id = entity.permission_id
    model.name = entity.permission_name
    model.group = entity.permission_group
    model.scope = entity.permission_scope
    model.description = entity.permission_description
    model.enabled = entity.permission_enabled
    model.createdAt = entity.permission_created_at
    model.updatedAt = entity.permission_updated_at
    return model
  }
}
