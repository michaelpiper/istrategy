import { Article } from '../models/article.model.js'
import { ArticleList } from '../models/articleList.model.js'
import { type ArticleEntity } from '../entities/article.entity.js'
import { ServiceImplementation } from 'common/implementations/service.implementation.js'
import { type Prisma } from '@prisma/client'
import { type ZeroantContext } from 'loaders/zeroant.context.js'
import { type Config } from 'common/config/config.js'
export class ArticleService extends ServiceImplementation<'article', Article, ArticleEntity> {
  constructor () {
    super('article', Article, 'article_id')
  }

  static from (zeroant: ZeroantContext<Config>) {
    return this._from<ArticleService>(zeroant, this)
  }

  create = async (dto: { toEntity: ArticleEntity }, include?:Prisma.ArticleInclude): Promise<Article> => {
    const repository = await this.getRepo()
    const article = await repository.create({ data: dto.toEntity as Prisma.ArticleCreateInput, include: include})
    const newArticle = Article.fromEntity(article)
    return newArticle
  }

  upsert = async (articleId: number, data: {create: { toEntity: ArticleEntity }, update: { toEntity: ArticleEntity }, include?:Prisma.ArticleInclude}) => {
    const articleRepo = await this.getRepo()
    if (await articleRepo.findFirst({ where: { article_id: articleId }, select:{article_id: true} }) === null) {
      await this.create(data.create, data.include)
    } else {
      return await this.update(
        articleId,
        data.update,
        data.include
      )
    }
  }

  update = async (articleId: number, data: { toEntity: ArticleEntity } = {} as any, include?:Prisma.ArticleInclude) => {
    const articleRepo = await this.getRepo()
    const article = Article.fromEntity(await articleRepo.update({
      where: { article_id: articleId },
      data: data.toEntity as any,
      include
    }))
    return article
  }

  testList = (): Article[] => {
    const articleList = new ArticleList()
    return articleList.seeds()
  }
}
