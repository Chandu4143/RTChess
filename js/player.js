// ==================================================
// PLAYER CLASS
// ==================================================

class Player {
    constructor(owner) {
        this.owner = owner; // 'white' or 'black'
        this.cardHand = []; // An array of card IDs that the player can use
    }

    // Populates the player's hand with a starting set of cards
    populateHand() {
        this.cardHand.push('forward_scouts');
        this.cardHand.push('rallying_cry');
        this.cardHand.push('supply_lines');
    }

    // Renders the player's hand as clickable buttons in the #card-hand div
    renderHand() {
        let handContainer = document.getElementById('card-hand');
        handContainer.innerHTML = '';
        for (let cardId of this.cardHand) {
            let card = CARD_DEFINITIONS[cardId];
            let cardButton = document.createElement('button');
            cardButton.innerText = card.name;
            cardButton.addEventListener('click', () => {
                selectedCard = cardId;
                document.body.style.cursor = 'crosshair';
                highlightSelectedCard(cardId);
            });
            handContainer.appendChild(cardButton);
        }
    }
}