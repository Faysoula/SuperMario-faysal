class Coin extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.collected = false;
    this.startY = y; // Remember starting position

    // Physics properties
    this.velocityY = -15; // Stronger initial upward velocity
    this.gravity = 0.8; // Increased gravity for snappier movement

    // Animation properties
    this.rotation = 0;
    this.rotationSpeed = 0.2;
    this.fadeOut = 1.0;

    // Track animation state
    this.state = "rising"; // states: rising, falling, removing
  }

  update(sprites) {
    // Apply physics
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    // State machine for coin animation
    switch (this.state) {
      case "rising":
        // If velocity becomes positive (starts falling), transition to falling state
        if (this.velocityY > 0) {
          this.state = "falling";
        }
        break;

      case "falling":
        // When coin falls back to original position (or below), start removal
        if (this.y >= this.startY) {
          this.state = "removing";
        }
        break;

      case "removing":
        // Fade out and remove
        this.fadeOut -= 0.2; // Faster fade out
        if (this.fadeOut <= 0) {
          return true; // Remove the coin
        }
        break;
    }

    // Rotate the coin
    this.rotation += this.rotationSpeed;

    return false;
  }

  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  draw(ctx) {
    ctx.save();

    // Apply fade out effect
    ctx.globalAlpha = this.fadeOut;

    // Move to coin's center for rotation
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Draw the coin
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add some shading/detail
    ctx.strokeStyle = "#DAA520";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}