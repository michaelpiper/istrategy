
import bodyParser from 'koa-bodyparser'
import ApiMiddleware from './api.middleware.js'
import articleRoutes from './article/routes/article.route.js'
import { RegistryRouteEntryFactory } from '../factories/registry.factory.js'
import errorHandler from 'responses/errorHandler.js'
import responseHandler from 'responses/responseHandler.js'
import cors from '@koa/cors'
import Router from '@koa/router'
export default class ApiRouteEntry extends RegistryRouteEntryFactory {
  middleware = new ApiMiddleware()
  public router: Router = new Router({
    prefix: '/api'
  })

  public name = 'api'
  buildRoutes () {
    this.router.use(bodyParser({ jsonLimit: '1mb' }))
    this.router.use(cors())
    this.router.use(errorHandler())
    this.router.use(responseHandler())
    this.router.use(this.middleware.apiKeyAuth)
    this.router.use(articleRoutes.routes())
    this.router.all('(.*)', this.middleware.apiRouteNotFound)
  }
}
