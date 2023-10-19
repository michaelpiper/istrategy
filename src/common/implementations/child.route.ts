import Router, {RouterOptions} from '@koa/router'
import errorHandler from 'responses/errorHandler.js'
import responseHandler from 'responses/responseHandler.js'

export class ChildRouter extends Router {
  constructor (config?: RouterOptions) {
    super(config)
    this.use(errorHandler())
    this.use(responseHandler())
  }
}
