class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 0;
    this.levels = [];
    this.levelState = "PLAYING"; // PLAYING, COMPLETED, FAILED
  }

  loadLevel(levelIndex) {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      this.game.sprites = [];
      const levelData = this.levels[levelIndex];
      this.currentLevel = levelIndex;

      this.game.setLevelBoundaries(levelData.width, levelData.height);
      this.game.camera.reset();

      const player = new Player(
        levelData.playerSpawn.x,
        levelData.playerSpawn.y,
        this.game.camera
      );

      player.setLevelManager(this);
      player.spawnX = levelData.playerSpawn.x;
      player.spawnY = levelData.playerSpawn.y;
      this.game.addSprite(player);

      levelData.groundSegments.forEach((segment) => {
        const ground = new Platform(
          segment.x,
          segment.y || this.game.canvas.height - segment.height,
          segment.width,
          segment.height
        );
        this.game.addSprite(ground);
      });

      levelData.blocks.forEach((block) => {
        const newBlock = new Block(block.x, block.y, block.type);
        this.game.addSprite(newBlock);
      });

      levelData.enemies.forEach((enemy) => {
        if (enemy.type === "goomba") {
          const goomba = new Goomba(enemy.x, enemy.y);
          this.game.addSprite(goomba);
        }
      });

      levelData.pipes.forEach((pipe) => {
        const newPipe = new Pipe(pipe.x, pipe.y, pipe.size);
        this.game.addSprite(newPipe);
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
    }
  }

  defineLevels() {
    this.levels.push({
      id: "1-1",
      width: 5500,
      height: 480,
      playerSpawn: { x: 4700, y: 380 },

      // Ground segments - Now with gaps
      groundSegments: [
        { x: 0, width: 1584, height: 32 }, // First section up to first gap (1262 + 322)
        { x: 1654, width: 477, height: 32 }, // Ground after first 2-block gap
        { x: 2230, width: 1700, height: 32 },
        { x: 4022, width: 2000, height: 32 },
      ],

      // Block placements - includes both first screen and new section
      blocks: [
        // Previous blocks remain unchanged
        { x: 256, y: 272, type: "question" },
        { x: 320, y: 272, type: "brick" },
        { x: 350, y: 272, type: "question" },
        { x: 380, y: 272, type: "brick" },
        { x: 410, y: 272, type: "question" },
        { x: 440, y: 272, type: "brick" },
        { x: 380, y: 144, type: "question" },
        { x: 1835, y: 320, type: "brick" },
        { x: 1865, y: 320, type: "question" },
        { x: 1895, y: 320, type: "brick" },
        { x: 1925, y: 320, type: "brick" },
        { x: 1955, y: 220, type: "brick" },
        { x: 1985, y: 220, type: "brick" },
        { x: 2015, y: 220, type: "brick" },
        { x: 2045, y: 220, type: "brick" },
        { x: 2075, y: 220, type: "brick" },
        { x: 2105, y: 220, type: "brick" },
        { x: 2135, y: 220, type: "brick" },

        // New section (65px after last gap, at height 233)
        // Three brick blocks and a question block together
        { x: 2295, y: 233, type: "brick" },
        { x: 2325, y: 233, type: "brick" },
        { x: 2355, y: 233, type: "brick" },
        { x: 2385, y: 233, type: "question" },

        // Block 100px below question block
        { x: 2385, y: 320, type: "brick" },

        // Two blocks 160px to the right
        { x: 2545, y: 320, type: "brick" },
        { x: 2575, y: 320, type: "brick" },

        // Three question blocks 127px further, 100px off ground (320px height)
        { x: 2702, y: 320, type: "question" },
        { x: 2768, y: 320, type: "question" }, // +66px
        { x: 2834, y: 320, type: "question" }, // +66px

        // Question block above middle question block
        { x: 2768, y: 224, type: "question" }, // 96px above middle block
        // Single brick block 159px to the right of last question block
        { x: 2993, y: 320, type: "brick" },

        // Three brick blocks 62px to the right at height 224
        { x: 3055, y: 224, type: "brick" },
        { x: 3085, y: 224, type: "brick" },
        { x: 3115, y: 224, type: "brick" },

        // Brick-Question-Question-Brick pattern 126px to the right
        { x: 3241, y: 224, type: "brick" },
        { x: 3271, y: 224, type: "question" },
        { x: 3301, y: 224, type: "question" },
        { x: 3331, y: 224, type: "brick" },

        // Two brick blocks 100px below the question blocks
        { x: 3262, y: 324, type: "brick" },
        { x: 3292, y: 324, type: "brick" },

        // First staircase
        // Bottom row - 4 blocks
        { x: 3413, y: 416, type: "stair" },
        { x: 3445, y: 416, type: "stair" },
        { x: 3477, y: 416, type: "stair" },
        { x: 3510, y: 416, type: "stair" },

        // Second row - 3 blocks
        { x: 3447, y: 384, type: "stair" },
        { x: 3479, y: 384, type: "stair" },
        { x: 3511, y: 384, type: "stair" },

        // Third row - 2 blocks
        { x: 3479, y: 352, type: "stair" },
        { x: 3511, y: 352, type: "stair" },

        // Top block
        { x: 3511, y: 320, type: "stair" },

        // Next staircase
        { x: 3575, y: 416, type: "stair" },
        { x: 3607, y: 416, type: "stair" },
        { x: 3639, y: 416, type: "stair" },
        { x: 3671, y: 416, type: "stair" },
        { x: 3575, y: 384, type: "stair" },
        { x: 3607, y: 384, type: "stair" },
        { x: 3639, y: 384, type: "stair" },
        { x: 3575, y: 352, type: "stair" },
        { x: 3607, y: 352, type: "stair" },
        { x: 3575, y: 320, type: "stair" },

        // Bigger staircase
        { x: 3799, y: 416, type: "stair" },
        { x: 3831, y: 416, type: "stair" },
        { x: 3863, y: 416, type: "stair" },
        { x: 3895, y: 416, type: "stair" },
        { x: 3927, y: 416, type: "stair" },
        { x: 3831, y: 384, type: "stair" },
        { x: 3863, y: 384, type: "stair" },
        { x: 3895, y: 384, type: "stair" },
        { x: 3927, y: 384, type: "stair" },
        { x: 3863, y: 352, type: "stair" },
        { x: 3895, y: 352, type: "stair" },
        { x: 3927, y: 352, type: "stair" },
        { x: 3895, y: 320, type: "stair" },
        { x: 3927, y: 320, type: "stair" },

        // Final staircase (inverted)
        { x: 4023, y: 416, type: "stair" },
        { x: 4055, y: 416, type: "stair" },
        { x: 4087, y: 416, type: "stair" },
        { x: 4119, y: 416, type: "stair" },
        { x: 4023, y: 384, type: "stair" },
        { x: 4055, y: 384, type: "stair" },
        { x: 4087, y: 384, type: "stair" },
        { x: 4023, y: 352, type: "stair" },
        { x: 4055, y: 352, type: "stair" },
        { x: 4023, y: 320, type: "stair" },

        { x: 4351, y: 272, type: "brick" },
        { x: 4381, y: 272, type: "brick" },
        { x: 4411, y: 272, type: "question" },
        { x: 4441, y: 272, type: "brick" },

        // Final staircase (base of 9, 10px after second pipe)
        { x: 4760, y: 416, type: "stair" },
        { x: 4792, y: 416, type: "stair" },
        { x: 4824, y: 416, type: "stair" },
        { x: 4856, y: 416, type: "stair" },
        { x: 4888, y: 416, type: "stair" },
        { x: 4920, y: 416, type: "stair" },
        { x: 4952, y: 416, type: "stair" },
        { x: 4984, y: 416, type: "stair" },
        { x: 5016, y: 416, type: "stair" }, // Base row (9 blocks)

        { x: 4792, y: 384, type: "stair" },
        { x: 4824, y: 384, type: "stair" },
        { x: 4856, y: 384, type: "stair" },
        { x: 4888, y: 384, type: "stair" },
        { x: 4920, y: 384, type: "stair" },
        { x: 4952, y: 384, type: "stair" },
        { x: 4984, y: 384, type: "stair" },
        { x: 5016, y: 384, type: "stair" }, // Second row (8 blocks)

        { x: 4824, y: 352, type: "stair" },
        { x: 4856, y: 352, type: "stair" },
        { x: 4888, y: 352, type: "stair" },
        { x: 4920, y: 352, type: "stair" },
        { x: 4952, y: 352, type: "stair" },
        { x: 4984, y: 352, type: "stair" },
        { x: 5016, y: 352, type: "stair" }, // Third row (7 blocks)

        { x: 4856, y: 320, type: "stair" },
        { x: 4888, y: 320, type: "stair" },
        { x: 4920, y: 320, type: "stair" },
        { x: 4952, y: 320, type: "stair" },
        { x: 4984, y: 320, type: "stair" },
        { x: 5016, y: 320, type: "stair" }, // Fourth row (6 blocks)

        { x: 4888, y: 288, type: "stair" },
        { x: 4920, y: 288, type: "stair" },
        { x: 4952, y: 288, type: "stair" },
        { x: 4984, y: 288, type: "stair" },
        { x: 5016, y: 288, type: "stair" }, // Fifth row (5 blocks)

        { x: 4920, y: 256, type: "stair" },
        { x: 4952, y: 256, type: "stair" },
        { x: 4984, y: 256, type: "stair" },
        { x: 5016, y: 256, type: "stair" }, // Sixth row (4 blocks)

        { x: 4952, y: 224, type: "stair" },
        { x: 4984, y: 224, type: "stair" },
        { x: 5016, y: 224, type: "stair" }, // Seventh row (3 blocks)

        { x: 4984, y: 192, type: "stair" },
        { x: 5016, y: 192, type: "stair" }, // Eighth row (2 blocks)

        { x: 5143, y: 416, type: "stair" },
      ],

      levelEnd: {
        flagpole: { x: 5157, y: 128 },
        castle: { x: 5267, y: 288 },
      },

      // Keeping your existing pipe placements
      pipes: [
        { x: 500, y: 387, size: "small" },
        { x: 764, y: 354, size: "medium" },
        { x: 965, y: 320, size: "large" },
        { x: 1262, y: 320, size: "large" },
        { x: 4251, y: 387, size: "small" }, // 132px from last stair
        { x: 4574, y: 387, size: "small" }, // 223px after block group
      ],

      // Keeping your existing enemy placements
      enemies: [
        { type: "goomba", x: 380, y: 368 },
        { type: "goomba", x: 965, y: 320 },
        { type: "goomba", x: 1262, y: 320 },
        { type: "goomba", x: 1190, y: 320 },
      ],
    });
  }

  nextLevel() {
    if (this.currentLevel < this.levels.length - 1) {
      this.loadLevel(this.currentLevel + 1);
    }
  }

  restartLevel() {
    this.loadLevel(this.currentLevel);
  }

  // Level selection UI
  createLevelSelector() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.left = "10px";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.style.gap = "5px";

    for (let world = 1; world <= 8; world++) {
      for (let level = 1; level <= 4; level++) {
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
