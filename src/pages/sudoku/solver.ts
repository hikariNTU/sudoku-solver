import { Board, corners, indices, numbers } from './basic'

function validateRange(board: Board, wheres: [number, number][]) {
  const seen = new Set<number>()
  for (const [i, j] of wheres) {
    const val = board[i][j].val
    if (!val) {
      continue
    }
    if (seen.has(val)) {
      return false
    }
    seen.add(val)
  }
  return true
}

export function isValidValue(board: Board, i: number, j: number, val: number) {
  const rowSafe = indices.every((x) => board[x][j].val !== val)
  const colSafe = indices.every((x) => board[i][x].val !== val)
  const I = i - (i % 3)
  const J = j - (j % 3)
  const blockSafe = [
    [I, J],
    [I + 1, J],
    [I + 2, J],
    [I, J + 1],
    [I + 1, J + 1],
    [I + 2, J + 1],
    [I, J + 2],
    [I + 1, J + 2],
    [I + 2, J + 2],
  ].every(([x, y]) => board[x][y].val !== val)
  return rowSafe && colSafe && blockSafe
}

function getNextEmpty(board: Board) {
  for (const i of indices) {
    for (const j of indices) {
      if (!board[i][j].val) {
        return [i, j]
      }
    }
  }
  return null
}

/**
 * Solve the board with naive backtracking
 * @see https://leetcode.com/problems/sudoku-solver/solutions/15959/accepted-python-solution/
 * @param board The given board will be filled in-place
 * @returns True if board is solved else false
 */
export async function solve(board: Board, callback?: (board: Board) => Promise<unknown>) {
  const nextEmpty = getNextEmpty(board)
  if (!nextEmpty) {
    return true
  }
  const [i, j] = nextEmpty

  for (const val of numbers) {
    if (isValidValue(board, i, j, val)) {
      board[i][j].val = val

      // Use callback to notify the solver has filled a value in board
      if (callback) {
        const keepGoing = await callback(board)
        if (!keepGoing) {
          break
        }
      }

      if (await solve(board, callback)) {
        return true
      }
    }
    board[i][j].val = undefined
  }
  return false
}

/**
 * A modified backtracking with heuristic candidate.
 *
 * Largely improve performance on those sparse boards that will yield a lot of error steps in naive solution
 */
export async function advanceSolver(b: Board, callback?: (board: Board) => Promise<unknown>) {
  /**
   * Step 1
   *
   * Keep a record on all unsolved cells and their possible candidates
   */
  const LUT: Record<string, number[]> = {}
  for (const i of indices) {
    for (const j of indices) {
      if (!b[i][j].val) {
        LUT[`${i}${j}`] = numbers.reduce(
          (prev, num) => (isValidValue(b, i, j, num) ? [...prev, num] : prev),
          [] as number[],
        )
      }
    }
  }

  /**
   * Step 2
   *
   * Sort the list from least candidate (easier cells) to largest
   */
  const orderLUT = Object.entries(LUT).map(([indices, count]) => {
    const [i, j] = indices.split('').map((v) => +v)
    return [i, j, count]
  }) as [number, number, number[]][]
  orderLUT.sort((a, b) => a[2].length - b[2].length)

  function findNextEmpty() {
    return orderLUT.find(([i, j]) => !b[i][j].val)
  }

  /**
   * Step 3
   *
   * Solve it with backtracking but get the next easiest empty cell in the prepared list.
   * And also only check the given candidates
   */
  async function solver() {
    const nextEmpty = findNextEmpty()
    if (!nextEmpty) {
      return true
    }

    const [i, j, candidates] = nextEmpty
    for (const val of candidates) {
      if (isValidValue(b, i, j, val)) {
        b[i][j].val = val

        if (callback) {
          const keepGoing = await callback(b)
          if (!keepGoing) {
            break
          }
        }

        if (await solver()) {
          return true
        }
      }
      b[i][j].val = undefined
    }
    return false
  }

  return solver()
}

/**
 * Validate if the given board problem is valid
 * @see https://leetcode.com/problems/valid-sudoku/
 * */
export function validateBoard(board: Board) {
  for (const i of indices) {
    if (
      !validateRange(
        board,
        indices.map((j) => [i, j]),
      ) ||
      !validateRange(
        board,
        indices.map((j) => [j, i]),
      )
    ) {
      return false
    }
  }

  for (const [i, j] of corners) {
    if (
      !validateRange(board, [
        [i, j],
        [i + 1, j],
        [i + 2, j],
        [i, j + 1],
        [i + 1, j + 1],
        [i + 2, j + 1],
        [i, j + 2],
        [i + 1, j + 2],
        [i + 2, j + 2],
      ])
    ) {
      return false
    }
  }

  return true
}
