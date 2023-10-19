import { type ISuccessResponse } from '../common/interfaces/responses.js'
import { type SuccessData } from '../common/types.js'

export abstract class ArtifactFactory<T = SuccessData> {
  protected readonly _statusCode: number = 200
  protected readonly _message: string = 'success'
  #contentType: string = 'application/json'
  #overrideMessage?: string
  constructor (protected readonly _data: T | null = null, overrideMessage?: string) {
    this.#overrideMessage = overrideMessage
  }

  set (key: 'message' | 'content-type', value: string) {
    if (key === 'content-type') {
      this.#contentType = value
    }
    if (key === 'message') {
      this.#overrideMessage = value
    }
    return this
  }

  get status (): number {
    return this._statusCode
  }

  get contentType (): string {
    return this.#contentType
  }

  get data (): ISuccessResponse {
    const response = {
      status: this._statusCode,
      message: this.#overrideMessage ?? this._message
    }
    if (this._data === null) {
      return response
    }
    return {
      status: this._statusCode,
      message: this.#overrideMessage ?? this._message,
      data: this._data
    }
  }
}
