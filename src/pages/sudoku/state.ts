import { atom } from 'recoil'

import { Board, indices } from './basic'
import { TB } from './test'

export function notesHas(note: number | undefined, val: number) {
  return (note || 0).toString(2)[val - 1] === '1'
}

export function parseNotes(note = 0) {
  return new Set(
    note
      .toString(2)
      .padStart(9, '0')
      .split('')
      .map((flag, idx) => [idx + 1, flag] as const)
      .filter(([, flag]) => flag === '1')
      .map(([num]) => num),
  )
}

export function toggleNote(note: number | undefined, val: number) {
  const notes = (note || 0).toString(2).padStart(9, '0').split('')
  notes[val - 1] = notes[val - 1] === '0' ? '1' : '0'
  return parseInt(notes.join(''), 2)
}

function validValue(v: number) {
  return Number.isInteger(v) && v <= 9 && v >= 1
}

function createBoard(data: (number | string | undefined)[][]): Board {
  return data.map((line) =>
    line.map((v) => {
      const val = Number(v)
      const hasVal = validValue(val)
      return {
        val: hasVal ? val : undefined,
        fixed: hasVal,
      }
    }),
  )
}

export function readBoardFromText(data: string): Board {
  const cells = data.split('')

  return createBoard(indices.map((j) => indices.map((i) => cells[i * 9 + j])))
}

export const sudokuBoardState = atom({
  key: 'sudoku-board',
  default: createBoard(TB) as Board,
})

export const solverSleepState = atom({
  key: 'sudoku-solver-sleep',
  default: 5,
})

export const sudokuSetBoardState = atom({
  key: 'sudoku-board-set',
  default: false,
})

export const noteState = atom({
  key: 'note-on',
  default: false,
})
