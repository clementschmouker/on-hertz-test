
const CANVAS = document.querySelector('#canvas');
const CTX = CANVAS.getContext('2d');
const COORDINATES = document.querySelector('.coordinates');

CANVAS.width = CANVAS.clientWidth;
CANVAS.height = CANVAS.clientHeight;


// Utility Classes
class Vector2 {
	x = 0;
	y = 0;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function getDistance(dot1, dot2) {
    var x1 = dot1.x,
        y1 = dot1.y,
        x2 = dot2.x,
        y2 = dot2.y;
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function setLimit(x, y, element) {
	const dist = getDistance({x, y}, element.position);
    if (dist <= element.radius) {
        return {x: x, y: y};
    } 
    else {
        x = x - element.position.x;
        y = y - element.position.y;
        const radians = Math.atan2(y, x)
		
        return {
               x: Math.cos(radians) * element.radius + element.position.x,
               y: Math.sin(radians) * element.radius + element.position.y
        }
    }
}





// Objects
class Panel {
	// Properties
	position = new Vector2(0, 0);
	size = new Vector2(CANVAS.width / 2, CANVAS.height / 2);
	joystick = new Joystick();
	clicked = false;
	hasMoved = false;
	decorators = [];
	cross = new Cross();
	
	constructor() {
		this.handleClick();
		this.joystick.move(CANVAS.width / 2, CANVAS.height / 2);

		for (let i = 0; i < 4; i++) {
			this.decorators.push(new Decorator(CANVAS.width / 2, CANVAS.height / 2, (this.size.x - (i * this.size.x / 4))));
		}
	}

	// Events Handlers
	handleClick() {
		document.addEventListener('mousedown', () => {
			this.clicked = true;
			this.hasMoved = false;
		});
		document.addEventListener('mousemove', (e) => {
			if (this.clicked) {
				const newPos = setLimit(e.clientX - CANVAS.getBoundingClientRect().x, // Will take into account the position of the canvas on screen
									    e.clientY - CANVAS.getBoundingClientRect().y,
										this.joystick);
				this.joystick.cursor.move(newPos.x, newPos.y);
				COORDINATES.innerHTML = 'x: ' + parseInt(newPos.x - this.size.x) + '; y: ' + parseInt(this.size.y - newPos.y);
				this.draw();
				this.hasMoved = true;
			}
		});
		document.addEventListener('mouseup', (e) => {
			this.clicked = false;
			if (!this.hasMoved) {
				const newPos = setLimit(e.clientX - CANVAS.getBoundingClientRect().x, // Will take into account the position of the canvas on screen
									    e.clientY - CANVAS.getBoundingClientRect().y,
										this.joystick);
				this.joystick.cursor.move(newPos.x, newPos.y);
				COORDINATES.innerHTML = 'x: ' + parseInt(newPos.x - this.size.x) + '; y: ' + parseInt(this.size.y - newPos.y);
				this.draw();
			}
			this.hasMoved = false;
		});
	}

	// Methods
	draw() {
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
		this.decorators.forEach(decorator => {
			decorator.draw();
		});
		this.cross.draw(0, 0, this.size.x, this.size.y);
		this.joystick.draw();
	}
}






class Joystick {
	// Properties
	position = new Vector2(CANVAS.width / 2, CANVAS.height / 2);
	cursor = new Cursor(this.position.x, this.position.y, this.radius);
	radius = CANVAS.width / 2 - this.cursor.radius;

	// Methods
	move(newX, newY) {
		this.position = new Vector2(newX, newY);
		this.cursor.move(this.position.x, this.position.y);
	}

	draw() {
		CTX.beginPath();
		CTX.arc(this.position.x, 
			    this.position.y, 
				this.radius, 
				0, 
				Math.PI * 2);
		CTX.strokeStyle = "#03dffc";
		CTX.stroke();
		CTX.closePath();
		this.cursor.draw();
	}
}









class Cursor {
	// Properties
	position = new Vector2(0, 0);
	radius = 10;
	boundaryRadius = -1;

	constructor(x, y, boundaryRadius) {
		this.position = new Vector2(x, y);
		this.boundaryRadius = boundaryRadius;
	}

	// Methods
	move(x, y) {
		this.position = new Vector2(x, y);
	}

	draw() {
		CTX.beginPath();
		CTX.arc(this.position.x, 
			this.position.y, 
			this.radius / 3, 
			0, 
			Math.PI * 2);
		CTX.fillStyle = "#03dffc";
		CTX.strokeStyle = "#03dffc";
		CTX.fill();
		CTX.stroke();
		CTX.closePath();

		CTX.moveTo(this.position.x, this.position.y);
		
		CTX.beginPath();
		CTX.arc(this.position.x, 
			this.position.y, 
			this.radius, 
			0, 
			Math.PI * 2);
			CTX.fillStyle = "rgba(3, 223, 252, .3)"
		CTX.fill();
		CTX.stroke();
		CTX.closePath();
	}
}


class Decorator {
	// Properties
	position = new Vector2(0, 0);
	radius = 0;

	constructor(x, y, r) {
		this.position = new Vector2(x, y);
		this.radius = r;
	}

	// Methods
	draw() {
		CTX.beginPath();
		CTX.arc(this.position.x, 
			this.position.y, 
			this.radius, 
			0, 
			Math.PI * 2);
		CTX.strokeStyle = "rgba(3, 223, 252, .3)";
		CTX.stroke();
	}

}

class Cross {
	// Properties
	position = new Vector2(0, 0);

	// Methods
	draw(x, y, w, h) {
		CTX.beginPath();
		CTX.moveTo(x, h);
		CTX.lineTo(w * 2, h);
		CTX.moveTo(w, 0);
		CTX.lineTo(w, h*2);
		CTX.strokeStyle = "rgba(3, 223, 252, .3)";
		CTX.stroke();
		CTX.closePath();
	}
}





// Start drawing
const panel = new Panel();
panel.draw(); // refresh draw only when something changes, instead of 60fps
