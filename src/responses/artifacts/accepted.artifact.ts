import { ArtifactFactory } from '../../factories/artifact.factory.js'

export class AcceptedArtifact extends ArtifactFactory {
  protected readonly _statusCode = 202
  protected readonly _message = 'accepted'
}
