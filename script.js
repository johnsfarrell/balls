/*
 * John Farrell, Brown University
 * Created: 2024-09-19
 * Last updated: 2024-09-19
 */

class Ball {
  constructor(x, y, vx, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.gravity = 0.2 * radius;
    this.color = color;
  }

  wallCollision() {
    // right wall
    if (this.x + this.radius > CANVAS.width) {
      this.vx = -this.vx;
      this.x = CANVAS.width - this.radius;
    }
    // left wall
    if (this.x - this.radius < 0) {
      this.vx = -this.vx;
      this.x = this.radius;
    }
    // bottom wall
    if (this.y + this.radius > CANVAS.height) {
      this.vy = -this.vy;
      this.y = CANVAS.height - this.radius;
    }
    // top wall
    if (this.y - this.radius < 0) {
      this.vy = -this.vy;
      this.y = this.radius;
    }
  }

  update() {
    // ball update position and velocity
    this.x += this.vx;
    this.vy += 0.2;
    this.y += this.vy;
    this.wallCollision();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  intersects(x2, y2) {
    var dx = this.x - x2;
    var dy = this.y - y2;
    return Math.sqrt(dx ** 2 + dy ** 2) < this.radius;
  }
}

// all balls in the application
let balls = [];

// constant variables
const CANVAS = document.getElementById("balls-canvas");
const CTX = CANVAS.getContext("2d");

// set canvas to size of window
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const createBall = (x, y) => {
  // creates new ball and adds to list of balls
  var radius = 10 + (Math.random() + 0.5) * 20;
  var vx = (Math.random() - 0.5) * 12;
  var vy = (Math.random() + 0.5) * -6;
  var color = randomColor();
  balls.push(new Ball(x, y, vx, vy, radius, color));
};

/**
 * Generates a random color in hex format ("#RRGGBB")
 * @link https://stackoverflow.com/questions/5092808
 * @returns {string} Random color in hex format (#RRGGBB)
 */
const randomColor = () => {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
};

CANVAS.addEventListener("click", (event) => {
  var rect = CANVAS.getBoundingClientRect();
  var clickX = event.clientX - rect.left;
  var clickY = event.clientY - rect.top;
  var originalBallsLength = balls.length;

  balls = balls.filter((ball) => !ball.intersects(clickX, clickY));

  if (balls.length == originalBallsLength) createBall(clickX, clickY);
});

const animate = () => {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  balls.forEach((ball) => {
    ball.update(CTX);
    ball.draw(CTX);
  });

  requestAnimationFrame(animate);
};

// initial ball
createBall(CANVAS.width / 2, CANVAS.height / 2);
animate();
