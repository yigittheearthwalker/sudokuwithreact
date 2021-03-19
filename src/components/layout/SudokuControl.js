import React, {useContext}from 'react'
import SudokuContext from '../../context/sudoku/sudokuContext'

const SudokuControl = () => {
    const sudokuContext = useContext(SudokuContext)
    const {lastMove, currentMove, noteMode,sudokuBackOrForward, toggleNoteMode, checkSudoku, emptyOnes, resetSudoku} = sudokuContext

    return (
        <div className="sudoku-panel__sub sudoku-control-container"> 
            <div className="sudoku-control-button-container">
                <div className="control-btn-row">
                    <button disabled={currentMove == 0 || noteMode ? true : false} onClick={() => sudokuBackOrForward(-1)} type="button" className="btn btn-control btn-blue">Undo<ion-icon size="large" name="arrow-undo-circle-outline"></ion-icon></button>
                    <button disabled={currentMove == lastMove || noteMode ? true : false} onClick={() => sudokuBackOrForward(1)} type="button" className="btn btn-control btn-blue"><ion-icon size="large" name="arrow-redo-circle-outline"></ion-icon>Redo</button>
                </div>
                <div className="control-btn-row">
                    <button onClick={toggleNoteMode} type="button" className={noteMode ? "btn btn-control btn-orange btn-orange-shine" : "btn btn-control btn-orange"}>Note<ion-icon size="large" name="pencil-outline"></ion-icon></button>
                    <button onClick={checkSudoku} disabled={noteMode ? true : false} type="button" className="btn btn-control btn-green"><ion-icon size="large" name="checkmark-outline"></ion-icon>Check</button>
                </div>
                <div className="control-info-row">
                    <p>Current Move Number: {currentMove}</p>
                    <p>Last Move Number: {lastMove}</p>
                    <p>Remaining Inputs: {emptyOnes}</p>
                </div>
                <div className="control-reset-row">
                    <button onClick={resetSudoku} type="button" className="btn btn-reset btn-orange btn-grey">Reset<ion-icon size="large" name="refresh-outline"></ion-icon></button>
                </div>
            </div> 
        </div>
    )
} 

export default SudokuControl
