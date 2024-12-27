export class Robot {
  constructor({ position, velocity, map }) {
    this.position = position;
    this.velocity = velocity;
    this.map = map;
    this.seconds = 0;
  }

  move() {
    let [x, y] = this.getPosition();
    const [velX, velY] = this.getVelocity();
    const [width, height] = this.getMap();
    if (x + velX < 0) {
      x = width + (velX + x);
    } else if (x + velX > width - 1) {
      x = velX - (width - x);
    } else {
      x += velX;
    }
    if (y + velY < 0) {
      y = height + (velY + y);
    } else if (y + velY > height - 1) {
      y = velY - (height - y);
    } else {
      y += velY;
    }
    this.setPosition(x, y);
    this.seconds++;
  }

  repeatMove(seconds = 100) {
    while (this.seconds < seconds) {
      this.move();
    }
  }

  getPosition() {
    return this.position;
  }

  setPosition(x, y) {
    this.position = [x, y];
  }

  getVelocity() {
    return this.velocity;
  }

  getMap() {
    return this.map;
  }
}
