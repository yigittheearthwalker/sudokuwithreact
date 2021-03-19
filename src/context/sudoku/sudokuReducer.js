import {
  REQUEST_SUDOKU,
  CREATE_SUDOKU,
  UPDATE_SUDOKU,
  SET_SUDOKU,
  NOTE_MODE,
  RESET_SUDOKU
  } from '../types'

  export default (state, action) => {
    switch (action.type){
        case REQUEST_SUDOKU:
          return {
            ...state,
            request: true,
            level: action.payload,
          }
        case CREATE_SUDOKU:
          return {
            ...state,
            sudoku: action.payload,
            currentMove: action.payload.moveNumber,
            emptyOnes: action.payload.emptyOnes,
            request: false
          }
        case UPDATE_SUDOKU:
          return {
            ...state,
            sudoku: action.payload.sudoku,
            currentMove: action.payload.sudoku.moveNumber,
            lastMove: action.payload.lastMove,
            emptyOnes: action.payload.sudoku.emptyOnes,
          }
        case SET_SUDOKU:
          return {
            ...state,
            sudoku: action.payload,
            currentMove: action.payload.moveNumber,
            emptyOnes: action.payload.emptyOnes
          }
        case NOTE_MODE:
          return {
            ...state,
            noteMode: action.payload
          }
        case RESET_SUDOKU:
          return{
            sudoku: action.payload,
            currentMove: 0,
            lastMove: 0,
            emptyOnes: 0,
            noteMode: false,
            request: false,
            progress: null,
            level: null
          }
        default:
          return state
    }
      
  }