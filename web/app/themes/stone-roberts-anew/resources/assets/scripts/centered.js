import utilities from './utilities';
import _ from 'underscore';

export let nakasentro = {
	fullscreen: document.querySelector(".fullscreen"),
	fullscreenWrapper: document.querySelector('.fullscreen-wrapper'),
	artworks_elements: document.querySelectorAll(".artwork_piece"),
	artworks: Array(),
	mainContentWidth: null,
	mainContentWrap: document.querySelector(".content>.main"),
	imageCentered: false,
	scrollBeingThrottled: false,
	isTouchDevice: false,
	// helps us not process items in the midst of resizing
	isResizing: false,
	consideredCenteredPercentage: 10,
	recentlyAddedCenteredClasses: false,
	recentlyRemovedCenteredClasses: false,
	fixedImageScrollReleaseCount: 0,

	init: function () {
		//reset values
		this.reset();

		this.isTouchDevice = utilities.isTouchDevice();
		if (this.isTouchDevice === false) {

			// setup values
			this.setupValues(true);

			// nakasentro.checkArtworks(true);
			// for when not in fullscreen
			window.addEventListener(
				"scroll",
				function () {
					if (!this.isResizing) {
						nakasentro.checkArtworks();
					}
				}.bind(this)
			);
			window.addEventListener(
				"scroll",
				// _.debounce(function () {
				function () {
					if (!nakasentro.isResizing) {
						nakasentro.checkArtworks();
					}
				}
				// }, 0)
			);

			// for when in fullscreen
			nakasentro.fullscreen.addEventListener("scroll", function () {
				if (!this.isResizing) {
					nakasentro.checkArtworks();
				}
				// console.log('scrolling');=
			});

			// add event to handle any code needed when there is a fullscreen change event
			window.addEventListener('fullscreenchange', this.fullScreenOnChangeEvent.bind(this), false);
		} else {
			this.mobileSetup(true);
		}

	},
	mobileSetup: function (isInit) {
		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses("orientation-" + utilities.browserOrientation);
		nakasentro.artworks_elements.forEach(function (artwork, index) {
			var artworkElements = this.getArtworkElements(artwork, index);
			if (isInit === false) {
				this.resetImageValues(artwork);
			}

			var imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkElements.artworkWrap);

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
			});
		}, this);
	},
	fullScreenOnChangeEvent: function () {
		// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements
		/* eslint-disable */
		if (Barba.FullScreen.isFullScreen === false) {
			/* eslint-enable */
			nakasentro.removeFullscreenCenteredImageScrollEvents.call(this);
		}
	},
	removeFullscreenCenteredImageScrollEvents: function () {
		window.removeEventListener('keydown', this.keydownEvent);
		this.zoomyWrap.removeEventListener('wheel', this.wheelEvent);
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
		this.scrollBeingThrottled = false;
		document.body.classList.remove("orientation-portrait", "orientation-landscape", "artworks-processed", "centered-image");
		document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
			this.removeArtworkPieceCentered(artworkPiece);
		}, this);
	},

	removeArtworkPieceCentered: function (artworkPiece) {
		artworkPiece.classList.remove('centered'/*, 'centered-image-transition-duration'*/);
		nakasentro.imageCentered = false;
	},
	removeBodyImageCenteredClasses: function () {
		document.body.classList.remove("centered-image");
		window.setTimeout(function (artwork) {
			// here we delay removing a class to allow some css transitions to happen
			artwork.classList.remove("centered-image-transition-duration");
		}, 400, this);
	},
	// setViewportDimensions: function() {
	//   var viewportDimensions = this.getViewportDimensions();
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
		};
	},
	setArtworkSizeChangeTechnique: function (artworkImage, artworkWrap) {
		var imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkImage);
		artworkWrap.classList.remove('width', 'height');
		artworkWrap.classList.add(imageSizeChangeTechnique);
		return imageSizeChangeTechnique;
	},
	setupValues: function (isInit) {
		isInit = typeof isInit === "boolean"
			? isInit
			: false;
		this.reset();

		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses("orientation-" + utilities.browserOrientation);

		nakasentro.artworks_elements.forEach(function (artwork, index) {
			// var zoomWrap = artwork.querySelector('.zoom-wrap');
			var artworkElements = this.getArtworkElements(artwork, index);

			if (isInit === false) {
				this.resetImageValues(artwork);
			}
			// document.body.classLifst.remove('artworks-processed');

			// we need to compare the ratio of the viewport to the ratio of the image.
			// debugger;
			// console.log(artworkElements.artworkImage.clientWidth, artworkElements.artworkImage.clientHeight);
			artworkElements.artworkImage.style.minHeight = artworkElements.artworkImage.clientHeight + "px";
			artworkElements.artworkImage.style.minWidth = artworkElements.artworkImage.clientWidth + "px";
			var imageVhValue = artworkElements.artworkImage.clientHeight / utilities.windowHeight * 100;
			var imageVwValue = artworkElements.artworkImage.clientWidth / utilities.windowWidth * 100;
			if (imageVhValue === 0) {
				// debugger;
				// console.log("———————————image values are zero on init!!!!");
			}
			var imageVhValueToFull = 100 - imageVhValue;

			// var imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkWrap);
			var imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkElements.artworkImage);
			artworkElements.artworkWrap.classList.remove('width', 'height');
			artworkElements.artworkWrap.classList.add(imageSizeChangeTechnique);


			var imageRatioWidth = artworkElements.artworkImage.clientWidth / artworkElements.artworkImage.clientHeight;
			var imageRatioHeight = artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth;

			if (artworkElements.artworkImage.clientHeight >= utilities.windowHeight) {
				artworkElements.imageRatioHolder.style.height = artworkElements.artworkImage.clientHeight + "px";
				artworkElements.imageRatioHolder.style.width = artworkElements.artworkImage.clientWidth + "px";
			} else {
				artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
			}


			var imageViewportWidthRatio = utilities.windowWidth / artworkElements.artworkImage.clientWidth;
			var imageViewportHeightRatio = utilities.windowHeight / artworkElements.artworkImage.clientHeight;

			artworkElements.mouseMapImage.setAttribute('scaleWidth', imageViewportWidthRatio);
			artworkElements.mouseMapImage.setAttribute('scaleHeight', imageViewportHeightRatio);


			var imageMaxHeight = null;
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
			var imageOffsetFromDocTop = utilities.getElementOffsetFromDoc(artworkElements.artworkImage).top;
			var imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

			nakasentro.artworks.push({
				artworksIndex: nakasentro.artworks.length,
				element: artwork,
				artworkImage: artworkElements.artworkImage,
				imageSizeChangeTechnique: imageSizeChangeTechnique,
				imageOffsetFromDocTop: imageOffsetFromDocTop,
				imageMaxHeight: imageMaxHeight,
				imageMaxHeightCenterPointFromDocTop: imageMaxHeightCenterPointFromDocTop,
				artworkWrap: artworkElements.artworkWrap,
				artworkImageWrap: artworkElements.artworkImageWrap,
				centerImageWrap: artworkElements.centerImageWrap,
				artworkMetaWrap: artworkElements.artworkMetaWrap,
				zoomyWrap: artworkElements.zoomyWrap,
				imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
				artworkUniqueId: artworkElements.artworkUniqueId,
				imageCentered: false,
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

			// var artworkStyles = '';
			// if (utilities.browserOrientation === 'portrait') {
			// 	artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .zoomy-wrap, #' + artworkElements.artworkUniqueId + ' .image-space-placeholder, #' + artworkElements.artworkUniqueId + ' .image-center-wrap {width: ' + artworkImage.clientWidth + 'px; height: ' + artworkImage.clientHeight + 'px; }';

			// var artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';
			var styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';
			var styleBlock = document.getElementById(styleBlockId);
			if (styleBlock !== null) {
				styleBlock.remove();
			}
			// console.log(artworkElements.artworkUniqueId, imageViewportHeightRatio, imageViewportWidthRatio);
			// var artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			var artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .mouse-map {width: ' + artworkElements.artworkImage.clientWidth + 'px; height: ' + artworkElements.artworkImage.clientHeight + 'px;}';
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .mouse-map {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .mouse-map {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .mouse-map {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';


			artworkElements.artworkImage.style.position = 'static';
			artworkElements.centerImageWrap.style.height = 0;
			// artworkElements.imageRatioHolder.style.paddingleft = imageRatioWidth / 100 + '%';

			// take mousemap backgrond size and scale it down by the ratio of the imageviewportratio
			// var mousemapImageCenteredHeight = artworkElements.mouseMapImage.
			// }else{
			// 	artworkStyles = '#' + artworkUniqueId + ' .main-img, #' + artworkUniqueId + ' .zoomy-wrap {width: ' + artworkElements.artworkImage.clientWidth + 'px;height: ' + artworkElements.artworkImage.clientHeight + 'px;}';
			// }
			utilities.addCssToPage(artworkStyles, styleBlockId);
		}, this);

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
		var currentViewportDimenstions = utilities.getViewportDimensions();
		// console.log(utilities.windowHeight, currentViewportDimenstions.height, utilities.windowWidth, currentViewportDimenstions.width);
		if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			utilities.setViewportDimensions();
			nakasentro.setupValues(true);
		}
		document.body.classList.remove("viewport-resizing");
		nakasentro.isResizing = false;
	}, 250),

	windowResize: function () {
		var currentViewportDimenstions = utilities.getViewportDimensions();
		if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			utilities.setViewportDimensions();
			nakasentro.setupValues(true);
		}
	},

	setBodyClasses: function (classes) {
		document.querySelector("body").classList.add(classes);
	},

	getPixelsToCenter: function (distanceFromTopOfViewport) {
		var viewport_center = utilities.windowHalfHeight;
		return viewport_center - distanceFromTopOfViewport;
	},

	getPercentageToCenter: function (toCenterPixels) {
		return (toCenterPixels / utilities.windowHeight * 100) * 1.39;
	},

	getVhToCenter: function (toCenterPixels) {
		return toCenterPixels / utilities.windowHeight * 100;
	},

	possiblyCenterUncenterImage: function (artwork) {
		var rect = artwork.imageSpacePlaceholder.getBoundingClientRect();
		var distanceFromTopOfViewport = rect.top + rect.height / 2;
		var toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);

		// TODO: this is about 51 pixels off, why?!
		var toCenterPixelsAbsolute = Math.abs(toCenterPixels);

		var toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);

		// if we're close to the centerpoint of an image, we trigger a scroll to
		if (toCenterPercentage < nakasentro.consideredCenteredPercentage) {
			// image is centered
			// console.log('turning on');
			if (this.imageCentered === false && artwork.fullscreenImageCentered === false/* && this.recentlyAddedCenteredClasses === false*/) {
				// if in fullscreen we want to add these events to handle scroll when centered and scroll events is not triggered due to fixed elements

				/* eslint-disable */
				if (Barba.FullScreen.isFullscreen === true) {
					/* eslint-enable */
					artwork.fullscreenImageCentered = true;
				}
				window.addEventListener('keydown', artwork.keydownEvent);
				artwork.zoomyWrap.addEventListener('wheel', artwork.wheelEvent);
				// this.recentlyAddedCenteredClasses = true;
				// window.setTimeout(function () {
				// 	nakasentro.recentlyAddedCenteredClasses = false;
				// }, 250);
				document.body.classList.add("centered-image");
				// console.log('setting centered classes');

				// overarching imageCentered toggle
				this.imageCentered = true;

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

		} else if (artwork.imageCentered === true) {
			// console.log(artwork);
			if (toCenterPercentage > nakasentro.consideredCenteredPercentage) {
				// console.log('turning off');

				// image is not centered
				artwork.fullscreenImageCentered = false;

				if (this.imageCentered === true /*&& this.recentlyRemovedCenteredClasses === false*/) {

					// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements

					// overarching imageCentered toggle
					this.imageCentered = false;

					// speicific artwork iamgeCentered toggle
					artwork.imageCentered = false;
					document.body.classList.remove("centered-image");
					artwork.artworkWrap.classList.remove("centered");
					this.resetImageValues(artwork);

					window.setTimeout(function () {
						// here we delay removing a class to allow some css transitions to happen
						artwork.artworkWrap.classList.remove("centered-image-transition-duration");
					}, 400);
				}
			}
		}
	},

	handlePossibleScrollTrigger: function () {
		nakasentro.removeBodyImageCenteredClasses.call(this.artworkWrap);
		nakasentro.removeArtworkPieceCentered(this.artworkWrap);
		this.imageCentered = false;
		nakasentro.removeFullscreenCenteredImageScrollEvents.call(this);
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
		// var lengthValue = this.browserOrientation === "portrait" ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
		// lengthValue = lengthValue * .45;

		// var w = window,
		//   doc = document,
		//   e = doc.documentElement,
		//   g = doc.getElementsByTagName("body")[0],
		//   x = w.innerWidth || e.clientWidth || g.clientWidth,
		//   y = w.innerHeight || e.clientHeight || g.clientHeight;

		// var result = x * lengthValue / 100;
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
			if (utilities.isElementInViewport(artwork.artworkImage)) {
				nakasentro.possiblyCenterUncenterImage(artwork);
			} else {
				// this.resetImageValues(artwork.artworkImage, artwork.artworkImageWrap);
			}
		}, this);
	},
};

