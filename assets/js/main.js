(function() {

	'use strict'

	//------------
	//   Objects
	//------------
	var canvas = {
		width: 900,
		height: 500,
		background: "black",
		framesPerSecond: 60,
		netBackground: "white",
		init: function() {
			this.cacheDOM();
			this.render();
		},
		cacheDOM: function() {
			this.canvasElement = document.getElementById("canvas");
			this.canvasContext = this.canvasElement.getContext("2d");
		},
		render: function() {
			// Background
			this.canvasContext.fillStyle = this.background;
			this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

			// Net
			this.canvasContext.fillStyle = this.netBackground;
			this.canvasContext.beginPath();
			this.canvasContext.setLineDash([5, 5]);
			this.canvasContext.moveTo(canvas.width / 2, 10);
			this.canvasContext.lineTo(canvas.width / 2, canvas.height - 10);
			this.canvasContext.strokeStyle = this.netBackground;
			this.canvasContext.stroke();
			
			// Ball
			this.canvasContext.fillStyle = ball.background;
			this.canvasContext.beginPath();
			this.canvasContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
			this.canvasContext.fill();
			
			// Paddle (Player) 
			this.canvasContext.fillStyle = paddle.background;
			this.canvasContext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

			// Paddle (AI)
			this.canvasContext.fillStyle = paddle2.background;
			this.canvasContext.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
		},
		calculateMousePosition: function(event) {
			var canvasRectangle = canvas.canvasElement.getBoundingClientRect();
			var root = document.documentElement;
			var mouseX = event.clientX - canvasRectangle.left - root.scrollLeft;
			var mouseY = event.clientY - canvasRectangle.top - root.scrollTop;
			return {
				x: mouseX,
				y: mouseY
			}
		}
	}

	var paddle = {
		score: 0,
		width: 20,
		height: 100,
		x: 10,
		y: 200,
		speed: 5,
		background: "white",
		moveInterval: null,
		moving: false,
		collision: false,
		init: function() {
			this.cacheDOM();
		},
		cacheDOM: function() {
			this.DOMelement = document.getElementsByClassName("score-1")[0];
		},
		move: function(direction) {
			switch (direction) {
				case "up":
					this.y -= this.speed;
					break;
				case "down":
					this.y += this.speed;
					break;
			}
			canvas.render();
		},
		highlight: function() {
			this.background = "yellow";
			canvas.render();
			setTimeout(function() {
				paddle.background = "white";
				canvas.render();
			}, 200);
		},
		updateScore: function() {
			this.DOMelement.innerHTML = this.score;
		}
	}

	var paddle2 = {
		score: 0,
		width: 20,
		height: 100,
		x: 870,
		y: 200,
		speed: 5,
		background: "white",
		moveInterval: null,
		moving: false,
		collision: false,
		init: function() {
			this.cacheDOM();
			this.ai();
		},
		cacheDOM: function() {
			this.DOMelement = document.getElementsByClassName("score-2")[0];
		},
		highlight: function() {
			this.background = "yellow";
			canvas.render();
			setTimeout(function() {
				paddle2.background = "white";
				canvas.render();
			}, 200);
		},
		ai: function() {
			this.moveInterval = setInterval(function() {
				if (ball.y < paddle2.y + 50) {
					paddle2.y -= paddle2.speed;
				} else if (ball.y > paddle2.y + (paddle2.height - 50)) {
					paddle2.y += paddle2.speed;
				}
				canvas.render();
			}, 1000 / canvas.framesPerSecond);
		},
		updateScore: function() {
			this.DOMelement.innerHTML = this.score;
		}
	}

	var ball = {
		width: 10,
		height: 10,
		radius: 5,
		x: 445, 
		y: 245,
		speedX: 5,
		speedY: 5,
		background: "white",
		moveInterval: null,
		spawnDelay: 1000,
		init: function() {
			this.moveInterval = setInterval(function() {
				ball.move();
				if (ball.x < 0) {
					ball.reset();
					paddle2.score++;
					paddle2.updateScore();
				} else if (ball.x > canvas.width) {
					ball.reset();
					paddle.score++;
					paddle.updateScore();
				}
			}, 1000 / canvas.framesPerSecond);
		},
		move: function() {
			this.x += this.speedX;
			this.y += this.speedY;

			// Y Axis Collision
			if (this.x > canvas.width - ball.width + 10) {
				this.speedX = -this.speedX;
			}

			// X Axis Collision
			if(this.y > canvas.height) {
				this.speedY = -this.speedY;
			} else if (this.y < 0) {
				this.speedY = -this.speedY;
			}

			// Paddle 1 Collision
			if (this.x < paddle.width + paddle.x && this.y > paddle.y && this.y < paddle.y + paddle.height) {
				this.speedX = -this.speedX;
				this.collision();
				paddle.highlight();
			}

			// Paddle 2 Collision
			if (this.x > paddle2.x && this.y > paddle2.y  && this.y < paddle2.y + paddle2.height) {
				this.speedX = -this.speedX;
				this.collision();
				paddle2.highlight();
			}

			canvas.render();
		},
		collision: function() {
			this.speedY += 1;
			this.speedX += 1;
		},
		reset: function() {
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.speedY = 5;
			this.speedX = 5;
			clearInterval(this.moveInterval);
			setTimeout(function() {
				ball.init();
			}, this.spawnDelay);
		}
	}

	//------------
	//   Driver
	//------------
	canvas.init();
	ball.init();
	paddle.init();
	paddle2.init();

	//------------
	//   Events
	//------------
	// Key Down
	window.addEventListener("keydown", function(e) {
		var key = e.key;
		console.log(key);

		// Arrow Up
		if (e.key === "ArrowUp") {
			if (! paddle.moving) {
				paddle.moving = true;
				paddle.moveInterval = setInterval(function() {
					// Collision Detection For Paddle
					if (paddle.y !== 5) {
						paddle.move("up");
					}
				}, 1000 / canvas.framesPerSecond);
			}
		}
		
		// Arrow Down
		if (e.key === "ArrowDown") {
			if (! paddle.moving) {
				paddle.moving = true;
				paddle.moveInterval = setInterval(function() {
					// Collision Detection For Paddle
					if (paddle.y !== canvas.height - paddle.height - 5) {
						paddle.move("down");
					}
				}, 1000 / canvas.framesPerSecond);
			}
		}
	});

	// Key Up
	window.addEventListener("keyup", function(e) {
		clearInterval(paddle.moveInterval);
		paddle.moving = false;
	});


	// On Mouse Move
	canvas.canvasElement.addEventListener("mousemove", function(e) {
		var mousePos = canvas.calculateMousePosition(e);
		paddle.y = mousePos.y - (paddle.height / 2);
		canvas.render();
	});

}());

