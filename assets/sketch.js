const particles = Array(365);
const matrixEdge = [
	[[-10, 10], 75],
	[[-95, 95], 50],
	[[-25, 25], -10],
	[0x4e2, [-10, -100]] // -1 oscilation
];
var WM, HM;
var delimited=0;
var stop=false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	// canvas center
	WM = width/2;
	HM = height/2;
	
	background(0);
	colorMode(HSL);
	noStroke();
	ellipseMode(RADIUS);

	for (let i=0; i < particles.length; i++)
		particles[i] = new Dot();	

	frameRate(30);
	

};

function draw() {
	background(0);

	translate(WM, HM);
	

	shadow();
	wood();

	for (let i=0; i < particles.length; i++) {
		const dot = particles[i];
		dot.show();
		if (dot.t > 1) {
			if (!stop)
				dot.reset();
			delimited++;
		}

		if (delimited > 50) {
			delimited=0;
			t++;
		}
	}
};

function mouseClicked() {
	stop = !stop; // stop flame	
};

function windowResized() {
	// canvas center
	WM = width/2;
	HM = height/2;

	resizeCanvas(windowWidth, windowHeight);
};

class Dot {
	constructor() {
	// coords
		this.x = 0;
		this.y = 0;
		
		// measures
		this.w = 6;
		this.h = 6;

 		this.speed = random(.01, .09);
		this.t = 0;
		
		this.color = color(floor(random(10, 20)), 100, 50);

		this.coords = [];
		this._coords();
	}
	// coords of cubic bezier
	_coords() {
		for (const part of matrixEdge) {
			const [x, y] = part;
			
			let _x, _y;
			_x = x;
			_y = y;
			
			if (isArray(x))
				_x = random(...x);
			if (isArray(y))
				_y = random(...y);

			if (x === 0x4e2)
				_x = oscilation();
			if (y === 0x4e2)
				_y = oscilation();
			
			this.coords.push(createVector(_x, _y));
		}
	}
	show() {
		this.cubic_bezier();
		this.t += this.speed;
		
		fill(this.color);
		rect(this.x, this.y, this.w, this.h);
	}
	reset() {
		this.coords = [];
		this._coords();
		this.speed = random(.01, .09);
		this.t=0;
	}
	cubic_bezier() {
		const { x , y } = cubic_bezier(...this.coords, this.t);

		this.x = x;
		this.y = y;
	}
};


function shadow() {
	if (!stop){
		fill(12, 90, 1);
		ellipse(oscilation(), 100, 350, 120);
		fill(12, 90, 2);
		ellipse(oscilation(), 100, 300, 100);
		fill(30, 90, 3);
		ellipse(oscilation(), 100, 250, 80);
		fill(30, 90, 3);
		triangle(oscilation(), -100, -95, 75, 95, 75);
	}
};

function wood() {
	push();
	translate(-30,100);
	fill(18, 37, 28);
	beginShape();
	vertex(0,0);
	vertex(100, -75);
	vertex(110, -75);
	vertex(110, -65);	
	vertex(10,10);
	vertex(0,10);
	endShape(CLOSE);
	pop();
		
	push();
	translate(30,100);
	fill(18, 37, 28);
	beginShape();
	vertex(10,0);
	vertex(-100, -75);
	vertex(-110, -75);
	vertex(-110, -65);
	vertex(0,10);
	vertex(10,10);
	endShape(CLOSE);
	pop();
};

function cubic_bezier(v1, v2, v3, v4, t) {
	let ax, bx, cx,
		ay, by, cy;
	let squared, cubed;
	let result = {};

	cx = 3 * (v2.x - v1.x);
	bx = 3 * (v3.x - v2.x) - cx;
	ax = v4.x - v1.x - cx - bx;

	cy = 3 * (v2.y - v1.y);
	by = 3 * (v3.y - v2.y) - cy;
	ay = v4.y - v1.y - cy - by;

	squared = t * t;
	cubed = squared * t;

	result.x = (ax * cubed) + bx * squared + cx * t + v1.x;
	result.y = (ay * cubed) + by * squared + cy * t + v1.y;

	return result;
};

let t=0;
function oscilation() {
	const amp = 25;
	const period = 100;
	return amp * Math.sin(t * TWO_PI / period);
};

function isArray(x) {
	return Array.isArray(x);
};

function floor(x) {
	return Math.floor(x);
};
