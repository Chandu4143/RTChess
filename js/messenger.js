// ==================================================
// MESSENGER CLASS
// ==================================================

class Messenger {
    constructor(origin, targetPieceId, newMissionProfile) {
        this.origin = origin; // The position where the messenger was dispatched from
        this.targetPieceId = targetPieceId; // The ID of the piece the messenger is trying to reach
        this.newMissionProfile = newMissionProfile; // The new orders for the target piece
        this.etaTicks = 50; // The number of game ticks it will take for the messenger to reach its target
    }
}