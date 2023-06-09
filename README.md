# Sudoku Solver

[🔢Live Page](https://hikarintu.github.io/sudoku-solver/)

A backtracking sudoku online solver with playable feature.

## Solver algorithm - Backtracking

**Steps**

- Find next empty cell
- Try filling the empty cell value from 1 to 9 if it fit
  - If none digit can be filled, then the board is not solvable, backtracking to the next candidate
  - Else using the filled cell and start finding the next empty cell

**Heuristic Mode Improvements**

- Instead of finding all cells for next empty cell, pre-build an array to keep track of those initial empty.
- For each empty cell, find all its candidate number first and store it in the array
- When finding next empty cell, find the easiest one (least candidates) and fill it first, those easy level sudoku boards tend to contain a lot of one shot cells.

Notice! Heuristic Mode only cut down a bit of calculation time. In some cases like those well crafted boards, the heuristic might be a lot slower than the default naive one depends on the actual solution.

But in general, Heuristic Mode will be faster and more natural.

## What've I used in the site?
- Typescript + Vite + React (DX first)
- Recoil, for easy and robust global state management
- Radix UI, for unstyled component since generally I like to create styles by myself
- React-use, Lodash, for some small stuff that no one bother
- GitHub actions deploy GitHub Page (this is a game changer)

## Contributions

Always welcome, I've few tasks in blueprint right now:

- Mobile touch input like a dial-ring if user press on the cell
- Show the error message if board fail to be solved or not able to import board (Radix Toast perhaps)
- Undo, Redo. Maybe recoil already has some builtin addon?
- Sudoku dataset and the selector
- Difficulty detection base on some magic algorithm
- Check if there's a way to make the accessibility better
