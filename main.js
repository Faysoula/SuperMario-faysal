const game = new Game();

const player = new Player(100, 300);
game.addSprite(player);

// Calculate ground position
const groundHeight = 100;
const ground = new Platform(
  0,
  game.canvas.height - groundHeight,
  game.canvas.width,
  groundHeight
);
game.addSprite(ground);

const platformWidth = 200;
const platformHeight = 15;

const platform1 = new Platform(
  game.canvas.width / 2 - platformWidth - 50,
  game.canvas.height - 200,
  platformWidth,
  platformHeight
);

const platform2 = new Platform(
  game.canvas.width / 2 + 50, // Right of center
  game.canvas.height - 300,
  platformWidth,
  platformHeight
);

const platform3 = new Platform(
  game.canvas.width / 2 - platformWidth / 2,
  game.canvas.height - 400,
  platformWidth,
  platformHeight
);

// Add all platforms to the game
game.addSprite(platform1);
game.addSprite(platform2);
game.addSprite(platform3);

game.animate();
