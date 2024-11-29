class FlagPole extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 32; // Match sprite dimensions
    this.height = 384; // Full height for pole + base
    this.isTriggered = false;
    this.slideProgress = 0;
    this.slideSpeed = 0.005;

    // Add sprite initialization
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/pipes.png";

    // Flag sprite coordinates and state
    this.flag = {
      currentFrame: 0,
      frames: [
        { x: 249, y: 594 },
        { x: 216, y: 594 },
        { x: 182, y: 594 },
        { x: 149, y: 594 },
        { x: 117, y: 594 },
      ],
    };
  }

  update(sprites) {
    if (this.isTriggered) {
      this.slideProgress = Math.min(1, this.slideProgress + this.slideSpeed);
      sprites.forEach((sprite) => {
        if (sprite instanceof Player && sprite.isSlidingPole) {
          // Update player's Y position based on slide progress
          sprite.y =
            this.y + (this.height - sprite.height - 32) * this.slideProgress; // Adjusted to account for base

          // When reaching bottom, transition to jump off animation
          if (this.slideProgress >= 1) {
            sprite.endFlagpoleSlide();
          }
        }
      });
    } else {
      sprites.forEach((sprite) => {
        if (sprite instanceof Player && this.checkCollision(sprite)) {
          this.isTriggered = true;
          sprite.startFlagpoleSlide(this);
        }
      });
    }
    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    // Draw the flag
    const frame = this.flag.frames[this.flag.currentFrame];
    ctx.drawImage(
      this.spriteSheet,
      frame.x,
      frame.y,
      16, // Source dimensions
      16,
      this.x - 15, // Flag offset from pole
      this.y,
      16, // Destination dimensions
      16
    );
  }

  checkCollision(player) {
    return (
      player.x + player.width > this.x - 5 &&
      player.x < this.x + this.width + 5 &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}
