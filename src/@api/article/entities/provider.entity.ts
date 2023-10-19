import { type Prisma } from '@prisma/client'
import { type FactoryEntity } from 'factories/entity.factory.js'
export type ProviderEntity = FactoryEntity<Prisma.$ProviderPayload>
export type ProviderCreateInput = Prisma.ProviderCreateInput