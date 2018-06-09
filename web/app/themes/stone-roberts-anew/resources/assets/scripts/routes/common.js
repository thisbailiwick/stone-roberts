import reframe from 'reframe.js';
import {moreInfo} from '../more-info';
import {stAudio} from '../st-audio';
import {zoomy} from '../zoomy';
import {nakasentro} from '../centered';
import {artworkInfo} from '../artwork-info';

export default {
	init() {
		// JavaScript to be fired on all pages

		var playVideo = function () {
			var iframeCode = this.getAttribute("data-embed");
			var parent = this.parentNode.parentNode;
			this.parentNode.outerHTML = iframeCode;
			reframe(parent.querySelector("iframe"));
		};
		var playButtons = document.querySelectorAll(".video .play-button");
		playButtons.forEach(function (value) {
			value.addEventListener("click", playVideo.bind(value), {
				once: true,
			}, false);
		});

		// add modal
		var $modal = $("#modal");
		$modal.on("show.bs.modal", function (e) {
			var $video_wrap = $modal.find(".video-embed");
			var embed = decodeURIComponent(
				$(e.relatedTarget)
					.data("embed")
					.replace(/\+/g, " ")
			);
			$video_wrap.append(embed);
			window.setTimeout(function () {
				$video_wrap.fitVids();
			}, 200);
		});

		$modal.on("hide.bs.modal", function () {
			$modal.find(".fluid-width-video-wrapper").remove();
		});

		function debounce(func, wait, immediate) {
			var timeout;
			return function () {
				var context = this,
					args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(context, args);
				}
			};
		}

		// setup resize event after user stops resizing
		var resize_event = debounce(function () {
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
		var CommonView = Barba.BaseView.extend({
			/* eslint-enable */
			namespace: "common",
			onEnterCompleted: function () {
				// The Transition has just finished.

				// spin up share
				/* eslint-disable */
				share.init();
				/* eslint-enable */

				//spin up audio
				stAudio.init();

				// wait for images to load before spinning up the artwork animation
				var images = document.querySelectorAll('.main .artwork_piece .main-img');
				var imagesCount = images.length;
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
