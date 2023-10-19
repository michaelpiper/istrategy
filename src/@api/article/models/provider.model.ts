import { type ProviderEntity } from '../entities/provider.entity.js'
import { ModelFactory } from 'factories/model.factory.js'
import { Article } from './article.model.js';

export class Provider extends ModelFactory<number> {
  name!: string;
  code!: string;
  createdAt!: Date;
  updatedAt!: Date;
 
  articles: Article[] = []
  static fromEntity (entity: ProviderEntity) {
    const model = new Provider()
    model.id = entity.provider_id

    model.name = entity.provider_name
    model.code = entity.provider_code

    model.createdAt = entity.created_at
    model.updatedAt = entity.updated_at
   
    if (![null, undefined].includes(entity.articles as never) ) {
      model.articles =entity.articles!.map(Article.fromEntity)
    }
    return model
  }

  get toEntity () {
    const entity: ProviderEntity = {
      provider_id: this.id,
      provider_name: this.name,
      provider_code: this.code,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
    return entity
  }
}
