import {scrollToElement} from './center-scroll-to';

let thumbnails = [];
let thumbnailCount = 0;
let thumbnailsTrigger = null;
let thumbnailsNav = null;
let initSetup = false;
let fullscreenWrapper = document.querySelector('.fullscreen-wrapper');

function init(parentElement) {
	if (initSetup === false) {
		initSetup = true;

		// add thumbnails div
		const thumbnailsWrap = `
		<div id="thumbnails-nav" class="hide">
			
		</div>
	`;
		parentElement.insertAdjacentHTML('afterbegin', thumbnailsWrap);
		thumbnailsNav = document.getElementById('thumbnails-nav');


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

		thumbnailsTrigger.addEventListener('click', function (e) {
			thumbnailsNav.classList.toggle('hide');
			e.currentTarget.classList.toggle('showing');
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
		thumbnailsNav.insertAdjacentHTML('beforeend', thumbnailHtml);

		document.getElementById(`thumbnail-${thumbnailCount}`).addEventListener('click', function () {
			thumbnailsNav.classList.add('hide');
			fullscreenWrapper.classList.remove('showing-thumbnails');

			// timeout time set to same amount of thumbnails-nav transition-duration
			window.setTimeout(function () {
				scrollToElement(associatedDomElement);
			}, 100);
		});

		thumbnailCount++;
		thumbnails.push(associatedDomElement);
	}

}

export {init, addThumbnail}