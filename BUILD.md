Project Blueprint: RTChess - The General's Gambit
1. Core Concept
RTChess is a real-time strategy game built on the foundation of classic chess. Players create a "Grand Plan" by assigning missions to each of their pieces. The battle then unfolds in real-time, with pieces moving and fighting autonomously based on their orders. Player interaction is indirect and strategic, focusing on moving their King (the HQ) to manage command lines, sending risky messengers with new orders, and playing powerful, single-use "Command Cards" to influence the battle.
2. Technical Stack
Language: JavaScript (ES6+)
Graphics & Interaction: HTML <canvas> managed by the p5.js library. (p5.js simplifies drawing, input handling, and the game loop, making it ideal for this project).
UI Elements: Standard HTML & CSS for menus, the "Grand Plan" interface, and the Command Card tray.
Target Platform: Web browser first, with potential for desktop packaging via Electron later.
3. Game Flow
Pre-Game (Deck Building): Players choose a small "hand" of Command Cards (e.g., 5 from a pool of 20) to bring into the match.
Phase 1: The Grand Plan (Setup): A turn-based, untimed phase. Each player sets an initial Mission Profile for all 16 of their pieces.
Phase 2: Execution (Real-Time): Both players hit "Execute." The game unpauses and runs in real-time based on a "Game Tick."
Phase 3: Command (Real-Time Interaction): During the execution phase, players can:
Move their King.
Send Messengers with new orders.
Play Command Cards.
End Game: The game ends when a King is captured (Checkmate) or a player resigns.
4. Core Mechanic Details
4.1. The Board and Pieces
Standard 8x8 grid.
Standard 16 pieces per side.
Movement rules are a guideline for piece capabilities, not a rigid turn-based system. A Knight is fundamentally more nimble than a Rook.
4.2. Piece Attributes & Mission Profile
Each piece is an object with the following properties:
Static Attributes:
id: e.g., 'white_pawn_e2'
owner: 'white' or 'black'
type: 'Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'
baseStrength: A numeric value (e.g., Queen: 9, Pawn: 1).
Dynamic Attributes:
position: {x, y} coordinates on the canvas.
morale: 0-100. Affects combat performance and risk of routing.
stamina: 0-100. Affects combat performance and movement speed. Decreases with action, regenerates slowly when idle.
status: 'idle', 'moving', 'in_combat', 'routed'.
Mission Profile (The Orders):
objective: { type: 'MOVE_TO', target: {x, y} } or { type: 'PATROL', waypoints: [...] } or { type: 'HOLD_POSITION' } or { type: 'SUPPORT', targetId: '...' }
pace: 'CAUTIOUS', 'STANDARD', 'FORCED_MARCH'
roe: 'ENGAGE_ON_SIGHT', 'HOLD_FIRE', 'OPPORTUNISTIC'
4.3. The King as HQ
Command Aura: A 2-square radius. Orders given to pieces inside this aura are instant and free.
Messenger Origin: All messengers are dispatched from the King's current position.
Line of Sight: The King provides a 3-square forward cone of vision into the Fog of War.
Movement: Moves like a normal King but can be done at any time during the real-time phase.
4.4. The Real-Time Game Tick
The game logic progresses in discrete steps called "ticks" (e.g., 4 ticks per second). In each tick, the game engine does the following in order:
Process Input: Check for player commands (move King, send messenger, play card).
Update Messengers: Move messengers, check for arrival or interception.
Update Movement: Calculate the next small step for every piece based on its Mission Profile and Pace.
Update Stamina/Morale: Decrease stamina for moving pieces, adjust morale based on nearby events.
Resolve Combat: Check for pieces on the same square. Initiate combat calculations.
Update Visibility (Fog of War): Determine which squares are visible to each player.
Render: Draw the board, visible pieces, effects, and UI to the screen.
4.5. Combat Resolution
When pieces A and B collide:
combatPowerA = A.baseStrength * (A.stamina / 100) * (A.morale / 100)
combatPowerB = B.baseStrength * (B.stamina / 100) * (B.morale / 100)
The ratio of power determines the outcome:
Annihilation (> 2:1 ratio): Loser is removed. Winner loses some stamina.
Rout (1.2:1 to 2:1 ratio): Loser is not removed but forced to retreat to a random adjacent square with status: 'routed' and shattered morale.
Draw (< 1.2:1 ratio): Both pieces are pushed back, lose stamina and morale.
4.6. The Messenger System
A messenger is an object with origin, targetPieceId, newMissionProfile, and etaTicks.
etaTicks is calculated based on distance from King to target piece.
For each tick the messenger travels, it checks for interception. Interception Chance: 10% for every square its path crosses that is within an enemy's line of sight.
4.7. Command Card System
Cards are single-use abilities.
Intel: Forward Scouts (reveals map for 5s), Clairvoyance (reveals the mission profile of one enemy piece).
Morale: Rallying Cry (boosts morale in an area), Fear (debuffs enemy morale in an area).
Logistics: Supply Lines (fully restore one piece's stamina), Forced March (as defined by user).
Deception: Ghost Signal (create a fake "messenger lost" notification for your opponent), Decoy (create a temporary, fake piece token on the board).
5. Development Roadmap: A Prompt-Driven Guide
Instructions: Tackle one milestone at a time. For each step, formulate a prompt for your AI assistant based on the details in this document. Test the generated code before moving on.
Milestone 1: The Static Board
Prompt 1.1: "Using p5.js, write the setup() and draw() functions to create an 800x800 canvas and draw an 8x8 checkerboard pattern."
Prompt 1.2: "Create a JavaScript class named Piece. It should have a constructor that accepts id, owner, type, and startPos. It should also have a draw() method that draws a simple circle at its position. Use different colors for 'white' and 'black' owners."
Prompt 1.3: "In the main script, create an array called boardState. Populate it with 32 Piece objects for a standard chess setup."
Prompt 1.4: "In the main draw() loop, iterate through the boardState array and call the draw() method for each piece."
Milestone 2: Basic Real-Time Movement
Prompt 2.1: "Modify the Piece class to include targetPos and speed attributes. Create an update() method. Inside update(), if the piece is not at its targetPos, calculate the vector towards the target and move the piece's position a small amount along that vector, scaled by speed."
Prompt 2.2: "In the main draw() loop, call piece.update() for every piece in the boardState."
Prompt 2.3: "Implement a mousePressed() function in p5.js. When the user clicks on the canvas, set the targetPos of the first piece in the boardState array to the mouse coordinates."
Milestone 3: The Grand Plan & UI
Prompt 3.1: "Using HTML and CSS, create a form next to the canvas with an H3 title 'Mission Profile', a dropdown for 'Pace' (Cautious, Standard, Forced March), a dropdown for 'ROE' (Engage on Sight, etc.), and a button 'Set Order'."
Prompt 3.2: "Write JS code so that when a piece is clicked on the canvas, it is stored in a selectedPiece variable, and its current Mission Profile values populate the form."
Prompt 3.3: "When the 'Set Order' button is clicked, update the missionProfile object of the selectedPiece with the values from the form."
Prompt 3.4: "Create a 'START BATTLE' button. When clicked, it should set a global gameStarted flag to true. The piece update() methods should only run if this flag is true."
Milestone 4: Combat, Stats & Fog of War
Prompt 4.1: "Add baseStrength, morale, and stamina attributes to the Piece class, with default values."
Prompt 4.2: "Write a function resolveCombat(pieceA, pieceB) that implements the combat logic described in section 4.5 of the project blueprint. It should return the loser or null for a draw."
Prompt 4.3: "In the game loop, write a collision check that iterates through all pairs of opposing pieces and if their distance is less than the size of a piece, call resolveCombat and remove the loser from the boardState array."
Prompt 4.4: "Implement Fog of War. In the main draw() loop, first cover the entire board with a semi-transparent black rectangle. Then, iterate through the player's pieces and draw clear circles around them to represent their line of sight."
Milestone 5: King, Messengers, and Cards
(These are advanced and should be tackled last, once the core game loop is solid.)
Prompt 5.1: "Implement the King's Command Aura. When giving a piece an order, check its distance to the King. If it's within the aura, apply the order instantly. If not, proceed to the messenger logic."
Prompt 5.2: "Create a Messenger class as described in section 4.6. When an order is given to a piece outside the Command Aura, create a new Messenger instance and add it to an active messengers array."
Prompt 5.3: "In the game loop, update all active messengers. Check for arrival or interception. Display a visual indicator for the messenger on the board."
Prompt 5.4: "Create a basic UI for Command Cards. Implement the 'Forward Scouts' card: when clicked, it temporarily disables the Fog of War overlay for 5 seconds."
Milestone 6: Advanced Piece AI and Mission Logic
Goal: Move beyond simple A-to-B movement and make the pieces behave intelligently according to their orders.
Prompt 6.1: "Refine the piece.update() method. Add a switch statement based on this.missionProfile.objective.type.
If 'MOVE_TO', it should behave as it does now.
If 'HOLD_POSITION', it should not move. Add a passive stamina/morale regeneration bonus.
If 'PATROL', it should move towards the current waypoint in its waypoints array. Once it reaches a waypoint, it should target the next one in the sequence, looping back to the start when finished."
Prompt 6.2: "Implement the Rules of Engagement (ROE) logic. Within the piece.update() method, before moving, the piece needs to scan for enemies. Write a helper function findNearbyEnemies(piece, range) that returns an array of enemy pieces within a given range.
If ROE is 'ENGAGE_ON_SIGHT', and enemies are found, the piece should override its current objective and set its targetPos to the closest enemy's position.
If ROE is 'HOLD_FIRE', it should ignore enemies unless it is directly attacked (i.e., its own health/morale decreases).
If ROE is 'OPPORTUNISTIC', it should only engage if its own combatPower (calculated on the fly) is significantly higher (e.g., 1.5x) than the nearest enemy's."
Prompt 6.3: "Implement the SUPPORT objective. A piece with this mission should try to stay within a certain distance of its targetId piece. It should adjust its targetPos to be near, but not on top of, its supported ally. If its ally enters combat, the supporting piece should move to engage the same enemy."
Milestone 7: Implementing the Full Command Card System
Goal: Build a robust system for defining and using Command Cards.
Prompt 7.1: "Create a separate JavaScript file, cards.js. In this file, define a master object called CARD_DEFINITIONS. Each key should be a card ID (e.g., 'forward_scouts'), and the value should be an object containing its name, description, targetType ('global', 'piece', 'area'), and an effect function."
Prompt 7.2: "The effect function for each card should accept arguments based on its targetType. For example, effect(targetPiece) or effect(targetPosition). For 'forward_scouts', the effect function would set a global fogDisabledUntil timestamp."
Prompt 7.3: "In the main script, create a Player class that holds the player's cardHand (an array of card IDs). At the start of the game, populate this hand. Using HTML and CSS, render the player's hand as clickable buttons in a div at the bottom of the screen."
Prompt 7.4: "Write the logic for using a card. When a card button is clicked:
Set a global selectedCard variable.
Change the mouse cursor to indicate targeting mode.
When the player clicks on the board, check if the target is valid for the targetType of the selected card.
If valid, call the card's effect function from CARD_DEFINITIONS, passing in the target.
Remove the card from the player's hand and disable its button."
Milestone 8: Game State Management and UI Polish
Goal: Add menus, win/loss conditions, and make the game feel complete.
Prompt 8.1: "Create a global gameState object to manage different screens of the application (e.g., 'MAIN_MENU', 'PLANNING_PHASE', 'BATTLE', 'GAME_OVER'). The main draw() loop should have a switch statement based on this gameState to decide which screen to render."
Prompt 8.2: "Design a simple Main Menu screen using HTML elements overlaid on the canvas. It should have a 'Start New Game' button that sets the gameState to 'PLANNING_PHASE'."
Prompt 8.3: "In the game loop, constantly check for win conditions.
If the white King is removed from the boardState, set gameState to 'GAME_OVER' with a winner of 'black'.
If the black King is removed, set the winner to 'white'.
Create a Game Over screen that displays the winner and a 'Play Again' button."
Prompt 8.4: "Add visual feedback. When a messenger is dispatched, draw a faint line from the King to the target. When combat occurs, create a small, temporary 'explosion' or 'clash' animation at the location. When a piece is routed, make it flash red for a few seconds."
Prompt 8.5: "Add sound. Create a SoundManager object to load and play sounds. Add sounds for piece movement, combat impacts, messenger interception, and card activations. Use free sound assets from sites like freesound.org."
6. Code Structure and Best Practices
To keep your project manageable, especially when using an AI, enforce a clean file structure.
Generated code
/RTChess/
|-- index.html              # The main HTML file
|-- style.css               # All CSS styles
|
|-- /js/
|   |-- main.js             # Main game logic, setup(), draw(), game state management
|   |-- piece.js            # The Piece class definition
|   |-- board.js            # Functions for drawing the board and handling grid logic
|   |-- ui.js               # Code for managing HTML forms, buttons, and UI interaction
|   |-- messenger.js        # The Messenger class definition
|   |-- cards.js            # The CARD_DEFINITIONS object and card logic
|
|-- /assets/
|   |-- /sounds/
|   |   |-- combat.wav
|   |   |-- messenger_lost.wav
|   |
|   |-- /images/
|   |   |-- (optional piece sprites if not drawing them)