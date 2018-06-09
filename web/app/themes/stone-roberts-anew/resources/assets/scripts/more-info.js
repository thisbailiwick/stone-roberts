import utilities from './utilities';
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
	logDimensionInfo: function (dimensionValues, originalHeightRatio, originalWidthRatio) {
		console.log('piece forscale height ratio: ' + dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels);
		console.log('piece forscale width ratio: ' + dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels);
		console.log('original height ratio: ' + originalHeightRatio);
		console.log('original width ratio: ' + originalWidthRatio);
		console.log('piece forscale height ratio % change: ' + (100 - (originalHeightRatio / (dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels) * 100)) + '%');
		console.log('piece forscale width ratio % change: ' + (100 - (originalWidthRatio / (dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels) * 100)) + '%');
		console.log("pieceComparisonWrapHeightPixels: " + dimensionValues.pieceComparisonWrapHeightPixels);
		console.log('pieceWidthPixels--: ' + dimensionValues.pieceWidthPixels);
		console.log("pieceHeightPixels--: " + dimensionValues.pieceHeightPixels);
		console.log('pieceRatio: ' + dimensionValues.pieceWidthPixels / dimensionValues.pieceHeightPixels);
		console.log('forScaleWidthPixels--: ' + dimensionValues.forScaleWidthPixels);
		console.log("forScaleHeightPixels-- " + dimensionValues.forScaleHeightPixels);
		console.log('forscale ratio: ' + dimensionValues.forScaleWidthPixels / dimensionValues.forScaleHeightPixels);
		console.log('');
		console.log('');
	},
	recalculateNewDimensions: function (dimensionValues) {
		// var originalHeightRatio = dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels;
		// var originalWidthRatio = dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels;

		do {

			// todo: this may only work with wider than tall images, may need to add alternate
			// get a slightly smaller width value
			dimensionValues.pieceWidthPixels = this.getNewValue(dimensionValues.pieceWidthPixels);
			// dimensionValues.pieceHeightPixels = this.getNewValue(dimensionValues.pieceHeightPixels);

			// get the new height value the piece based on the newly found width
			dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);

			// get a slightly smaller width for the forscale image
			dimensionValues.forScaleWidthPixels = this.getNewValue(dimensionValues.forScaleWidthPixels);
			// dimensionValues.forScaleHeightPixels = this.getNewValue(dimensionValues.forScaleHeightPixels);

			// get forsacle height value based on newly found forscale width value
			dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);

			// this.logDimensionInfo(dimensionValues, originalHeightRatio, originalWidthRatio);
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

		var pieceImageRotation = utilities.getImageSizeChangeTechnique(pieceDimensions.image, pieceComparisonWrap);
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

export let moreInfo = info;