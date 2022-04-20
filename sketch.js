let planeX = 100;     // x position of the plane (in "stage" coordinates, not screen)
let planeY = 100;     // y position of the plane
let planeSpeedX = 0;  // horizontal speed
let planeSpeedY = 0;  // vertical speed
let planePitch = 0;   // pitch in degrees

let obstacles = [];   // array of Obstacle instances, created in setup
let fans = [];        // array of Fan instances, created in setup

function setup() {
  // create a canvas that is as wide as the browser window
  let canvas = createCanvas(windowWidth, 600);
  // and add it to my container
  canvas.parent('canvas-container');

  // make sure we're start start out scrolled all the way to the left
  window.scrollTo(0, 0);

  // go through all elements with class .obstacle, and create an Obstance
  // instance for each, which gets added to the obstacles array
  let elements = document.querySelectorAll('.obstacle');
  for (let i=0; i < elements.length; i++) {
    console.log('Obstacle at', elements[i].offsetLeft, elements[i].offsetTop, 'dimensions', elements[i].offsetWidth, elements[i].offsetHeight);
    let obstacle = new Obstacle(elements[i].offsetLeft, elements[i].offsetTop, elements[i].offsetWidth, elements[i].offsetHeight);
    obstacles.push(obstacle);
  }

  // same with .fan elements
  elements = document.querySelectorAll('.fan');
  for (let i=0; i < elements.length; i++) {
    console.log('Fan at', elements[i].offsetLeft, elements[i].offsetTop, 'dimensions', elements[i].offsetWidth, elements[i].offsetHeight);
    let fan = new Fan(elements[i].offsetLeft, elements[i].offsetTop, elements[i].offsetWidth);
    fans.push(fan);
  }
}

function draw() {
  clear();

  // figure out whether the plane is on top of a fan
  let isOnTopOfFan = false;
  for (let i=0; i < fans.length; i++) {
    if (fans[i].isBelow(planeX, planeY)) {
      isOnTopOfFan = true;
    }
  }

  // figure out whether the plane is colliding with an obstacle
  let isCollidingWithObstacle = false;
  for (let i=0; i < obstacles.length; i++) {
    if (obstacles[i].isColliding(planeX, planeY)) {
      isCollidingWithObstacle = true;
    }
  }

  // change the pitch of the plane based on mouseX
  planePitch = (mouseX - width/2) / windowWidth * 75;

  // change the horizontal speed based on pitch, and limit it
  planeSpeedX = planeSpeedX + planePitch / 100;
  planeSpeedX = constrain(planeSpeedX, -3, 3);

  if (isOnTopOfFan) {
    // make the plane go up based on the lift from the fan
    planeSpeedY = planeSpeedY - 0.1;
  } else {
    // make the plane go down based on gravity
    planeSpeedY = planeSpeedY + 0.05;
  }
  // limit vertical speed
  planeSpeedY = constrain(planeSpeedY, -1, 1);

  // update the plane's position based on speed
  if (!isCollidingWithObstacle) {
    // forward motion only when we're not colliding with an obstacle
    planeX = planeX + planeSpeedX;
    // make sure the plane doesn't go offscreen on the left
    if (planeX < 0) {
      planeX = 0;
    }
  }
  planeY = planeY + planeSpeedY;

  // reset the plane when we go out of bounds
  if (height < planeY) {
    planeX = planeX - 200;
    planeY = 100;
    planeSpeedX = 0;
    planeSpeedY = 0;
    planePitch = 0;
  }

  // draw the plane
  drawPlane(planeX-window.scrollX, planeY, planePitch);

  // scroll when the plane is about to go out of the window
  if (planeX-window.scrollX > width * 0.85) {
    window.scrollBy(width * 0.85, 0);
  } else if (planeX-window.scrollX < 0) {
    window.scrollBy(-width, 0);
  }
}

function drawPlane(x, y, pitch) {
  push();
  translate(x, y);
  scale(0.2, 0.2);
  rotate(radians(pitch+10));
  translate(-300, -200);
  beginShape();
  vertex(511, 82);
  vertex(163, 193);
  vertex(217, 320);
  endShape(CLOSE);
  beginShape();
  vertex(328, 250);
  vertex(217, 320);
  vertex(266, 234);
  endShape(CLOSE);
  beginShape();
  vertex(511, 82);
  vertex(54, 158);
  vertex(163, 193);
  endShape(CLOSE);
  beginShape();
  vertex(511, 82);
  vertex(266, 234);
  vertex(394, 280);
  endShape(CLOSE);
  pop();
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  isColliding(checkX, checkY) {
    if (this.x < checkX && checkX < this.x + this.w &&
        this.y < checkY && checkY < this.y + this.h) {
          return true;
        } else {
          return false;
        }
  }
}

class Fan {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }

  isBelow(checkX, checkY) {
    if (this.x < checkX && checkX < this.x + this.w && checkY < this.y) {
      return true;
    } else {
      return false;
    }
  }
}

// this p5 function is called whenever the window is resized
// we use it to resize the canvas in lockstep
function windowResized() {
  resizeCanvas(windowWidth, 600);
}
