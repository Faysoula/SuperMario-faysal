class MovingPlatform extends Sprite {
  constructor(x, y, index = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 16;
    this.speed = 1;

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
    // Move platform upward
    this.y -= this.speed;

    // Reset position when reaching top
    if (this.y < this.topBoundary) {
      this.y = this.bottomBoundary;
    }

    // Handle player collision
    sprites.forEach((sprite) => {
      if (sprite instanceof Player) {
        if (this.checkCollision(sprite)) {
          if (sprite.y + sprite.height <= this.y + 10) {
            sprite.y = this.y - sprite.height;
            sprite.velocityY = 0;
            sprite.isGrounded = true;
            sprite.y -= this.speed;
          }
        }
      }
    });

    return false;
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

  checkCollision(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }
}
