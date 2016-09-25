//creates the canvas
var canvas = document.createElement("canvas"), c = canvas.getContext("2d");
canvas.width = 800; canvas.height = 400;document.body.appendChild(canvas);
var gravity = - 5;
var won = false;

//This is just an array that holds all of the platform objects
var platforms =  [new Platform(0, canvas.height - 60), new Platform(30, canvas.height - 30) , new Platform(100, canvas.height - 100), new Platform(20, canvas.height - 140), new Platform(canvas.width - 180, canvas.height - 150), new Platform(canvas.width - 220, 210, 10, 20), new Platform(canvas.width - 300, 190), new Platform(canvas.width - 350, 190, 10, 20), new Platform(canvas.width - 400, 190, 10, 20), new Platform(canvas.width - 500, 150)];
//width of platforms
var platLength = 50;
//player object
var p = new Player();
//the box that you have to get to to win
var win = new WinBox(canvas.width - 500, 140);

var gravityTimer = 300;
var gravityShifted = false;

//draws the background, platforms and the player
setInterval(function(){
  checkWin();
  setBoard();
  changeGravity();
},30);

//calls everythings draw function
function setBoard(){
  c.fillStyle = "green";
   c.fillRect(0, 3 * canvas.height / 4, canvas.width, canvas.height);
   c.fillStyle = "blue";
   c.fillRect(0, 0, canvas.width, 3 * canvas.height /4);
   p.draw();
   for(i = 0; i < platforms.length; i++){
     platforms[i].draw();
     //alert(platforms[i].x);
   }
   win.draw();
};
//wil change gravty
function changeGravity(){
  if(gravityShifted && gravityTimer >0){
    gravity= -2;}
  else{
    gravityShifted = false;
    gravity = -5;
    gravityTimer = 30;}
    gravityTimer--;
};
//checks for user input to move player if possible
document.addEventListener('keydown', function(event){
  if(event.keyCode == 37){
    p.vx = -p.sideLength;}
  else if(event.keyCode == 39){
    p.vx = p.sideLength;}
  if(event.keyCode == 71 && gravityTimer > 0)
    gravityShifted = true;
  if(event.keyCode == 32 && p.grounded){
    p.jumping = true;}
});
//sets horizontal component back to zero when the user
//lets go of the key
document.addEventListener('keyup', function(event){
  if(event.keyCode == 37 || event.keyCode == 39){
    p.vx = 0;
  }
});

//platform object
function Platform(xPos, yPos, height = 10, width = 50){
  this.x = xPos;this.y = yPos;
  this.height = height;
  this.width =  width;
}

Platform.prototype.draw = function(){
  c.fillStyle="red";
  c.fillRect(this.x, this.y, this.width, this.height);
}

  //Box that the player must reach to win
  function WinBox(xPos, yPos){
    this.x = xPos;this.y = yPos;
  }
  WinBox.prototype.draw = function(){
    c.fillStyle ="purple";
    c.fillRect(this.x, this.y, p.sideLength, p.sideLength);
  }

  //checks to see if the player intersects the win box and wins the game!
  checkWin = function(){
    if(p.x == win.x && p.y ==win.y){
        alert("You win!");
        p.x = canvas.width / 2;
        p.y = canvas.height;
      }
    }

//All below relates to the player object
function Player(){
  this.sideLength = 10;
  this.x = canvas.width / 2; this.y = canvas.height;
  this.vx = 0; this.vy = 0;
  this.maxJump = 10;this.jumpCount = this.maxJump;
  this.jumping = false;
  this.grounded = false;
}
//called inside setInterval
Player.prototype.draw = function(){
  c.fillStyle = "black";
  c.fillRect(this.x, this.y, this.sideLength, this.sideLength);
  jump(this);
  applyPhysics(this);
  checkGrounded(this);
  checkBorder(this);
}
var checkBorder = function(p){
  if(p.x < 0){
    p.x = canvas.width - p.sideLength;
  }
  else if(p.x > canvas.width - p.sideLength){
    p.x = 0;
  }
}
//jump is always called inside the Player.draw method
//but the player will only jump when the jumping variable
//is true (space and grounded)
var jump = function(p){
  if(p.jumping && p.jumpCount > 0){
    p.y -= p.sideLength;
    p.jumpCount--;
    p.grounded = false;
    //alert("works");
  }
  else if(p.jumpCount <= 0){
    p.jumping = false;
    p.jumpCount = p.maxJump;
  }
}

//checks to see if the player is on the ground or on a platform and applies gravity if not
var applyPhysics = function(p){
  p.x += p.vx;
  if(!p.grounded){
    p.y -= gravity;
  }else{
    p.jumpCount = p.maxJump;
    p.vx = 0;
  }
}
//checks to see if the player is on the ground or platform
var checkGrounded = function(p){
  if(p.y >= canvas.height - p.sideLength ){
    if(!p.grounded){
      p.jumping = false;
      p.vx = 0;
    }
    p.grounded = true;
    p.y = canvas.height - p.sideLength;

  }
  else if(onPlatform(p)){
   // alert("on Platform");
      p.y = platforms[whichPlatform(p)].y - p.sideLength;

    //sets player location to right on top of the platform if its on it
      if(!p.grounded){
        p.jumping = false;
        p.vx = 0;
      }
    p.grounded = true;
  }
  else
    p.grounded = false;
}

//Returns true if the player is on top of a platform
var onPlatform = function(p){
  for(i = 0; i < platforms.length; i++){
    //loops through the array of playform objects and detects if the player is on any of them
    if(p.y + p.sideLength == platforms[i].y ){
      if(p.x  >= platforms[i].x && p.x + p.sideLength <= platforms[i].x + (platforms[i].width) )
        return true;
    }
  }
  return false;
}

//the function whichPlatfofrm returns an int that gives the index of the platform the player is on
var whichPlatform = function(p){
  for(i = 0; i < platforms.length; i++){
    if(p.y + p.sideLength == platforms[i].y ){
      if(p.x  >= platforms[i].x && p.x + p.sideLength <= platforms[i].x + (p.sideLength * 5) ){
        return i;}
      //alert(i);
    }}
}
