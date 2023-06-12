import { PropsWithChildren, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Cross2Icon, FileTextIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

import Toggle from '@/components/Toggle/Toggle'

import { useCellContext } from './CellContext'
import { numbers } from './basic'
import './screen-pad.scss'
import { getAvailableValue } from './solver'
import { disableInvalidAtom, noteState, sudokuBoardState, sudokuSetBoardState } from './state'

const ToggleNote = () => {
  const [isEdit, setIsEdit] = useRecoilState(noteState)
  return (
    <Toggle className="numpad-toggle-note" pressed={isEdit} onPressedChange={setIsEdit}>
      <FileTextIcon />
      Note
    </Toggle>
  )
}

const NumPad = (props: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const disableInvalid = useRecoilValue(disableInvalidAtom)
  const board = useRecoilValue(sudokuBoardState)
  const isEdit = useRecoilValue(sudokuSetBoardState)
  const isNote = useRecoilValue(noteState)
  const { i, j, update, updateNote, notes } = useCellContext()
  const updateAndClose: typeof update = (val) => {
    if (isNote) {
      updateNote(val)
    } else {
      update(val)
      props.setOpen(false)
    }
  }
  const available = getAvailableValue(board, i, j)

  return (
    <div className="numpad-grid">
      {[...numbers].map((n) => (
        <button
          className="Toggle"
          key={n}
          disabled={!isNote && !isEdit && disableInvalid && !available.has(n)}
          onClick={() => updateAndClose(n)}
          data-state={isNote ? (notes.has(n) ? 'on' : 'off') : undefined}
        >
          {n}
        </button>
      ))}
      <button onClick={() => updateAndClose(undefined)}>
        <Cross2Icon />
      </button>
      <ToggleNote />
    </div>
  )
}

const ScreenPadWrapper = (props: PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{props.children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent" sideOffset={5}>
          <NumPad setOpen={setOpen} />
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default ScreenPadWrapper
