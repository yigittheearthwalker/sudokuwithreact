 import Sudoku from './Sudoku'
 const sudokuLogger = (sudoku) => {
    let sudokuLog = JSON.parse(localStorage.getItem(sudoku.uuid))
    if (!sudokuLog) {
        sudokuLog = [sudoku]
    }else{
        sudokuLog.splice(sudoku.moveNumber, (sudokuLog.length - (sudoku.moveNumber)), sudoku)
    }
    localStorage.setItem(sudoku.uuid, JSON.stringify(sudokuLog))
}
const sudokuSetter = (currentMove, moveTo, uuid) => {
    let sudokuLog = JSON.parse(localStorage.getItem(uuid))
    if (!sudokuLog) {
        console.log("ERROR: No logs found for this sudoku");
        return false
    }else{
        if ((currentMove + moveTo) >= sudokuLog.length) {
            console.log("ERROR: You cannot go forward");
            return false
        }else if ((currentMove + moveTo) < 0){
            console.log("ERROR: You are at the initial move, cannot go backwards");
            return false
        }else{
            return new Sudoku(sudokuLog[currentMove + moveTo])
        }

    }
}
const lastMoveChecker = () => {
    let sudoku = JSON.parse(localStorage.getItem('sudoku'))
    if (sudoku) {
        let sudokuLog = JSON.parse(localStorage.getItem(sudoku.uuid))
        if (sudokuLog) {
            return sudokuLog.length -1
        }else{
            return 0
        }
    }else{
        return 0
    }
}
export {sudokuLogger, sudokuSetter, lastMoveChecker}