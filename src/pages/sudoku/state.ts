import { DefaultValue, atom, selector } from 'recoil'

import {  bool, withDefault } from '@recoiljs/refine'
import { syncEffect } from 'recoil-sync'

import { Board, indices } from './basic'
import { TB } from './test'

export function notesHas(note: number | undefined, val: number) {
  return (note || 0).toString(2)[val - 1] === '1'
}

const boolStore = (key: string, defaultValue: boolean) =>
  syncEffect<boolean>({
    storeKey: 'local-storage',
    refine: withDefault(bool(), defaultValue),
    syncDefault: true,
    read: ({ read }) => {
      const raw = read(key) as string | undefined
      if(!raw) return defaultValue
      return JSON.parse(raw) as boolean
    },
    write({ write }, val) {
      write(key, val)
    },
  })

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

function readBoardFromText(data: string): Board {
  const cells = data.split('')

  return createBoard(indices.map((i) => indices.map((j) => cells[i * 9 + j])))
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

export const compactBoardSelector = selector({
  key: 'compact-board',
  get: ({ get }) =>
    get(sudokuBoardState)
      .flatMap((v) => v)
      .map((v) => (v.fixed ? String(v.val) : '0'))
      .join(''),
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(sudokuBoardState, newValue)
      return
    }
    const data = newValue.replace(/[^0-9]/g, '')
    if (data.length !== 81) {
      return
    }
    set(sudokuBoardState, readBoardFromText(data))
  },
})

export const isScreenPad = atom({
  key: 'screen-pad',
  default: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
})

export const DialogImportState = atom({
  key: 'dialog-import',
  default: false,
})

export const DialogSelectPuzzleState = atom({
  key: 'dialog-select-puzzle',
  default: false,
})

export const showSolverAtom = atom({
  key: 'show-solver',
  default: true,
  effects: [boolStore('show-solver', true)],
})

export const disableInvalidAtom = atom({
  key: 'disable-invalid',
  default: true,
  effects: [boolStore('disable-invalid', true)],
})

export const noteHighContrastAtom = atom({
  key: 'note-high-contrast',
  default: false,
  effects: [boolStore('note-high-contrast', false)],
})
