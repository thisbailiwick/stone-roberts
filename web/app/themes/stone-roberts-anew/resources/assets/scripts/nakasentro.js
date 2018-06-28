import utilities from './utilities';
import _ from 'underscore';
import {init as centerScrollToInit} from './center-scroll-to';
import { addThumbnail } from './thumbnail-nav';

export let nakasentro = {
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

		this.isTouchDevice = utilities.isTouchDevice();

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

		this.setBodyClasses("orientation-" + utilities.browserOrientation);
		nakasentro.artworks_elements.forEach(function (artwork, index) {
			let artworkElements = this.getArtworkElements(artwork, index);
			if (isInit === false) {
				this.resetImageValues(artworkElements);
			}
			utilities.setViewportDimensions();
			let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkElements.artworkWrap);

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

			addThumbnail(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// add to thumbnails
	},
	mobileResize: _.debounce(function () {
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
		let artworkWrap = artwork;
		artworkWrap.setAttribute('artworks-index', index);
		let artworkUniqueId = artwork.getAttribute('id');
		let artworkImageWrap = artwork.querySelector(".image-wrap");
		let centerImageWrap = artworkImageWrap.querySelector('.center-image-wrap');
		let artworkImage = artworkImageWrap.querySelector(".main-img");
		let zoomyWrap = artworkImageWrap.querySelector(".zoomy-wrap");
		let imageSpacePlaceholder = artworkImageWrap.querySelector('.image-space-placeholder');
		let imageRatioHolder = artworkImageWrap.querySelector('.image-ratio-holder');
		let mouseMapImage = artworkImageWrap.querySelector(".mouse-map");
		let artworkMetaWrap = artworkImageWrap.querySelector(".artwork-meta");
		let imgSrc = artworkImage.getAttribute('src');
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
		let imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkImage);
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

		this.setBodyClasses("orientation-" + utilities.browserOrientation);

		nakasentro.artworks_elements.forEach(function (artwork, index) {
			// let zoomWrap = artwork.querySelector('.zoom-wrap');
			let artworkElements = this.getArtworkElements(artwork, index);

			let styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';

			if (isInit === false) {
				this.resetImageValues(artworkElements);
				utilities.removeCssFromPage([styleBlockId]);
			}


			// document.body.classLifst.remove('artworks-processed');

			// we need to compare the ratio of the viewport to the ratio of the image.
			// debugger;
			// console.log(artworkElements.artworkImage.clientWidth, artworkElements.artworkImage.clientHeight);

			// temporarily set maxHeight for processing
			artworkElements.artworkImage.style.maxHeight = '100vh';

			artworkElements.artworkImage.style.minHeight = artworkElements.artworkImage.clientHeight + "px";
			artworkElements.artworkImage.style.minWidth = artworkElements.artworkImage.clientWidth + "px";

			let imageVhValue = artworkElements.artworkImage.clientHeight / utilities.windowHeight * 100;
			let imageVwValue = artworkElements.artworkImage.clientWidth / utilities.windowWidth * 100;
			if (imageVhValue === 0) {
				// debugger;
				// console.log("———————————image values are zero on init!!!!");
			}
			let imageVhValueToFull = 100 - imageVhValue;

			// let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkWrap);
			let imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkElements.artworkImage);
			artworkElements.artworkWrap.classList.remove('width', 'height');
			artworkElements.artworkWrap.classList.add(imageSizeChangeTechnique);


			let imageRatioWidth = artworkElements.artworkImage.clientWidth / artworkElements.artworkImage.clientHeight;
			let imageRatioHeight = artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth;

			if (artworkElements.artworkImage.clientHeight >= utilities.windowHeight) {
				artworkElements.imageRatioHolder.style.height = artworkElements.artworkImage.clientHeight + "px";
				artworkElements.imageRatioHolder.style.width = artworkElements.artworkImage.clientWidth + "px";
			} else {
				artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
			}


			let imageViewportWidthRatio = utilities.windowWidth / artworkElements.artworkImage.clientWidth;
			let imageViewportHeightRatio = utilities.windowHeight / artworkElements.artworkImage.clientHeight;

			artworkElements.mouseMapImage.setAttribute('scaleWidth', imageViewportWidthRatio);
			artworkElements.mouseMapImage.setAttribute('scaleHeight', imageViewportHeightRatio);


			let imageMaxHeight = null;
			// get image max height
			if (imageSizeChangeTechnique === "width") {
				// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
				imageMaxHeight = utilities.windowHeight * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			} else {
				// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
				imageMaxHeight = utilities.windowHeight;
			}

			// get image max height
			// if (imageSizeChangeTechnique === "height") {
			// 	// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
			// 	const imageMaxWidth = utilities.windowWidth * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			// } else {
			// 	// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
			// 	const imageMaxWidth = utilities.windowWidth;
			// }
			let imageOffsetFromDocTop = utilities.getElementOffsetFromDoc(artworkElements.artworkImage).top;
			let imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

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

			let styleBlock = document.getElementById(styleBlockId);
			if (styleBlock !== null) {
				styleBlock.remove();
			}
			// console.log(artworkElements.artworkUniqueId, imageViewportHeightRatio, imageViewportWidthRatio);
			// let artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			// create styles for .main-img and .mouse-map width and height

			let artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .mouse-map-wrap {width: ' + artworkElements.artworkImage.clientWidth + 'px; height: ' + artworkElements.artworkImage.clientHeight + 'px;}';


			const mouseMapWidth = artworkElements.artworkImage.clientWidth - nakasentro.mouse_map_less_pixels;
			const mouseMapHeight = artworkElements.artworkImage.clientHeight - nakasentro.mouse_map_less_pixels;

			artworkStyles += '#' + artworkElements.artworkUniqueId + ' .mouse-map {width: ' + mouseMapWidth + 'px; height: ' + mouseMapHeight + 'px;}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is height
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .mouse-map-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is width
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .mouse-map-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';


			// remove temporary max height for image after processing
			artworkElements.artworkImage.style.maxHeight = 'none';


			artworkElements.artworkImage.style.position = 'static';
			artworkElements.centerImageWrap.style.height = 0;

			utilities.addCssToPage(artworkStyles, styleBlockId);

			// add to thumbnails
			addThumbnail(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// init button scroll to script
		centerScrollToInit();

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

	debounceWindowResize: _.debounce(function () {
		let currentViewportDimenstions = utilities.getViewportDimensions();
		if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			utilities.setViewportDimensions();
			nakasentro.setupValues();
		}
		document.body.classList.remove("viewport-resizing");
		nakasentro.isResizing = false;
	}, 250),

	windowResize: function () {
		let currentViewportDimenstions = utilities.getViewportDimensions();
		if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			utilities.setViewportDimensions();
			nakasentro.setupValues();
		}
	},

	setBodyClasses: function (classes) {
		document.querySelector("body").classList.add(classes);
	},

	getPixelsToCenter: function (distanceFromTopOfViewport) {
		let viewport_center = utilities.windowHalfHeight;
		return viewport_center - distanceFromTopOfViewport;
	},

	getPercentageToCenter: function (toCenterPixels) {
		return (toCenterPixels / utilities.windowHeight * 100) * 1.39;
	},

	getVhToCenter: function (toCenterPixels) {
		return toCenterPixels / utilities.windowHeight * 100;
	},

	getToCenterPixels: function (artwork) {
		const rect = artwork.imageSpacePlaceholder.getBoundingClientRect();
		const distanceFromTopOfViewport = rect.top + rect.height / 2;
		const toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);
		return toCenterPixels;
	},

	setArtworkToCenterPixels: function (artwork) {
		let toCenterPixels = this.getToCenterPixels(artwork);
		nakasentro.artworks[artwork.artworksIndex].toCenterPixels = toCenterPixels;
		return toCenterPixels;
	},

	possiblyCenterUncenterImage: function (artwork) {
		let toCenterPixels = this.setArtworkToCenterPixels(artwork);

		// TODO: this is about 51 pixels off, why?!
		let toCenterPixelsAbsolute = Math.abs(toCenterPixels);

		let toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);

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
		let newWidthLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVwValue);
		this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentWidth = newWidthLength;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newWidthLength;
		// console.log('newWidthLength: ' + newWidthLength);
		this.resizePortrait(artwork, newWidthLength);
	},
	setNewHeightValues: function (toCenterPercentage, artwork) {
		let newLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVhValue);
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
		let toCenterPercentagePassed = 100 - toCenterPercentage;
		// console.log('toCenterPercentagePassed: ' + toCenterPercentagePassed);
		let t = toCenterPercentagePassed;
		let b = originalDimensionValue;
		let c = 100 - originalDimensionValue;
		let d = 100;
		// console.log(t, b, c, d);
		let newLength = c * t / d + b;
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
			let width = imageNewWidth + "vw";
			let imageWidth = artwork.artworkImage.clientWidth;
			let imageHeight = artwork.artworkImage.clientHeight + "px";
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
			let height = imageNewHeight + "vh";
			let imageWidth = artwork.artworkImage.clientWidth + "px";
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
			if (utilities.isElementInViewport(artwork.artworkImage)) {
				artwork.isInViewport = true;
				nakasentro.possiblyCenterUncenterImage(artwork);
			} else {
				artwork.isInViewport = false;
				this.setArtworkToCenterPixels(artwork);
			}
		}, this);
	},
};

