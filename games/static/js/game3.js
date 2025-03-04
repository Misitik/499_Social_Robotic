const puzzleContainer = document.getElementById("puzzle-container");
const rows = 4;
const cols = 4;
let puzzlePieces = [];
let emptySpot = { row: rows - 1, col: cols - 1 };  // Starting position of empty spot

image = document.getElementById('ship')

// Create the puzzle pieces
function createPuzzlePieces(image) {
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        const posX = col * 100;
        const posY = row * 100;
        piece.style.backgroundImage = image//`url(${imageSrc})`;
        piece.style.backgroundPosition = `-${posX}px -${posY}px`;
  
        if (row === rows - 1 && col === cols - 1) {
          piece.classList.add("empty");
        } else {
          piece.addEventListener("click", () => movePiece(row, col));
        }
  
        puzzleContainer.appendChild(piece);
        puzzlePieces.push({ row, col, element: piece });
      }
    }
  }
  
  // Move the clicked piece
  function movePiece(row, col) {
    const targetPiece = puzzlePieces.find(piece => piece.row === row && piece.col === col);
  
    if (isAdjacent(row, col, emptySpot.row, emptySpot.col)) {
      targetPiece.element.classList.add("empty");
      const emptyPiece = puzzlePieces.find(piece => piece.row === emptySpot.row && piece.col === emptySpot.col);
      emptyPiece.element.classList.remove("empty");
  
      emptySpot = { row, col };
      checkWin();
    }
  }
  
  // Check if two spots are adjacent
  function isAdjacent(row1, col1, row2, col2) {
    return (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
  }
  
  // Check if the puzzle is solved
  function checkWin() {
    const isSolved = puzzlePieces.every(piece => {
      const targetRow = Math.floor(piece.element.index / cols);
      const targetCol = piece.element.index % cols;
      return piece.row === targetRow && piece.col === targetCol;
    });
  
    if (isSolved) {
      alert("Congratulations! You solved the puzzle!");
    }
  }
  
  // Start the game
initializePuzzle();