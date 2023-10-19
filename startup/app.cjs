// eslint-disable-next-line @typescript-eslint/no-var-requires
// import path from 'path'
const Apps = []

// const BASE_DIR = './../application/'
Apps.push({
  name: '1ubank-api-server',
  script: 'yarn serve',
  source_map_support: true,
  instances: 1
})
module.exports = Apps
