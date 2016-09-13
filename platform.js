//creates the canvas
var canvas = document.createElement("canvas"), c = canvas.getContext("2d");
canvas.width = 800; canvas.height = 400;document.body.appendChild(canvas);
var gravity = - 5;
var platforms =  [new Platform(0, canvas.height - 60), new Platform(30, canvas.height - 30) , new Platform(100, canvas.height - 80), new Platform(150, canvas.height - 110)];
var platLength = 50; //length of platforms


var p = new Player();

//draws the background, platforms and the player
setInterval(function(){
 c.fillStyle = "green";
  c.fillRect(0, 3 * canvas.height / 4, canvas.width, canvas.height);
  c.fillStyle = "blue";
  c.fillRect(0, 0, canvas.width, 3 * canvas.height /4);
  p.draw();
  //alert(2);

  for(i = 0; i < platforms.length; i++){
    platforms[i].draw();
    //alert(platforms[i].x);
  }
},30);


//checks for user input to move player if possible
document.addEventListener('keydown', function(event){
  if(event.keyCode == 37){
    p.vx = -p.sideLength;
  }else if(event.keyCode == 39){
    p.vx = p.sideLength;
  }
  //if the player is on the ground and the user
  //hits space then the jump method will trigger.
  if(event.keyCode == 32 && p.grounded){
    p.jumping = true;
  }
});

//platform object
function Platform(xPos, yPos){
  this.x = xPos;this.y = yPos;
}
Platform.prototype.draw = function(){
  c.fillStyle="red";
  c.fillRect(this.x, this.y, p.sideLength * 5, p.sideLength);
}


//All below relates to the player object
function Player(){
  this.sideLength = 10;
  this.x = 50; this.y = 50;
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
      if(p.x  >= platforms[i].x && p.x + p.sideLength <= platforms[i].x + (p.sideLength * 5) )
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
