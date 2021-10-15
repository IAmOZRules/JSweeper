// Required DOM Elements
const grid = document.querySelector('.grid');
const flagsRemaining = document.querySelector('.flags-remaining');
const winOrLose = document.querySelector('.win-or-lose');

// Variables
let isGameOver = false;
let width = 10;
let bombAmount = 15;
let flags = 0;
let cells = [];

// Prevent context menu from showing up on left click on grid
grid.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Create the board grid for the 
function createBoard() {
    // Create array with bombs
    const bombs = Array(bombAmount).fill('bomb');

    // Create array with non-bomb elements
    const empties = Array(width * width - bombAmount).fill('valid');

    // Concatenate bomb and non-bomb arrays
    const game = empties.concat(bombs);

    // Shuffle game array to get randomized grid arrangement
    const shuffled = game.sort(() => 0.5 - Math.random());

    for (let i = 0; i < width * width; i++) {
        let cell = document.createElement('div');
        cell.setAttribute('id', i);
        cell.classList.add(shuffled[i]);
        grid.appendChild(cell);
        cells.push(cell);

        // Normal Click
        cell.addEventListener('click', (e) => {
            click(cell);
        });

        // Click to flag
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            addFlag(cell);
        });
    }

    // Adding numbers to each cell in the grid
    for (let i = 0; i < cells.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (cells[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('bomb')) { total++ }
            if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('bomb')) { total++ }
            if (i > 10 && cells[i - width].classList.contains('bomb')) { total++ }
            if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('bomb')) { total++ }
            if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('bomb')) { total++ }
            if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('bomb')) { total++ }
            if (i < 88 && cells[i + width].classList.contains('bomb')) { total++ }
            if (i < 89 && !isRightEdge && cells[i + 1 + width].classList.contains('bomb')) { total++ }
            cells[i].setAttribute('data', total);
        }
    }
}

// Add Flag Function
function addFlag(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('checked')) return;
    if (!cell.classList.contains('checked') && (flags < bombAmount)) {
        // Remove added flag
        if (cell.classList.contains('flagged')) {
            cell.classList.remove('flagged');
            cell.innerHTML = '';
            flags--;
        } else {
            // Add flag
            cell.classList.add('flagged');
            cell.innerHTML = '🚩';
            flags++;
        }
    }
    setFlagTextColor();
    checkIfWin();
}

// Sets remaining flags indicator color
function setFlagTextColor() {
    remainingFlags = bombAmount - flags;
    flagsRemaining.innerHTML = remainingFlags;
    if (remainingFlags == bombAmount) flagsRemaining.style.color = 'rgb(29, 212, 29)';
    if (remainingFlags < bombAmount / 2) flagsRemaining.style.color = 'orange';
    if (remainingFlags < bombAmount / 4) flagsRemaining.style.color = 'yellow';
    if (remainingFlags == 0) flagsRemaining.style.color = 'red';
}

// Takes care of click on cells
function click(cell) {
    let id = cell.id;
    if (isGameOver) return
    if (cell.classList.contains('checked') || cell.classList.contains('flagged')) return;

    // End game if bomb cell is clicked
    if (cell.classList.contains('bomb')) {
        cell.classList.add('bombed');
        winOrLose.innerHTML = 'You Lose! 😔😔';
        winOrLose.style.color = 'red';
        isGameOver = true;
        showBombs();
    } else {
        let total = cell.getAttribute('data');
        if (total != 0) {
            cell.classList.add('checked');
            cell.innerHTML = total;
            setCellColor(cell);
            return;
        }
        checkCells(id);
        cell.classList.add('checked');
    }
}

// Recursively search for cells with value if clicked on empty cell
function checkCells(id) {
    const isLeftEdge = (id % width === 0);
    const isRightEdge = (id % width === width - 1);

    setTimeout(() => {
        if (id > 0 && !isLeftEdge) {
            const newId = cells[parseInt(id) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id > 9 && !isRightEdge) {
            const newId = cells[parseInt(id) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id > 10) {
            const newId = cells[parseInt(id) - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id > 11 && !isLeftEdge) {
            const newId = cells[parseInt(id) - 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id < 98 && !isRightEdge) {
            const newId = cells[parseInt(id) + 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id < 90 && !isLeftEdge) {
            const newId = cells[parseInt(id) - 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id < 88) {
            const newId = cells[parseInt(id) + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if (id < 89 && !isRightEdge) {
            const newId = cells[parseInt(id) + 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 10);
}

// Sets cell number color 
function setCellColor(cell) {
    const total = cell.getAttribute('data');
    if (total == 1) cell.style.color = 'blue';
    else if (total == 2) cell.style.color = 'darkgreen';
    else if (total == 3) cell.style.color = 'red';
    else if (total == 4) cell.style.color = 'purple';
    else if (total == 5) cell.style.color = 'maroon';
    else if (total == 6) cell.style.color = 'turquoise';
    else if (total == 7) cell.style.color = 'black';
    else if (total == 8) cell.style.color = 'yellow';
}

// Shows the location of all bombs on the grid
function showBombs() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('bomb')) {
            cells[i].classList.add('bombed');
            cells[i].innerHTML = '💣';
        }
    }
}

// Check if the game is over and the player has won
function checkIfWin() {
    let matches = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('bomb') && cells[i].classList.contains('flagged')) {
            matches++;
        }
    }

    if (matches == bombAmount) {
        winOrLose.innerHTML = 'You Win! 🎊🎊';
        winOrLose.style.color = 'green';
        isGameOver = true;
    }
}

createBoard();