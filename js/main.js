const game = new Game();
const levelManager = new LevelManager(game);

levelManager.defineLevels();

levelManager.loadLevel(1);

levelManager.createLevelSelector();


game.animate()
