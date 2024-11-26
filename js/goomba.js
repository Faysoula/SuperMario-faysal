class Goomba extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = -1;
    this.velocityY = 0;
    this.gravity = 0.8;
    this.isGrounded = false;
    this.isDead = false;
    this.deathTimer = 0;
    this.deathDuration = 30;
    this.originalHeight = 32;
    this.squishHeight = 16;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/enemies.png";

    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDelay = 15;
    this.frames = [
      { x: 0, y: 4 },
      { x: 30, y: 4 },
      { x: 60, y: 8 },
    ];
  }

  update(sprites, keys) {
    if (this.isDead) {
      this.deathTimer++;
      return this.deathTimer >= this.deathDuration;
    }

    if (!this.isDead) {
      this.velocityY += this.gravity;
      this.x += this.velocityX;
      this.y += this.velocityY;

      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
        this.frameIndex = this.frameIndex === 0 ? 1 : 0;
      }
    }

    sprites.forEach((sprite) => {
      if (sprite instanceof Platform) {
        if (this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      } else if (sprite instanceof Player && !this.isDead) {
        if (this.checkCollision(sprite)) {
          const hitFromAbove =
            sprite.y + sprite.height < this.y + this.height / 2 &&
            sprite.velocityY > 0;

          if (hitFromAbove) {
            this.die();
            sprite.velocityY = -8;
          } else {
            sprite.respawn();
          }
        }
      }
    });

    if (!this.isDead) {
      if (this.velocityX < 0 && this.x <= 0) this.velocityX = 1;
      if (this.velocityX > 0 && this.x >= 3000 - this.width)
        this.velocityX = -1;
    }

    return false;
  }

  die() {
    this.isDead = true;
    this.frameIndex = 2;
    this.height = this.squishHeight;
    this.y = this.y + (this.originalHeight + this.squishHeight-25);
    this.velocityX = 0;
    this.velocityY = 0;
  }

  checkCollision(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }

  resolveCollision(platform) {
    if (this.isDead) return;

    const overlapX = Math.min(
      this.x + this.width - platform.x,
      platform.x + platform.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - platform.y,
      platform.y + platform.height - this.y
    );

    if (overlapX < overlapY) {
      if (this.x < platform.x) {
        this.x = platform.x - this.width;
        this.velocityX = -1;
      } else {
        this.x = platform.x + platform.width;
        this.velocityX = 1;
      }
    } else {
      if (this.y < platform.y) {
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
    if (!this.spriteSheet.complete) return;
    const frame = this.frames[this.frameIndex];
    ctx.drawImage(
      this.spriteSheet,
      frame.x,
      frame.y,
      16,
      16,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
