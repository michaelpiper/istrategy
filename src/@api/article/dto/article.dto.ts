import { KeyMap } from 'factories/keyMap.factory.js'
import { type ArticleEntity } from '../entities/article.entity.js'
import { Article } from '../models/article.model.js'
import { CurrencyService } from '../services/currency.service.js'
import { ProviderService } from '../services/provider.service.js'
import { CacheManagerPlugin, CacheOrAsyncStrategy } from 'common/plugins/cacheManger.plugin.js'
import { Currency } from '../models/currency.model.js'
import { Provider } from '../models/provider.model.js'
import { TtlUtils } from 'utils/ttl.util.js'
import { UnprocessableEntity } from 'responses/clientErrors/unprocessableEntity.clientError.js'
import { ErrorCode, ErrorDescription } from 'common/constants.js'
export class ArticleCreateDto extends KeyMap {
  currencyId!: number
  providerId!: number
  price!: number
  get toEntity(): ArticleEntity {
    return new Article().copy(this).toEntity
  }

  static fromEntity(data: ArticleEntity): ArticleCreateDto {
    return this.fromModel(Article.fromEntity(data))
  }

  static fromModel(data: Article): ArticleCreateDto {
    return new ArticleCreateDto()
      .set('currencyId', data.currencyId)
      .set('providerId', data.providerId)
      .set('price', data.price)
  }

  static async fromPayload(data: { article: string, provider: number, price: number }): Promise<ArticleCreateDto> {
    const { zeroant } = await import('loaders/zeroant.js')
    const currencyService = CurrencyService.from(zeroant)
    const providerService = ProviderService.from(zeroant)
    const cache = zeroant.getPlugin(CacheManagerPlugin)
    const [currency, provider] = await Promise.all([
      new CacheOrAsyncStrategy<Currency | null>()
        .setKey(`currencies:${data.article}`)
        .setTtl(TtlUtils.oneMinute)
        .setSource(() => currencyService.findByIdOrCode(data.article))
        .exec(cache),
      new CacheOrAsyncStrategy<Provider | null>()
        .setKey(`providers:${data.provider}`)
        .setTtl(TtlUtils.oneMinute)
        .setSource(() => providerService.findByIdOrCode(data.provider))
        .exec(cache)
    ]);
    let error = null; 
    if (currency === null) {
      cache.del(`currencies:${data.article}`)
      error = 'article'
    }
    if (provider === null) {
      cache.del(`providers:${data.provider}`)
      error = 'provider'
    }
    if( error !=null ){
      throw new UnprocessableEntity(ErrorCode.INVALID_INPUT, ErrorDescription.INVALID_INPUT, 'invalid '+ error);
    }
    return new ArticleCreateDto()
      .set('currencyId', currency!.id)
      .set('providerId', provider!.id)
      .set('price', data.price)
  }

  get toJson() {
    return this.pick('currencyId', "providerId", 'price')
  }
}

export class ArticleDto extends KeyMap {
  article?: string
  article_no?: string
  provider?: string
  provider_no?: string
  price!: number
  get toEntity(): ArticleEntity {
    return new Article().copy(this.toJson).toEntity
  }

  static fromEntity(data: ArticleEntity): ArticleDto {
    return this.fromModel(Article.fromEntity(data))
  }

  static fromModel(data: Article): ArticleDto {
    return new ArticleDto()
      .set('article', data.currency?.name)
      .set('article_no', String(data.id).padStart(4, '0'))
      .set('provider', data.provider?.name)
      .set('provider_no', String(data.provider!.id).padStart(4, '0'))
      .set('price', data.price)
  }


  get toJson() {
    return this.pick('article', "article_no", 'provider', 'provider_no', 'price')
  }
}
