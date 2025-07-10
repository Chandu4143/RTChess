# RTChess - The General's Gambit

RTChess is a real-time strategy game that blends classic chess mechanics with modern RTS elements. Players strategically issue orders to their pieces during a planning phase, then watch the battle unfold in real-time. Indirect command via a movable King (HQ), a messenger system for long-range orders, and impactful "Command Cards" add layers of strategic depth.

This project was built following the blueprint outlined in `BUILD.md` and its current implementation status can be found in `README_STATUS.md`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- A modern web browser that supports HTML5 and JavaScript (ES6+).
- No other specific installations are required as the game is client-side and uses a CDN for the p5.js library.

### Installing

1.  Clone or download the repository to your local machine.
2.  Navigate to the project directory.
3.  Open the `index.html` file in your web browser.

That's it! The game should load and be ready to play.

## How to Play

The game is fully playable and implements all core mechanics from the `BUILD.md` specification.

1.  **Open `index.html`** in a web browser.
2.  **Click "Start New Game"** from the main menu.
3.  **Planning Phase**:
    *   Click pieces to select them.
    *   Use the "Mission Control" panel (top-left) to set orders (Pace, Rules of Engagement).
    *   Click empty squares on the board to set movement targets for the selected piece.
    *   Utilize "Command Cards" (bottom-left) by clicking a card, then clicking its target on the board (if applicable).
    *   Click "START BATTLE" (top-left, below Mission Control) when your plan is set.
4.  **Battle Phase**:
    *   Pieces will move and engage in combat automatically based on their orders and the Rules of Engagement.
    *   You can issue new orders during the battle:
        *   Select one of your pieces.
        *   Modify its Pace or ROE in the Mission Control panel.
        *   Click "Issue Orders". If the piece is within the King's command aura (green circle), the order is instant. Otherwise, a messenger will be dispatched (visual line from King to piece).
    *   Move your King by clicking on him and then clicking a new square. This moves your command center and the origin point for messengers.
    *   Continue to use Command Cards as needed.
    *   The battle continues until one King is captured.

For more details on game mechanics, refer to `BUILD.md`.
For a list of currently implemented features, see `README_STATUS.md`.
For a demonstration of gameplay, see `GAMEPLAY_DEMO.md`.

## Running the tests

This project does not currently have an automated test suite. Manual testing can be performed by playing the game and verifying mechanics as described in `GAME_TEST_REPORT.md` and `BUILD.md`.

A `debug_test.html` and `test.html` exist in the repository, which might have been used for specific component testing during development.

## Built With

*   **p5.js** - JavaScript library for creative coding, used for graphics and game loop.
*   **HTML5** - For the structure of the game interface.
*   **CSS3** - For styling the game interface.
*   **JavaScript (ES6+)** - For all game logic.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to us. (Note: `CONTRIBUTING.md` does not currently exist in the repository).

## Versioning

No formal versioning system is currently in place.

## Authors

The `BUILD.md` document outlines a prompt-driven development process, suggesting an AI assistant was heavily involved in the code generation. The initial commit history might provide more specific authorship if available.

## License

This project does not currently have a `LICENSE.md` file.

## Acknowledgments

*   The structure and development roadmap were heavily based on the `BUILD.md` document.
*   Uses the p5.js library.
*   Inspiration from classic chess and real-time strategy games.
