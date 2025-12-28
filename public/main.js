class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    });

    this.configure();
  }
  configure() {
    this.screen = "home";

    this.instructionGiven = false;

    this.score = localStorage.getItem("axa-bird-game-score");

    if (this.score === null) {
      this.score = 0;
    }

    this.highScore = localStorage.getItem("axa-bird-game-highScore");

    if (this.highScore === null) {
      this.highScore = 0;
    }

    this.soundOn = true;
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.plugin(
      "rexroundrectangleplugin",
      "plugins/rexroundrectangleplugin.min.js",
      true
    );
    this.load.image("UIBackground", "backgrounds/background2.png");
    this.load.image("background", "backgrounds/background.png");
    this.load.image("bg2", "backgrounds/background2.png");
    this.load.image("logo", "UI/background-logo.png");
    this.load.image("heart", "player/heart.png");
    this.load.image("heart-filled", "player/heart-filled.png");
    this.load.image("star", "collectibles/star.png");
    this.load.image("home", "UI/home-icon.png");
    this.load.image("leaderboardIcon", "UI/leaderboard-icon.png");
    this.load.image("leaderboardGold", "UI/gold.png");
    this.load.image("leaderboardSilver", "UI/silver.png");
    this.load.image("leaderboardBronze", "UI/bronze.png");
    this.load.image("b1", "player/bird-111.png");
    this.load.image("b2", "player/bird-121.png");
    this.load.image("green1", "flappyBird/green1.png");
    this.load.image("green2", "flappyBird/green2.png");
    this.load.image("lightBase", "flappyBird/lightBase.png");
    this.load.image("star", "collectibles/start.png");
    this.load.image("addToLeaderboard", "flappyBird/add-to-leaderboard.png");
    this.load.image("goToLeaderboard", "flappyBird/go-to-leaderboard.png");
    this.load.image("restart", "flappyBird/restart.png");
    this.load.image("title", "flappyBird/title.png");

    for (let i = 1; i <= 10; i++) {
      this.load.image(`bb${i}`, `flappyBird/b${i}.png`);
    }

    this.load.audio("jump", "sounds/jump.mp3");
    this.load.audio("product", "sounds/product.mp3");
    this.load.audio("enemy", "sounds/enemy.mp3");
    this.load.audio("lost", "sounds/lost.mp3");
    this.load.audio("lost2", "sounds/lost2.mp3");
    this.load.audio("woosh", "sounds/Woosh.mp3");
    this.load.audio("explosion", "sounds/explosion.mp3");
  }

  create() {
    const loader = document.querySelector("#loader");
    if (loader) {
      loader.style.display = "none";
    }

    this.scoreText2 = this.add
      .text(400, 200, this.score, {
        fontFamily: "MyLocalFont",
        stroke: "#000000",
        fontSize: "100px",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(-2)
      .setVisible(false);
    this.addUI();
    this.canJump = true;
  }

  addUI() {
    if (this.screen === "home") {
      // this.addHomeUI();
      this.startGame();
    } else if (this.screen === "restart") {
      this.addRestartUI();
    } else if (this.screen === "replay") {
      this.addReplayUI();
    } else if (this.screen === "info") {
      this.addInfoUI();
    } else if (this.screen === "leaderboard") {
      this.addLeaderboardUI();
    }
  }
  addHomeUI() {
    this.UIBackground = this.add.image(400, 600, "UIBackground").setScale(1);

    this.infoIcon = this.add
      .image(740, 55, "infoIcon")
      .setScale(0.4)
      .setInteractive();

    this.infoIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.infoIcon,
        scale: 0.5,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.infoIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              this.screen = "info";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.logo = this.add.image(400, 200, "logo").setScale(1);

    this.titleText = this.add
      .text(
        400,
        400,
        "Jump your way upwards and collect\nAXA products. Unlock hidden offers in\nthe Rabble cashback app the higher\nscore you get.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#000",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.optionsContainer = this.add
      .rexRoundRectangle(400, 900, 620, 480, 50, 0xffffff)
      .setDepth(5)
      .setScrollFactor(0);

    this.birdImage = this.add
      .image(670, 690, "b1")
      .setScale(1.5)
      .setDepth(Infinity);
    this.birdImage.scaleX = -1.5;

    this.termsText = this.add
      .text(
        400,
        1170,
        "Powered by Md Mahabub. By playing this game you accept these Terms & policies.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "20px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    this.termsText.on("pointerup", () => {
      const url = "https://www.proviva.se";
      window.open(url, "_blank");
    });

    this.option1 = this.add
      .rexRoundRectangle(400, 830, 520, 100, 50, 0xf3e3a3)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option1Text = this.add
      .text(400, 830, "Unlocked Offers", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);
    // color: "#2e218e",

    this.option2 = this.add
      .rexRoundRectangle(400, 945, 520, 100, 50, 0xfaa7ab)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option2Text = this.add
      .text(400, 945, "Leaderboard", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.option3 = this.add
      .rexRoundRectangle(400, 1060, 520, 100, 50, 0x4e316e)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option3Text = this.add
      .text(400, 1060, "Play Game", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.bestScoreText = this.add
      .text(320, 730, `BEST: ${this.highScore}`, {
        fontFamily: "RakeslyRG",
        fontSize: "36px",
        stroke: "#000",
        strokeThickness: 1,
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.lastScoreText = this.add
      .text(480, 730, `LAST: ${this.score}`, {
        fontFamily: "RakeslyRG",
        fontSize: "36px",
        stroke: "#000",
        strokeThickness: 1,
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.divider = this.add
      .rectangle(400, 730, 5, 70, 0xeeeeee)
      .setDepth(6)
      .setScrollFactor(0);

    this.option1.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option1, this.option1Text],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option1, this.option1Text],
            scale: 1,
            duration: 100,

            onComplete: () => {
              this.screen = "codes";
              this.scene.restart();
            },
          });
        },
      });
    });

    this.option2.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option2, this.option2Text],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option2, this.option2Text],
            scale: 1,
            duration: 100,

            onComplete: () => {
              this.screen = "leaderboard";
              this.scene.restart();
            },
          });
        },
      });
    });

    this.option3.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option3, this.option3Text],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option3, this.option3Text],
            scale: 1,
            duration: 100,

            onComplete: () => {
              this.elements = [
                this.UIBackground,
                this.logo,
                this.titleText,
                this.optionsContainer,
                this.birdImage,
                this.termsText,
                this.option1,
                this.option1Text,
                this.option2,
                this.option2Text,
                this.option3,
                this.option3Text,
                this.bestScoreText,
                this.lastScoreText,
                this.divider,
                this.infoIcon,
              ];

              this.elements.forEach((element) => {
                element.destroy();
              });

              this.startGame();
            },
          });
        },
      });
    });
  }
  addRestartUI() {
    this.UIBackground = this.add.image(400, 600, "bg2");
    this.yourScore = this.add
      .text(400, 220, "YOUR SCORE", {
        fontFamily: "MyLocalFont",
        fontSize: "50px",
        color: "#fff",
        align: "center",
        stroke: "#702300",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
    this.scoreText = this.add
      .text(400, 350, this.score, {
        fontFamily: "MyLocalFont",
        fontSize: "80px",
        color: "#fff",
        align: "center",
        stroke: "#ab4400ff",
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
    this.usernameInput = this.add.dom(400, 800).createElement(
      "input",
      `
      	outline: none;
      	border: none;
      	padding: 0px 30px;
      	width: 440px;
      	height: 70px;
      	font-size: 30px;
      	font-weight: bold;
      	background: #ebf4f5;
      	border-radius: 0px;
        stroke: 6px solid #d95300
      `
    );

    this.usernameInput.node.setAttribute("placeholder", "Name");

    this.usernameInput.node.setAttribute("maxLength", "15");

    this.option1 = this.add
      .image(400, 900, "addToLeaderboard")
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(1)
      .setScale(1.1);
    this.option1.setInteractive();

    this.option1Text = this.add
      .text(400, 700, "OR", {
        fontFamily: "MyLocalFont",
        fontSize: "50px",
        color: "#fff",
        align: "center",
        stroke: "#9d3303",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.option2 = this.add
      .image(400, 600, "restart")
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option1.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option1],
        scale: 1,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option1],
            scale: 1.1,
            duration: 100,

            onComplete: () => {
              const username = this.usernameInput.node.value.trim();
              if (username === "") {
                this.notify(1); // "Enter your username!"
                return;
              }
              if (this.score > 0) {
                this.addScoreToLeaderboard(username, this.score);
                this.screen = "leaderboard";
              }

              this.scene.restart();
            },
          });
        },
      });
    });

    this.option2.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option2],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option2],
            scale: 1,
            duration: 100,

            onComplete: () => {
              this.elements = [
                this.UIBackground,
                this.yourScore,
                this.scoreText,
                this.option1,
                this.option1Text,
                this.option2,
                this.termsText,
                this.usernameInput,
              ];

              this.elements.forEach((element) => {
                element.destroy();
              });

              this.startGame();
            },
          });
        },
      });
    });

    this.termsText = this.add
      .text(
        400,
        1170,
        "Developed by Md Mahabub. By playing this game you accept these Terms & policies.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "20px",
          color: "#000",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    this.termsText.on("pointerup", () => {
      const url = "https://www.proviva.se";
      window.open(url, "_blank");
    });
  }
  addReplayUI() {
    this.background = this.add
      .image(400, 600, "UIBackground")
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(0);

    this.homeIcon = this.add
      .image(740, 55, "home")
      .setScale(0.5)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.4,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.5,
            duration: 100,

            onComplete: () => {
              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.scoreTitle = this.add
      .text(
        400,
        170,
        this.score > this.tempHighScore ? "New highscore" : "Your score",
        {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#000",
          align: "center",
          stroke: "#00139f",
          strokeThickness: 1,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.scoreBox = this.add
      .rexRoundRectangle(400, 250, 300, 70, 20, 0x4e316e)
      .setDepth(10)
      .setScrollFactor(0);

    this.scoreImage = this.add
      .image(265, 250, "star")
      .setDepth(Infinity)
      .setScrollFactor(0)
      .setScale(0.9);

    this.scoreText = this.add
      .text(400, 250, this.score, {
        fontFamily: "RakeslyRG",
        fontSize: "40px",
        color: "#fff",
        align: "center",
        stroke: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.playButton = this.add
      .image(400, 600, "play")
      .setScale(1.3)
      .setInteractive();

    this.playTitle = this.add
      .text(400, 850, "Play again", {
        fontFamily: "RakeslyRG",
        fontSize: "40px",
        color: "#000",
        align: "center",
        stroke: "#000",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.playButton.on("pointerdown", () => {
      this.tweens.add({
        targets: this.playButton,
        scale: 1.1,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.playButton,
            scale: 1.3,
            duration: 100,

            onComplete: () => {
              this.elements = [
                this.background,
                this.homeIcon,
                this.scoreTitle,
                this.scoreBox,
                this.scoreImage,
                this.scoreText,
                this.playButton,
                this.playTitle,
                this.usernameInput,
              ];

              this.elements.forEach((element) => {
                element.destroy();
              });

              this.startGame();
            },
          });
        },
      });
    });
  }
  addLeaderboardUI(data) {
    this.background = this.add
      .image(400, 600, "UIBackground")
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(0)
      .setAlpha(0.8);

    if (this.remember) {
      this.userIcon = this.add
        .image(650, 55, "userIcon")
        .setScale(0.5)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.userIcon.on("pointerdown", () => {
        this.tweens.add({
          targets: this.userIcon,
          scale: 0.4,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: this.userIcon,
              scale: 0.5,
              duration: 100,

              onComplete: () => {
                this.userIcon.destroy();

                this.notify(4);

                this.username = null;

                this.email = null;

                this.remember = false;

                localStorage.removeItem("axa-bird-game-remember");

                localStorage.removeItem("axa-bird-game-username");

                localStorage.removeItem("axa-bird-game-email");
              },
            });
          },
        });
      });
    }

    this.homeIcon = this.add
      .image(740, 55, "home")
      .setScale(0.4)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.5,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.leaderboardImage = this.add.image(400, 170, "leaderboardIcon");

    this.leaderboardTitle = this.add
      .text(400, 310, "Leaderboard", {
        fontFamily: "RakeslyRG",
        fontSize: "50px",
        color: "#fff",
        align: "center",
        stroke: "#fff",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    // Get leaderboard from localStorage
    const leaderboardData = localStorage.getItem("axa-bird-game-leaderboard");
    this.scores = leaderboardData ? JSON.parse(leaderboardData) : [];

    this.players = this.add.dom(400, 375, "div");

    this.players.node.style = `
      	margin: 0px 0px 0px -300px;
      	padding: 0px 20px 0px 0px;
      	width: 600px;
      	height: 770px;
      	display: flex;
      	flex-direction: column;
      	align-items: center;
      	justify-content: center;
      	overflow-y: auto;
      `;

    this.players.node.innerHTML = ``;

    this.scores.forEach((user, index) => {
      this.players.node.innerHTML += `
      		<div class="scoreBox">
      			<div class="scoreImageBox">
      				${
                index < 3
                  ? `<img class="scoreImage" src="assets/positions/${
                      index + 1
                    }.png"/>`
                  : `<div class="scoreText"> ${index + 1}. </div>`
              }
      			</div>

      			<div class="${
              user.username === this.username ? "scoreTitlePlus" : "scoreTitle"
            }">
      				${user.username}
      			</div>

      			<div class="${
              user.username === this.username ? "scoreValuePlus" : "scoreValue"
            }">
      				${user.score}
      			</div>
      		</div>
      	`;
    });
  }
  addCodesUI() {
    this.background = this.add
      .image(400, 600, "UIBackground")
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(0);

    this.homeIcon = this.add
      .image(740, 55, "home")
      .setScale(0.4)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.5,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.unlockedImage = this.add.image(400, 170, "unlockedIcon");

    this.unlockedTitle = this.add
      .text(400, 310, "Unlocked codes", {
        fontFamily: "RakeslyRG",
        fontSize: "45px",
        color: "#000",
        align: "center",
        stroke: "#000",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.codes.forEach((code, index) => {
      const y = 450 + index * 110;

      const codeBox = this.add
        .rexRoundRectangle(400, y, 520, 100, 20, 0xffffff)
        .setDepth(5)
        .setScrollFactor(0);

      const scoreImage = this.add
        .image(192, y, "star")
        .setDepth(Infinity)
        .setScrollFactor(0)
        .setScale(0.7);

      const scoreText = this.add
        .text(300, y, `${code.points} points`, {
          fontFamily: "RakeslyRG",
          fontSize: "32px",
          color: "#000",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(6);

      const codeText = this.add
        .text(515, y, code.code, {
          fontFamily: "RakeslyRG",
          fontSize: "32px",
          color: "#000",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(6);

      const codeCopy = this.add
        .image(610, y - 3, "copyIcon")
        .setDepth(Infinity)
        .setScrollFactor(0)
        .setScale(0.1)
        .setInteractive();

      codeCopy.on("pointerdown", () => {
        this.tweens.add({
          targets: codeCopy,
          scale: 0.08,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: codeCopy,
              scale: 0.1,
              duration: 100,

              onComplete: () => {
                navigator.clipboard.writeText(code.code);

                this.notify(5);
              },
            });
          },
        });
      });
    });

    this.rabbleButton = this.add
      .rexRoundRectangle(400, 1060, 420, 100, 50, 0x4e316e)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.rabbleButtonText = this.add
      .text(400, 1060, "Go to Rabble", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.rabbleButton.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.rabbleButton, this.rabbleButtonText],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.rabbleButton, this.rabbleButtonText],
            scale: 1,
            duration: 100,

            onComplete: () => {},
          });
        },
      });
    });
  }
  addUnlockedUI() {
    this.UIBackground = this.add.rectangle(400, 600, 800, 1200, 0xffffff);

    this.homeIcon = this.add
      .image(740, 55, "home")
      .setScale(0.5)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.4,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.5,
            duration: 100,

            onComplete: () => {
              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.scoreBox = this.add
      .rexRoundRectangle(400, 200, 300, 70, 20, 0x4e316e)
      .setDepth(10)
      .setScrollFactor(0);

    this.scoreImage = this.add
      .image(265, 200, "star")
      .setDepth(Infinity)
      .setScrollFactor(0)
      .setScale(0.9);

    this.scoreText = this.add
      .text(400, 200, this.score, {
        fontFamily: "RakeslyRG",
        fontSize: "40px",
        color: "#fff",
        align: "center",
        stroke: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.ballImage = this.add
      .image(400, 100, "logo")
      .setScale(0.7)
      .setDepth(Infinity);

    if (!this.unlocked) {
      this.scene.restart();
      return;
    }

    this.titleText = this.add
      .text(
        400,
        340,
        `Congrats! You score over ${this.unlocked.points}\npoints and unlocked a special\ndeal in Rabble.`,
        {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#000",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.productImage = this.add.image(400, 595, "product1").setScale(1.1);

    this.productBox = this.add
      .rexRoundRectangle(400, 850, 520, 100, 20, 0xebf4f5)
      .setDepth(Infinity)
      .setScrollFactor(0);

    this.codeText = this.add
      .text(235, 850, this.unlocked.code, {
        fontFamily: "RakeslyRG",
        fontSize: "35px",
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(Infinity);

    this.codeCopy = this.add
      .image(485, 850, "copyIcon")
      .setDepth(Infinity)
      .setScrollFactor(0)
      .setScale(0.1)
      .setInteractive();

    this.copyCodeText = this.add
      .text(575, 850, "Copy Code", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#bababa",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(Infinity)
      .setInteractive();

    this.codeCopy.on("pointerdown", () => {
      this.tweens.add({
        targets: this.codeCopy,
        scale: 0.08,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.codeCopy,
            scale: 0.1,
            duration: 100,

            onComplete: () => {
              navigator.clipboard.writeText(this.unlocked.code);

              this.notify(6);
            },
          });
        },
      });
    });

    this.copyCodeText.on("pointerdown", () => {
      this.tweens.add({
        targets: this.codeCopy,
        scale: 0.08,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.codeCopy,
            scale: 0.1,
            duration: 100,

            onComplete: () => {
              navigator.clipboard.writeText(this.unlocked.code);

              this.notify(6);
            },
          });
        },
      });
    });

    this.option1 = this.add
      .rexRoundRectangle(400, 975, 520, 100, 50, 0x335519)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option1Text = this.add
      .text(400, 975, "Redeem code on Rabble", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.option2 = this.add
      .rexRoundRectangle(400, 1090, 520, 100, 50, 0x4e316e)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive();

    this.option2Text = this.add
      .text(400, 1090, "Play again", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    this.option1.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option1, this.option1Text],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option1, this.option1Text],
            scale: 1,
            duration: 100,

            onComplete: () => {},
          });
        },
      });
    });

    this.option2.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.option2, this.option2Text],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [this.option2, this.option2Text],
            scale: 1,
            duration: 100,

            onComplete: () => {
              let elements = [
                this.UIackground,
                this.scoreText,
                this.yourScore,
                this.option1,
                this.option1Text,
                this.option2,
                this.termsText,
              ];

              elements.forEach((element) => {
                if (element) {
                  element.destroy();
                }
              });

              this.startGame();
            },
          });
        },
      });
    });

    this.termsText = this.add
      .text(
        400,
        1170,
        "Developed by Md. Mahabub. By playing this game you accept these Terms & policies.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "20px",
          color: "#000",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    this.termsText.on("pointerup", () => {
      const url = "https://www.proviva.se";
      window.open(url, "_blank");
    });
  }
  addInfoUI() {
    this.UIBackground = this.add.rectangle(400, 600, 800, 1200, 0xffffff);

    this.homeIcon = this.add
      .image(740, 55, "home")
      .setScale(0.4)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.4,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.5,
            duration: 100,

            onComplete: () => {
              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.infoImage = this.add.image(400, 170, "info").setScale();

    this.infoTitle = this.add
      .text(400, 310, "Information", {
        fontFamily: "RakeslyRG",
        fontSize: "40px",
        color: "#000",
        align: "center",
        stroke: "#000",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.infoText = this.add
      .text(
        400,
        710,
        "Desktop Controls: Use left and right arrow keys\nto control the ball.\n\nMobile Controls: Touch left and right sides of the\nscreen to control the ball.\n\nSpring: Allows you to jump higher.\n\nJetpack: Gives you flying ability for a few seconds.\n\nProducts: Collect them to win extra points\nand rewards.\n\nMonsters: AVOID! You will lost the game if you\ncollide with them.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "35px",
          color: "#000",
          align: "center",
          stroke: "#000",
          strokeThickness: 0,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
  }

  startGame() {
    this.variables();
    this.createAnimations();
    this.addBackground();
    // this.addGameUI();
    this.addSounds();
    this.addScores();
    // this.addLife();
    this.instruction();
  }
  variables() {
    this.lastPipe = null;
  }
  createAnimations() {
    const birdFrames = [];
    for (let i = 1; i <= 2; ++i) {
      birdFrames.push({ key: `b${i}` });
    }
    this.anims.create({
      key: "birdAnimation",
      frames: birdFrames,
      frameRate: 15,
      repeat: -1,
    });

    const bombFrames = [];
    for (let i = 1; i <= 10; ++i) {
      bombFrames.push({ key: `bb${i}` });
    }
    this.anims.create({
      key: "bombAnimation",
      frames: bombFrames,
      frameRate: 15,
      repeat: -1,
    });
  }
  addBackground() {
    // this.bg = this.physics.add.image(0, 0, "bg2").setOrigin(0, 0);
    // this.bg.setScrollFactor(0);
    this.bg = this.add.tileSprite(400, 520, 2263, 1200, "bg2").setScale(0.9);
    this.bg.setScrollFactor(0);
    this.gameBg = this.add
      .tileSprite(0, 1200, 1800, 300, "background")
      .setDepth(2);
    this.gameBg.setScrollFactor(0);

    this.playerImg = this.physics.add
      .sprite(400, 490, "b1")
      .setScale(1)
      .setDepth(4)
      .setCircle(32, 35, 30)
      .setAngle(60);
    this.playerImg.anims.play("birdAnimation");
    this.tweens.add({
      targets: this.playerImg,
      y: "+=50",
      duration: 1000,
      ease: "Sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }
  addGameUI() {
    this.homeIcon = this.add
      .image(660, 55, "home")
      .setScale(0.4)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.3,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              this.playing = false;

              this.screen = "home";

              this.scene.restart();
            },
          });
        },
      });
    });

    this.soundIcon = this.add
      .image(740, 55, this.soundOn ? "soundOn" : "soundOff")
      .setScale(0.4)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(Infinity);

    this.soundIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.soundIcon,
        scale: 0.3,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.soundIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              if (this.soundOn) {
                this.sound.stopAll();

                this.soundOn = false;

                this.soundIcon.setTexture("soundOff");
              } else {
                this.soundOn = true;

                this.soundIcon.setTexture("soundOn");
              }
            },
          });
        },
      });
    });
  }
  addSounds() {
    this.jumpSound = this.sound.add("jump");

    this.productSound = this.sound.add("product");

    this.lostSound = this.sound.add("lost");

    this.explosionSound = this.sound.add("explosion");

    this.lostSound2 = this.sound.add("lost2");

    this.hoopSound = this.sound.add("woosh");
  }
  addScores() {
    this.score = 0;
    this.scoreText2 = this.add
      .text(400, 200, this.score, {
        fontFamily: "MyLocalFont",
        stroke: "#822d13ff",
        fontSize: "80px",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
    this.scoreText2.setScale();
    this.scoreText2.setVisible(false);
  }
  addLife() {
    this.life = 3;
    this.lifes = [];
    this.lifeBox = this.add
      .rexRoundRectangle(340, 33, 140, 45, 15, 0x4e316e)
      .setDepth(10)
      .setScrollFactor(0)
      .setOrigin(0);

    for (let i = 0; i < 3; i++) {
      this.lifeImage = this.add
        .image(300 + 70 + i * 40, 55, "heart")
        .setDepth(Infinity)
        .setScrollFactor(0)
        .setScale(0.8);
    }
    for (let i = 0; i < this.life; i++) {
      this.lifeImage = this.add
        .image(300 + 70 + i * 40, 55, "heart-filled")
        .setDepth(Infinity)
        .setScrollFactor(0)
        .setScale(0.8);
      this.lifes.push(this.lifeImage);
    }
  }
  instruction() {
    this.instructionGiven = false;

    if (!this.instructionGiven) {
      this.title = this.physics.add.sprite(400, 250, "title").setScale(1.15);
      document.fonts.load("32px MyLocalFont").then(() => {
        this.playText = this.add
          .text(400, 800, "Click to Play", {
            fontFamily: "MyLocalFont",
            stroke: "#9d3303",
            fontSize: "50px",
            strokeThickness: 6,
          })
          .setOrigin(0.5)
          .setDepth(2);
      });
      this.option1 = this.add
        .image(400, 950, "goToLeaderboard")
        .setDepth(5)
        .setScrollFactor(0)
        .setAlpha(1)
        .setScale(1);
      this.option1.setInteractive();
      this.playText.setInteractive({ useHandCursor: true });
      this.option1.on("pointerdown", () => {
        this.tweens.add({
          targets: [this.option1],
          scale: 0.8,
          duration: 100,
          onComplete: () => {
            this.tweens.add({
              targets: [this.option1],
              scale: 1,
              duration: 100,
              onComplete: () => {
                this.screen = "leaderboard";
                this.scene.restart();
              },
            });
          },
        });
      });

      this.playText.on("pointerdown", () => {
        this.tweens.add({
          targets: [this.playText],
          scale: 0.8,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: [this.playText],
              scale: 1,
              duration: 100,
              onComplete: () => {
                this.start();
                this.playText.destroy();
                this.playerImg.destroy();
                this.option1.destroy();
                this.title.destroy();
              },
            });
          },
        });
      });
    }
  }

  start() {
    this.playing = true;
    this.devils = [];
    this.devilCollides = [];
    this.products = [];
    this.productCollides = [];
    this.devilsAndProductY = 400;
    this.pointTimes = 500;
    this.scoreText2.setVisible(true);
    this.createPlayer();
    this.createControls();
    this.createTouchControls();
    this.addDevilsAndProducts();
  }

  createPlayer() {
    this.player = this.physics.add
      .sprite(600, 400, "bird1")
      .setScale(0.9)
      .setDepth(4)
      .setCircle(25, 35, 30)
      .setAngle(60);

    this.player.anims.play("birdAnimation");

    this.player.speed = 200;

    this.player.moveDirection = {
      right: false,
    };

    this.player.flying = false;

    this.player.lost = false;

    this.player.ended = false;

    this.player.body.setGravityY(2000);
    this.cameras.main.startFollow(this.player);
    this.player.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (body.gameObject === this.player) {
        this.player.lost = true;
      }
    });

    this.cameras.main.setBounds(0, 0, 800, 1200, true);

    this.leftWall = this.physics.add
      .image(0, 600, null)
      .setSize(1, 1200)
      .setVisible(false)
      .setVelocityX(this.player.speed);
    // this.gameBg2 = this.physics.add
    //   .image(400, 1120, "background")
    //   .setDepth(2)
    //   .setImmovable(true)
    //   .setAlpha(0.01)
    //   .setVelocityX(this.player.speed);

    // this.physics.add.collider(
    //   this.player,
    //   this.gameBg2,
    //   () => {
    //     this.player.lost = true;
    //   },
    //   null,
    //   this
    // );
    this.player.setVelocityY(-650);
  }
  createControls() {
    this.player.moveDirection.right = true;
    this.input.keyboard.on("keydown", (event) => {
      if (event.key === " " && this.canJump && !this.player.lost) {
        this.canJump = true;
        this.player.setVelocityY(-650);
        this.tweens.add({
          targets: this.player,
          duration: 100,
          angle: 10,
          onComplete: () => {
            this.tweens.add({
              targets: this.player,
              duration: 200,
              angle: 60,
              onComplete: () => {},
            });
          },
        });

        if (this.soundOn) {
          this.jumpSound.play();
        }
        setTimeout(() => {
          this.canJump = true;
        }, 800);
      } else {
      }
    });

    this.input.keyboard.on("keyup", (event) => {
      if (event.key === " ") {
        this.player.moveDirection.right = false;
      }
    });
  }
  createTouchControls() {
    this.touchLeft = this.add
      .rectangle(200, 600, 400, 1200, 0xffffff)
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(0.001)
      .setInteractive();

    this.touchRight = this.add
      .rectangle(600, 600, 400, 1200, 0xffffff)
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(0.001)
      .setInteractive();

    this.touchLeft.on("pointerdown", () => {
      if (!this.player.lost) {
        this.player.setVelocityY(-650);
        this.tweens.add({
          targets: this.player,
          duration: 100,
          angle: 10,
          onComplete: () => {
            this.tweens.add({
              targets: this.player,
              duration: 200,
              angle: 60,
              onComplete: () => {},
            });
          },
        });

        if (this.soundOn) {
          this.jumpSound.play();
        }
      }
    });

    this.touchRight.on("pointerdown", () => {
      if (!this.player.lost) {
        this.player.setVelocityY(-650);
        this.tweens.add({
          targets: this.player,
          duration: 100,
          angle: 10,
          onComplete: () => {
            this.tweens.add({
              targets: this.player,
              duration: 200,
              angle: 60,
              onComplete: () => {},
            });
          },
        });

        if (this.soundOn) {
          this.jumpSound.play();
        }
      }
    });
  }
  addGround() {
    this.ground = this.physics.add
      .image(this.player.x + 3200, 1020, "ground")
      .setScale(1)
      .setVelocityX(20);
    this.physics.world.on("worldstep", () => {
      if (this.ground.x <= this.player.x + 802) {
        this.addGround();
      }
    });
  }

  addDevilsAndProducts() {
    if (this.player.speed < 250) {
      this.player.speed += 10;
    }
    this.updatePlayerControls();
    this.generatePipeAndCoin();
  }

  generatePipeAndCoin() {
    this.pipes = this.physics.add.group();
    this.coins = this.physics.add.group();

    this.spawn();

    // Colliders
    this.physics.add.collider(
      this.player,
      this.pipes,
      () => {
        this.pipes.setVelocity(0, 0);
        this.coins.setVelocity(0, 0);
        this.player.lost = true;
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );
  }

  spawn() {
    if (this.player.speed < 250) {
      this.player.speed += 5;
    }
    this.updatePlayerControls();

    const x = this.player.x + 800;
    const y = this.getRandomY();

    this.spawnPipes(x, y);
    this.spawnCoin(x, y);

    this.time.delayedCall(3000, this.spawn, [], this);
  }

  getRandomY() {
    return Phaser.Math.Between(1000, 1500);
  }

  spawnPipes(x, y) {
    const sy = Phaser.Math.Between(100, 140);

    let color1 = "green1";
    let color2 = "green2";
    let color3 = "lightBase";

    const pipeTop = this.pipes.create(x, y - sy - 1400, color2).setScale(0.65);

    pipeTop.body
      .setSize(
        pipeTop.width * 0.6, // width
        pipeTop.height * 1 // height
      )
      .setOffset(
        pipeTop.width * 0.2, // X offset (center)
        pipeTop.height * 0 // Y offset
      );
    const pipeBottom = this.pipes.create(x, y, color1).setScale(0.65);

    pipeBottom.body
      .setSize(pipeBottom.width * 0.6, pipeBottom.height * 1)
      .setOffset(pipeBottom.width * 0.2, pipeBottom.height * 0);

    const pipeTopBase = this.pipes
      .create(x, 0, `${color3}`)
      .setScale(0.65)
      .setAngle(180);
    const pipeBottomBase = this.pipes
      .create(x, 1050, `${color3}`)
      .setScale(0.65);

    this.lastPipe = pipeBottom;
  }

  spawnCoin(x, y) {
    let y2 = this.getRandomY();
    let coin = this.coins.create(x + 300, y2 - 600, "star").setScale(0.8);
    // .setDepth(-1);
  }

  collectCoin(bird, coin) {
    coin.disableBody(true, true);
    if (this.soundOn) {
      this.productSound.play();
    }
    this.score += 1;
  }

  notify(code) {
    let message, x, y;

    if (code === 1) {
      message = "Enter your username!";

      x = 400;
      y = 100;
    } else if (code === 2) {
      message = "Invalid email!";

      x = 400;
      y = 100;
    } else if (code === 3) {
      message = "Username already taken!";

      x = 400;
      y = 100;
    } else if (code === 4) {
      message = "User removed sucessfully";

      x = 400;
      y = 40;
    } else if (code === 5) {
      message = "Code copied to clipboard";

      x = 400;
      y = 365;
    } else if (code === 6) {
      message = "Code copied to clipboard";

      x = 400;
      y = 890;
    }

    const notificationText = this.add
      .text(x, y, message, {
        fontFamily: "RakeslyRG",
        fontSize: "35px",
        color: "#f20071",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setAlpha(1)
      .setDepth(Infinity);

    this.tweens.add({
      targets: notificationText,
      alpha: 1,
      duration: 200,

      onComplete: () => {
        this.time.addEvent({
          delay: 1000,

          callback: () => {
            this.tweens.add({
              targets: notificationText,
              alpha: 0,
              duration: 200,

              onComplete: () => {
                notificationText.destroy();
              },
            });
          },
        });
      },
    });
  }

  addScoreToLeaderboard(username, score) {
    // Get current leaderboard from localStorage
    const leaderboardData = localStorage.getItem("axa-bird-game-leaderboard");
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    // Check if username already exists
    const existingIndex = leaderboard.findIndex(
      (user) => user.username === username
    );

    if (existingIndex !== -1) {
      // Update score only if new score is higher
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
      }
    } else {
      // Add new entry
      leaderboard.push({ username, score });
    }

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    // Save back to localStorage
    localStorage.setItem(
      "axa-bird-game-leaderboard",
      JSON.stringify(leaderboard)
    );
  }
  randomBetween(min, max) {
    return Phaser.Math.Between(min, max);
  }

  update() {
    if (this.playing) {
      this.gameBg.tilePositionX = this.cameras.main.scrollX;
      this.bg.tilePositionX = this.cameras.main.scrollX * 0.2;
      this.updateScore();
      this.updateCameraBounds();
      this.checkPlayerLost();
    }
  }
  updatePlayerControls() {
    if (!this.player.lost) {
      this.player.setVelocityX(this.player.speed);
      this.leftWall.setVelocityX(this.player.speed);
    }
  }
  updateCameraBounds() {
    if (this.player) {
      if (!this.player.lost) {
        this.cameraBound = this.player.x - 400;
        // this.cameraBound = 100;
        this.cameras.main.setBounds(this.cameraBound, 0, 1200, 0, true);
      }
    }
  }
  checkPlayerLost() {
    if (this.player && !this.player.lost) {
      if (this.player.y > 1020 || this.player.y < 0) {
        this.player.lost = true;
        this.player.setVelocity(0, 0);
        this.player.body.setGravityY(0);
      }
    }

    if (this.player && this.player.lost && !this.player.ended) {
      this.player.ended = true;
      this.player.setVelocity(0, 0);
      this.player.body.setGravityY(0);
      this.player.anims.play("bombAnimation");
      this.tweens.add({
        targets: this.player,
        angle: 100,
        duration: 100, // time to reach -30
        ease: "Sine.easeOut",
      });
      this.player.setVelocityX(0);
      this.sound.stopAll();

      if (this.soundOn) {
        this.explosionSound.play({
          rate: 1.5,
          volume: 0.7,
        });

        setTimeout(() => {
          // this.lostSound2.play();
        }, 200);
      }

      this.time.addEvent({
        delay: 100,

        callback: () => {
          this.cameras.main.fadeOut(500);

          this.time.addEvent({
            delay: 1000,

            callback: () => {
              this.tempHighScore = this.highScore;

              if (this.score > this.highScore) {
                this.highScore = this.score;
              }

              localStorage.setItem("axa-bird-game-highScore", this.highScore);

              localStorage.setItem("axa-bird-game-score", this.score);

              this.playing = false;

              // console.log(this.remember, this.score);

              this.screen = "restart";
              this.scene.restart();
            },
          });
        },
      });
    }
  }
  updateScore() {
    if (this.scoreText2) {
      this.scoreText2.setText(this.score);
    }
  }
}

const game = new Phaser.Game({
  parent: "game",
  type: Phaser.AUTO,
  width: 800,
  height: 1200,
  border: 2,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  input: {
    activePointers: 3,
  },
  scene: [Game],
});

window.oncontextmenu = (event) => {
  event.preventDefault();
};

console.warn = () => {
  return false;
};
