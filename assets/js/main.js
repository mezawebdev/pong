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
		width: 20,
		height: 100,
		x: 10,
		y: 200,
		speed: 5,
		background: "white",
		moveInterval: null,
		moving: false,
		collision: false,
		render: function() {
			
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
		init: function() {
			this.moveInterval = setInterval(function() {
				ball.move();
			}, 1000 / canvas.framesPerSecond);
		},
		move: function() {
			this.x += this.speedX;
			this.y += this.speedY;

			// Y Axis Collision
			if (this.x > canvas.width - ball.width + 10) {
				this.speedX = -this.speedX;

			// Paddle Collision
			} else if (this.x < paddle.width + paddle.x && this.y > paddle.y && this.y < paddle.y + paddle.height) {
				this.speedX = -this.speedX;
				paddle.highlight();
			}

			// X Axis Collision
			if(this.y > canvas.height) {
				this.speedY = -this.speedY;
			} else if (this.y < 0) {
				this.speedY = -this.speedY;
			}
			canvas.render();
		}	
	}

	//------------
	//   Driver
	//------------
	canvas.init();
	ball.init();

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


	// Mouse detection
	canvas.canvasElement.addEventListener("mousemove", function(e) {
		var mousePos = canvas.calculateMousePosition(e);
		paddle.y = mousePos.y - (paddle.height / 2);
		canvas.render();
	});

}());

