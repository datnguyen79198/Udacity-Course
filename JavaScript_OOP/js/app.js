// Enemies our player must avoid
function randomSpeed() {
    return Math.random() * 256 + 100;
};
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if (this.x > 5*101) {
      this.x = 0;
      this.speed = randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 202;
    this.y = 4*83 - 15;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

// don't need
Player.prototype.update = function () {
}

//Set the postion of player to initial location
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 4*83 - 15;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(dir) {
    if (dir === 'left') {
        this.x = Math.max(0, this.x - 101);
    }
    if (dir === 'right') {
        this.x = Math.min(4*101 , this.x + 101);
    }
    if (dir === 'up') {
        this.y = Math.max(83 - 15, this.y - 83);
    }
    if (dir === 'down'){
        this.y = Math.min(5*83 - 15, this.y + 83);
    }

}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies.push(new Enemy(- 101, 83 - 15, randomSpeed()));
allEnemies.push(new Enemy(- 101, 2 * 83 - 15, randomSpeed()));
allEnemies.push(new Enemy(- 101, 3 * 83 - 15, randomSpeed()));


var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
