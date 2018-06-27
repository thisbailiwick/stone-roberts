/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/app/themes/stone-roberts-anew/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var utilities = {
	windowHeight: null,
	windowWidth: null,
	windowRatioWidth: null,
	windowRatioHeight: null,
	windowHalfHeight: null,
	browserOrientation: null,
	bodyOverlay: document.getElementById('body-overlay'),
	init: function () {
		this.setViewportDimensions();

		// throw in closest polyfill
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
		if (!Element.prototype.matches) { Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector; }

		if (!Element.prototype.closest)
			{ Element.prototype.closest = function (s) {
				var el = this;
				if (!document.documentElement.contains(el)) { return null; }
				do {
					if (el.matches(s)) { return el; }
					el = el.parentElement || el.parentNode;
				} while (el !== null && el.nodeType === 1);
				return null;
			}; }
	},
	reset: function () {
		this.windowHeight = null;
		this.windowRatioHeight = null;
		this.windowWidth = null;
		this.windowRatioWidth = null;
		this.windowHalfHeight = null;
		this.browserOrientation = null;
	},
	getViewportDimensions: function () {
		// TODO: will this work with fullscreen?
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName("body")[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight || e.clientHeight || g.clientHeight;

		return {width: x, height: y};
	},
	setViewportDimensions: function () {
		var viewportDimensions = this.getViewportDimensions();
		this.windowHeight = viewportDimensions.height;
		this.windowWidth = viewportDimensions.width;
		this.windowRatioWidth = this.windowWidth / this.windowHeight;
		this.windowRatioHeight = this.windowHeight / this.windowWidth;
		this.windowHalfHeight = this.windowHeight / 2;
		this.browserOrientation = this.getBrowserOrientation();
	},
	isElementInViewport: function (el) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
		);
	},
	isTouchDevice: function () {
		return "ontouchstart" in document.documentElement;
	},
	getElementOffsetFromDoc: function (el) {
		// https://stanko.github.io/javascript-get-element-offset/
		var rect = el.getBoundingClientRect();

		return {
			top: rect.top + window.pageYOffset,
			left: rect.left + window.pageXOffset,
		};
	},
	getSiblingsWithClass: function (child, skipMe, elementClass) {
		var r = [];
		for (; child; child = child.nextSibling) {
			if (child.nodeType == 1 && child != skipMe && child.classList.contains(elementClass)) {
				r.push(child);
			}
		}
		return r;
	},

	// return the first element which has class
	getSiblingByClass: function (element, elementClass) {
		return this.getSiblingsWithClass(element.parentNode.firstChild, element, elementClass)[0];
	},

	getImageSizeChangeTechnique: function (image, container, xPadding, yPadding) {
		container = typeof container != 'undefined'
			?
			container
			:
			null;
		xPadding = typeof xPadding != 'undefined'
			?
			xPadding
			:
			0;
		yPadding = typeof yPadding != 'undefined'
			?
			yPadding
			:
			0;
		var containerRatioWidth = null;
		var containerRatioHeight = null;
		if (container != null) {
			containerRatioWidth = (container.clientWidth - xPadding) / (container.clientHeight - yPadding);
		} else {
			containerRatioWidth = this.windowRatioWidth;
			containerRatioHeight = this.windowRatioHeight;

		}

		// figure out which way to change image size
		var imageRatioWidth = image.naturalWidth / image.naturalHeight;
		var imageRatioHeight = image.naturalHeight / image.naturalWidth;

		if (imageRatioWidth > containerRatioWidth) {
			return "width";
		} else if (imageRatioHeight > containerRatioHeight) {
			return "height";
		}

	},

	getBrowserOrientation: function () {
		return this.windowHeight > this.windowWidth
			?
			"portrait"
			:
			"landscape";
	},

	showOverlay: function () {
		document.body.classList.add('show-body-overlay');
	},

	hideOverlay: function () {
		document.body.classList.remove('show-body-overlay');
	},

	addCssToPage: function (styles, id) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = styles;
		style.setAttribute('id', id);
		document.getElementsByTagName('head')[0].appendChild(style);
	},
	removeCssFromPage: function (ids) {
		ids.forEach(function (id) {
			var el = document.getElementById(id);
			el.parentNode.removeChild(el);
		});
	},
};

utilities.init();

module.exports = utilities;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nakasentro", function() { return nakasentro; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__center_scroll_to__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__ = __webpack_require__(12);





var nakasentro = {
	fullscreen: document.querySelector(".fullscreen"),
	fullscreenWrapper: document.querySelector('.fullscreen-wrapper'),
	artworks_elements: document.querySelectorAll(".artwork_piece"),
	artworks: Array(),
	mainContentWidth: null,
	mainContentWrap: document.querySelector(".content>.main"),
	imageCentered: false,
	imageCenteredElement: null,
	scrollBeingThrottled: false,
	isTouchDevice: false,
	// helps us not process items in the midst of resizing
	isResizing: false,
	consideredCenteredPercentage: 10,
	recentlyAddedCenteredClasses: false,
	recentlyRemovedCenteredClasses: false,
	fixedImageScrollReleaseCount: 0,
	imagesProcessed: false,
	mouse_map_less_pixels: 40,

	init: function () {
		//reset values
		this.reset();

		this.isTouchDevice = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isTouchDevice();
		// init thumbnails
		Object(__WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__["init"])(document.querySelector('.main'));
		if (this.isTouchDevice === false) {

			// setup values
			this.setupValues(true);

			// init-center-scroll-to

			// nakasentro.checkArtworks(true);
			// for when not in fullscreen
			window.addEventListener(
				"scroll",
				function () {
					if (!this.isResizing && nakasentro.imagesProcessed === true) {
						nakasentro.checkArtworks();
					}
				}.bind(this)
			);
			window.addEventListener(
				"scroll",
				function () {
					if (!nakasentro.isResizing && nakasentro.imagesProcessed === true) {
						nakasentro.checkArtworks();
					}
				}
			);

			// for when in fullscreen
			nakasentro.fullscreen.addEventListener("scroll", function () {
				if (!this.isResizing && nakasentro.imagesProcessed === true) {
					nakasentro.checkArtworks();
				}
			});

			// add event to handle any code needed when there is a fullscreen change event
			document.addEventListener('barbaFullscreenOnChange', this.fullScreenOnChangeEvent.bind(this), false);
		} else {
			this.mobileSetup(true);
		}

	},
	mobileSetup: function (isInit) {
		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses("orientation-" + __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.browserOrientation);
		nakasentro.artworks_elements.forEach(function (artwork, index) {
			var artworkElements = this.getArtworkElements(artwork, index);
			if (isInit === false) {
				this.resetImageValues(artworkElements);
			}
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			var imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkElements.artworkWrap);

			window.addEventListener('resize', this.mobileResize.bind(artworkElements));

			nakasentro.artworks.push({
				artworksIndex: nakasentro.artworks.length,
				element: artwork,
				artworkImage: artworkElements.artworkImage,
				imageSizeChangeTechnique: imageSizeChangeTechnique,
				artworkWrap: artworkElements.artworkWrap,
				artworkImageWrap: artworkElements.artworkImageWrap,
				centerImageWrap: artworkElements.centerImageWrap,
				artworkMetaWrap: artworkElements.artworkMetaWrap,
				zoomyWrap: artworkElements.zoomyWrap,
				imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
				artworkUniqueId: artworkElements.artworkUniqueId,
				imageCentered: false,
				fullscreenImageCentered: false,
				isInViewport: false,
				imgSrc: artworkElements.imgSrc,
			});

			Object(__WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__["addThumbnail"])(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// add to thumbnails
	},
	mobileResize: __WEBPACK_IMPORTED_MODULE_1_underscore___default.a.debounce(function () {
		// utilities.setViewportDimensions();
		// nakasentro.setArtworkSizeChangeTechnique(this.artworkImage, this.artworkWrap);
		nakasentro.artworks = [];
		nakasentro.mobileSetup(false);
	}, 250),
	fullScreenOnChangeEvent: function () {
		// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements
		/* eslint-disable */
		if (Barba.FullScreen.isFullscreen === false) {
			/* eslint-enable */
			nakasentro.removeFullscreenCenteredImageScrollEvents.call(this, true);
		}
	},
	removeFullscreenCenteredImageScrollEvents: function (removeAllWheel) {
		removeAllWheel = typeof removeAllWheel === "boolean"
			? removeAllWheel
			: false;
		window.removeEventListener('keydown', this.keydownEvent);
		if (removeAllWheel === false) {
			// 'this' is the artwork
			this.zoomyWrap.removeEventListener('wheel', this.wheelEvent);
		} else {
			// 'this' is nakasentro
			this.artworks.forEach(function (artwork) {
				artwork.zoomyWrap.removeEventListener('wheel', artwork.wheelEvent);
			})
		}
	},
	reset: function () {
		// set values back to initial setup
		this.fullscreen = document.querySelector(".fullscreen");
		this.artworks_elements = document.querySelectorAll(".artwork_piece");
		this.artworks = Array();
		// this.windowHeight = null;
		// this.windowWidth = null;
		// this.windowRatioWidth = null;
		this.mainContentWidth = null;
		this.mainContentWrap = document.querySelector(".content>.main");
		this.imageCentered = false;
		this.imageCenteredElement = null;
		this.scrollBeingThrottled = false;
		document.body.classList.remove("orientation-portrait", "orientation-landscape", "centered-image");
		document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
			this.removeArtworkPieceCentered(artworkPiece);
		}, this);
	},

	resetAllCenteredSettings: function () {
		document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
			this.removeArtworkPieceCentered(artworkPiece);
		}, this);
		this.removeBodyImageCenteredClasses();
	},

	removeArtworkPieceCentered: function (artworkPiece) {
		artworkPiece.classList.remove('centered'/*, 'centered-image-transition-duration'*/);
		nakasentro.imageCentered = false;
		// nakasentro.imageCenteredElement = null;
	},
	removeBodyImageCenteredClasses: function () {
		document.body.classList.remove("centered-image");
		window.setTimeout(function () {
			// here we delay removing a class to allow some css transitions to happen
			nakasentro.imageCenteredElement.classList.remove("centered-image-transition-duration");
		}, 400);
	},
	// setViewportDimensions: function() {
	//   let viewportDimensions = this.getViewportDimensions();
	//   this.windowHeight = viewportDimensions.height;
	//   this.windowWidth = viewportDimensions.width;
	//   this.windowRatioWidth = this.windowWidth / this.windowHeight;
	// },
	// resetImageValues: function (artworkImage, artworkImageWrap) {
	// 	artworkImage.setAttribute("style", "");
	// },
	resetImageValues: function (artwork) {
		artwork.artworkImage.setAttribute("style", "");
		artwork.zoomyWrap.setAttribute("style", "");
		artwork.imageRatioHolder.setAttribute('style', '');
	},
	getArtworkElements: function (artwork, index) {
		var artworkWrap = artwork;
		artworkWrap.setAttribute('artworks-index', index);
		var artworkUniqueId = artwork.getAttribute('id');
		var artworkImageWrap = artwork.querySelector(".image-wrap");
		var centerImageWrap = artworkImageWrap.querySelector('.center-image-wrap');
		var artworkImage = artworkImageWrap.querySelector(".main-img");
		var zoomyWrap = artworkImageWrap.querySelector(".zoomy-wrap");
		var imageSpacePlaceholder = artworkImageWrap.querySelector('.image-space-placeholder');
		var imageRatioHolder = artworkImageWrap.querySelector('.image-ratio-holder');
		var mouseMapImage = artworkImageWrap.querySelector(".mouse-map");
		var artworkMetaWrap = artworkImageWrap.querySelector(".artwork-meta");
		var imgSrc = artworkImage.getAttribute('src');
		return {
			artworkWrap: artworkWrap,
			artworkUniqueId: artworkUniqueId,
			artworkImageWrap: artworkImageWrap,
			centerImageWrap: centerImageWrap,
			artworkImage: artworkImage,
			zoomyWrap: zoomyWrap,
			imageSpacePlaceholder: imageSpacePlaceholder,
			imageRatioHolder: imageRatioHolder,
			mouseMapImage: mouseMapImage,
			artworkMetaWrap: artworkMetaWrap,
			imgSrc: imgSrc,
		};
	},
	setArtworkSizeChangeTechnique: function (artworkImage, artworkWrap) {
		var imageSizeChangeTechnique = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getImageSizeChangeTechnique(artworkImage);
		artworkWrap.classList.remove('width', 'height');
		artworkWrap.classList.add(imageSizeChangeTechnique);
		return imageSizeChangeTechnique;
	},
	setupValues: function (isInit) {
		nakasentro.imagesProcessed = false;
		isInit = typeof isInit === "boolean"
			? isInit
			: false;
		this.reset();

		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses("orientation-" + __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.browserOrientation);

		nakasentro.artworks_elements.forEach(function (artwork, index) {
			// let zoomWrap = artwork.querySelector('.zoom-wrap');
			var artworkElements = this.getArtworkElements(artwork, index);

			var styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';

			if (isInit === false) {
				this.resetImageValues(artworkElements);
				__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.removeCssFromPage([styleBlockId]);
			}


			// document.body.classLifst.remove('artworks-processed');

			// we need to compare the ratio of the viewport to the ratio of the image.
			// debugger;
			// console.log(artworkElements.artworkImage.clientWidth, artworkElements.artworkImage.clientHeight);

			// temporarily set maxHeight for processing
			artworkElements.artworkImage.style.maxHeight = '100vh';

			artworkElements.artworkImage.style.minHeight = artworkElements.artworkImage.clientHeight + "px";
			artworkElements.artworkImage.style.minWidth = artworkElements.artworkImage.clientWidth + "px";

			var imageVhValue = artworkElements.artworkImage.clientHeight / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100;
			var imageVwValue = artworkElements.artworkImage.clientWidth / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth * 100;
			if (imageVhValue === 0) {
				// debugger;
				// console.log("———————————image values are zero on init!!!!");
			}
			var imageVhValueToFull = 100 - imageVhValue;

			// let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkWrap);
			var imageSizeChangeTechnique = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getImageSizeChangeTechnique(artworkElements.artworkImage);
			artworkElements.artworkWrap.classList.remove('width', 'height');
			artworkElements.artworkWrap.classList.add(imageSizeChangeTechnique);


			var imageRatioWidth = artworkElements.artworkImage.clientWidth / artworkElements.artworkImage.clientHeight;
			var imageRatioHeight = artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth;

			if (artworkElements.artworkImage.clientHeight >= __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight) {
				artworkElements.imageRatioHolder.style.height = artworkElements.artworkImage.clientHeight + "px";
				artworkElements.imageRatioHolder.style.width = artworkElements.artworkImage.clientWidth + "px";
			} else {
				artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
			}


			var imageViewportWidthRatio = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth / artworkElements.artworkImage.clientWidth;
			var imageViewportHeightRatio = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight / artworkElements.artworkImage.clientHeight;

			artworkElements.mouseMapImage.setAttribute('scaleWidth', imageViewportWidthRatio);
			artworkElements.mouseMapImage.setAttribute('scaleHeight', imageViewportHeightRatio);


			var imageMaxHeight = null;
			// get image max height
			if (imageSizeChangeTechnique === "width") {
				// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
				imageMaxHeight = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			} else {
				// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
				imageMaxHeight = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight;
			}

			// get image max height
			// if (imageSizeChangeTechnique === "height") {
			// 	// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
			// 	const imageMaxWidth = utilities.windowWidth * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			// } else {
			// 	// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
			// 	const imageMaxWidth = utilities.windowWidth;
			// }
			var imageOffsetFromDocTop = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getElementOffsetFromDoc(artworkElements.artworkImage).top;
			var imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

			nakasentro.artworks.push({
				artworksIndex: nakasentro.artworks.length,
				element: artwork,
				artworkImage: artworkElements.artworkImage,
				imageSizeChangeTechnique: imageSizeChangeTechnique,
				imageOffsetFromDocTop: imageOffsetFromDocTop,
				imageMaxHeight: imageMaxHeight,
				imageMaxHeightCenterPointFromDocTop: imageMaxHeightCenterPointFromDocTop,
				imageRatioHolder: artworkElements.imageRatioHolder,
				artworkWrap: artworkElements.artworkWrap,
				artworkImageWrap: artworkElements.artworkImageWrap,
				centerImageWrap: artworkElements.centerImageWrap,
				artworkMetaWrap: artworkElements.artworkMetaWrap,
				zoomyWrap: artworkElements.zoomyWrap,
				imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
				artworkUniqueId: artworkElements.artworkUniqueId,
				imageCentered: false,
				isInViewport: false,
				toCenterPixels: 0,
				imgSrc: artworkElements.imgSrc,
				// this allows us to track centered image when in fullscreen and we use the counted scroll events or keyboard events to trigger the image out of full width
				fullscreenImageCentered: false,
				// mouseMapImage: artworkElements.mouseMapImage,
				originalDimensions: {
					width: artworkElements.artworkImage.clientWidth,
					height: artworkElements.artworkImage.clientHeight,
					imageRatioWidth: imageRatioWidth,
					imageRatioHeight: imageRatioHeight,
					imageVwValue: imageVwValue,
					imageVhValue: imageVhValue,
					imageVhValueToFull: imageVhValueToFull,
					imageViewportWidthRatio: imageViewportWidthRatio,
					imageViewportHeightRatio: imageViewportHeightRatio,
				},
				dynamicImageValues: {
					toCenterPercentage: null,
					imageVhValueToFull: imageVhValueToFull,
					imageCurrentHeight: imageVhValue,
					imageCurrentWidth: imageVwValue,
				},
			});

			nakasentro.artworks[index].wheelEvent = nakasentro.fullscreenHandleZoomyDivScroll.bind(nakasentro.artworks[index]);
			nakasentro.artworks[index].keydownEvent = nakasentro.handlePossibleScrollTrigger.bind(nakasentro.artworks[index]);

			// let artworkStyles = '';
			// if (utilities.browserOrientation === 'portrait') {
			// 	artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .zoomy-wrap, #' + artworkElements.artworkUniqueId + ' .image-space-placeholder, #' + artworkElements.artworkUniqueId + ' .image-center-wrap {width: ' + artworkImage.clientWidth + 'px; height: ' + artworkImage.clientHeight + 'px; }';

			// let artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			var styleBlock = document.getElementById(styleBlockId);
			if (styleBlock !== null) {
				styleBlock.remove();
			}
			// console.log(artworkElements.artworkUniqueId, imageViewportHeightRatio, imageViewportWidthRatio);
			// let artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			// create styles for .main-img and .mouse-map width and height

			var artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .mouse-map-wrap {width: ' + artworkElements.artworkImage.clientWidth + 'px; height: ' + artworkElements.artworkImage.clientHeight + 'px;}';


			var mouseMapWidth = artworkElements.artworkImage.clientWidth - nakasentro.mouse_map_less_pixels;
			var mouseMapHeight = artworkElements.artworkImage.clientHeight - nakasentro.mouse_map_less_pixels;

			artworkStyles += '#' + artworkElements.artworkUniqueId + ' .mouse-map {width: ' + mouseMapWidth + 'px; height: ' + mouseMapHeight + 'px;}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is height
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .mouse-map-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is width
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .mouse-map-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';


			// remove temporary max height for image after processing
			artworkElements.artworkImage.style.maxHeight = 'none';


			artworkElements.artworkImage.style.position = 'static';
			artworkElements.centerImageWrap.style.height = 0;

			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.addCssToPage(artworkStyles, styleBlockId);

			// add to thumbnails
			Object(__WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__["addThumbnail"])(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// init button scroll to script
		Object(__WEBPACK_IMPORTED_MODULE_2__center_scroll_to__["init"])();

		nakasentro.imagesProcessed = true;

		// document.body.classList.add("artworks-processed");
		window.addEventListener("resize", this.debounceWindowResize);
		window.addEventListener("resize", function () {
			if (nakasentro.isResizing === false) {
				document.body.classList.add("viewport-resizing");
				nakasentro.isResizing = true;
			}
		});
	},

	debounceWindowResize: __WEBPACK_IMPORTED_MODULE_1_underscore___default.a.debounce(function () {
		var currentViewportDimenstions = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getViewportDimensions();
		if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight !== currentViewportDimenstions.height || __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			nakasentro.setupValues();
		}
		document.body.classList.remove("viewport-resizing");
		nakasentro.isResizing = false;
	}, 250),

	windowResize: function () {
		var currentViewportDimenstions = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getViewportDimensions();
		if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight !== currentViewportDimenstions.height || __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			nakasentro.setupValues();
		}
	},

	setBodyClasses: function (classes) {
		document.querySelector("body").classList.add(classes);
	},

	getPixelsToCenter: function (distanceFromTopOfViewport) {
		var viewport_center = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHalfHeight;
		return viewport_center - distanceFromTopOfViewport;
	},

	getPercentageToCenter: function (toCenterPixels) {
		return (toCenterPixels / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100) * 1.39;
	},

	getVhToCenter: function (toCenterPixels) {
		return toCenterPixels / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100;
	},

	getToCenterPixels: function (artwork) {
		var rect = artwork.imageSpacePlaceholder.getBoundingClientRect();
		var distanceFromTopOfViewport = rect.top + rect.height / 2;
		var toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);
		return toCenterPixels;
	},

	setArtworkToCenterPixels: function (artwork) {
		var toCenterPixels = this.getToCenterPixels(artwork);
		nakasentro.artworks[artwork.artworksIndex].toCenterPixels = toCenterPixels;
		return toCenterPixels;
	},

	possiblyCenterUncenterImage: function (artwork) {
		var toCenterPixels = this.setArtworkToCenterPixels(artwork);

		// TODO: this is about 51 pixels off, why?!
		var toCenterPixelsAbsolute = Math.abs(toCenterPixels);

		var toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);

		// if we're close to the centerpoint of an image, we trigger a scroll to
		if (toCenterPercentage < nakasentro.consideredCenteredPercentage) {
			// image is centered
			if (this.imageCentered === false && artwork.fullscreenImageCentered === false/* && this.recentlyAddedCenteredClasses === false*/) {
				// if in fullscreen we want to add these events to handle scroll when centered and scroll events is not triggered due to fixed elements

				/* eslint-disable */
				if (Barba.FullScreen.isFullscreen === true) {
					/* eslint-enable */
					artwork.fullscreenImageCentered = true;
				}
				window.addEventListener('keydown', artwork.keydownEvent);
				artwork.zoomyWrap.addEventListener('wheel', artwork.wheelEvent, {passive: true});
				// this.recentlyAddedCenteredClasses = true;
				// window.setTimeout(function () {
				// 	nakasentro.recentlyAddedCenteredClasses = false;
				// }, 250);
				document.body.classList.add("centered-image");
				// console.log('setting centered classes');

				// overarching imageCentered toggle
				this.imageCentered = true;
				nakasentro.imageCenteredElement = artwork.element;

				// speicific artwork iamgeCentered toggle
				artwork.imageCentered = true;
				// artwork.artworkWrap.style.top = artwork.artworkWrap.getBoundingClientRect().top;
				artwork.artworkWrap.classList.add("centered", "centered-image-transition-duration");
			}

			// if (artwork.imageSizeChangeTechnique === "width") {
			// 	// only change the length if it's larger than the original
			// 	this.resizePortrait(artwork, 100);
			// } else {
			// 	this.resizeLandscape(artwork, 100);
			// }

		} else if (artwork.fullscreenImageCentered === true) {
			// set false variable tracking fullwidth centered image when in fullscreen.
			artwork.fullscreenImageCentered = false;
		} else if (artwork.imageCentered === true) {
			// console.log(artwork);
			if (toCenterPercentage > nakasentro.consideredCenteredPercentage) {
				// console.log('turning off');

				// image is not centered

				if (this.imageCentered === true /*&& this.recentlyRemovedCenteredClasses === false*/) {

					// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements

					// overarching imageCentered toggle
					this.imageCentered = false;

					// speicific artwork iamgeCentered toggle
					artwork.imageCentered = false;
					document.body.classList.remove("centered-image");
					artwork.artworkWrap.classList.remove("centered");

					// TODO: is this needed here?
					// this.resetImageValues(artwork);

					window.setTimeout(function () {
						// here we delay removing a class to allow some css transitions to happen
						artwork.artworkWrap.classList.remove("centered-image-transition-duration");
						this.imageCenteredElement = null;
					}, 400);
				}
			}
		}
	},

	handlePossibleScrollTrigger: function (e) {
		if (e.code !== 'ArrowRight' && e.code !== 'ArrowLeft') {
			nakasentro.removeBodyImageCenteredClasses.call(this.artworkWrap);
			nakasentro.removeArtworkPieceCentered(this.artworkWrap);
			this.imageCentered = false;
			nakasentro.removeFullscreenCenteredImageScrollEvents.call(this);
		} else {
			e.preventDefault();
		}
	},

	fullscreenHandleZoomyDivScroll: function () {
		if (nakasentro.fixedImageScrollReleaseCount >= 20) {
			nakasentro.removeBodyImageCenteredClasses.call(this.artworkWrap);
			nakasentro.removeArtworkPieceCentered(this.artworkWrap);
			this.imageCentered = false;
			nakasentro.fixedImageScrollReleaseCount = 0;
			nakasentro.removeFullscreenCenteredImageScrollEvents.call(this);
		} else {
			nakasentro.fixedImageScrollReleaseCount++;
		}
	},

	setNewWidthValues: function (toCenterPercentage, artwork) {
		var newWidthLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVwValue);
		this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentWidth = newWidthLength;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newWidthLength;
		// console.log('newWidthLength: ' + newWidthLength);
		this.resizePortrait(artwork, newWidthLength);
	},
	setNewHeightValues: function (toCenterPercentage, artwork) {
		var newLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVhValue);
		this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;

		this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentHeight = newLength;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newLength;
		// console.log('toCenterPercentage: ' + toCenterPercentage);
		// console.log('newLength: ' + newLength);
		this.resizeLandscape(artwork, newLength);
	},

	getNewLength: function (toCenterPercentage, originalDimensionValue) {
		// console.log(toCenterPercentage);
		// @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
		// @b is the beginning value of the property.
		// @c is the change between the beginning and destination value of the property.
		// @d is the total time of the tween.
		// TODO: Figure out a better name for lengthValue
		// let lengthValue = this.browserOrientation === "portrait" ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
		// lengthValue = lengthValue * .45;

		// let w = window,
		//   doc = document,
		//   e = doc.documentElement,
		//   g = doc.getElementsByTagName("body")[0],
		//   x = w.innerWidth || e.clientWidth || g.clientWidth,
		//   y = w.innerHeight || e.clientHeight || g.clientHeight;

		// let result = x * lengthValue / 100;
		// console.log("result: " + result);
		// console.log('toCenterPercentage: ' + toCenterPercentage);
		var toCenterPercentagePassed = 100 - toCenterPercentage;
		// console.log('toCenterPercentagePassed: ' + toCenterPercentagePassed);
		var t = toCenterPercentagePassed;
		var b = originalDimensionValue;
		var c = 100 - originalDimensionValue;
		var d = 100;
		// console.log(t, b, c, d);
		var newLength = c * t / d + b;
		// console.log('newLength: ' + newLength);
		// if (newLength > 100) {
		//   newLength = 100;
		// }

		newLength = newLength < originalDimensionValue
			? originalDimensionValue
			: newLength;
		// console.log('newLength: ' + newLength);
		return newLength;
	},

	resizePortrait: function (artwork, imageNewWidth) {
		if (artwork.artworkImage.clientWidth >= artwork.originalDimensions.width) {
			var width = imageNewWidth + "vw";
			var imageWidth = artwork.artworkImage.clientWidth;
			var imageHeight = artwork.artworkImage.clientHeight + "px";
			artwork.artworkImage.style.width = width;
			artwork.zoomyWrap.style.height = imageHeight;
			artwork.zoomyWrap.style.width = width;
			artwork.artworkMetaWrap.style.width = imageWidth + "px";

			//this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
			// artwork.imageSpacePlaceholder.style.height = imageNewWidth / artwork.originalDimensions.imageRatioWidth + 'vh';
		}
	},

	resizeLandscape: function (artwork, imageNewHeight) {
		if (artwork.artworkImage.clientHeight >= artwork.originalDimensions.height) {
			var height = imageNewHeight + "vh";
			var imageWidth = artwork.artworkImage.clientWidth + "px";
			artwork.artworkImage.style.height = height;
			artwork.zoomyWrap.style.height = height;
			artwork.zoomyWrap.style.width = imageWidth;
			artwork.artworkMetaWrap.style.width = imageWidth;

			//this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
			// artwork.imageSpacePlaceholder.style.height = height;
		}
	},

	checkArtworks: function () {
		nakasentro.artworks.forEach(function (artwork) {
			if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isElementInViewport(artwork.artworkImage)) {
				artwork.isInViewport = true;
				nakasentro.possiblyCenterUncenterImage(artwork);
			} else {
				artwork.isInViewport = false;
				this.setArtworkToCenterPixels(artwork);
			}
		}, this);
	},
};



/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform);
// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var firstTargetElement = null;
var allTargetElements = [];
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;
  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
      var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

      if (_reserveScrollBarGap && scrollBarGap > 0) {
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = scrollBarGap + 'px';
      }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  });
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    if (previousBodyPaddingRight !== undefined) {
      document.body.style.paddingRight = previousBodyPaddingRight;

      // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
      // can be set again.
      previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
      document.body.style.overflow = previousBodyOverflowSetting;

      // Restore previousBodyOverflowSetting to undefined
      // so setOverflowHidden knows it can be set again.
      previousBodyOverflowSetting = undefined;
    }
  });
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  return true;
};

var disableBodyScroll = exports.disableBodyScroll = function disableBodyScroll(targetElement, options) {
  if (isIosDevice) {
    // targetElement must be provided, and disableBodyScroll must not have been
    // called on this targetElement before.
    if (targetElement && !allTargetElements.includes(targetElement)) {
      allTargetElements = [].concat(_toConsumableArray(allTargetElements), [targetElement]);

      targetElement.ontouchstart = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          handleScroll(event, targetElement);
        }
      };
    }
  } else {
    setOverflowHidden(options);

    if (!firstTargetElement) firstTargetElement = targetElement;
  }
};

var clearAllBodyScrollLocks = exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
  if (isIosDevice) {
    // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
    allTargetElements.forEach(function (targetElement) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;
    });

    allTargetElements = [];

    // Reset initial clientY
    initialClientY = -1;
  } else {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

var enableBodyScroll = exports.enableBodyScroll = function enableBodyScroll(targetElement) {
  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    allTargetElements = allTargetElements.filter(function (element) {
      return element !== targetElement;
    });
  } else if (firstTargetElement === targetElement) {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollToElement", function() { return scrollToElement; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nakasentro__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_underscore__);





var centerScrollDiv = null;
var fullscreen = document.querySelector('.fullscreen');

var scrollCheck = __WEBPACK_IMPORTED_MODULE_2_underscore___default.a.debounce(function () {
	var currentCentered = getCurrentCentered();
	checkButtonNavigationDisplay(currentCentered, 'scroll');
}, 100);

function init() {
	centerScrollDiv = document.querySelector('.center-scroll-arrows');

	if (centerScrollDiv === null) {


		__WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill___default.a.polyfill();

		// add arrows
		var arrows = "\n\t\t<div class=\"center-scroll-arrows\"><div class=\"prev\"><svg viewBox=\"0 0 24 24\"><path d=\"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z\"></path></svg></div><div class=\"next\"><svg viewBox=\"0 0 24 24\"><path d=\"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z\"></path></svg></div>\n\t";
		document.querySelector('.fullscreen').insertAdjacentHTML('beforeend', arrows);

		centerScrollDiv = document.querySelector('.center-scroll-arrows');

		var prevButton = centerScrollDiv.querySelector('.center-scroll-arrows .prev');
		var nextButton = centerScrollDiv.querySelector('.center-scroll-arrows .next');

		prevButton.addEventListener('click', goPrevious);
		nextButton.addEventListener('click', goNext);

		// add keydown events
		document.addEventListener('keyup', function (e) {
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

		var currentCentered = getCurrentCentered();
		checkButtonNavigationDisplay(currentCentered, 'scroll');
	}
}

function getCurrentCentered() {
	var closestToZero = 100000000;
	var currentCentered = null;
	Array.from(__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].artworks).filter(function (artwork) {
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
	if (__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].imageCentered === true) {
		// trigger centered removal
		__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].resetAllCenteredSettings();
	}
	var artworkToCenter = checkForPrevious(getCurrentCentered().previousElementSibling);

	if (artworkToCenter !== null) {
		scrollToElement(artworkToCenter);
	}
}


function goNext() {
	if (__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].imageCentered === true) {
		// trigger centered removal
		__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].resetAllCenteredSettings();
	}
	var artworkToCenter = getCurrentCentered().nextElementSibling;

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
		var prevElement = checkForPrevious(artworkToCenter.previousElementSibling);
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
		var nextElement = checkForNext(artworkToCenter.nextElementSibling);
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
	var top = 0;
	do {
		top += element.offsetTop || 0;
		element = element.offsetParent;
	} while (element);
	return top;
}

function getElementMiddle(element) {

	var elementHeight = element.clientHeight;
	var top = getElementTop(element);

	var scrollingWrapHeight = null;
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
	var scrollAmount = getElementMiddle(artworkToCenter);
	scrollToByPixels(scrollAmount);
}

function checkButtonNavigationDisplay(artworkToCenter, direction) {
	if ( direction === void 0 ) direction = 'scroll';

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




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "artworkInfo", function() { return artworkInfo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__);

var artworkInfo = {
	showing: false,
	buttons: null,
	init: function () {
		var buttons = document.querySelectorAll(".artwork_piece .actions .info");
		buttons.forEach(function (button) {
			var artworkWrap = button.closest(".artwork_piece");

			var infoData = {
				button: button,
				artworkWrap: artworkWrap,
				close: artworkWrap.querySelector(".close"),
			};

			// this.buttons.push(infoData);

			infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
			button.addEventListener("click", this.toggleInfo.bind(infoData));
		}, this);
	},
	// reset: function(){
	// 	this.buttons.forEach(function(button) {
	// 		infoData.close.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 		button.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 	}, this);
	// },
	toggleInfo: function () {
		var infoData = this;
		// setTimeout(function () {
		// 	window.scrollBy({
		// 		top: -30,
		// 		left: 0,
		// 		behavior: 'auto'
		// 	});
		// }, 0);
		// disable or enbale scrolling
		// console.log(window.innerHeight);
		if (artworkInfo.showing) {
			Object(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__["clearAllBodyScrollLocks"])();
		} else {
			Object(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__["disableBodyScroll"])();
		}
		infoData.artworkWrap.classList.toggle("show-info");



		//toggle artwork info showing variable
		artworkInfo.showing = !artworkInfo.showing;
	},
};

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stAudio", function() { return stAudio; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_howler__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_howler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_howler__);


var audio = {
  players: Array(),
  init: function() {
    this.reset();
    var playerDoms = document.querySelectorAll(".audio-piece");
    playerDoms.forEach(function(player) {
      this.initPlayer(player);
    }, this);
  },
  reset: function() {
    this.players = Array();
  },
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },

  setElementWidth: function(element, width) {
    element.style.width = width + "px";
  },

  setSeek: function(player, percent) {
    player.seek(player.duration() * percent);
  },

  seekClick: function(e) {
    // e = Mouse click event.
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var percent = x / rect.width;
    stAudio.setSeek(this, percent);
    if (!this.playing()) {
      stAudio.setElementWidth(e.currentTarget.querySelector(".span-value"), x);
      //set timer
      e.currentTarget.querySelector(".timer").innerHTML = stAudio.formatTime(Math.round(this.seek()));
    }
    // console.log(x);
  },

  seekHover: function(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    // var y = e.clientY - rect.top; //y position within the element.
    stAudio.setElementWidth(this, x);
  },

  step: function() {
    // Determine our current seek position.
    var seek = this.this.seek() || 0;
    this.timer.innerHTML = stAudio.formatTime(Math.round(seek));
    this.progress.style.width = (seek / this.this.duration() * 100 || 0) + "%";

    // If the sound is still playing, continue stepping.
    if (this.this.playing()) {
      requestAnimationFrame(stAudio.step.bind(this));
    }
  },

  pauseAllPlayers: function() {
    this.players.forEach(function(player) {
      if (player.playing()) {
        player.pause();
      }
    });
  },

  play: function() {
    // only play if not already playing
    if (!this.playing()) {
      stAudio.pauseAllPlayers();
      this.play();
    }
  },

  setAudioEvents: function(audio, player, progress, progressHover, progressWrap) {

    audio.querySelector(".play").addEventListener("click", this.play.bind(player));

    audio.querySelector(".pause").addEventListener("click", function() {
      if (player.playing()) {
        player.pause();
      }
    });

    progressWrap.addEventListener("mousemove", this.seekHover.bind(progressHover));
    progressWrap.addEventListener("click", this.seekClick.bind(player));
  },

  //spin up audio
  initPlayer: function(audio) {
    var url = audio.getAttribute("data-url");
    var duration = audio.querySelector(".duration");
    var timer = audio.querySelector(".timer");
    var progressWrap = audio.querySelector(".progress.span-value-wrap");
    var progress = progressWrap.querySelector(".span-value");
    var progressHover = progress.querySelector(".span-value-jump");
    var player = new __WEBPACK_IMPORTED_MODULE_0_howler__["Howl"]({
      src: url,
      loop: false,
      volume: 1,
      preload: true,
			onload: function(){
				// Display the duration.
				duration.innerHTML = stAudio.formatTime(Math.round(player.duration()));
			},
      onplay: function() {
        var data = { this: this, timer: timer, progress: progress };
        // Start upating the progress of the track.
        window.requestAnimationFrame(stAudio.step.bind(data));
      },
    });


    this.players.push(player);

    this.setAudioEvents(audio, player, progress, progressHover, progressWrap);
  },

  stopAllPlayers: function() {
    __WEBPACK_IMPORTED_MODULE_0_howler__["Howler"].unload();
  },
};

var stAudio = audio;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moreInfo", function() { return moreInfo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);

var info = {
	infoButtons: null,
	init: function () {
		this.infoButtons = document.querySelectorAll(".actions .info");
		this.infoButtons.forEach(function (button) {
			var imageWrap = button.closest(".image-wrap");
			var pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");
			pieceComparisonWrap.style.width = '';

			var pieceComparisonWrapWidthPixels = pieceComparisonWrap.clientWidth;
			var pieceComparisonWrapHeightPixels = pieceComparisonWrap.clientHeight;

			// piece image
			// var {piece, pieceImageNaturalWidth, pieceImageNaturalHeight, pieceWidthInches, pieceHeightInches, pieceHeightImageRatio, pieceWidthImageRatio} = this.getImageDimensions(pieceComparisonWrap, button);
			var piece = pieceComparisonWrap.querySelector(".comparison-image");
			var pieceWidthInches = button.getAttribute("data-width");
			var pieceImageDimensions = this.getImageDimensions(piece, pieceWidthInches);
			// console.log('pieceComparisonWrapHeightPixels > window.innerHeight: ' + pieceComparisonWrapHeightPixels, window.innerHeight);
			// if(pieceComparisonWrapHeightPixels > window.innerHeight){
			// 	pieceComparisonWrapHeightPixels = window.innerHeight;
			// }
			//
			// console.log(pieceComparisonWrapHeightPixels);

			// forscale image
			var forScale = pieceComparisonWrap.querySelector(".compared-to");
			var forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
			var forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches);



			// get the new dimensions
			// var dimensionValues = this.calculateNewDimensions(pieceWidthInches, pieceImageNaturalWidth, pieceImageNaturalHeight, forScaleWidthInches, pieceHeightInches, forScaleHeightInches, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceHeightImageRatio, pieceWidthImageRatio, forScaleHeightImageRatio, piece, forScale, pieceComparisonWrap);
			var dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceComparisonWrap);
			//console.log('dimensionValues: ', JSON.stringify(dimensionValues));

			piece.style.width = dimensionValues.pieceWidthPixels + "px";
			piece.style.height = dimensionValues.pieceHeightPixels + "px";
			forScale.style.width = dimensionValues.forScaleWidthPixels + "px";
			forScale.style.height = dimensionValues.forScaleHeightPixels + "px";
		}, this);
	},
	getImageDimensions: function (image, widthInches) {
		var fileNaturalWidth = image.naturalWidth;
		var fileNaturalHeight = image.naturalHeight;
		var naturalFileRatio = fileNaturalWidth / fileNaturalHeight;
		// var heightInches = button.getAttribute("data-height");
		var heightInches = widthInches / naturalFileRatio;
		var heightRatioInches = heightInches / widthInches;
		var widthRatioInches = widthInches / heightInches;
		return {
			image: image,
			fileNaturalWidth: fileNaturalWidth,
			fileNaturalHeight: fileNaturalHeight,
			heightInches: heightInches,
			heightRatioInches: heightRatioInches,
			widthInches: widthInches,
			widthRatioInches: widthRatioInches,
		};
	},
	getNewValue: function (value) {
		// return value - 1;
		return value * .997531;
	},
	recalculateNewDimensions: function (dimensionValues) {
		var this$1 = this;

		// var originalHeightRatio = dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels;
		// var originalWidthRatio = dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels;

		do {

			// todo: this may only work with wider than tall images, may need to add alternate
			// get a slightly smaller width value
			dimensionValues.pieceWidthPixels = this$1.getNewValue(dimensionValues.pieceWidthPixels);
			// dimensionValues.pieceHeightPixels = this.getNewValue(dimensionValues.pieceHeightPixels);

			// get the new height value the piece based on the newly found width
			dimensionValues.pieceHeightPixels = this$1.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);

			// get a slightly smaller width for the forscale image
			dimensionValues.forScaleWidthPixels = this$1.getNewValue(dimensionValues.forScaleWidthPixels);
			// dimensionValues.forScaleHeightPixels = this.getNewValue(dimensionValues.forScaleHeightPixels);

			// get forsacle height value based on newly found forscale width value
			dimensionValues.forScaleHeightPixels = this$1.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		} while (
			//make sure piece height is shorter than piece comparison wrap height
		dimensionValues.pieceHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		//make sure forscale height is shorter than piece comparison wrap height
		dimensionValues.forScaleHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		(dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels) > dimensionValues.pieceComparisonWrapWidthPixels);
		return {
			pieceWidthPixels: dimensionValues.pieceWidthPixels,
			pieceHeightPixels: dimensionValues.pieceHeightPixels,
			forScaleWidthPixels: dimensionValues.forScaleWidthPixels,
			forScaleHeightPixels: dimensionValues.forScaleHeightPixels,
		};
	},
	getImageHeightPixels: function (imageWidthPixels, imageHeightRatio) {
		return imageWidthPixels * imageHeightRatio;
	},
	getImageWidthPixels: function (imageHeightPixels, imageWidthRatio) {
		return Math.floor(imageHeightPixels * imageWidthRatio);
	},
	calculateNewDimensions: function (pieceDimensions, forScaleDimensions, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceComparisonWrap) {

		// if the image rotation is portrait we find who is the widest, if landscape then we find who is tallest
		// we then set the baseline height or width to the spacing we have from pieceComparisonWrapHeightPixels or pieceComparisonWrapWidthPixels
		var widthBaseline = null;
		var heightBaseline = null;

		var pieceImageRotation = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getImageSizeChangeTechnique(pieceDimensions.image, pieceComparisonWrap);
		// var forScaleImageRotation = utilities.getImageSizeChangeTechnique(forScaleDimensions.image, pieceComparisonWrap);

		var pieceWidthPixels = null;
		var pieceHeightPixels = null;
		if (pieceImageRotation === 'width') {
			widthBaseline = pieceComparisonWrapWidthPixels;

			// calculate the pixel amounts based off of the baseline

			// piece values
			pieceWidthPixels = widthBaseline;
			pieceHeightPixels = this.getImageHeightPixels(pieceWidthPixels, pieceDimensions.heightRatioInches);
		} else {
			heightBaseline = pieceComparisonWrapHeightPixels;
			// calculate the pixel amounts based off of the baseline

			// piece values
			pieceHeightPixels = heightBaseline;
			pieceWidthPixels = this.getImageWidthPixels(pieceHeightPixels, pieceDimensions.widthRatioInches);

		}

		// this is the ratio of piece width to forscale width
		var pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;
		var pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;


		// get forscale pixel dimensions based of piecetoscale ratios
		var forScaleWidthPixels = Math.floor(pieceWidthPixels / pieceToScaleWidthRatio);
		var forScaleHeightPixels = Math.floor(pieceHeightPixels / pieceToScaleHeightRatio);

		var dimensionValues = {
			pieceWidthPixels: Math.floor(pieceWidthPixels),
			pieceHeightPixels: pieceHeightPixels,
			forScaleWidthPixels: forScaleWidthPixels,
			forScaleHeightPixels: forScaleHeightPixels,
			forScaleHeightImageRatio: forScaleDimensions.heightRatioInches,
			pieceHeightImageRatio: pieceDimensions.heightRatioInches,
			pieceComparisonWrapWidthPixels: pieceComparisonWrapWidthPixels,
			pieceComparisonWrapHeightPixels: pieceComparisonWrapHeightPixels,
			pieceToScaleWidthRatio: pieceToScaleWidthRatio,
			pieceToScaleHeightRatio: pieceToScaleHeightRatio,
		};


		dimensionValues = Object.assign(this.recalculateNewDimensions(dimensionValues), dimensionValues);

		// let's put some space between the images
		var betweenImageMarginPixels = pieceComparisonWrapWidthPixels * .03;

		var totalWidth = dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels;
		pieceComparisonWrap.style.width = totalWidth + 'px';
		dimensionValues.pieceWidthPixels = dimensionValues.pieceWidthPixels - betweenImageMarginPixels;
		dimensionValues.forScaleWidthPixels = dimensionValues.forScaleWidthPixels - betweenImageMarginPixels;

		// do the heights
		dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);

		return dimensionValues;
	},
};

var moreInfo = info;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mousePosition", function() { return mousePosition; });
var mousePosition = {
  // Which HTML element is the target of the event
  mouseTarget: function(e) {
    var targ;
    if (!e) {
			/* eslint-disable */
      var e = window.event;
	    /* eslint-enable */
    }
    if (e.target) {
      targ = e.target;
    } else if (e.srcElement) {
      targ = e.srcElement;
    }
    if (targ.nodeType == 3) {
      // defeat Safari bug
      targ = targ.parentNode;
    }
    return targ;
  },

  // Mouse position relative to the document
  // From http://www.quirksmode.org/js/events_properties.html
  mousePositionDocument: function(e) {
    var posx = 0;
    var posy = 0;
    if (!e) {
			/* eslint-disable */
	    var e = window.event;
	    /* eslint-enable */
    }
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy,
    };
  },

  // Find out where an element is on the page
  findPos: function(obj) {
    var rect = obj.getBoundingClientRect();
    return { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
  },

  // Mouse position relative to the element
  mousePositionElement: function() {
    var mousePosDoc = this.mousePositionDocument.call(this);
    var target = this.mouseTarget.call(this);
    var targetPos = this.findPos(target);
    var posx = mousePosDoc.x - targetPos.left;
    var posy = mousePosDoc.y - targetPos.top;
    return {
      x: posx,
      y: posy,
    };
  },
};

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zoomy", function() { return zoomy; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mousePosition__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nakasentro__ = __webpack_require__(1);





var zoomy = {
	pictures: Array(),
	isTouchDevice: __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isTouchDevice(),
	mouseMapEventsAdded: false,
	mouseMapLessPixelsHalf: __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].mouse_map_less_pixels / 2,
	init: function () {
		this.reset();
		document.querySelectorAll(".artwork_piece .actions .zoom").forEach(function (value, index) {
			var artworkPieceWrap = value.parentNode.parentNode.parentNode.parentNode;
			var zoomyWrap = artworkPieceWrap.querySelector(".zoomy-wrap");
			var mouseMapWrap = zoomyWrap.querySelector('.mouse-map-wrap');
			var mouseMapImage = zoomyWrap.querySelector(".mouse-map");
			var img = artworkPieceWrap.firstElementChild;
			this.pictures.push({
				button: value,
				index: index,
				artworksIndex: artworkPieceWrap.getAttribute('artworks-index'),
				zoomyWrap: zoomyWrap,
				artworkPieceWrap: artworkPieceWrap,
				image: img,
				imageRotation: artworkPieceWrap.classList.contains('width')
					? 'width'
					: 'height',
				mouseMapWrap: mouseMapWrap,
				mouseMapImage: mouseMapImage,
				mouseMapImageHeight: mouseMapImage.clientHeight,
				mouseMapImageWidth: mouseMapImage.clientWidth,
				mouseMoveHandler: null,
				touchMoveHandler: null,
				isZoomed: false,
				scaleWidth: mouseMapImage.getAttribute('scaleWidth'),
				scaleHeight: mouseMapImage.getAttribute('scaleHeight'),
			});

			// here we bind the picture object to the move event handlers so that we can remove them later: https://kostasbariotis.com/removeeventlistener-and-this/
			this.pictures[index].mouseMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);
			this.pictures[index].touchMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);

			// set up the click event to toggle the magnifier for both button and image itself
			value.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
			mouseMapWrap.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
			if (this.isTouchDevice) {
				document.body.classList.add("is-touch");
			}
		}, zoomy);
	},

	reset: function () {
		this.pictures = Array();
	},

	toggleZoom: function (e) {
		var this$1 = this;

		if (e.currentTarget.classList.contains('mouse-map') || e.currentTarget.classList.contains('mouse-map-wrap')) {
			zoomy.mapMouseToImage.call(this, e);
		}
		this.artworkPieceWrap.classList.toggle("zoomed");
		document.body.classList.toggle("zoomed");
		this.isZoomed = !this.isZoomed;
		if (zoomy.isTouchDevice) {
			if (this.isZoomed === true) {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(this.mouseMapImage);
			} else {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(this.mouseMapImage);
			}
		}

		function removeZoomedDelayClass(element) {
			element.artworkPieceWrap.classList.remove('zoomed-delay');
		}

		if (this.isZoomed === false) {
			window.setTimeout(function () {removeZoomedDelayClass(this$1)}, 250);
		} else {
			this.artworkPieceWrap.classList.add('zoomed-delay');
		}

		if (this.isZoomed === true && zoomy.mouseMapEventsAdded === false) {
			zoomy.mouseMapEventsAdded = true;
			this.mouseMapImage.addEventListener("mousemove", this.mouseMoveHandler, {passive: true});
			this.mouseMapImage.addEventListener("touchmove", this.touchMoveHandler, {passive: true});
		} else if (zoomy.mouseMapEventsAdded) {
			zoomy.mouseMapEventsAdded = false;
			this.mouseMapImage.removeEventListener("mousemove", this.mouseMoveHandler, false);
			this.mouseMapImage.removeEventListener("touchmove", this.touchMoveHandler, false);
		}
	},
	mapMouseToImage: function (e) {
		var mouseMap = this.mouseMapImage;
		var position = __WEBPACK_IMPORTED_MODULE_2__mousePosition__["mousePosition"].mousePositionElement(e);

		if (position.x > 0) {
			var leftPercentage = 0;
			var topPercentage = 0;

			if (__WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].imageCentered === true) {
				// image centered
				// adjust the percentage based on the scale amount (the transfoorm: scale() messes with the sizes somehow
				if (this.imageRotation === 'width') {
						leftPercentage = (position.x / (mouseMap.clientWidth * this.scaleWidth)) * 100;
					topPercentage = (position.y / ((mouseMap.clientWidth * this.scaleWidth) * __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].originalDimensions.imageRatioHeight)) * 100;
				} else {
					topPercentage = (position.y / (mouseMap.clientHeight * this.scaleHeight)) * 100;
					leftPercentage = (position.x / (((mouseMap.clientHeight * this.scaleHeight) * __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].originalDimensions.imageRatioWidth) * this.scaleWidth)) * 100;
				}
			} else {
				// image not centered
				leftPercentage = (position.x / mouseMap.clientWidth) * 100;
				topPercentage = (position.y / mouseMap.clientHeight) * 100;
			}

			// set max and min values
			topPercentage = topPercentage < 0
				? 0
				: topPercentage;
			topPercentage = topPercentage > 100
				? 100
				: topPercentage;
			leftPercentage = leftPercentage < 0
				? 0
				: leftPercentage;
			leftPercentage = leftPercentage > 100
				? 100
				: leftPercentage;

			this.mouseMapWrap.style.backgroundPosition = leftPercentage + "% " + topPercentage + "%";
		}
	},
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(17)(module)))

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addThumbnail", function() { return addThumbnail; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__center_scroll_to__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__);



var thumbnails = [];
var thumbnailCount = 0;
var thumbnailsTrigger = null;
var thumbnailsNav = null;
var thumbnailsWrap = null;
var initSetup = false;
var fullscreenWrapper = document.querySelector('.fullscreen-wrapper');

function init(parentElement) {
	if (initSetup === false) {
		initSetup = true;
		var pageHeader = document.querySelector('.main .page-header h1').outerHTML;
		// add thumbnails div
		var thumbnailsNavHtml = "\n\t\t<div id=\"thumbnails-nav\" class=\"hide\">\n\t\t\t" + pageHeader + "\n\t\t\t<div class=\"thumbnails-wrap\"></div>\n\t\t</div>\n\t";
		parentElement.insertAdjacentHTML('afterbegin', thumbnailsNavHtml);
		thumbnailsNav = document.getElementById('thumbnails-nav');
		thumbnailsWrap = thumbnailsNav.querySelector('.thumbnails-wrap');


		// add trigger divs
		var thumbnailTriggerHtml = "\n\t\t\t<div id=\"thumbnail-trigger\">\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t</div>\n\t\t";

		document.querySelector('.fullscreen-wrapper').insertAdjacentHTML('afterbegin', thumbnailTriggerHtml);
		thumbnailsTrigger = document.getElementById('thumbnail-trigger');

		thumbnailsTrigger.addEventListener('click', function () {
			if(fullscreenWrapper.classList.contains('showing-thumbnails')){
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(thumbnailsNav);
			}else{
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(thumbnailsNav);
			}
			Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(thumbnailsNav);
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
		var thumbnailHtml = "\n\t\t\t<div class=\"thumbnail-wrap\" id=\"thumbnail-" + thumbnailCount + "\"><img class=\"thumbnail\" src=\"" + imgSrc + "\" /></div>\n\t\t";
		thumbnailsWrap.insertAdjacentHTML('beforeend', thumbnailHtml);

		document.getElementById(("thumbnail-" + thumbnailCount)).addEventListener('click', function () {
			thumbnailsNav.classList.add('hide');
			fullscreenWrapper.classList.remove('showing-thumbnails');

			// timeout time set to same amount of thumbnails-nav transition-duration
			window.setTimeout(function () {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(thumbnailsNav);
				Object(__WEBPACK_IMPORTED_MODULE_0__center_scroll_to__["scrollToElement"])(associatedDomElement);
			}, 100);
		});

		thumbnailCount++;
		thumbnails.push(associatedDomElement);
	}

}



/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(14);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(1);
__webpack_require__(4);
__webpack_require__(19);
module.exports = __webpack_require__(30);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reframe_js__ = __webpack_require__(15);



// add youtube api script to the page
var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'http://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


/* eslint-disable */
var players = {};

window.onYouTubeIframeAPIReady = function () {

	// get all iframes where source contains youtube
	var iframes = Array.prototype.slice.call(document.querySelectorAll('.video iframe[src*="youtube"]'));
	iframes.map(function(iframe){
		var iframeWrap = iframe.closest('.iframe-wrap');
		var uniqueId = iframe.getAttribute('id');
		var button = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getSiblingByClass(iframeWrap, 'play-button');
		players[uniqueId] = new YT.Player(uniqueId, {});

		button.addEventListener('click', function(){
			players[uniqueId].playVideo();
		});

		Object(__WEBPACK_IMPORTED_MODULE_1_reframe_js__["a" /* default */])(button.parentNode.querySelector("iframe"));
	});
};
/* eslint-enable */

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function reframe(target, cName) {
  var frames = typeof target === 'string' ? document.querySelectorAll(target) : target;
  var c = cName || 'js-reframe';
  if (!('length' in frames)) frames = [frames];
  for (var i = 0; i < frames.length; i += 1) {
    var frame = frames[i];
    var hasClass = frame.className.split(' ').indexOf(c) !== -1;
    if (hasClass) return;
    var hAttr = frame.getAttribute('height');
    var wAttr = frame.getAttribute('width');
    if (wAttr.indexOf('%') > -1 || frame.style.width.indexOf('%') > -1) return;
    var h = hAttr ? hAttr : frame.offsetHeight;
    var w = wAttr ? wAttr : frame.offsetWidth;
    var padding = h / w * 100;
    var div = document.createElement('div');
    div.className = c;
    var divStyles = div.style;
    divStyles.position = 'relative';
    divStyles.width = '100%';
    divStyles.paddingTop = padding + '%';
    var frameStyle = frame.style;
    frameStyle.position = 'absolute';
    frameStyle.width = '100%';
    frameStyle.height = '100%';
    frameStyle.left = '0';
    frameStyle.top = '0';
    frame.parentNode.insertBefore(div, frame);
    frame.parentNode.removeChild(frame);
    div.appendChild(frame);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (reframe);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *  howler.js v2.0.12
 *  howlerjs.com
 *
 *  (c) 2013-2018, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto iOS enabler.
      self.mobileAutoEnable = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'running' : 'running';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Mobile browsers will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableMobileAudio: function() {
      var self = this || Howler;

      // Only run this on mobile devices if audio isn't already eanbled.
      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
      var isTouch = !!(('ontouchend' in window) || (self._navigator && self._navigator.maxTouchPoints > 0) || (self._navigator && self._navigator.msMaxTouchPoints > 0));
      if (self._mobileEnabled || !self.ctx || (!isMobile && !isTouch)) {
        return;
      }

      self._mobileEnabled = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function() {
        // Fix Android can not play in suspend state.
        Howler._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._mobileEnabled = true;
          self.mobileAutoEnable = false;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        self.ctx.suspend().then(function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhrWithCredentials = o.xhrWithCredentials || false;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.mobileAutoEnable) {
        Howler._enableMobileAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        var num = 0;
        for (var i=0; i<self._sounds.length; i++) {
          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
            num++;
            id = self._sounds[i]._id;
          }
        }

        if (num === 1) {
          sprite = null;
        } else {
          id = null;
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Makr this sounded as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);

      // Update the parameters of the sound
      sound._paused = false;
      sound._ended = false;
      sound._sprite = sprite;
      sound._seek = seek;
      sound._start = self._sprite[sprite][0] / 1000;
      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        if (Howler.state === 'running') {
          playWebAudio();
        } else {
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Mobile browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (typeof Promise !== 'undefined' && play instanceof Promise) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Releases the lock and executes queued actions.
              var runLoadQueue = function() {
                self._playLock = false;
                if (!internal) {
                  self._emit('play', sound._id);
                }
              };
              play.then(runLoadQueue, runLoadQueue);
            } else if (!internal) {
              self._emit('play', sound._id);
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          var listener = function() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Make sure the volume is in the right bounds.
        vol = Math.max(0, vol);
        vol = Math.min(1, vol);

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            sound._rateSeek = self.seek(id[i]);
            sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Restart the playback if the sound was playing.
          if (playing) {
            self.play(id, true);
          }

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node) {
            sound._node.currentTime = seek;
          }

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                self._emit('seek', id);
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            self._emit('seek', id);
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
          if (!checkIE) {
            sounds[i]._node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          }

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);

        // Remove the references in the global Howler object.
        var index = Howler._howls.indexOf(self);
        if (index >= 0) {
          Howler._howls.splice(index, 1);
        }
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;

      if (Howler._scratchBuffer) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
      }
      node.bufferSource = null;

      return self;
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else {
        self._node = new Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = self._xhrWithCredentials;
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Decode the buffer into an audio source.
    Howler.ctx.decodeAudioData(arraybuffer, function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      }
    }, function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    });
  };

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : 1, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  // Add support for CommonJS libraries such as browserify.
  if (true) {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.0.12
 *  howlerjs.com
 *
 *  (c) 2013-2018, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
            sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
            sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* smoothscroll v0.4.0 - 2018 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {
  'use strict';

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;

      do {
        el = el.parentNode;

        isBody = el === d.body;
      } while (isBody === false && isScrollable(el) === false);

      isBody = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (true) {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }

}());


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_Router__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes_common__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routes_home__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_about__ = __webpack_require__(29);
// import external dependencies
// import 'jquery';

// Import everything from autoload


// import local dependencies





/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_0__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_1__routes_common__["a" /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_2__routes_home__["a" /* default */],
  // About Us page, note the change from about-us to aboutUs.
  aboutUs: __WEBPACK_IMPORTED_MODULE_3__routes_about__["a" /* default */],
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(21);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__more_info__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__st_audio__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__zoomy__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nakasentro__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__artwork_info__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mu_plugins_menu_vertical_push_menu_vertical_push__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vanilla_back_to_top__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vanilla_back_to_top___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_vanilla_back_to_top__);








/* harmony default export */ __webpack_exports__["a"] = ({
	init: function init() {
		// JavaScript to be fired on all pages

		window.onload = function () {
			// init menu-vertical-push
			__WEBPACK_IMPORTED_MODULE_5__mu_plugins_menu_vertical_push_menu_vertical_push__["a" /* init */]();
			Object(__WEBPACK_IMPORTED_MODULE_6_vanilla_back_to_top__["addBackToTop"])({zIndex: 2});

			// Detects if device is on iOS
			var isIos = function () {
				var userAgent = window.navigator.userAgent.toLowerCase();
				return /iphone|ipad|ipod/.test( userAgent );
			};
// Detects if device is in standalone mode
			var isInStandaloneMode = function () { return ('standalone' in window.navigator) && (window.navigator.standalone); };

// Checks if should display install popup notification:
			if (isIos() && !isInStandaloneMode()) {
				this.setState({ showInstallMessage: true });
			}
		};

		var playVideo = function () {
			this.closest('.video').classList.add('playing');

		};

		var playButtons = document.querySelectorAll(".video .play-button");
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
			__WEBPACK_IMPORTED_MODULE_0__more_info__["moreInfo"].init();
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
				__WEBPACK_IMPORTED_MODULE_1__st_audio__["stAudio"].init();

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
						__WEBPACK_IMPORTED_MODULE_2__zoomy__["zoomy"].init();
					}
				}

				function initArtwork() {
					// spin up artwork animation
					__WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].init();
					__WEBPACK_IMPORTED_MODULE_4__artwork_info__["artworkInfo"].init();
					__WEBPACK_IMPORTED_MODULE_0__more_info__["moreInfo"].init();
				}
			},
			onLeave: function () {
				__WEBPACK_IMPORTED_MODULE_1__st_audio__["stAudio"].stopAllPlayers();
			},
		});
		CommonView.init();

		/* eslint-disable */
		Barba.Pjax.start({
			/* eslint-enable */
			showFullscreenModal: true,
		});

	},
	finalize: function finalize() {
		// JavaScript to be fired on all pages, after page specific JS is fired
	},
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = init;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hamburgers__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hamburgers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_hamburgers__);


var menuWrap = document.querySelector('header.banner');
var hamburger = null;
var menuWrapHeight = null;

function init() {
	menuWrap.classList.add('menu-vertical-push');
	menuWrapHeight = outerHeight(menuWrap);
	menuWrap.style.marginTop = -menuWrapHeight + 'px';
	var menuLinks = menuWrap.querySelectorAll('a');
	menuLinks.forEach(function(link){
		link.addEventListener('click', menuLinkClick);
	});
	var hamburgerHtml = getHamburgerHtml();
	menuWrap.insertBefore(hamburgerHtml, menuWrap.firstChild);
	hamburger = document.querySelector('header.banner .hamburger');
	window.setTimeout(function () {
		menuWrap.classList.add();
	}, 100);


	hamburger.addEventListener('click', function () {
		toggleMenu();
		this.classList.toggle('is-active');
	}, false);
}

var menuLinkClick = function () {
	toggleMenu();
	hamburger.classList.remove('is-active');
};

var getHamburgerHtml = function () {
	var hamburgerHtmlString = "\n\t\t<button class=\"hamburger hamburger--collapse\" type=\"button\">\n\t\t  <span class=\"hamburger-box\">\n\t\t    <span class=\"hamburger-inner\"></span>\n\t\t  </span>\n\t\t</button>  \n\t";

	var div = document.createElement('div');
	div.innerHTML = hamburgerHtmlString;
	return div.firstElementChild;
};

var toggleMenu = function () {
	outerHeight(menuWrap);
	if (menuWrap.classList.contains('open')) {
		menuWrap.classList.remove('open');
	} else {
		menuWrap.classList.add('open');
	}
};

var outerHeight = function (el) {
		var height = el.offsetHeight;
		var style = getComputedStyle(el);
		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__(25);

module.exports = {
  includePaths: [
    path.join(__dirname, "_sass/hamburgers")
  ]
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)))

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports);
  } else {
    factory(root.commonJsStrict = {});
  }
})(typeof self !== 'undefined' ? self : this, function (exports) {
  exports.addBackToTop = addBackToTop; // FUNCTION START

  'use strict';

  function addBackToTop() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _params$id = params.id,
        id = _params$id === void 0 ? 'back-to-top' : _params$id,
        _params$showWhenScrol = params.showWhenScrollTopIs,
        showWhenScrollTopIs = _params$showWhenScrol === void 0 ? 1 : _params$showWhenScrol,
        _params$onClickScroll = params.onClickScrollTo,
        onClickScrollTo = _params$onClickScroll === void 0 ? 0 : _params$onClickScroll,
        _params$scrollDuratio = params.scrollDuration,
        scrollDuration = _params$scrollDuratio === void 0 ? 100 : _params$scrollDuratio,
        _params$innerHTML = params.innerHTML,
        innerHTML = _params$innerHTML === void 0 ? '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>' : _params$innerHTML,
        _params$diameter = params.diameter,
        diameter = _params$diameter === void 0 ? 56 : _params$diameter,
        _params$size = params.size,
        size = _params$size === void 0 ? diameter : _params$size,
        _params$cornerOffset = params.cornerOffset,
        cornerOffset = _params$cornerOffset === void 0 ? 20 : _params$cornerOffset,
        _params$backgroundCol = params.backgroundColor,
        backgroundColor = _params$backgroundCol === void 0 ? '#000' : _params$backgroundCol,
        _params$textColor = params.textColor,
        textColor = _params$textColor === void 0 ? '#fff' : _params$textColor,
        _params$zIndex = params.zIndex,
        zIndex = _params$zIndex === void 0 ? 1 : _params$zIndex;
    appendStyles();
    var upEl = appendElement();
    var hidden = true;
    window.addEventListener('scroll', adapt);
    adapt();

    function adapt() {
      getScrollTop() >= showWhenScrollTopIs ? show() : hide();
    }

    function show() {
      if (!hidden) {
        return;
      }

      upEl.className = '';
      hidden = false;
    }

    function hide() {
      if (hidden) {
        return;
      }

      upEl.className = 'hidden';
      hidden = true;
    }

    function appendElement() {
      var upEl = document.createElement('div');
      upEl.id = id;
      upEl.className = 'hidden';
      upEl.innerHTML = innerHTML;
      upEl.addEventListener('click', function (event) {
        event.preventDefault();
        scrollUp();
      });
      document.body.appendChild(upEl);
      return upEl;
    }

    function appendStyles() {
      var svgSize = Math.round(0.43 * size);
      var svgTop = Math.round(0.29 * size);
      var styles = '#' + id + '{background:' + backgroundColor + ';-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;bottom:' + cornerOffset + 'px;-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.26);-moz-box-shadow:0 2px 5px 0 rgba(0,0,0,.26);box-shadow:0 2px 5px 0 rgba(0,0,0,.26);color:' + textColor + ';cursor:pointer;display:block;height:' + size + 'px;opacity:1;outline:0;position:fixed;right:' + cornerOffset + 'px;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-transition:bottom .2s,opacity .2s;-o-transition:bottom .2s,opacity .2s;-moz-transition:bottom .2s,opacity .2s;transition:bottom .2s,opacity .2s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:' + size + 'px;z-index:' + zIndex + '}#' + id + ' svg{display:block;fill:currentColor;height:' + svgSize + 'px;margin:' + svgTop + 'px auto 0;width:' + svgSize + 'px}#' + id + '.hidden{bottom:-' + size + 'px;opacity:0}';
      var styleEl = document.createElement('style');
      styleEl.appendChild(document.createTextNode(styles));
      document.head.insertAdjacentElement('afterbegin', styleEl);
    }

    function scrollUp() {
      var _window = window,
          performance = _window.performance,
          requestAnimationFrame = _window.requestAnimationFrame;

      if (scrollDuration <= 0 || typeof performance === 'undefined' || typeof requestAnimationFrame === 'undefined') {
        return setScrollTop(onClickScrollTo);
      }

      var start = performance.now();
      var initScrollTop = getScrollTop();
      var pxsToScrollBy = initScrollTop - onClickScrollTo;
      requestAnimationFrame(step);

      function step(timestamp) {
        var delta = timestamp - start;
        var progress = Math.min(delta / scrollDuration, 1);
        setScrollTop(initScrollTop - Math.round(progress * pxsToScrollBy));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
    }

    function getScrollTop() {
      return document.body.scrollTop || document.documentElement && document.documentElement.scrollTop || 0;
    }

    function setScrollTop(value) {
      document.body.scrollTop = value;

      if (document.documentElement) {
        document.documentElement.scrollTop = value;
      }
    }
  } // FUNCTION END

});

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the home page
  },
  finalize: function finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
});


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the about us page
  },
});


/***/ }),
/* 30 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map