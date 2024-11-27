class Pipe extends Sprite {
  constructor(x, y, size = "large") {
    super();
    this.x = x;
    this.y = y;

    // Define the source coordinates for pipe parts
    this.pipeSprites = {
      leftStem: { x: 119, y: 213 },
      rightStem: { x: 135, y: 213 }, // Moved left by 1 pixel
      topLeft: { x: 119, y: 196 },
      topRight: { x: 136, y: 196 }, // Moved left by 1 pixel
    };

    // Set dimensions based on pipe size
    switch (size) {
      case "small":
        this.stemWidth = 54;
        this.stemHeight = 32;
        this.headWidth = 64;
        this.headHeight = 30;
        break;
      case "medium":
        this.stemWidth = 54;
        this.stemHeight = 64;
        this.headWidth = 64;
        this.headHeight = 30;
        break;
      case "large":
        this.stemWidth = 56;
        this.stemHeight = 100;
        this.headWidth = 64;
        this.headHeight = 30;
        break;
    }

    // Total dimensions for collision detection
    this.width = this.headWidth;
    this.height = this.stemHeight + this.headHeight;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/giant tileset.png";
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    const sourceSize = 16;
    const stemOffset = (this.headWidth - this.stemWidth) / 2;

    // Draw the head (top) of the pipe
    // Left part
    ctx.drawImage(
      this.spriteSheet,
      this.pipeSprites.topLeft.x,
      this.pipeSprites.topLeft.y,
      sourceSize,
      sourceSize,
      Math.floor(this.x),
      Math.floor(this.y),
      this.headWidth / 2,
      this.headHeight
    );

    // Right part
    ctx.drawImage(
      this.spriteSheet,
      this.pipeSprites.topRight.x,
      this.pipeSprites.topRight.y,
      sourceSize,
      sourceSize,
      Math.floor(this.x + this.headWidth / 2) -3, // Shifted left by 1 pixel
      Math.floor(this.y),
      this.headWidth / 2,
      this.headHeight
    );

    // Draw the stem
    const stemPartWidth = this.stemWidth / 2;
    const numSegments = Math.ceil(this.stemHeight / 16);

    for (let i = 0; i < numSegments; i++) {
      const segHeight = i === numSegments - 1 ? this.stemHeight - i * 16 : 16;
      const yPos = this.y + this.headHeight + i * 16;

      // Left stem
      ctx.drawImage(
        this.spriteSheet,
        this.pipeSprites.leftStem.x,
        this.pipeSprites.leftStem.y,
        sourceSize,
        sourceSize,
        Math.floor(this.x + stemOffset),
        Math.floor(yPos),
        stemPartWidth,
        segHeight
      );

      // Right stem
      ctx.drawImage(
        this.spriteSheet,
        this.pipeSprites.rightStem.x,
        this.pipeSprites.rightStem.y,
        sourceSize,
        sourceSize,
        Math.floor(this.x + stemOffset + stemPartWidth) - 3, // Shifted left by 1 pixel
        Math.floor(yPos),
        stemPartWidth,
        segHeight
      );
    }
  }

  update(sprites) {
    sprites.forEach((sprite) => {
      if (
        (sprite instanceof Player || sprite instanceof Goomba) &&
        this.intersects(sprite)
      ) {
        this.handleCollision(sprite);
      }
    });
    return false;
  }

  intersects(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }

  handleCollision(sprite) {
    const overlapX = Math.min(
      this.x + this.width - sprite.x,
      sprite.x + sprite.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - sprite.y,
      sprite.y + sprite.height - this.y
    );

    if (overlapX < overlapY) {
      if (sprite.x < this.x) {
        sprite.x = this.x - sprite.width;
      } else {
        sprite.x = this.x + this.width;
      }
      if (sprite instanceof Goomba) sprite.velocityX *= -1;
      if (sprite instanceof Player) sprite.velocityX = 0;
    } else {
      if (sprite.y < this.y) {
        sprite.y = this.y - sprite.height;
        sprite.velocityY = 0;
        sprite.isGrounded = true;
      } else {
        sprite.y = this.y + this.height;
        sprite.velocityY = 0;
      }
    }
  }
}
