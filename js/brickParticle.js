class BrickParticle extends Sprite {
  constructor(x, y, direction, isUnderground = false) {
    super();
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/items.png";

    // Sprite coordinates based on isUnderground
    if (isUnderground) {
      this.sourceX = 180;
      this.sourceY = 134; // Underground Y coordinate
    } else {
      this.sourceX = 180;
      this.sourceY = 26; // Overworld Y coordinate
    }

    // Physics properties
    this.velocityX = direction * 4; // direction: 1 for right, -1 for left
    this.velocityY = -8; // Initial upward velocity
    this.gravity = 0.5;
    this.rotation = 0;
    this.rotationSpeed = direction * 10; // Rotate based on direction

    // Lifetime management
    this.lifetime = 60; // Frames the particle will exist
    this.currentLife = 0;
  }

  update() {
    // Update position
    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Update rotation
    this.rotation += this.rotationSpeed;

    // Update lifetime
    this.currentLife++;

    // Return true when particle should be removed
    return this.currentLife >= this.lifetime;
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    ctx.save();

    // Set rotation center to middle of particle
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Draw the particle
    ctx.drawImage(
      this.spriteSheet,
      this.sourceX,
      this.sourceY,
      8,
      8,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }
}
