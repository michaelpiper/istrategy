import { Unauthorized } from '../responses/clientErrors/unauthorized.clientError.js'
import jwt from 'jsonwebtoken'
import { ErrorDescription, ErrorCode } from '../common/constants.js'
import { type Context, type Next } from 'koa'
import { DBPlugin } from '../common/plugins/db.plugin.js'

import { APIPermissions } from './api.permission.js'
import { Forbidden } from '../responses/clientErrors/forbidden.clientError.js'
import { NotFound } from '../responses/clientErrors/notFound.clientError.js'
import { APIKey } from '@idp/account/models/apiKey.model.js'
import { type APIKeyEntity } from '@idp/account/entities/apiKey.entity.js'
import _ from 'lodash'
declare module 'koa' {
  interface DefaultState {
    apiKey: APIKey
    permissions: APIPermissions
  }
}
export default class ApiMiddleware {

  apiKeyAuth = async (ctx: Context, next: Next): Promise<void> => {
    const headers = ctx.headers
    const { zeroant } = ctx
    // by specifying default permission as public key allow user to public endpoints
    const apiKey = headers['x-api-key'] ?? ctx.query.api_key ?? 'public'
    if (Array.isArray(apiKey) || apiKey === null || apiKey === undefined) {
      throw new Unauthorized(ErrorCode.API_KEY_INVALID, ErrorDescription.API_KEY_INVALID, 'invalid apiKey')
    }

    const db = zeroant.getPlugin(DBPlugin)
    const repository = db.repository('aPIKey')
    let apiKeyEntity: APIKeyEntity | null = await repository.findUnique({
      where: {
        api_key_value: apiKey
      }
    })
    if((apiKeyEntity === null || apiKeyEntity === undefined) && apiKey === 'public'){
       apiKeyEntity = await repository.create({
        data: {
          api_key_title: _.capitalize(apiKey),
          api_key_enabled: true,
          api_key_name: apiKey,
          api_key_ref: apiKey,
          api_key_value: apiKey
        }
      })
    }
    if (apiKeyEntity === null || apiKeyEntity === undefined) {
      throw new Forbidden(ErrorCode.API_KEY_INVALID, ErrorDescription.API_KEY_INVALID, 'invalid apiKey')
    }
    ctx.state.apiKey = APIKey.fromEntity(apiKeyEntity)
    ctx.state.permissions = new APIPermissions(ctx.state.apiKey)
    return await next()
  }

  apiRouteNotFound = async (ctx: Context, next: Next): Promise<any> => {
    throw new NotFound(ErrorCode.NOT_FOUND, ErrorDescription.NOT_FOUND, ctx.url+ ' route not found')
  }

  jsonWebToken = async (ctx: Context, next: Next): Promise<any> => {
    const { headers } = ctx.request
    if (headers.authorization === null || headers.authorization === undefined || headers.authorization === '') {
      throw new Unauthorized(ErrorCode.UNAUTHORIZED, ErrorDescription.UNAUTHORIZED, 'access token is required')
    }
    const accessToken = headers.authorization.replace('Bearer', '').trim()
    const decodedToken = jwt.decode(accessToken)
    if (decodedToken === null) {
      throw new Unauthorized(ErrorCode.INVALID_TOKEN_FORMAT, ErrorDescription.UNAUTHORIZED, 'invalid token')
    }
    const { aud: tokenAudience, sub: tokenSubscriber } = decodedToken as jwt.JwtPayload
    // if (assignedPlatform === undefined) {
    //   throw new Unauthorized(ErrorCode.UNAUTHORIZED, ErrorDescription.UNAUTHORIZED, 'audience verification failed')
    
    // switch (verifyOutcome) {
    //   case VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE:
    //     throw new Unauthorized(VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE as any, ErrorDescription.UNAUTHORIZED, 'signature verification failed')
    //   case VerifyTokenStatus.TOKEN_EXPIRED:
    //     throw new Unauthorized(VerifyTokenStatus.TOKEN_EXPIRED as any, ErrorDescription.UNAUTHORIZED, 'access token expired')
    //   case VerifyTokenStatus.SUCCESS:
    //     break
    //   default:
    //     throw new Unauthorized(ErrorCode.SERVER_EXCEPTION, ErrorDescription.UNAUTHORIZED, 'access token expired')
    // }
    ctx.state.subscriber = tokenSubscriber
    return await next()
  }
}
