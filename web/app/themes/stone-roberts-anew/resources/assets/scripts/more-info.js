import {utilities} from './utilities';

let info = {
  infoButtons: null,
  init: function () {
    this.infoButtons = document.querySelectorAll(".actions .info");
    this.infoButtons.forEach(function (button) {
      const imageWrap = button.closest(".image-wrap");
      const pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");
      pieceComparisonWrap.style.width = '';

      // piece image
      const piece = pieceComparisonWrap.querySelector(".comparison-image");
      const pieceWidthInches = button.getAttribute("data-width");
      const pieceHeightInches = button.getAttribute('data-height');
      const pieceImageDimensions = this.getImageDimensions(piece, pieceWidthInches, pieceHeightInches);

      // forscale image
      const forScale = pieceComparisonWrap.querySelector(".compared-to");
      const forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
      const forScaleScaleHeightInches = button.getAttribute("data-compare-height-inches");
      const forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches, forScaleScaleHeightInches, 'forscale');

      // image-box-shadow
      const imageBoxShadow = pieceComparisonWrap.querySelector('.image-box-shadow');

      // matte div
      const matte = pieceComparisonWrap.querySelector('.matte');


      // get the new dimensions
      let dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions);

      piece.style.width = dimensionValues.width + "px";
      piece.style.height = dimensionValues.height + "px";
      imageBoxShadow.style.width = dimensionValues.width + "px";
      imageBoxShadow.style.height = dimensionValues.height + "px";

      window.setTimeout(function () {
        matte.style.padding = '10%';
      }, 10);


      // add processed class, toggles visibility
      pieceComparisonWrap.classList.add('piece-comparison-processed');
    }, this);

  },
  getImageDimensions: function (element, widthInches, heightInches, type = 'piece') {
    let fileNaturalWidth = 0;
    let fileNaturalHeight = 0;
    if (type === 'piece') {
      fileNaturalWidth = element.naturalWidth;
      fileNaturalHeight = element.naturalHeight;
    } else {
      // fileNaturalWidth = element.getAttribute('data-file-width');
      // fileNaturalHeight = element.getAttribute('data-file-height');
      fileNaturalWidth = element.clientWidth;
      fileNaturalHeight = element.clientHeight;
    }
    // let naturalFileRatio = fileNaturalWidth / fileNaturalHeight;
    // let heightInches = button.getAttribute("data-height");
    // let heightInches = widthInches / naturalFileRatio;
    let heightRatioInches = heightInches / widthInches;
    let widthRatioInches = widthInches / heightInches;

    const fileWidthRatio = fileNaturalWidth / fileNaturalHeight;
    const fileHeightRatio = fileNaturalHeight / fileNaturalWidth;
    return {
      image: element,
      fileNaturalWidth: fileNaturalWidth,
      fileNaturalHeight: fileNaturalHeight,
      fileWidthRatio: fileWidthRatio,
      fileHeightRatio: fileHeightRatio,
      heightInches: heightInches,
      heightRatioInches: heightRatioInches,
      widthInches: widthInches,
      widthRatioInches: widthRatioInches,
    };
  },
  getNewValue: function (value) {
    return value * .997531;
  },
  getImageHeightPixels: function (imageWidthPixels, imageHeightRatio) {
    return imageWidthPixels * imageHeightRatio;
  },
  getImageWidthPixels: function (imageHeightPixels, imageWidthRatio) {
    return Math.floor(imageHeightPixels * imageWidthRatio);
  },
  calculateNewDimensions: function (pieceDimensions, forScaleDimensions) {
    // get actual pixel width of what forscale image should be based on it's current height

    let pieceHeight = 0;
    let pieceWidth = 0;
    // scale the piece to fit based on it's width/height height/width ratio to the for scale image.
    // this is the ratio of piece width to forscale width
    console.log('forScaleDimensions.widthInches, forScaleDimensions.heightInches: ' + forScaleDimensions.widthInches, forScaleDimensions.heightInches);
    console.log('pieceDimensions.widthInches, pieceDimensions.heightInches: ' + pieceDimensions.widthInches, pieceDimensions.heightInches);
    const fullSizeDimension = utilities.getImageSizeChangeTechnique(forScaleDimensions.image) === 'width'
      ? 'height'
      : 'width';
    console.log(fullSizeDimension);
    let pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;
    let pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;

    // if the background image is showing it's full height
    if (fullSizeDimension === 'height') {
      pieceHeight = pieceToScaleHeightRatio * forScaleDimensions.image.clientHeight;
      pieceWidth = pieceDimensions.fileWidthRatio * pieceHeight;
    } else {
      // the background image is showing it's full width
      pieceWidth = pieceToScaleWidthRatio * forScaleDimensions.image.clientWidth;
      pieceHeight = pieceDimensions.fileHeightRatio * pieceWidth;
    }

    return {width: pieceWidth, height: pieceHeight};
  },
};

export let moreInfo = info;
