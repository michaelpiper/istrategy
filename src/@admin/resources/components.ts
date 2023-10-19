import { APP_PATH } from 'factories/config.factory.js'
import { componentLoader } from './component-loader.js'

export const Components = {
  Dashboard: componentLoader.add('Dashboard', APP_PATH + '/@admin/dashboard/dashboard.js', 'rootBundle'),
  SchemaPlayground: componentLoader.add('SchemaPlayground', APP_PATH + '/@admin/dashboard/SchemaPlayground/SchemaPlayground/index.js', 'rootBundle'), // other custom components
  SchemaEditor: componentLoader.add('SchemaEditor', APP_PATH + '/@admin/dashboard/SchemaPlayground/SchemaEditor/index.js', 'rootBundle'), // other custom components
  EditJSON: componentLoader.add('EditJSON', APP_PATH + '/@admin/dashboard/EditJSON/EditJSON.js', 'rootBundle')
}
