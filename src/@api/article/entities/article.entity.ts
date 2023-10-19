import { type Prisma } from '@prisma/client'
import { type FactoryEntity } from 'factories/entity.factory.js'
export type ArticleEntity = FactoryEntity<Prisma.$ArticlePayload>
export type ArticleCreateInput = Prisma.ArticleCreateInput