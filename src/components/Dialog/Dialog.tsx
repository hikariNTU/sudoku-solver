import * as D from '@radix-ui/react-dialog'

import './dialog.scss'

const Dialog = (
  props: D.DialogProps & {
    title: string
    description?: string
    content: JSX.Element
  },
) => (
  <D.Root>
    <D.Trigger asChild>{props.children}</D.Trigger>
    <D.Portal>
      <D.Overlay className="DialogOverlay" />
      <D.Content className="DialogContent">
        <D.Title className="DialogTitle">{props.title}</D.Title>
        <D.Description className="DialogDescription">{props.description}</D.Description>
        <div className="DialogInnerContent">{props.content}</div>
        <div className="DialogActions">
          <D.Close>Close</D.Close>
        </div>
      </D.Content>
    </D.Portal>
  </D.Root>
)

export default Dialog
