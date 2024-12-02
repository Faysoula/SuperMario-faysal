class Mushroom extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.velocityX = 2; // Initial right movement
    this.velocityY = 0;
    this.gravity = 0.8;
    this.isGrounded = false;
    this.isCollected = false;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/items.png";
    this.spawnY = y;
    this.isEmerging = true;
    this.emergenceHeight = 2;
    this.emergenceSpeed = 1;
    this.mushroomSprite = { x: 0, y: 8 }; // Coordinates in items.png
  }

  update(sprites) {
    const hud = sprites.find((sprite) => sprite instanceof HUD);
    if (this.isCollected) return true;

    // Handle emergence animation from block
    if (this.isEmerging) {
      if (this.y > this.spawnY - this.emergenceHeight) {
        this.y -= this.emergenceSpeed;
      } else {
        this.isEmerging = false;
        // Start moving right when emergence is complete
        this.velocityX = 2;
      }
      return false;
    }

    // Apply gravity and movement
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.velocityX;

    // Reset grounded state
    this.isGrounded = false;

    sprites.forEach((sprite) => {
      const spriteType = sprite.constructor.name;

      switch (spriteType) {
        case "Platform":
        case "Block":
          if (this.checkCollision(sprite)) {
            this.resolveCollision(sprite);
          }
          break;

        case "Player":
          if (
            !this.isEmerging &&
            this.checkCollision(sprite) &&
            !sprite.isTransforming
          ) {
            this.isCollected = true;
            hud.addScore(1000);
            sprite.transformToSuper();
          }
          break;

        case "Pipe":
          if (this.checkCollision(sprite)) {
            this.resolveCollision(sprite);
          }
          break;

        default:
          // Handle unknown sprite types or do nothing
          break;
      }
    });

    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    ctx.drawImage(
      this.spriteSheet,
      this.mushroomSprite.x,
      this.mushroomSprite.y,
      16,
      16,
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

  resolveCollision(sprite) {
    const overlapX = Math.min(
      this.x + this.width - sprite.x,
      sprite.x + sprite.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - sprite.y,
      sprite.y + sprite.height - this.y
    );

    if (overlapX < overlapY) {
      // Horizontal collision
      if (this.x < sprite.x) {
        this.x = sprite.x - this.width;
      } else {
        this.x = sprite.x + sprite.width;
      }
      this.velocityX *= -1; // Reverse direction
    } else {
      // Vertical collision
      if (this.y < sprite.y) {
        this.y = sprite.y - this.height;
        this.velocityY = 0;
        this.isGrounded = true;
      } else {
        this.y = sprite.y + sprite.height;
        this.velocityY = 0;
      }
    }
  }
}
