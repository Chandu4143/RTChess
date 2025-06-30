# How to Play RTChess: The General's Gambit

Welcome to RTChess! This isn't your typical turn-based chess game. It's a real-time strategy game that uses chess pieces, where battles unfold automatically based on the orders you issue.

## 1. The Objective

The goal is simple: **eliminate the enemy King.**

You win the game by finding and destroying the opponent's King piece. Likewise, if your opponent destroys your King, you lose.

## 2. Core Concepts

- **Real-Time Movement:** Pieces move simultaneously in real-time, not in turns.
- **Morale & Stamina:** Every piece has health.
    - **Morale (Outer Ring):** Represents a piece's will to fight. It drops in combat. If it gets too low, the piece becomes 'routed' and is less effective.
    - **Stamina (Inner Ring):** Decreases when pieces move or fight. Low stamina reduces combat effectiveness.
- **Command Aura:** Your King projects a green circle—this is the **Command Aura**. Any orders you give to your own units *inside* this circle are delivered instantly.
- **Messengers:** To give an order to a unit *outside* your King's Command Aura, a messenger must be dispatched from your King to the unit. This takes time, and the messenger can be intercepted by the enemy!
- **Fog of War:** You can only see the area of the board around your units. The rest of the map is hidden until you explore it.

## 3. The Two Game Phases

The game is split into two distinct phases.

### Phase 1: The Planning Phase

This is your setup phase. The battle has not yet begun.

1.  **Select Your Piece:** Click on one of your pieces. Its stats will appear in the "Mission Control" panel.
2.  **Give an Order:** With a piece selected, click on any square on the board. This sets a **MOVE_TO** objective for that piece. You will see a red line indicating its planned path.
3.  **Set Mission Parameters (Optional):** In the "Mission Control" panel, you can define:
    - **Movement Pace:** How fast the unit moves (e.g., 'Forced March' is fast but drains stamina).
    - **Rules of Engagement (ROE):** How the unit behaves automatically (e.g., 'Engage on Sight' means it will attack any enemy it sees).
4.  **Repeat for All Pieces:** Set up initial orders for all your units. A common strategy is to advance your Pawns to scout the area.
5.  **Start the Battle:** Once you are happy with your initial plan, click the **"START BATTLE"** button.

### Phase 2: The Battle Phase

Now the action begins!

1.  **Pieces Execute Orders:** All pieces on the board will begin moving and fighting in real-time based on the orders you gave them in the Planning Phase.
2.  **Give New Orders:** The battle is dynamic! You can select any of your units and give them new orders at any time.
    - **Inside the Aura:** If the unit is in your King's Command Aura, the new order is instant.
    - **Outside the Aura:** If the unit is outside the aura, a messenger will be sent, and the order will be delayed.
3.  **Move Your Command Center:** Your King doesn't move like a normal piece. During the Battle Phase, you can click anywhere on the board to instantly move your King (and your Command Aura) to that location. Use this to keep your key units in command.
4.  **Use Command Cards:** Click a card in the "Command Cards" panel, then click a target on the board to activate its special effect. These can turn the tide of battle!

## 4. Winning the Game

Keep an eye on the "Battle Status" panel to see how many pieces each side has left. Adapt your strategy, protect your King, and hunt down the enemy King to claim victory. Good luck, General!
