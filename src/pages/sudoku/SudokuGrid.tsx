import { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import clsx from 'clsx'
import { cloneDeep } from 'lodash'

import { isValidValue } from '@/pages/sudoku/solver'
import {
  noteState,
  parseNotes,
  sudokuBoardState,
  sudokuSetBoardState,
  toggleNote,
} from '@/pages/sudoku/state'

import './sudokuGrid.scss'

type UpdateCell = (i: number, j: number, val: number | undefined, toNote?: boolean) => void

const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
const generateId = (i: number, j: number) => `board-cell-${i}-${j}`
const numberLUT: Record<string, number> = Object.fromEntries(
  numbers
    .map((v) => [
      [`Digit${v}`, v],
      [`Numpad${v}`, v],
    ])
    .flat(1),
)

const focusCell = (i: number, j: number) => {
  document.getElementById(generateId(i, j))?.focus()
}

const SudokuCell = (props: { i: number; j: number; updateCell: UpdateCell }) => {
  const { i, j, updateCell } = props
  const board = useRecoilValue(sudokuBoardState)
  const isSet = useRecoilValue(sudokuSetBoardState)

  const cell = board[i][j]
  const notes = parseNotes(cell.note)

  const cellClasses = clsx('sudoku-cell', {
    'sudoku-cell__bd-r': j === 2 || j === 5,
    'sudoku-cell__bd-b': i === 2 || i === 5,
    'sudoku-cell__edit': isSet,
    'sudoku-cell__fixed': cell.fixed,
  })

  const eventHandler = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const val = numberLUT[e.code]
    if (val) {
      updateCell(
        i,
        j,
        val,
        e.shiftKey || e.getModifierState('CapsLock') || e.getModifierState('Shift'),
      )
    }
    if (e.code === 'ArrowUp' && i > 0) {
      e.preventDefault()
      focusCell(i - 1, j)
    } else if (e.code === 'ArrowDown' && i < 8) {
      e.preventDefault()
      focusCell(i + 1, j)
    } else if (e.code === 'ArrowLeft' && j > 0) {
      e.preventDefault()
      focusCell(i, j - 1)
    } else if (e.code === 'ArrowRight' && j < 8) {
      e.preventDefault()
      focusCell(i, j + 1)
    } else if (e.code === 'Escape' || e.code === 'Backspace' || e.code === 'Delete') {
      e.preventDefault()
      updateCell(i, j, undefined)
    }
  }

  return (
    <button
      className={cellClasses}
      id={generateId(i, j)}
      aria-label={`position (${j + 1}, ${i + 1})`}
      onKeyDown={eventHandler}
    >
      {cell.val ? <strong>{cell.val}</strong> : undefined}
      {!cell.val && !!cell.note && (
        <div className="sudoku-cell-note">
          {numbers.map((val) => (
            <span key={val}>{notes.has(val) ? val : ''}</span>
          ))}
        </div>
      )}
    </button>
  )
}

export const SudokuGrid = () => {
  const [board, setBoard] = useRecoilState(sudokuBoardState)
  const editNote = useRecoilValue(noteState)
  const isSet = useRecoilValue(sudokuSetBoardState)
  const updateCell = useCallback<UpdateCell>(
    (i, j, val, toNote = false) => {
      const isEditNote = editNote || toNote
      if (!isSet && board[i][j].fixed) {
        return
      }
      if (val && !isEditNote && !isValidValue(board, i, j, val)) {
        return
      }
      const newBoard = cloneDeep(board)
      if (isEditNote && val) {
        newBoard[i][j].note = toggleNote(newBoard[i][j].note, val)
      } else {
        newBoard[i][j].val = val
        if (isSet) {
          newBoard[i][j].fixed = !!val
        }
      }
      setBoard(newBoard)
    },
    [board, setBoard, isSet, editNote],
  )

  return (
    <div role="application" className="sudoku-grid">
      {indices.map((i) =>
        indices.map((j) => <SudokuCell key={`${i}${j}`} i={i} j={j} updateCell={updateCell} />),
      )}
    </div>
  )
}
