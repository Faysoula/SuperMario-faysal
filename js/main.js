const game = new Game();
const levelManager = new LevelManager(game);

levelManager.defineLevels();

levelManager.loadLevel(1);

levelManager.createLevelSelector();

if (game.keys["r"] || game.keys["R"]) {
  if (this.levelManager) {
    levelManager.restartLevel();
  }
}

setInterval(() => {
  game.update();
  game.draw();
}, 1000 / 60);
