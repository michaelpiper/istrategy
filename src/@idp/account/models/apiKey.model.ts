import { ModelFactory } from 'factories/model.factory.js'
import { type APIKeyEntity } from '../entities/apiKey.entity.js'
export class APIKey extends ModelFactory<number> {
  name!: string
  title!: string
  ref!: string
  value!: string
  enabled!: boolean
  createdAt!: Date
  updatedAt!: Date

  static fromEntity (entity: APIKeyEntity) {
    const model = new APIKey()
    model.id = entity.api_key_id
    model.ref = entity.api_key_ref
    model.name = entity.api_key_name
    model.title = entity.api_key_title
    model.enabled = entity.api_key_enabled
    model.value = entity.api_key_value
    model.createdAt = entity.api_key_created_at
    model.updatedAt = entity.api_key_updated_at
    return model
  }
}
