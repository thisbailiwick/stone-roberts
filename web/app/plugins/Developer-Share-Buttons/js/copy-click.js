import ClipboardJS from 'clipboard';
var copyClick = {
  copyElements: document.querySelectorAll(".dev-share-buttons__item--copy"),
	init: function() {
		var clipboard = new ClipboardJS('.dev-share-buttons__item--copy');

		clipboard.on('success', function(e) {
			console.log(e);
			var original = e.trigger.innerHTML;
			e.trigger.innerHTML = 'Copied!';

			setTimeout(() => {
				e.trigger.innerHTML = original;
			}, 1200);

			e.clearSelection();
		});

		clipboard.on('error', function(e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
		});

		// TODO: WHY OH WHY DOES THE CLIPBOARD COPY NOT WORK WHEN THIS EVENT ISN'T ADDED?
		this.copyElements.forEach(function(contentElement) {
			contentElement.addEventListener(
				"click",
				function(){},
				true
			);
		}, this);
	},
};

copyClick.init();


export {copyClick};
