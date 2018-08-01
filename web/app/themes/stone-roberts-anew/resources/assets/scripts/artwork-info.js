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
			};

			infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
			button.addEventListener("click", this.toggleInfo.bind(infoData));
		}, this);
	},
	toggleInfo: function () {
		let infoData = this;
		if (artworkInfo.showing) {
			clearAllBodyScrollLocks();
		} else {
			disableBodyScroll();
		}
		infoData.artworkWrap.classList.toggle("show-info");

		//toggle artwork info showing variable
		artworkInfo.showing = !artworkInfo.showing;
	},
};
