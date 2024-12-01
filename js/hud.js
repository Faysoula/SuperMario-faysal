class HUD extends Sprite {
  constructor() {
    super();
    this.score = 0;
    this.time = 300;
    this.coins = 0;
    this.lives = 3;
    this.lastUpdateTime = Date.now();
    this.width = 800;
    this.height = 40;
    this.x = 0;
    this.y = 0;
  }

  update(sprites) {
    const player = sprites.find((sprite) => sprite instanceof Player);
    if (player) {
      this.x = player.x;
      this.y = player.y;
    }

    // Prevent HUD from blinking during death
    if (player && player.isDying) {
      this.x = 0;
      this.y = 0;
    }

    // Time update logic
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime >= 1000 && this.time > 0) {
      this.time--;
      this.lastUpdateTime = currentTime;

      if (this.time <= 0) {
        sprites.forEach((sprite) => {
          if (sprite instanceof Player) {
            sprite.die();
          }
        });
      }
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Background
    ctx.fillStyle = "#9494ff";
    ctx.fillRect(0, 0, ctx.canvas.width, 40);

    // Text setup
    ctx.font = "16px PressStart2P";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "top";

    // Score (left-aligned, just the number without padding)
    const scoreX = 40;
    ctx.textAlign = "left";
    ctx.fillText("SCORE", scoreX, 5);

    // Adjust score number position based on digits
    const scoreString = this.score.toString();
    let scoreNumberX = 77;
    if (scoreString.length >= 3) {
      scoreNumberX = 60; // Shift left a bit for 3+ digits
    }
    if (scoreString.length >= 4) {
      scoreNumberX = 55; // Shift more for 4+ digits
    }
    ctx.fillText(scoreString, scoreNumberX, 22);

    // Time (centered)
    ctx.textAlign = "center";
    const timeX = ctx.canvas.width * 0.4;
    ctx.fillText("TIME", timeX, 5);
    ctx.fillText(this.time.toString(), timeX, 22);

    // Coins (centered, no leading zero)
    const coinsX = ctx.canvas.width * 0.6;
    ctx.fillText("COINS", coinsX, 5);
    ctx.fillText(this.coins.toString(), coinsX, 22);

    // Lives (centered)
    const livesX = ctx.canvas.width - 80;
    ctx.fillText("LIVES", livesX, 5);
    ctx.fillText(this.lives.toString(), livesX, 22);

    ctx.restore();
  }

  padNumber(num, length) {
    return num.toString().padStart(length, "0");
  }

  addCoin() {
    this.coins++;
    this.addScore(200);

    // Check for extra life
    if (this.coins >= 100) {
      this.coins = 0; // Reset coin counter
      this.addLife();
    }
  }

  addLife() {
    this.lives++;
  }

  loseLife() {
    this.lives--;
  }

  addScore(points) {
    this.score += points;
  }
}
