export interface Paginate<T> {
  data: T[],
  totalCount: number,
  summary: number,
  groupCount: number,
}
