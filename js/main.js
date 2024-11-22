const game = new Game();
const levelManager = new LevelManager(game);

// Define all levels
levelManager.defineLevels();

// Load initial level
levelManager.loadLevel(0);

// Create level selector UI
levelManager.createLevelSelector();

// Start game loop
game.animate();
