class FlagPole extends Sprite {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 300;
    this.hasBeenTriggered = false;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/giant tileset.png";

    // Pole parts coordinates
    this.poleSprites = {
      top: { x: 136, y: 230 }, // Original top ball coordinates
      segment: { x: 143, y: 247 }, // Updated segment coordinates for clean version
    };
  }

  update(sprites) {
    const hud = sprites.find((sprite) => sprite instanceof HUD);
    sprites.forEach((sprite) => {
      if (sprite instanceof Player && !this.hasBeenTriggered) {
        if (this.checkCollision(sprite)) {
          this.hasBeenTriggered = true;
          hud.addScore(400);
          sprite.startFlagpoleSlide(this);
        }
      }
    });
    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    // Draw the ball at the top
    ctx.drawImage(
      this.spriteSheet,
      this.poleSprites.top.x,
      this.poleSprites.top.y,
      16,
      16,
      this.x - 6,
      this.y - 16,
      16,
      16
    );

    // Draw the pole segments
    const segmentHeight = 16;
    const numSegments = Math.floor(this.height / segmentHeight);

    for (let i = 0; i < numSegments; i++) {
      ctx.drawImage(
        this.spriteSheet,
        this.poleSprites.segment.x,
        this.poleSprites.segment.y,
        16,
        16,
        this.x,
        this.y + i * segmentHeight,
        16,
        16
      );
    }
  }

  checkCollision(player) {
    const hitboxWidth = 10;
    const poleLeft = this.x - (hitboxWidth - this.width) / 2;

    return (
      player.x + player.width > poleLeft &&
      player.x < poleLeft + hitboxWidth &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}
