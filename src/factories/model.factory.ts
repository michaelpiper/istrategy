import { KeyMap } from './keyMap.factory.js'
import { type FactoryUpdateEntity, type FactoryEntity } from './entity.factory.js'
import { type Faker, faker } from '@faker-js/faker'

export type ModelOmit<T, K extends keyof any> = Omit<T, K | 'set' | 'copy' | 'pick' | 'update'>
export abstract class ModelFactory<ID = any> extends KeyMap {
  id!: ID
  get toJson (): Record<string, any> {
    return this
  }

  update (data: FactoryUpdateEntity<this>) {
    return Object.entries(data).reduce((o, [key, value]) => o.set(key as any, value), this)
  }

  static fromEntity (entity: FactoryEntity<any>): ModelFactory {
    throw new Error('Most replace super ModelFactory')
  }
}

export abstract class ModelListFactory<T = ModelFactory> {
  public transactions: T[] = []
  seed (faker: Faker): T {
    throw Error('Must implement')
  }

  seeds (length = 3) {
    this.transactions = []
    for (let i = 0; i < length; i++) {
      const item = this.seed(faker)
      this.transactions.push(item)
    }
    return this.transactions
  }
}
