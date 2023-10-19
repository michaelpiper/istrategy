import { ArticleService } from '../services/article.service.js'
import { SuccessArtifact } from '../../../responses/artifacts/success.artifact.js'
import { type Context } from 'koa'
import { PaginationDto } from 'common/dto/pagination.dto.js'
import { type Prisma } from '@prisma/client'
import { ErrorCode, ErrorDescription } from 'common/constants.js'
import { NotFound } from 'responses/clientErrors/notFound.clientError.js'
import { ArticleCreateDto, ArticleDto } from '../dto/article.dto.js'
import { CreateArtifact } from 'responses/artifacts/create.artifact.js'

export class ArticleApiController {
  list = async (ctx: Context) => {
    const { zeroant } = ctx
    const articleService = ArticleService.from(zeroant)
    const pagination = new PaginationDto<Prisma.ArticleFindFirstArgs['where']>()
      .setRelationWhiteList('currency', 'provider')
      .setFilterWhiteList(
        'article:currency.is.currency_code',
        'provider:provider.is.provider_code',
      )
      .setRelations({ currency: true, provider: true })
      .setSortWhiteList(
        'createdAt:created_at'
      )
      .fromQuery(ctx.query)
    const articleLists = await articleService.list(pagination)
    return new SuccessArtifact({...articleLists, items : articleLists.items.map(ArticleDto.fromModel)})
  }

  store = async (ctx: Context) => {
    const { zeroant } = ctx
    const articleService = ArticleService.from(zeroant)
    const dto = await ArticleCreateDto.fromPayload(ctx.request.result as never)
    const article = await articleService.create(dto, { currency: true, provider: true })
    // zeroant.log.info('article', article)
    return new CreateArtifact(ArticleDto.fromModel(article))
  }

  update = async (ctx: Context) => {
    const { zeroant } = ctx
    const { articleId } = ctx.params
    const articleService = ArticleService.from(zeroant)
    const dto = await ArticleCreateDto.fromPayload(ctx.request.result as never)
    try {
      const article = await articleService.update(Number(articleId), dto, { currency: true, provider: true })
      // zeroant.log.info('article', article)
      return new SuccessArtifact(ArticleDto.fromModel(article)) 
    } catch (error) {
      // zeroant.log.info('article update error', error)
      throw new NotFound(ErrorCode.NOT_FOUND, ErrorDescription.NOT_FOUND, 'Article with reference not found')
    }
  }

  delete = async (ctx: Context) => {
    const { zeroant } = ctx
    const { articleId } = ctx.params
    const articleService = ArticleService.from(zeroant)
    const article = await articleService.findByPk(Number(articleId), {currency: true, provider: true})
    // zeroant.log.info('article', article)
    if (article === null) {
      throw new NotFound(ErrorCode.NOT_FOUND, ErrorDescription.NOT_FOUND, 'Article with reference not found')
    }
    await articleService.deleteByPk(Number(articleId))
    return new SuccessArtifact(ArticleDto.fromModel(article))
  }


  retrieve = async (ctx: Context) => {
    const { zeroant } = ctx
    const { articleId } = ctx.params
    const articleService = ArticleService.from(zeroant)
    const article = await articleService.findByPk(Number(articleId), {currency: true, provider: true})
    // zeroant.log.info('article', article)
    if (article === null) {
      throw new NotFound(ErrorCode.NOT_FOUND, ErrorDescription.NOT_FOUND, 'Article with reference not found')
    }
    return new SuccessArtifact(ArticleDto.fromModel(article))
  }
}
