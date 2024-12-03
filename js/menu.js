class Story extends Sprite {
  constructor() {
    super();
    this.visible = false;
    this.width = 500;
    this.height = 200;
    
    // Position in center of viewport
    this.x = 150; 
    this.y = 140;
    
    // Sprite coordinates and source dimensions from tileset
    this.spriteX = 332;
    this.spriteY = 168;
    this.spriteWidth = 179;
    this.spriteHeight = 48;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/title-screen-3.png";
    
    this.storyText = [
      "The peaceful Mushroom Kingdom",
      "has been invaded by the evil",
      "Koopa clan, who turned all",
      "the kingdom's inhabitants",
      "into bricks and stones.",
      "",
      "Princess Peach has been",
      "kidnapped by Bowser!"
    ];
  }

  toggle() {
    this.visible = !this.visible;
  }

  update() {
    return false;
  }

  draw(ctx) {
    if (!this.visible || !this.spriteSheet.complete) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for HUD-style drawing

    // Draw the background sprite
    ctx.drawImage(
      this.spriteSheet,
      this.spriteX,
      this.spriteY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    // Draw story text
    ctx.font = '12px PressStart2P';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    this.storyText.forEach((line, index) => {
      ctx.fillText(line, this.x + this.width / 2, this.y + 50 + (index * 20));
    });

    ctx.restore();
  }
}