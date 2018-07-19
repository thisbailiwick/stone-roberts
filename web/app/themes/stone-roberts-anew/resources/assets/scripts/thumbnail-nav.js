import {scrollToElement} from './center-scroll-to';
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

let thumbnails = [];
let thumbnailCount = 0;
let thumbnailsTrigger = null;
let thumbnailsNav = null;
let thumbnailsWrap = null;
let initSetup = false;
let fullscreenWrapper = document.querySelector('.fullscreen-wrapper');

function init(parentElement) {
	if (initSetup === false) {
		initSetup = true;
		const pageHeader = document.querySelector('.main .page-header h1').outerHTML;
		// add thumbnails div
		const thumbnailsNavHtml = `
		<div id="thumbnails-nav" class="hide">
			${pageHeader}
			<div class="thumbnails-wrap"></div>
		</div>
	`;
		parentElement.insertAdjacentHTML('afterbegin', thumbnailsNavHtml);
		thumbnailsNav = document.getElementById('thumbnails-nav');
		thumbnailsWrap = thumbnailsNav.querySelector('.thumbnails-wrap');


		const thumbnailTrigger = fullscreenWrapper.querySelector('#thumbnail-trigger');
		if (thumbnailTrigger === null) {
			// add trigger divs
			const thumbnailTriggerHtml = `
			<div id="thumbnail-trigger">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		`;

			document.querySelector('.fullscreen-wrapper').insertAdjacentHTML('afterbegin', thumbnailTriggerHtml);
			thumbnailsTrigger = document.getElementById('thumbnail-trigger');
		}

		thumbnailsTrigger.addEventListener('click', function () {
			if (fullscreenWrapper.classList.contains('showing-thumbnails')) {
				window.setTimeout(function () {
					clearAllBodyScrollLocks(thumbnailsNav);
				}, 100);
			} else {
				disableBodyScroll(thumbnailsNav);
			}
			disableBodyScroll(thumbnailsNav);
			thumbnailsNav.classList.toggle('hide');
			fullscreenWrapper.classList.toggle('showing-thumbnails');
		});
	}
}

function elementAdded(associatedDomElement) {
	return this === associatedDomElement;
}

function addThumbnail(imgSrc, associatedDomElement) {
	// don't add thumbnail if we already have
	if (!thumbnails.find(elementAdded, associatedDomElement)) {
		const thumbnailHtml = `
			<div class="thumbnail-wrap" id="thumbnail-${thumbnailCount}"><img class="thumbnail" src="${imgSrc}" /></div>
		`;
		thumbnailsWrap.insertAdjacentHTML('beforeend', thumbnailHtml);

		document.getElementById(`thumbnail-${thumbnailCount}`).addEventListener('click', function () {
			thumbnailsNav.classList.add('hide');
			fullscreenWrapper.classList.remove('showing-thumbnails');

			// timeout time set to same amount of thumbnails-nav transition-duration
			window.setTimeout(function () {
				clearAllBodyScrollLocks(thumbnailsNav);
				scrollToElement(associatedDomElement);
			}, 100);
		});

		thumbnailCount++;
		thumbnails.push(associatedDomElement);
	}

}

function setInitFalse() {
	initSetup = false;
}

export {init, addThumbnail, setInitFalse}