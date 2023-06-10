import * as T from '@radix-ui/react-toggle'
import clsx from 'clsx'

import './toggle.scss'

const Toggle = (props: T.ToggleProps) => {
  return <T.Root {...props} className={clsx('Toggle', props.className)} />
}

export default Toggle
