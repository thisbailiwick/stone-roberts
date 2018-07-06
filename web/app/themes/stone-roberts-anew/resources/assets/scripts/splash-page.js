import Cookies from 'js-cookie';

const modal = document.getElementById('splash-modal');
// if (Cookies.get('splashseen') === undefined) {
	document.body.classList.add('show-splash', 'show-splash-transition');
	modal.addEventListener('click', function () {

			/* eslint-disable */
			Barba.FullScreen.goFullScreen();
			/* eslint-enable */
		window.setTimeout(function () {
			document.body.classList.remove('show-splash');
			window.setTimeout(function () {
				document.body.classList.remove('show-splash-transition');
			}, 250);
		}, 1000);
		Cookies.set('splashseen', 'true', {expires: 365});
	});
// }