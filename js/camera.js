class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;

    // Camera should only start following when player is past screen center
    this.triggerPoint = this.width / 2.5; // Middle of screen
    this.maxX = 0;
    this.maxY = 0;

    // Keep vertical movement smooth
    this.verticalSmoothing = 0.05;
    this.verticalDeadzone = 50;
  }

  setLevelBoundaries(width, height) {
    this.maxX = Math.max(0, width - this.canvas.width);
    this.maxY = Math.max(0, height - this.canvas.height);
  }

  update(player) {
    if (!player) return;

    // Only move camera if player is past screen center and moving right
    if (player.x > this.x + this.triggerPoint) {
      this.x = player.x - this.triggerPoint;
    }

    // Prevent backwards scrolling
    if (this.x < 0) this.x = 0;

    // Prevent scrolling past level end
    if (this.x > this.maxX) this.x = this.maxX;

    // Handle vertical camera movement
    let targetY = player.y - this.height / 2;
    targetY = Math.max(0, Math.min(targetY, this.maxY));

    // Only adjust vertical position if change is significant
    if (Math.abs(targetY - this.y) > this.verticalDeadzone) {
      this.y += (targetY - this.y) * this.verticalSmoothing;
    }
  }

  worldToScreen(x, y) {
    return {
      x: x - this.x,
      y: y - this.y,
    };
  }

  screenToWorld(x, y) {
    return {
      x: x + this.x,
      y: y + this.y,
    };
  }

  isVisible(sprite) {
    return (
      sprite.x + sprite.width > this.x &&
      sprite.x < this.x + this.width &&
      sprite.y + sprite.height > this.y &&
      sprite.y < this.y + this.height
    );
  }

  begin(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  end(ctx) {
    ctx.restore();
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}
