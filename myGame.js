// creates background variable
var background = new Raster("images/background.png", [400, 300]);
background.position = view.center;

// creates rectangle behind timer and score
var rectangle = new Shape.Rectangle(new Point(0,0), new Size(200,80));
rectangle.fillColor = 'white';
rectangle.visible = false;

// creates player
var player = new Raster("images/player.png", [400,300]);
player.visible=false;
player.speed=5;

// creates the instructions
var instructions = new PointText(new Point(200,200));
instructions.fillColor = 'black';
instructions.fontSize = 24;
instructions.content = "Grab the yellow stars, avoid the red ones!";

// creates the start button
var start = new Raster("images/start.png", [400,300]);
start.visible = true;

// creates the timer
var timer= 1500;
var timerText = new PointText(new Point(10, 30));
timerText.visible = false;
timerText.fillColor = 'red';
timerText.fontSize = 24;
timerText.content = "Time Left: " + timer;

// creates the score keeper
var score = 0;
var scoreText = new PointText(new Point(10, 65));
scoreText.visible = false;
scoreText.fillColor = 'red';
scoreText.fontSize = 24;
scoreText.content = "Score: " + score;

// creates variables associated with stars
var stars = [];
var badstars = [];
var starsNumber = 14;
var position = 50;
var tempStar;

// creates end game text
var endGame1 = new PointText(new Point(100,100));
endGame1.visible = false;
endGame1.fillColor = 'red';
endGame1.fontSize = 100;
endGame1.content = "GAME OVER";

// creates more end game text
var endGame2 = new PointText(new Point(100,300));
endGame2.visible = false;
endGame2.fillColor = 'white';
endGame2.fontSize = 40;

// changes backgrounds for different states
background.onFrame = function(event){
    if(player.visible){
        var num = Math.random()*2+2;
        num = Math.floor(num);
        background.source="images/background"+num+".png";
    }
    else if(endGame1.visible){
        background.source="images/background4.png";
    }
    else {
        background.source="images/background.png";
    }
}

// movement controls for the player
player.onFrame = function(event){
    if(player.visible){
        player.bringToFront();
        if(Key.isDown('up')){
            player.source = "images/playerup.png";
            player.translate(0,-player.speed);
        }
        else if(Key.isDown('down')){
            player.source = "images/playerdown.png";
            player.translate(0,player.speed);
        }
        else if(Key.isDown('left')){
            player.source = "images/playerleft.png";
            player.translate(-player.speed,0);
        }
        else if(Key.isDown('right')){
            player.source = "images/playerright.png";
            player.translate(player.speed,0);
        }
        else {
            player.source = "images/player.png";  
        }
    }
}

function onKeyUp(event) {
    if(event.key == 'space' && player.visible) {
        var x = 0;
        var y = player.position.y;
        var jump = setInterval(function() {
            console.log(player.position.y);
            x++;
            player.position.y = (0.1 * x * x) - (7 * x) + y;
            if(x >= 70) {
                clearInterval(jump);
            }
        }, 20);
    }
    
}

// constructs each good star
function Star(positioner) {
    var num1 = Math.random();
    var num2 = Math.random();
    this.star = new Raster("images/star.png", [positioner,0]);
    this.star.visible=false;
    this.star.reposition = function(){
        this.position.y = 0;
        this.position.x = Math.random() *700+50;
    };
    this.star.onFrame = function(event){
        if(player.visible){
            this.insertBelow(rectangle);
            this.translate(num1*10-5,num2*5);
            if(this.position.x>800||this.position.x<0||this.position.y>600||this.position.y<0) {
                this.reposition();
            }
        }
    };
    
}

// constructs each bad star
function BadStar(positioner) {
    var num1 = Math.random();
    var num2 = Math.random();
    this.star = new Raster("images/badstar.png", [positioner,0]);
    this.star.visible=false;
    this.star.reposition = function(){
        this.position.y = 0;
        this.position.x = Math.random() *700+50;
    };
    this.star.onFrame = function(event){
        if(player.visible){
            this.insertBelow(rectangle);
            this.translate(num1*10-5,num2*5);
            if(this.position.x>800||this.position.x<0||this.position.y>600||this.position.y<0) {
                this.reposition();
            }  
        }
    };
    
}

// creates all the good stars
for(var i = 0; i<starsNumber; i++) {
    tempStar = new Star(position);
    stars.push(tempStar);
    position+=50;
    
}

position = 50;

// creates all the bad stars
for(var i = 0; i<starsNumber/2; i++) {
    tempStar = new BadStar(position);
    badstars.push(tempStar);
    position+=100;
    
}

// when start clicked, changes visibilities of sprites
start.onClick = function(event) {
    start.visible=false;
    instructions.visible=false;
    timerText.visible = true;
    scoreText.visible = true;
    rectangle.visible = true;
    player.visible=true;
    for(var i = 0; i<stars.length;i++){
        stars[i].star.visible=true;
    }
    for(var i = 0; i<badstars.length;i++){
        badstars[i].star.visible=true;
    }
}

// starts the timer when the game starts, and trigger game over when timer is 0
timerText.onFrame = function(event) {
    if(timer>0 && player.visible) {
        timer--;
        timerText.content = "Time Left: " + timer;
    }
    if(timer<=0){
        gameOver();
    }
}

// checks for intersections between the stars and the player
function onFrame(event){
    for(var i = 0; i<stars.length;i++){
        tempStar=stars[i];
        if(tempStar.star.bounds.intersects(player.bounds)){
            var chime = new Audio("sounds/chime.mp3");
            chime.play();
            score++;
            scoreText.content = "Score: " + score;
            tempStar.star.position.y = 0;
            tempStar.star.position.x = Math.random() *700+50;
        }
    }
    for(var i = 0; i<badstars.length;i++){
        tempStar=badstars[i];
        if(tempStar.star.bounds.intersects(player.bounds)){
            var error = new Audio("sounds/error.mp3");
            error.play();
            score--;
            scoreText.content = "Score: " + score;
            tempStar.star.position.y = 0;
            tempStar.star.position.x = Math.random() *700+50;
        }
    }
}

// creates game over screen
function gameOver(){
    player.visible = false;
    timerText.visible = false;
    scoreText.visible = false;
    rectangle.visible = false;
    for(var i = 0; i < stars.length; i++){
        stars[i].star.visible=false;   
    }
    for(var i = 0; i < badstars.length; i++){
        badstars[i].star.visible = false;   
    }
    endGame1.visible = true;
    if(score>0) {
        endGame2.content = "Congratulations, your score is "+score;
    } else {
        endGame2.content = "Eh, not so good, your score is "+score;
    }
    endGame2.visible = true;
}