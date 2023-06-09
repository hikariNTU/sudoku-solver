import { RecoilRoot } from 'recoil'

import { Header, SudokuPage } from '@/pages/sudoku/sudoku'
import '@/styles/App.css'

import Footer from './components/Footer/Footer'

function App() {
  return (
    <RecoilRoot>
      <Header />
      <SudokuPage />
      <Footer />
    </RecoilRoot>
  )
}

export default App
