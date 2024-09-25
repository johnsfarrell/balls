/*
 * John Farrell, Brown University
 * Created: 2024-09-19
 * Last updated: 2024-24 -19
 */

class Ball {
  constructor(x, y, vx, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.canvas = document.getElementById('balls-canvas');
  }

  /**
   * Checks if the ball has collided with the walls of the canvas
   * If it has, updates the position and velocity of the ball
   */
  wallCollision() {
    // right wall
    if (this.x + this.radius > this.canvas.width) {
      this.vx = -this.vx;
      this.x = this.canvas.width - this.radius;
    }
    // left wall
    if (this.x - this.radius < 0) {
      this.vx = -this.vx;
      this.x = this.radius;
    }
    // bottom wall
    if (this.y + this.radius > this.canvas.height) {
      this.vy = -this.vy;
      this.y = this.canvas.height - this.radius;
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
  update() {
    this.x += this.vx;
    this.vy += 0.2;
    this.y += this.vy;
    this.wallCollision();
  }

  /**
   * Draws the ball on the canvas
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
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
  }

  /**
   * Initializes the app by creating a ball and starting the animation
   */
  init() {
    this.createBall();
    this.animate();

    document.addEventListener('click', ({ clientX, clientY }) => {
      const deleteCount = this.deleteBalls(clientX, clientY);
      if (!deleteCount) this.createBall(clientX, clientY);
    });

    document.onkeydown = (event) => {
      if (event.key === ' ') {
        for (var i = 0; i < 500; i++) this.createBall();
      }
    };
  }

  /**
   * Creates a new ball at the given coordinates
   * @param {*} x - x coordinate of the ball
   * @param {*} y - y coordinate of the ball
   */
  createBall(x = this.canvas.width / 2, y = this.canvas.height / 2) {
    // creates new ball and adds to list of balls
    var radius = 10 + (Math.random() + 0.5) * 20;
    var vx = (Math.random() - 0.5) * 12;
    var vy = (Math.random() + 0.5) * -6;
    var color = this.randomColor();
    this.balls.push(new Ball(x, y, vx, vy, radius, color));
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
    return oldBallsLength - this.balls.length;
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
   * Animates the balls on the canvas
   */
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.balls.forEach((ball) => {
      ball.update(this.ctx);
      ball.draw(this.ctx);
    });

    requestAnimationFrame(this.animate.bind(this));
  }
}
