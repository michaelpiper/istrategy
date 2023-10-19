import { ErrorFactory } from '../../factories/error.factory.js'
export class Conflict extends ErrorFactory {
  public readonly statusCode: number = 409
}
