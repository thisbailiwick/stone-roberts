export let mousePosition = {
	// Mouse position relative to the document
	// From http://www.quirksmode.org/js/events_properties.html
	mousePositionDocument: function (e) {
		var posx = 0;
		var posy = 0;
		console.log(e);
		if (!e) {
			/* eslint-disable */
			var e = window.event;
			/* eslint-enable */
		}
		console.log(e.pageX);
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
	findPos: function (obj) {
		var rect = obj.getBoundingClientRect();
		return {top: rect.top + window.scrollY, left: rect.left + window.scrollX}
	},

	// Mouse position relative to the element
	mousePositionElement: function (target, e) {
    console.log('mousePositionElement', e);
		var mousePosDoc = this.mousePositionDocument.call(this, e);
		var targetPos = this.findPos(target);
		var posx = mousePosDoc.x - targetPos.left;
		var posy = mousePosDoc.y - targetPos.top;
		return {
			x: posx,
			y: posy,
		};
	},
};
