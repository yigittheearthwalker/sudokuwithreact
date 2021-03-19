import React, { useContext, useState, useEffect, Fragment } from 'react'
import SudokuContext from '../../context/sudoku/sudokuContext'

const SudokuTable = () => {
    const sudokuContext = useContext(SudokuContext)
    const {sudoku, updateSudoku, updateSudokuNotes, noteMode} = sudokuContext

    const [tableState, setTableState] = useState({
        numbers: sudoku.getSudoku()
    })
    useEffect(() => {
        setTableState({...tableState, numbers: sudoku.getSudoku()})
    }, [sudoku])

    const {numbers} = tableState
    const onChange = (e, i, j) => {
        let reg = new RegExp('^[1-9]$');
        let val = e.target.value
        if (((val.match(reg) && numbers[i][j].userInput.length < 1) || val === '') && !noteMode) {
            numbers[i][j].userInput = val === '' ? '' : parseInt(val);
            numbers[i][j].notes = [];
            setTableState({...tableState, numbers: numbers})
            let updateObject = {
                x: i,
                y: j,
                val
            }
            
            updateSudoku(updateObject); 
        }else if(((val.match(reg) && numbers[i][j].userInput.length < 1)) && noteMode){
            if (!numbers[i][j].notes.includes(parseInt(val))) {
                numbers[i][j].notes.push(parseInt(val))
                setTableState({...tableState, numbers: numbers})
                let updateObject = {
                    x: i,
                    y: j,
                    notes: numbers[i][j].notes
                }
                updateSudokuNotes(updateObject)
            }else{
                const index = numbers[i][j].notes.indexOf(parseInt(val));
                console.log(index);
                numbers[i][j].notes.splice(index, 1)
                setTableState({...tableState, numbers: numbers})
                let updateObject = {
                    x: i,
                    y: j,
                    notes: numbers[i][j].notes
                }
                updateSudokuNotes(updateObject)
            }
        }

    }
    return (
        <div className="sudoku-panel__sub sudoku-table-container">
            <table className="sudoku-table" cellSpacing="0" cellPadding="0">
                <tbody>
                    {
                        numbers.map((row, i) => {
                        return (
                            <tr key={i}>
                            {row.map((box, j) => {
                                return (
                                    <td className={i%3 == 2 ? 'check'+box.markIncorrect + ' third-row' + ' ' + box.appear : 'check'+box.markIncorrect + ' ' + box.appear} key={j}>
                                        {box.appear ? box.value : (
                                            <Fragment>
                                            <input className={"sudoku-table__input check"} type="text" 
                                                   name={box.id} value={box.userInput}
                                                   onChange={(e) => onChange(e, i, j)}/>
                                                    {box.notes.map((note, k) => {
                                                     return <span key={k} className={"note note"+note}>{note}</span>
                                                    })}
                                                   
                                            </Fragment>
                                            )}
                                        </td>
                                )
                            })}
                            </tr>
                        
                        )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default SudokuTable
