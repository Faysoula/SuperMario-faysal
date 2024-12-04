class Block extends Sprite {
  constructor(x, y, type = "brick", content, isUnderground) {
    super();
    this.x = x;
    this.y = y;
    this.type = type;
    this.content = content;
    this.state = "idle";

    // Set size based on block type
    if (this.type === "stair") {
      this.width = 32;
      this.height = 32;
    } else {
      this.width = 30;
      this.height = 30;
    }

    this.hit = false;
    this.hitAnimation = 0;
    this.originalY = y;
    this.hitCooldown = 0;

    this.isUnderground = isUnderground;
    this.updateSprites(isUnderground);

    this.blockSprite = new Image();

    this.blockSprite.src = "../images/giant tileset.png";

    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDelay = 15;
    this.coinSound = new Audio("../sounds/smb_coin.wav");
    this.powerupAppearsSound = new Audio("../sounds/smb_powerup_appears.wav");
    this.bumpSound = new Audio("../sounds/smb_bump.wav");
    this.breakSound = new Audio("../sounds/smb_breakblock.wav");
  }

  updateSprites(isUnderground) {
    if (isUnderground) {
      this.questionBlockFrames = [
        { x: 394, y: 78 },
        { x: 411, y: 78 },
        { x: 428, y: 78 },
        { x: 411, y: 78 },
      ];
      this.hitFrame = { x: 445, y: 78 };
      this.brickFrame = { x: 181, y: 16 };
      this.stairFrame = { x: 147, y: 33 };
    } else {
      this.questionBlockFrames = [
        { x: 298, y: 78 },
        { x: 315, y: 78 },
        { x: 332, y: 78 },
        { x: 315, y: 78 },
      ];
      this.hitFrame = { x: 51, y: 16 };
      this.brickFrame = { x: 34, y: 16 };
      this.stairFrame = { x: 0, y: 33 };
    }
  }

  handleHit(sprites) {
    if (this.hit || this.hitCooldown > 0) return false;
    this.hitCooldown = 10;

    switch (this.type) {
      case "question":
        this.hit = true;
        if (this.content === "mushroom") {
          const mushroom = new Mushroom(this.x, this.y - this.height);
          sprites.push(mushroom);
          this.powerupAppearsSound.play(); // Play powerup appears sound
        } else {
          const coin = new Coin(this.x + (this.width - 24) / 2, this.y, true);
          sprites.push(coin);
          this.coinSound.play(); // Play coin sound
        }
        return false;

      case "brick":
        const player = sprites.find((sprite) => sprite instanceof Player);
        if (player && player.isSuper) {
          // Create four particles
          sprites.push(
            new BrickParticle(this.x, this.y, -1, this.isUnderground)
          );
          sprites.push(
            new BrickParticle(
              this.x + this.width,
              this.y,
              1,
              this.isUnderground
            )
          );
          sprites.push(
            new BrickParticle(
              this.x,
              this.y + this.height / 2,
              -0.5,
              this.isUnderground
            )
          );
          sprites.push(
            new BrickParticle(
              this.x + this.width,
              this.y + this.height / 2,
              0.5,
              this.isUnderground
            )
          );
          this.breakSound.play(); // Play break sound
          return true; // Remove the block
        } else {
          this.bumpSound.play(); // Play bump sound
        }
        return false;

      default:
        return false;
    }
  }

  update(sprites, keys) {
    switch (this.state) {
      case "idle":
        if (this.hitCooldown > 0) {
          this.hitCooldown--;
        }

        // Update question block animation
        if (this.type === "question" && !this.hit) {
          this.frameTimer++;
          if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.frameIndex =
              (this.frameIndex + 1) % this.questionBlockFrames.length;
          }
        }

        sprites.forEach((sprite) => {
          if (sprite instanceof Player) {
            if (
              (this.type === "question" || this.type === "brick") &&
              !this.hit &&
              this.isHittingFromBelow(sprite)
            ) {
              this.state = "hit";
              sprite.y = this.y + this.height;
              sprite.velocityY = 2;
            } else if (this.checkCollision(sprite)) {
              this.resolveCollision(sprite);
            }
          }
        });
        break;

      case "hit":
        const shouldBreak = this.handleHit(sprites);
        if (shouldBreak) {
          return true; // Remove the block
        }
        this.state = "hitAnimation";
        this.hitAnimation = 1;
        break;

      case "hitAnimation":
        if (this.hitAnimation > 0) {
          this.y = this.originalY - Math.sin(this.hitAnimation * Math.PI) * 8;
          this.hitAnimation = Math.max(0, this.hitAnimation - 0.1);
          if (this.hitAnimation === 0) {
            this.y = this.originalY;
            this.state = "idle";
          }
        }
        break;
    }

    return false;
  }

  draw(ctx) {
    if (this.type === "stair") {
      if (!this.blockSprite.complete) return;
      ctx.drawImage(
        this.blockSprite,
        this.stairFrame.x,
        this.stairFrame.y,
        16,
        16,
        this.x,
        this.y,
        32,
        32
      );
      return;
    }

    if (!this.blockSprite.complete) return;
    let sourceX, sourceY;

    if (this.type === "brick") {
      sourceX = this.brickFrame.x;
      sourceY = this.brickFrame.y;
    } else if (this.type === "question") {
      if (this.hit) {
        sourceX = this.hitFrame.x;
        sourceY = this.hitFrame.y;
      } else {
        const currentFrame = this.questionBlockFrames[this.frameIndex];
        sourceX = currentFrame.x;
        sourceY = currentFrame.y;
      }
    }

    ctx.drawImage(
      this.blockSprite,
      sourceX,
      sourceY,
      16,
      16,
      this.x,
      this.y,
      30,
      30
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

  resolveCollision(player) {
    const overlapX = Math.min(
      this.x + this.width - player.x,
      player.x + player.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - player.y,
      player.y + player.height - this.y
    );

    if (overlapX < overlapY) {
      if (player.x < this.x) {
        player.x = this.x - player.width;
      } else {
        player.x = this.x + this.width;
      }
      player.velocityX = 0;
    } else {
      if (player.y < this.y) {
        player.y = this.y - player.height;
        player.velocityY = 0;
        player.isGrounded = true;
      } else {
        player.y = this.y + this.height;
        player.velocityY = Math.max(0, player.velocityY);
      }
    }
  }

  isHittingFromBelow(player) {
    const playerHeadY = player.y;
    const blockBottomY = this.y + this.height;
    const verticalOverlap = Math.abs(playerHeadY - blockBottomY) < 10;
    const horizontalOverlap =
      player.x + player.width > this.x + 5 &&
      player.x < this.x + this.width - 5;
    const movingUp = player.velocityY < 0;

    return verticalOverlap && horizontalOverlap && movingUp;
  }
}
