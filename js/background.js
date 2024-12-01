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

    // Single pattern definition
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

    this.groundSegments = [
      { start: 0, end: 2048 },
      { start: 2118, end: 2118 + 477 },
      { start: 2694, end: 2694 + 1700 },
      { start: 4486, end: 4486 + 2000 },
    ];

    this.patternWidth = 1500; // Adjusted pattern width
    this.lastDrawnBushPositions = new Map();
  }

  isPositionOverGround(x) {
    return this.groundSegments.some(
      (segment) => x >= segment.start && x <= segment.end
    );
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

  isTooCloseToLastBush(type, x) {
    const lastPos = this.lastDrawnBushPositions.get(type);
    if (!lastPos) return false;
    const minDistance = type === "bush3" ? 200 : 150;
    return Math.abs(x - lastPos) < minDistance;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;
    this.lastDrawnBushPositions.clear();

    const totalPatterns = Math.ceil(this.width / this.patternWidth);

    for (let i = 0; i < totalPatterns; i++) {
      const patternOffset = i * this.patternWidth;

      this.pattern.forEach((element) => {
        const absoluteX = this.x + element.x + patternOffset;
        const sprite = this.sprites[element.type];
        const elementWidth = sprite.width * 2;
        const elementHeight = sprite.height * 2;

        // Skip if element would overlap with castle
        if (
          this.isCollidingWithCastle(
            absoluteX,
            element.y,
            elementWidth,
            elementHeight
          )
        ) {
          return;
        }

        // Skip if element would overlap with blocks
        if (
          this.isCollidingWithBlocks(
            absoluteX,
            element.y,
            elementWidth,
            elementHeight
          )
        ) {
          return;
        }

        // Ground-based elements check
        if (element.y > 300) {
          if (!this.isPositionOverGround(absoluteX)) {
            return;
          }

          // Bush spacing check
          if (element.type.includes("bush")) {
            if (this.isTooCloseToLastBush(element.type, absoluteX)) {
              return;
            }
            this.lastDrawnBushPositions.set(element.type, absoluteX);
          }
        }

        // Draw the element
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
