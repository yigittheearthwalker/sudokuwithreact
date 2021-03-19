import { v4 as uuidv4 } from 'uuid';
class Sudoku{
    constructor(sudokuData){
        if (sudokuData) {
            this.numbers = sudokuData.numbers 
            this.uuid = sudokuData.uuid
            this.moveNumber = sudokuData.moveNumber
            this.emptyOnes = sudokuData.emptyOnes
        } else {
            this.numbers = []
            this.uuid = uuidv4();
            this.moveNumber = 0
            this.emptyOnes = 81
        }
        
    }
    getSudoku(){
        return this.numbers
    }
    setSudoku(numbers){
        this.numbers = numbers
    }
    setNotes(updateObject){
        let {x, y, notes} = updateObject
        let newNumbers = this.numbers
        for (let i = 0; i < newNumbers; i++) {
            if (i == x) {
                for (let j = 0; j < newNumbers[i]; j++) {
                    if (j == y) {
                        newNumbers[i][j].notes = notes;
                    }
                    
                }
            }
            
        }
        this.numbers = newNumbers
    }
    countPlus(){
        this.moveNumber++
    }
    countEmptyBoxes(){
       
        let count = 0
        for (let i = 0; i < this.numbers.length; i++) {
            for (let j = 0; j < this.numbers[i].length; j++) {
                if (this.numbers[i][j].userInput === '') {
                    count++
                }
                
            }
            
        }
        this.emptyOnes = count
    }
    cleanChecks(){
        let newNumbers = this.numbers;
        for (let i = 0; i < newNumbers.length; i++) {
            for (let j = 0; j < newNumbers[i].length; j++) {
                newNumbers[i][j].markIncorrect = false  
            }
            
        }
        this.numbers = newNumbers
    }
}

export default Sudoku