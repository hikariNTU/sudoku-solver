import * as T from '@radix-ui/react-tooltip'

import './tooltip.scss'

const Tooltip = (props: React.PropsWithChildren<{ content: string }>) => {
  return (
    <T.Provider>
      <T.Root>
        <T.Trigger asChild>{props.children}</T.Trigger>
        <T.Portal>
          <T.Content className="TooltipContent" sideOffset={5}>
            {props.content}
            <T.Arrow className="TooltipArrow" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  )
}

export default Tooltip
