import { fileURLToPath, URL } from 'url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sudoku-solver/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sudoku.svg', 'sudoku@1x.png', 'sudoku@2x.png'],
      manifest: {
        name: 'Sudoku Solver - HikariNTU',
        short_name: 'SudokuSolver',
        description:
          'Solve Sudoku puzzles with ease on our website! Our solver uses the backtracking algorithm to assign numbers one by one to empty cells. Before assigning a number, it checks whether it is safe to assign.',
        orientation: 'portrait',
        theme_color: '#222222',
        icons: [
          {
            src: 'sudoku@1x.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'sudoku@2x.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
})
