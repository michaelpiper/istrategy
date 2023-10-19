import { type ZeroantContext } from '../loaders/zeroant.context.js'
import Queue, { type Job } from 'bull'
// import { RedisPlugin } from '../common/plugins/redis.plugin.js'
import { type ConfigFactory } from './config.factory.js'
import { RedisConfig } from 'common/config/redis.config.js'
export interface WorkerOptions extends Queue.JobOptions {
  concurrency?: number | 10
}
export type WorkerProcessor = (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => Promise<void>
export const WorkerConfig = (options?: { name: string, options?: WorkerOptions }) => {
  return function <T extends WorkerFactoryConstructor<WorkerFactory<any, any>>>(target: T): T {
    if (options?.name !== undefined) {
      Object.defineProperty(target, 'name', {
        value: options?.name,
        configurable: false,
        writable: false
      })
    }
    Object.defineProperty(target, 'options', {
      value: options?.options ?? {
        delay: 0,
        removeOnComplete: true,
        concurrency: WorkerFactory.concurrency
      },
      configurable: false,
      writable: false
    })
    return target
  }
}
export type WorkerFactoryConstructor<T extends WorkerFactory<any, any>> = new (context: ZeroantContext<ConfigFactory>) => T

export interface OnCreate<F= any> {
  onCreate: (processors: Map<F, WorkerProcessor>) => void
}

export abstract class WorkerFactory<T, F extends string> {
  static concurrency = 10
  #queue: Queue.Queue
  #processors = new Map<F, WorkerProcessor>()
  constructor (readonly context: ZeroantContext<ConfigFactory>) {
    this.#queue = new Queue<T>(this.name, this.context.config.getAddon(RedisConfig).ioRedisUrl, {
      redis: this.context.config.getAddon(RedisConfig).ioOptions,
      defaultJobOptions: this.options ?? {}
    })
    this.onCreate(this.#processors)
  }

  get options (): WorkerOptions {
    return (this.constructor as any).options
  }

  get name (): string {
    return this.constructor.name
  }

  get instance (): Queue.Queue<T> {
    return this.#queue
  }
  /**
   * @description this is the default processor you can push to a different event name by the below code
   * ```ts
   *
   * onCreate (processors: Map<OrderWorkerName, WorkerProcessor>): void {
   *
   * processors.set(OrderWorkerName.fulfillment, this.fulfillment)
   *
   * }
   *
   * this.push(OrderWorkerName.fulfillment, {..data.}, {..opts.})
   *
   *
   */
  abstract processor (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>): Promise<void>

  onCreate (processors: Map<F, WorkerProcessor>): void {

  }

  async restart (jobId: number) {
    const job = await this.#queue.getJob(jobId)
    if (job === null) {
      return
    }
    // await job.releaseLock()
    // await job.moveToFailed({ message: 'restarted' }, true)
    await job.retry()
  }

  async run (concurrency?: number) {
    // console.log(`${this.name} default worker started successfully ${(new Date()).toLocaleString()}`)
    const wrapper = this._wrapper(async (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => {
      await this.processor(job, done, log)
    })
    // const redisOpts = this.context.getPlugin(RedisPlugin).ioOptions
    // const queue = new Queue(this.name, {
    //   redis: redisOpts,
    //   defaultJobOptions: this.options ?? {}
    // })
    await Promise.all([
      ...Array.from(this.#processors.entries()).map(async ([name, processor]) => {
        console.log(`${this.name} ${name} worker started successfully ${(new Date()).toLocaleString()}`)
        const wrapper = this._wrapper(async (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => {
          await processor(job, done, log)
        })
        await this.#queue.process(name, concurrency ?? this.options.concurrency ?? WorkerFactory.concurrency, wrapper)
      })
    ])
    await this.#queue.process(concurrency ?? this.options.concurrency ?? WorkerFactory.concurrency, wrapper)
  }

  async add (data?: T, options?: Queue.JobOptions): Promise<Job<T>> {
    // console.log('pushing to queue', this.name)
    return await this.#queue.add(data, options)
  }

  async push (name: F, data?: T, options?: Queue.JobOptions): Promise<Job<T>> {
    // console.log('pushing to queue', this.name, name)
    return await this.#queue.add(name, data, options ?? {})
  }

  addListener (eventName: string | symbol, listener: (...args: any[]) => void): Queue.Queue<T> {
    return this.#queue.addListener(eventName, listener)
  }

  async addBulk (bulkData: Array<{ name?: any, data: T, opts?: Omit<Queue.JobOptions, 'repeat'> | undefined }>): Promise<Job[]> {
    return await this.#queue.addBulk(bulkData)
  }

  _wrapper (callback: (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => Promise<void>) {
    return async (job: Queue.Job, done: Queue.DoneCallback): Promise<void> => {
      const start = Date.now()
      const { id, name } = job
      const data = job.data
      const log = job.log.bind(job)
      console.log('[-------------------------------------------]')
      console.log(`Processing ${this.name}->${name} Job: ${id} `)
      console.log(
        this.name + '->' + name + ' Worker Processor data ----->',
        JSON.stringify(data)
      )
      try {
        await callback(job, done, log)
      } catch (caught: any) {
        console.log(this.name + '->' + name + ' Worker Error -----> ', caught)
        await log((caught).message)
        done(caught)
      }
      console.log(`Job ${this.name}->${name} ${id} ran for ${(Date.now() - start) / 1000}s`)
      console.log('[-------------------------------------------]')
    }
  }

  getQueue (): Queue.Queue<T> {
    return this.#queue
  }
}
