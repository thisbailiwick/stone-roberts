import 'clipboard-copy-element';
var copyClick = {
  copyElements: document.querySelectorAll(".dev-share-buttons__item--copy .copy-content-element"),
	init: function() {
		this.copyElements.forEach(function(contentElement) {
			contentElement.addEventListener(
				"click",
				this.copyElementText.bind(contentElement),
				true
			);
		}, this);
	},
	copyElementText: function(e) {
		e.preventDefault();
		var contentElement = this;

		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(contentElement);
		selection.removeAllRanges();
		selection.addRange(range);

		try {
			document.execCommand("copy");
			selection.removeAllRanges();

			var original = contentElement.textContent;
	    contentElement.querySelector('.copy-content-element').textContent = "Copied!";
      contentElement.querySelector('.copy-content-element').classList.remove('hide_text');
      contentElement.classList.add("success");

			setTimeout(() => {
        contentElement.querySelector('.copy-content-element').textContent = original;
        contentElement.classList.remove("success");
			}, 1200);
		} catch (e) {
			var errorMsg = document.querySelector(".error-msg");
			errorMsg.classList.add("show");

			setTimeout(() => {
				errorMsg.classList.remove("show");
			}, 1200);
		}
	}
};

copyClick.init();


export {copyClick};
