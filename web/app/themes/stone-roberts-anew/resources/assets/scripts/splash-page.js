import Cookies from 'js-cookie';
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import _ from 'underscore';

const modal = document.getElementById('splash-modal');
const splashPageUrls = ['/'];
const splashSeen = Cookies.get('splashseen');

function barbaFullScreenPreferenceYes() {
	/* eslint-disable */
	Barba.FullScreen.toggleModal();
	Barba.FullScreen.goFullScreen();
	/* eslint-enable */

	window.setTimeout(function () {
		document.body.classList.remove('show-splash');
		window.setTimeout(function () {
			clearAllBodyScrollLocks(modal);
			document.body.classList.remove('show-splash', 'show-splash-transition');
		}, 250);
	}, 1000);
}

function barbaFullScreenPreferenceNo() {
	/* eslint-disable */
	Barba.FullScreen.toggleModal();
	/* eslint-enable */
	clearAllBodyScrollLocks(modal);
	document.body.classList.remove('show-splash', 'show-splash-transition');
}

console.log('window.location.pathname: ', window.location.pathname);
if ( splashSeen === undefined || _.contains(splashPageUrls, window.location.pathname)) {
	disableBodyScroll(modal);
	document.body.classList.add('show-splash', 'show-splash-transition');
	modal.addEventListener('click', function () {
    clearAllBodyScrollLocks();
		/* eslint-disable */
		if (Barba.FullScreen.browserSupportsFullscreen && Cookies.get('fullscreen-permanent') !== 'false') {
			// Barba.FullScreen.showModal();
			/* eslint-enable */
		} else {
			document.body.classList.remove('show-splash', 'show-splash-transition');
		}

		Cookies.set('splashseen', 'true', {expires: 365});
	});
}
document.addEventListener('barbaFullScreenPreferenceYes', barbaFullScreenPreferenceYes, false);
document.addEventListener('barbaFullScreenPreferenceNo', barbaFullScreenPreferenceNo, false);
