class Piece {
    constructor(id, owner, type, startPos) {
        this.id = id;
        this.owner = owner;
        this.type = type;
        this.position = startPos;
        this.targetPos = startPos;
        this.speed = 0.05;
        this.missionProfile = {
            objective: { type: 'HOLD_POSITION' },
            pace: 'STANDARD',
            roe: 'ENGAGE_ON_SIGHT'
        };
        this.baseStrength = this.getBaseStrength(type);
        this.morale = 100;
        this.stamina = 100;
        this.status = 'idle';
    }

    getBaseStrength(type) {
        switch (type) {
            case 'Pawn': return 1;
            case 'Knight': return 3;
            case 'Bishop': return 3;
            case 'Rook': return 5;
            case 'Queen': return 9;
            case 'King': return 10;
            case 'Decoy': return 0;
            default: return 0;
        }
    }

    getUnicodeSymbol() {
        const symbols = {
            'white': {
                'Pawn': '♙',
                'Rook': '♖',
                'Knight': '♘',
                'Bishop': '♗',
                'Queen': '♕',
                'King': '♔',
                'Decoy': '⚑'
            },
            'black': {
                'Pawn': '♟',
                'Rook': '♜',
                'Knight': '♞',
                'Bishop': '♝',
                'Queen': '♛',
                'King': '♚'
            }
        };
        return symbols[this.owner][this.type];
    }

    update() {
        // ROE LOGIC
        let enemies = findNearbyEnemies(this, 3);
        if (enemies.length > 0) {
            switch (this.missionProfile.roe) {
                case 'ENGAGE_ON_SIGHT':
                    this.targetPos = enemies[0].position;
                    break;
                case 'OPPORTUNISTIC':
                    let myPower = this.baseStrength * (this.stamina / 100) * (this.morale / 100);
                    let enemyPower = enemies[0].baseStrength * (enemies[0].stamina / 100) * (enemies[0].morale / 100);
                    if (myPower > enemyPower * 1.5) {
                        this.targetPos = enemies[0].position;
                    }
                    break;
                case 'HOLD_FIRE':
                    break;
            }
        }

        // Mission objective logic
        switch (this.missionProfile.objective.type) {
            case 'MOVE_TO':
                let dx = this.targetPos.x - this.position.x;
                let dy = this.targetPos.y - this.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > this.speed) {
                    this.position.x += (dx / distance) * this.speed;
                    this.position.y += (dy / distance) * this.speed;
                } else {
                    this.missionProfile.objective.type = 'HOLD_POSITION';
                }
                break;
            case 'HOLD_POSITION':
                if (this.stamina < 100) {
                    this.stamina += 0.1;
                }
                if (this.morale < 100) {
                    this.morale += 0.1;
                }
                break;
            case 'PATROL':
                if (!this.missionProfile.objective.waypoints || this.missionProfile.objective.waypoints.length === 0) {
                    return;
                }
                let currentWaypoint = this.missionProfile.objective.waypoints[this.missionProfile.objective.currentWaypointIndex];
                let waypoint_dx = currentWaypoint.x - this.position.x;
                let waypoint_dy = currentWaypoint.y - this.position.y;
                let waypoint_distance = Math.sqrt(waypoint_dx * waypoint_dx + waypoint_dy * waypoint_dy);

                if (waypoint_distance < this.speed) {
                    this.missionProfile.objective.currentWaypointIndex = (this.missionProfile.objective.currentWaypointIndex + 1) % this.missionProfile.objective.waypoints.length;
                } else {
                    this.position.x += (waypoint_dx / waypoint_distance) * this.speed;
                    this.position.y += (waypoint_dy / waypoint_distance) * this.speed;
                }
                break;
            case 'SUPPORT':
                let ally = boardState.find(p => p.id === this.missionProfile.objective.targetId);
                if (ally) {
                    if (ally.status === 'in_combat') {
                        let enemies = findNearbyEnemies(ally, 3);
                        if (enemies.length > 0) {
                            this.targetPos = enemies[0].position;
                        }
                    } else {
                        let desiredPos = { x: ally.position.x + 1, y: ally.position.y };
                        let dx = desiredPos.x - this.position.x;
                        let dy = desiredPos.y - this.position.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > this.speed) {
                            this.position.x += (dx / distance) * this.speed;
                            this.position.y += (dy / distance) * this.speed;
                        }
                    }
                }
                break;
        }
    }

    draw() {
        let centerX = this.position.x * 100 + 50;
        let centerY = this.position.y * 100 + 50;
        
        // Draw health/status ring
        let healthColor = color(76, 175, 80); // Green for healthy
        if (this.morale < 50) healthColor = color(255, 193, 7); // Yellow for low morale
        if (this.morale < 25) healthColor = color(244, 67, 54); // Red for very low morale
        
        noFill();
        stroke(healthColor);
        strokeWeight(3);
        let healthAngle = map(this.morale, 0, 100, 0, TWO_PI);
        arc(centerX, centerY, 90, 90, -HALF_PI, -HALF_PI + healthAngle);
        
        // Draw stamina ring (inner)
        let staminaColor = color(74, 144, 226);
        stroke(staminaColor);
        strokeWeight(2);
        let staminaAngle = map(this.stamina, 0, 100, 0, TWO_PI);
        arc(centerX, centerY, 75, 75, -HALF_PI, -HALF_PI + staminaAngle);
        
        noStroke();
        
        // Draw the piece
        fill(this.owner === 'white' ? '#FFFFFF' : '#000000');
        textSize(64);
        textAlign(CENTER, CENTER);
        text(this.getUnicodeSymbol(), centerX, centerY);

        // Draw a highlight if the piece is selected
        if (selectedPiece === this) {
            noFill();
            let pulseAlpha = 150 + 105 * sin(millis() * 0.01);
            stroke(74, 144, 226, pulseAlpha);
            strokeWeight(4);
            ellipse(centerX, centerY, 95, 95);
            
            // Additional outer glow
            stroke(74, 144, 226, pulseAlpha * 0.3);
            strokeWeight(2);
            ellipse(centerX, centerY, 105, 105);
            
            strokeWeight(1);
            noStroke();
        }

        // Draw a line to the target position
        if (this.missionProfile.objective.type === 'MOVE_TO') {
            stroke(255, 0, 0);
            line(this.position.x * 100 + 50, this.position.y * 100 + 50, this.targetPos.x * 100 + 50, this.targetPos.y * 100 + 50);
            noStroke();
        }
    }
}