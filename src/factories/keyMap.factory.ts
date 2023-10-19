import _ from 'lodash'

export abstract class KeyMap extends Object {
  set <T extends keyof typeof this>(key: T, value: typeof this[T]) {
    this[key] = value
    return this
  }

  get <T extends (keyof typeof this)>(key: T): typeof this[T] | undefined {
    return this[key]
  }

  copy (map: Record<keyof any, any>): this {
    for (const key in map) {
      if (!['function','symbol'].includes(typeof (this as never)[key])) {
        (this as any)[key] = map[key] ?? (this as any)[key]
      }
    }
    return this
  }

  pick (...list: Array<keyof this>) {
    return _.pick(this, list)
  }
}
