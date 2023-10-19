import { type ArticleEntity } from '../entities/article.entity.js'
import { ModelFactory } from 'factories/model.factory.js'
import { Currency } from './currency.model.js';
import { Provider } from './provider.model.js';

export class Article extends ModelFactory<number> {
  price!: number;
  currencyId!: number;
  providerId!: number;

  currency?: Currency;
  provider?: Provider;

  createdAt!: Date;
  updatedAt!: Date;
 
  static fromEntity (entity: ArticleEntity) {
    const model = new Article()
    model.id = entity.article_id
    model.price = entity.price

    model.currencyId = entity.currency_id
    model.providerId = entity.provider_id
    
    
    
    model.createdAt = entity.created_at
    model.updatedAt = entity.updated_at
    if (entity.currency !== null && entity.currency !== undefined) {
      model.currency = Currency.fromEntity(entity.currency)
    }
    if (entity.provider !== null && entity.provider !== undefined) {
      model.provider = Provider.fromEntity(entity.provider)
    }
    return model
  }

  get toEntity () {
    const entity: ArticleEntity = {
      article_id: this.id,
      currency_id: this.currencyId,
      provider_id: this.providerId,
      price: this.price,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
    return entity
  }
}
