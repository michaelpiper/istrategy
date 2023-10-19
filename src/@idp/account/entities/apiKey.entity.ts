import { type Prisma } from '@prisma/client'
import { FactoryEntity } from 'factories/entity.factory.js'
export type APIKeyEntity = FactoryEntity<Prisma.$APIKeyPayload>