import { type Middleware, type Context, type Next } from 'koa'
import { ArtifactFactory } from '../factories/artifact.factory.js'
import { RawArtifact } from './artifacts/raw.artifact.js'
export default (): Middleware => {
  return (async (ctx: Context, next: Next) => {
    const result = await next()
    if (result instanceof RawArtifact) {
      ctx.set('Content-Type', result.contentType)
      ctx.status = result.status
      ctx.body = result.data.data
      ctx.response.message = result.data.message
    } else if (result instanceof ArtifactFactory) {
      ctx.set('Content-Type', result.contentType)
      ctx.status = result.status
      ctx.body = result.data
    } else if (result !== null && result !== undefined) {
      ctx.body = result
    }
  }) as any
}
