class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;

    // Camera behavior configuration
    this.leftOffset = 160; // Distance from left edge where player should stay
    this.rightOffset = 160; // Distance from right edge where player should stop camera
    this.verticalDeadzone = 50; // Vertical deadzone for smooth platform transitions
    this.horizontalSmoothing = 0.1; // Camera smoothing factor for horizontal movement
    this.verticalSmoothing = 0.05; // Camera smoothing factor for vertical movement

    // Level boundaries
    this.maxX = 0;
    this.maxY = 0;
  }

  setLevelBoundaries(width, height) {
    this.maxX = Math.max(0, width - this.canvas.width);
    this.maxY = Math.max(0, height - this.canvas.height);
  }

  update(player) {
    if (!player) return;

    // Calculate target camera position
    let targetX = player.x - this.leftOffset;
    let targetY = player.y - this.height / 2;

    // Prevent backward scrolling
    targetX = Math.max(targetX, this.x);

    // Apply level boundaries
    targetX = Math.max(0, Math.min(targetX, this.maxX));
    targetY = Math.max(0, Math.min(targetY, this.maxY));

    // Smooth camera movement
    this.x += (targetX - this.x) * this.horizontalSmoothing;

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

  // Apply camera transform to context
  begin(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  // Restore context state
  end(ctx) {
    ctx.restore();
  }
}
