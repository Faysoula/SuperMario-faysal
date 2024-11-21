class Player extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.jumpForce = -12;
    this.gravity = 0.5;
    this.isGrounded = false;
    this.spawnX = x; // Save spawn position
    this.spawnY = y;
  }

  update(sprites, keys) {
    // Horizontal movement
    if (keys["ArrowLeft"]) {
      this.velocityX = -this.speed;
    } else if (keys["ArrowRight"]) {
      this.velocityX = this.speed;
    } else {
      this.velocityX = 0;
    }

    // Jump only if grounded
    if (keys["ArrowUp"] && this.isGrounded) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }

    // Apply gravity
    this.velocityY += this.gravity;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y > 600) {
      // Adjust this value based on your level
      this.respawn();
    }

    // Reset grounded state
    this.isGrounded = false;

    // Check collisions with platforms
    sprites.forEach((sprite) => {
      if (sprite instanceof Platform) {
        if (this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      }
    });

    return false;
  }
  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  checkCollision(platform) {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    );
  }

  resolveCollision(platform) {
    const overlapX =
      this.x + this.width / 2 < platform.x + platform.width / 2
        ? this.x + this.width - platform.x
        : platform.x + platform.width - this.x;

    const overlapY =
      this.y + this.height / 2 < platform.y + platform.height / 2
        ? this.y + this.height - platform.y
        : platform.y + platform.height - this.y;

    // Resolve collision on smallest overlap axis
    if (overlapX < overlapY) {
      if (this.x + this.width / 2 < platform.x + platform.width / 2) {
        this.x = platform.x - this.width;
      } else {
        this.x = platform.x + platform.width;
      }
      this.velocityX = 0;
    } else {
      if (this.y + this.height / 2 < platform.y + platform.height / 2) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isGrounded = true;
      } else {
        this.y = platform.y + platform.height;
        this.velocityY = 0;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
