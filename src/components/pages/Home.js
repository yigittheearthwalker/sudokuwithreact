import React, {Fragment, useContext, useState, useEffect} from 'react'
import SudokuContext from '../../context/sudoku/sudokuContext'
import { REQUEST_SUDOKU } from '../../context/types'
import SudokuPanel from '../layout/SudokuPanel'

const Home = () => {
    const sudokuContext = useContext(SudokuContext)

    const [difficulty, setDifficulty] = useState({
        level: 'easy'
    })
    const {level} = difficulty

    const {sudoku, request, progress, requestSudoku} = sudokuContext

    const onChange = (e) => {
        setDifficulty({...difficulty, level: e.target.value})
    }

    const onClick = () => {
        requestSudoku(level)
    }

    return (
        <section className="home-section">
            <div className="home-title">
                <h1 className="home-title__main">SuDoKu</h1>
            </div>
            {
                request ? (
                    <div className="sudoku-progress-container">
                        <div className="sudoku-progress-bar">                            
                            <p>Preparing your Sudoku</p>
                            {level === 'hard' && <p>Please wait for the hard one...</p>}
                            
                        </div>
                    </div>
                ) : (
                    sudoku.getSudoku().length == 0 ? (
            
                        <Fragment>
                            <div className="difficulty-container">
                                <div className="difficulty-selection">
                                    <p>Difficulty:</p>
                                    <select value={level} onChange={(e) => onChange(e)}>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="play-button-container">
                                <button className="btn btn-green btn-play" type="button" onClick={onClick}>Play</button>
                            </div>
                        </Fragment>
                    
                    ) : (<SudokuPanel />)
                )
            }
            
            
        </section>
    )
}

export default Home
