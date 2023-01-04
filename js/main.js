console.clear();

// This was originally written on processing which was based on code from Keith Peters.

const GUI = new dat.GUI();

const SETTINGS = {
	length: {
		value: 200,
		min: 50,
		max: 1000,
	},
	segmentLength: {
		value: 5,
		min: 1,
		max: 50,
	},
	strokeWidth: {
		value: 2,
		min: 1,
		max: 10,
	},
	color: "#fff",
	rainbow: false,
};

let cursor;

function setup() {
	let canvas = createCanvas(innerWidth, innerHeight);
	canvas.parent("canvas-container");
	reset();
}

function reset() {
	if (SETTINGS.rainbow) colorMode(HSB);
	cursor = new Cursor({
		length: SETTINGS.length.value,
		segmentLength: SETTINGS.segmentLength.value,
		color: SETTINGS.rainbow ? "rainbow" : SETTINGS.color,
	});
}

function draw() {
	background(0);
	cursor.draw();
}

function addGUI() {
	GUI.add(SETTINGS.length, "value", SETTINGS.length.min, SETTINGS.length.max).name("Length").step(1).onChange(reset);
	GUI.add(SETTINGS.segmentLength, "value", SETTINGS.segmentLength.min, SETTINGS.segmentLength.max)
		.name("Segment Length")
		.step(1)
		.onChange(reset);
	GUI.add(SETTINGS.strokeWidth, "value", SETTINGS.strokeWidth.min, SETTINGS.strokeWidth.max)
		.name("Stroke Width")
		.step(1)
		.onChange(reset);
	GUI.addColor(SETTINGS, "color").name("Color").onChange(reset);
	GUI.add(SETTINGS, "rainbow").name("Rainbow").onChange(reset);
}

addGUI();

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
	reset();
}

// cursor class

class Cursor {
	constructor(options = {}) {
		this.length = options.length || 100;
		this.color = options.color || color(255);
		this.segmentLength = options.segmentLength || 5;
		this.x = new Array(floor(this.length / this.segmentLength)).fill(0);
		this.y = new Array(floor(this.length / this.segmentLength)).fill(0);
		this.rainbowColors = ["#00f", "#70a", "#f00", "#f70", "#ff0", "#0f0"];
	}

	draw() {
		if (this.color !== "rainbow") stroke(this.color);
		strokeWeight(SETTINGS.strokeWidth.value);
		this.dragSegment(0, mouseX, mouseY);
		for (let i = 0; i < this.x.length - 1; i++) {
			if (this.color === "rainbow") stroke(this.rainbowColors[i % this.rainbowColors.length]);
			this.dragSegment(i + 1, this.x[i], this.y[i]);
		}
	}

	dragSegment(i, xin, yin) {
		let dx = xin - this.x[i];
		let dy = yin - this.y[i];
		let angle = atan2(dy, dx);
		this.x[i] = xin - cos(angle) * this.segmentLength;
		this.y[i] = yin - sin(angle) * this.segmentLength;
		this.segment(this.x[i], this.y[i], angle);
	}

	segment(x, y, a) {
		push();
		translate(x, y);
		rotate(a);
		line(0, 0, this.segmentLength, 0);
		pop();
	}
}
