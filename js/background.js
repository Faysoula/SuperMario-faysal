class Background extends Sprite {
  constructor(x, y) {
    super();
    this.x = x || 0;
    this.y = 0;
    this.width = 6000;
    this.height = 480;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/grass.png";
    this.sprites = {
      bigHill: { x: 0, y: 142, width: 82, height: 75 },
      smallHill: { x: 256, y: 158, width: 100, height: 38 },
      bush3: { x: 184, y: 161, width: 70, height: 90 },
      bush1: { x: 376, y: 161, width: 32, height: 90 },
      cloud1: { x: 136, y: 17, width: 32, height: 24 },
      cloud2: { x: 136, y: 17, width: 32, height: 24 },
      cloud3: { x: 440, y: 17, width: 80, height: 24 },
      bush2: { x: 664, y: 161, width: 64, height: 90 },
    };

    this.pattern = [
      { type: "bigHill", x: 20, y: 378 },
      { type: "bush3", x: 380, y: 417 },
      { type: "cloud1", x: 160, y: 100 },
      { type: "smallHill", x: 650, y: 410 },
      { type: "cloud2", x: 580, y: 70 },
      { type: "bush1", x: 757, y: 417 },
      { type: "cloud3", x: 880, y: 100 },
      { type: "bush2", x: 1327, y: 417 },
    ];

    this.patternWidth = 1500;
  }

  isCollidingWithCastle(x, y, width, height) {
    if (!this.game) return false;

    return this.game.sprites.some((sprite) => {
      if (sprite instanceof Castle) {
        const castleBox = {
          x: sprite.x + 40,
          y: sprite.y + 60,
          width: sprite.width - 80,
          height: sprite.height - 60,
        };
        return (
          x < castleBox.x + castleBox.width &&
          x + width > castleBox.x &&
          y < castleBox.y + castleBox.height &&
          y + height > castleBox.y
        );
      }
      return false;
    });
  }

  isCollidingWithBlocks(x, y, width, height) {
    if (!this.game) return false;

    return this.game.sprites.some((sprite) => {
      if (sprite instanceof Block) {
        return (
          x < sprite.x + sprite.width &&
          x + width > sprite.x &&
          y < sprite.y + sprite.height &&
          y + height > sprite.y
        );
      }
      return false;
    });
  }

  isInView(x, y) {
    const camera = this.game?.camera;
    if (!camera) return true;
    const buffer = 100;
    return x >= camera.x - buffer && x <= camera.x + camera.width + buffer;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    const camera = this.game?.camera;
    if (!camera) return;

    const viewStart =
      Math.max(0, Math.floor((camera.x - 100) / this.patternWidth)) *
      this.patternWidth;
    const viewEnd = Math.min(
      this.width,
      Math.ceil((camera.x + camera.width + 100) / this.patternWidth) *
        this.patternWidth
    );

    for (
      let patternX = viewStart;
      patternX < viewEnd;
      patternX += this.patternWidth
    ) {
      this.pattern.forEach((element) => {
        const absoluteX = this.x + element.x + patternX;

        if (!this.isInView(absoluteX, element.y)) return;

        const sprite = this.sprites[element.type];
        const elementWidth = sprite.width * 2;
        const elementHeight = sprite.height * 2;

        if (
          this.isCollidingWithCastle(
            absoluteX,
            element.y,
            elementWidth,
            elementHeight
          )
        )
          return;
        if (
          this.isCollidingWithBlocks(
            absoluteX,
            element.y,
            elementWidth,
            elementHeight
          )
        )
          return;

        ctx.drawImage(
          this.spriteSheet,
          sprite.x,
          sprite.y,
          sprite.width,
          sprite.height,
          absoluteX,
          element.y,
          elementWidth,
          elementHeight
        );
      });
    }
  }

  setGame(game) {
    this.game = game;
  }
}
