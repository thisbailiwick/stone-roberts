import {utilities} from './utilities';
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {mousePosition} from './mousePosition';
import {nakasentro} from './nakasentro';

export let zoomy = {
  pictures: Array(),
  isTouchDevice: utilities.isTouchDevice(),
  mouseMapEventsAdded: false,
  mouseMapLessPixelsHalf: nakasentro.mouse_map_less_percentage / 2,
  currentZoomEventReference: null,
  currentZoomObject: null,
  init: function () {
    this.reset();
    document.querySelectorAll(".artwork_piece[zoom-enabled] .actions .zoom").forEach(function (value, index) {
      var artworkPieceWrap = value.parentNode.parentNode.parentNode.parentNode;
      var zoomyWrap = artworkPieceWrap.querySelector(".zoomy-wrap");
      var mouseMapWrap = zoomyWrap.querySelector('.mouse-map-wrap');
      var mouseMapImage = zoomyWrap.querySelector(".mouse-map");
      var img = artworkPieceWrap.firstElementChild;

      // add zoomy pictures index value to artworkpiece wrap for reference in nakasentro
      artworkPieceWrap.setAttribute('zoomy-pictures-index', index);

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
        mouseMapEventsAdded: false,
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
      value.addEventListener('click', this.toggleZoom.bind(this.pictures[index]));
      mouseMapWrap.addEventListener('click', this.toggleZoom.bind(this.pictures[index]));

      if (this.isTouchDevice) {
        document.body.classList.add("is-touch");
      }
    }, zoomy);
  },

  possiblyRemoveZoom: function (e) {
    console.log(e);
    if (e.target.classList.contains('mouse-map') === false) {
      //clicked outside of mouse-map, zoom out
      zoomy.toggleZoom.call(this, e);
    }
  },

  reset: function () {
    this.pictures = Array();
  },

  possiblyImmediatelyRemoveZoom: function () {
    /* eslint-disable */
    if (Barba.FullScreen.isFullscreen === true) {
      /* eslint-enable */

    }
  },

  removeArtworkZoomByPictureIndex: function (index) {
    zoomy.pictures[index].artworkPieceWrap.classList.toggle("zoomed");
    zoomy.pictures[index].isZoomed = false;

    zoomy.unsetCurrentZoomObject();
    // mobile devices get body locked/unlocked
    if (zoomy.isTouchDevice) {
      clearAllBodyScrollLocks(this.pictures[index].mouseMapImage);
    }

    zoomy.removeMouseMoveEvents.call(zoomy.pictures[index]);
  },

  addMouseMoveEvents: function () {
    zoomy.mouseMapEventsAdded = true;
    this.mouseMapEventsAdded = true;
    document.body.addEventListener("mousemove", this.mouseMoveHandler, {passive: true});
    document.body.addEventListener("touchmove", this.touchMoveHandler, {passive: true});
  },

  removeMouseMoveEvents: function () {
    zoomy.mouseMapEventsAdded = false;
    this.mouseMapEventsAdded = false;
    document.body.removeEventListener("mousemove", this.mouseMoveHandler, false);
    document.body.removeEventListener("touchmove", this.touchMoveHandler, false);
  },

  setTimeoutRemoveDelayClass: function (element) {
    // this delay needs to be associated with the $zoom-transition-duration variable found in _artwork-piece.scss
    window.setTimeout(() => {
      // todo make sure this is working
      this.removeZoomedDelayClass(element.artworkPieceWrap);
    }, 500);
  },

  removeZoomedDelayClass: function (element) {
    element.classList.remove('zoomed-delay');
  },

  toggleZoom: function (e) {

    //move zoom image to cursor/touch point
    if (e.currentTarget.classList.contains('mouse-map') || e.currentTarget.classList.contains('mouse-map-wrap')) {
      zoomy.mapMouseToImage.call(this, e);
    }

    this.artworkPieceWrap.classList.toggle("zoomed");
    // document.body.classList.toggle("zoomed");
    console.log('this.isZoomed pre: ', this.isZoomed);
    // toggle the picture aray element zoomed value
    this.isZoomed = !this.isZoomed;

    // mobile devices get body locked/unlocked
    if (zoomy.isTouchDevice) {
      if (this.isZoomed === true) {
        disableBodyScroll(this.mouseMapImage);
      } else {
        clearAllBodyScrollLocks(this.mouseMapImage);
      }
    }

    // add or remove the delay class used for animation
    console.log('this: ', this);
    console.log('this.isZoomed post: ', this.isZoomed);
    if (this.isZoomed === false) {
      // zooming out
      zoomy.setTimeoutRemoveDelayClass(this);
    } else {
      // zooming in
      this.artworkPieceWrap.classList.add('zoomed-delay');
      console.log('zoomy.currentZoomObject: ', zoomy.currentZoomObject);
      if (zoomy.currentZoomObject !== null && zoomy.currentZoomObject.isZoomed === true) {
        // there is another image which is already zoomed
        // let's remove the zoom
        zoomy.currentZoomObject.artworkPieceWrap.classList.toggle('zoomed');
        zoomy.currentZoomObject.isZoomed = false;
        zoomy.setTimeoutRemoveDelayClass(zoomy.currentZoomObject);
      }
    }

    // add or remove touch/mousemove events
    if (this.isZoomed === true && this.mouseMapEventsAdded === false) {
      // we're zooming in
      if (zoomy.currentZoomObject !== null) {
        zoomy.removeObjectZoom.call(zoomy.currentZoomObject);
      }

      zoomy.addMouseMoveEvents.call(this);
      let currentObject = this;

      window.setTimeout(function () {
        console.log('setting zoomy currentzoomobject');
        zoomy.currentZoomEventReference = zoomy.possiblyRemoveZoom.bind(currentObject);
        zoomy.currentZoomObject = currentObject;
        document.body.addEventListener('click', zoomy.currentZoomEventReference);
      }, 10);

    } else if (this.mouseMapEventsAdded === true) {
      // we're zooming out
      zoomy.removeObjectZoom.call(this);
    }
  },
  unsetCurrentZoomObject: function () {
    document.body.removeEventListener('click', zoomy.currentZoomEventReference);
    zoomy.currentZoomEventReference = null;
    console.log('removing zoomy currentzoomobject');
    zoomy.currentZoomObject = null;
  },
  removeObjectZoom: function () {
    zoomy.removeMouseMoveEvents.call(this);
    window.setTimeout(function () {
      zoomy.unsetCurrentZoomObject();
    }, 10);
  },
  mapMouseToImage: function () {
    var mouseMap = this.mouseMapImage;
    var position = mousePosition.mousePositionElement(this.mouseMapImage);

    // if (position.x > 0) {
    var leftPercentage = 0;
    var topPercentage = 0;

    if (nakasentro.artworks[this.artworksIndex].imageCentered === true) {
      // image centered
      // adjust the percentage based on the scale amount (the transfoorm: scale() messes with the sizes somehow
      if (this.imageRotation === 'width') {
        leftPercentage = (position.x / mouseMap.clientWidth) * 100;
        topPercentage = (position.y / (mouseMap.clientWidth * nakasentro.artworks[this.artworksIndex].originalDimensions.imageRatioHeight)) * 100;
      } else {
        topPercentage = (position.y / mouseMap.clientHeight) * 100;
        leftPercentage = (position.x / (mouseMap.clientHeight * nakasentro.artworks[this.artworksIndex].originalDimensions.imageRatioWidth)) * 100;
      }
    } else {
      // image not centered
      leftPercentage = (position.x / mouseMap.clientWidth) * 100;
      topPercentage = (position.y / mouseMap.clientHeight) * 100;
    }

    // set max and min values
    const minValue = -2;
    const maxValue = 102;
    topPercentage = topPercentage < minValue
      ? minValue
      : topPercentage;
    topPercentage = topPercentage > maxValue
      ? maxValue
      : topPercentage;
    leftPercentage = leftPercentage < minValue
      ? minValue
      : leftPercentage;
    leftPercentage = leftPercentage > maxValue
      ? maxValue
      : leftPercentage;

    this.mouseMapWrap.style.backgroundPosition = leftPercentage + "% " + topPercentage + "%";
    // }
  },
};
