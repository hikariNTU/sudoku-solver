import { createContext, useContext } from 'react'

export type DialogCtx = {
  setOpen: React.Dispatch<boolean>
}
export const dialogCtx = createContext<DialogCtx | undefined>(undefined)

export const useDialogContext = () => {
  const ctx = useContext(dialogCtx)
  if (!ctx) {
    throw 'Dialog context is missing!'
  }
  return ctx
}
