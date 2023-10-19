import { ModelListFactory } from 'factories/model.factory.js'
import { Article } from './article.model.js'
export class ArticleList extends ModelListFactory<Article> {
  seed (faker: any) {
    return new Article()
  }
}
