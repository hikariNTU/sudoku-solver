import { RecoilRoot } from 'recoil'

import { Header, SudokuPage } from '@/pages/sudoku/sudoku'
import '@/styles/App.css'

import Footer from './components/Footer/Footer'
import ReloadPrompt from './components/ReloadPrompt/ReloadPrompt'
import { SyncWithLocalStorage } from './components/SyncStore/SyncStorageStore'

function App() {
  return (
    <RecoilRoot>
      <SyncWithLocalStorage>
        <Header />
        <SudokuPage />
        <Footer />
        <ReloadPrompt />
      </SyncWithLocalStorage>
    </RecoilRoot>
  )
}

export default App
