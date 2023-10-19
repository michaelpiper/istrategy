import { type Prisma } from '@prisma/client'
import { type FactoryEntity } from 'factories/entity.factory.js'
export type CurrencyEntity = FactoryEntity<Prisma.$CurrencyPayload>
export type CurrencyCreateInput = Prisma.CurrencyCreateInput