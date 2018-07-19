/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_copy_click__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/copy-click */ "./js/copy-click.js");
/* harmony import */ var _js_share__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/share */ "./js/share.js");
/* harmony import */ var _js_share__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_share__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_share_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/share-api */ "./js/share-api.js");
/* harmony import */ var _js_share_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_js_share_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_copy_click_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style/copy-click.scss */ "./style/copy-click.scss");
/* harmony import */ var _style_copy_click_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_copy_click_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_share_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style/share.scss */ "./style/share.scss");
/* harmony import */ var _style_share_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_share_scss__WEBPACK_IMPORTED_MODULE_4__);






/***/ }),

/***/ "./js/copy-click.js":
/*!**************************!*\
  !*** ./js/copy-click.js ***!
  \**************************/
/*! exports provided: copyClick */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copyClick", function() { return copyClick; });
/* harmony import */ var clipboard_copy_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clipboard-copy-element */ "./node_modules/clipboard-copy-element/dist/index.esm.js");
/* harmony import */ var clipboard_copy_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(clipboard_copy_element__WEBPACK_IMPORTED_MODULE_0__);

var copyClick = {
  copyElements: document.querySelectorAll(".dev-share-buttons__item--copy .copy-content-element"),
  init: function init() {
    this.copyElements.forEach(function (contentElement) {
      contentElement.addEventListener("click", this.copyElementText.bind(contentElement), true);
    }, this);
  },
  copyElementText: function copyElementText(e) {
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
      setTimeout(function () {
        contentElement.querySelector('.copy-content-element').textContent = original;
        contentElement.classList.remove("success");
      }, 1200);
    } catch (e) {
      var errorMsg = document.querySelector(".error-msg");
      errorMsg.classList.add("show");
      setTimeout(function () {
        errorMsg.classList.remove("show");
      }, 1200);
    }
  }
};
copyClick.init();


/***/ }),

/***/ "./js/share-api.js":
/*!*************************!*\
  !*** ./js/share-api.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (navigator && navigator.share !== undefined) {
  var buttons = document.getElementsByClassName('dev-share-buttons');

  for (var i = buttons.length - 1; i >= 0; i--) {
    var container = buttons[i];
    var shareData = {
      url: document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : window.location.href,
      title: document.title
    };

    if (container.dataset && container.dataset.shareTitle) {
      shareData.title = container.dataset.shareTitle;
    }

    if (container.dataset && container.dataset.shareText) {
      shareData.text = container.dataset.shareText;
    }

    var shareApiButton = document.createElement('button');
    shareApiButton.className = 'dev-share-buttons__item dev-share-buttons__item--share-api';
    shareApiButton.innerText = 'Share';

    for (var i = container.children.length - 1; i >= 0; i--) {
      container.children[i].style.display = 'none';
    }

    container.append(shareApiButton);
    shareApiButton.addEventListener('click', function (e) {
      navigator.share(shareData).catch(function (err) {
        alert('Uh oh! There was an error using the share api. Maybe try using these default links instead');
        shareApiButton.remove();

        for (var i = container.children.length - 1; i >= 0; i--) {
          container.children[i].style.display = null;
        }
      });
    });
  }
}

/***/ }),

/***/ "./js/share.js":
/*!*********************!*\
  !*** ./js/share.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

share = {
  windowObject: null,
  documentClickEvent: null,
  isTouch: !!('ontouchend' in window || self._navigator && self._navigator.maxTouchPoints > 0 || self._navigator && self._navigator.msMaxTouchPoints > 0),
  init: function init() {
    // trigger click to show share buttons
    document.querySelectorAll(".actions .share").forEach(function (button) {
      button.addEventListener("click", this.triggerShareModule.bind(button));
    }, this);
    document.querySelectorAll('.dev-share-buttons .close').forEach(function (closeButton) {
      closeButton.addEventListener('click', function (e) {
        share.closeShareModule(e.target.closest('.dev-share-buttons'));
      });
    }, this); // trigger new window on share button click

    document.querySelectorAll(".dev-share-buttons a:not(.dev-share-buttons__item--copy):not(.dev-share-buttons__item--email)").forEach(function (shareButton) {
      shareButton.addEventListener("click", this.openNewWindow.bind(this));
    }, this);
  },
  openNewWindow: function openNewWindow(e) {
    var url = e.currentTarget.getAttribute("href");
    this.windowObject = window.open(url, "_blank", "resizable,scrollbars,status,width=400,height=400");
  },
  triggerShareModule: function triggerShareModule() {
    var shareWrap = this.parentNode.parentNode.parentNode.querySelector('.dev-share-buttons');
    shareWrap.classList.add("show");
    var linkInputWrap = shareWrap.querySelector('.link-input-wrap input');

    if (!share.isTouch) {
      linkInputWrap.focus();
      linkInputWrap.select();
    }

    window.setTimeout(function () {
      share.addNonAreaClickClose(shareWrap);
    }, 100);
  },
  closeShareModule: function closeShareModule(shareWrap) {
    shareWrap.classList.remove('show');
    document.removeEventListener('click', share.documentClickEvent, false);
    document.removeEventListener('touchstart', share.documentClickEvent, false);
  },
  addNonAreaClickClose: function addNonAreaClickClose(shareWrap) {
    share.documentClickEvent = share.checkClickEvent.bind(shareWrap);
    document.addEventListener('click', share.documentClickEvent, false);
    document.addEventListener('touchstart', share.documentClickEvent, false);
  },
  checkClickEvent: function checkClickEvent(e) {
    var shareWrapCurrent = e.target;
    console.log(e);
    var shareIconAssociatedDevShare = shareWrapCurrent.parentNode.parentNode.parentNode.querySelector('.dev-share-buttons');

    if (shareWrapCurrent.classList.contains('show') && shareWrapCurrent.classList.contains('dev-share-buttons') || shareIconAssociatedDevShare !== null && shareIconAssociatedDevShare.classList.contains('show') && shareWrapCurrent.classList.contains('share')) {} else if (shareWrapCurrent.closest('.dev-share-buttons.show') === null) {
      // this is also not the child of a dev share button which is open
      console.log('closing share module');
      share.closeShareModule(this);
    }
  }
};

/***/ }),

/***/ "./node_modules/clipboard-copy-element/dist/index.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/clipboard-copy-element/dist/index.esm.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function createNode(text) {
  var node = document.createElement('pre');
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.position = 'fixed';
  node.style.top = '5px';
  node.textContent = text;
  return node;
}

function copyNode(node) {
  var selection = getSelection();
  if (selection == null) {
    return;
  }

  selection.removeAllRanges();

  var range = document.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
}

function copyText(text) {
  var body = document.body;
  if (!body) return;

  var node = createNode(text);
  body.appendChild(node);
  copyNode(node);
  body.removeChild(node);
}

function copyInput(node) {
  node.select();
  document.execCommand('copy');
  var selection = getSelection();
  if (selection != null) {
    selection.removeAllRanges();
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function _CustomElement() {
  return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);

function copy(button) {
  var id = button.getAttribute('for');
  var text = button.getAttribute('value');
  if (text) {
    copyText(text);
  } else if (id) {
    copyTarget(button.ownerDocument, id);
  }
}

function copyTarget(document, id) {
  var content = document.getElementById(id);
  if (!content) return;

  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    if (content.type === 'hidden') {
      copyText(content.value);
    } else {
      copyInput(content);
    }
  } else {
    copyNode(content);
  }
}

function clicked(event) {
  var button = event.currentTarget;
  if (button instanceof HTMLElement) {
    copy(button);
  }
}

function keydown(event) {
  if (event.key === ' ' || event.key === 'Enter') {
    var button = event.currentTarget;
    if (button instanceof HTMLElement) {
      event.preventDefault();
      copy(button);
    }
  }
}

function focused(event) {
  event.currentTarget.addEventListener('keydown', keydown);
}

function blurred(event) {
  event.currentTarget.removeEventListener('keydown', keydown);
}

var ClipboardCopyElement = function (_CustomElement2) {
  inherits(ClipboardCopyElement, _CustomElement2);

  function ClipboardCopyElement() {
    classCallCheck(this, ClipboardCopyElement);

    var _this = possibleConstructorReturn(this, (ClipboardCopyElement.__proto__ || Object.getPrototypeOf(ClipboardCopyElement)).call(this));

    _this.addEventListener('click', clicked);
    _this.addEventListener('focus', focused);
    _this.addEventListener('blur', blurred);
    return _this;
  }

  createClass(ClipboardCopyElement, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }

      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return this.getAttribute('value') || '';
    },
    set: function set$$1(text) {
      this.setAttribute('value', text);
    }
  }]);
  return ClipboardCopyElement;
}(_CustomElement);

if (!window.customElements.get('clipboard-copy')) {
  window.ClipboardCopyElement = ClipboardCopyElement;
  window.customElements.define('clipboard-copy', ClipboardCopyElement);
}


/***/ }),

/***/ "./style/copy-click.scss":
/*!*******************************!*\
  !*** ./style/copy-click.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./style/share.scss":
/*!**************************!*\
  !*** ./style/share.scss ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=developer-share-buttons-bundle.js.map