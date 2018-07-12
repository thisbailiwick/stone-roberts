import {moreInfo} from '../more-info';
import {stAudio} from '../st-audio';
import {zoomy} from '../zoomy';
import {nakasentro} from '../nakasentro';
import {artworkInfo} from '../artwork-info';
import * as initMenuVerticalPush from '../../../../../../mu-plugins/menu-vertical-push/menu-vertical-push';
import {init as thumbnailInit, setInitFalse as setThumbnailInitFalse} from '../thumbnail-nav';
import reframe from "reframe.js";
import {processYouTubeIframes/*, youTubeIframeAPIReady*/} from '../youtube';

export default {
	init() {
		// JavaScript to be fired on all pages

		window.onload = function () {
			// init menu-vertical-push
			initMenuVerticalPush.init();
			// addBackToTop({zIndex: 2});
		};

		function debounce(func, wait, immediate) {
			let timeout;
			return function () {
				let context = this,
					args = arguments;
				let later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};
				let callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(context, args);
				}
			};
		}

		// setup resize event after user stops resizing
		let resize_event = debounce(function () {
			// things to run after resize
			moreInfo.init();
		}, 300);

		window.addEventListener("resize", resize_event);

		// add scroll to function
		// can be used like $('.banner').goTo();
		$.fn.goTo = function () {
			$("html, body").animate({
					scrollTop: $(this).offset().top + "px",
				},
				"fast"
			);
			return this;
		};

		// init fullscreen
		/* eslint-disable */
		let CommonView = Barba.BaseView.extend({
			/* eslint-enable */
			namespace: "common",
			onEnterCompleted: function () {
				// The Transition has just finished.

				// init thumbnails
				if (document.body.classList.contains('template-projects') || document.body.classList.contains('single-projects')) {
					setThumbnailInitFalse();
					thumbnailInit(document.querySelector('.main'));
				}

				// spin up share
				/* eslint-disable */
				share.init();
				/* eslint-enable */

				//spin up audio
				stAudio.init();

				// wait for images to load before spinning up the artwork animation
				let images = document.querySelectorAll('.main .artwork_piece .main-img');
				let imagesCount = images.length;
				images.forEach(function (img) {
					if (img.complete === true) {
						imagesCount--;
					} else {
						img.addEventListener('load', function () {
							imagesCount--;
							checkIfImagesLoaded(imagesCount);
						});
					}
					checkIfImagesLoaded(imagesCount);
				});


				function checkIfImagesLoaded(imagesCount) {
					if (imagesCount === 0) {
						initArtwork();

						//spin up zoomy, must be done after initArtwork
						zoomy.init();
					}
				}

				function initArtwork() {
					// spin up artwork animation
					nakasentro.init();
					artworkInfo.init();
					moreInfo.init();
				}

				// process Vimeo Iframes
				const vimeoIframes = document.querySelectorAll('iframe[src*="player.vimeo"]');
				if (vimeoIframes.length > 0) {
					vimeoIframes.forEach(reframe);
				}

				// process YouTube iframes
				console.log('processing youtube');
				processYouTubeIframes();


				let playVideo = function () {
					this.closest('.video').classList.add('playing');

				};
				// set up video play button events
				let playButtons = document.querySelectorAll(".video .play-button");
				playButtons.forEach(function (button) {
					button.addEventListener("click", playVideo.bind(button), {
						once: true,
					}, false);
				});
			},
			onLeave: function () {
				stAudio.stopAllPlayers();
			},
		});
		CommonView.init();

		/* eslint-disable */
		Barba.Pjax.start({
			/* eslint-enable */
			showFullscreenModal: false,
		});

	},
	finalize() {
		// JavaScript to be fired on all pages, after page specific JS is fired
	},
};
