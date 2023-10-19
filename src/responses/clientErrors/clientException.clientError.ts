import { ErrorCode, ErrorDescription } from 'common/constants.js'
import { ErrorFactory } from '../../factories/error.factory.js'
export class ClientException extends ErrorFactory {
  public readonly statusCode: number = 417
  constructor (message: string) {
    super(ErrorCode.CLIENT_EXCEPTION, ErrorDescription.CLIENT_EXCEPTION, message)
  }
}
