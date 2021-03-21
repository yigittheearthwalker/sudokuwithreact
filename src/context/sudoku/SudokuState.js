import React, { useState, useReducer } from 'react'
import SudokuContext from './sudokuContext'
import sudokuReducer from './sudokuReducer'
import Sudoku from '../../utils/Sudoku'
import {sudokuBuilder, sudokuValidator} from '../../utils/sudokuMachine'
import {sudokuLogger, sudokuSetter, lastMoveChecker} from '../../utils/logMachine'
import {
    REQUEST_SUDOKU,
    CREATE_SUDOKU,
    UPDATE_SUDOKU,
    SET_SUDOKU,
    NOTE_MODE,
    RESET_SUDOKU
  } from '../types'



const SudokuState = (props) => {

const initialState = {
    sudoku: new Sudoku(JSON.parse(localStorage.getItem('sudoku'))),
    currentMove: JSON.parse(localStorage.getItem('sudoku')) ? JSON.parse(localStorage.getItem('sudoku')).moveNumber : 0,
    lastMove: lastMoveChecker(),
    emptyOnes: JSON.parse(localStorage.getItem('sudoku')) ? JSON.parse(localStorage.getItem('sudoku')).emptyOnes : 0,
    noteMode: false,
    request: false,
    progress: null,
    level: null,
    isValid: false
}

const [state, dispatch] = useReducer(sudokuReducer, initialState);


    const requestSudoku = (level) => {
        dispatch({
            type: REQUEST_SUDOKU,
            payload: level
        })
        setTimeout(() => {
            buildSudoku(level) 
        }, 1000);
        
    }
    const buildSudoku = (level) => {
        let sudoku = sudokuBuilder(level);
        dispatch({
            type: CREATE_SUDOKU,
            payload: sudoku
        })
        localStorage.setItem('sudoku', JSON.stringify(sudoku))

        sudokuLogger(sudoku)
    }
    const updateSudoku = (updateObject) => {
        let sudoku = state.sudoku
        sudoku.countPlus()
        sudoku.cleanChecks()
        sudoku.countEmptyBoxes()
        localStorage.setItem('sudoku', JSON.stringify(sudoku))
        sudokuLogger(sudoku)
        dispatch({
            type: UPDATE_SUDOKU,
            payload: {sudoku, lastMove: lastMoveChecker()}
        })
        
    }
    const updateSudokuNotes = (updateObject) => {
        let sudoku = state.sudoku
        //sudoku.setNotes(updateObject)
        localStorage.setItem('sudoku', JSON.stringify(sudoku))
        dispatch({
            type: UPDATE_SUDOKU,
            payload: {sudoku, lastMove: lastMoveChecker()}
        })
    }
    const sudokuBackOrForward = (moveTo) => {
        let sudoku = sudokuSetter(state.currentMove, moveTo, state.sudoku.uuid);
        if (sudoku) {
            localStorage.setItem('sudoku', JSON.stringify(sudoku))
            dispatch({
                type: SET_SUDOKU,
                payload: sudoku
            }) 
        }
    }
    const toggleNoteMode = () => {
        dispatch({
            type: NOTE_MODE,
            payload: (state.noteMode ? false : true)
        })
    }
    const checkSudoku = () => {
        let validateResult = sudokuValidator(state.sudoku)
        
        dispatch({
            type: SET_SUDOKU,
            payload: validateResult
        }) 
    }
    const resetSudoku = () => {
        localStorage.removeItem('sudoku')
        dispatch({
            type: RESET_SUDOKU,
            payload: new Sudoku()
        })
    }
    return (
        <SudokuContext.Provider
        value={{
           buildSudoku,
           updateSudoku,
           updateSudokuNotes,
           sudokuBackOrForward,
           toggleNoteMode,
           checkSudoku,
           requestSudoku,
           resetSudoku,
           sudoku: state.sudoku,
           currentMove: state.currentMove,
           lastMove: state.lastMove,
           noteMode: state.noteMode,
           request: state.request,
           emptyOnes: state.emptyOnes,
           isValid: state.isValid
        }}
        >
           {props.children}
        </SudokuContext.Provider>
    )
}

export default SudokuState
