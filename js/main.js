const game = new Game();
const levelManager = new LevelManager(game);

levelManager.defineLevels();

levelManager.loadLevel(0);

levelManager.createLevelSelector();

setInterval(() => {
  game.update();
  game.draw();
}, 1000/100);
