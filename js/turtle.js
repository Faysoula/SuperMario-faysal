class Turtle extends Sprite {
  constructor(x, y, isUnderground = false) {
    super();
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 48;
    this.velocityX = -1;
    this.velocityY = 0;
    this.gravity = 0.8;
    this.isGrounded = false;
    this.shellHeight = 32;
    this.isUnderground = isUnderground;

    this.state = {
      current: "WALKING",
      shellVelocity: 0,
      shellKickCooldown: 0,
      frameIndex: 0,
      frameTimer: 0,
      frameDelay: 15,
      lastKickDirection: null,
    };

    this.spriteSheet = new Image();
    this.spriteSheet.src = "../images/enemies.png";

    this.sprites = {
      overworld: {
        walk: [
          { x: 180, y: 0 },
          { x: 150, y: 0 },
        ],
        shell: { x: 360, y: 5 },
      },
      underground: {
        walk: [
          { x: 180, y: 30 },
          { x: 150, y: 30 },
        ],
        shell: { x: 360, y: 35 },
      },
    };
  }

  update(sprites) {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.isGrounded = false;

    const hud = sprites.find((sprite) => sprite instanceof HUD);

    switch (this.state.current) {
      case "WALKING":
        this.x += this.velocityX;
        this.updateAnimation();
        break;

      case "SHELL":
        if (this.state.shellVelocity !== 0) {
          this.x += this.state.shellVelocity;

          sprites.forEach((sprite) => {
            if (sprite instanceof Goomba && !sprite.isDead) {
              if (this.checkCollision(sprite)) {
                sprite.die();
                if (hud) hud.addScore(200);
              }
            } else if (sprite instanceof Turtle && sprite !== this) {
              if (this.checkCollision(sprite)) {
                if (sprite.state.current === "WALKING") {
                  sprite.enterShellState();
                  if (hud) hud.addScore(200);
                }
              }
            }
          });
        }
        if (this.state.shellKickCooldown > 0) {
          this.state.shellKickCooldown--;
        }
        break;
    }

    sprites.forEach((sprite) => {
      if (
        sprite instanceof Platform ||
        sprite instanceof Block ||
        sprite instanceof Pipe ||
        sprite instanceof Mushroom
      ) {
        if (this.checkCollision(sprite)) {
          this.resolveCollision(sprite);
        }
      } else if (sprite instanceof Player && !sprite.isDying) {
        if (this.checkCollision(sprite)) {
          this.handlePlayerCollision(sprite, hud);
        }
      }
    });

    return false;
  }

  handlePlayerCollision(player, hud) {
    const hitFromAbove =
      player.y + player.height < this.y + this.height / 2 &&
      player.velocityY > 0;

    if (hitFromAbove) {
      if (this.state.current === "WALKING") {
        this.enterShellState();
        player.velocityY = -8;
        if (hud) hud.addScore(200);
      } else if (
        this.state.current === "SHELL" &&
        this.state.shellVelocity === 0
      ) {
        const kickDirection = player.x < this.x;
        if (kickDirection !== this.state.lastKickDirection) {
          this.kickShell(kickDirection);
          if (hud) hud.addScore(400);
        }
      }
    } else if (!player.damageState.isInvincible) {
      if (this.state.current === "SHELL" && this.state.shellVelocity === 0) {
        const kickDirection = player.x < this.x;
        if (kickDirection !== this.state.lastKickDirection) {
          this.kickShell(kickDirection);
        }
      } else {
        player.takeDamage();
      }
    }
  }

  updateAnimation() {
    this.state.frameTimer++;
    if (this.state.frameTimer >= this.state.frameDelay) {
      this.state.frameTimer = 0;
      this.state.frameIndex = this.state.frameIndex === 0 ? 1 : 0;
    }
  }

  enterShellState() {
    this.state.current = "SHELL";
    this.state.shellVelocity = 0;
    this.height = this.shellHeight;
    this.y += 16;
    this.velocityX = 0;
    this.state.lastKickDirection = null;
  }

  kickShell(kickLeft) {
    if (this.state.shellKickCooldown === 0) {
      this.state.shellVelocity = kickLeft ? -8 : 8;
      this.state.shellKickCooldown = 10;
      this.state.lastKickDirection = kickLeft;
    }
  }

  resolveCollision(platform) {
    const overlapX = Math.min(
      this.x + this.width - platform.x,
      platform.x + platform.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - platform.y,
      platform.y + platform.height - this.y
    );

    if (overlapX < overlapY) {
      if (this.x < platform.x) {
        this.x = platform.x - this.width;
      } else {
        this.x = platform.x + platform.width;
      }

      if (this.state.current === "WALKING") {
        this.velocityX *= -1;
      } else if (
        this.state.current === "SHELL" &&
        this.state.shellVelocity !== 0
      ) {
        this.state.shellVelocity *= -1;
        this.state.lastKickDirection = !this.state.lastKickDirection;
      }
    } else {
      if (this.y < platform.y) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isGrounded = true;
      } else {
        this.y = platform.y + platform.height;
        this.velocityY = 0;
      }
    }
  }

  checkCollision(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }

  draw(ctx) {
    if (!this.spriteSheet.complete) return;

    const spriteset = this.isUnderground
      ? this.sprites.underground
      : this.sprites.overworld;

    if (this.state.current === "WALKING") {
      const frame = spriteset.walk[this.state.frameIndex];
      ctx.drawImage(
        this.spriteSheet,
        frame.x,
        frame.y,
        24,
        24,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.spriteSheet,
        spriteset.shell.x,
        spriteset.shell.y,
        24,
        12,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}
