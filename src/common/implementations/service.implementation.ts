// import { type BaseEntity, type Repository } from 'typeorm'
import { RedisPlugin } from '../plugins/redis.plugin.js'
import { type ModelFactory } from 'factories/model.factory.js'
import { WorkerFactory, type WorkerFactoryConstructor } from 'factories/worker.factory.js'
import { ErrorCode, ErrorDescription } from 'common/constants.js'
import { InternalServerError } from 'responses/serverErrors/internalServerError.serverError.js'
import { PaginationDto } from 'common/dto/pagination.dto.js'
import { type IPaginationResult } from 'common/interfaces/pagination.interface.js'
import { type RepositoryDelegate } from './repository.js'
import _ from 'lodash'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { DBPlugin } from 'common/plugins/db.plugin.js'
import { type PrismaClient } from '@prisma/client'
import { type Config } from 'common/config/config.js'

export type ServiceImplementationSerializer<T, R extends ModelFactory> = (entity: T) => R

export abstract class ServiceImplementation<T extends keyof PrismaClient, R extends ModelFactory, Entity> {
  protected queue!: WorkerFactory<R, any>
  protected state!: RedisPlugin

  constructor(protected repoName: T, protected Model: new () => R, protected pk: keyof Entity) {
  }

  async getRepo(): Promise<PrismaClient[T]> {
    return await import('loaders/zeroant.js').then(({ zeroant }) => zeroant.getPlugin(DBPlugin).repository(this.repoName))
  }

  isNumber<T>(value: any, yes: T, no: T): T {
    value = Number(value)
    if (Number.isNaN(value)) {
      return no
    }
    return yes
  }

  get serializer() {
    return (this.Model as unknown as typeof ModelFactory).fromEntity as ServiceImplementationSerializer<Entity, R>
  }

  useQueue(queue: WorkerFactory<R, any>) {
    this.queue = queue
    return this
  }

  useState(state: RedisPlugin) {
    this.state = state
    return this
  }

  get hasState(): boolean {
    return (this.state instanceof RedisPlugin)
  }

  get hasQueue(): boolean {
    return (this.queue instanceof WorkerFactory)
  }

  ensureState() {
    if (!this.hasState) {
      throw new InternalServerError(
        ErrorCode.UNIMPLEMENTED_EXCEPTION,
        ErrorDescription.UNIMPLEMENTED_EXCEPTION,
        'State has not been initialized, please ensure you call .useState'
      )
    }
  }

  ensureQueue() {
    if (!this.hasQueue) {
      throw new InternalServerError(
        ErrorCode.UNIMPLEMENTED_EXCEPTION,
        ErrorDescription.UNIMPLEMENTED_EXCEPTION,
        'Queue has not been initialized, please ensure you call .useQueue'
      )
    }
  }


  serializeMany = (entities: Entity[]): R[] => {
    return entities.map((entity) => this.serializer(entity))
  }

  makeFindBy = (key: keyof Entity) => async (value: number | string, include?: Record<string, any>) => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(key, value)
  makeFindByFields = (pk: keyof Entity, ...keys: Array<keyof Entity>) => async (value: number | string, include?: Record<string, any>) => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(pk, value, ...keys)

  async findBy(key: keyof Entity, value: number | string, ...keys: Array<keyof Entity>): Promise<R | null> {
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const entity = await repository.findFirst({
      where: {
        OR: [
          {
            [key]: value
          },
          ...keys.map((key) => ({ [key]: value }))
        ]
      },
      include: (this as any)?.include as Record<string, any>
    })
    if (entity === null) {
      return null
    }
    return this.serializer(entity)
  }

  async findByAnd(key: keyof Entity, value: number | string, ...keys: Array<keyof Entity>): Promise<R | null> {
    const repository = await this.getRepo() as never as RepositoryDelegate<T>
    const entity = await repository.findFirst({
      where: {
        AND: [
          {
            [key]: value
          },
          ...keys.map((key) => ({ [key]: value }))
        ]
      },
      include: (this as any)?.include as Record<string, any>
    })
    if (entity === null) {
      return null
    }
    return this.serializer(entity)
  }

  findByPk = async (value: number | string, include?: Record<string, any>): Promise<R | null> => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(this.pk, value)
  deleteByPk = async (value: number | string, include?: Record<string, any>): Promise<R | null> => {
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const entity = await repository.delete({
      where: {
        [this.pk]: value
      },
      include,
    })
    return this.serializer(entity)
  }

  list = async <T, Relation>(pagination?: PaginationDto<T, Relation>): Promise<IPaginationResult<R>> => {
    pagination = pagination ?? new PaginationDto<T, Relation>().setPage(1).setLimit(50)
    const query = {
      skip: pagination.getSkip(),
      take: pagination.getLimit(),
      include: pagination.getRelations(),
      orderBy: pagination.getSort(),
      where: pagination.getFilter()
    }
    // console.log('query', query)
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const [count, entities] = await Promise.all([
      repository.count(_.pick(query, ['where'])),
      repository.findMany(query)
    ])
    return pagination.setCount(count).buildResult<R>(this.serializeMany(entities))
  }

  protected static _from<T>(zeroant: ZeroantContext<Config>, Service: new () => T, workerClass?: WorkerFactoryConstructor<any>) {
    const worker = workerClass !== undefined ? zeroant.getWorker(workerClass) : undefined

    if(!zeroant.config.isTest) {
      const redis = zeroant.getPlugin(RedisPlugin)
      return (new Service() as ServiceImplementation<any, ModelFactory, any>)
        .useQueue(worker)
        .useState(redis) as T
    } else {
      return (new Service() as ServiceImplementation<any, ModelFactory, any>).useQueue(worker) as T
    }
  }

  findByIdOrRef = async <Input>(id: string | number, userRef?: string, include?: Input): Promise<R | null> => {
    if (typeof userRef === 'string') {
      return await this.#findByIdOrRefWithUser<Input>(id, userRef, include)
    }

    return await this.#findByIdOrRefWithoutUser<Input>(id)
  }

  #findByIdOrRefWithUser = async <Input>(id: string | number, userRef: string, include: Input = { user: true } as any): Promise<R | null> => {
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const orderId = Number(id)
    const where: Array<Record<string, any>> = []
    if (Number.isNaN(orderId)) {
      where.push({
        user_ref: userRef, [`${this.repoName as string}_ref`]: id as string
      })
    } else {
      where.push(
        {
          user_ref: userRef,
          [`${this.repoName as string}_id`]: orderId
        }
      )
    }
    const result: Entity | null = await repository.findFirst({
      where: {
        OR: where
      },
      include: include as any
    })
    if (result === null) {
      return null
    }
    return this.serializer(result)
  }

  #findByIdOrRefWithoutUser = async <Input>(id: string | number, include: Input = {} as any): Promise<R | null> => {
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const where: Array<Record<string, any>> = []
    const orderId = Number(id)
    if (Number.isNaN(orderId)) {
      where.push({
        [`${this.repoName as string}_ref`]: id as string
      })
    } else {
      where.push(
        {
          [`${this.repoName as string}_id`]: orderId
        }
      )
    }
    const result: Entity | null = await repository.findFirst({
      where: {
        OR: where
      },
      include: include as any
    })
    if (result === null) {
      return null
    }
    return this.serializer(result)
  }

  findByIdOrCode = async <Input>(id: string | number, include: Input = {} as any): Promise<R | null> => {
    const repository = await this.getRepo() as any as RepositoryDelegate<T>
    const where: Array<Record<string, any>> = []
    const orderId = Number(id)
    if (Number.isNaN(orderId)) {
      where.push({
        [`${this.repoName as string}_code`]: id as string
      })
    } else {
      where.push(
        {
          [`${this.repoName as string}_id`]: orderId
        }
      )
    }
    const result: Entity | null = await repository.findFirst({
      where: {
        OR: where
      },
      include: include as any
    })
    if (result === null) {
      return null
    }
    return this.serializer(result)
  }
}
