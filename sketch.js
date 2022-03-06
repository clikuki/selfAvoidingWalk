class Walker
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.colCnt = colCnt;
		this.rowCnt = rowCnt;
		this.isComplete = false;
		this.walked = [{
			pos: [x, y],
		}];
		this.spots = Array.from({ length: rowCnt },
			() => Array.from({ length: colCnt }, () => ({
				visited: false,
				tried: []
			}))
		)
		this.spots[y][x].visited = true;
	}

	checkIfSpotIsValid(x, y)
	{
		const c = (
			(x >= 0 && x < colCnt) &&
			(y >= 0 && y < rowCnt) &&
			!this.spots[y][x].visited);
		if (debugMode) console.log(x, y, c);
		return c;
	}

	walk()
	{
		if (this.isComplete) return;
		if (this.walked.length === colCnt * rowCnt)
		{
			this.isComplete = true;
			return;
		}

		const dirOffSets = Walker.allDirOffsets
			.filter(([offsetX, offsetY]) =>
			{
				const newX = this.x + offsetX;
				const newY = this.y + offsetY;

				if (!this.checkIfSpotIsValid(newX, newY)) return false;
				for (const [triedOffsetX, triedOffsetY] of this.spots[this.y][this.x].tried)
				{
					if (triedOffsetX === offsetX && triedOffsetY === offsetY) return false;
				}

				return true;
			})

		if (!dirOffSets.length)
		{
			const { prevPos } = this.walked.pop();
			if (!prevPos)
			{
				this.isComplete = true;
				return;
			}
			this.spots[this.y][this.x].visited = false;
			[this.x, this.y] = prevPos;
		}
		else
		{
			const [offsetX, offsetY] = random(dirOffSets);
			const oldSpot = this.spots[this.y][this.x];
			oldSpot.tried.push([offsetX, offsetY]);
			this.walked.push({
				prevPos: [this.x, this.y],
				pos: [this.x += offsetX, this.y += offsetY],
			});
			const newSpot = this.spots[this.y][this.x];
			newSpot.visited = true;
		}
	}

	drawPath()
	{
		let prev;
		for (const { pos } of this.walked)
		{
			const [x, y] = pos;
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

const colCnt = 5;
const rowCnt = 5;
let rowSpace, colSpace;
let walker;
function setup()
{
	createCanvas(600, 600);
	rowSpace = width / colCnt;
	colSpace = height / rowCnt;
	walker = new Walker(0, 0);
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

	walker.drawPath();
	walker.walk();
}
