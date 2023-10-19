import { Permissions } from '@idp/account/models/permissions.model.js'

export class ArticlePermissions extends Permissions {
  constructor () {
    super('article')
  }
}
