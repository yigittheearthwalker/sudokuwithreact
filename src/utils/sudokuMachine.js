import Sudoku from './Sudoku'
const emptyRow = [0,0,0,0,0,0,0,0,0]
const sudokuBuilder = (playLevel) => {
    let level = (playLevel === 'hard' ? 24 : (playLevel === 'medium' ? 26 : 29))
    let sudoku = new Sudoku();
    let sudokuCounter = 0
    let emptyCounter = 81
    let resultSetNumberstoShow
    let backupNumbers
    let backupShownNumbers

    do {
        let rawNumbers = initializeRawSudoku()
    loop1:for (let i = 0; i < 9 ;) {
        let rawRow = []
        loop2:for (let j = 0; j < 9; j++) {
            let randomDigit = Math.floor(Math.random() * 9) + 1
            let counter = 0
            while (isRowContains(rawRow, randomDigit) || isColumnContains(rawNumbers, j, randomDigit)
                || isBoxContains(rawNumbers, i, j, randomDigit)) {
                randomDigit = Math.floor(Math.random() * 9) + 1
                if (counter++ == 20) {
                    rowCleaner(rawNumbers, i)
                    i = (i - (i % 3)) - 1;
                    break loop2
                }
            }
            rawRow.splice(j, 1, randomDigit)
        }
        if (rawRow.length == 9) {
            rawNumbers.splice(i, 1, rawRow)
        }
         i++
     }
      resultSetNumberstoShow = setNumbersToShow(JSON.parse(JSON.stringify(rawNumbers)), level)
        if (resultSetNumberstoShow[0] < emptyCounter) {
            emptyCounter = resultSetNumberstoShow[0]
            backupNumbers = JSON.parse(JSON.stringify(resultSetNumberstoShow[2]))
            backupShownNumbers = JSON.parse(JSON.stringify(resultSetNumberstoShow[1]))
            print2(backupShownNumbers)
            console.log(emptyCounter);
            sudokuCounter = 0
        }
        sudokuCounter++
        console.log(sudokuCounter);
        if (sudokuCounter == 50) {
            level = level + 1
            sudokuCounter = 0
        }
     } while (resultSetNumberstoShow[0] > 0);
        print2(backupShownNumbers)
        print2(backupNumbers)
        console.log("empty counter " + emptyCounter);
        let numbers = finalizeSudoku(JSON.parse(JSON.stringify(backupNumbers)), JSON.parse(JSON.stringify(backupShownNumbers)))
        sudoku.setSudoku(numbers)
        sudoku.countEmptyBoxes()

        return sudoku
     
}
const initializeRawSudoku = () => {
    let numbers = [];
    for (let i = 0; i < 9; i++) {
        numbers.push(JSON.parse(JSON.stringify(emptyRow)))
    }
    return numbers
}
const isRowContains = (row, randomDigit) => {
    let contains = false
        for (let i = 0; i < row.length; i++) {
                if (row[i] == randomDigit) {contains = true}
        }
    return contains
}
const isColumnContains = (numbers, y, randomDigit) => {
    let contains = false
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i][y] == randomDigit) {contains = true} 
    }
return contains
}
const isBoxContains = (numbers, x, y, randomDigit) => {
    let contains = false
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (numbers[(x - (x % 3)) + i][(y - (y % 3)) + j] == randomDigit) {contains = true;} 
        }
    }
    return contains
}
const rowCleaner = (numbers, index) => {
    for (let i = 0; i < (index % 3) + 1; i++) {
        numbers.splice((index - (index % 3)) + i, 1, JSON.parse(JSON.stringify(emptyRow)))
    }
}
const setNumbersToShow = (numbers, level) => {
    let numbersToShow = randomizeNumbersToShow(level)
    let shownNumbers = decorateBoardWithNumbersToShow(JSON.parse(JSON.stringify(numbers)), numbersToShow)
    let numbersToSolve = JSON.parse(JSON.stringify(shownNumbers))
    let backupMostFitNumbers = null
    let backupEmptyCounter = 81
    let backupShownNumbers = null
    let solvableCounter = 0
    let hasPossibility = false
    let resultSolvable    
    

        do {
            do {
                hasPossibility = findPossibilities(numbersToSolve)
            } while (hasPossibility);
            resultSolvable = solvableSudoku(numbersToSolve)
            solvableCounter++
            if (resultSolvable[0] > 0) {
                if (resultSolvable[0] < backupEmptyCounter) {
                    backupEmptyCounter = resultSolvable[0]
                    backupMostFitNumbers = JSON.parse(JSON.stringify(numbersToSolve))
                    backupShownNumbers = JSON.parse(JSON.stringify(shownNumbers))
                }
                numbersToShow = swapRandomizedNumbers(numbersToShow, resultSolvable[1])
                //numbersToShow = randomizeNumbersToShow(level)
                shownNumbers = decorateBoardWithNumbersToShow(JSON.parse(JSON.stringify(numbers)), numbersToShow)
                numbersToSolve = JSON.parse(JSON.stringify(shownNumbers))
            }else if(resultSolvable[0] == 0){
                backupEmptyCounter = resultSolvable[0]
                backupMostFitNumbers = JSON.parse(JSON.stringify(numbersToSolve))
                backupShownNumbers = JSON.parse(JSON.stringify(shownNumbers))
            }
            
        } while (resultSolvable[0] > 0 && solvableCounter < 300);
    return [backupEmptyCounter, backupShownNumbers, numbers ]
}
const randomizeNumbersToShow = (level) => {    
    let numbersToShow = []
        while (numbersToShow.length < level) {
            let randomNumber = Math.floor(Math.random() * 81)
            if (!numbersToShow.includes(randomNumber)) {
                numbersToShow.push(randomNumber)
            }
        }
    return numbersToShow
}

const decorateBoardWithNumbersToShow = (rawNumbers, numbersToShow) => {
    let numbers = initializeRawSudoku()
    for (let i = 0; i < numbersToShow.length; i++) {
        numbers[Math.floor(numbersToShow[i] / 9)][numbersToShow[i] % 9] = rawNumbers[Math.floor(numbersToShow[i] / 9)][numbersToShow[i] % 9]
    }
    return numbers
}
const swapRandomizedNumbers = (numbersToShow, emptyIndexes) => {
    let newNumbersToShow = JSON.parse(JSON.stringify(numbersToShow))
    let randomPick = Math.floor(Math.random() * emptyIndexes.length)
    newNumbersToShow.splice((Math.floor(Math.random() * numbersToShow.length)), 1 , emptyIndexes[randomPick])
    return newNumbersToShow
}
const solvableSudoku = (numbersToSolve) => {
    let emptyCounter = 0
    let emptyIndexes = []
    for (let i = 0; i < numbersToSolve.length; i++) {
        for (let j = 0; j < numbersToSolve[i].length; j++) {
            if (typeof numbersToSolve[i][j] === 'string') {
                emptyCounter++
                emptyIndexes.push((i * 9) + j)
            }
            
        }
        
    }
    return [emptyCounter, emptyIndexes]
}
const findPossibilities = (numbers) => {
    let hasPossibility = false
    let hasAdvancedPossibility = false
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            if (numbers[i][j] != 0 && typeof numbers[i][j] !== 'string') {
                continue
            }else{
                let possibility = '';
                let possibilityCounter = 0
                for (let x = 1; x < 10; x++) {
                    if(!isRowContains(numbers[i], x) && !isColumnContains(numbers, j, x) && !isBoxContains(numbers, i, j, x)){
                        possibility += x.toString()
                        possibilityCounter++
                    }
                }
                if (possibilityCounter == 1) {
                    numbers[i][j] = parseInt(possibility)
                    hasPossibility = true
                }else{
                    numbers[i][j] = possibility
                }
            }
            
        }
        
    }
   
    let filterCounter = 0
     do {
         filterCounter++
     } while (filterPossibilities(numbers));
     let advanceCounter = 0
     do {
         advanceCounter++
     } while (findAdvancedPossibilities(numbers));

     filterCounter > 1 || advanceCounter > 1 ? hasPossibility = true : filterCounter = 0

    return hasPossibility
}
const filterPossibilities = (numbers) => {
    let hasFilteredPossibilities = false
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            if (typeof numbers[i][j] === 'string') {
                for (let x = 0; x < numbers[i][j].length; x++) {
                    let charOfPossibility = parseInt(numbers[i][j].charAt(x));
                    let rowPosCounter = isRowPossibility(numbers[i], charOfPossibility)
                    let colPosCounter = isColumnPossibility(numbers, j, charOfPossibility);
                    let boxPosCounter = isBoxPossiblity(numbers, i, j, charOfPossibility)
                    if (rowPosCounter == 1 || colPosCounter == 1 || boxPosCounter == 1) {
                        numbers[i][j] = charOfPossibility
                        hasFilteredPossibilities = true
                    }

                
                }
            }
            
        }
        
    }
    return hasFilteredPossibilities
}
const isRowPossibility = (row, charToCheck) => {
    let rowPosCounter = 0
    for (let y = 0; y < row.length; y++) {
        if (typeof row[y] !== 'string') {
            continue
        }else{
            for (let k = 0; k < row[y].length; k++) {
                let check = parseInt(row[y].charAt(k))
                if (check == charToCheck && !isRowContains(row[y], charToCheck)) {
                    rowPosCounter++
                }
            }
        }
        
    }

return rowPosCounter
}
const isColumnPossibility = (numbers, y, charToCheck) => {
    let colPosCounter = false
    for (let i = 0; i < numbers.length; i++) {
        if (typeof numbers[i][y] !== 'string') {
            continue
        }else{
            for (let k = 0; k < numbers[i][y].length; k++) {
                let check = parseInt(numbers[i][y].charAt(k))
                if (check == charToCheck && !isColumnContains(numbers, y, charToCheck)) {
                    colPosCounter++
                }
            }
        }
       
    }
return colPosCounter
}
const isBoxPossiblity = (numbers, x, y, charToCheck) => {
    let boxPosCounter = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (typeof numbers[(x - (x % 3)) + i][(y - (y % 3)) + j] !== 'string') {
                continue
            }else{
               for (let k = 0; k < numbers[(x - (x % 3)) + i][(y - (y % 3)) + j].length; k++) {
                let check = parseInt(numbers[(x - (x % 3)) + i][(y - (y % 3)) + j].charAt(k))
                if (check == charToCheck && !isBoxContains(numbers, x, y, charToCheck)) {
                    boxPosCounter++
                }
               } 
            }
            
        }
    }
    return boxPosCounter
}
const findAdvancedPossibilities = (numbers) => {
    let hasAdvancedPossibility = false
    if (checkIdenticalTwins(numbers)) {
        hasAdvancedPossibility = true
    }
    return hasAdvancedPossibility
}
//Possibility Methods
const checkIdenticalTwins = (numbers) => {
    let hasIdenticalPossibility = false

    let boxes = [[], [], [], [], [], [], [], [], []]
    let rows =  [[], [], [], [], [], [], [], [], []]
    let columns = [[], [], [], [], [], [], [], [], []]
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            if (numbers[i][j] != 0 && typeof numbers[i][j] !== 'string') {
                continue
            }else{
                if (numbers[i][j].length == 2) {
                    boxes[(Math.floor(i / 3) * 3) + (Math.floor(j / 3))].push(numbers[i][j])
                    rows[i].push(numbers[i][j])
                    columns[j].push(numbers[i][j])
                }
                
            }
            
        }
  
    }
    for (let x = 0; x < 9; x++) {
        if (boxes[x].length > 1) {
            let skipper = []
            for (let y = 0; y < boxes[x].length; y++) {
                if ((boxes[x].filter(possibility => possibility == boxes[x][y])).length == 2 && !skipper.includes(boxes[x][y])) {
                    skipper.push(boxes[x][y])
                    for (let z = 0; z < 9; z++) {
                        let numberIndexToCheck = ((Math.floor(x / 3) * 27) + (x % 3) * 3) + (z % 3) + ((Math.floor(z / 3)) * 9)
                        if (boxes[x][y] !== numbers[Math.floor(numberIndexToCheck / 9)][numberIndexToCheck % 9] 
                                && typeof numbers[Math.floor(numberIndexToCheck / 9)][numberIndexToCheck % 9] === 'string') {
                            let possibilityString = numbers[Math.floor(numberIndexToCheck / 9)][numberIndexToCheck % 9]
                            let newPossibilityString = ''
                            for (let a = 0; a < possibilityString.length; a++) {
                                if (possibilityString.charAt(a) !== boxes[x][y].charAt(0) && possibilityString.charAt(a) !== boxes[x][y].charAt(1)) {
                                    newPossibilityString += possibilityString.charAt(a)
                                } 
                            }
                            if (newPossibilityString.length == 1) {
                                numbers[Math.floor(numberIndexToCheck / 9)][numberIndexToCheck % 9] = parseInt(newPossibilityString)
                                hasIdenticalPossibility = true
                            }else{
                                numbers[Math.floor(numberIndexToCheck / 9)][numberIndexToCheck % 9] = newPossibilityString
                            }
                    
                        }
                        
                    }

                }
                
            }
           
        }
        if(rows[x].length > 1){
            let skipper = []
            for (let y = 0; y < rows[x].length; y++) {
                if ((rows[x].filter(possibility => possibility == rows[x][y])).length == 2 && !skipper.includes(rows[x][y])) {
                    skipper.push(rows[x][y])
                    for (let z = 0; z < 9; z++) {
                        if (rows[x][y] !== numbers[x][z] && typeof numbers[x][z] === 'string') {
                            let possibilityString = numbers[x][z]
                            let newPossibilityString = ''
                            for (let a = 0; a < possibilityString.length; a++) {
                                if (possibilityString.charAt(a) !== rows[x][y].charAt(0) && possibilityString.charAt(a) !== rows[x][y].charAt(1)) {
                                    newPossibilityString += possibilityString.charAt(a)
                                } 
                            }
                            if (newPossibilityString.length == 1) {
                                numbers[x][z] = parseInt(newPossibilityString)
                                hasIdenticalPossibility = true
                            }else{
                                numbers[x][z] = newPossibilityString
                            }
                            
                          
                        }
                        
                    }
                }
            }

        }
        if(columns[x].length > 1){
            let skipper = []
            for (let y = 0; y < columns[x].length; y++) {
                if ((columns[x].filter(possibility => possibility == columns[x][y])).length == 2 && !skipper.includes(columns[x][y])) {
                    skipper.push(columns[x][y])
                    for (let z = 0; z < 9; z++) {
                        if (columns[x][y] !== numbers[z][x] && typeof numbers[z][x] === 'string') {
                            let possibilityString = numbers[z][x]
                            let newPossibilityString = ''
                            for (let a = 0; a < possibilityString.length; a++) {
                                if (possibilityString.charAt(a) !== columns[x][y].charAt(0) && possibilityString.charAt(a) !== columns[x][y].charAt(1)) {
                                    newPossibilityString += possibilityString.charAt(a)
                                } 
                            }
                            if (newPossibilityString.length == 1) {
                                hasIdenticalPossibility = true
                                numbers[z][x] = parseInt(newPossibilityString)
                            }else{
                                numbers[z][x] = newPossibilityString
                            }
                            
                        }
                        
                    }
                }
            }


        }
        
    }


    return hasIdenticalPossibility
}



const sudokuValidator = (sudoku) => {
    let numbers = sudoku.getSudoku()
    numbers = validateRows(numbers);
    numbers = validateColumns(numbers)
    numbers = validateBoxes(numbers)
    sudoku.setSudoku(numbers)
    console.log(sudoku);
    return sudoku
}
const validateRows = (numbers) => {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            numbers[i][j].markIncorrect = numbers[i].some((number, x) => number.userInput == numbers[i][j].userInput && x != j && number.userInput !== '')
        }
    }
    return numbers
}
const validateColumns = (numbers) => {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            for (let x = 0; x < 9; x++) {
                if(numbers[i][j].userInput == numbers[x][j].userInput && i != x && numbers[i][j].userInput != ''){
                    numbers[i][j].markIncorrect = true;
                }
            }
        }
    }
    return numbers
}
const validateBoxes = (numbers) => {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    if (numbers[(i - (i % 3)) + x][(j - (j % 3)) + y].userInput == numbers[i][j].userInput && i != ((i - (i % 3)) + x) && j != ((j - (j % 3)) + y) && numbers[i][j].userInput != '') {
                        numbers[i][j].markIncorrect = true;
                    } 
                }
            }
        }
    }
    return numbers
}

const finalizeSudoku = (numbers, shownNumbers) => {
    let finalNumbers = []
    for (let i = 0; i < shownNumbers.length; i++) {
        let row = []
        for (let j = 0; j < shownNumbers[i].length; j++) {
            let number
            if (shownNumbers[i][j] != 0) {
                 number = {
                    id: j + (i * 9) + 1,
                    value: shownNumbers[i][j],
                    appear: true,
                    userInput: shownNumbers[i][j],
                    notes: [],
                    markIncorrect: false
                                }
            } else {
                number = {
                    id: j + (i * 9) + 1,
                    value: numbers[i][j],
                    appear: false,
                    userInput: '',
                    notes: [],
                    markIncorrect: false
                                }
            }
            row.push(number)
        }
        finalNumbers.push(row)
    }
    return finalNumbers
}

const print = (sudoku) => {
    for (let i = 0; i < sudoku.length; i++) {
        let line = ''
        for (let j = 0; j < sudoku[i].length; j++) {
            line += sudoku[i][j].value + ', '
        }
        console.log(line + "\n--------------------------");   
    }
}
const print2 = (numbers) => {
    
    for (let i = 0; i < numbers.length; i++) {
        let line = ''
        for (let j = 0; j < numbers[i].length; j++) {
            let box = ''
            if (typeof numbers[i][j] === 'string' || numbers[i][j] instanceof String){
                for (let x = 0; x < 9; x++) {
                   box += numbers[i][j].charAt(x) ? numbers[i][j].charAt(x) : "."
                }
                line += j % 3 == 2 ? box + '||': box + "|"
            }else if(numbers[i][j] == 0){
                box += "   ...   "
                line += j % 3 == 2 ? box + '||': box + "|"
            }else{
                box += "    " + numbers[i][j] + "    "
                line += j % 3 == 2 ? box + '||': box + "|"
            }
            
        }
        console.log(line + "\n---------------------------------------------------------------------------------------------");   
        i % 3 == 2 && console.log("---------------------------------------------------------------------------------------------");
    }
}

export {sudokuBuilder, sudokuValidator}

