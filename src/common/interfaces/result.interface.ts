export interface Result<T = Record<string, any>> {
  ok: boolean
  message?: string
  result: T
}
