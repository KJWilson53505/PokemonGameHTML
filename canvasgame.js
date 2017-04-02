var canvas,
    ctx,
    width = 600,
    height = 600,
    enemyTotal = 5,
    // Where pokemon will be held - have to use different word since pokemon will be the array
    pokemon = [],
    // Movement on x axis
    enemyX = 50,
    // Movement on y axis
    enemyY = -45,
    // Width
    enemyW = 50,
    // Height
    enemyH = 40,
    speed = 2,
    enemy,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    trainer,
    trainerX = width / 2 - 25, trainerY = height - 75, trainerW = 50, trainerH = 60,
    // This will manage amount of beams allowed on the screen at once once I make that
    pokebeamTotal = 3,
    pokebeams = [],
    caught = 0,
    alive = true,
    lives = 3,
    grass,
    grassX = 0, grassY = 0, grassY2 = -600,
    pokeball,
    pokeballX = 0, pokeballY = 0, pokeballX2 = -600,
    gameStarted = false;

// This array holds all pokemon on screen - Learned push from http://www.w3schools.com/jsref/jsref_push.asp
for (var i = 0; i < enemyTotal; i++) {
    pokemon.push([enemyX, enemyY, enemyW, enemyH, speed]);
    enemyX += enemyW + 60;
}

var clearCanvas = function() {
    ctx.clearRect(0, 0, width, height);
};

// Cycles through the array and draws the updated enemy position
var drawPokemon = function() {
    for (var i = 0; i < pokemon.length; i++) {
        ctx.drawImage(enemy, pokemon[i][0], pokemon[i][1]);
    }
};

var drawTrainer = function() {
    if (rightKey) {
        trainerX += 5;
    }
    if (leftKey) {
        trainerX -= 5;
    }
    if (upKey) {
        trainerY -= 5;
    }
    if (downKey) {
        trainerY += 5;
    }
    if (trainerX <= 0) {
        trainerX = 0;
    }
    if (trainerX + trainerW >= width){
        trainerX = width - trainerW;
    }
    if (trainerY <= 0) {
        trainerY = 0;
    }
    if (trainerY + trainerH >= height) {
        trainerY = height - trainerH;
    }
    ctx.drawImage(trainer, trainerX, trainerY);
};

// This moves the pokemon to the top if they fall off screen
var movePokemon = function() {
    for (var i = 0; i < pokemon.length; i++) {
        if (pokemon[i][1] < height) {
            pokemon[i][1] += pokemon[i][4];
        } else if (pokemon[i][1] > height - 1) {
            pokemon[i][1] = -45;
        }
    }
};

// This is the shot - the pokebeam from the pokeball
var drawPokebeam = function() {
    if (pokebeams.length) {
        for (var i = 0; i < pokebeams.length; i++) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(pokebeams[i][0], pokebeams[i][1], pokebeams[i][2], pokebeams[i][3]);
        }
    }
};

var movePokebeam = function() {
    for (var i = 0; i < pokebeams.length; i++) {
        if (pokebeams[i][1] > -11) {
            pokebeams[i][1] -= 10;
        } else if (pokebeams[i][1] < -10) {
            pokebeams.splice(i, 1);
        }
    }
};

// Runs loops until any of the pokebeams have hit the pokemon
var hitTest = function() {
    var remove = false;
    for (var i = 0; i < pokebeams.length; i++) {
        for (var j = 0; j < pokemon.length; j++) {
            if (pokebeams[i][1] <= pokemon[j][1] + pokemon[j][3] && pokebeams[i][0] >=
                pokemon[j][0] && pokebeams[i][0] <= pokemon[j][0] + pokemon[j][2]) {
                remove = true;
                pokemon.splice(j, 1);
                caught += 1;
                speed += 0.2;
                pokemon.push([Math.random() * 500 + 50, -45, enemyW, enemyH, speed]);
            }
        }
        if (remove === true) {
            pokebeams.splice(i, 1);
            remove = false;
        }
    }
};

// Checks to see if the player's trainer collides with any of the pokemon
var trainerCollision = function() {
    var trainerXw = trainerX + trainerW,
        trainerYh = trainerY + trainerH;
    for (var i = 0; i < pokemon.length; i++) {
        if (trainerX > pokemon[i][0] && trainerX < pokemon[i][0] + enemyW &&
            trainerY > pokemon[i][1] && trainerY < pokemon[i][1] + enemyH) {
            checkLives();
        }
        if (trainerXw < pokemon[i][0] + enemyW && trainerXw > pokemon[i][0] &&
            trainerY > pokemon[i][1] && trainerY < pokemon[i][1] + enemyH) {
            checkLives();
        }
        if (trainerYh > pokemon[i][1] && trainerYh < pokemon[i][1] + enemyH &&
            trainerX > pokemon[i][0] && trainerX < pokemon[i][0] + enemyW) {
            checkLives();
        }
        if (trainerYh > pokemon[i][1] && trainerYh < pokemon[i][1] + enemyH &&
            trainerXw < pokemon[i][0] + enemyW && trainerXw > pokemon[i][0]) {
            checkLives();
        }
    }
};

// Runs the lives
var checkLives = function() {
    lives -= 1;
    if (lives > 0) {
        reset();
    } else if (lives === 0) {
        alive = false;
    }
};

var reset = function() {
    var enemyResetX = 50;
    trainerX = width / 2 - 25, trainerY = height - 75, trainerW = 50, trainerH = 60;
    for (var i = 0; i < pokemon.length; i++) {
        pokemon[i][0] = enemyResetX;
        pokemon[i][1] = -45;
        enemyResetX = enemyResetX + enemyW + 60;
    }
};

// Continue button resets the game after trainer gets hit three times
// Got continue button from w3school tutorials on buttons
var continueButton = function(e) {
    var cursorPos = getCursorPos(e);
    if (cursorPos.x > width / 2 - 53 && cursorPos.x < width / 2 + 47 &&
        cursorPos.y > height / 2 + 10 && cursorPos.y < height / 2 + 50) {
        alive = true;
        lives = 3;
        reset();
        canvas.removeEventListener('click', continueButton, false);

    }
};

// Holds the mouse position
var cursorPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

// Finds the mouse's position after the mouse is clicked
// Mostly copied/implemented from http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
var getCursorPos = function(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    var cursorPos = new cursorPosition(x, y);
    return cursorPos;
};

// Draws the text for the caught and lives on the
// Used https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
var caughtTotal = function() {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Caught: ', 480, 50);
    ctx.fillText(caught, 560, 50);
    ctx.fillText('Lives:', 480, 30);
    ctx.fillText(lives, 560, 30);
    if (!gameStarted) {
        ctx.fillStyle = '#000';
        ctx.fillRect(90, 200, 400, 300);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 50px Arial';
        ctx.fillText('Pokebeams!', width / 2 - 150, height / 2);
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
        ctx.fillText('Move with arrow keys to avoid enemies', width / 2 - 200, height / 2 + 60);
        ctx.fillText('from touching your pokeball', width / 2 - 150, height / 2 + 90);
        ctx.fillText('Use the spacebar to catch pokemon', width / 2 - 180, height / 2 + 120);
        ctx.fillText('This game get progressively harder!', width / 2 - 190, height / 2 + 150);
    }
    if (!alive) {
        ctx.fillText('Highscore: ' + caught, 245, height / 2 - 30);
        ctx.fillText('GAME OVER', 245, height / 2);
        ctx.fillRect(width / 2 - 145, height / 2 + 10, 320, 45);
        ctx.fillStyle = '#000';
        ctx.fillText('CLICK BUTTON TO START OVER', 160, height / 2.5 + 100);
        canvas.addEventListener('click', continueButton, false);
    }
};

// Draws and animates the background grass
var drawGrass = function() {
    ctx.drawImage(grass, grassX, grassY);
    ctx.drawImage(grass, grassX, grassY2);
    if (grassY > 600) {
        grassY = -599;
    }
    if (grassY2 > 600) {
        grassY2 = -599;
    }
    grassY += 1;
    grassY2 += 1;
};

var drawPokeball = function() {
    ctx.drawImage(pokeball, pokeballX, pokeballY);
    ctx.drawImage(pokeball, pokeballX2, pokeballY);
    if (pokeballX > 600) {
        pokeballX = -599;
    }
    if (pokeballX2 > 600) {
        pokeballX2 = -599;
    }
    pokeballX += 1;
    pokeballX2 += 1;
};

// Adds the event listeners for the arrow keys
var init = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // Pokemon
    pokeball = new Image();
    pokeball.src = 'ball.png';
    // Pikachu
    enemy = new Image();
    enemy.src = '025.png';
    // Ash Ketchum
    trainer = new Image();
    trainer.src = 'ash.gif';
    // Grass background
    grass = new Image();
    grass.src = 'Grass_Type.jpg';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    canvas.addEventListener('click', gameStart, false);
    gameLoop();
};

var gameStart = function() {
    gameStarted = true;
    canvas.removeEventListener('click', gameStart, false);
};

// The main function of the game, it calls all the other functions needed to make the game run
var gameLoop = function() {
    clearCanvas();
    drawPokeball();
    if (alive && gameStarted && lives > 0) {
        drawGrass();
        hitTest();
        trainerCollision();
        movePokebeam();
        movePokemon();
        drawPokemon();
        drawTrainer();
        drawPokebeam();
    }
    caughtTotal();
    setTimeout(gameLoop, 1000 / 30);
};

// Checks to see which key has been pressed and either to move the trainer or fire a pokebeam
// Learned key codes from https://css-tricks.com/snippets/javascript/javascript-keycodes/
var keyDown = function(e) {
    if (e.keyCode === 39) {
        rightKey = true;
    } else if (e.keyCode === 37) {
        leftKey = true;
    }
    if (e.keyCode === 38) {
        upKey = true;
    } else if (e.keyCode === 40) {
        downKey = true;
    }
    // Checks how many beams there are before letting the trainer catch
    if (e.keyCode === 32 && pokebeams.length <= pokebeamTotal) {
        pokebeams.push([trainerX + 25, trainerY - 20, 4, 20]);
    }
};

// Checks to see if a pressed key has been released and stops the trainers movement if it has
var keyUp = function(e) {
    if (e.keyCode === 39) {
        rightKey = false;
    } else if (e.keyCode === 37) {
        leftKey = false;
    }
    if (e.keyCode === 38) {
        upKey = false;
    } else if (e.keyCode === 40) {
        downKey = false;
    }
};

window.onload = init;
