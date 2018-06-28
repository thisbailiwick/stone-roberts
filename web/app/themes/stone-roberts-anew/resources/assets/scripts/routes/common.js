import {moreInfo} from '../more-info';
import {stAudio} from '../st-audio';
import {zoomy} from '../zoomy';
import {nakasentro} from '../nakasentro';
import {artworkInfo} from '../artwork-info';
import * as initMenuVerticalPush from '../../../../../../mu-plugins/menu-vertical-push/menu-vertical-push';
import {addBackToTop} from 'vanilla-back-to-top';
import { init as thumbnailInit, setInitFalse as setThumbnailInitFalse} from '../thumbnail-nav';

export default {
	init() {
		// JavaScript to be fired on all pages

		window.onload = function () {
			// init menu-vertical-push
			initMenuVerticalPush.init();
			addBackToTop({zIndex: 2});

			// Detects if device is on iOS
			const isIos = () => {
				const userAgent = window.navigator.userAgent.toLowerCase();
				return /iphone|ipad|ipod/.test( userAgent );
			};
// Detects if device is in standalone mode
			const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
			if (isIos() && !isInStandaloneMode()) {
				this.setState({ showInstallMessage: true });
			}
		};

		let playVideo = function () {
			this.closest('.video').classList.add('playing');

		};

		let playButtons = document.querySelectorAll(".video .play-button");
		playButtons.forEach(function (button) {
			button.addEventListener("click", playVideo.bind(button), {
				once: true,
			}, false);
		});

		// add modal
		// let $modal = $("#modal");
		// $modal.on("show.bs.modal", function (e) {
		// 	let $video_wrap = $modal.find(".video-embed");
		// 	let embed = decodeURIComponent(
		// 		$(e.relatedTarget)
		// 			.data("embed")
		// 			.replace(/\+/g, " ")
		// 	);
		// 	$video_wrap.append(embed);
		// 	window.setTimeout(function () {
		// 		$video_wrap.fitVids();
		// 	}, 200);
		// });
		//
		// $modal.on("hide.bs.modal", function () {
		// 	$modal.find(".fluid-width-video-wrapper").remove();
		// });

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
			return this; // for chaining...
		};

		// init fullscreen
		/* eslint-disable */
		let CommonView = Barba.BaseView.extend({
			/* eslint-enable */
			namespace: "common",
			onEnterCompleted: function () {
				// The Transition has just finished.

				// init thumbnails
				setThumbnailInitFalse();
				thumbnailInit(document.querySelector('.main'));

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
			},
			onLeave: function () {
				stAudio.stopAllPlayers();
			},
		});
		CommonView.init();

		/* eslint-disable */
		Barba.Pjax.start({
			/* eslint-enable */
			showFullscreenModal: true,
		});

	},
	finalize() {
		// JavaScript to be fired on all pages, after page specific JS is fired
	},
};
