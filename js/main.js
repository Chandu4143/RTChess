// ==================================================
// GLOBAL VARIABLES
// ==================================================

let boardState = [];
let player = null;
let aiPlayer = null;
let gameState = 'MAIN_MENU';
let gameStarted = false;
let winner = null;

let fogDisabledUntil = 0;
let activeMessengers = [];
let visualEffects = [];
let playerPlannedMoves = [];
let selectedPiece = null;
let selectedCard = null;

// ==================================================
// P5.JS SETUP FUNCTION
// ==================================================

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('game-container');

    // Initialize player and AI after classes are loaded
    player = new Player('white');
    aiPlayer = new AIPlayer('black');
    
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
        document.getElementById('start-battle').style.display = 'none';
        // Keep mission profile panel visible during battle for giving orders
    });

    document.getElementById('set-order').addEventListener('click', () => {
        if (selectedPiece) {
            // Get values from custom select components
            let paceSelect = document.getElementById('pace-select');
            let roeSelect = document.getElementById('roe-select');
            let selectedPaceOption = paceSelect.querySelector('.custom-option.selected');
            let selectedRoeOption = roeSelect.querySelector('.custom-option.selected');
            
            let newMissionProfile = {
                objective: selectedPiece.missionProfile.objective,
                pace: selectedPaceOption ? selectedPaceOption.dataset.value : 'STANDARD',
                roe: selectedRoeOption ? selectedRoeOption.dataset.value : 'ENGAGE_ON_SIGHT'
            };
            
            // Check if piece is within King's command aura during battle
            if (gameState === 'BATTLE') {
                let king = boardState.find(p => p.type === 'King' && p.owner === player.owner);
                if (king) {
                    let distance = dist(selectedPiece.position.x, selectedPiece.position.y, king.position.x, king.position.y);
                    if (distance <= 2) {
                        // Within command aura - instant order
                        selectedPiece.missionProfile = newMissionProfile;
                        updateOrderStatus('Orders delivered instantly!', 'success');
                    } else {
                        // Outside aura - send messenger
                        let messenger = new Messenger(king.position, selectedPiece.id, newMissionProfile);
                        activeMessengers.push(messenger);
                        updateOrderStatus('Messenger dispatched...', 'warning');
                        
                        // Add visual effect for the messenger
                        visualEffects.push({
                            type: 'MESSENGER_PATH',
                            from: { x: king.position.x, y: king.position.y },
                            to: { x: selectedPiece.position.x, y: selectedPiece.position.y },
                            duration: 120 // 2 seconds at 60 FPS
                        });
                    }
                }
            } else {
                // Planning phase - direct order
                selectedPiece.missionProfile.pace = newMissionProfile.pace;
                selectedPiece.missionProfile.roe = newMissionProfile.roe;
                updateOrderStatus('Orders set for battle!', 'success');
            }
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
    if (!player) {
        player = new Player('white');
    }
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
            aiPlayer.makeDecisions(boardState, gameState);
            break;
        case 'BATTLE':
            drawBattle();
            aiPlayer.makeDecisions(boardState, gameState);
            break;
        case 'GAME_OVER':
            drawGameOver();
            break;
    }
    
    // Update UI elements every frame
    updateGameStatus();
    updateSelectedPieceInfo();
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

    // Draw player's planned moves
    for (let move of playerPlannedMoves) {
        stroke(255, 255, 0);
        strokeWeight(2);
        line(
            move.from.x * 100 + 50,
            move.from.y * 100 + 50,
            move.to.x * 100 + 50,
            move.to.y * 100 + 50
        );
        noStroke();
    }

    // Draw visual effects
    for (let i = visualEffects.length - 1; i >= 0; i--) {
        let effect = visualEffects[i];
        effect.duration--;
        if (effect.duration <= 0) {
            visualEffects.splice(i, 1);
        } else {
            drawVisualEffect(effect);
        }
    }

    fill(255);
    textAlign(CENTER);
    textSize(20);
    text('Planning Phase', width / 2, height - 20);
}

function drawBattle() {
    drawCheckerboard();

    // Update messengers
    for (let i = activeMessengers.length - 1; i >= 0; i--) {
        let messenger = activeMessengers[i];
        messenger.etaTicks--;
        
        if (messenger.etaTicks <= 0) {
            // Messenger arrived - update target piece
            let targetPiece = boardState.find(p => p.id === messenger.targetPieceId);
            if (targetPiece) {
                targetPiece.missionProfile = messenger.newMissionProfile;
            }
            activeMessengers.splice(i, 1);
        } else {
            // Check for interception (10% chance per tick if in enemy line of sight)
            let intercepted = false;
            for (let piece of boardState) {
                if (piece.owner !== player.owner) {
                    let distance = dist(messenger.origin.x, messenger.origin.y, piece.position.x, piece.position.y);
                    if (distance < 3 && Math.random() < 0.1) {
                        intercepted = true;
                        break;
                    }
                }
            }
            if (intercepted) {
                activeMessengers.splice(i, 1);
            }
        }
    }

    // Update all pieces if game has started
    if (gameStarted) {
        for (let piece of boardState) {
            piece.update();
        }
    }

    // Check for collisions and resolve combat
    for (let i = 0; i < boardState.length; i++) {
        for (let j = i + 1; j < boardState.length; j++) {
            let pieceA = boardState[i];
            let pieceB = boardState[j];
            
            if (pieceA.owner !== pieceB.owner) {
                let distance = dist(pieceA.position.x, pieceA.position.y, pieceB.position.x, pieceB.position.y);
                if (distance < 0.5) { // Pieces are on the same square
                    let loser = resolveCombat(pieceA, pieceB);
                    if (loser) {
                        boardState = boardState.filter(p => p !== loser);
                    }
                }
            }
        }
    }

    // Draw fog of war
    drawFogOfWar();

    // Draw King's command aura
    let king = boardState.find(p => p.type === 'King' && p.owner === player.owner);
    if (king) {
        noFill();
        stroke(0, 255, 0, 100);
        strokeWeight(2);
        ellipse(king.position.x * 100 + 50, king.position.y * 100 + 50, 400, 400); // 2-square radius
        noStroke();
    }

    // Draw pieces
    for (let piece of boardState) {
        piece.draw();
    }

    // Draw active messengers
    for (let messenger of activeMessengers) {
        let targetPiece = boardState.find(p => p.id === messenger.targetPieceId);
        if (targetPiece) {
            // Pulsing effect for messenger line
            let pulse = sin(frameCount * 0.1) * 10;
            let alpha = map(pulse, -10, 10, 150, 255);
            stroke(255, 255, 0, alpha);
            strokeWeight(3);
            line(
                messenger.origin.x * 100 + 50,
                messenger.origin.y * 100 + 50,
                targetPiece.position.x * 100 + 50,
                targetPiece.position.y * 100 + 50
            );
            noStroke();
        }
    }

    // Check win conditions
    checkWinConditions();

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
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if ((x + y) % 2 === 0) {
                fill(240, 217, 181); // Light squares
            } else {
                fill(181, 136, 99); // Dark squares
            }
            rect(x * 100, y * 100, 100, 100);
        }
    }
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

function drawFogOfWar() {
    // Skip fog of war if disabled by Forward Scouts card
    if (Date.now() < fogDisabledUntil) {
        return;
    }

    // Cover entire board with semi-transparent black
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Clear areas around player's pieces (line of sight)
    for (let piece of boardState) {
        if (piece.owner === player.owner) {
            // Each piece has a 2-square vision radius
            let visionRadius = 2;
            
            // King has extended forward vision cone
            if (piece.type === 'King') {
                visionRadius = 3;
                // Draw forward cone (3 squares forward)
                fill(0, 0, 0, 0); // Transparent to clear fog
                noStroke();
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -3; dy <= 0; dy++) {
                        let visionX = piece.position.x + dx;
                        let visionY = piece.position.y + dy;
                        if (visionX >= 0 && visionX < 8 && visionY >= 0 && visionY < 8) {
                            rect(visionX * 100, visionY * 100, 100, 100);
                        }
                    }
                }
            }
            
            // Regular circular vision for all pieces
            fill(0, 0, 0, 0); // Transparent to clear fog
            noStroke();
            ellipse(piece.position.x * 100 + 50, piece.position.y * 100 + 50, 
                   visionRadius * 100 * 2, visionRadius * 100 * 2);
        }
    }
}

function checkWinConditions() {
    let whiteKing = boardState.find(p => p.type === 'King' && p.owner === 'white');
    let blackKing = boardState.find(p => p.type === 'King' && p.owner === 'black');
    
    if (!whiteKing) {
        winner = 'black';
        gameState = 'GAME_OVER';
        document.getElementById('winner-message').textContent = 'Black Wins!';
    } else if (!blackKing) {
        winner = 'white';
        gameState = 'GAME_OVER';
        document.getElementById('winner-message').textContent = 'White Wins!';
    }
}

function drawVisualEffect(effect) {
    if (effect.type === 'ORDER_LINE') {
        let alpha = map(effect.duration, 0, 60, 0, 255);
        stroke(255, 255, 0, alpha);
        strokeWeight(3);
        line(
            effect.from.x * 100 + 50,
            effect.from.y * 100 + 50,
            effect.to.x * 100 + 50,
            effect.to.y * 100 + 50
        );
        noStroke();
    } else if (effect.type === 'MESSENGER_PATH') {
        let alpha = map(effect.duration, 0, 120, 0, 255);
        stroke(0, 150, 255, alpha);
        strokeWeight(2);
        line(
            effect.from.x * 100 + 50,
            effect.from.y * 100 + 50,
            effect.to.x * 100 + 50,
            effect.to.y * 100 + 50
        );
        noStroke();
    }
}

// ==================================================
// P5.JS MOUSEPRESSED FUNCTION
// ==================================================

function mousePressed() {
    let x = Math.floor(mouseX / 100);
    let y = Math.floor(mouseY / 100);

    // Card selection logic
    if (selectedCard) {
        let card = CARD_DEFINITIONS[selectedCard];
        let validTarget = false;
        
        if (card.targetType === 'global') {
            // Global cards don't need a target
            card.effect();
            validTarget = true;
        } else if (card.targetType === 'area') {
            // Area cards target a position
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                card.effect({ x, y });
                validTarget = true;
            }
        } else if (card.targetType === 'piece') {
            // Piece cards target a specific piece
            let targetPiece = null;
            for (let piece of boardState) {
                if (Math.floor(piece.position.x) === x && Math.floor(piece.position.y) === y) {
                    targetPiece = piece;
                    break;
                }
            }
            if (targetPiece) {
                card.effect(targetPiece);
                validTarget = true;
            }
        }
        
        if (validTarget) {
            // Remove card from hand and reset selection
            player.cardHand = player.cardHand.filter(cardId => cardId !== selectedCard);
            player.renderHand();
            highlightSelectedCard(null);
            selectedCard = null;
            document.body.style.cursor = 'default';
        }
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
            
            // Add or update the planned move for the selected piece
            let existingMove = playerPlannedMoves.find(move => move.pieceId === selectedPiece.id);
            if (existingMove) {
                existingMove.to = { x, y };
            } else {
                playerPlannedMoves.push({
                    pieceId: selectedPiece.id,
                    from: { x: selectedPiece.position.x, y: selectedPiece.position.y },
                    to: { x, y }
                });
            }
        }
    }
    
    // Piece selection during battle
    if (gameState === 'BATTLE') {
        let pieceClicked = false;
        for (let piece of boardState) {
            if (Math.floor(piece.position.x) === x && Math.floor(piece.position.y) === y && piece.owner === player.owner) {
                selectedPiece = piece;
                pieceClicked = true;
                break;
            }
        }
        
        // King movement during battle (for Command Aura) - only if no piece was clicked
        if (!pieceClicked) {
            let king = boardState.find(p => p.type === 'King' && p.owner === player.owner);
            if (king && x >= 0 && x < 8 && y >= 0 && y < 8) {
                king.position = { x, y };
            }
        }
    }
}

// ==================================================
// UI UPDATE FUNCTIONS (NON-CORE)
// ==================================================

function updateSelectedPieceInfo() {
    const infoPanel = document.getElementById('selected-piece-info');
    const pieceType = document.getElementById('piece-type');
    const pieceMorale = document.getElementById('piece-morale');
    const pieceStamina = document.getElementById('piece-stamina');
    
    if (selectedPiece) {
        infoPanel.style.display = 'block';
        pieceType.textContent = selectedPiece.type;
        pieceMorale.textContent = `Morale: ${Math.round(selectedPiece.morale)}%`;
        pieceStamina.textContent = `Stamina: ${Math.round(selectedPiece.stamina)}%`;
        
        // Update custom select values to match selected piece
        updateCustomSelect('pace-select', selectedPiece.missionProfile.pace);
        updateCustomSelect('roe-select', selectedPiece.missionProfile.roe);
    } else {
        infoPanel.style.display = 'none';
    }
}

function updateCustomSelect(selectId, value) {
    const customSelect = document.getElementById(selectId);
    if (!customSelect) return;
    
    const options = customSelect.querySelectorAll('.custom-option');
    const trigger = customSelect.querySelector('.custom-select-trigger span');
    
    // Remove previous selection
    options.forEach(option => option.classList.remove('selected'));
    
    // Find and select the matching option
    const matchingOption = Array.from(options).find(option => option.dataset.value === value);
    if (matchingOption) {
        matchingOption.classList.add('selected');
        trigger.textContent = matchingOption.textContent;
    }
}

function updateOrderStatus(message, type) {
    const statusDiv = document.getElementById('order-status');
    statusDiv.textContent = message;
    statusDiv.className = `order-status ${type}`;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'order-status';
    }, 3000);
}

function updateGameStatus() {
    // Update game phase
    const phaseElement = document.getElementById('game-phase');
    if (phaseElement) {
        switch (gameState) {
            case 'MAIN_MENU':
                phaseElement.textContent = 'Main Menu';
                break;
            case 'PLANNING_PHASE':
                phaseElement.textContent = 'Planning Phase';
                break;
            case 'BATTLE':
                phaseElement.textContent = 'Battle in Progress';
                break;
            case 'GAME_OVER':
                phaseElement.textContent = 'Game Over';
                break;
        }
    }
    
    // Update messenger count
    const messengerElement = document.getElementById('messenger-count');
    if (messengerElement) {
        messengerElement.textContent = activeMessengers.length;
    }
    
    // Update piece count
    const pieceCountElement = document.getElementById('piece-count');
    if (pieceCountElement) {
        const whitePieces = boardState.filter(p => p.owner === 'white').length;
        const blackPieces = boardState.filter(p => p.owner === 'black').length;
        pieceCountElement.textContent = `White: ${whitePieces} | Black: ${blackPieces}`;
    }
}

function highlightSelectedCard(cardId) {
    // Remove previous highlights
    const cardButtons = document.querySelectorAll('#card-hand button');
    cardButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Highlight selected card
    if (cardId) {
        const selectedButton = Array.from(cardButtons).find(btn => 
            btn.textContent === CARD_DEFINITIONS[cardId].name
        );
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }
}
