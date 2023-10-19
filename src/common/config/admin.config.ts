import { AddonConfig } from 'factories/addon.config.js'
import { type AdminJSOptions } from 'adminjs'
export class AdminConfig extends AddonConfig {
  get cdnBaseUrl () {
    return this.config.get<string>('CDN_BASE_URL')
  }

  get watchAdmin () {
    return this.config.get<string>('ADMIN_WATCH', 'off') === 'on'
  }

  get userName () {
    return this.config.get<string>('ADMIN_AUTH_USER', '')
  }

  get userAvatarUrl () {
    return this.config.get<string | null>('ADMIN_USER_ROOT_AVATAR_URL', null)
  }

  get userTitle () {
    return this.config.get<string>('ADMIN_USER_ROOT_TITLE', 'Root Admin')
  }

  get userRole () {
    return this.config.get<string>('ADMIN_USER_ROOT_ROLE', 'root')
  }

  get userId () {
    return this.config.get<string>('ADMIN_USER_ROOT_ID', '0')
  }

  get theme () {
    return this.config.get<string>('ADMIN_USER_ROOT_THEME', 'default')
  }

  get userEmail () {
    return this.config.get<string>('ADMIN_USER_ROOT_EMAIL')
  }

  get password () {
    return this.config.get<string>('ADMIN_AUTH_PASS', '')
  }

  get secureSession () {
    return this.config.get<string>('ADMIN_SECURE_SESSION', 'false') === 'true'
  }

  get sessionKeys () {
    return this.config.appKeys
  }

  get auth () {
    return {
      user: this.userName,
      pass: this.password
    }
  }

  get options () {
    return this._options()
  }

  get aws () {
    return {
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>('AWS_ACCESS_SECRET')
      },
      expires: 0,
      bucket: this.config.get<string>('AWS_BUCKET_NAME')
    }
  }

  _options (): AdminJSOptions {
    return {
      rootPath: '/admin',
      settings: {},
      branding: {
        companyName: 'ZeroAnt',
        withMadeWithLove: false
      }
    }
  }
}
