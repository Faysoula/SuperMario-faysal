class Platform extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Sprite sheet setup
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/ground.png";

    // Tile size for ground blocks
    this.tileSize = 16;

    // Source coordinates for the ground tile
    this.groundTileX = 0;
    this.groundTileY = 16;
  }

  update() {
    return false;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    // Calculate how many tiles we need horizontally and vertically
    const tilesX = Math.ceil(this.width / 32); // 32 is the display size of each tile
    const tilesY = Math.ceil(this.height / 32);

    // Draw tiles in a grid
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        ctx.drawImage(
          this.spriteSheet,
          this.groundTileX, // Source X from tileset
          this.groundTileY, // Source Y from tileset
          this.tileSize, // Source width (16px in tileset)
          this.tileSize, // Source height (16px in tileset)
          this.x + x * 32, // Destination X (scaled up)
          this.y + y * 32, // Destination Y (scaled up)
          32, // Destination width (scaled up)
          32 // Destination height (scaled up)
        );
      }
    }
  }
}
