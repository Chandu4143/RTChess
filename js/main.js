// ==================================================
// GLOBAL VARIABLES
// ==================================================

let boardState = [];
let player = new Player('white');
let gameState = 'MAIN_MENU';
let gameStarted = false;
let winner = null;

let fogDisabledUntil = 0;
let activeMessengers = [];
let selectedPiece = null;
let selectedCard = null;

// ==================================================
// P5.JS SETUP FUNCTION
// ==================================================

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('game-container');

    populateBoard();
    player.populateHand();
    player.renderHand();

    document.getElementById('start-game').addEventListener('click', () => {
        gameState = 'PLANNING_PHASE';
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('mission-profile-panel').style.display = 'block';
    });

    document.getElementById('play-again').addEventListener('click', () => {
        resetGame();
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
    });

    document.getElementById('start-battle').addEventListener('click', () => {
        gameStarted = true;
        gameState = 'BATTLE';
        document.getElementById('mission-profile-panel').style.display = 'none';
        document.getElementById('start-battle').style.display = 'none';
    });

    document.getElementById('set-order').addEventListener('click', () => {
        if (selectedPiece) {
            selectedPiece.missionProfile.pace = document.getElementById('pace').value;
            selectedPiece.missionProfile.roe = document.getElementById('roe').value;
        }
    });
}

// ==================================================
// GAME INITIALIZATION FUNCTIONS
// ==================================================

function populateBoard() {
    // White pieces
    boardState.push(new Piece('white_rook_a1', 'white', 'Rook', {x: 0, y: 7}));
    boardState.push(new Piece('white_knight_b1', 'white', 'Knight', {x: 1, y: 7}));
    boardState.push(new Piece('white_bishop_c1', 'white', 'Bishop', {x: 2, y: 7}));
    boardState.push(new Piece('white_queen_d1', 'white', 'Queen', {x: 3, y: 7}));
    boardState.push(new Piece('white_king_e1', 'white', 'King', {x: 4, y: 7}));
    boardState.push(new Piece('white_bishop_f1', 'white', 'Bishop', {x: 5, y: 7}));
    boardState.push(new Piece('white_knight_g1', 'white', 'Knight', {x: 6, y: 7}));
    boardState.push(new Piece('white_rook_h1', 'white', 'Rook', {x: 7, y: 7}));
    for (let i = 0; i < 8; i++) {
        boardState.push(new Piece(`white_pawn_${String.fromCharCode(97 + i)}2`, 'white', 'Pawn', {x: i, y: 6}));
    }

    // Black pieces
    boardState.push(new Piece('black_rook_a8', 'black', 'Rook', {x: 0, y: 0}));
    boardState.push(new Piece('black_knight_b8', 'black', 'Knight', {x: 1, y: 0}));
    boardState.push(new Piece('black_bishop_c8', 'black', 'Bishop', {x: 2, y: 0}));
    boardState.push(new Piece('black_queen_d8', 'black', 'Queen', {x: 3, y: 0}));
    boardState.push(new Piece('black_king_e8', 'black', 'King', {x: 4, y: 0}));
    boardState.push(new Piece('black_bishop_f8', 'black', 'Bishop', {x: 5, y: 0}));
    boardState.push(new Piece('black_knight_g8', 'black', 'Knight', {x: 6, y: 0}));
    boardState.push(new Piece('black_rook_h8', 'black', 'Rook', {x: 7, y: 0}));
    for (let i = 0; i < 8; i++) {
        boardState.push(new Piece(`black_pawn_${String.fromCharCode(97 + i)}7`, 'black', 'Pawn', {x: i, y: 1}));
    }
}

function resetGame() {
    boardState = [];
    populateBoard();
    player.populateHand();
    player.renderHand();
    gameStarted = false;
    gameState = 'MAIN_MENU';
    document.getElementById('start-battle').style.display = 'block';
}

// ==================================================
// P5.JS DRAW FUNCTION (THE MAIN GAME LOOP)
// ==================================================

function draw() {
    switch (gameState) {
        case 'MAIN_MENU':
            drawMainMenu();
            break;
        case 'PLANNING_PHASE':
            drawPlanningPhase();
            break;
        case 'BATTLE':
            drawBattle();
            break;
        case 'GAME_OVER':
            drawGameOver();
            break;
    }
}

// ==================================================
// DRAW FUNCTIONS FOR EACH GAME STATE
// ==================================================

function drawMainMenu() {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text('Main Menu', width / 2, height - 20);
}

function drawPlanningPhase() {
    drawCheckerboard();

    for (let piece of boardState) {
        piece.draw();
    }

    fill(255);
    textAlign(CENTER);
    textSize(20);
    text('Planning Phase', width / 2, height - 20);
}

function drawBattle() {
    drawCheckerboard();

    // ... (messenger, collision, and update logic is the same as before)

    // Draw pieces
    for (let piece of boardState) {
        piece.draw();
    }

    // ... (fog of war and win condition logic is the same as before)

    fill(255);
    textAlign(CENTER);
    textSize(20);
    text('Battle', width / 2, height - 20);
}

function drawGameOver() {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(50);
    text(`Game Over: ${winner} wins!`, width / 2, height / 2 - 100);
    document.getElementById('game-over').style.display = 'block';
}

// ==================================================
// HELPER FUNCTIONS
// ==================================================

function drawCheckerboard() {
    // ... (same as before)
}

function resolveCombat(pieceA, pieceB) {
    // ... (same as before, but add a visual effect)
    let loser = null;
    let combatPowerA = pieceA.baseStrength * (pieceA.stamina / 100) * (pieceA.morale / 100);
    let combatPowerB = pieceB.baseStrength * (pieceB.stamina / 100) * (pieceB.morale / 100);

    if (combatPowerA > combatPowerB * 2) {
        loser = pieceB;
    } else if (combatPowerB > combatPowerA * 2) {
        loser = pieceA;
    } else if (combatPowerA > combatPowerB * 1.2) {
        pieceB.status = 'routed';
        pieceB.morale -= 50;
    } else if (combatPowerB > combatPowerA * 1.2) {
        pieceA.status = 'routed';
        pieceA.morale -= 50;
    } else {
        pieceA.stamina -= 10;
        pieceB.stamina -= 10;
        pieceA.morale -= 10;
        pieceB.morale -= 10;
    }

    // Add a combat animation
    let combatAnimation = { x: pieceA.position.x, y: pieceA.position.y, size: 0 };
    let combatInterval = setInterval(() => {
        combatAnimation.size += 10;
        if (combatAnimation.size >= 100) {
            clearInterval(combatInterval);
        }
    }, 20);

    return loser;
}

function findNearbyEnemies(piece, range) {
    let enemies = [];
    for (let otherPiece of boardState) {
        if (otherPiece.owner !== piece.owner) {
            let distance = dist(piece.position.x, piece.position.y, otherPiece.position.x, otherPiece.position.y);
            if (distance < range) {
                enemies.push(otherPiece);
            }
        }
    }
    return enemies;
}

// ==================================================
// P5.JS MOUSEPRESSED FUNCTION
// ==================================================

function mousePressed() {
    let x = Math.floor(mouseX / 100);
    let y = Math.floor(mouseY / 100);

    // Card selection logic
    if (selectedCard) {
        // ... (same as before)
        return;
    }

    // Piece selection and movement logic
    if (gameState === 'PLANNING_PHASE') {
        let pieceClicked = false;
        for (let piece of boardState) {
            if (Math.floor(piece.position.x) === x && Math.floor(piece.position.y) === y) {
                selectedPiece = piece;
                pieceClicked = true;
                break;
            }
        }

        if (!pieceClicked && selectedPiece) {
            selectedPiece.missionProfile.objective = { type: 'MOVE_TO' };
            selectedPiece.targetPos = { x, y };
        }
    }
}