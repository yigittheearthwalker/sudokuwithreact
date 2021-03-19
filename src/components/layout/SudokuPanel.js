import React from 'react'
import SudokuTable from './SudokuTable'
import SudokuControl from './SudokuControl'

const SudokuPanel = () => {
    return (
        <div className="sudoku-panel">
            <SudokuTable />
            <SudokuControl />
        </div>
    )
}

export default SudokuPanel
