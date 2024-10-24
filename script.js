/*<--------------------------- variable -------------> */
const squares = document.querySelectorAll(".sq");
const fox = document.querySelector(".fox");
const alien = document.querySelector(".alien");
const displayTurn = document.querySelector(".display-turn");
let currentPlayer = "fox";
let occupiedSquares = []; // Array to keep track of occupied squares

/*<---------------- add event listeners ------------------->*/

fox.addEventListener("dragstart", dragStart);
alien.addEventListener("dragstart", dragStart);

squares.forEach((square) => {
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", drop);
});

const winningCombinations = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.className);
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add("hover");
}

function drop(event) {
  event.preventDefault();
  const draggedElementClass = event.dataTransfer.getData("text/plain");
  const square = event.target;

  if (!square.classList.contains("occupied")) {
    square.classList.add("occupied"); // Mark square as occupied
    square.innerHTML = draggedElementClass === "fox" ? "🦊" : "👽"; // Set content based on the dragged element
    square.style.fontSize = "30px"; // Ensure the size stays consistent

    // Store the occupied square index
    occupiedSquares.push(Array.from(squares).indexOf(square));

    // Check for a winner
    if (checkWinner(draggedElementClass)) {
      displayTurn.innerText = `${draggedElementClass === "fox" ? "Fox" : "Alien"} wins! 🎉`;
      disableBoard(); // Disable further moves
      return; // Stop further processing
    }

    // Check for a draw
    if (occupiedSquares.length === 9) {
      displayTurn.innerText = "It's a draw! 🤝";
      return; // Stop further processing
    }

    // Update turn display
    displayTurn.innerText = `It's ${currentPlayer === "fox" ? "alien" : "fox"}'s turn`; // Update turn display

    // Change current player
    currentPlayer = currentPlayer === "fox" ? "alien" : "fox";
  }
  event.target.classList.remove("hover");
}

function checkWinner(draggedElementClass) {
  const currentClass = draggedElementClass; // "fox" or "alien"
  const playerClass = currentClass === "fox" ? "🦊" : "👽"; // Representing with emojis
  
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return squares[index].innerHTML === playerClass;
    });
  });
}

function disableBoard() {
  squares.forEach(square => {
    square.removeEventListener("dragover", dragOver);
    square.removeEventListener("drop", drop);
  });
}
