import Cookies from 'js-cookie';
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

const modal = document.getElementById('splash-modal');
if (Cookies.get('splashseen') === undefined) {
	disableBodyScroll(modal);
	document.body.classList.add('show-splash', 'show-splash-transition');
	modal.addEventListener('click', function () {


		/* eslint-disable */
		if (Barba.FullScreen.browserSupportsFullscreen) {
			Barba.FullScreen.goFullScreen();
			window.setTimeout(function () {
				document.body.classList.remove('show-splash');
				window.setTimeout(function () {
					document.body.classList.remove('show-splash-transition');
					clearAllBodyScrollLocks(modal);
				}, 250);
			}, 1000);
		}else{
			document.body.classList.remove('show-splash', 'show-splash-transition');
		}
		/* eslint-enable */

		Cookies.set('splashseen', 'true', {expires: 365});
	});
}