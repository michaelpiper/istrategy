import { type ParsedQs } from 'qs'
import { InternalServerError } from 'responses/serverErrors/internalServerError.serverError.js'
import { ErrorCode, ErrorDescription } from '../constants.js'
import { type IPaginationResult } from '../interfaces/pagination.interface.js'
import _ from 'lodash'
import crypto from 'node:crypto'
import { type ModelFactory } from 'factories/model.factory.js'
export class PaginationDto<T = Record<string, any>, Relation = Record<string, any>> {
  count?: number
  sort: Record<string, 'asc' | 'desc'> = {}
  relations: Relation = {} as any
  filter: T = {} as any as T
  filterWhiteList: string [] = []
  relationWhiteList: string [] = []
  sortWhiteList: string [] = []
  models: Record<string, ModelFactory> = {}
  #page?: number
  #start?: number
  #limit: number = 10
  // constructor () {}
  static fromQuery (query: ParsedQs, whiteList: { relation?: string[], filter?: string[], sort?: string[] } = {}) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return new PaginationDto()
      .setRelationWhiteList(...(whiteList?.relation ?? []))
      .setFilterWhiteList(...(whiteList?.filter ?? []))
      .setSortWhiteList(...(whiteList?.sort ?? []))
      .fromQuery(query)
  }

  fromQuery (query: ParsedQs) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const page = Number(query?.page)
    const limit = Number(query?.limit)
    if (query?.start !== undefined && query?.start !== null) {
      this
        .setStart(Number(query?.start))
        .setLimit(limit)
    } else {
      this
        .setPage(page)
        .setLimit(limit)
    }
    return this
      .setSortFromQuery(query.sort)
      .setFilterFromQuery(query.filter)
      .setRelationsFromQuery(query.relations)
  }

  setStart (start: number) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.#start = start || 0
    return this
  }

  setPage (page: number) {
    page = Number(page)
    this.#page = page > 0 ? page : 1
    return this
  }

  setLimit (limit: number) {
    limit = Number(limit)
    this.#limit = limit > 0 ? limit : 10
    return this
  }

  setFilterWhiteList (...filterWhiteList: string[]) {
    this.filterWhiteList = filterWhiteList
    return this
  }

  setSortWhiteList (...sortWhiteList: string[]) {
    this.sortWhiteList = sortWhiteList
    return this
  }

  setRelationWhiteList (...relationWhiteList: string[]) {
    this.relationWhiteList = relationWhiteList
    return this
  }

  setSortFromQuery (query: any) {
    const sort: Record<string, 'asc' | 'desc'> = this.sort
    if (Array.isArray(query)) {
      for (const field of query) {
        const [key, value = 'asc'] = (field as string).split(':')
        const [findKey, replaceKey = undefined] = this.getWhitelist(this.sortWhiteList, key)
        if (findKey === key) {
          sort[replaceKey ?? key] = value as any
        }
      }
    } else if (typeof query === 'string') {
      const fields = query.split(',')
      for (const field of fields) {
        const [key, value = 'asc'] = field.split(':')
        const [findKey, replaceKey = undefined] = this.getWhitelist(this.sortWhiteList, key)
        if (findKey === key) {
          sort[replaceKey ?? key] = value as any
        }
      }
    }
    return this.setSort(sort)
  }

  setRelationsFromQuery (query: any) {
    const relations: Relation = this.relations
    if (Array.isArray(query)) {
      for (const field of query) {
        const [findKey, replaceKey] = this.getWhitelist(this.relationWhiteList, field)
        if (field === findKey) {
          // replacement should use .include.
          _.set(relations as never, (replaceKey ?? field), true)
        }
      }
    } else if (typeof query === 'string') {
      const fields = query.split(',')
      for (const field of fields) {
        const [findKey, replaceKey] = this.getWhitelist(this.relationWhiteList, field)
        if (field === findKey) {
          // replacement should use .include.
          _.set(relations as never, (replaceKey ?? field), true)
        }
      }
    }
    return this.setRelations(relations)
  }

  getWhitelist (whiteList: string[], key: string) {
    const [findKey, replaceKey = undefined] = (whiteList.find((findKey) => findKey === key || findKey.startsWith(key + ':')) ?? '').split(':')
    return [findKey, replaceKey]
  }

  setFilterFromQuery (query: any) {
    const filter: T = this.filter
    if (Array.isArray(query)) {
      for (const field of query) {
        const [key, value = undefined] = (field as string).split(':')
        const [findKey, replaceKey = undefined] = this.getWhitelist(this.filterWhiteList, key)
        if (findKey === key && value !== undefined) {
          // replacement should use .is.
          _.set(filter as never, (replaceKey ?? findKey), value)
        }
      }
    } else if (typeof query === 'string') {
      const fields = query.split(',')
      for (const field of fields) {
        const [key, value = undefined] = field.split(':')
        const [findKey, replaceKey = undefined] = this.getWhitelist(this.filterWhiteList, key)
        if (findKey === key && value !== undefined) {
          // replacement should use .is.
          _.set(filter as never, (replaceKey ?? findKey), value)
        }
      }
    }
    return this.setFilter(filter)
  }

  setSort (sort: Record<string, 'asc' | 'desc'>) {
    this.sort = sort
    return this
  }

  setFilter (filter: T) {
    this.filter = filter
    return this
  }

  setRelations (relations: Relation) {
    this.relations = relations
    return this
  }

  getRelations () {
    return this.relations
  }

  getLimit (): number {
    return this.#limit *1
  }

  getSort (): any {
    return this.sort
  }

  getFilter (): any {
    return this.filter
  }

  getPage (): number {
    return this.#page !== undefined && this.#page > 0 ? this.#page : 1
  }

  getStart (): number {
    return this.#start !== undefined ? this.#start : 0
  }

  getSkip (): number {
    if (this.#start !== undefined) {
      return this.getStart()
    }
    return (this.getPage() - 1) * this.getLimit()
  }

  getTotalPages (): number {
    this.ensureCount()
    return Math.ceil(this.count as number / this.getLimit())
  }

  setCount (count: number) {
    this.count = count
    return this
  }

  ensureCount () {
    if (this.count === undefined) {
      throw new InternalServerError(ErrorCode.INVALID_PAYLOAD, ErrorDescription.INVALID_PAYLOAD, 'Please ensure to call setCount before using getTotalPages(), buildResult(')
    }
  }

  buildResult <T>(result: T []): IPaginationResult<T> {
    if (this.#start !== undefined) {
      return {
        meta: {
          totalCount: this.count as number
        },
        items: result
      }
    }

    return {
      meta: {
        totalCount: this.count as number,
        currentPage: this.getPage(),
        totalPages: this.getTotalPages()
      },
      items: result
    }
  }

  hash (prefix: string = ''): string {
    return crypto.createHash('sha256').update(JSON.stringify([prefix, this.getFilter(), this.getPage(), this.getSkip(), this.getRelations(), this.getLimit()])).digest('hex')
  }
}
