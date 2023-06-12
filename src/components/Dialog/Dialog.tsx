import { useState, useMemo } from 'react'

import * as D from '@radix-ui/react-dialog'

import './dialog.scss'
import { DialogCtx, dialogCtx } from './dialogCtx'

const Dialog = (
  props: D.DialogProps & {
    title: string
    description?: string | JSX.Element
    content: JSX.Element
    open?: boolean
    setOpen?: React.Dispatch<boolean>
  },
) => {
  const [open, setOpen] = useState(props.open ?? false)
  const ctx = useMemo<DialogCtx>(
    () => ({
      setOpen: props.setOpen ?? setOpen,
    }),
    [setOpen, props.setOpen],
  )

  return (
    <dialogCtx.Provider value={ctx}>
      <D.Root open={props.open ?? open} onOpenChange={ctx.setOpen}>
        <D.Trigger asChild>{props.children}</D.Trigger>
        <D.Portal>
          <D.Overlay className="DialogOverlay" />
          <D.Content className="DialogContent">
            <D.Title className="DialogTitle">{props.title}</D.Title>
            {props.description && (
              <D.Description className="DialogDescription">{props.description}</D.Description>
            )}
            <div className="DialogInnerContent">{props.content}</div>
            <div className="DialogActions">
              <D.Close>Close</D.Close>
            </div>
          </D.Content>
        </D.Portal>
      </D.Root>
    </dialogCtx.Provider>
  )
}

export default Dialog
