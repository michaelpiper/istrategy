import { Currency } from '../models/currency.model.js'
import { type CurrencyEntity } from '../entities/currency.entity.js'
import { ServiceImplementation } from 'common/implementations/service.implementation.js'
import { type Prisma } from '@prisma/client'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { type Config } from 'common/config/config.js'
export class CurrencyService extends ServiceImplementation<'currency', Currency, CurrencyEntity> {
  constructor () {
    super('currency', Currency, 'currency_id')
  }

  static from (zeroant: ZeroantContext<Config>) {
    return this._from<CurrencyService>(zeroant, this)
  }

  create = async (dto: { toEntity: CurrencyEntity }): Promise<Currency> => {
    const repository = await this.getRepo()
    const currency = await repository.create({ data: dto.toEntity as Prisma.CurrencyCreateInput })
    const newCurrency = Currency.fromEntity(currency)
    return newCurrency
  }

  upsert = async (currencyId: number, create: { toEntity: CurrencyEntity } = {} as any, update: { toEntity: CurrencyEntity } = {} as any) => {
    const currencyRepo = await this.getRepo()
    if (await currencyRepo.findFirst({ where: { currency_id: currencyId }, select:{currency_id: true} }) === null) {
      await this.create(create)
    } else {
      return await this.update(
        currencyId,
        update
      )
    }
  }

  update = async (currencyId: number, data: { toEntity: CurrencyEntity } = {} as any) => {
    const currencyRepo = await this.getRepo()
    const currency = Currency.fromEntity(await currencyRepo.update({
      where: { currency_id: currencyId },
      data: data.toEntity as any
    }))
    return currency
  }
}
