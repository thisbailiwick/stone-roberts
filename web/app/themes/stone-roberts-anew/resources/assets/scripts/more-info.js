// import utilities from './utilities';
var info = {
	infoButtons: null,
	init: function () {
		this.infoButtons = document.querySelectorAll(".actions .info");
			// console.log('begin');
		this.infoButtons.forEach(function (button) {
			var imageWrap = button.closest(".image-wrap");
			var pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");
			pieceComparisonWrap.style.width = '';

			// var pieceComparisonWrapWidthPixels = pieceComparisonWrap.clientWidth;
			// var pieceComparisonWrapHeightPixels = pieceComparisonWrap.clientHeight;

			// piece image
			// var {piece, pieceImageNaturalWidth, pieceImageNaturalHeight, pieceWidthInches, pieceHeightInches, pieceHeightImageRatio, pieceWidthImageRatio} = this.getImageDimensions(pieceComparisonWrap, button);
			var piece = pieceComparisonWrap.querySelector(".comparison-image");
			var pieceWidthInches = button.getAttribute("data-width");
			var pieceImageDimensions = this.getImageDimensions(piece, pieceWidthInches);
			// console.log(pieceImageDimensions);
			// console.log('pieceComparisonWrapHeightPixels > window.innerHeight: ' + pieceComparisonWrapHeightPixels, window.innerHeight);
			// if(pieceComparisonWrapHeightPixels > window.innerHeight){
			// 	pieceComparisonWrapHeightPixels = window.innerHeight;
			// }
			//
			// console.log(pieceComparisonWrapHeightPixels);

			// forscale image
			var forScale = pieceComparisonWrap.querySelector(".compared-to");
			var forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
			var forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches, 'forscale');


			// get the new dimensions
			// var dimensionValues = this.calculateNewDimensions(pieceWidthInches, pieceImageNaturalWidth, pieceImageNaturalHeight, forScaleWidthInches, pieceHeightInches, forScaleHeightInches, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceHeightImageRatio, pieceWidthImageRatio, forScaleHeightImageRatio, piece, forScale, pieceComparisonWrap);
			var dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions);
			//console.log('dimensionValues: ', JSON.stringify(dimensionValues));

			piece.style.width = dimensionValues.width + "px";
			piece.style.height = dimensionValues.height + "px";
			// forScale.style.width = dimensionValues.forScaleWidthPixels + "px";
			// forScale.style.height = dimensionValues.forScaleHeightPixels + "px";
		}, this);
	},
	getImageDimensions: function (element, widthInches, type = 'piece') {
		var fileNaturalWidth = 0;
		var fileNaturalHeight = 0;
		if (type === 'piece') {
			fileNaturalWidth = element.naturalWidth;
			fileNaturalHeight = element.naturalHeight;
		} else {
			fileNaturalWidth = element.getAttribute('data-file-width');
			fileNaturalHeight = element.getAttribute('data-file-height');
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
		// return value - 1;
		return value * .997531;
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
	calculateNewDimensions: function (pieceDimensions, forScaleDimensions) {

		// if the image rotation is portrait we find who is the widest, if landscape then we find who is tallest
		// we then set the baseline height or width to the spacing we have from pieceComparisonWrapHeightPixels or pieceComparisonWrapWidthPixels
		// var widthBaseline = null;
		// var heightBaseline = null;
		//
		// var pieceImageRotation = utilities.getImageSizeChangeTechnique(pieceDimensions.image, pieceComparisonWrap);
		// // var forScaleImageRotation = utilities.getImageSizeChangeTechnique(forScaleDimensions.image, pieceComparisonWrap);
		//
		// var pieceWidthPixels = null;
		// var pieceHeightPixels = null;

		// TODO: get if window is wider than tall or taller than wide.
		//
		// console.log('forScaleDimensions.image.clientHeight, forScaleDimensions.image.clientWidth: ' + forScaleDimensions.image.clientHeight, forScaleDimensions.image.clientWidth);
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
			pieceWidth = pieceToScaleWidthRatio * forScaleWidth;
		} else {
			pieceHeight = pieceToScaleHeightRatio * forScaleHeight;
			pieceWidth = pieceToScaleWidthRatio * forScaleDimensions.image.clientWidth;
		}
		// set and go?

		// pieceDimensions.image.style.height = pieceHeight + 'px';
		// pieceDimensions.image.style.width = pieceWidth + 'px';
		// console.log(pieceWidth, pieceHeight);

		return {width: pieceWidth, height: pieceHeight};


		// if (pieceImageRotation === 'width') {
		// 	widthBaseline = pieceComparisonWrapWidthPixels;
		//
		// 	// calculate the pixel amounts based off of the baseline
		//
		// 	// piece values
		// 	pieceWidthPixels = widthBaseline;
		// 	pieceHeightPixels = this.getImageHeightPixels(pieceWidthPixels, pieceDimensions.heightRatioInches);
		// } else {
		// 	heightBaseline = pieceComparisonWrapHeightPixels;
		// 	// calculate the pixel amounts based off of the baseline
		//
		// 	// piece values
		// 	pieceHeightPixels = heightBaseline;
		// 	pieceWidthPixels = this.getImageWidthPixels(pieceHeightPixels, pieceDimensions.widthRatioInches);
		//
		// }
		//
		// // this is the ratio of piece width to forscale width
		// var pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;
		// var pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;
		//
		//
		// // get forscale pixel dimensions based of piecetoscale ratios
		// var forScaleWidthPixels = Math.floor(pieceWidthPixels / pieceToScaleWidthRatio);
		// var forScaleHeightPixels = Math.floor(pieceHeightPixels / pieceToScaleHeightRatio);
		//
		// var dimensionValues = {
		// 	pieceWidthPixels: Math.floor(pieceWidthPixels),
		// 	pieceHeightPixels: pieceHeightPixels,
		// 	forScaleWidthPixels: forScaleWidthPixels,
		// 	forScaleHeightPixels: forScaleHeightPixels,
		// 	forScaleHeightImageRatio: forScaleDimensions.heightRatioInches,
		// 	pieceHeightImageRatio: pieceDimensions.heightRatioInches,
		// 	pieceComparisonWrapWidthPixels: pieceComparisonWrapWidthPixels,
		// 	pieceComparisonWrapHeightPixels: pieceComparisonWrapHeightPixels,
		// 	pieceToScaleWidthRatio: pieceToScaleWidthRatio,
		// 	pieceToScaleHeightRatio: pieceToScaleHeightRatio,
		// };
		//
		//
		// dimensionValues = Object.assign(this.recalculateNewDimensions(dimensionValues), dimensionValues);
		//
		// // let's put some space between the images
		// var betweenImageMarginPixels = pieceComparisonWrapWidthPixels * .03;
		//
		// var totalWidth = dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels;
		// pieceComparisonWrap.style.width = totalWidth + 'px';
		// dimensionValues.pieceWidthPixels = dimensionValues.pieceWidthPixels - betweenImageMarginPixels;
		// dimensionValues.forScaleWidthPixels = dimensionValues.forScaleWidthPixels - betweenImageMarginPixels;
		//
		// // do the heights
		// dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		// dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);
		//
		// return dimensionValues;
	},
};

export let moreInfo = info;