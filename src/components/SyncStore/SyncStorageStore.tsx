import { RecoilSync } from 'recoil-sync'

const prefix = 'sudoku-'

export function SyncWithLocalStorage(props: React.PropsWithChildren) {
  return (
    <RecoilSync
      storeKey="local-storage"
      read={(itemKey) => localStorage.getItem(prefix + itemKey)}
      write={({ diff }) => {
        for (const [key, value] of diff) {
          localStorage.setItem(prefix + key, value as string)
        }
      }}
    >
      {props.children}
    </RecoilSync>
  )
}
