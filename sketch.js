class Walker
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.colCnt = colCnt;
		this.rowCnt = rowCnt;
		this.isComplete = false;
		this.walked = [[x, y]];
		this.spots = Array.from({ length: rowCnt },
			() => Array.from({ length: colCnt }, () => false)
		)

		this.spots[y][x] = true;
	}

	checkIfSpotIsValid(x, y)
	{
		return (
			(x >= 0 && x < colCnt) &&
			(y >= 0 && y < rowCnt) &&
			!this.spots[y][x]);
	}

	walk()
	{
		if (this.isComplete) return;
		const dirOffSets = Walker.allDirOffsets
			.filter(([offsetX, offsetY]) =>
			{
				const newX = this.x + offsetX;
				const newY = this.y + offsetY;
				return this.checkIfSpotIsValid(newX, newY)
			})

		if (!dirOffSets.length)
		{
			this.isComplete = true;
			return;
		}

		const [offsetX, offsetY] = random(dirOffSets);
		this.x += offsetX;
		this.y += offsetY;
		this.spots[this.y][this.x] = true;
		this.walked.push([this.x, this.y]);
	}

	drawPath()
	{
		let prev;
		for (const [x, y] of this.walked)
		{
			const canvasX = x * colSpace;
			const canvasY = y * rowSpace;
			if (prev)
			{
				stroke(255);
				line(prev[0], prev[1], canvasX, canvasY);
			}

			prev = [canvasX, canvasY];
		}
	}

	static allDirOffsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
}

const colCnt = 10;
const rowCnt = 10;
let rowSpace, colSpace;
let walker;
function setup()
{
	createCanvas(600, 600);
	// frameRate(10);
	rowSpace = width / colCnt;
	colSpace = height / rowCnt;
	walker = new Walker(floor(colCnt / 2), floor(rowCnt / 2));
}

function draw()
{
	translate(colSpace / 2, rowSpace / 2);
	background(0);

	// Draw spots
	for (let i = 0; i < colCnt; i++)
	{
		for (let j = 0; j < rowCnt; j++)
		{
			const x = i * colSpace;
			const y = j * rowSpace;

			fill(255);
			circle(x, y, 5);
		}
	}

	walker.walk();
	walker.drawPath();
}
