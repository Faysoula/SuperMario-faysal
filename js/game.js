class Sprite {
  constructor() {}

  update() {}

  draw(ctx) {}
}

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
    this.keys = {}; // Store active keys
    this.camera = new Camera(this.canvas);
    this.bindKeyboardEvents();
  }

  setLevelBoundaries(width, height) {
    this.camera.setLevelBoundaries(width, height);
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }
  update() {
    let updatedSprites = [];
    let player = null; // Declare player variable first

    for (let i = 0; i < this.sprites.length; i++) {
      let sprite = this.sprites[i];

      if (sprite instanceof Player) {
        player = sprite; 
      }

      if (!sprite.update(this.sprites, this.keys)) {
        updatedSprites.push(sprite);
      }
    }

    // Update camera position based on player
    this.camera.update(player);

    this.sprites = updatedSprites;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.camera.begin(this.ctx);

    this.sprites.forEach((sprite) => {
      if (this.camera.isVisible(sprite)) {
        sprite.draw(this.ctx);
      }
    });

    this.camera.end(this.ctx);
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  bindKeyboardEvents() {
    // Handle keydown event
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true; // Mark the key as active
    });

    // Handle keyup event
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false; // Mark the key as inactive
    });
  }
}
