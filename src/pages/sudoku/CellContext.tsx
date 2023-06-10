import { createContext, useContext } from 'react'

import { BoardCell } from './basic'

export type CellContext = {
  i: number
  j: number
  update: (val: number | undefined) => void
  updateNote: (val: number | undefined) => void
  cell: BoardCell
  notes: Set<number>
}
export const cellContext = createContext<CellContext | undefined>(undefined)

export const useCellContext = () => {
  const ctx = useContext(cellContext)
  if (!ctx) {
    throw 'Cell Context has not been initialized!'
  }
  return ctx
}
