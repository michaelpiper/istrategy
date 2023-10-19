import { type SERVER_MODE } from './factories/config.factory.js'
import loaders from './loaders/index.js'

const SERVER_MODE: SERVER_MODE = 'combine'
const SERVER_APP = '*'
export const app = await loaders({
  SERVER_MODE,
  SERVER_APP
})