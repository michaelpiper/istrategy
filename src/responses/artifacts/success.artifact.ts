import { type SuccessData } from 'common/types.js'
import { ArtifactFactory } from '../../factories/artifact.factory.js'

export class SuccessArtifact<T = SuccessData> extends ArtifactFactory<T> {
  protected readonly _statusCode = 200
  protected readonly _message = 'success'
}
