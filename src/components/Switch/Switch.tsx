import { forwardRef } from 'react'

import * as S from '@radix-ui/react-switch'

import './switch.scss'

type SwitchProps = {
  label: string
} & S.SwitchProps

const Switch = forwardRef<HTMLDivElement, SwitchProps>((props, ref) => {
  const { label, ...rootProps } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} ref={ref}>
      <label className="Label" htmlFor={props.id} style={{ paddingRight: 15 }}>
        {label}
        <S.Root className="SwitchRoot" {...rootProps}>
          <S.Thumb className="SwitchThumb" />
        </S.Root>
      </label>
    </div>
  )
})

export default Switch
