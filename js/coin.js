class Coin extends Sprite {
  constructor(x, y, isPopOut = false) {
    super();
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.collected = false;
    this.startY = y;

    // Sprite sheet setup
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/coin.png";

    // Animation frames with exact coordinates
    this.frames = [
      { x: 6, y: 34 },
      { x: 23, y: 34 },
      { x: 40, y: 34 },
      { x: 23, y: 34 },
    ];

    // Animation properties
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDelay = 8;
    this.sourceTileSize = 16;

    // Pop-out behavior
    this.isPopOut = isPopOut;
    if (this.isPopOut) {
      this.velocityY = -8;
      this.state = "rising";
      this.maxRiseHeight = y - 64; // Maximum height coin will rise
    } else {
      this.velocityY = 0;
      this.state = "static";
    }

    this.gravity = 0.5;
    this.fadeOut = 1.0;
  }

  update(sprites) {
    // Update animation for both static and pop-out coins
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }

    const hud = sprites.find((sprite) => sprite instanceof HUD);

    // Handle collection for static coins
    if (!this.isPopOut) {
      sprites.forEach((sprite) => {
        if (
          sprite instanceof Player &&
          this.checkCollision(sprite) &&
          !this.collected
        ) {
          this.collected = true;
          if (hud) {
            hud.addCoin();
          }
          this.state = "removing";
        }
      });
    }

    // Handle pop-out physics
    if (this.isPopOut) {
      switch (this.state) {
        case "rising":
          this.y += this.velocityY;
          if (this.y <= this.maxRiseHeight) {
            this.state = "falling";
          }
          break;

        case "falling":
          this.velocityY += this.gravity;
          this.y += this.velocityY;
          if (this.y >= this.startY) {
            this.state = "removing";
            if(hud){
              hud.addCoin();
            }
          }
          break;
      }
    }

    // Handle removal
    if (this.state === "removing") {
      this.fadeOut -= 0.2;
      if (this.fadeOut <= 0) {
        return true; // Remove the coin
      }
      
    }

    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    ctx.save();
    ctx.globalAlpha = this.fadeOut;

    // Get current frame
    const frame = this.frames[this.frameIndex];

    // Draw the coin
    ctx.drawImage(
      this.spriteSheet,
      frame.x,
      frame.y,
      this.sourceTileSize,
      this.sourceTileSize,
      this.x,
      this.y,
      this.width,
      this.height
    );

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
