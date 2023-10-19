import { type Permissions } from '../models/permissions.model.js'
import { ErrorCode, ErrorDescription } from '../../../common/constants.js'
import { type Next, type Context } from 'koa'
import { Forbidden } from '../../../responses/clientErrors/forbidden.clientError.js'

export class PolicyMiddleWare {
  constructor (private readonly permissions: Permissions, group?: string) {
    this.#group = group
  }

  readonly #group?: string
  private get group (): string {
    return this.#group ?? this.permissions.group
  }

  #name = (name: string) => {
    return this.group.concat('.').concat(name)
  }

  #create = (name: string, scope?: 'public' | 'private' | 'public_or_private') => {
    return async (ctx: Context, next: Next) => {
      await this.permissions.load()
      const permissions = ctx.state.permissions
      const permission = await permissions.getOrSuper(this.#name(name), scope ?? permissions.scope(ctx.state.user != null))
      if (!await this.permissions.test(permission, ctx.state.user != null)) {
        throw new Forbidden(
          ErrorCode.FORBIDDEN,
          ErrorDescription.FORBIDDEN,
          `Access denied for ${this.#name(name)} permissions not available`
        )
      }
      return await next()
    }
  }

  create = this.#create('create', 'public_or_private')
  createPublic = this.#create('create', 'public')
  createPrivate = this.#create('create', 'private')
  list = this.#create('list', 'public_or_private')
  listPublic = this.#create('list', 'public')
  listPrivate = this.#create('list', 'private')
  retrieve = this.#create('retrieve', 'public_or_private')
  retrievePublic = this.#create('retrieve', 'public')
  retrievePrivate = this.#create('retrieve', 'private')
  delete = this.#create('delete', 'public_or_private')
  deletePublic = this.#create('delete', 'public')
  deletePrivate = this.#create('delete', 'private')
  make = this.#create
}
