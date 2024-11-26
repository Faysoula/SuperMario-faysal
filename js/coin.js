class Coin extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.collected = false;
    this.startY = y;

    // Physics properties
    this.velocityY = -15;
    this.gravity = 0.8;
    this.fadeOut = 1.0;

    // Load the animated GIF directly
    this.sprite = new Image();
    this.sprite.src = "../images/Coin.gif"; // Make sure the coin.gif is in your images folder

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
        if (this.velocityY > 0) {
          this.state = "falling";
        }
        break;

      case "falling":
        if (this.y >= this.startY) {
          this.state = "removing";
        }
        break;

      case "removing":
        this.fadeOut -= 0.2;
        if (this.fadeOut <= 0) {
          return true; // Remove the coin
        }
        break;
    }

    return false;
  }

  draw(ctx) {
    if (!this.sprite.complete) return;

    ctx.save();
    ctx.globalAlpha = this.fadeOut;

    // Draw the animated GIF
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);

    ctx.restore();
  }

  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }
}
