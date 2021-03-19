'use strict';

let
	canv	= document.getElementById('paint'),
	ctx		= canv.getContext('2d');

// Canvas size
canv.width 	= innerWidth;
canv.height = innerHeight;



let 
	isMouseDown = false,
	radius		= 2,
	color 		= 'black',
	coords		= [],
	liveSize	= [],
	liveColor	= [];

let
	clearBtn 	= document.getElementById('clear'),
	saveBtn		= document.getElementById('save'),
	replayBtn 	= document.getElementById('replay'),
	brushSize	= document.getElementById('brush-size'),
	brushColor 	= document.getElementById('color');

brushSize.addEventListener('input', () => {
	radius 	= brushSize.value;
});

brushColor.addEventListener('input', () => {
	color   = brushColor.value;
});


document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
	ctx.beginPath();
	coords.push('mouseup');
});

canv.addEventListener('mousemove', (e) => {

	if (isMouseDown) {

		radius = brushSize.value;
		color  = brushColor.value;

		coords.push([e.clientX, e.clientY]);
		liveSize.push(radius);
		liveColor.push(color);

		ctx.lineTo(e.clientX, e.clientY);
		ctx.lineWidth = radius * 2;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(e.clientX, e.clientY, radius, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);


	}

});


function clearCanvas() {
	console.log('Cleared');
	ctx.clearRect(0, 0, innerWidth, innerHeight);
}

function saveCanvas() {
	console.log('Saved');
	localStorage.setItem('coords', JSON.stringify(coords));
}

function replayCanvas() {

	console.log('Replaying ...');

	var	timer = setInterval(function() {

			if (!coords.length) {
				clearInterval(timer);
				ctx.beginPath();
				return;
			}
			
			var
				crd = coords.shift(),
				e 	= {
					clientX: crd['0'],
					clientY: crd['1']
				};



		ctx.lineTo(e.clientX, e.clientY);
		ctx.lineWidth = radius * 2;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(e.clientX, e.clientY, radius, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		
		radius = liveSize.shift();
		color  = liveColor.shift();

		}, 1);

	return radius = 10;

}


clearBtn.addEventListener('click', () => {
	clearCanvas();
});

saveBtn.addEventListener('click', () => {
	saveCanvas() ;
});

replayBtn.addEventListener('click', () => {
	clearCanvas();
	replayCanvas();
});

document.addEventListener('keydown', (e) => {

	if ( e.keyCode === 83) {
		// save
		saveCanvas();
	}

	if ( e.keyCode === 82) {
		// replay
		

		coords = JSON.parse(localStorage.getItem('coords'));
		clearCanvas();
		replayCanvas();
	}

	if ( e.keyCode === 67) {
		// clear
		clearCanvas();
	}
 
});