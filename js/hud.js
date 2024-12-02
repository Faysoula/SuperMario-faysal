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
    this.levelManager = null; // Initialize as null, will be set later
    

    // State machine for game over sequence
    this.state = {
      current: "PLAYING",
      frames: 0,
    };

    // Game over image
    this.gameOverImage = new Image();
    this.gameOverImage.src = "../images/gameover.jpg";
  }

  setLevelManager(levelManager) {
    this.levelManager = levelManager;
  }

  update(sprites, keys) {
    switch (this.state.current) {
      case "PLAYING":
        // Update player position for HUD
        const player = sprites.find((sprite) => sprite instanceof Player);
        if (player) {
          this.x = player.x;
          this.y = player.y;
        }

        // Update time
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
        break;

      case "GAME_OVER":
        // Count frames during game over
        this.state.frames++;

        // Wait 5 seconds (300 frames at 60fps)
        if (this.state.frames >= 300) {
          if (this.levelManager) {
            // Reset game state before restarting
            this.lives = 3;
            this.score = 0;
            this.coins = 0;
            this.time = 300;
            this.state.frames = 0;
            this.state.current = "PLAYING";

            // Force a complete level reload
            this.levelManager.restartLevel();
          }
        }
        break;
    }

    return false;
  }

  resetHUD() {
    this.score = 0;
    this.time = 300;
    this.coins = 0;
    this.lives = 3;
    this.lastUpdateTime = Date.now();
  }

  draw(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Handle different states
    if (this.state.current === "GAME_OVER") {
      this.drawGameOver(ctx);
    } else {
      this.drawHUD(ctx);
    }

    ctx.restore();
  }

  drawHUD(ctx) {
    // Background
    ctx.fillStyle = "#9494ff";
    ctx.fillRect(0, 0, ctx.canvas.width, 40);

    // Text setup
    ctx.font = "16px PressStart2P";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "top";

    // Score
    const scoreX = 40;
    ctx.textAlign = "left";
    ctx.fillText("SCORE", scoreX, 5);
    const scoreString = this.score.toString();
    let scoreNumberX = 77;
    if (scoreString.length >= 3) scoreNumberX = 60;
    if (scoreString.length >= 4) scoreNumberX = 55;
    ctx.fillText(scoreString, scoreNumberX, 22);

    // Time
    ctx.textAlign = "center";
    const timeX = ctx.canvas.width * 0.4;
    ctx.fillText("TIME", timeX, 5);
    ctx.fillText(this.time.toString(), timeX, 22);

    // Coins
    const coinsX = ctx.canvas.width * 0.6;
    ctx.fillText("COINS", coinsX, 5);
    ctx.fillText(this.coins.toString(), coinsX, 22);

    // Lives
    const livesX = ctx.canvas.width - 80;
    ctx.fillText("LIVES", livesX, 5);
    ctx.fillText(this.lives.toString(), livesX, 22);
  }

  drawGameOver(ctx) {
    if (this.gameOverImage.complete) {
      // Black background first
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Game over image
      ctx.drawImage(
        this.gameOverImage,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }
  }

  loseLife() {
    this.lives--;
    if (this.lives <= 0) {
      this.state.current = "GAME_OVER";
      this.state.frames = 0;
    }
  }

  addCoin() {
    this.coins++;
    this.addScore(200);
    if (this.coins >= 100) {
      this.coins = 0;
      this.addLife();
    }
  }

  addLife() {
    this.lives++;
  }

  addScore(points) {
    this.score += points;
  }
}
