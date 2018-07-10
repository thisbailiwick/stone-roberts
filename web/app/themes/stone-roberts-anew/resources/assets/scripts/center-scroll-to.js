import {nakasentro} from './nakasentro';
import smoothscroll from 'smoothscroll-polyfill';
import _ from 'underscore';


let centerScrollDiv = null;
const fullscreen = document.querySelector('.fullscreen');

const scrollCheck = _.debounce(function () {
	const currentCentered = getCurrentCentered();
	checkButtonNavigationDisplay(currentCentered, 'scroll');
}, 100);

function init() {
	centerScrollDiv = document.querySelector('.center-scroll-arrows');

	if (centerScrollDiv === null) {


		smoothscroll.polyfill();

		// add arrows
		const arrows = `
		<div class="center-scroll-arrows"><div class="prev"></div><div class="next"></div>
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
				e.preventDefault();
				goPrevious();
			} else if (e.code === 'ArrowRight') {
				e.preventDefault();
				goNext();
			}
		});

		window.addEventListener('scroll', scrollCheck);
		fullscreen.addEventListener('scroll', scrollCheck);

		const currentCentered = getCurrentCentered();
		checkButtonNavigationDisplay(currentCentered, 'scroll');
	}
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

function scrollToByPixels(scrollAmount) {
	/* eslint-disable */
	if (Barba.FullScreen.isFullscreen) {
		/* eslint-enable */
		fullscreen.scrollTo({top: scrollAmount, left: 0, behavior: 'smooth'});
	} else {
		window.scrollTo({top: scrollAmount, left: 0, behavior: 'smooth'});
	}
}

function goPrevious() {
	if (nakasentro.imageCentered === true) {
		// trigger centered removal
		nakasentro.resetAllCenteredSettings();
	}
	let artworkToCenter = checkForPrevious(getCurrentCentered().previousElementSibling);

	if (artworkToCenter !== null) {
		scrollToElement(artworkToCenter);
	}
}


function goNext() {
	if (nakasentro.imageCentered === true) {
		// trigger centered removal
		nakasentro.resetAllCenteredSettings();
	}
	let artworkToCenter = getCurrentCentered().nextElementSibling;

	artworkToCenter = checkForNext(artworkToCenter);

	if (artworkToCenter !== null) {
		scrollToElement(artworkToCenter);
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

function getElementTop(element) {
	let top = 0;
	do {
		top += element.offsetTop || 0;
		element = element.offsetParent;
	} while (element);
	return top;
}

function getElementMiddle(element) {

	const elementHeight = element.clientHeight;
	const top = getElementTop(element);

	let scrollingWrapHeight = null;
	/* eslint-disable */
	if(Barba.FullScreen.isFullscreen){
		/* eslint-enable */
		// use fullscreen
		scrollingWrapHeight = fullscreen.clientHeight;
	}else{
		// use window
		scrollingWrapHeight = window.innerHeight;
	}

	return top - ((scrollingWrapHeight - elementHeight) / 2);

}

function scrollToElement(artworkToCenter) {
	const scrollAmount = getElementMiddle(artworkToCenter);
	scrollToByPixels(scrollAmount);
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

export {init, scrollToElement}
