export type BoardCell = {
  val?: number
  fixed?: boolean
  note?: number
}
export type Board = BoardCell[][]

export const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
export const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export const corners = [
  [0, 0],
  [3, 0],
  [6, 0],
  [3, 0],
  [3, 3],
  [3, 6],
  [6, 0],
  [6, 3],
  [6, 6],
] as const
