class Castle extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 320; // Updated from 80 to 160
    this.height = 320; // Updated from 80 to 160
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/pipes.png";
    this.castleSprite = { x: 247, y: 863 };
    this.doorOffset = 64; // Adjusted doorOffset to match new size
    this.isPlayerEntering = false;
    this.levelManager = null;
  }

  setLevelManager(levelManager) {
    this.levelManager = levelManager;
  }

  update(sprites) {
    // Only handle player movement if they're entering the castle
    if (!this.isPlayerEntering) {
      return false;
    }

    sprites.forEach((sprite) => {
      if (sprite instanceof Player) {
        // Once entering starts, take control of player movement
        sprite.velocityX += 2;
        sprite.animation.setState("walkRight");

        // Check if player has reached the castle door
        if (sprite.x > this.x + this.doorOffset) {
          if (this.levelManager) {
            this.levelManager.nextLevel();
          }
          return true;
        }
      }
    });
    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    ctx.drawImage(
      this.spriteSheet,
      this.castleSprite.x,
      this.castleSprite.y,
      160,
      160,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  startPlayerEntrance() {
    this.isPlayerEntering = true;
  }
}
