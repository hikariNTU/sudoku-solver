import { useRecoilState, useSetRecoilState } from 'recoil'

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ListBulletIcon } from '@radix-ui/react-icons'
import { useAsync } from 'react-use'

import Dialog from '@/components/Dialog/Dialog'
import { useDialogContext } from '@/components/Dialog/dialogCtx'

import { DialogSelectPuzzleState, compactBoardSelector } from '../state'

const Puzzles = () => {
  const {
    loading,
    error,
    value: puzzles,
  } = useAsync(async () => (await import('../puzzles0.sdm?raw')).default)
  const setBoard = useSetRecoilState(compactBoardSelector)
  const { setOpen } = useDialogContext()

  if (loading) {
    return <div>loading...</div>
  }
  if (error || !puzzles) {
    return <div>Error! Reload the page!</div>
  }
  return (
    <div className="puzzles-list">
      {puzzles
        .split('\n')
        .filter(Boolean)
        .map((puzzle, idx) => (
          <button
            key={puzzle}
            onClick={() => {
              setBoard(puzzle)
              setOpen(false)
            }}
          >
            Level {idx + 1}
          </button>
        ))}
    </div>
  )
}

const Desc = () => (
  <p>
    The following puzzles is a subset from <a href="https://www.sudocue.net/">SudoCue</a>. Each
    puzzle is well crafted and most of them are medium level. You must use some solving skills
    instead of blindly solving them.
  </p>
)

export const PuzzleSelector = () => {
  const [open, setOpen] = useRecoilState(DialogSelectPuzzleState)
  return (
    <Dialog
      title="Select Puzzles"
      description={<Desc />}
      content={<Puzzles />}
      {...{ open, setOpen }}
    />
  )
}

export const PuzzleSelectorItem = () => {
  const setOpen = useSetRecoilState(DialogSelectPuzzleState)

  return (
    <DropdownMenuItem className="DropdownMenuItem" onClick={() => setOpen(true)}>
      <ListBulletIcon className="DropdownMenuItemIndicator" />
      Select Puzzles
    </DropdownMenuItem>
  )
}
