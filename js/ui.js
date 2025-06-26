document.getElementById('forward-scouts').addEventListener('click', () => {
    CARD_DEFINITIONS.forward_scouts.effect();
});

document.getElementById('set-order').addEventListener('click', () => {
    if (selectedPiece) {
        let king = boardState.find(p => p.type === 'King' && p.owner === selectedPiece.owner);
        let distance = dist(selectedPiece.position.x, selectedPiece.position.y, king.position.x, king.position.y);

        let newMissionProfile = {
            pace: document.getElementById('pace').value,
            roe: document.getElementById('roe').value
        };

        if (distance <= 2) { // Command Aura
            selectedPiece.missionProfile = newMissionProfile;
        } else {
            let messenger = new Messenger(king.position, selectedPiece.id, newMissionProfile);
            activeMessengers.push(messenger);
        }
    }
});