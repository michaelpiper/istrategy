import { type CurrencyEntity } from '../entities/currency.entity.js'
import { ModelFactory } from 'factories/model.factory.js'
import { Article } from './article.model.js';

export class Currency extends ModelFactory<number> {
  code!: string;
  name!: string;

  createdAt!: Date;
  updatedAt!: Date;
 
  articles: Article[] = []
  static fromEntity (entity: CurrencyEntity) {
    const model = new Currency()
    model.id = entity.currency_id
    model.name = entity.currency_name
    model.code = entity.currency_code

    model.createdAt = entity.created_at
    model.updatedAt = entity.updated_at
   
    if (![null, undefined].includes(entity.articles as never) ) {
      model.articles =entity.articles!.map(Article.fromEntity)
    }
    return model
  }

  get toEntity () {
    const entity: CurrencyEntity = {
      currency_id: this.id,
      currency_name: this.name,
      currency_code: this.code,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
    return entity
  }
}
