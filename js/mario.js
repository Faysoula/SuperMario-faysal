class Player extends Sprite {
  constructor(x, y, camera) {
    super();
    this.x = x;
    this.y = y;
    this.camera = camera;
    this.levelManager = null;
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
    this.isSlidingPole = false;
    this.slideStartY = 0;
    this.slideEndY = 0;
    this.slideProgress = 0;
    this.slideSpeed = 0.009;
    this.hasCompletedSlide = false;
    this.endSlideDelay = 0;
    this.endSlideDelayMax = 30;
    this.slidePhase = "right";
    this.isEnteringCastle = false;
    this.entryPhase = "none"; // none, walking, entering
    this.targetX = 0;
    this.hasLandedAfterPole = false;
    this.flagpoleLandingPosition = 0;

    // Power-up related properties
    this.isSuper = false;
    this.isTransforming = false;
    this.transformationTimer = 0;
    this.transformationDuration = 60;
    this.transformationFlashInterval = 4;
    this.smallHeight = 30;
    this.superHeight = 60;
    this.isVisible = true;

    this.damageState = {
      isInvincible: false,
      invincibilityTimer: 0,
      invincibilityDuration: 90, // 1.5 seconds at 60fps
      flashInterval: 4, // How often to toggle visibility
      isVisible: true,
      isDamaged: false,
      damageAnimationTimer: 0,
      damageAnimationDuration: 30, // 0.5 seconds for shrinking animation
    };

    this.normalHeight = 60;
    this.crouchHeight = 40; 
    this.heightDifference = this.normalHeight - this.crouchHeight;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/smb_mario_sheet.png";
    this.animation = new SpriteAnimation(this.spriteSheet, 19, 16);
  }
  takeDamage() {
    if (this.isSuper && !this.damageState.isInvincible && !this.isDying) {
      // Start damage sequence
      this.damageState.isDamaged = true;
      this.damageState.isInvincible = true;
      this.damageState.invincibilityTimer = 0;
      this.damageState.damageAnimationTimer = 0;

      // Small bounce when hit
      this.velocityY = -4;

      return true;
    } else if (
      !this.isSuper &&
      !this.damageState.isInvincible &&
      !this.isDying
    ) {
      this.die();
      return true;
    }
    return false;
  }

  updateDamageState() {
    if (this.damageState.isInvincible) {
      this.damageState.invincibilityTimer++;

      // Handle visibility flashing
      if (
        this.damageState.invincibilityTimer % this.damageState.flashInterval ===
        0
      ) {
        this.damageState.isVisible = !this.damageState.isVisible;
      }

      // Handle damage animation (shrinking)
      if (this.damageState.isDamaged) {
        this.damageState.damageAnimationTimer++;

        if (this.damageState.damageAnimationTimer === 1) {
          // At the start of damage animation
          this.height = this.superHeight;
          this.y -= this.superHeight - this.smallHeight;
        }

        const progress =
          this.damageState.damageAnimationTimer /
          this.damageState.damageAnimationDuration;
        if (progress <= 1) {
          this.height =
            this.superHeight + (this.smallHeight - this.superHeight) * progress;
        }

        if (
          this.damageState.damageAnimationTimer >=
          this.damageState.damageAnimationDuration
        ) {
          this.height = this.smallHeight;
          this.isSuper = false;
          this.damageState.isDamaged = false;
          this.animation = new SpriteAnimation(this.spriteSheet, 19, 16);
        }
      }

      if (
        this.damageState.invincibilityTimer >=
        this.damageState.invincibilityDuration
      ) {
        this.damageState.isInvincible = false;
        this.damageState.isVisible = true;
        this.damageState.invincibilityTimer = 0;
      }
    }
  }

  setLevelManager(levelManager) {
    this.levelManager = levelManager;
  }

  startFlagpoleSlide(flagpole) {
    this.isSlidingPole = true;
    this.hasCompletedSlide = false;
    this.slideStartY = this.y;
    this.slideEndY = flagpole.y + flagpole.height - this.height - 32;
    this.slideProgress = 0;
    this.x = flagpole.x - 20; // Start on left side of pole
    this.velocityX = 0;
    this.velocityY = 0;
    this.direction = -1; // Face left initially
    this.slidePhase = "left";
    if (this.isSuper) {
      this.animation.setState("flagpoleLeft");// uses the this
    }else {
      this.animation.setState("flagpoleLeft");
    }
    // Start with left animation
  }

  updateFlagpoleSlide(sprites) {
    if (!this.isSlidingPole) return;

    if (this.hasCompletedSlide) {
      this.endSlideDelay++;

      // Switch to right side when reaching bottom
      if (this.slidePhase === "left" && this.endSlideDelay >= 15) {
        this.slidePhase = "right";
        this.x = this.x + 20; // Move to right side of pole
        this.direction = 1;
        if (this.isSuper) {
          this.animation.setState("flagpoleRight");
        } else {
          this.animation.setState("flagpoleRight");
        }
        this.endSlideDelay = 0;
      }
      // Jump off after holding right position
      else if (
        this.slidePhase === "right" &&
        this.endSlideDelay >= this.endSlideDelayMax
      ) {
        this.endFlagpoleSlide(sprites);
      }
      return;
    }

    // Update slide progress
    this.slideProgress = Math.min(1, this.slideProgress + this.slideSpeed);

    // Interpolate position
    this.y =
      this.slideStartY +
      (this.slideEndY - this.slideStartY) * this.slideProgress;

    // Check if slide is complete
    if (this.slideProgress >= 1 && !this.hasCompletedSlide) {
      this.hasCompletedSlide = true;
      this.endSlideDelay = 0;
    }
  }

  endFlagpoleSlide(sprites) {
    this.isSlidingPole = false;
    if (this.isSuper) {
      this.animation.setState("walkRight");
    } else {
      this.animation.setState("walkRight");
    }
    this.velocityX = 2;
    this.velocityY = -4;
    this.hasLandedAfterPole = false;

    this.flagpoleLandingPosition = this.x + 30;
  }

  startCastleEntry(castle) {
    this.isEnteringCastle = true;
    this.entryPhase = "walking";
    this.targetX = castle.entranceX;
    this.direction = 1; // Face right
    this.velocityX = 2; // Set walking speed
    if (this.isSuper) {
      this.animation.setState("walkRight");
    } else {
      this.animation.setState("walkRight");
    }
  }

  updateCastleEntry() {
    if (!this.isEnteringCastle) return;

    switch (this.entryPhase) {
      case "walking":
        if (this.x >= this.targetX) {
          this.entryPhase = "entering";
          this.velocityX = 1;
        }
        break;

      case "entering":
        if (this.levelManager) {
          this.levelManager.nextLevel();
        }
        break;
    }
  }

  die() {
    if (this.isSuper) {
      // If Super Mario, revert to small instead of dying
      this.revertToSmall();
      this.velocityY = -8; // Small bounce when hit
      return;
    }

    if (!this.isDying) {
      this.isDying = true;
      this.velocityY = this.deathJumpVelocity;
      this.velocityX = 0;
      this.animation.setState("death");
    }
  }

  update(sprites, keys, camera) {
    this.updateDamageState();

    if (this.isDying) {
      this.velocityY += this.deathGravity;
      this.y += this.velocityY;

      if (this.y > 800) {
        this.respawn(camera);
      }
      return false;
    }
    this.handleTransformation();
    sprites.forEach((sprite) => {
      if (sprite instanceof Goomba && !sprite.isDead) {
        if (this.checkCollision(sprite)) {
          if (this.damageState.isInvincible) {
            // During invincibility, ignore enemy collision
            return;
          }

          const hitFromAbove =
            this.y + this.height < sprite.y + sprite.height / 2 &&
            this.velocityY > 0;

          if (hitFromAbove) {
            sprite.die();
            this.velocityY = -8;
          } else {
            this.takeDamage();
          }
        }
      }
    });
    if (this.isTransforming) {
      return false; // Prevent other updates during transformation
    }
    if (this.isSlidingPole) {
      this.updateFlagpoleSlide(sprites);
      return false;
    }

    // Handle post-flagpole landing sequence
    if (
      !this.hasLandedAfterPole &&
      !this.isSlidingPole &&
      this.flagpoleLandingPosition > 0
    ) {
      // Apply normal physics
      this.velocityY += this.gravity;
      this.x += this.velocityX;
      this.y += this.velocityY;

      // Check for ground collision
      sprites.forEach((sprite) => {
        if (sprite instanceof Platform && this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
          if (this.isGrounded) {
            this.hasLandedAfterPole = true;
            this.velocityX = 0;
            // Now find the castle and start entry
            sprites.forEach((s) => {
              if (s instanceof Castle) {
                s.startPlayerEntrance();
              }
            });
          }
        }
      });

      this.animation.update();
      return false;
    }

    if (this.isEnteringCastle) {
      this.updateCastleEntry();
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.animation.update();
      return false;
    }
    if (this.isDying) {
      this.velocityY += this.deathGravity;
      this.y += this.velocityY;

      if (this.y > 800) {
        this.respawn(camera);
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

    if (this.isSuper && this.isGrounded && !this.isSlidingPole) {
      if (keys["ArrowDown"] || keys["S"]) {
        if (!this.isCrouching) {
          this.isCrouching = true;
          this.height = this.crouchHeight;
          this.y += this.heightDifference ;
          this.animation.setState(
            this.direction === 1 ? "crouchRight" : "crouchLeft"
          );
          this.velocityX = 0; // Stop horizontal movement while crouching
        }
      } else if (this.isCrouching) {
        // Check if there's space to stand up
        const standingCollision = sprites.some(
          (sprite) =>
            sprite instanceof Platform &&
            this.checkCollisionAtHeight(sprite, this.normalHeight)
        );

        if (!standingCollision) {
          this.isCrouching = false;
          this.y -= this.heightDifference;
          this.height = this.normalHeight;
          this.animation.setState(
            this.direction === 1 ? "idleRight" : "idleLeft"
          );
        }
      }
    }

    // Prevent movement while crouching
    if (this.isCrouching) {
      return false;
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

  // Helper method to check if there would be a collision at a different height
  checkCollisionAtHeight(platform, testHeight) {
    const originalHeight = this.height;
    const originalY = this.y;
    this.height = testHeight;
    this.y -= testHeight - originalHeight;

    const collision = this.checkCollision(platform);

    this.height = originalHeight;
    this.y = originalY;

    return collision;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isDying = false;
    this.animation.setState(this.direction === 1 ? "idleRight" : "idleLeft");

    if (this.camera) {
      this.camera.reset();
    }

    if (this.levelManager) {
      this.levelManager.restartLevel();
    }
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
    if (
      this.isEnteringCastle &&
      this.entryPhase === "entering" &&
      this.x >= this.targetX
    ) {
      return;
    }
    if (!this.damageState.isVisible) {
      return;
    }

    if (this.isTransforming && !this.isVisible) {
      return;
    }

    // Draw Mario normally
    this.animation.draw(ctx, this.x, this.y, this.width, this.height);
  }
  //super mario transformation

  transformToSuper() {
    if (!this.isSuper && !this.isTransforming) {
      this.isTransforming = true;
      this.transformationTimer = 0;
      const heightDifference = this.superHeight - this.smallHeight;
      this.y -= heightDifference; // Adjust position to grow upward
    }
  }

  revertToSmall() {
    if (this.isSuper) {
      this.isSuper = false;
      this.height = this.smallHeight;
      this.y += this.superHeight - this.smallHeight; // Adjust position when shrinking
      this.animation = new SpriteAnimation(this.spriteSheet, 19, 16);
    }
  }

  handleTransformation() {
    if (this.isTransforming) {
      this.transformationTimer++;

      // Toggle visibility every few frames for flashing effect
      if (this.transformationTimer % this.transformationFlashInterval === 0) {
        this.isVisible = !this.isVisible;
      }

      // Gradually increase height during transformation
      const progress = this.transformationTimer / this.transformationDuration;
      this.height =
        this.smallHeight + (this.superHeight - this.smallHeight) * progress;

      // Complete transformation
      if (this.transformationTimer >= this.transformationDuration) {
        this.isTransforming = false;
        this.isSuper = true;
        this.height = this.superHeight;
        this.isVisible = true;
        // Switch to super Mario animation states
        this.animation = new SpriteAnimation(this.spriteSheet, 19, 32);
        this.animation.states = this.animation.superStates;
      }
    }
  }
}
