class Goomba extends Sprite {
  constructor(x, y, isUnderground = false) {
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
    this.hasAwardedPoints = false;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/enemies.png";

    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDelay = 15;
    this.updateSprites(isUnderground);
    this.stompSound = new Audio("../sounds/stomp.wav");
  }
  setGame(game) {
    this.game = game;
    this.updateSprites(isUnderground);
  }

  updateSprites(isUnderground) {
    if (isUnderground) {
      this.frames = [
        { x: 0, y: 34 }, // Underground walking frame 1
        { x: 30, y: 34 }, // Underground walking frame 2
        { x: 60, y: 38 }, // Underground squished frame
      ];
    } else {
      this.frames = [
        { x: 0, y: 4 }, // Overworld walking frame 1
        { x: 30, y: 4 }, // Overworld walking frame 2
        { x: 60, y: 8 }, // Overworld squished frame
      ];
    }
  }

  update(sprites, keys) {
    const hud = sprites.find((sprite) => sprite instanceof HUD);
    if (this.isDead) {
      this.deathTimer++;
      return this.deathTimer >= this.deathDuration;
    }

    if (!this.isDead) {
      this.velocityY += this.gravity;

      // Add collision check with other Goombas before moving
      const nextX = this.x + this.velocityX;
      let canMove = true;

      sprites.forEach((sprite) => {
        if (sprite instanceof Goomba && sprite !== this && !sprite.isDead) {
          // Check if moving would cause overlap
          if (
            nextX < sprite.x + sprite.width &&
            nextX + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
          ) {
            this.velocityX *= -1;
            canMove = false;
          }
        }
      });

      if (canMove) {
        this.x += this.velocityX;
      }
      this.y += this.velocityY;

      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
        this.frameIndex = this.frameIndex === 0 ? 1 : 0;
      }
    }

    sprites.forEach((sprite) => {
      if (sprite instanceof Platform || sprite instanceof Block) {
        if (this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      } else if (sprite instanceof Player && !this.isDead && !sprite.isDying) {
        if (this.checkCollision(sprite)) {
          if (!sprite.damageState.isInvincible) {
            const hitFromAbove =
              sprite.y + sprite.height < this.y + this.height / 2 &&
              sprite.velocityY > 0;

            if (hitFromAbove) {
              this.die();
              if (hud) {
                hud.addScore(200);
              }
              sprite.velocityY = -8;
            } else {
              sprite.takeDamage();
            }
          }
        }
      }
    });

    if (!this.isDead) {
      if (this.velocityX < 0 && this.x <= 0) this.velocityX = 1;
      if (this.velocityX > 0 && this.x >= 3000 - this.width)
        this.velocityX = -1;
    } else {
    }

    return false;
  }
  die() {
    this.isDead = true;
    this.frameIndex = 2;
    this.height = this.squishHeight;
    this.y = this.y + (this.originalHeight + this.squishHeight - 25);
    this.velocityX = 0;
    this.velocityY = 0;
    try {
      this.stompSound.currentTime = 0;
      this.stompSound.play().catch(() => {});
    } catch (e) {}
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
