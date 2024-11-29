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

    this.flagSprite = new Image();
    this.flagSprite.src = "../images/castle-flag.png";
    this.flagY = this.y; // Start at bottom of castle
    this.flagTargetY = this.y - 40; // Rise to top
    this.flagRising = false;
    this.flagRiseSpeed = 2;

    this.entryDelay = 30;
    this.entryTimer = 0;
    this.levelChangeTriggered = false;
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
          sprite.startCastleEntry(this);
        }
        // Start flag rising when player is fully inside castle
        if (
          sprite.isEnteringCastle &&
          sprite.entryPhase === "entering" &&
          !this.flagRising
        ) {
          this.flagRising = true;
        }
      }
    });

    // Update flag position
    if (this.flagRising && this.flagY > this.flagTargetY) {
      this.flagY -= this.flagRiseSpeed;
      if (this.flagY <= this.flagTargetY) {
        this.flagY = this.flagTargetY;
      }
    }

    if (this.flagRising && !this.levelChangeTriggered) {
      this.entryTimer++;
      if (this.entryTimer >= this.entryDelay) {
        this.levelChangeTriggered = true;
        if (this.levelManager) {
          this.levelManager.nextLevel();
        }
      }
    }

    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    // Draw the flag
    if (this.flagSprite.complete) {
      ctx.drawImage(
        this.flagSprite,
        this.x + this.width/2 -94,
        this.flagY + 10,
        32,
        32
      );
    }
    // Draw the castle
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


    // Calculate the castle's vertical midpoint for player drawing
    const castleMidY = this.y + this.height / 2;
    const player = this.findPlayer();
    const playerBottom = player ? player.y + player.height : 0;

    if (player && playerBottom <= castleMidY && this.isPlayerEntering) {
      player.draw(ctx);
    }
  }

  findPlayer() {
    if (!this.levelManager || !this.levelManager.game) return null;
    const sprites = this.levelManager.game.sprites;
    return sprites.find((sprite) => sprite instanceof Player);
  }
}
