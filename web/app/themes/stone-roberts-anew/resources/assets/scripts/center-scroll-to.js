import {nakasentro} from './nakasentro';
import smoothscroll from 'smoothscroll-polyfill';
import _ from 'underscore';


let centerScrollDiv = null;

const scrollCheck = _.debounce(function () {
	const currentCentered = getCurrentCentered();
	checkButtonNavigationDisplay(currentCentered, 'scroll');
}, 100);

export default function init() {
	centerScrollDiv = document.querySelector('.center-scroll-arrows');

	if (centerScrollDiv === null) {


		smoothscroll.polyfill();
		const artworkImageRatioHolders = nakasentro.artworks.map(artwork => artwork.imageRatioHolder);
		console.log(artworkImageRatioHolders);

		// add arrows
		const arrows = `
		<div class="center-scroll-arrows"><div class="prev"><svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg></div><div class="next"><svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg></div>
	`;
		document.querySelector('.fullscreen').insertAdjacentHTML('beforeend', arrows);

		centerScrollDiv = document.querySelector('.center-scroll-arrows');

		const prevButton = centerScrollDiv.querySelector('.center-scroll-arrows .prev');
		const nextButton = centerScrollDiv.querySelector('.center-scroll-arrows .next');

		prevButton.addEventListener('click', goPrevious);
		nextButton.addEventListener('click', goNext);

		// add keydown events
		document.addEventListener('keyup', (e) => {
			if (e.code === 'ArrowLeft') {
				console.log('arrowleft');
				e.preventDefault();
				goPrevious();
			} else if (e.code === 'ArrowRight') {
				console.log('arrowright');

				e.preventDefault();
				goNext();
			}
		});

		window.addEventListener('scroll', scrollCheck);
	}

	// find the most centered image

	// if body has class centered-image
	// get the centered image
	// set it current centered

	// else get
}

function getCurrentCentered() {
	let closestToZero = 100000000;
	let currentCentered = null;
	Array.from(nakasentro.artworks).filter(function (artwork) {
		if (Math.abs(artwork.toCenterPixels) < closestToZero) {
			closestToZero = artwork.toCenterPixels;
			currentCentered = artwork.element;
			// console.log(artwork.element);
		}
	});

	return currentCentered;
}

function checkForPrevious(startingArtwork) {
	while (startingArtwork !== null && !startingArtwork.classList.contains('artwork_piece')) {
		startingArtwork = startingArtwork.previousElementSibling;
	}
	return startingArtwork;
}

function checkForNext(startingArtwork) {
	while (startingArtwork !== null && !startingArtwork.classList.contains('artwork_piece')) {
		startingArtwork = startingArtwork.nextElementSibling;
	}
	return startingArtwork;
}

function goPrevious() {
	if (nakasentro.imageCentered === true) {
		// trigger centered removal
		nakasentro.resetAllCenteredSettings();
	}
	let artworkToCenter = checkForPrevious(getCurrentCentered().previousElementSibling);


	if (artworkToCenter !== null) {
		artworkToCenter.scrollIntoView({behavior: 'smooth'});
		setNextVisibility('show');
		// now check to see if there is one more
		const prevElement = checkForPrevious(artworkToCenter.previousElementSibling);
		if (prevElement === null || Object.is(artworkToCenter, prevElement)) {
			setPreviousVisibility('hide');
		}
	} else {
		setPreviousVisibility('hide');
	}
}

function goNext() {
	if (nakasentro.imageCentered === true) {
		// trigger centered removal
		nakasentro.resetAllCenteredSettings();
	}
	let artworkToCenter = getCurrentCentered().nextElementSibling;
	while (artworkToCenter !== null && !artworkToCenter.classList.contains('artwork_piece')) {
		artworkToCenter = artworkToCenter.nextElementSibling;
	}

	if (artworkToCenter !== null) {
		artworkToCenter.scrollIntoView({behavior: 'smooth'});
	}

	checkButtonNavigationDisplay(artworkToCenter, 'next');
}

function processPrevCheck(artworkToCenter, direction) {
	if (artworkToCenter !== null) {
		if (direction !== 'scroll') {
			setNextVisibility('show');
		}
		// now check to see if there is one more
		const prevElement = checkForPrevious(artworkToCenter.previousElementSibling);
		if (prevElement === null || Object.is(artworkToCenter, prevElement)) {
			setPreviousVisibility('hide');
		} else {
			setPreviousVisibility('show');
		}
	} else {
		setPreviousVisibility('hide');
	}
}

function processNextCheck(artworkToCenter, direction) {
	if (artworkToCenter !== null) {
		// artworkToCenter.scrollIntoView({behavior: 'smooth'});
		if (direction !== 'scroll') {
			setPreviousVisibility('show');
		}
		// now check to see if there is one more
		const nextElement = checkForNext(artworkToCenter.nextElementSibling);
		if (nextElement === null || Object.is(artworkToCenter, nextElement)) {
			setNextVisibility('hide');
		} else {
			setNextVisibility('show');
		}
	} else {
		setNextVisibility('hide');
	}
}

function checkButtonNavigationDisplay(artworkToCenter, direction = 'scroll') {
	if (direction === 'next') {
		processNextCheck(artworkToCenter, direction);
	} else if (direction === 'prev') {
		processPrevCheck(artworkToCenter, direction);
	} else if (direction === 'scroll') {
		processNextCheck(artworkToCenter, direction);
		processPrevCheck(artworkToCenter, direction);
	}
}


function setPreviousVisibility(value) {
	if (value === 'show') {
		centerScrollDiv.classList.remove('hide-previous');
	} else {
		centerScrollDiv.classList.add('hide-previous');
	}
}

function setNextVisibility(value) {
	if (value === 'show') {
		centerScrollDiv.classList.remove('hide-next');
	} else {
		centerScrollDiv.classList.add('hide-next');
	}
}