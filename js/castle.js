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
    this.entranceX = this.x + 64;
  }

  setLevelManager(levelManager) {
    this.levelManager = levelManager;
  }

  startPlayerEntrance() {
    this.isPlayerEntering = true;
  }

  update(sprites) {
    if (!this.isPlayerEntering) {
      return false;
    }

    sprites.forEach((sprite) => {
      if (sprite instanceof Player) {
        if (!sprite.isSlidingPole && !sprite.isEnteringCastle) {
          // Start castle entry sequence once pole slide is complete
          sprite.startCastleEntry(this);
        }
      }
    });
    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    // Draw castle in two parts
    // 1. First draw the top part of the castle (above the door)
    ctx.drawImage(
      this.spriteSheet,
      this.castleSprite.x,
      this.castleSprite.y,
      160,
      80,
      this.x,
      this.y,
      this.width,
      this.height / 2
    );

    // Find Mario and draw him if he's entering the castle
    if (this.isPlayerEntering) {
      const player = this.findPlayer();
      if (player && player.x >= this.x && player.x < this.x + this.width) {
        player.draw(ctx);
      }
    }

    // 2. Draw bottom part of castle (below the door)
    ctx.drawImage(
      this.spriteSheet,
      this.castleSprite.x,
      this.castleSprite.y + 80,
      160,
      80,
      this.x,
      this.y + this.height / 2,
      this.width,
      this.height / 2
    );
  }

  findPlayer() {
        if (!this.levelManager || !this.levelManager.game) return null;
    const sprites = this.levelManager.game.sprites;
    return sprites.find((sprite) => sprite instanceof Player);
  }
}
