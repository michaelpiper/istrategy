import { Permission } from './permission.model.js'
import { type PermissionEntity } from '../entities/permission.entity.js'
import { BadRequest } from 'responses/clientErrors/badRequest.clientError.js'
import { ErrorCode, ErrorDescription } from 'common/constants.js'
import { PermissionScope } from '../enums/permission.enum.js'
import { CacheManagerPlugin, CacheOrAsyncStrategy } from 'common/plugins/cacheManger.plugin.js'
import { TtlUtils } from 'utils/ttl.util.js'

export class Permissions {
  #data: Permission[] = []
  #loading = false
  public group: string
  public source: () => Promise<PermissionEntity[]>
  constructor (source: (() => Promise<PermissionEntity[]>) | string, group?: string) {
    this.source = typeof source === 'string' ? this.defaultSource(source) : source
    this.group = typeof source === 'string' ? source : group as string
    if (typeof this.group !== 'string') {
      throw new BadRequest(ErrorCode.INVALID_ARGUMENT, ErrorDescription.INVALID_ARGUMENT, 'please provide group as argument to constructor e.g new Permissions("permission") or new Permissions(dataSourceFunction:()=>PermissionEntity[],"permission") ')
    }
  }

  defaultSource (group: string): () => Promise<PermissionEntity[]> {
    return async () => {
      const { zeroant } = await import('loaders/zeroant.js')
      const { DBPlugin } = await import('common/plugins/db.plugin.js')
      const db = zeroant.getPlugin(DBPlugin)
      const repository = db.repository('permission')
      const permissions = await repository.findMany({
        where: {
          permission_group: group
        }
      })
      return permissions
    }
  }

  async #getOrCreatePermission (name: string, scope: PermissionScope): Promise<PermissionEntity | null> {
    const { zeroant } = await import('loaders/zeroant.js')
    const { DBPlugin } = await import('common/plugins/db.plugin.js')
    const db = zeroant.getPlugin(DBPlugin)
    const repository = db.repository('permission')
    const cache = zeroant.getPlugin(CacheManagerPlugin)
    const groupFromName = name.split('.').at(0) as string
    const permission = await cache
      .withStrategy<PermissionEntity | null>(new CacheOrAsyncStrategy<PermissionEntity | null>()
      .setKey(`permissions:policy:${groupFromName}:${name}:${scope}`)
      .setTtl(TtlUtils.oneMinute)
      .setSource(async () =>
        await repository.upsert({
          create: {
            permission_group: groupFromName,
            permission_name: name,
            permission_scope: scope,
            permission_enabled: true,
            permission_title: `${name} ${scope}`,
            permission_description: `${name} ${scope} (Auto Generated)`
          },
          where: {
            permission_name_permission_scope: {
              permission_name: name,
              permission_scope: scope
            }
          },
          update: {
          }
        })
      )
    )
    return permission
  }

  async load () {
    if (this.#loading) { return this.#data }
    if (this.#data.length > 0) { return this.#data }
    this.#loading = true
    const { zeroant } = await import('loaders/zeroant.js')
    const cache = zeroant.getPlugin(CacheManagerPlugin)
    const entities = await cache.withStrategy<PermissionEntity[]>(new CacheOrAsyncStrategy<PermissionEntity[]>()
      .setKey(`permissions:policy:${this.group}`)
      .setTtl(TtlUtils.oneMinute)
      .setSource(async () => await this.source()))
    this.#loading = false
    this.#data = entities.map((entity) => Permission.fromEntity(entity))
    return this.#data
  }

  async get (name: string) {
    await this.load()
    const permission = this.#data.find((permission) => permission.name === name)
    return permission
  }

  buildGroupPattern (group: string): string[] {
    const list: string[] = []
    const groups = group.split('.')
    for (let i = 0; i < groups.length - 1; i++) {
      const key = groups[i]
      if (list.length === 0) {
        list.push(key)
      } else {
        list.push(list[list.length - 1] + '.' + key)
      }
    }
    //  this user has permission to do everything if contains * or {group}.*
    return list.map((name) => name.concat('.*'))
  }

  scope (privateScope: boolean) {
    // if (privateScope === undefined) {
    //   return PermissionScope.public_or_private
    // }
    if (privateScope) {
      return PermissionScope.private
    }
    return PermissionScope.public
  }

  async getOrSuper (name: string, scope: 'public' | 'private' | 'public_or_private') {
    await this.load()
    const patterns = this.buildGroupPattern(name)
    // console.log('name patterns', patterns, name, this.#data.map)
    let permission: Permission | undefined
    if (scope !== undefined) {
      permission = this.#data.find((permission) => permission.name === name && permission.scope === scope)
      if (permission !== undefined) {
        return permission
      }
    }
    // check if user has mixed permission public or private
    permission = this.#data.find((permission) => permission.name === name && permission.scope === 'public_or_private')
    if (permission !== undefined) {
      return permission
    }

    // further check if user has super permission
    permission = this.#data.find((permission) => permission.name === '*' && (permission.scope === scope || (permission.scope === 'public' && scope === 'public_or_private') || permission.scope === 'public_or_private'))
    if (permission !== undefined) {
      let entity = await this.#getOrCreatePermission(name, scope)
      if (entity != null) {
        return Permission.fromEntity(entity)
      }
      entity = await this.#getOrCreatePermission(name, 'public_or_private')
      if (entity != null) {
        return Permission.fromEntity(entity)
      }
    }

    // further check if user has prefix super permission eg transaction.*
    permission = this.#data.find((permission) => ((permission.scope === scope || (permission.scope === 'public' && scope === 'public_or_private') || permission.scope === 'public_or_private') && typeof permission.group === 'string' && patterns.includes(permission.group.concat('.*'))))

    if (permission !== undefined) {
      let entity = await this.#getOrCreatePermission(name, scope)
      if (entity != null) {
        return Permission.fromEntity(entity)
      }
      entity = await this.#getOrCreatePermission(name, 'public_or_private')
      if (entity != null) {
        return Permission.fromEntity(entity)
      }
    }

    // ensure permission is stored in db
    await this.#getOrCreatePermission(name, scope)
    return null
  }

  async test (currentPermission?: Permission | null, isAuthenticated = false) {
    await this.load()
    if (currentPermission === null || currentPermission === undefined) {
      return false
    }
    if (!currentPermission.enabled) {
      return false
    }
    if (currentPermission.scope === 'public' || currentPermission.scope === 'public_or_private') {
      return true
    }
    if (this.#data.findIndex((permission) => permission.id === currentPermission.id) === -1) {
      return false
    }

    if (!isAuthenticated) {
      return false
    }
    return true
  }
}
