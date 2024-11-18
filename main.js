const game = new Game();

const player = new Player(100, 300);
game.addSprite(player);

const groundHeight = 100;
const ground = new Platform(
  0,
  game.canvas.height - groundHeight,
  game.canvas.width,
  groundHeight
);

game.addSprite(ground);

const platform1 = new Platform(200, 850, 200, 20);
const platform2 = new Platform(550, 750, 150, 20);
game.addSprite(platform1);
game.addSprite(platform2);

game.animate();
