class Player extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 3;
    this.airControl = 2;
    this.jumpForce = -15;
    this.gravity = 0.8;
    this.isGrounded = false;
    this.spawnX = x;
    this.spawnY = y;
    this.direction = 1;
    this.turnTimer = 0;
    this.maxTurnTime = 5;
    this.wasGrounded = true;
    this.jumpDirection = 1;
    this.groundSpeed = 0;
    this.isDying = false;
    this.deathJumpVelocity = -12;
    this.deathGravity = 0.5;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/smb_mario_sheet.png";
    this.animation = new SpriteAnimation(this.spriteSheet, 19, 16);
  }

  startFlagpoleSlide(flagpole) {
    this.isSlidingPole = true;
    this.x = flagpole.x - this.width / 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.animation.setState("flagpoleLeft");
  }

  endFlagpoleSlide() {
    this.isSlidingPole = false;
    this.animation.setState("flagpoleJumpOff");
    this.velocityX = 2; // Jump right
    this.velocityY = -4; // Small jump
  }

  die() {
    if (!this.isDying) {
      this.isDying = true;
      this.velocityY = this.deathJumpVelocity;
      this.velocityX = 0;
      this.animation.setState("death");
    }
  }

  update(sprites, keys) {
    if (this.isDying) {
      this.velocityY += this.deathGravity;
      this.y += this.velocityY;

      if (this.y > 800) {
        this.respawn();
      }
      return false;
    }

    if (this.turnTimer > 0) {
      this.turnTimer--;
      if (this.turnTimer === 0) {
        this.animation.setState(
          this.direction === 1 ? "idleRight" : "idleLeft"
        );
      }
      return false;
    }

    if (this.isGrounded) {
      this.groundSpeed = this.velocityX;
    }

    if ((keys["ArrowUp"] || keys["W"] || keys[" "]) && this.isGrounded) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
      this.jumpDirection = this.direction;
      this.animation.setState(this.direction === 1 ? "jumpRight" : "jumpLeft");
    }

    if (this.isGrounded) {
      if (keys["ArrowLeft"] || keys["A"]) {
        if (this.direction === 1) {
          this.animation.setState("turnLeft");
          this.turnTimer = this.maxTurnTime;
          this.direction = -1;
        } else {
          this.velocityX = -this.speed;
          this.animation.setState("walkLeft");
        }
      } else if (keys["ArrowRight"] || keys["D"]) {
        if (this.direction === -1) {
          this.animation.setState("turnRight");
          this.turnTimer = this.maxTurnTime;
          this.direction = 1;
        } else {
          this.velocityX = this.speed;
          this.animation.setState("walkRight");
        }
      } else {
        this.velocityX = 0;
        this.animation.setState(
          this.direction === 1 ? "idleRight" : "idleLeft"
        );
      }
    } else {
      this.animation.setState(
        this.jumpDirection === 1 ? "jumpRight" : "jumpLeft"
      );

      if (keys["ArrowLeft"] || keys["A"]) {
        this.velocityX = Math.max(
          this.groundSpeed - this.airControl,
          -this.speed
        );
      } else if (keys["ArrowRight"] || keys["D"]) {
        this.velocityX = Math.min(
          this.groundSpeed + this.airControl,
          this.speed
        );
      } else {
        this.velocityX = this.groundSpeed;
      }
    }

    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x < 0) this.x = 0;
    if (this.y > 600 && !this.isDying) this.respawn();

    this.wasGrounded = this.isGrounded;
    this.isGrounded = false;

    if (!this.isDying) {
      sprites.forEach((sprite) => {
        if (sprite instanceof Platform && this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      });
    }

    this.animation.update();
    return false;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isDying = false;
    this.animation.setState(this.direction === 1 ? "idleRight" : "idleLeft");
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
    this.animation.draw(ctx, this.x, this.y, this.width, this.height);
  }
}
