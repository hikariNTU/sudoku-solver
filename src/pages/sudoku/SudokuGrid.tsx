import { forwardRef, useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import clsx from 'clsx'
import { cloneDeep } from 'lodash'

import { isValidValue } from '@/pages/sudoku/solver'
import {
  isScreenPad,
  noteState,
  parseNotes,
  sudokuBoardState,
  sudokuSetBoardState,
  toggleNote,
} from '@/pages/sudoku/state'

import { cellContext, useCellContext } from './CellContext'
import ScreenPadWrapper from './ScreenPad'
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

const SudokuCell = forwardRef<HTMLButtonElement, Record<never, never>>((props, ref) => {
  const { i, j, cell, notes, update, updateNote } = useCellContext()
  const { ...restProps } = props
  const editNote = useRecoilValue(noteState)
  const isSet = useRecoilValue(sudokuSetBoardState)

  const cellClasses = clsx('sudoku-cell', {
    'sudoku-cell__bd-r': j === 2 || j === 5,
    'sudoku-cell__bd-b': i === 2 || i === 5,
    'sudoku-cell__edit': isSet,
    'sudoku-cell__fixed': cell.fixed,
  })

  const eventHandler = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const val = numberLUT[e.code]
    const noteModifier =
      editNote || e.shiftKey || e.getModifierState('CapsLock') || e.getModifierState('Shift')
    if (val) {
      ;(noteModifier ? updateNote : update)(val)
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
      update(undefined)
    }
  }

  return (
    <button
      ref={ref}
      className={cellClasses}
      id={generateId(i, j)}
      aria-label={`position (${j + 1}, ${i + 1})`}
      onKeyDown={eventHandler}
      {...restProps}
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
})
SudokuCell.displayName = 'SudokuCell'

export const SudokuGrid = () => {
  const screenPad = useRecoilValue(isScreenPad)
  const [board, setBoard] = useRecoilState(sudokuBoardState)
  const isSet = useRecoilValue(sudokuSetBoardState)
  const updateCell = useCallback<UpdateCell>(
    (i, j, val, toNote = false) => {
      if (!isSet && board[i][j].fixed) {
        return
      }
      if (val && !toNote && !isValidValue(board, i, j, val)) {
        return
      }
      const newBoard = cloneDeep(board)
      if (toNote && val) {
        newBoard[i][j].note = toggleNote(newBoard[i][j].note, val)
      } else {
        newBoard[i][j].val = val
        if (isSet) {
          newBoard[i][j].fixed = !!val
        }
      }
      setBoard(newBoard)
    },
    [board, setBoard, isSet],
  )

  return (
    <div role="application" className="sudoku-grid">
      {indices.map((i) =>
        indices.map((j) => (
          <cellContext.Provider
            key={`${i}${j}`}
            value={{
              i,
              j,
              cell: board[i][j],
              notes: parseNotes(board[i][j].note),
              update(val) {
                updateCell(i, j, val)
              },
              updateNote(val) {
                updateCell(i, j, val, true)
              },
            }}
          >
            {screenPad && !board[i][j].fixed ? (
              <ScreenPadWrapper>
                <SudokuCell />
              </ScreenPadWrapper>
            ) : (
              <SudokuCell />
            )}
          </cellContext.Provider>
        )),
      )}
    </div>
  )
}
