export class PromiseUtil {
  static wait = <T>(promise: Promise<T>) => {
    // Set initial state
    let isPending = true
    let isRejected = false
    let isFulfilled = false
    let result!: T
    let error!: Error
    const future = (promise as any)
    future.then(
      (v: T) => {
        isFulfilled = true
        isPending = false
        result = v
        return v
      },
      (e: any) => {
        isRejected = true
        isPending = false
        error = e
        return e
      }
    )

    future.isFulfilled = function () {
      return isFulfilled
    }

    future.isPending = function () {
      return isPending
    }

    future.isRejected = function () {
      return isRejected
    }

    while (true) {
    //   if (isPending) {
    //     continue
    //   }
    //   console.log('d', isFulfilled)
      if (isFulfilled) {
        return result
      }
      if (isRejected && error !== undefined) {
        throw error
      }
    }
  }
}
