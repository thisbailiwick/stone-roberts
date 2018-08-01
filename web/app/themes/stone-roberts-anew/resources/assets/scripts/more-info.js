var info = {
	infoButtons: null,
	init: function () {
		this.infoButtons = document.querySelectorAll(".actions .info");
		this.infoButtons.forEach(function (button) {
			var imageWrap = button.closest(".image-wrap");
			var pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");
			pieceComparisonWrap.style.width = '';

			// piece image
			var piece = pieceComparisonWrap.querySelector(".comparison-image");
			var pieceWidthInches = button.getAttribute("data-width");
			var pieceImageDimensions = this.getImageDimensions(piece, pieceWidthInches);

			// forscale image
			var forScale = pieceComparisonWrap.querySelector(".compared-to");
			var forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
			var forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches, 'forscale');

			// image-box-shadow
      let imageBoxShadow = pieceComparisonWrap.querySelector('.image-box-shadow');


			// get the new dimensions
			var dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions);

			piece.style.width = dimensionValues.width + "px";
			piece.style.height = dimensionValues.height + "px";
			imageBoxShadow.style.width = dimensionValues.width + "px";
			imageBoxShadow.style.height = dimensionValues.height + "px";


			// add processed class, toggles visibility
			pieceComparisonWrap.classList.add('piece-comparison-processed');
		}, this);

	},
	getImageDimensions: function (element, widthInches, type = 'piece') {
		var fileNaturalWidth = 0;
		var fileNaturalHeight = 0;
		if (type === 'piece') {
			fileNaturalWidth = element.naturalWidth;
			fileNaturalHeight = element.naturalHeight;
		} else {
			// fileNaturalWidth = element.getAttribute('data-file-width');
			// fileNaturalHeight = element.getAttribute('data-file-height');
      fileNaturalWidth = element.clientWidth;
      fileNaturalHeight = element.clientHeight;
		}
		var naturalFileRatio = fileNaturalWidth / fileNaturalHeight;
		// var heightInches = button.getAttribute("data-height");
		var heightInches = widthInches / naturalFileRatio;
		var heightRatioInches = heightInches / widthInches;
		var widthRatioInches = widthInches / heightInches;
		return {
			image: element,
			fileNaturalWidth: fileNaturalWidth,
			fileNaturalHeight: fileNaturalHeight,
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
		let forScaleWidth = forScaleDimensions.image.clientHeight * (forScaleDimensions.fileNaturalWidth / forScaleDimensions.fileNaturalHeight);
		let forScaleHeight = forScaleDimensions.image.clientWidth * (forScaleDimensions.fileNaturalHeight / forScaleDimensions.fileNaturalWidth);

		let pieceHeight = 0;
		let pieceWidth = 0;
		// scale the piece to fit based on it's width/height height/width ratio to the for scale image.
		// this is the ratio of piece width to forscale width
		let pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;
		let pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;

		if (forScaleHeight < forScaleWidth) {
			pieceHeight = pieceToScaleHeightRatio * forScaleDimensions.image.clientHeight;
			pieceWidth = pieceToScaleWidthRatio * forScaleDimensions.image.clientWidth;
		} else {
			pieceHeight = pieceToScaleHeightRatio * forScaleDimensions.image.clientHeight;
			pieceWidth = pieceToScaleWidthRatio * forScaleDimensions.image.clientWidth;
		}

		return {width: pieceWidth, height: pieceHeight};
	},
};

export let moreInfo = info;
