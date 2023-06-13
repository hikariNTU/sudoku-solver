import { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { HamburgerMenuIcon, CheckIcon, EraserIcon, EnterIcon } from '@radix-ui/react-icons'
import { useKey } from 'react-use'

import Dialog from '@/components/Dialog/Dialog'
import {
  DialogImportState,
  compactBoardSelector,
  disableInvalidAtom,
  noteHighContrastAtom,
  showSolverAtom,
  sudokuBoardState,
  sudokuSetBoardState,
} from '@/pages/sudoku/state'

import { PuzzleSelector, PuzzleSelectorItem } from './PuzzleSelector'
import './menu.scss'

export type MenuItemProps = {
  content: JSX.Element
  rightContent: JSX.Element
}

const Check = () => (
  <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
    <CheckIcon />
  </DropdownMenu.ItemIndicator>
)

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
    <DropdownMenu.Item className="DropdownMenuItem" onClick={clear}>
      <EraserIcon className="DropdownMenuItemIndicator" />
      Clear Filled Cells
    </DropdownMenu.Item>
  )
}

const EnableBoardEditingSwitch = () => {
  const [isEdit, setIsEdit] = useRecoilState(sudokuSetBoardState)
  useKey('e', () => {
    setIsEdit((v) => !v)
  })
  return (
    <DropdownMenu.CheckboxItem
      className="DropdownMenuCheckboxItem"
      checked={isEdit}
      onCheckedChange={setIsEdit}
    >
      <Check />
      Toggle Edit Board <div className="RightSlot">E</div>
    </DropdownMenu.CheckboxItem>
  )
}

const BoardReader = () => {
  const [open, setOpen] = useRecoilState(DialogImportState)
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
      {...{ open, setOpen }}
    />
  )
}

const BoardReaderItem = () => {
  const setOpen = useSetRecoilState(DialogImportState)

  return (
    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => setOpen(true)}>
      <EnterIcon className="DropdownMenuItemIndicator" />
      Import A Puzzle
    </DropdownMenu.Item>
  )
}

const Menu = () => {
  const [showSolver, setShowSolver] = useRecoilState(showSolverAtom)
  const [disableInvalid, setDisableInvalid] = useRecoilState(disableInvalidAtom)
  const [noteHighContrast, setNoteHighContrast] = useRecoilState(noteHighContrastAtom)

  return (
    <>
      <BoardReader />
      <PuzzleSelector />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="DropdownMenuTrigger" aria-label="Customise options">
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" align="start" sideOffset={5}>
            <PuzzleSelectorItem />
            <DropdownMenu.Separator className="DropdownMenuSeparator" />
            <ClearAll />
            <EnableBoardEditingSwitch />
            <BoardReaderItem />

            <DropdownMenu.Separator className="DropdownMenuSeparator" />

            <DropdownMenu.Label className="DropdownMenuLabel">Misc</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem
              className="DropdownMenuCheckboxItem"
              checked={showSolver}
              onCheckedChange={setShowSolver}
            >
              <Check />
              Show Solver
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              className="DropdownMenuCheckboxItem"
              checked={disableInvalid}
              onCheckedChange={setDisableInvalid}
            >
              <Check />
              Disable Invalid Input
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              className="DropdownMenuCheckboxItem"
              checked={noteHighContrast}
              onCheckedChange={setNoteHighContrast}
            >
              <Check />
              Note High Contrast
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  )
}

export default Menu
