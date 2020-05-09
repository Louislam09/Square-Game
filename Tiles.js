var GAMESCREEN = document.getElementById('gameScreen');
var TIMER = document.getElementById('timer');
var COUNTDOWN = document.getElementById('countdown');
var LIFE = document.getElementById('life');
const SOUNDS = document.querySelectorAll('.sound');
const BACKGROUNDSOUND = document.querySelector('.background-sound');
const MENU = document.querySelector('.main-menu');
const PLAYBUTTON = document.querySelector('.play-btn');

var colorArray = [
	'##F26D85',
	'#BF214B',
	'#C1D0D9',
	'#0E6973',
	'#0E7373',
	'#547C8C',
	'#6FB7BF',
	'#D96704',
	'#D9A679',
	'#8C4C46'
];
var countback = 4;
var pause = false;
var speed = 5;
var score = 0;
var heart = [ '❤️', '❤️', '❤️' ];

class Tile {
	constructor() {
		this.tile = 0;
		this.run = 0;
		this.speed = speed;
		this.randomPosX = Math.floor(Math.random() * 4);
	}

	newTile() {
		let newtile = document.createElement('span');
		if (Math.floor(Math.random() * 10) === 0) {
			newtile.classList.add('trap');
			newtile.innerHTML = `<b>💣</b>`;
		}
		newtile.style.left = this.randomPosX * 100 + 'px';
		newtile.style.top = 0 * 150 + 'px';
		newtile.style.background = colorArray[Math.floor(Math.random() * colorArray.length)];
		GAMESCREEN.appendChild(newtile);
		this.tile = newtile;
	}
	newTrap() {
		let newtile = document.createElement('span');
		newtile.classList.add('trap');
		newtile.style.left = this.randomPosX * 100 + 'px';
		newtile.style.top = 0 * 150 + 'px';
		newtile.style.background = colorArray[Math.floor(Math.random() * colorArray.length)];
		newtile.innerHTML = `<b>NO TOUCH</b>`;
		GAMESCREEN.appendChild(newtile);
		this.tile = newtile;
	}

	update() {
		this.tile.style.top = this.run + 'px';
		this.run == 150 ? AddTile() : this.run;
		this.run += this.speed;
		if (this.tile.childElementCount === 1) {
			this.tile.addEventListener('click', trapClicked);
		} else {
			this.tile.addEventListener('click', clicked);
			if (this.tile.offsetTop === 450) heart.splice(0, 1);
		}
	}
}

var tileArray = [];
var trapArray = [];

function AddTile() {
	let newT = new Tile();
	newT.newTile();
	tileArray.push(newT);
}
AddTile();

function AddTrap() {
	let newTrap = new Tile();
	newTrap.newTrap();
	tileArray.push(newTrap);
}

function clicked(e) {
	let tile = e.target;
	tile.remove();

	// Sounds section
	// let index = Math.floor(Math.random() * 6);
	SOUNDS[2].currentTime = 0;
	SOUNDS[2].play();
}
function trapClicked(e) {
	let tile = e.target;
	tile.innerHTML = `<b>🔥</b>`;
	tile.style.backgroundColor = 'red';

	let crash = new Audio('sound/crash.mp3');

	crash.play();
	// Gameover Statement
	Gameover();
}
function Gameover() {
	pause = !pause;
	BACKGROUNDSOUND.pause();

	// gameover sound
	let gsound = new Audio();
	gsound.src = 'sound/gameover.ogg';
	gsound.play();
	gsound.loop = true;

	GAMESCREEN.childNodes.forEach((el) => el.remove());

	let img = document.createElement('img');
	img.classList = 'loseImg';
	img.alt = 'loseImg';
	img.src = 'img/crying.webp';

	let gameoverMsg = document.createElement('h1');
	gameoverMsg.classList = 'gameover-msg';
	gameoverMsg.innerText = 'Perdiste!';

	let btn = document.createElement('button');
	btn.innerText = 'Intentar!';
	btn.addEventListener('click', () => window.location.reload());

	GAMESCREEN.appendChild(img);
	GAMESCREEN.appendChild(gameoverMsg);
	GAMESCREEN.appendChild(btn);
}

// Pause Handler
document.onkeydown = (e) => (e.keyCode === 32 ? (pause = !pause) : pause);

PLAYBUTTON.addEventListener('click', () => {
	MENU.remove();
	setInterval(Countdown, 1000);
});

function timeScore() {
	let time = new Date();
	let mm = time.getMilliseconds();
	if (mm > 100) {
		score += 0.1;
	}
	TIMER.innerText = ` ${Math.floor(score)}:${mm}`;
}

function Countdown() {
	countback--;
	COUNTDOWN.innerText = `${countback}`;
	if (countback === 0) {
		COUNTDOWN.remove();
		countback = 0;
		pause = true;
		PlayBackgroundSound();
	}
}

function NextLevel() {
	if (Math.floor(score) === 50) {
		speed = 10;
	}
}

function UpdateTile() {
	if (heart.length === 0) Gameover();

	LIFE.innerText = heart.join('|');

	for (let i = 0; i < tileArray.length; i++) {
		tileArray[i].update();
		if (parseInt(tileArray[i].tile.style.top) > 450) {
			tileArray.splice(i, 1);
		}
	}
	if (GAMESCREEN.childNodes[0].offsetTop === 450) {
		GAMESCREEN.childNodes[0].remove();
	}

	if (GAMESCREEN.childNodes[1]) {
		if (GAMESCREEN.childNodes[1].offsetTop === 450) GAMESCREEN.childNodes[1].remove();
	}
}

function PlayBackgroundSound() {
	if (pause === true) {
		BACKGROUNDSOUND.currentTime = 20;
		BACKGROUNDSOUND.play();
		BACKGROUNDSOUND.loop = true;
		BACKGROUNDSOUND.volume = 0.4;
	}
}

function RUN() {
	try {
		requestAnimationFrame(RUN);

		if (pause === true) {
			UpdateTile();
			timeScore();
			// NextLevel();
		}
	} catch (error) {
		console.log(error);
	}
}
RUN();
