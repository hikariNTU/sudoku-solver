import { PropsWithChildren, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { Cross2Icon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

import { useCellContext } from './CellContext'
import { numbers } from './basic'
import './screen-pad.scss'
import { getAvailableValue } from './solver'
import { sudokuBoardState } from './state'

const NumPad = (props: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const board = useRecoilValue(sudokuBoardState)
  const { i, j, update, cell } = useCellContext()
  const updateAndClose: typeof update = (val) => {
    update(val)
    props.setOpen(false)
  }
  const available = getAvailableValue(board, i, j)
  if (cell.val) {
    available.add(undefined)
  }
  return (
    <div className="numpad-grid">
      {[...numbers, undefined].map((n) => (
        <button key={n} disabled={!available.has(n)} onClick={() => updateAndClose(n)}>
          {n || <Cross2Icon />}
        </button>
      ))}
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
