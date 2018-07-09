let utilities = {
	windowHeight: null,
	windowWidth: null,
	windowRatioWidth: null,
	windowRatioHeight: null,
	windowHalfHeight: null,
	browserOrientation: null,
	bodyOverlay: document.getElementById('body-overlay'),
	init: function () {
		this.setViewportDimensions();
		document.addEventListener('barbaFullscreenOnChange', this.fullScreenOnChangeEvent.bind(this), false);
		// throw in closest polyfill
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
		if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

		if (!Element.prototype.closest)
			Element.prototype.closest = function (s) {
				var el = this;
				if (!document.documentElement.contains(el)) return null;
				do {
					if (el.matches(s)) return el;
					el = el.parentElement || el.parentNode;
				} while (el !== null && el.nodeType === 1);
				return null;
			};
	},
	fullScreenOnChangeEvent: function () {
		window.setTimeout(function () {
			utilities.setViewportDimensions();
		}, 250);
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
	isElementVerticallyInViewport: function (el) {
		var bounding = el.getBoundingClientRect();

		return (
			bounding.top >= 0 &&
			bounding.top <= (window.innerHeight || document.documentElement.clientHeight)
			||
			bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			bounding.bottom >= 0
		);
	},
	isTouchDevice: function () {
		return "ontouchstart" in document.documentElement;
	},
	getElementOffsetFromDoc: function (el) {
		// https://stanko.github.io/javascript-get-element-offset/
		const rect = el.getBoundingClientRect();

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
			let el = document.getElementById(id);
			el.parentNode.removeChild(el);
		});
	},
};

utilities.init();

module.exports = utilities;