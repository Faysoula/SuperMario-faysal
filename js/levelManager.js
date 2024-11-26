class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 0;
    this.levels = [];
    this.levelState = "PLAYING"; // PLAYING, COMPLETED, FAILED
  }

  // Load level data
  loadLevel(levelIndex) {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      // Clear existing sprites and any existing coins
      this.game.sprites = [];

      const levelData = this.levels[levelIndex];
      this.currentLevel = levelIndex;

      // Set level boundaries
      this.game.setLevelBoundaries(levelData.width, levelData.height);

      // Reset camera position
      this.game.camera.x = 0;
      this.game.camera.y = 0;

      // Create player at spawn point
      const player = new Player(
        levelData.playerSpawn.x,
        levelData.playerSpawn.y
      );
      // Reset player's spawn position
      player.spawnX = levelData.playerSpawn.x;
      player.spawnY = levelData.playerSpawn.y;
      this.game.addSprite(player);

      // Add ground segments
      levelData.groundSegments.forEach((segment) => {
        const ground = new Platform(
          segment.x,
          this.game.canvas.height - segment.height,
          segment.width,
          segment.height + 100
        );
        this.game.addSprite(ground);
      });

      // Add blocks
      levelData.blocks.forEach((block) => {
        const newBlock = new Block(block.x, block.y, block.type);
        // Reset block state
        newBlock.hit = false;
        newBlock.hitAnimation = 0;
        this.game.addSprite(newBlock);
      });

      // Add initial coins if they exist (not from blocks)
      if (levelData.coins) {
        levelData.coins.forEach((coin) => {
          const newCoin = new Coin(coin.x, coin.y);
          this.game.addSprite(newCoin);
        });
      }
    }
  }

  defineLevels() {
    // Level 1-1
    this.levels.push({
      id: "1-1",
      width: 3000,
      height: 600,
      playerSpawn: { x: 100, y: 300 },
      groundSegments: [
        { x: 0, width: 400, height: 32 },
        { x: 500, width: 300, height: 32 },
        { x: 800, width: 400, height: 32 },
        { x: 1300, width: 100, height: 32 },
        { x: 1500, width: 500, height: 32 },
        { x: 2100, width: 900, height: 32 },
      ],
      blocks: [
        // First screen
        { x: 400, y: 400, type: "brick" },
        { x: 434, y: 400, type: "question" },
        { x: 468, y: 400, type: "brick" },
        // Second screen
        { x: 800, y: 350, type: "brick" },
        { x: 834, y: 350, type: "question" },
        { x: 868, y: 350, type: "brick" },
        // Third screen
        { x: 1200, y: 300, type: "question" },
        { x: 1234, y: 300, type: "brick" },
        { x: 1268, y: 300, type: "question" },
        // Fourth screen
        { x: 1600, y: 400, type: "brick" },
        { x: 1634, y: 400, type: "question" },
        { x: 1668, y: 400, type: "brick" },
        // Fifth screen
        { x: 2000, y: 350, type: "question" },
        { x: 2034, y: 350, type: "brick" },
        { x: 2068, y: 350, type: "question" },
      ],
    });

    // Level 1-2
    this.levels.push({
      id: "1-2",
      width: 3500,
      height: 600,
      playerSpawn: { x: 100, y: 300 },
      groundSegments: [
        { x: 0, width: 500, height: 32 },
        { x: 600, width: 400, height: 32 },
        { x: 1100, width: 300, height: 32 },
        { x: 1500, width: 600, height: 32 },
        { x: 2200, width: 1300, height: 32 },
      ],
      blocks: [
        // First screen
        { x: 700, y: 350, type: "question" },
        { x: 734, y: 350, type: "brick" },
        { x: 768, y: 350, type: "question" },
        { x: 802, y: 350, type: "brick" },
        // Second screen
        { x: 1200, y: 300, type: "brick" },
        { x: 1234, y: 300, type: "question" },
        { x: 1268, y: 300, type: "brick" },
        // Third screen
        { x: 1700, y: 400, type: "question" },
        { x: 1734, y: 400, type: "brick" },
        { x: 1768, y: 400, type: "question" },
        // Fourth screen
        { x: 2300, y: 350, type: "brick" },
        { x: 2334, y: 350, type: "question" },
        { x: 2368, y: 350, type: "brick" },
      ],
      coins: [
        { x: 700, y: 250 },
        { x: 750, y: 250 },
        { x: 800, y: 250 },
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
