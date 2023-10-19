export interface IPaginationPage {
  currentPage: number
  totalPages: number
  totalCount: number
}
export interface IPaginationPageResult<T> {
  meta: IPaginationPage
  items: T[]
}
export interface IPaginationOffsetResult<T> {
  meta: Pick<IPaginationPage, 'totalCount'>
  items: T[]
}

export type IPaginationResult<T> = IPaginationPageResult<T> | IPaginationOffsetResult<T>
