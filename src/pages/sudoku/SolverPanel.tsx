import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { cloneDeep } from 'lodash'

import Switch from '@/components/Switch/Switch'
import { sleep } from '@/utils'

import { Board } from './basic'
import { solve } from './solver'
import { solverSleepState, sudokuBoardState } from './state'

let solveId = 0

const ProgressiveSwitch = () => {
  const [time, setTime] = useRecoilState(solverSleepState)

  return (
    <Switch
      label="Progressive"
      checked={!!time}
      onCheckedChange={(v) => (v ? setTime(5) : setTime(0))}
    ></Switch>
  )
}

export const SolverPanel = () => {
  const [board, setBoard] = useRecoilState(sudokuBoardState)
  const sleepTime = useRecoilValue(solverSleepState)
  const [count, setCount] = useState(0)
  const [solving, setSolving] = useState(false)

  const solveBoard = async () => {
    setSolving(true)
    solveId += 1
    const currentSolveId = solveId
    setCount(0)
    const newBoard = cloneDeep(board)
    const oldBoard = cloneDeep(board)
    const callback = sleepTime
      ? async (board: Board) => {
          setCount((c) => c + 1)
          if (currentSolveId !== solveId) {
            return false
          }
          setBoard(cloneDeep(board))
          await sleep(sleepTime)
          return true
        }
      : undefined
    const success = await solve(newBoard, callback)
    if (success) {
      setBoard(newBoard)
    } else {
      setBoard(oldBoard)
      console.log('Not able to solve!')
    }
    setSolving(false)
  }

  return (
    <div className="solver-panel">
      <h3>Solver</h3>
      <p>
        We use <a href="https://en.wikipedia.org/wiki/Backtracking">backtracking</a> to find the
        solution from the current board. The algorithm we use can be found on Leetcode and other
        websites, including ChatGPT.
      </p>
      <p>
        You can toggle on/off to progressively show how the board is being solved in real-time
        instead of immediately solving it under the scene.
      </p>
      <p>
        The implemented solver is based on{' '}
        <a href="https://leetcode.com/problems/sudoku-solver/solutions/15959/accepted-python-solution/">
          the solution from Leetcode Sudoku Solver
        </a>
        .
      </p>
      <div className="solver-panel-buttons">
        <button onClick={solveBoard} disabled={solving}>
          Solve the Board
        </button>
        <ProgressiveSwitch />
      </div>
      {!!sleepTime && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => {
              solveId += 1
            }}
            disabled={!solving}
            style={{ flex: 1 }}
          >
            Stop
          </button>
          <div>Attempts: {count}</div>
        </div>
      )}
    </div>
  )
}
