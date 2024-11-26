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
    this.airControl = 2; // Amount of air movement control
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
    this.groundSpeed = 0; // Track ground speed before jumping

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/smb_mario_sheet.png";

    this.animation = new SpriteAnimation(this.spriteSheet, 19, 16);
  }

  update(sprites, keys) {
    if (this.turnTimer > 0) {
      this.turnTimer--;
      if (this.turnTimer === 0) {
        this.animation.setState(
          this.direction === 1 ? "idleRight" : "idleLeft"
        );
      }
      return false;
    }

    // Store ground speed before jumping
    if (this.isGrounded) {
      this.groundSpeed = this.velocityX;
    }

    // Jump handling
    if ((keys["ArrowUp"] || keys["W"] || keys[" "]) && this.isGrounded) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
      this.jumpDirection = this.direction;
      this.animation.setState(this.direction === 1 ? "jumpRight" : "jumpLeft");
    }

    if (this.isGrounded) {
      // Ground movement
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
      // Air movement - maintain jump animation but allow adjustment to velocity
      this.animation.setState(
        this.jumpDirection === 1 ? "jumpRight" : "jumpLeft"
      );

      // Keep momentum but allow slight adjustments
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
        // Maintain momentum when no keys pressed
        this.velocityX = this.groundSpeed;
      }
    }

    // Physics updates
    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x < 0) this.x = 0;
    if (this.y > 600) this.respawn();

    // Reset grounded state and check collisions
    this.wasGrounded = this.isGrounded;
    this.isGrounded = false;
    sprites.forEach((sprite) => {
      if (sprite instanceof Platform && this.checkCollision(sprite)) {
        this.resolveCollision(sprite);
      }
    });

    this.animation.update();
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
    this.animation.draw(ctx, this.x, this.y, this.width, this.height);
  }
}
