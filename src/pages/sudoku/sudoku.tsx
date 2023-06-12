import { useRecoilState } from 'recoil'

import { FileTextIcon, QuestionMarkCircledIcon, MixIcon } from '@radix-ui/react-icons'
import { useKey } from 'react-use'

import Toggle from '@/components/Toggle/Toggle'
import Tooltip from '@/components/Tooltip/Tooltip'
import Menu from '@/pages/sudoku/Menu/Menu'

import { SolverPanel } from './SolverPanel'
import { SudokuGrid } from './SudokuGrid'
import { isScreenPad, noteState } from './state'
import './sudoku.scss'

const ToggleScreenPad = () => {
  const [a, setA] = useRecoilState(isScreenPad)
  return (
    <Toggle pressed={a} onPressedChange={setA}>
      <MixIcon />
      Screen Pad
    </Toggle>
  )
}

const ToggleNote = () => {
  const [isEdit, setIsEdit] = useRecoilState(noteState)
  useKey('n', () => {
    setIsEdit((v) => !v)
  })
  return (
    <Toggle pressed={isEdit} onPressedChange={setIsEdit}>
      <FileTextIcon />
      Note (N)
      <Tooltip content="You can also use Shift key + number or CapsLock to enter notes">
        <QuestionMarkCircledIcon />
      </Tooltip>
    </Toggle>
  )
}

export const SudokuPage = () => {
  return (
    <div className="sudoku">
      <div className="actions">
        <Menu />
        <ToggleScreenPad />
        <ToggleNote />
      </div>
      <SudokuGrid />
      <SolverPanel />
    </div>
  )
}

export const Header = () => {
  return (
    <header className="Header">
      <img src="./sudoku.svg" width="72" height="72" aria-hidden />
      <h1>Sudoku Solver</h1>
      <p>A playable Sudoku solver using backtracking</p>
    </header>
  )
}
