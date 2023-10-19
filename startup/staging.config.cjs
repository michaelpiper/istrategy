// eslint-disable-next-line @typescript-eslint/no-var-requires
const Apps = require('./app.cjs')
const ENV_NAME = 'staging'
let defaultEnv = {}
try {
  defaultEnv = require('../../.env.json')
} catch (error) {
}
Apps.map((app) => {
  app.name = app.name + '-' + ENV_NAME
  app.env = {
    ...app.env,
    ...defaultEnv,
    NODE_ENV: ENV_NAME
  }
  return app
})

const Startup = { apps: Apps }

module.exports = Startup
