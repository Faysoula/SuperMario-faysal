class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 0;
    this.levels = [];
    this.levelState = "PLAYING"; // PLAYING, TRANSITIONING, COMPLETED
    this.hud = new HUD();
    this.hud.setLevelManager(this);
    this.isUnderground = false;
    this.transitionTimer = 0;
    this.transitionDuration = 60;
  }

  loadLevel(levelIndex) {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      this.isUnderground = levelIndex === 1;
      this.game.sprites = [];
      const levelData = this.levels[levelIndex];
      this.currentLevel = levelIndex;

      if (this.isUnderground) {
        this.game.canvas.style.backgroundColor = "#000000";
      } else {
        this.game.canvas.style.backgroundColor = "#6B8CFF";
      }

      this.game.setLevelBoundaries(levelData.width, levelData.height);
      this.game.camera.reset();

      if (!this.isUnderground) {
        const background = new Background(0, 0);
        background.setGame(this.game);
        this.game.addSprite(background);
      }

      const player = new Player(
        levelData.playerSpawn.x,
        levelData.playerSpawn.y,
        this.game.camera
      );
      player.setLevelManager(this);
      player.spawnX = levelData.playerSpawn.x;
      player.spawnY = levelData.playerSpawn.y;
      this.game.addSprite(player);

      // Load level elements
      this.loadLevelElements(levelData);

      this.game.addSprite(this.hud);
      this.levelState = "PLAYING";
    }
  }

  loadLevelElements(levelData) {
    // Load ground segments
    levelData.groundSegments?.forEach((segment) => {
      const ground = new Platform(
        segment.x,
        segment.y || this.game.canvas.height - segment.height,
        segment.width,
        segment.height,
        this.isUnderground
      );
      this.game.addSprite(ground);
    });

    // Load other elements
    this.loadBlocks(levelData.blocks);
    this.loadPipes(levelData.pipes);
    this.loadEnemies(levelData.enemies);
    this.loadLevelEnd(levelData.levelEnd);
    this.loadCoins(levelData.coins);
    this.loadMovingPlatforms(levelData.movingPlatforms);
  }

  loadBlocks(blocks) {
    blocks?.forEach((block) => {
      const newBlock = new Block(
        block.x,
        block.y,
        block.type,
        block.content,
        this.isUnderground
      );
      this.game.addSprite(newBlock);
    });
  }

  loadPipes(pipes) {
    pipes?.forEach((pipe) => {
      const newPipe = new Pipe(pipe.x, pipe.y, pipe.size);
      this.game.addSprite(newPipe);
    });
  }

  loadEnemies(enemies) {
    enemies?.forEach((enemy) => {
      if (enemy.type === "goomba") {
        const goomba = new Goomba(enemy.x, enemy.y, this.isUnderground);
        this.game.addSprite(goomba);
      }
    });
  }

  loadLevelEnd(levelEnd) {
    if (levelEnd?.flagpole) {
      const flagpole = new FlagPole(levelEnd.flagpole.x, levelEnd.flagpole.y);
      this.game.addSprite(flagpole);
    }

    if (levelEnd?.castle) {
      const castle = new Castle(levelEnd.castle.x, levelEnd.castle.y);
      castle.setLevelManager(this);
      this.game.addSprite(castle);
    }
  }

  loadCoins(coins) {
    coins?.forEach((coinData) => {
      const coin = new Coin(coinData.x, coinData.y, false);
      this.game.addSprite(coin);
    });
  }

  loadMovingPlatforms(platforms) {
    platforms?.forEach((platform) => {
      const newPlatform = new MovingPlatform(platform.x, platform.y);
      this.game.addSprite(newPlatform);
    });
  }

  startLevelTransition() {
    if (this.levelState === "PLAYING") {
      this.levelState = "TRANSITIONING";
      this.transitionTimer = 0;
    }
  }

  update() {
    switch (this.levelState) {
      case "PLAYING":
        break;

      case "TRANSITIONING":
        this.transitionTimer++;
        if (this.transitionTimer >= this.transitionDuration) {
          this.nextLevel();
        }
        break;

      case "COMPLETED":
        break;
    }
  }

  nextLevel() {
    if (this.currentLevel < this.levels.length - 1) {
      // Clear all sprites except HUD
      this.game.sprites = this.game.sprites.filter(
        (sprite) => sprite instanceof HUD
      );

      // Load the next level
      this.loadLevel(this.currentLevel + 1);

      // Reset states
      this.levelState = "PLAYING";
      this.transitionTimer = 0;
    }
  }

  defineLevels() {
    this.levels.push({
      id: "1-1",
      width: 5945,
      height: 480,
      playerSpawn: { x: 81, y: 380 },

      groundSegments: [
        { x: 0, width: 2048, height: 32 }, // First ground section until first gap
        { x: 2118, width: 477, height: 32 }, // Ground after first gap
        { x: 2694, width: 1700, height: 32 }, // Middle section
        { x: 4486, width: 2000, height: 32 },
      ],

      blocks: [
        { x: 511, y: 272, type: "question" },
        { x: 575, y: 272, type: "brick" },
        { x: 605, y: 272, type: "question", content: "mushroom" },
        { x: 635, y: 272, type: "brick" },
        { x: 665, y: 272, type: "question" },
        { x: 695, y: 272, type: "brick" },
        { x: 635, y: 144, type: "question" },
        //after first gap
        { x: 2280, y: 320, type: "brick" },
        { x: 2310, y: 320, type: "question", content: "mushroom" },
        { x: 2340, y: 320, type: "brick" },
        { x: 2370, y: 320, type: "brick" },
        { x: 2400, y: 220, type: "brick" },
        { x: 2430, y: 220, type: "brick" },
        { x: 2460, y: 220, type: "brick" },
        { x: 2490, y: 220, type: "brick" },
        { x: 2520, y: 220, type: "brick" },
        { x: 2550, y: 220, type: "brick" },
        { x: 2580, y: 220, type: "brick" },

        // New section blocks
        { x: 2740, y: 233, type: "brick" },
        { x: 2770, y: 233, type: "brick" },
        { x: 2800, y: 233, type: "brick" },
        { x: 2830, y: 233, type: "question" },
        { x: 2830, y: 320, type: "brick" },
        { x: 2990, y: 320, type: "brick" },
        { x: 3020, y: 320, type: "brick" },
        { x: 3147, y: 320, type: "question" },
        { x: 3213, y: 320, type: "question" },
        { x: 3279, y: 320, type: "question" },
        { x: 3213, y: 224, type: "question", content: "mushroom" }, // 3023 + 190
        { x: 3438, y: 320, type: "brick" },
        { x: 3500, y: 224, type: "brick" },
        { x: 3530, y: 224, type: "brick" },
        { x: 3560, y: 224, type: "brick" },
        { x: 3686, y: 224, type: "brick" },
        { x: 3716, y: 224, type: "question" },
        { x: 3746, y: 224, type: "question" },
        { x: 3776, y: 224, type: "brick" },
        { x: 3707, y: 324, type: "brick" },
        { x: 3737, y: 324, type: "brick" },

        // First staircase
        { x: 3874, y: 416, type: "stair" },
        { x: 3906, y: 416, type: "stair" },
        { x: 3938, y: 416, type: "stair" },
        { x: 3971, y: 416, type: "stair" },
        { x: 3908, y: 384, type: "stair" },
        { x: 3940, y: 384, type: "stair" },
        { x: 3972, y: 384, type: "stair" },
        { x: 3940, y: 352, type: "stair" },
        { x: 3972, y: 352, type: "stair" },
        { x: 3972, y: 320, type: "stair" },

        // Next staircase
        { x: 4036, y: 416, type: "stair" },
        { x: 4068, y: 416, type: "stair" },
        { x: 4100, y: 416, type: "stair" },
        { x: 4132, y: 416, type: "stair" },
        { x: 4036, y: 384, type: "stair" },
        { x: 4068, y: 384, type: "stair" },
        { x: 4100, y: 384, type: "stair" },
        { x: 4036, y: 352, type: "stair" },
        { x: 4068, y: 352, type: "stair" },
        { x: 4036, y: 320, type: "stair" },

        // Bigger staircase
        { x: 4260, y: 416, type: "stair" },
        { x: 4292, y: 416, type: "stair" },
        { x: 4324, y: 416, type: "stair" },
        { x: 4356, y: 416, type: "stair" },
        { x: 4388, y: 416, type: "stair" },
        { x: 4292, y: 384, type: "stair" },
        { x: 4324, y: 384, type: "stair" },
        { x: 4356, y: 384, type: "stair" },
        { x: 4388, y: 384, type: "stair" },
        { x: 4324, y: 352, type: "stair" },
        { x: 4356, y: 352, type: "stair" },
        { x: 4388, y: 352, type: "stair" },
        { x: 4356, y: 320, type: "stair" },
        { x: 4388, y: 320, type: "stair" },

        // Final staircases
        { x: 4484, y: 416, type: "stair" },
        { x: 4516, y: 416, type: "stair" },
        { x: 4548, y: 416, type: "stair" },
        { x: 4580, y: 416, type: "stair" },
        { x: 4484, y: 384, type: "stair" },
        { x: 4516, y: 384, type: "stair" },
        { x: 4548, y: 384, type: "stair" },
        { x: 4484, y: 352, type: "stair" },
        { x: 4516, y: 352, type: "stair" },
        { x: 4484, y: 320, type: "stair" },

        { x: 4796, y: 272, type: "brick" },
        { x: 4826, y: 272, type: "brick" },
        { x: 4856, y: 272, type: "question" },
        { x: 4886, y: 272, type: "brick" },

        // Final staircase
        { x: 5205, y: 416, type: "stair" },
        { x: 5237, y: 416, type: "stair" },
        { x: 5269, y: 416, type: "stair" },
        { x: 5301, y: 416, type: "stair" },
        { x: 5333, y: 416, type: "stair" },
        { x: 5365, y: 416, type: "stair" },
        { x: 5397, y: 416, type: "stair" },
        { x: 5429, y: 416, type: "stair" },
        { x: 5461, y: 416, type: "stair" },

        { x: 5237, y: 384, type: "stair" },
        { x: 5269, y: 384, type: "stair" },
        { x: 5301, y: 384, type: "stair" },
        { x: 5333, y: 384, type: "stair" },
        { x: 5365, y: 384, type: "stair" },
        { x: 5397, y: 384, type: "stair" },
        { x: 5429, y: 384, type: "stair" },
        { x: 5461, y: 384, type: "stair" },

        { x: 5269, y: 352, type: "stair" },
        { x: 5301, y: 352, type: "stair" },
        { x: 5333, y: 352, type: "stair" },
        { x: 5365, y: 352, type: "stair" },
        { x: 5397, y: 352, type: "stair" },
        { x: 5429, y: 352, type: "stair" },
        { x: 5461, y: 352, type: "stair" },

        { x: 5301, y: 320, type: "stair" },
        { x: 5333, y: 320, type: "stair" },
        { x: 5365, y: 320, type: "stair" },
        { x: 5397, y: 320, type: "stair" },
        { x: 5429, y: 320, type: "stair" },
        { x: 5461, y: 320, type: "stair" },

        { x: 5333, y: 288, type: "stair" },
        { x: 5365, y: 288, type: "stair" },
        { x: 5397, y: 288, type: "stair" },
        { x: 5429, y: 288, type: "stair" },
        { x: 5461, y: 288, type: "stair" },

        { x: 5365, y: 256, type: "stair" },
        { x: 5397, y: 256, type: "stair" },
        { x: 5429, y: 256, type: "stair" },
        { x: 5461, y: 256, type: "stair" },

        { x: 5397, y: 224, type: "stair" },
        { x: 5429, y: 224, type: "stair" },
        { x: 5461, y: 224, type: "stair" },

        { x: 5429, y: 192, type: "stair" },
        { x: 5461, y: 192, type: "stair" },

        { x: 5588, y: 416, type: "stair" },
      ],

      levelEnd: {
        flagpole: { x: 5602, y: 128 }, // 5412 + 190
        castle: { x: 5712, y: 288 }, // 5522 + 190
      },

      // Pipe placements - shifted by 255
      pipes: [
        { x: 895, y: 387, size: "small" },
        { x: 1216, y: 354, size: "medium" },
        { x: 1471, y: 320, size: "large" },
        { x: 1825, y: 320, size: "large" },
        { x: 4742, y: 387, size: "small" }, // Changed from 4506 to 4742 (4486 + 256)
        { x: 5120, y: 387, size: "small" },
      ],

      // Enemy placements - shifted by 255
      enemies: [
        { type: "goomba", x: 635, y: 368 },
        { type: "goomba", x: 1220, y: 320 },
        { type: "goomba", x: 1517, y: 320 },
        { type: "goomba", x: 1445, y: 320 },
      ],
    });

    this.levels.push({
      id: "1-2",
      width: 5392,
      height: 480,
      playerSpawn: { x: 72, y: -32 }, // Start Mario above screen

      // Define required arrays even if empty
      groundSegments: [
        { x: 0, width: 2503, height: 32 }, // Full ground
        { x: 2954, width: 1250, height: 32 },
        { x: 4304, width: 60, height: 32 },
        { x: 4600, width: 1000, height: 32 },
      ],
      blocks: [
        // Left wall blocks
        { x: 0, y: 418, type: "brick" },
        { x: 0, y: 388, type: "brick" },
        { x: 0, y: 358, type: "brick" },
        { x: 0, y: 328, type: "brick" },
        { x: 0, y: 298, type: "brick" },
        { x: 0, y: 268, type: "brick" },
        { x: 0, y: 238, type: "brick" },
        { x: 0, y: 208, type: "brick" },
        { x: 0, y: 178, type: "brick" },
        { x: 0, y: 148, type: "brick" },
        { x: 0, y: 118, type: "brick" },
        { x: 0, y: 88, type: "brick" },
        { x: 0, y: 58, type: "brick" },
        { x: 0, y: 28, type: "brick" },
        { x: 0, y: 0, type: "brick" },

        // Ceiling blocks starting 160px from first block
        { x: 160, y: 0, type: "brick" },
        { x: 190, y: 0, type: "brick" },
        { x: 220, y: 0, type: "brick" },
        { x: 250, y: 0, type: "brick" },
        { x: 280, y: 0, type: "brick" },
        { x: 310, y: 0, type: "brick" },
        { x: 340, y: 0, type: "brick" },
        { x: 370, y: 0, type: "brick" },
        { x: 400, y: 0, type: "brick" },
        { x: 430, y: 0, type: "brick" },
        { x: 460, y: 0, type: "brick" },
        { x: 490, y: 0, type: "brick" },
        { x: 520, y: 0, type: "brick" },
        { x: 550, y: 0, type: "brick" },

        { x: 160, y: 58, type: "brick" },
        { x: 190, y: 58, type: "brick" },
        { x: 220, y: 58, type: "brick" },
        { x: 250, y: 58, type: "brick" },
        { x: 280, y: 58, type: "brick" },
        { x: 310, y: 58, type: "brick" },
        { x: 340, y: 58, type: "brick" },
        { x: 370, y: 58, type: "brick" },
        { x: 400, y: 58, type: "brick" },
        { x: 430, y: 58, type: "brick" },
        { x: 460, y: 58, type: "brick" },
        { x: 490, y: 58, type: "brick" },
        { x: 520, y: 58, type: "brick" },
        { x: 550, y: 58, type: "brick" },
        { x: 580, y: 58, type: "brick" },
        { x: 610, y: 58, type: "brick" },
        { x: 640, y: 58, type: "brick" },
        { x: 670, y: 58, type: "brick" },
        { x: 700, y: 58, type: "brick" },
        { x: 730, y: 58, type: "brick" },
        { x: 760, y: 58, type: "brick" },
        { x: 790, y: 58, type: "brick" },
        { x: 820, y: 58, type: "brick" },
        { x: 850, y: 58, type: "brick" },
        { x: 880, y: 58, type: "brick" },
        { x: 910, y: 58, type: "brick" },
        { x: 940, y: 58, type: "brick" },
        { x: 970, y: 58, type: "brick" },
        { x: 1000, y: 58, type: "brick" },
        { x: 1030, y: 58, type: "brick" },
        { x: 1060, y: 58, type: "brick" },
        { x: 1090, y: 58, type: "brick" },
        { x: 1120, y: 58, type: "brick" },
        { x: 1150, y: 58, type: "brick" },
        { x: 1180, y: 58, type: "brick" },
        { x: 1210, y: 58, type: "brick" },
        { x: 1240, y: 58, type: "brick" },
        { x: 1270, y: 58, type: "brick" },
        { x: 1300, y: 58, type: "brick" },
        { x: 1330, y: 58, type: "brick" },
        { x: 1360, y: 58, type: "brick" },
        { x: 1390, y: 58, type: "brick" },
        { x: 1420, y: 58, type: "brick" },
        { x: 1450, y: 58, type: "brick" },
        { x: 1480, y: 58, type: "brick" },
        { x: 1510, y: 58, type: "brick" },
        { x: 1540, y: 58, type: "brick" },
        { x: 1570, y: 58, type: "brick" },
        { x: 1600, y: 58, type: "brick" },
        { x: 1630, y: 58, type: "brick" },
        { x: 1660, y: 58, type: "brick" },
        { x: 1690, y: 58, type: "brick" },
        { x: 1700, y: 58, type: "brick" },
        { x: 1730, y: 58, type: "brick" },
        { x: 1760, y: 58, type: "brick" },
        { x: 1790, y: 58, type: "brick" },
        { x: 1820, y: 58, type: "brick" },
        { x: 1850, y: 58, type: "brick" },
        { x: 1880, y: 58, type: "brick" },
        { x: 1910, y: 58, type: "brick" },
        { x: 1940, y: 58, type: "brick" },
        { x: 1970, y: 58, type: "brick" },
        { x: 2000, y: 58, type: "brick" },
        { x: 2030, y: 58, type: "brick" },
        { x: 2060, y: 58, type: "brick" },
        { x: 2090, y: 58, type: "brick" },
        { x: 2120, y: 58, type: "brick" },
        { x: 2150, y: 58, type: "brick" },
        { x: 2180, y: 58, type: "brick" },
        { x: 2210, y: 58, type: "brick" },
        { x: 2240, y: 58, type: "brick" },
        { x: 2270, y: 58, type: "brick" },
        { x: 2300, y: 58, type: "brick" },
        { x: 2330, y: 58, type: "brick" },
        { x: 2360, y: 58, type: "brick" },
        { x: 2390, y: 58, type: "brick" },
        { x: 2420, y: 58, type: "brick" },
        { x: 2450, y: 58, type: "brick" },
        { x: 2480, y: 58, type: "brick" },
        { x: 2500, y: 58, type: "brick" },
        // Ceiling blocks continued from 2500 to 4000
        { x: 2530, y: 58, type: "brick" },
        { x: 2560, y: 58, type: "brick" },
        { x: 2590, y: 58, type: "brick" },
        { x: 2620, y: 58, type: "brick" },
        { x: 2650, y: 58, type: "brick" },
        { x: 2680, y: 58, type: "brick" },
        { x: 2710, y: 58, type: "brick" },
        { x: 2740, y: 58, type: "brick" },
        { x: 2770, y: 58, type: "brick" },
        { x: 2800, y: 58, type: "brick" },
        { x: 2830, y: 58, type: "brick" },
        { x: 2860, y: 58, type: "brick" },
        { x: 2890, y: 58, type: "brick" },
        { x: 2920, y: 58, type: "brick" },
        { x: 2950, y: 58, type: "brick" },
        { x: 2980, y: 58, type: "brick" },
        { x: 3010, y: 58, type: "brick" },
        { x: 3040, y: 58, type: "brick" },
        { x: 3070, y: 58, type: "brick" },
        { x: 3100, y: 58, type: "brick" },
        { x: 3130, y: 58, type: "brick" },
        { x: 3160, y: 58, type: "brick" },
        { x: 3190, y: 58, type: "brick" },
        { x: 3220, y: 58, type: "brick" },
        { x: 3250, y: 58, type: "brick" },
        { x: 3280, y: 58, type: "brick" },
        { x: 3310, y: 58, type: "brick" },
        { x: 3340, y: 58, type: "brick" },
        { x: 3370, y: 58, type: "brick" },
        { x: 3400, y: 58, type: "brick" },
        { x: 3430, y: 58, type: "brick" },
        { x: 3460, y: 58, type: "brick" },
        { x: 3490, y: 58, type: "brick" },
        { x: 3520, y: 58, type: "brick" },
        { x: 3550, y: 58, type: "brick" },
        { x: 3580, y: 58, type: "brick" },
        { x: 3610, y: 58, type: "brick" },
        { x: 3640, y: 58, type: "brick" },
        { x: 3670, y: 58, type: "brick" },
        { x: 3700, y: 58, type: "brick" },
        { x: 3730, y: 58, type: "brick" },
        { x: 3760, y: 58, type: "brick" },
        { x: 3790, y: 58, type: "brick" },
        { x: 3820, y: 58, type: "brick" },
        { x: 3850, y: 58, type: "brick" },
        { x: 3880, y: 58, type: "brick" },
        { x: 3910, y: 58, type: "brick" },
        { x: 3940, y: 58, type: "brick" },
        { x: 3970, y: 58, type: "brick" },
        { x: 4000, y: 58, type: "brick" },

        // Question blocks row (250px right of Mario, 105px above ground)
        { x: 320, y: 343, type: "question", content: "mushroom" }, // First with mushroom
        { x: 350, y: 343, type: "question" },
        { x: 380, y: 343, type: "question" },
        { x: 410, y: 343, type: "question" },
        { x: 440, y: 343, type: "question" },

        // Stair sequence starting at x: 542
        // First stack (1 block)
        { x: 543, y: 416, type: "stair" },

        // Second stack (2 blocks) at x: 572
        { x: 607, y: 416, type: "stair" },
        { x: 607, y: 384, type: "stair" },

        // Third stack (3 blocks) at x: 602
        { x: 671, y: 416, type: "stair" },
        { x: 671, y: 384, type: "stair" },
        { x: 671, y: 352, type: "stair" },

        { x: 735, y: 416, type: "stair" },
        { x: 735, y: 384, type: "stair" },
        { x: 735, y: 352, type: "stair" },
        { x: 735, y: 320, type: "stair" },

        { x: 799, y: 416, type: "stair" },
        { x: 799, y: 384, type: "stair" },
        { x: 799, y: 352, type: "stair" },
        { x: 799, y: 320, type: "stair" },

        { x: 863, y: 416, type: "stair" },
        { x: 927, y: 292, type: "brick" },
        { x: 863, y: 384, type: "stair" },
        { x: 863, y: 352, type: "stair" },

        { x: 991, y: 416, type: "stair" },
        { x: 991, y: 384, type: "stair" },
        { x: 991, y: 352, type: "stair" },

        { x: 1055, y: 416, type: "stair" },
        { x: 1055, y: 384, type: "stair" },

        { x: 1216, y: 266, type: "brick" },
        { x: 1216, y: 296, type: "brick" },
        { x: 1216, y: 326, type: "brick" },

        // Horizontal row of 3 from bottom
        { x: 1246, y: 326, type: "brick" },
        { x: 1276, y: 326, type: "brick" },
        { x: 1306, y: 326, type: "brick" },

        // Up 2 from last block
        { x: 1306, y: 296, type: "brick" },
        { x: 1306, y: 266, type: "brick" },

        // Right 3 from top
        { x: 1336, y: 266, type: "brick" },
        { x: 1366, y: 266, type: "brick" },
        { x: 1396, y: 266, type: "brick" },

        // Down 2 from last block
        { x: 1396, y: 296, type: "brick" },
        { x: 1396, y: 326, type: "brick" },

        // Right 3 from bottom
        { x: 1426, y: 326, type: "brick" },
        { x: 1456, y: 326, type: "brick" },
        { x: 1486, y: 326, type: "brick" },

        // Up 2 from last block
        { x: 1486, y: 296, type: "brick" },
        { x: 1486, y: 266, type: "brick" },

        { x: 1663, y: 326, type: "brick" }, // Bottom block
        { x: 1663, y: 296, type: "brick" }, // Second from bottom
        { x: 1663, y: 266, type: "brick" }, // Middle block
        { x: 1663, y: 236, type: "brick" }, // Second from top
        { x: 1663, y: 206, type: "brick" }, // Top block
        { x: 1663, y: 176, type: "brick" }, // Top block
        { x: 1693, y: 146, type: "brick" }, // Top block
        { x: 1663, y: 146, type: "brick" }, // Bottom left of square

        // Second column
        { x: 1693, y: 326, type: "brick" }, // Bottom block
        { x: 1693, y: 296, type: "brick" }, // Second from bottom
        { x: 1693, y: 266, type: "brick" }, // Middle block
        { x: 1693, y: 236, type: "brick" }, // Second from top
        { x: 1693, y: 206, type: "brick" }, // Top block
        { x: 1693, y: 176, type: "brick" }, // Top block

        { x: 1723, y: 116, type: "brick" }, // Top block
        { x: 1753, y: 116, type: "brick" }, // Bottom left of square
        { x: 1723, y: 86, type: "brick" }, // Top block
        { x: 1753, y: 86, type: "brick" }, // Bottom left of square

        { x: 1723, y: 326, type: "brick" }, // Bottom block
        { x: 1753, y: 326, type: "brick" }, // Bottom block
        { x: 1723, y: 356, type: "brick" }, // Second from bottom
        { x: 1753, y: 356, type: "brick" }, // Second from bottom
        { x: 1723, y: 386, type: "brick" }, // Middle block
        { x: 1753, y: 386, type: "brick" }, // Middle block

        { x: 1843, y: 326, type: "brick" }, // First block
        { x: 1873, y: 326, type: "brick" }, // Second block
        { x: 1903, y: 326, type: "brick" }, // Third block
        { x: 1933, y: 326, type: "brick" }, // Fourth block
        { x: 1963, y: 326, type: "brick" }, // Fifth block - this one goes up
        { x: 1993, y: 326, type: "brick" }, // Sixth block - this one goes up

        // Vertical column from fifth block (up to ceiling)
        { x: 1963, y: 296, type: "brick" },
        { x: 1963, y: 266, type: "brick" },
        { x: 1963, y: 236, type: "brick" },
        { x: 1963, y: 206, type: "brick" },
        { x: 1963, y: 176, type: "brick" },
        { x: 1963, y: 146, type: "brick" },
        { x: 1963, y: 116, type: "brick" },
        { x: 1963, y: 86, type: "brick" },

        // Vertical column from sixth block (up to ceiling)
        { x: 1993, y: 296, type: "brick" },
        { x: 1993, y: 266, type: "brick" },
        { x: 1993, y: 236, type: "brick" },
        { x: 1993, y: 206, type: "brick" },
        { x: 1993, y: 176, type: "brick" },
        { x: 1993, y: 146, type: "brick" },
        { x: 1993, y: 116, type: "brick" },
        { x: 1993, y: 86, type: "brick" },
        // Add these connecting ceiling blocks between the vertical columns
        { x: 1843, y: 86, type: "brick" },
        { x: 1873, y: 86, type: "brick" },
        { x: 1903, y: 86, type: "brick" },
        { x: 1933, y: 86, type: "brick" },
        { x: 1963, y: 86, type: "brick" },
        { x: 1993, y: 86, type: "brick" },
        { x: 1843, y: 116, type: "brick" },
        { x: 1873, y: 116, type: "brick" },
        { x: 1903, y: 116, type: "brick" },
        { x: 1933, y: 116, type: "brick" },

        { x: 2110, y: 326, type: "question" }, // First question block
        { x: 2185, y: 326, type: "question", content: "mushroom" }, // Second question block
        { x: 2269, y: 326, type: "question" }, // Third question block
        { x: 2443, y: 200, type: "question" }, // Second question block
        { x: 2185, y: 200, type: "question" }, // Third question block
        { x: 2473, y: 200, type: "question", content: "mushroom" }, // Fourth question block

        // Normal blocks after 50px gap (x: 2213 + 50 = 2263)
        { x: 2413, y: 326, type: "brick" },
        { x: 2443, y: 326, type: "brick" },
        { x: 2473, y: 326, type: "brick" },
        { x: 2503, y: 326, type: "brick" },
        { x: 2575, y: 350, type: "brick" },
        { x: 2661, y: 190, type: "brick" },
        { x: 2691, y: 190, type: "brick" },
        { x: 2721, y: 190, type: "brick" },
        { x: 2751, y: 190, type: "brick" },
        { x: 2781, y: 190, type: "brick" },
        { x: 2661, y: 296, type: "brick" },
        { x: 2691, y: 296, type: "brick" },
        { x: 2721, y: 296, type: "brick" },
        { x: 2751, y: 296, type: "brick" },
        { x: 2781, y: 296, type: "brick" },
        { x: 2811, y: 296, type: "brick" },

        { x: 4305, y: 419, type: "brick" },
        { x: 4335, y: 419, type: "brick" },
        { x: 4305, y: 389, type: "brick" },
        { x: 4335, y: 389, type: "brick" },
        { x: 4335, y: 359, type: "brick" },
        // First step (1 block)
        { x: 4700, y: 416, type: "stair" },

        // Second step (2 blocks)
        { x: 4732, y: 416, type: "stair" },
        { x: 4732, y: 384, type: "stair" },

        // Third step (3 blocks)
        { x: 4764, y: 416, type: "stair" },
        { x: 4764, y: 384, type: "stair" },
        { x: 4764, y: 352, type: "stair" },

        // Fourth step (4 blocks)
        { x: 4796, y: 416, type: "stair" },
        { x: 4796, y: 384, type: "stair" },
        { x: 4796, y: 352, type: "stair" },
        { x: 4796, y: 320, type: "stair" },

        // Block for flagpole base
        { x: 4900, y: 416, type: "stair" },
      ],
      coins: [
        // Left coins relative to the arc (x: 1216)
        { x: 1250, y: 296 }, // Left upper
        { x: 1280, y: 296 }, // Left lower

        // Right coins relative to the arc (x: 1486)
        { x: 1430, y: 296 }, // Right upper
        { x: 1460, y: 296 }, // Right lower

        // Top coins on the archway
        { x: 1340, y: 236 },
        { x: 1370, y: 236 },
        { x: 1878, y: 296 },
        { x: 1903, y: 296 },
        { x: 1850, y: 296 },
        { x: 1933, y: 296 },
        { x: 2580, y: 320 },
      ],
      pipes: [
        { x: 3305, y: 387, size: "small" },
        { x: 3485, y: 354, size: "medium" },
        { x: 3665, y: 320, size: "large" },
        { x: 3845, y: 354, size: "medium" },
        { x: 4025, y: 387, size: "small" },
      ],
      movingPlatforms: [
        { x: 4400, y: 200, index: 0 }, // First platform
        { x: 4500, y: 420, index: 1 }, // Second platform, starts lower
      ],
      enemies: [
        { type: "goomba", x: 400, y: 384 },

        // Near stairs
        { type: "goomba", x: 750, y: 384 },
        { type: "goomba", x: 800, y: 384 },

        // In the brick area
        { type: "goomba", x: 1300, y: 384 },
        { type: "goomba", x: 1350, y: 384 },

        // Near the second question block section
        { type: "goomba", x: 2200, y: 384 },
        { type: "goomba", x: 2250, y: 384 },

        // Near pipes
        { type: "goomba", x: 3400, y: 384 },
        { type: "goomba", x: 3600, y: 384 },
      ],
      levelEnd: {
        flagpole: { x: 4916, y: 128 },
        castle: { x: 5000, y: 288 },
      },
    });
  }

  restartLevel() {
    // Reload the current level completely
    this.loadLevel(this.currentLevel);
  }

  createLevelSelector() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.left = "10px";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.style.gap = "5px";
    grid.style.marginBottom = "5px";

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "5px";

    // Create story button
    const storyButton = document.createElement("button");
    storyButton.textContent = "Story";
    storyButton.style.fontFamily = "PressStart2P";
    storyButton.style.padding = "5px";
    storyButton.style.backgroundColor = "#FFD700";
    storyButton.style.border = "2px solid #DAA520";
    storyButton.style.cursor = "pointer";

    // Create controls button
    const controlsButton = document.createElement("button");
    controlsButton.textContent = "Controls";
    controlsButton.style.fontFamily = "PressStart2P";
    controlsButton.style.padding = "5px";
    controlsButton.style.backgroundColor = "#FFD700";
    controlsButton.style.border = "2px solid #DAA520";
    controlsButton.style.cursor = "pointer";

    // Create story box
    const storyBox = document.createElement("div");
    storyBox.style.position = "fixed";
    storyBox.style.top = "50%";
    storyBox.style.left = "50%";
    storyBox.style.transform = "translate(-50%, -50%)";
    storyBox.style.width = "400px";
    storyBox.style.height = "150px";
    storyBox.style.display = "none";
    storyBox.style.zIndex = "1000";

    // Create controls box
    const controlsBox = document.createElement("div");
    controlsBox.style.position = "fixed";
    controlsBox.style.top = "50%";
    controlsBox.style.left = "50%";
    controlsBox.style.transform = "translate(-50%, -50%)";
    controlsBox.style.width = "400px";
    controlsBox.style.height = "150px";
    controlsBox.style.display = "none";
    controlsBox.style.zIndex = "1000";

    // Create background elements
    const storyBackground = document.createElement("div");
    storyBackground.style.width = "100%";
    storyBackground.style.height = "100%";
    storyBackground.style.backgroundImage =
      "url('../images/title-screen-3.png')";
    storyBackground.style.backgroundPosition = "-332px -168px";
    storyBackground.style.backgroundRepeat = "no-repeat";
    storyBackground.style.backgroundSize = "100% 100%";

    const controlsBackground = document.createElement("div");
    controlsBackground.style.width = "100%";
    controlsBackground.style.height = "100%";
    controlsBackground.style.backgroundImage =
      "url('../images/title-screen-3.png')";
    controlsBackground.style.backgroundPosition = "-332px -168px";
    controlsBackground.style.backgroundRepeat = "no-repeat";
    controlsBackground.style.backgroundSize = "100% 100%";

    // Create text overlays
    const storyText = document.createElement("div");
    storyText.style.position = "absolute";
    storyText.style.top = "50%";
    storyText.style.left = "50%";
    storyText.style.transform = "translate(-50%, -50%)";
    storyText.style.color = "white";
    storyText.style.fontFamily = "PressStart2P";
    storyText.style.fontSize = "12px";
    storyText.style.textAlign = "center";
    storyText.style.padding = "20px";
    storyText.style.width = "90%";
    storyText.textContent =
      "Mario must race through the Mushroom Kingdom to save Princess Peach from the evil Bowser!";

    const controlsText = document.createElement("div");
    controlsText.style.position = "absolute";
    controlsText.style.top = "50%";
    controlsText.style.left = "50%";
    controlsText.style.transform = "translate(-50%, -50%)";
    controlsText.style.color = "white";
    controlsText.style.fontFamily = "PressStart2P";
    controlsText.style.fontSize = "10px"; // Made slightly smaller to fit all text
    controlsText.style.textAlign = "center";
    controlsText.style.padding = "20px";
    controlsText.style.width = "90%";
    controlsText.style.lineHeight = "1.8"; // Added line spacing for readability
    controlsText.innerHTML =
      "← → : Move<br>↑ or SPACE : Jump<br>↓ : Crouch (Super Mario)<br>P : Pause<br>C : Continue<br>R : Restart Level";

    // Add elements to boxes
    storyBox.appendChild(storyBackground);
    storyBox.appendChild(storyText);
    controlsBox.appendChild(controlsBackground);
    controlsBox.appendChild(controlsText);

    // Toggle visibility
    storyButton.onclick = () => {
      storyBox.style.display =
        storyBox.style.display === "none" ? "block" : "none";
      controlsBox.style.display = "none";
    };

    controlsButton.onclick = () => {
      controlsBox.style.display =
        controlsBox.style.display === "none" ? "block" : "none";
      storyBox.style.display = "none";
    };

    // Create level buttons
    for (let world = 1; world <= 1; world++) {
      for (let level = 1; level <= 2; level++) {
        const button = document.createElement("button");
        button.textContent = `${world}-${level}`;
        button.style.padding = "5px";
        button.style.backgroundColor = "#FFD700";
        button.style.border = "2px solid #DAA520";
        button.style.cursor = "pointer";
        button.style.fontFamily = "PressStart2P";

        button.addEventListener("click", () => {
          const levelIndex = (world - 1) * 4 + (level - 1);
          if (levelIndex < this.levels.length) {
            this.loadLevel(levelIndex);
          }
        });

        grid.appendChild(button);
      }
    }

    buttonsContainer.appendChild(storyButton);
    buttonsContainer.appendChild(controlsButton);
    container.appendChild(grid);
    container.appendChild(buttonsContainer);
    document.body.appendChild(container);
    document.body.appendChild(storyBox);
    document.body.appendChild(controlsBox);
  }
}
