import { Provider } from '../models/provider.model.js'
import { type ProviderEntity } from '../entities/provider.entity.js'
import { ServiceImplementation } from 'common/implementations/service.implementation.js'
import { type Prisma } from '@prisma/client'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { type Config } from 'common/config/config.js'
export class ProviderService extends ServiceImplementation<'provider', Provider, ProviderEntity> {
  constructor () {
    super('provider', Provider, 'provider_id')
  }

  static from (zeroant: ZeroantContext<Config>) {
    return this._from<ProviderService>(zeroant, this)
  }

  create = async (dto: { toEntity: ProviderEntity }): Promise<Provider> => {
    const repository = await this.getRepo()
    const provider = await repository.create({ data: dto.toEntity as Prisma.ProviderCreateInput })
    const newProvider = Provider.fromEntity(provider)
    return newProvider
  }

  upsert = async (providerId: number, create: { toEntity: ProviderEntity } = {} as any, update: { toEntity: ProviderEntity } = {} as any) => {
    const providerRepo = await this.getRepo()
    if (await providerRepo.findFirst({ where: { provider_id: providerId }, select:{provider_id: true} }) === null) {
      await this.create(create)
    } else {
      return await this.update(
        providerId,
        update
      )
    }
  }

  update = async (providerId: number, data: { toEntity: ProviderEntity } = {} as any) => {
    const providerRepo = await this.getRepo()
    const provider = Provider.fromEntity(await providerRepo.update({
      where: { provider_id: providerId },
      data: data.toEntity as any
    }))
    return provider
  }
}
