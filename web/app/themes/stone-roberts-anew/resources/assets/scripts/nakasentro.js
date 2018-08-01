import {utilities} from './utilities';
import _ from 'underscore';
import {init as centerScrollToInit} from './center-scroll-to';
import {addThumbnail} from './thumbnail-nav';
import {zoomy} from './zoomy';
import {initialize as vhFixInit} from './vh-fix';

export let nakasentro = {
  fullscreen: document.querySelector('.fullscreen'),
  fullscreenWrapper: document.querySelector('.fullscreen-wrapper'),
  artworks_elements: document.querySelectorAll('.artwork_piece'),
  artworks: Array(),
  mainContentWidth: null,
  mainContentWrap: document.querySelector('.content>.main'),
  imageCentered: false,
  imageCenteredTrue: false, // tracks when image has gone fulldimension and get's toggled out of fulldimension but is still within the considered centered range
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
  mouse_map_less_percentage: .3,
  delayedTransitionInProgress: false,
  windowWidth: 0,

  init: function () {
    //reset values
    this.reset();

    this.isTouchDevice = utilities.isTouchDevice();

    if (this.isTouchDevice === false) {

      // setup values
      this.setupValues(true);
      // for when not in fullscreen
      window.addEventListener('scroll', function () {
          if (!this.isResizing && nakasentro.imagesProcessed === true) {
            nakasentro.checkArtworks();
          }
        }.bind(this)
      );
      window.addEventListener('scroll', function () {
          if (!nakasentro.isResizing && nakasentro.imagesProcessed === true) {
            nakasentro.checkArtworks();
          }
        }
      );

      // for when in fullscreen
      nakasentro.fullscreen.addEventListener('scroll', function () {
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
    this.windowWidth = utilities.windowWidth;
    this.mainContentWidth = this.mainContentWrap.clientWidth;

    this.setBodyClasses('orientation-' + utilities.browserOrientation);
    let vhFixElements = [];
    nakasentro.artworks_elements.forEach(function (artwork, index) {
      let artworkElements = null;
      if (isInit === true) {
        artworkElements = this.getArtworkElements(artwork, index);
      } else {
        artworkElements = nakasentro.artworks[index];
      }
      let {newHeight, newWidth, imageRatioWidth, imageRatioHeight} = this.getNewImageDimensions(artworkElements, isInit);

      let styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';
      if (isInit === false) {
        this.resetImageValues(artworkElements);
        utilities.removeCssFromPage([styleBlockId]);
      }
      utilities.setViewportDimensions();
      let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkElements.artworkWrap);

      window.addEventListener('resize', this.mobileResize.bind(this));
      // setup up vh-fix for full viewport height bugginess
      artworkElements.artworkImage.classList.add('vh-fix');

      if (isInit === true) {
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
          imageRatioHolder: artworkElements.imageRatioHolder,
          imageRatioWidth: imageRatioWidth,
          imageRatioHeight: imageRatioHeight,
          imageCentered: false,
          fullscreenImageCentered: false,
          isInViewport: false,
          imgSrc: artworkElements.imgSrc,
          originalDimensions: {
            width: newWidth,
            height: newHeight,
            imageRatioWidth: imageRatioWidth,
            imageRatioHeight: imageRatioHeight,
          },
        });
      } else {
        nakasentro.artworks[index].imageSizeChangeTechnique = imageSizeChangeTechnique;
        nakasentro.artworks[index].imageCentered = false;
        nakasentro.artworks[index].fullscreenImageCentered = false;
        nakasentro.artworks[index].isInViewport = false;
      }


      // let imageViewportWidthRatio = utilities.windowWidth / artworkElements.artworkImage.clientWidth;
      // let imageViewportHeightRatio = utilities.windowHeight / artworkElements.artworkImage.clientHeight;

      if (artworkElements.artworkImage.clientHeight >= utilities.windowHeight) {
        artworkElements.imageRatioHolder.style.height = artworkElements.artworkImage.clientHeight + 'px';
        artworkElements.imageRatioHolder.style.width = artworkElements.artworkImage.clientWidth + 'px';
      } else {
        let imageRatioHeight = artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth;
        artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
      }

      this.addMobileImageStylesToDocument(styleBlockId, artworkElements, newHeight, newWidth);

      addThumbnail(artworkElements.imgSrc, artworkElements.artworkImageWrap);

      vhFixElements.push(artworkElements.artworkImage);
    }, this);
    vhFixInit(vhFixElements, 100, 'landscape');
  },

  mobileResize: _.debounce(function () {
    // nakasentro.artworks = [];
    if (this.windowWidth !== utilities.windowWidth) {
      this.windowWidth = utilities.windowWidth;
      this.mobileSetup(false);
    }
  }, 250),

  fullScreenOnChangeEvent: function () {
    window.setTimeout(function () {
      // if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements
      /* eslint-disable */
      if (Barba.FullScreen.isFullscreen === false) {
        /* eslint-enable */
        nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(nakasentro, true);
      }

      nakasentro.windowResize();
    }, 100);
  },

  removeFullDimensionsCenteredImageScrollEvents: function (removeAllWheel) {
    removeAllWheel = typeof removeAllWheel === 'boolean'
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
    this.fullscreen = document.querySelector('.fullscreen');
    this.artworks_elements = document.querySelectorAll('.artwork_piece');
    this.mainContentWidth = null;
    this.mainContentWrap = document.querySelector('.content>.main');
    this.imageCentered = false;
    this.imageCenteredTrue = false;
    this.imageCenteredElement = null;
    this.scrollBeingThrottled = false;
    document.body.classList.remove('orientation-portrait', 'orientation-landscape', 'centered-image');
    document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
      this.removeArtworkPieceCentered(artworkPiece);
      artworkPiece.classList.remove('width', 'height');
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
  },
  removeBodyImageCenteredClasses: function () {
    document.body.classList.remove('centered-image');
    window.setTimeout(function () {
      // here we delay removing a class to allow some css transitions to happen
      nakasentro.imageCenteredElement.classList.remove('centered-image-transition-duration');
    }, 400);
  },

  resetImageValues: function (artwork) {
    artwork.artworkImage.setAttribute('style', '');
    artwork.zoomyWrap.setAttribute('style', '');
    artwork.imageRatioHolder.setAttribute('style', '');
    artwork.centerImageWrap.setAttribute('style', '');
  },

  resetAllImagesValues: function () {
    nakasentro.artworks.forEach(function (artwork) {
      console.log('resetting: ', artwork.artworkWrap);
      let styleBlockId = artwork.artworkUniqueId + '-artwork-centered-style';
      utilities.removeCssFromPage([styleBlockId]);
      artwork.artworkImage.setAttribute('style', '');
      artwork.zoomyWrap.setAttribute('style', '');
      artwork.imageRatioHolder.setAttribute('style', '');
      artwork.centerImageWrap.setAttribute('style', '');
    });
  },

  getArtworkElements: function (artwork, index) {
    let artworkWrap = artwork;
    artworkWrap.setAttribute('artworks-index', index);
    let artworkUniqueId = artwork.getAttribute('id');
    let artworkImageWrap = artwork.querySelector('.image-wrap');
    let centerImageWrap = artworkImageWrap.querySelector('.center-image-wrap');
    let artworkImage = artworkImageWrap.querySelector('.main-img');
    let zoomyWrap = artworkImageWrap.querySelector('.zoomy-wrap');
    let imageSpacePlaceholder = artworkImageWrap.querySelector('.image-space-placeholder');
    let imageRatioHolder = artworkImageWrap.querySelector('.image-ratio-holder');
    let mouseMapWrap = zoomyWrap.querySelector('.mouse-map-wrap');
    let mouseMapImage = mouseMapWrap.querySelector('.mouse-map');
    let artworkMetaWrap = artworkImageWrap.querySelector('.artwork-meta');
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
      mouseMapWrap: mouseMapWrap,
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

  addDynamicImageStylesToDocument: function (styleBlockId, artworkElements, imageViewportHeightRatio, imageViewportWidthRatio, newWidth, newHeight) {
    let styleBlock = document.getElementById(styleBlockId);
    if (styleBlock !== null) {
      styleBlock.remove();
    }

    // create styles for .main-img and .mouse-map width and height

    let artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .mouse-map-wrap {width: ' + newWidth + 'px; height: ' + newHeight + 'px;}';


    const mouseMapWidth = newWidth - (nakasentro.mouse_map_less_percentage * newWidth);
    const mouseMapHeight = newHeight - (nakasentro.mouse_map_less_percentage * newHeight);

    artworkStyles += '#' + artworkElements.artworkUniqueId + ' .mouse-map {width: ' + mouseMapWidth + 'px; height: ' + mouseMapHeight + 'px;}';

    // create styles for .main-img and .mouse-map scale amount when image dimension change is height
    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .main-img {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';

    // create styles for .main-img and .mouse-map scale amount when image dimension change is width
    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

    // pixel amounts for mousemap elements when image has width setting type
    const mouseMapZoomWidthPixelWidth = newWidth * imageViewportWidthRatio;
    const mouseMapZoomWidthPixelHeight = newHeight * imageViewportWidthRatio;

    // pizel amounts for mousemap elements when image has height setting type
    const mouseMapZoomHeightPixelHeight = newHeight * imageViewportHeightRatio;
    const mouseMapZoomHeightPixelWidth = newWidth * imageViewportHeightRatio;


    // create zoom value style for when the image is scaled full width/height and therefor the original zoom value is scaled up also
    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .mouse-map-wrap { width: ' + mouseMapZoomWidthPixelWidth + 'px; height: ' + mouseMapZoomWidthPixelHeight + 'px;}';

    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .mouse-map-wrap { width: ' + mouseMapZoomHeightPixelWidth + 'px; height: ' + mouseMapZoomHeightPixelHeight + 'px;}';

    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .mouse-map { width: ' + (mouseMapZoomWidthPixelWidth - (nakasentro.mouse_map_less_percentage * mouseMapZoomWidthPixelWidth)) + 'px; height: ' + (mouseMapZoomWidthPixelHeight - (nakasentro.mouse_map_less_percentage * mouseMapZoomWidthPixelHeight)) + 'px;}';

    artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .mouse-map { width: ' + (mouseMapZoomHeightPixelWidth - (nakasentro.mouse_map_less_percentage * mouseMapZoomHeightPixelWidth)) + 'px; height: ' + (mouseMapZoomHeightPixelHeight - (nakasentro.mouse_map_less_percentage * mouseMapZoomHeightPixelHeight)) + 'px;}';


    // remove temporary max height for image after processing
    artworkElements.artworkImage.style.maxHeight = 'none';


    artworkElements.artworkImage.style.position = 'static';
    artworkElements.centerImageWrap.style.height = 0;

    utilities.addCssToPage(artworkStyles, styleBlockId);
  },

  addMobileImageStylesToDocument: function (styleBlockId, artworkElements, newHeight, newWidth) {
    // const mouseMapWidth = artworkElements.artworkImage.clientWidth;
    // const mouseMapHeight = artworkElements.artworkImage.clientHeight;
    const artworkStyles = '#' + artworkElements.artworkUniqueId + ' .mouse-map-wrap, #' + artworkElements.artworkUniqueId + ' .dev-share-buttons, #' + artworkElements.artworkUniqueId + ' .zoomy-wrap {width: ' + newWidth + 'px; height: ' + newHeight + 'px;}';
    utilities.addCssToPage(artworkStyles, styleBlockId);
  },

  cropImageDimensions: function (artworkElements, currentHeight, currentWidth, imageRatioWidth, imageRatioHeight) {
    if (utilities.windowHeight < currentHeight) {
      currentHeight = utilities.windowHeight;
      currentWidth = currentHeight * imageRatioWidth;
    }

    if (utilities.windowWidth <= currentWidth) {
      currentWidth = utilities.windowWidth;
      currentHeight = currentWidth * imageRatioHeight;
    }
    return {newHeight: currentHeight, newWidth: currentWidth};
  },

  getNewImageDimensions: function (artworkElements, isInit) {
    // currenWidth and currentHeight won't necessarily reflect the actual final width height of the image as this is sometimes triggered before the image full resizes after viewport change. This possibility is handled in cropImageDimensions
    let currentHeight = artworkElements.artworkImage.clientHeight;
    let currentWidth = artworkElements.artworkImage.clientWidth;
    let imageRatioWidth = null;
    let imageRatioHeight = null;


    // debugger;
    if (isInit === true) {
      imageRatioWidth = currentWidth / currentHeight;
      imageRatioHeight = currentHeight / currentWidth;
    } else {
      imageRatioWidth = artworkElements.originalDimensions.imageRatioWidth;
      imageRatioHeight = artworkElements.originalDimensions.imageRatioHeight;
    }

    // temporarily set maxHeight for processing
    artworkElements.artworkImage.style.maxHeight = '100vh';
    const newDimensions = this.cropImageDimensions(artworkElements, currentHeight, currentWidth, imageRatioWidth, imageRatioHeight);
    currentHeight = newDimensions.newHeight;
    currentWidth = newDimensions.newWidth;
    return {
      newHeight: currentHeight,
      newWidth: currentWidth,
      imageRatioWidth: imageRatioWidth,
      imageRatioHeight: imageRatioHeight,
    };
  },

  setupValues: function (isInit) {
    nakasentro.imagesProcessed = false;
    isInit = typeof isInit === 'boolean'
      ? isInit
      : false;
    this.reset();

    this.mainContentWidth = this.mainContentWrap.clientWidth;

    this.setBodyClasses('orientation-' + utilities.browserOrientation);

    nakasentro.artworks_elements.forEach(function (artwork, index) {
      // let zoomWrap = artwork.querySelector('.zoom-wrap');
      let artworkElements = null;
      if (isInit === true) {
        artworkElements = this.getArtworkElements(artwork, index);
      } else {
        artworkElements = nakasentro.artworks[index];
      }

      let styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';

      // if (isInit === false) {
      //   this.resetImageValues(artworkElements);
      //   utilities.removeCssFromPage([styleBlockId]);
      // }

      let {newHeight, newWidth, imageRatioWidth, imageRatioHeight} = this.getNewImageDimensions(artworkElements, isInit);

      artworkElements.artworkImage.style.minHeight = newHeight + 'px';

      artworkElements.artworkImage.style.minWidth = newWidth + 'px';
      // let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkWrap);
      let imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkElements.artworkImage);
      artworkElements.artworkWrap.classList.remove('width', 'height');


      artworkElements.artworkWrap.classList.add(imageSizeChangeTechnique);

      if (newHeight >= utilities.windowHeight) {
        artworkElements.imageRatioHolder.style.height = newHeight + 'px';
        artworkElements.imageRatioHolder.style.width = newWidth + 'px';
      } else {
        artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
      }


      let imageViewportWidthRatio = utilities.windowWidth / newWidth;
      let imageViewportHeightRatio = utilities.windowHeight / newHeight;

      artworkElements.mouseMapImage.setAttribute('scaleWidth', imageViewportWidthRatio);
      artworkElements.mouseMapImage.setAttribute('scaleHeight', imageViewportHeightRatio);


      let imageMaxHeight = null;
      // get image max height
      if (imageSizeChangeTechnique === 'width') {
        // if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
        imageMaxHeight = utilities.windowHeight * (newHeight / newWidth);
      } else {
        // if imageSizeChangeTechnique is height we want to just use the viewport height amount.
        imageMaxHeight = utilities.windowHeight;
      }

      let imageOffsetFromDocTop = utilities.getElementOffsetFromDoc(artworkElements.artworkImage).top;
      let imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

      if (isInit === true) {
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
          mouseMapImage: artworkElements.mouseMapImage,
          zoomyWrap: artworkElements.zoomyWrap,
          imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
          artworkUniqueId: artworkElements.artworkUniqueId,
          imageCentered: false,
          isInViewport: false,
          toCenterPixels: 0,
          imgSrc: artworkElements.imgSrc,
          // this allows us to track centered image when in fullscreen and we use the counted scroll events or keyboard events to trigger the image out of full width
          fullscreenImageCentered: false,
          originalDimensions: {
            width: artworkElements.artworkImage.clientWidth,
            height: newHeight,
            imageRatioWidth: imageRatioWidth,
            imageRatioHeight: imageRatioHeight,
            imageViewportWidthRatio: imageViewportWidthRatio,
            imageViewportHeightRatio: imageViewportHeightRatio,
          },
          dynamicImageValues: {
            toCenterPercentage: null,
          },
        });
      } else {
        nakasentro.artworks[index].imageSizeChangeTechnique = imageSizeChangeTechnique;
        nakasentro.artworks[index].imageOffsetFromDocTop = imageOffsetFromDocTop;
        nakasentro.artworks[index].imageMaxHeight = imageMaxHeight;
        nakasentro.artworks[index].imageMaxHeightCenterPointFromDocTop = imageMaxHeightCenterPointFromDocTop;
        nakasentro.artworks[index].imageCentered = false;
        nakasentro.artworks[index].isInViewport = false;
        nakasentro.artworks[index].toCenterPixels = 0;
        // this allows us to track centered image when in fullscreen and we use the counted scroll events or keyboard events to trigger the image out of full width
        nakasentro.artworks[index].fullscreenImageCentered = false;
        nakasentro.artworks[index].originalDimensions.imageViewportWidthRatio = imageViewportWidthRatio;
        nakasentro.artworks[index].originalDimensions.imageViewportHeightRatio = imageViewportHeightRatio;
        nakasentro.artworks[index].dynamicImageValues = {
          toCenterPercentage: null,
        };
      }


      nakasentro.artworks[index].wheelEvent = nakasentro.fullscreenHandleZoomyDivScroll.bind(nakasentro.artworks[index]);
      nakasentro.artworks[index].keydownEvent = nakasentro.handlePossibleScrollKeyEvent.bind(nakasentro.artworks[index]);

      this.addDynamicImageStylesToDocument(styleBlockId, artworkElements, imageViewportHeightRatio, imageViewportWidthRatio, newWidth, newHeight);

      // add to thumbnails
      addThumbnail(artworkElements.imgSrc, artworkElements.artworkImageWrap);
    }, this);

    // init button scroll to script
    centerScrollToInit();

    nakasentro.imagesProcessed = true;

    // document.body.classList.add('artworks-processed');
    window.addEventListener('resize', this.windowResize);
    window.addEventListener('resize', function () {
      if (nakasentro.isResizing === false) {
        nakasentro.resetAllImagesValues();
        document.body.classList.add('viewport-resizing');
        nakasentro.isResizing = true;
      }
    });
  },

  windowResize: _.debounce(function () {
    // let currentViewportDimensions = utilities.getViewportDimensions();
    //Todo: utilites width and height are being updated before this runs
    // if (utilities.windowHeight !== currentViewportDimensions.height || utilities.windowWidth !== currentViewportDimensions.width) {
    // utilities.setViewportDimensions();
    // nakasentro.resetAllImagesValues();
    nakasentro.setupValues();
    // }
    document.body.classList.remove('viewport-resizing');
    nakasentro.isResizing = false;
  }, 500),


  setBodyClasses: function (classes) {
    document.querySelector('body').classList.add(classes);
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

  centerImage: function (artwork) {
    /* eslint-disable */
    if (Barba.FullScreen.isFullscreen === true) {
      /* eslint-enable */
      artwork.fullscreenImageCentered = true;
    }

    // console.log('adding keydown/wheel event listeners to ', artwork);
    window.addEventListener('keydown', artwork.keydownEvent);
    artwork.zoomyWrap.addEventListener('wheel', artwork.wheelEvent, {passive: true});

    // console.log('body classlist adding centered-image');
    document.body.classList.add('centered-image');

    // overarching imageCentered toggle
    // console.log('global image Centered set true');
    this.imageCentered = true;
    this.imageCenteredTrue = true;
    nakasentro.imageCenteredElement = artwork.element;

    // console.log('artwork imageCentered set true');
    // speicific artwork iamgeCentered toggle
    artwork.imageCentered = true;

    // if (!artwork.artworkWrap.classList.contains('centered-image-transition-duration')) {
    // 	console.log('adding centered centered-image-transition-duration classes to artwork');
    // 	console.log('');
    artwork.artworkWrap.classList.add('centered', 'centered-image-transition-duration');
    // }
  },

  uncenterImage: function (artwork, fullDimensionEvent = false) {
// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements

    nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(artwork);

    // speicific artwork iamgeCentered toggle
    // console.log('artwork imageCentered setting false');
    // artwork.imageCentered = false;
    // console.log('body classlist removing centered-image');
    document.body.classList.remove('centered-image');
    // console.log('artowrk classlist removing centered');
    artwork.artworkWrap.classList.remove('centered');
    // console.log('global imageCentered setting false');

    // overarching imageCentered toggle
    if (fullDimensionEvent === false) {
      this.imageCenteredTrue = false;
      this.imageCentered = false;

      if (nakasentro.imageCenteredTrue === false) {
        artwork.imageCentered = false;
      }
    }
    // console.log('global imageCenteredElement set null');
    // console.log('');

    this.imageCenteredElement = null;
    this.possiblyRunDelayedTransition(artwork, fullDimensionEvent);
  },

  possiblyRunDelayedTransition(artwork, fullDimensionEvent) {
    if (this.delayedTransitionInProgress === false) {
      this.delayedTransitionInProgress = true;
      window.setTimeout(() => {
        // last check
        if (nakasentro.imageCenteredTrue === true && fullDimensionEvent === true || this.imageCentered === false) {
          nakasentro.runDelayedTransition(artwork);
        } else {
          nakasentro.delayedTransitionInProgress = false;
        }
      }, 400);
    }
  },

  runDelayedTransition(artwork) {
    // here we delay removing a class to allow some css transiti
    artwork.artworkWrap.classList.remove('centered-image-transition-duration');
    this.delayedTransitionInProgress = false;
  },

  possiblyCenterUncenterImage: function (artwork) {
    let toCenterPixels = this.setArtworkToCenterPixels(artwork);

    let toCenterPixelsAbsolute = Math.abs(toCenterPixels);

    let toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);
    // console.log(toCenterPercentage);
    artwork.artworkWrap.setAttribute('percent-to-center', toCenterPercentage);

    // if we're close to the centerpoint of an image, we trigger a scroll to
    if (toCenterPercentage < nakasentro.consideredCenteredPercentage) {
      // image is centered
      if (artwork.imageCentered === false && artwork.fullscreenImageCentered === false/* && this.recentlyAddedCenteredClasses === false*/) {
        // if in fullscreen we want to add these events to handle scroll when centered and scroll events is not triggered due to fixed elements
        /* eslint-disable */
        share.closeShareModule(artwork.artworkWrap.querySelector('.dev-share-buttons'));
        /* eslint-enable */
        this.centerImage(artwork);
      }

    } else if (artwork.fullscreenImageCentered === true) {
      // set false variable tracking fullwidth centered image when in fullscreen.
      artwork.fullscreenImageCentered = false;
    } else if (artwork.imageCentered === true) {
      if (toCenterPercentage > nakasentro.consideredCenteredPercentage) {
        // image is not centered
        this.uncenterImageBreakZoom.call(artwork);
        this.uncenterImage(artwork);
      }
    }
  },

  possiblyRemoveZoom: function () {
    if (this.artworkWrap.classList.contains('zoomed')) {
      zoomy.removeArtworkZoomByPictureIndex(this.artworkWrap.getAttribute('zoomy-pictures-index'));
      return true;
    } else {
      return false;
    }
  },

  removeImageCentered: function (element) {
    nakasentro.removeBodyImageCenteredClasses.call(element.artworkWrap);
    nakasentro.removeArtworkPieceCentered(element.artworkWrap);
    nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(element);
  },

  processZoomRemoval: function () {
    zoomy.removeZoomedDelayClass(this.artworkWrap);
    nakasentro.possiblyRemoveZoom.call(this);
  },

  handlePossibleScrollKeyEvent: function (e) {
    nakasentro.processZoomRemoval.call(this);
    nakasentro.uncenterImage.call(nakasentro, this, true);
    if (e.code === 'ArrowRight' && e.code === 'ArrowLeft') {
      e.preventDefault();
    }
  },

  uncenterImageBreakZoom: function () {
    nakasentro.processZoomRemoval.call(this);
    nakasentro.uncenterImage.call(nakasentro, this, true);
    nakasentro.fixedImageScrollReleaseCount = 0;
  },

  fullscreenHandleZoomyDivScroll: function () {
    if (nakasentro.fixedImageScrollReleaseCount >= 20) {
      nakasentro.uncenterImageBreakZoom.call(this);
    } else {
      nakasentro.fixedImageScrollReleaseCount++;
    }
  },

  getNewLength: function (toCenterPercentage, originalDimensionValue) {
    // console.log(toCenterPercentage);
    // @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
    // @b is the beginning value of the property.
    // @c is the change between the beginning and destination value of the property.
    // @d is the total time of the tween.
    // TODO: Figure out a better name for lengthValue
    // let lengthValue = this.browserOrientation === 'portrait' ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
    // lengthValue = lengthValue * .45;

    // let w = window,
    //   doc = document,
    //   e = doc.documentElement,
    //   g = doc.getElementsByTagName('body')[0],
    //   x = w.innerWidth || e.clientWidth || g.clientWidth,
    //   y = w.innerHeight || e.clientHeight || g.clientHeight;

    let toCenterPercentagePassed = 100 - toCenterPercentage;

    let t = toCenterPercentagePassed;
    let b = originalDimensionValue;
    let c = 100 - originalDimensionValue;
    let d = 100;

    let newLength = c * t / d + b;

    newLength = newLength < originalDimensionValue
      ? originalDimensionValue
      : newLength;

    return newLength;
  },

  checkArtworks: function () {
    nakasentro.artworks.forEach(function (artwork) {
      if (utilities.isElementVerticallyInViewport(artwork.artworkImage)) {
        artwork.isInViewport = true;
        nakasentro.possiblyCenterUncenterImage(artwork);
      } else {
        artwork.isInViewport = false;
        this.setArtworkToCenterPixels(artwork);
      }
    }, this);
  },
};

