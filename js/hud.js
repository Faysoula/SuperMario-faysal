class HUD extends Sprite {
  constructor() {
    super();
    this.score = 0;
    this.time = 300 ;
    this.coins = 0;
    this.lives = 3;
    this.lastUpdateTime = Date.now();
    this.width = 800;
    this.height = 40;
    this.x = 0;
    this.y = 0;
    this.levelManager = null;

    this.state = {
      current: "PLAYING",
      frames: 0,
      deathType: null, // Will be either "TIME_UP" or "GAME_OVER"
    };

    // Game state images
    this.gameOverImage = new Image();
    this.gameOverImage.src = "../images/gameover.jpg";
    this.timeUpImage = new Image();
    this.timeUpImage.src = "../images/timeup.png";

    // State transition timing
    this.timeUpDuration = 120;
    this.deathDelay = 70;
    this.gameOverDuration = 300;
    
  }

  setLevelManager(levelManager) {
    this.levelManager = levelManager;
  }

  update(sprites) {
    switch (this.state.current) {
      case "PLAYING":
        const player = sprites.find((sprite) => sprite instanceof Player);
        if (player) {
          this.x = player.x;
          this.y = player.y;
        }

        const currentTime = Date.now();
        if (currentTime - this.lastUpdateTime >= 1000 && this.time > 0) {
          this.time--;
          this.lastUpdateTime = currentTime;

          if (this.time <= 0) {
            this.state.current = "DEATH_ANIMATION";
            this.state.frames = 0;
            this.state.deathType = "TIME_UP";
            sprites.forEach((sprite) => {
              if (sprite instanceof Player) {
                sprite.die();
              }
            });
          }
        }
        break;

      case "DEATH_ANIMATION":
        this.state.frames++;
        if (this.state.frames >= this.deathDelay) {
          this.state.current = this.state.deathType;
          this.state.frames = 0;
        }
        break;

      case "TIME_UP":
        this.state.frames++;
        if (this.state.frames >= this.timeUpDuration) {
          if (this.lives > 0) {
            this.state.current = "PLAYING";
            this.time = 300;
            this.lastUpdateTime = Date.now();
            if (this.levelManager) {
              this.levelManager.restartLevel();
            }
          } else {
            this.state.current = "GAME_OVER";
          }
          this.state.frames = 0;
        }
        break;

      case "GAME_OVER":
        this.state.frames++;
        if (this.state.frames >= this.gameOverDuration) {
          if (this.levelManager) {
            this.lives = 3;
            this.score = 0;
            this.coins = 0;
            this.time = 300;
            this.state.current = "PLAYING";
            this.state.frames = 0;
            this.levelManager.restartLevel();
          }
        }
        break;
    }

    return false;
  }

  draw(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    switch (this.state.current) {
      case "PLAYING":
      case "DEATH_ANIMATION":
        this.drawHUD(ctx);
        break;

      case "TIME_UP":
        if (this.timeUpImage.complete) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(
            this.timeUpImage,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
        }
        break;

      case "GAME_OVER":
        if (this.gameOverImage.complete) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(
            this.gameOverImage,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
        }
        break;
    }

    ctx.restore();
  }

  drawHUD(ctx) {
    let isunderground = this.levelManager?.isUnderground;
    if (isunderground) {
      ctx.fillStyle = "#000000";
    } else {
    ctx.fillStyle = "#6b8cff";
    }
    ctx.fillRect(0, 0, ctx.canvas.width, 40);

    ctx.font = "16px PressStart2P";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "top";

    const scoreX = 40;
    ctx.textAlign = "left";
    ctx.fillText("SCORE", scoreX, 5);
    const scoreString = this.score.toString();
    let scoreNumberX = 77;
    if (scoreString.length >= 3) scoreNumberX = 60;
    if (scoreString.length >= 4) scoreNumberX = 55;
    ctx.fillText(scoreString, scoreNumberX, 22);

    const timeX = ctx.canvas.width * 0.4;
    ctx.textAlign = "center";
    ctx.fillText("TIME", timeX, 5);
    ctx.fillText(this.time.toString(), timeX, 22);

    const coinsX = ctx.canvas.width * 0.6;
    ctx.fillText("COINS", coinsX, 5);
    ctx.fillText(this.coins.toString(), coinsX, 22);

    const livesX = ctx.canvas.width - 80;
    ctx.fillText("LIVES", livesX, 5);
    ctx.fillText(this.lives.toString(), livesX, 22);
  }

  loseLife() {
    this.lives--;
    if (this.lives <= 0) {
      this.state.current = "DEATH_ANIMATION";
      this.state.frames = 0;
      this.state.deathType = "GAME_OVER";
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

  resetHUD() {
    this.score = 0;
    this.time = 300;
    this.coins = 0;
    this.lives = 3;
    this.lastUpdateTime = Date.now();
    this.state.current = "PLAYING";
    this.state.frames = 0;
    this.state.deathType = null;
  }
}
