import { AddonPlugin } from '../../factories/addon.plugin.js'
import { DBConfig } from '../config/db.config.js'
import { PrismaClient } from '@prisma/client'

export class DBPlugin extends AddonPlugin {
  protected _dataSource!: PrismaClient
  async initialize () {
    const prisma = new PrismaClient()
    this._dataSource = prisma
  }

  get repositories (): PrismaClient {
    return this._dataSource
  }

  repository <T extends keyof PrismaClient>(repository: T): PrismaClient[T] {
    return this.repositories[repository]
  }

  call <T extends keyof PrismaClient>(repository: T) {
    return this.repository(repository)
  }

  clone () {
    const options = this.context.config.addons.get(DBConfig).options
    const dataSource = new PrismaClient(options)
    return dataSource
  }

  destroy () {
    const prisma = this._dataSource
    prisma.$disconnect().catch(e => this.context.log.info(e))
  }

  close (): void {
    this.destroy()
  }
}
