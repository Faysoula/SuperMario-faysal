class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 0;
    this.levels = [];
    this.levelState = "PLAYING"; // PLAYING, COMPLETED, FAILED
    this.hud = new HUD(); // Create HUD once in constructor
    this.hud.setLevelManager(this);
    this.isUnderground = false;
  }

  loadLevel(levelIndex) {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      this.isUnderground = levelIndex === 1;
      this.game.sprites = [];
      const levelData = this.levels[levelIndex];
      this.currentLevel = levelIndex;

      if (this.isUnderground) {
        this.game.canvas.style.backgroundColor = "#000000"; // Set canvas background
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

      // Then load all other game elements in order
      levelData.groundSegments.forEach((segment) => {
        const ground = new Platform(
          segment.x,
          segment.y || this.game.canvas.height - segment.height,
          segment.width,
          segment.height,
          this.isUnderground
        );
        this.game.addSprite(ground);
      });

      levelData.blocks.forEach((block) => {
        const newBlock = new Block(
          block.x,
          block.y,
          block.type,
          block.content,
          this.isUnderground
        );
        this.game.addSprite(newBlock);
      });

      levelData.pipes.forEach((pipe) => {
        const newPipe = new Pipe(pipe.x, pipe.y, pipe.size);
        this.game.addSprite(newPipe);
      });

      levelData.enemies.forEach((enemy) => {
        if (enemy.type === "goomba") {
          const goomba = new Goomba(enemy.x, enemy.y);
          this.game.addSprite(goomba);
        }
      });

      if (levelData.levelEnd?.flagpole) {
        const flagpole = new FlagPole(
          levelData.levelEnd.flagpole.x,
          levelData.levelEnd.flagpole.y
        );
        this.game.addSprite(flagpole);
      }

      if (levelData.levelEnd?.castle) {
        const castle = new Castle(
          levelData.levelEnd.castle.x,
          levelData.levelEnd.castle.y
        );
        castle.setLevelManager(this);
        this.game.addSprite(castle);
      }
      if (levelData.coins) {
        levelData.coins.forEach((coinData) => {
          const coin = new Coin(coinData.x, coinData.y, false); // false means not pop-out coin
          this.game.addSprite(coin);
        });
      }

      this.game.addSprite(this.hud);
    }
  }

  defineLevels() {
    this.levels.push({
      id: "1-1",
      width: 5945, // Increased by 255 to account for the shift
      height: 480,
      playerSpawn: { x: 5000, y: 380 },

      // Ground segments - Shifted by 255 pixels
      groundSegments: [
        { x: 0, width: 2048, height: 32 }, // First ground section until first gap
        { x: 2118, width: 477, height: 32 }, // Ground after first gap
        { x: 2694, width: 1700, height: 32 }, // Middle section
        { x: 4486, width: 2000, height: 32 },
      ],

      // Block placements - All x values increased by 255
      blocks: [
        { x: 511, y: 272, type: "question" }, // 256 + 255
        { x: 575, y: 272, type: "brick" }, // 320 + 255
        { x: 605, y: 272, type: "question", content: "mushroom" }, // 350 + 255
        { x: 635, y: 272, type: "brick" }, // 380 + 255
        { x: 665, y: 272, type: "question" }, // 410 + 255
        { x: 695, y: 272, type: "brick" }, // 440 + 255
        { x: 635, y: 144, type: "question" }, // 380 + 255
        //after first gap
        { x: 2280, y: 320, type: "brick" }, // 2090 + 190
        { x: 2310, y: 320, type: "question", content: "mushroom" }, // 2120 + 190
        { x: 2340, y: 320, type: "brick" }, // 2150 + 190
        { x: 2370, y: 320, type: "brick" }, // 2180 + 190
        { x: 2400, y: 220, type: "brick" }, // 2210 + 190
        { x: 2430, y: 220, type: "brick" }, // 2240 + 190
        { x: 2460, y: 220, type: "brick" }, // 2270 + 190
        { x: 2490, y: 220, type: "brick" }, // 2300 + 190
        { x: 2520, y: 220, type: "brick" }, // 2330 + 190
        { x: 2550, y: 220, type: "brick" }, // 2360 + 190
        { x: 2580, y: 220, type: "brick" }, // 2390 + 190

        // New section blocks
        { x: 2740, y: 233, type: "brick" }, // 2550 + 190
        { x: 2770, y: 233, type: "brick" }, // 2580 + 190
        { x: 2800, y: 233, type: "brick" }, // 2610 + 190
        { x: 2830, y: 233, type: "question" }, // 2640 + 190
        { x: 2830, y: 320, type: "brick" }, // 2640 + 190
        { x: 2990, y: 320, type: "brick" }, // 2800 + 190
        { x: 3020, y: 320, type: "brick" }, // 2830 + 190
        { x: 3147, y: 320, type: "question" }, // 2957 + 190
        { x: 3213, y: 320, type: "question" }, // 3023 + 190
        { x: 3279, y: 320, type: "question" }, // 3089 + 190
        { x: 3213, y: 224, type: "question", content: "mushroom" }, // 3023 + 190
        { x: 3438, y: 320, type: "brick" }, // 3248 + 190
        { x: 3500, y: 224, type: "brick" }, // 3310 + 190
        { x: 3530, y: 224, type: "brick" }, // 3340 + 190
        { x: 3560, y: 224, type: "brick" }, // 3370 + 190
        { x: 3686, y: 224, type: "brick" }, // 3496 + 190
        { x: 3716, y: 224, type: "question" }, // 3526 + 190
        { x: 3746, y: 224, type: "question" }, // 3556 + 190
        { x: 3776, y: 224, type: "brick" }, // 3586 + 190
        { x: 3707, y: 324, type: "brick" }, // 3517 + 190
        { x: 3737, y: 324, type: "brick" }, // 3547 + 190

        // First staircase
        { x: 3874, y: 416, type: "stair" }, // 3858 + 16
        { x: 3906, y: 416, type: "stair" }, // 3890 + 16
        { x: 3938, y: 416, type: "stair" }, // 3922 + 16
        { x: 3971, y: 416, type: "stair" }, // 3955 + 16
        { x: 3908, y: 384, type: "stair" }, // 3892 + 16
        { x: 3940, y: 384, type: "stair" }, // 3924 + 16
        { x: 3972, y: 384, type: "stair" }, // 3956 + 16
        { x: 3940, y: 352, type: "stair" }, // 3924 + 16
        { x: 3972, y: 352, type: "stair" }, // 3956 + 16
        { x: 3972, y: 320, type: "stair" }, // 3956 + 16

        // Next staircase
        { x: 4036, y: 416, type: "stair" }, // 4020 + 16
        { x: 4068, y: 416, type: "stair" }, // 4052 + 16
        { x: 4100, y: 416, type: "stair" }, // 4084 + 16
        { x: 4132, y: 416, type: "stair" }, // 4116 + 16
        { x: 4036, y: 384, type: "stair" }, // 4020 + 16
        { x: 4068, y: 384, type: "stair" }, // 4052 + 16
        { x: 4100, y: 384, type: "stair" }, // 4084 + 16
        { x: 4036, y: 352, type: "stair" }, // 4020 + 16
        { x: 4068, y: 352, type: "stair" }, // 4052 + 16
        { x: 4036, y: 320, type: "stair" }, // 4020 + 16

        // Bigger staircase
        { x: 4260, y: 416, type: "stair" }, // 4244 + 16
        { x: 4292, y: 416, type: "stair" }, // 4276 + 16
        { x: 4324, y: 416, type: "stair" }, // 4308 + 16
        { x: 4356, y: 416, type: "stair" }, // 4340 + 16
        { x: 4388, y: 416, type: "stair" }, // 4372 + 16
        { x: 4292, y: 384, type: "stair" }, // 4276 + 16
        { x: 4324, y: 384, type: "stair" }, // 4308 + 16
        { x: 4356, y: 384, type: "stair" }, // 4340 + 16
        { x: 4388, y: 384, type: "stair" }, // 4372 + 16
        { x: 4324, y: 352, type: "stair" }, // 4308 + 16
        { x: 4356, y: 352, type: "stair" }, // 4340 + 16
        { x: 4388, y: 352, type: "stair" }, // 4372 + 16
        { x: 4356, y: 320, type: "stair" }, // 4340 + 16
        { x: 4388, y: 320, type: "stair" }, // 4372 + 16

        // Final staircases
        { x: 4484, y: 416, type: "stair" }, // 4468 + 16
        { x: 4516, y: 416, type: "stair" }, // 4500 + 16
        { x: 4548, y: 416, type: "stair" }, // 4532 + 16
        { x: 4580, y: 416, type: "stair" }, // 4564 + 16
        { x: 4484, y: 384, type: "stair" }, // 4468 + 16
        { x: 4516, y: 384, type: "stair" }, // 4500 + 16
        { x: 4548, y: 384, type: "stair" }, // 4532 + 16
        { x: 4484, y: 352, type: "stair" }, // 4468 + 16
        { x: 4516, y: 352, type: "stair" }, // 4500 + 16
        { x: 4484, y: 320, type: "stair" },

        { x: 4796, y: 272, type: "brick" }, // 4606 + 190
        { x: 4826, y: 272, type: "brick" }, // 4636 + 190
        { x: 4856, y: 272, type: "question" }, // 4666 + 190
        { x: 4886, y: 272, type: "brick" }, // 4696 + 190

        // Final staircase
        { x: 5205, y: 416, type: "stair" }, // 5015 + 190
        { x: 5237, y: 416, type: "stair" }, // 5047 + 190
        { x: 5269, y: 416, type: "stair" }, // 5079 + 190
        { x: 5301, y: 416, type: "stair" }, // 5111 + 190
        { x: 5333, y: 416, type: "stair" }, // 5143 + 190
        { x: 5365, y: 416, type: "stair" }, // 5175 + 190
        { x: 5397, y: 416, type: "stair" }, // 5207 + 190
        { x: 5429, y: 416, type: "stair" }, // 5239 + 190
        { x: 5461, y: 416, type: "stair" }, // 5271 + 190

        { x: 5237, y: 384, type: "stair" }, // 5047 + 190
        { x: 5269, y: 384, type: "stair" }, // 5079 + 190
        { x: 5301, y: 384, type: "stair" }, // 5111 + 190
        { x: 5333, y: 384, type: "stair" }, // 5143 + 190
        { x: 5365, y: 384, type: "stair" }, // 5175 + 190
        { x: 5397, y: 384, type: "stair" }, // 5207 + 190
        { x: 5429, y: 384, type: "stair" }, // 5239 + 190
        { x: 5461, y: 384, type: "stair" }, // 5271 + 190

        { x: 5269, y: 352, type: "stair" }, // 5079 + 190
        { x: 5301, y: 352, type: "stair" }, // 5111 + 190
        { x: 5333, y: 352, type: "stair" }, // 5143 + 190
        { x: 5365, y: 352, type: "stair" }, // 5175 + 190
        { x: 5397, y: 352, type: "stair" }, // 5207 + 190
        { x: 5429, y: 352, type: "stair" }, // 5239 + 190
        { x: 5461, y: 352, type: "stair" }, // 5271 + 190

        { x: 5301, y: 320, type: "stair" }, // 5111 + 190
        { x: 5333, y: 320, type: "stair" }, // 5143 + 190
        { x: 5365, y: 320, type: "stair" }, // 5175 + 190
        { x: 5397, y: 320, type: "stair" }, // 5207 + 190
        { x: 5429, y: 320, type: "stair" }, // 5239 + 190
        { x: 5461, y: 320, type: "stair" }, // 5271 + 190

        { x: 5333, y: 288, type: "stair" }, // 5143 + 190
        { x: 5365, y: 288, type: "stair" }, // 5175 + 190
        { x: 5397, y: 288, type: "stair" }, // 5207 + 190
        { x: 5429, y: 288, type: "stair" }, // 5239 + 190
        { x: 5461, y: 288, type: "stair" }, // 5271 + 190

        { x: 5365, y: 256, type: "stair" }, // 5175 + 190
        { x: 5397, y: 256, type: "stair" }, // 5207 + 190
        { x: 5429, y: 256, type: "stair" }, // 5239 + 190
        { x: 5461, y: 256, type: "stair" }, // 5271 + 190

        { x: 5397, y: 224, type: "stair" }, // 5207 + 190
        { x: 5429, y: 224, type: "stair" }, // 5239 + 190
        { x: 5461, y: 224, type: "stair" }, // 5271 + 190

        { x: 5429, y: 192, type: "stair" }, // 5239 + 190
        { x: 5461, y: 192, type: "stair" }, // 5271 + 190

        { x: 5588, y: 416, type: "stair" }, // 5398 + 190
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
        //{ type: "goomba", x: 635, y: 368 }, // 380 + 255
        { type: "goomba", x: 1220, y: 320 }, // 965 + 255
        { type: "goomba", x: 1517, y: 320 }, // 1262 + 255
        { type: "goomba", x: 1445, y: 320 }, // 1190 + 255
      ],
    });

    this.levels.push({
      id: "1-2",
      width: 3392,
      height: 480,
      playerSpawn: { x: 1500, y: 300 }, // Start Mario above screen

      // Define required arrays even if empty
      groundSegments: [
        { x: 0, width: 3392, height: 32 }, // Full ground
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

        { x: 1651, y: 326, type: "brick" }, // Bottom block
        { x: 1651, y: 296, type: "brick" }, // Second from bottom
        { x: 1651, y: 266, type: "brick" }, // Middle block
        { x: 1651, y: 236, type: "brick" }, // Second from top
        { x: 1651, y: 206, type: "brick" }, // Top block
        { x: 1651, y: 176, type: "brick" }, // Top block

        // Second column
        { x: 1681, y: 326, type: "brick" }, // Bottom block
        { x: 1681, y: 296, type: "brick" }, // Second from bottom
        { x: 1681, y: 266, type: "brick" }, // Middle block
        { x: 1681, y: 236, type: "brick" }, // Second from top
        { x: 1681, y: 206, type: "brick" }, // Top block
        { x: 1681, y: 176, type: "brick" }, // Top block
        { x: 1711, y: 146, type: "brick" }, // Top block

        { x: 1711, y: 146, type: "brick" }, // Bottom left of square
        { x: 1741, y: 146, type: "brick" }, // Bottom right of square
        { x: 1711, y: 116, type: "brick" }, // Top left of square
        { x: 1741, y: 116, type: "brick" },
        { x: 1711, y: 86, type: "brick" },
        { }
      ],
      coins: [
        // Left coins relative to the arc (x: 1216)
        { x: 1250, y: 296 }, // Left upper
        { x: 1280, y: 296 }, // Left lower

        // Right coins relative to the arc (x: 1486)
        { x: 1430, y: 296 }, // Right upper
        { x: 1460, y: 296 }, // Right lower

        // Top coins on the archway
        { x: 1340, y: 236 }, // Top middle left
        { x: 1370, y: 236 }, // Top middle right
      ],
      pipes: [],
      enemies: [],
      levelEnd: {},
    });
  }

  nextLevel() {
    if (this.currentLevel < this.levels.length - 1) {
      this.loadLevel(this.currentLevel + 1);
    }
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

    for (let world = 1; world <= 1; world++) {
      for (let level = 1; level <= 2; level++) {
        const button = document.createElement("button");
        button.textContent = `${world}-${level}`;
        button.style.padding = "5px";
        button.style.backgroundColor = "#FFD700";
        button.style.border = "2px solid #DAA520";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => {
          const levelIndex = (world - 1) * 4 + (level - 1);
          if (levelIndex < this.levels.length) {
            this.loadLevel(levelIndex);
          }
        });

        grid.appendChild(button);
      }
    }

    container.appendChild(grid);
    document.body.appendChild(container);
  }
}
