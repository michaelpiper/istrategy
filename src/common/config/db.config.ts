
import { type Prisma } from '@prisma/client'
import { AddonConfig } from '../../factories/addon.config.js'

export type DBOptions = Prisma.PrismaClientOptions
export class DBConfig extends AddonConfig {
  get development (): DBOptions {
    return {
   
    }
  }

  get production (): DBOptions {
    return {
     
    }
  }

  get test (): DBOptions {
    return {
  
    }
  }

  get options (): DBOptions {
    if (this.config.isProd) {
      return this.production
    }
    switch (this.config.environment) {
      case 'production':
        return this.production
      case 'test':
        return this.test
      default:
        return this.development
    }
  }
}
