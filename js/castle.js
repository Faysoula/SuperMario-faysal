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

    // Calculate the castle's vertical midpoint
    const castleMidY = this.y + this.height / 2;
    const player = this.findPlayer();
    const playerBottom = player ? player.y + player.height : 0;

    // Draw the top part of the castle
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

    // If player exists and their bottom is above the castle's midpoint,
    // draw them now (they'll appear behind the bottom part)
    if (player && playerBottom <= castleMidY && this.isPlayerEntering) {
      player.draw(ctx);
    }

    // Draw bottom part of castle
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

    // If player exists and their bottom is below the castle's midpoint,
    // draw them now (they'll appear in front of the bottom part)
    if (player && playerBottom > castleMidY && this.isPlayerEntering) {
      player.draw(ctx);
    }
  }

  findPlayer() {
    if (!this.levelManager || !this.levelManager.game) return null;
    const sprites = this.levelManager.game.sprites;
    return sprites.find((sprite) => sprite instanceof Player);
  }
}
