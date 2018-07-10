share = {
	windowObject: null,
	documentClickEvent: null,
	init: function () {
		// trigger click to show share buttons
		document.querySelectorAll(".actions .share").forEach(function (button) {
			button.addEventListener("click", this.triggerShareModule.bind(button));
		}, this);

		document.querySelectorAll('.dev-share-buttons .close').forEach(function (closeButton) {
			closeButton.addEventListener('click', function (e) {
				share.closeShareModule(e.target.closest('.dev-share-buttons'));
			});
		}, this);

		// trigger new window on share button click
		document
			.querySelectorAll(
				".dev-share-buttons a:not(.dev-share-buttons__item--copy):not(.dev-share-buttons__item--email)"
			)
			.forEach(function (shareButton) {
				shareButton.addEventListener("click", this.openNewWindow.bind(this));
			}, this);
	},

	openNewWindow(e) {
		var url = e.currentTarget.getAttribute("href");
		this.windowObject = window.open(
			url,
			"_blank",
			"resizable,scrollbars,status,width=400,height=400"
		);
	},

	triggerShareModule: function() {
		var shareWrap = this.parentNode.parentNode.parentNode.querySelector('.dev-share-buttons');
		shareWrap.classList.toggle("show");
		window.setTimeout(function(){
			share.addNonAreaClickClose(shareWrap);
		}, 100);
	},

	closeShareModule: function(shareWrap){
		shareWrap.classList.remove('show');
		document.removeEventListener('click', share.documentClickEvent, false);
	},

	addNonAreaClickClose: function(shareWrap){
		share.documentClickEvent = share.checkClickEvent.bind(shareWrap);
		document.addEventListener('click', share.documentClickEvent, false);
	},
	checkClickEvent: function(e){
		var shareWrapCurrent = e.target;
		if(shareWrapCurrent.classList.contains('show') && shareWrapCurrent.classList.contains('dev-share-buttons')){

		}else if(shareWrapCurrent.closest('.dev-share-buttons.show') === null){
			// this is also not the child of a dev share button which is open
			share.closeShareModule(this);
		}
	}
};
