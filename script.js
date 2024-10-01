/*
 * John Farrell, Brown University
 * Created: 2024-09-19
 * Last updated: 2024-24 -19
 */

class Ball {
  constructor(x, y, vx, vy, radius, color, gravity) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.gravity = gravity;
    this.color = color;
  }

  /**
   * Checks if the ball has collided with the walls of the canvas
   * If it has, updates the position and velocity of the ball
   */
  wallCollision(canvas) {
    // right wall
    if (this.x + this.radius > canvas.width) {
      this.vx = -this.vx;
      this.x = canvas.width - this.radius;
    }
    // left wall
    if (this.x - this.radius < 0) {
      this.vx = -this.vx;
      this.x = this.radius;
    }
    // bottom wall
    if (this.y + this.radius > canvas.height) {
      this.vy = -this.vy;
      this.y = canvas.height - this.radius;
    }
    // top wall
    if (this.y - this.radius < 0) {
      this.vy = -this.vy;
      this.y = this.radius;
    }
  }

  /**
   * Updates the position and velocity of the ball
   */
  update(canvas) {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.wallCollision(canvas);
  }

  /**
   * Checks if the ball overlaps with the x,y coordinate
   * @param {float} x2 - x coordinate of the point to check for overlap
   * @param {float} y2 - y coordinate of the point to check for overlap
   * @returns {boolean} True if the ball overlaps with the point, false otherwise
   */
  overlaps(x2, y2) {
    var dx = this.x - x2;
    var dy = this.y - y2;
    return Math.sqrt(dx ** 2 + dy ** 2) < this.radius * 1.25;
  }
}

class App {
  constructor() {
    this.balls = [];
    this.canvas = document.getElementById('balls-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.lastFrameTime = 0;
    this.fps = 0;
    this.maxBalls = 5000;
  }

  /**
   * Initializes the app by creating a ball and starting the animation
   */
  init() {
    this.createBall();
    this.animate();

    /** click events: remove if clicked on ball, add if clicked on canvas */
    document.onclick = ({ clientX, clientY }) => {
      !this.deleteBalls(clientX, clientY) && this.createBall(clientX, clientY);
    };

    /** key clicks: add n balls on spacebar */
    document.onkeydown = ({ key }) => {
      key === ' ' && this.createMultipleBalls();
    };
  }

  /**
   * Creates a new ball at the given coordinates
   * @param {*} x - x coordinate of the ball
   * @param {*} y - y coordinate of the ball
   */
  createBall(x = this.canvas.width / 2, y = this.canvas.height / 2) {
    if (this.balls.length >= this.maxBalls) return;

    var radius = 10 + (Math.random() + 0.5) * 20;
    var vx = (Math.random() - 0.5) * 12;
    var vy = (Math.random() + 0.5) * -6;
    var color = this.randomColor();
    var gravity = 0.25;

    this.balls.push(new Ball(x, y, vx, vy, radius, color, gravity));
  }

  /**
   * Draws the ball on the canvas
   * @param {Ball} ball - The ball to draw on the canvas
   */
  drawBall(ball) {
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = ball.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Creates n balls at random positions on the canvas
   * @param {int} n - number of balls to create
   */
  createMultipleBalls(n = 10) {
    Array.from({ length: n }).forEach(() =>
      this.createBall(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      )
    );
  }

  /**
   * Deletes the all balls that overlaps with the given coordinates
   * @param {double} x - x coordinate of click
   * @param {double} y - y coordinate of click
   * @returns {int} Number of balls deleted
   */
  deleteBalls(x, y) {
    const oldBallsLength = this.balls.length;
    this.balls = this.balls.filter((ball) => !ball.overlaps(x, y));
    const deletedCount = oldBallsLength - this.balls.length;
    return deletedCount;
  }

  /**
   * Generates a random color in hex format ("#RRGGBB")
   * @link https://stackoverflow.com/questions/5092808
   * @returns {string} Random color in hex format (#RRGGBB)
   */
  randomColor() {
    return (
      '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
    );
  }

  /**
   * Updates the frames per second
   * @param {double} timestamp - The current time in milliseconds
   */
  updateFPS(timestamp = 0) {
    this.fps = 1000 / (timestamp - this.lastFrameTime);
    this.lastFrameTime = timestamp;
  }

  /**
   * Draws the frames per second and number of balls on the canvas
   */
  drawDebug() {
    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#000000';
    const text = `FPS: ${this.fps.toFixed(2)}, Balls: ${this.balls.length}`;
    this.ctx.fillText(text, 10, 20);
  }

  /**
   * Animates the balls on the canvas
   * @param {double} timestamp - The current time in milliseconds
   */
  animate(timestamp = 0) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.balls.forEach((ball) => {
      ball.update(this.canvas);
      this.drawBall(ball);
    });

    this.updateFPS(timestamp);
    this.drawDebug();

    requestAnimationFrame(this.animate.bind(this));
  }
}
