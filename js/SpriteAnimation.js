class SpriteAnimation {
  constructor(spriteSheet, frameWidth = 24, frameHeight = 24) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDelay = 10; // Frames to wait before changing animation frame

    this.states = {
      idleRight: {
        frames: [{ x: 209, y: 0 }],
        loop: false,
      },
      idleLeft: {
        frames: [{ x: 179, y: 0 }],
        loop: false,
      },
      walkRight: {
        frames: [
          { x: 299, y: 0 },
          { x: 269, y: 0 },
          { x: 239, y: 0 },
        ],
        loop: true,
        frameDelay: 8,
      },
      walkLeft: {
        frames: [
          { x: 88, y: 0 },
          { x: 119, y: 0 },
          { x: 149, y: 0 },
        ],
        loop: true,
        frameDelay: 8,
      },
      jumpRight: {
        frames: [{ x: 358, y: 0 }],
        loop: false,
      },
      jumpLeft: {
        frames: [{ x: 29, y: 0 }],
        loop: false,
      },
      turnRight: {
        frames: [{ x: 329, y: 0 }],
        loop: false,
      },
      turnLeft: {
        frames: [{ x: 60, y: 0 }],
        loop: false,
      },
    };

    this.currentState = "idleRight";
  }

  setState(state) {
    if (this.currentState !== state) {
      this.currentState = state;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  }

  update() {
    const currentAnim = this.states[this.currentState];
    if (!currentAnim || !currentAnim.frames.length) return;

    if (currentAnim.loop) {
      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % currentAnim.frames.length;
      }
    }
  }

  draw(ctx, x, y, width, height) {
    const currentAnim = this.states[this.currentState];
    if (!currentAnim || !currentAnim.frames[this.currentFrame]) return;

    const frame = currentAnim.frames[this.currentFrame];
    ctx.drawImage(
      this.spriteSheet,
      frame.x,
      frame.y,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      width,
      height
    );
  }
}