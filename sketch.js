class Walker
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.colCnt = colCnt;
		this.rowCnt = rowCnt;
		this.isComplete = false;
		this.head = 0;
		this.walked = [{
			pos: [x, y],
			tried: [],
		}];
		this.spots = Array.from({ length: rowCnt },
			() => Array.from({ length: colCnt }, () => false)
		)
		this.spots[y][x] = true;
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

				// Check if spot is within grid
				if ((
					(newX < 0 || newX >= colCnt) ||
					(newY < 0 || newY >= rowCnt))) return false;

				// Check if spot is empty
				if (this.spots[newY][newX]) return false;

				// Check if direction has been tried by current head
				const tried = this.walked[this.head].tried;
				for (const triedOffsetArr of tried)
				{
					const [triedOffsetX, triedOffsetY] = triedOffsetArr;
					if (triedOffsetX === offsetX && triedOffsetY === offsetY) return false;
				}

				return true;
			})
		// console.log('cycle done');

		if (!dirOffSets.length)
		{
			const { prevPos } = this.walked.pop();
			if (!prevPos)
			{
				this.isComplete = true;
				return;
			}
			this.spots[this.y][this.x] = false;
			[this.x, this.y] = prevPos;
			this.head--;
		}
		else
		{
			const [offsetX, offsetY] = random(dirOffSets);
			this.walked[this.head].tried.push([offsetX, offsetY]);
			this.walked.push({
				prevPos: [this.x, this.y],
				pos: [this.x += offsetX, this.y += offsetY],
				tried: [],
			});
			this.spots[this.y][this.x] = true;
			this.head++;
		}
	}

	draw()
	{
		// Draw body
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

		// Draw head
		const { pos } = this.walked[this.head];
		circle(pos[0] * colSpace, pos[1] * rowSpace, 20);
	}

	static allDirOffsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
}

const colCnt = 5;
const rowCnt = 5;
let rowSpace, colSpace;
let walker;
let noFire;
function setup()
{
	createCanvas(600, 600);
	colSpace = width / colCnt;
	rowSpace = height / rowCnt;
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

	// Draw walker
	walker.draw();
	walker.walk();
	// if (keyIsDown(32))
	// {
	// 	if (!noFire) walker.walk();
	// 	noFire = true;
	// }
	// else noFire = false;
}
