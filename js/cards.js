// ==================================================
// CARD DEFINITIONS
// ==================================================

const CARD_DEFINITIONS = {
    'forward_scouts': {
        name: 'Forward Scouts',
        description: 'Reveals the entire map for 5 seconds.',
        targetType: 'global',
        effect: () => {
            fogDisabledUntil = Date.now() + 5000;
        }
    },
    'clairvoyance': {
        name: 'Clairvoyance',
        description: 'Reveals the mission profile of one enemy piece.',
        targetType: 'piece',
        effect: (targetPiece) => {            const readoutPanel = document.getElementById('clairvoyance-readout');            const readoutText = document.getElementById('clairvoyance-text');            readoutText.textContent = `OBJECTIVE: ${targetPiece.missionProfile.objective.type}\n PACE: ${targetPiece.missionProfile.pace}\n ROE: ${targetPiece.missionProfile.roe}`;            readoutPanel.style.display = 'block';            setTimeout(() => {                readoutPanel.style.display = 'none';            }, 5000);        }
    },
    'rallying_cry': {
        name: 'Rallying Cry',
        description: 'Boosts morale in an area.',
        targetType: 'area',
        effect: (targetPosition) => {
            for (let piece of boardState) {
                if (piece.owner === 'white') {
                    let distance = dist(targetPosition.x, targetPosition.y, piece.position.x, piece.position.y);
                    if (distance < 3) {
                        piece.morale = Math.min(100, piece.morale + 30);
                    }
                }
            }
        }
    },
    'fear': {
        name: 'Fear',
        description: 'Debuffs enemy morale in an area.',
        targetType: 'area',
        effect: (targetPosition) => {
            for (let piece of boardState) {
                if (piece.owner === 'black') {
                    let distance = dist(targetPosition.x, targetPosition.y, piece.position.x, piece.position.y);
                    if (distance < 3) {
                        piece.morale = Math.max(0, piece.morale - 30);
                    }
                }
            }
        }
    },
    'supply_lines': {
        name: 'Supply Lines',
        description: 'Fully restore one piece\'s stamina.',
        targetType: 'piece',
        effect: (targetPiece) => {
            targetPiece.stamina = 100;
        }
    },
    'forced_march': {
        name: 'Forced March',
        description: 'Forces a piece to move faster for a short duration.',
        targetType: 'piece',
        effect: (targetPiece) => {
            targetPiece.speed *= 2;
            setTimeout(() => {
                targetPiece.speed /= 2;
            }, 10000);
        }
    },
    'ghost_signal': {
        name: 'Ghost Signal',
        description: 'Create a fake "messenger lost" notification for your opponent.',
        targetType: 'global',
        effect: () => {
            const notification = document.getElementById('ghost-signal-notification');
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 4000);
        }
    },
    'decoy': {
        name: 'Decoy',
        description: 'Create a temporary, fake piece token on the board.',
        targetType: 'area',
        effect: (targetPosition) => {
            let decoy = new Piece('decoy', 'white', 'Decoy', targetPosition);
            boardState.push(decoy);
            setTimeout(() => {
                boardState = boardState.filter(p => p.id !== 'decoy');
            }, 10000);
        }
    }
};

const AI_CARD_DEFINITIONS = {
    'sabotage': {
        name: 'Sabotage',
        description: 'Reduces a random enemy piece\'s stamina.',
        targetType: 'global',
        effect: () => {
            const playerPieces = boardState.filter(p => p.owner === 'white');
            if (playerPieces.length > 0) {
                const randomPiece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
                randomPiece.stamina = Math.max(0, randomPiece.stamina - 50);
            }
        }
    },
    'counter_intelligence': {
        name: 'Counter Intelligence',
        description: 'Temporarily disables the player\'s ability to see piece stats.',
        targetType: 'global',
        effect: () => {
            const infoPanel = document.getElementById('selected-piece-info');
            infoPanel.style.display = 'none';
            setTimeout(() => {
                infoPanel.style.display = 'block';
            }, 10000);
        }
    }
};