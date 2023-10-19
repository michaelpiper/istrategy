import { type Next, type Context } from 'koa'

export class TransactionApiMiddleWare {
  create = async (ctx: Context, next: Next) => {
    return await next()
  }
}
