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
    // Draw main ground block
    ctx.fillStyle = "#854C30"; // Darker brown base
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw top edge - grass/dirt area
    ctx.fillStyle = "#C86428"; // Lighter brown top
    ctx.fillRect(this.x, this.y, this.width, 20);

    // Add detail lines to create blocks in the ground
    ctx.strokeStyle = "#5C3A20"; // Dark line color
    ctx.lineWidth = 2;

    // Horizontal lines
    for (let y = this.y; y < this.y + this.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(this.x, y);
      ctx.lineTo(this.x + this.width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let x = this.x; x < this.x + this.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, this.y);
      ctx.lineTo(x, this.y + this.height);
      ctx.stroke();
    }
  }
}
