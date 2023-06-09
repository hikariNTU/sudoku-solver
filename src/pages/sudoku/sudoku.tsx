import { useState } from 'react'
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'

import {
  Pencil2Icon,
  FileTextIcon,
  QuestionMarkCircledIcon,
  TrashIcon,
  EnterIcon,
} from '@radix-ui/react-icons'
import { useKey } from 'react-use'

import Dialog from '@/components/Dialog/Dialog'
import { SudokuGrid } from '@/components/SudokuGrid'
import Toggle from '@/components/Toggle/Toggle'
import Tooltip from '@/components/Tooltip/Tooltip'

import { SolverPanel } from './SolverPanel'
import { compactBoardSelector, noteState, sudokuBoardState, sudokuSetBoardState } from './state'
import './sudoku.scss'

const ClearAll = () => {
  const setBoard = useSetRecoilState(sudokuBoardState)
  const isEdit = useRecoilValue(sudokuSetBoardState)

  const clear = () => {
    setBoard((board) =>
      board.map((line) =>
        line.map((cell) => {
          if (isEdit) {
            return {
              val: undefined,
            }
          }
          return {
            val: cell.fixed ? cell.val : undefined,
            fixed: cell.fixed,
          }
        }),
      ),
    )
  }

  return (
    <button onClick={clear}>
      <TrashIcon />
      Clear
    </button>
  )
}

const EnableBoardEditingSwitch = () => {
  const [isEdit, setIsEdit] = useRecoilState(sudokuSetBoardState)
  useKey('e', () => {
    setIsEdit((v) => !v)
  })
  return (
    <Toggle pressed={isEdit} onPressedChange={setIsEdit}>
      <Pencil2Icon />
      Edit Board (E)
    </Toggle>
  )
}

const ToggleNote = () => {
  const [isEdit, setIsEdit] = useRecoilState(noteState)
  useKey('n', () => {
    setIsEdit((v) => !v)
  })
  return (
    <>
      <Toggle pressed={isEdit} onPressedChange={setIsEdit}>
        <FileTextIcon />
        Note (N)
        <Tooltip content="You can also use Shift key + number or CapsLock to enter notes">
          <QuestionMarkCircledIcon />
        </Tooltip>
      </Toggle>
    </>
  )
}

const BoardReader = () => {
  const [board, setBoard] = useRecoilState(compactBoardSelector)
  const [data, setData] = useState(board)

  return (
    <Dialog
      title="Import Board"
      content={
        <div className="reader">
          <p>Import a board definition.</p>
          <label htmlFor="reader-input">Board data</label>
          <textarea
            id="reader-input"
            value={data}
            style={{ resize: 'vertical' }}
            rows={9}
            onChange={(e) => {
              setData(e.currentTarget.value)
            }}
            placeholder="format: 0000694500000030000004206087..."
          />
          <button onClick={() => setBoard(data)}>Parse</button>
        </div>
      }
    >
      <button>
        <EnterIcon />
        Import
      </button>
    </Dialog>
  )
}

export const SudokuPage = () => {
  return (
    <div className="sudoku">
      <div className="actions">
        <ToggleNote />
        <EnableBoardEditingSwitch />
        <ClearAll />
        <BoardReader />
      </div>
      <SudokuGrid />
      <SolverPanel />
    </div>
  )
}

export const Header = () => {
  return (
    <header className="Header">
      <img src="./icon.svg" width="72" height="72" aria-hidden />
      <h1>Sudoku Solver</h1>
      <p>A playable Sudoku solver using backtracking</p>
    </header>
  )
}
