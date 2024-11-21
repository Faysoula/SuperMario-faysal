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

const block1 = new Block(
  game.canvas.width / 2 - 100,
  game.canvas.height - 200,
  "brick"
);
const block2 = new Block(
  game.canvas.width / 2 - 66,
  game.canvas.height - 200,
  "question"
);
const block3 = new Block(
  game.canvas.width / 2 - 32,
  game.canvas.height - 200,
  "brick"
);

game.addSprite(block1);
game.addSprite(block2);
game.addSprite(block3);
game.animate();

// Add just 2 coins above each platform
// function addCoinsAbovePlatform(platform) {
//   // Add just two coins above each platform
//   const coin1 = new Coin(platform.x + platformWidth / 3 - 10, platform.y - 50);
//   const coin2 = new Coin(
//     platform.x + (platformWidth * 2) / 3 - 10,
//     platform.y - 50
//   );

//   game.addSprite(coin1);
//   game.addSprite(coin2);
// }

// // Add coins above each platform
// addCoinsAbovePlatform(platform1);
// addCoinsAbovePlatform(platform2);
// addCoinsAbovePlatform(platform3);
