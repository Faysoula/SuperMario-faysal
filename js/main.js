const game = new Game();

game.setLevelBoundaries(3000, 600);

const player = new Player(100, 300);
game.addSprite(player);

// Create ground segments with gaps
const groundSegments = [
  // First section
  { x: 0, width: 400 },
  // Gap of 100 pixels
  { x: 500, width: 300 },
  // Gap of 150 pixels
  { x: 800, width: 400 },
  // Small platform
  { x: 1300, width: 100 },
  // Large gap
  { x: 1500, width: 500 },
  // Final stretch
  { x: 2100, width: 900 },
];

// Add ground platforms - now aligned to bottom of canvas
const groundHeight = 32;
groundSegments.forEach((segment) => {
  const ground = new Platform(
    segment.x,
    game.canvas.height - groundHeight, // This positions the top of the ground
    segment.width,
    groundHeight + 100 // Extend height below canvas bottom to fill any gap
  );
  game.addSprite(ground);
});

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
