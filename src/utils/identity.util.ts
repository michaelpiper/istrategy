import * as uuid from 'uuid'
import * as shortid from 'shortid'
import { customAlphabet, nanoid } from 'nanoid'
import crypto from 'crypto'
const abc = 'abcdefghijklmnopqrstuvwxyz'
const genAccessToken = customAlphabet('0123456789' + abc + abc.toUpperCase() + '-_', 128)
const uuidTransformer = {
  to: (uuid: string | undefined) => uuid !== undefined && uuid !== null ? Buffer.from(uuid.replace(/-/g, ''), 'hex') : uuid,
  from: (bin: Buffer) => `${bin.toString('hex', 0, 4)}-${bin.toString('hex', 4, 6)}-${
      bin.toString('hex', 6, 8)}-${bin.toString('hex', 8, 10)}-${bin.toString('hex', 10, 16)}`
}
export class IdentityUtil {
  static generateUUID (): string {
    return uuid.v4({
    })
  }

  static uuidTransformer = uuidTransformer

  static generateID (): string {
    return shortid.generate().concat(shortid.generate())
  }

  static tinyID (): string {
    return shortid.generate()
  }

  static challenge () {
    const codeVerifier = nanoid(128)
    const base64Digest = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
    // console.log(base64Digest) // +PCBxoCJMdDloUVl1ctjvA6VNbY6fTg1P7PNhymbydM=
    const codeChallenge = Buffer.from(base64Digest, 'base64').toString('base64url')
    // console.log(codeChallenge)
    return {
      codeChallenge,
      codeVerifier
    }
  }

  static generateToken (): string {
    return genAccessToken(128)
  }
}
