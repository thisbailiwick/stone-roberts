import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

export let artworkInfo = {
	showing: false,
	buttons: null,
	init: function () {
		let buttons = document.querySelectorAll(".artwork_piece .actions .info");
		buttons.forEach(function (button) {
			let artworkWrap = button.closest(".artwork_piece");

			let infoData = {
				button: button,
				artworkWrap: artworkWrap,
				close: artworkWrap.querySelector(".piece-comparison-wrap .close"),
				linkInputWrap: artworkWrap.querySelector('.link-input-wrap'),
			};

			// this.buttons.push(infoData);

			infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
			button.addEventListener("click", this.toggleInfo.bind(infoData));
		}, this);
	},
	// reset: function(){
	// 	this.buttons.forEach(function(button) {
	// 		infoData.close.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 		button.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 	}, this);
	// },
	toggleInfo: function () {
		let infoData = this;
		// setTimeout(function () {
		// 	window.scrollBy({
		// 		top: -30,
		// 		left: 0,
		// 		behavior: 'auto'
		// 	});
		// }, 0);
		// disable or enbale scrolling
		// console.log(window.innerHeight);
		if (artworkInfo.showing) {
			clearAllBodyScrollLocks();
		} else {
			disableBodyScroll();
		}
		infoData.artworkWrap.classList.toggle("show-info");
		window.setTimeout(function () {
			infoData.linkInputWrap.focus();
			infoData.linkInputWrap.select();
		}, 400);

		//toggle artwork info showing variable
		artworkInfo.showing = !artworkInfo.showing;
	},
};