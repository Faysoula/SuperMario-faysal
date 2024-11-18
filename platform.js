class Platform extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    return false;
  }

  draw(ctx) {
    ctx.fillStyle = "#c84c0c";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
