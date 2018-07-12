import {utilities} from './utilities';

/**
 * Regex tested and matched against the following userAgents:
 * iPhone
 *   Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)
 *   AppleWebKit/602.1.50 (KHTML, like Gecko)
 *   CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1
 * iPad
 *   Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X)
 *   AppleWebKit/600.1.4 (KHTML, like Gecko)
 *   CriOS/45.0.2454.89 Mobile/13A344 Safari/600.1.4 (000205)
 */

const iOSChromeDetected = /CriOS/.test(navigator.userAgent);
const statusBarHeight = 20;
const portraitHeight = screen.height - statusBarHeight;
const landscapeHeight = screen.width - statusBarHeight;
const initialViewportHeight = window.innerHeight;
let orientationToFix = null;

function getHeight(element) {
	const computedHeightString = getComputedStyle(element).height;
	const elementHeight = Number(computedHeightString.replace('px', ''));
	return elementHeight;
}

function calculateVh(elementHeight) {
	const approximateVh = (elementHeight / initialViewportHeight) * 100;
	const elementVh = Math.round(approximateVh);
	return elementVh;
}

function setDataAttribute(elementVh, element) {
	const dataAttributeValue = `${elementVh}`;
	element.setAttribute('data-vh', dataAttributeValue);
}

function setHeight(element) {
	const orientation = utilities.getBrowserOrientation();
	if(orientation === orientationToFix) {
		const vhRatio = Number(element.dataset.vh / 100);
		if (orientation === 'landscape') {
			element.style.height = `${vhRatio * landscapeHeight}px`;
		} else {
			element.style.height = `${vhRatio * portraitHeight}px`;
		}
	}else{
		element.style.height = '';
	}
}

function initializeElement(element) {
	console.log(element);
	let elementVh = this;
	if (elementVh === null) {
		const elementHeight = getHeight(element);
		elementVh = calculateVh(elementHeight);
	}
	setDataAttribute(elementVh, element);
	setHeight(element);
}

function initialize(elements = null, desiredElementVh = null, orientationToFixValue = null) {
	orientationToFix = orientationToFixValue;
	if (iOSChromeDetected) {
		if (elements === null) {
			elements = Array.from(document.getElementsByClassName('vh-fix'));
		}

		elements.forEach(initializeElement, desiredElementVh);

		window.onload = function () {
			window.addEventListener('orientationchange', function () {
				elements.forEach(setHeight);
			});
		};
	}
}


export {initialize};