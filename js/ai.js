class AIPlayer {
    constructor(owner) {
        this.owner = owner;
        this.cardHand = ['sabotage', 'counter_intelligence'];
        this.planningDone = false;
        this.lastDecisionTime = 0;
        this.decisionCooldown = 2000; // AI makes a decision every 2 seconds
    }

    makeDecisions(boardState, gameState) {
        const now = millis();
        if (now - this.lastDecisionTime < this.decisionCooldown) {
            return; // Wait for cooldown
        }
        this.lastDecisionTime = now;

        if (gameState === 'PLANNING_PHASE' && !this.planningDone) {
            this.executePlanningPhase(boardState);
            this.planningDone = true;
        } else if (gameState === 'BATTLE') {
            this.executeBattlePhase(boardState);
        }
    }

    executePlanningPhase(boardState) {
        console.log('AI is planning...');
        const myPieces = boardState.filter(p => p.owner === this.owner);

        for (const piece of myPieces) {
            if (piece.type === 'Pawn') {
                // Advance pawns two squares
                piece.missionProfile.objective = { type: 'MOVE_TO' };
                piece.targetPos = { x: piece.position.x, y: piece.position.y + 2 };
            } else {
                // Other pieces hold their ground initially
                piece.missionProfile.objective = { type: 'HOLD_POSITION' };
            }
        }
    }

    executeBattlePhase(boardState) {
        console.log('AI is thinking...');
        const myPieces = boardState.filter(p => p.owner === this.owner && p.status !== 'routed');
        const enemyPieces = boardState.filter(p => p.owner !== this.owner);

        if (enemyPieces.length === 0) return; // No enemies left

        for (const piece of myPieces) {
            // Find the nearest enemy
            let nearestEnemy = null;
            let minDistance = Infinity;

            for (const enemy of enemyPieces) {
                const distance = dist(piece.position.x, piece.position.y, enemy.position.x, enemy.position.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestEnemy = enemy;
                }
            }

            if (nearestEnemy) {
                // Simple logic: attack the nearest enemy
                piece.missionProfile.objective = { type: 'MOVE_TO' };
                piece.targetPos = { x: nearestEnemy.position.x, y: nearestEnemy.position.y };
            }
        }

        // AI card usage logic
        if (this.cardHand.length > 0 && Math.random() < 0.1) { // 10% chance to use a card
            const cardId = this.cardHand.pop(); // Use a random card
            const card = AI_CARD_DEFINITIONS[cardId];
            card.effect();
            console.log(`AI used card: ${card.name}`);
        }
    }
}
