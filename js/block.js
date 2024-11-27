class Block extends Sprite {
  constructor(x, y, type = "brick") {
    super();
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.hit = false;
    this.hitAnimation = 0;
    this.originalY = y;
    this.hitCooldown = 0;

    this.spriteSheet = new Image();
    this.stairSpriteSheet = new Image();

    this.spriteSheet.src = "../images/blocks.png";
    this.stairSpriteSheet.src = "../images/giant tileset.png";

    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDelay = 15;
    this.questionBlockFrames = [
      { x: 80, y: 112 },
      { x: 96, y: 112 },
      { x: 112, y: 112 },
      { x: 96, y: 112 },
    ];
    this.hitFrame = { x: 128, y: 112 };
    this.brickFrame = { x: 272, y: 112 };
    this.stairFrame = { x: 0, y: 33 };
  }

  update(sprites, keys) {
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }

    sprites.forEach((sprite) => {
      if (sprite instanceof Player) {
        // First check for hit from below
        if (
          this.type === "question" &&
          !this.hit &&
          this.isHittingFromBelow(sprite)
        ) {
          this.handleHit(sprites);
          // Push player down slightly when hitting block
          sprite.y = this.y + this.height;
          sprite.velocityY = 2; // Give a small downward bounce
        }
        // Then handle normal collisions
        else if (this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      }
    });

    // Handle hit animation
    if (this.hitAnimation > 0) {
      this.y = this.originalY - Math.sin(this.hitAnimation * Math.PI) * 8;
      this.hitAnimation = Math.max(0, this.hitAnimation - 0.1);
      if (this.hitAnimation === 0) {
        this.y = this.originalY;
      }
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

    return false;
  }

  handleHit(sprites) {
    if (this.hit || this.hitCooldown > 0) return;

    this.hitAnimation = 1;
    if (this.type === "question") {
      this.hit = true;

      // Create coin at the top of the block
      const coin = new Coin(
        this.x + (this.width - 24) / 2, // Center coin horizontally
        this.y, // Start at block's top
        true // This is a pop-out coin
      );
      sprites.push(coin);

      // Add cooldown to prevent multiple hits
      this.hitCooldown = 10;
    }
  }

  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
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
      // Horizontal collision
      if (player.x < this.x) {
        player.x = this.x - player.width;
      } else {
        player.x = this.x + this.width;
      }
      player.velocityX = 0;
    } else {
      // Vertical collision
      if (player.y < this.y) {
        // Player is above the block
        player.y = this.y - player.height;
        player.velocityY = 0;
        player.isGrounded = true;
      } else {
        // Player is below the block
        player.y = this.y + this.height;
        player.velocityY = Math.max(0, player.velocityY);
      }
    }
  }

  draw(ctx) {
    if (this.type === "stair") {
      if (!this.stairSpriteSheet.complete) return;
      ctx.drawImage(
        this.stairSpriteSheet,
        this.stairFrame.x,
        this.stairFrame.y,
        16,
        16,
        this.x,
        this.y,
        this.width,
        this.height
      );
      return;
    }

    if (!this.spriteSheet.complete) return;
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
      this.spriteSheet,
      sourceX,
      sourceY,
      16,
      16,
      this.x,
      this.y,
      this.width,
      this.height
    );
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
