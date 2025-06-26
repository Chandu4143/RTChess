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
        effect: (targetPiece) => {
            // TODO: This will require a UI update to show the mission profile
            console.log(targetPiece.missionProfile);
        }
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
            // TODO: This will require a UI update to show the notification
            console.log('Ghost signal sent!');
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