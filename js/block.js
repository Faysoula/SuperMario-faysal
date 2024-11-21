class Block extends Sprite {
  constructor(x, y, type = "brick") {
    super();
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.type = type;
    this.hit = false;
    this.hitAnimation = 0;
    this.originalY = y;
    this.hitCooldown = 0;

    // Question block animation
    this.questionAnimationFrame = 0;
    this.questionAnimationTimer = 0;
    this.questionFrames = ["?", "?", "?", " "];
  }

  isHittingFromBelow(player) {
    // Check if player's head is near the bottom of the block
    const playerHeadY = player.y;
    const blockBottomY = this.y + this.height;

    // Vertical alignment check - player's head near block bottom
    const verticalOverlap = Math.abs(playerHeadY - blockBottomY) < 10;

    // Horizontal alignment check - player is somewhat aligned with block horizontally
    const horizontalOverlap =
      player.x + player.width > this.x + 5 &&
      player.x < this.x + this.width - 5;

    // Must be moving upward
    const movingUp = player.velocityY < 0;

    return verticalOverlap && horizontalOverlap && movingUp;
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

    // Handle question block animation
    if (this.type === "question" && !this.hit) {
      this.questionAnimationTimer += 0.05;
      if (this.questionAnimationTimer >= 1) {
        this.questionAnimationTimer = 0;
        this.questionAnimationFrame =
          (this.questionAnimationFrame + 1) % this.questionFrames.length;
      }
    }

    return false;
  }

  handleHit(sprites) {
    if (this.hit || this.hitCooldown > 0) return;

    this.hitAnimation = 1;
    if (this.type === "question") {
      this.hit = true;
    }

    // Create a coin slightly above the block
    const coin = new Coin(this.x + this.width / 2 - 10, this.y - 40);
    sprites.push(coin);

    // Add cooldown to prevent multiple hits
    this.hitCooldown = 10;
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
    if (this.type === "brick") {
      this.drawBrickBlock(ctx);
    } else if (this.type === "question") {
      this.drawQuestionBlock(ctx);
    }
  }

  drawBrickBlock(ctx) {
    ctx.fillStyle = this.hit ? "#784421" : "#B87333";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = this.hit ? "#5C341A" : "#8B4513";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    ctx.stroke();
  }

  drawQuestionBlock(ctx) {
    ctx.fillStyle = this.hit ? "#784421" : "#FFD700";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (!this.hit) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        this.questionFrames[this.questionAnimationFrame],
        this.x + this.width / 2,
        this.y + this.height / 2
      );
    }
  }
}
