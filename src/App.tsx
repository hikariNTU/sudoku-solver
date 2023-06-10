import { RecoilRoot } from 'recoil'

import { Header, SudokuPage } from '@/pages/sudoku/sudoku'
import '@/styles/App.css'

import Footer from './components/Footer/Footer'
import ReloadPrompt from './components/ReloadPrompt/ReloadPrompt'

function App() {
  return (
    <RecoilRoot>
      <Header />
      <SudokuPage />
      <Footer />
      <ReloadPrompt />
    </RecoilRoot>
  )
}

export default App
