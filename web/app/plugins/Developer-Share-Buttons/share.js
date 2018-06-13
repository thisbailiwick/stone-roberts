share = {
  windowObject: null,
  init: function() {
    // trigger click to show share buttons
    document.querySelectorAll(".actions .share").forEach(function(button) {
      button.addEventListener("click", this.triggerShareModule.bind(button));
    }, this);

    // trigger new window on share button click
    document
      .querySelectorAll(
        ".dev-share-buttons a:not(.dev-share-buttons__item--copy):not(.dev-share-buttons__item--email)"
      )
      .forEach(function(shareButton) {
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
  triggerShareModule() {
    var imageWrap = this.parentNode.parentNode.parentNode.querySelector('.dev-share-buttons');
    imageWrap.classList.toggle("show");
  }
};
