class MovingPlatform extends Sprite {
  constructor(x, y, index = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 16;
    this.speed = 1;
    this.state = "moving";

    // Screen boundaries
    this.topBoundary = 0;
    this.bottomBoundary = 480;

    // Sprite setup
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/platform.gif";
    this.spriteX = 143;
    this.spriteY = 43;
  }

  update(sprites) {
    switch (this.state) {
      case "moving":
        // Move platform upward
        this.y -= this.speed;

        // Reset position when reaching top
        if (this.y < this.topBoundary) {
          this.y = this.bottomBoundary;
        }

        // Handle player collision
        sprites.forEach((sprite) => {
          if (sprite instanceof Player) {
            const expandedHitbox = {
              x: this.x,
              y: this.y - sprite.velocityY,
              width: this.width,
              height: this.height + Math.abs(sprite.velocityY),
            };

            if (this.checkExpandedCollision(sprite, expandedHitbox)) {
              // Only handle collision if player is above platform
              if (sprite.y + sprite.height <= this.y + this.height / 2) {
                // Align player with platform
                sprite.y = this.y - sprite.height;
                sprite.velocityY = 0;
                sprite.isGrounded = true;

                // Move player up with platform
                sprite.y -= this.speed;
              }
            } else if (
              sprite.isGrounded &&
              sprite.y + sprite.height <= this.y + 1 &&
              sprite.x + sprite.width > this.x &&
              sprite.x < this.x + this.width
            ) {
              // Keep player grounded if they're already on the platform
              sprite.y = this.y - sprite.height;
              sprite.velocityY = 0;
              sprite.isGrounded = true;
            }
          }
        });
        break;
    }

    return false;
  }

  checkExpandedCollision(sprite, hitbox) {
    return (
      sprite.x < hitbox.x + hitbox.width &&
      sprite.x + sprite.width > hitbox.x &&
      sprite.y < hitbox.y + hitbox.height &&
      sprite.y + sprite.height > hitbox.y
    );
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    ctx.drawImage(
      this.spriteSheet,
      this.spriteX,
      this.spriteY,
      32,
      8,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
