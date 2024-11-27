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
      this.game.camera.x = 0;
      this.game.camera.y = 0;

      const player = new Player(
        levelData.playerSpawn.x,
        levelData.playerSpawn.y
      );
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
    }
  }

  defineLevels() {
    this.levels.push({
      id: "1-1",
      width: 3392,
      height: 480,
      playerSpawn: { x: 1654, y: 380 },

      // Ground segments - Now with gaps
      groundSegments: [
        { x: 0, width: 1584, height: 32 }, // First section up to first gap (1262 + 322)
        { x: 1654, width: 477, height: 32 }, // Ground after first 2-block gap
        { x: 2230, width: 1271, height: 32 }, // Ground after second gap (475 + remaining)
      ],

      // Block placements - includes both first screen and new section
      blocks: [
        // First screen blocks (keeping your existing perfect layout)
        { x: 256, y: 272, type: "question" },
        { x: 320, y: 272, type: "brick" },
        { x: 350, y: 272, type: "question" },
        { x: 380, y: 272, type: "brick" },
        { x: 410, y: 272, type: "question" },
        { x: 440, y: 272, type: "brick" },
        { x: 380, y: 144, type: "question" },

        // New section blocks
        // Blocks 100px above ground (380 - 100 = 280)
        { x: 1835, y: 320, type: "brick" }, // First brick
        { x: 1865, y: 320, type: "question" }, // Question block
        { x: 1895, y: 320, type: "brick" }, // Third brick
        { x: 1925, y: 320, type: "brick" }, // Fourth brick

        // Row of 7 bricks 98px above last brick
        { x: 1955, y: 220, type: "brick" }, // First of seven
        { x: 1985, y: 220, type: "brick" },
        { x: 2015, y: 220, type: "brick" },
        { x: 2045, y: 220, type: "brick" },
        { x: 2075, y: 220, type: "brick" },
        { x: 2105, y: 220, type: "brick" },
        { x: 2135, y: 220, type: "brick" },
            ],

      // Keeping your existing pipe placements
      pipes: [
        { x: 500, y: 387, size: "small" },
        { x: 764, y: 354, size: "medium" },
        { x: 965, y: 320, size: "large" },
        { x: 1262, y: 320, size: "large" },
      ],

      // Keeping your existing enemy placements
      enemies: [
        { type: "goomba", x: 380, y: 368 },
        { type: "goomba", x: 965, y: 320 },
        { type: "goomba", x: 1262, y: 320 },
        { type: "goomba", x: 1200, y: 320 },
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
