import { RecoilSync } from 'recoil-sync'

export function SyncWithLocalStorage(props: React.PropsWithChildren) {
  return (
    <RecoilSync
      storeKey="local-storage"
      read={(itemKey) => localStorage.getItem(itemKey)}
      write={({ diff }) => {
        for (const [key, value] of diff) {
          localStorage.setItem(key, value as string)
        }
      }}
    >
      {props.children}
    </RecoilSync>
  )
}
