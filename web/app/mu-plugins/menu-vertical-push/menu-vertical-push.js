import 'hamburgers';
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

const menuWrap = document.querySelector('header.banner');
let hamburger = null;
// let menuWrapHeight = null;
let ignoreHeightAmount = 0;

export function init() {
	menuWrap.classList.add('menu-vertical-push');
	// menuWrapHeight = outerHeight(menuWrap);
	// ignoreHeightAmount = outerHeight(menuWrap.querySelector('.brand'));
	// console.log(ignoreHeightAmount);
	// console.log(menuWrapHeight);
	// menuWrap.style.marginTop = -(menuWrapHeight - ignoreHeightAmount) + 'px';
	const menuLinks = menuWrap.querySelectorAll('a:not(.brand)');
	menuLinks.forEach(function (link) {
		link.addEventListener('click', menuLinkClick);
	});
	const hamburgerHtml = getHamburgerHtml();
	menuWrap.insertAdjacentElement('beforebegin', hamburgerHtml);
	hamburger = document.querySelector('.hamburger');
	window.setTimeout(function () {
		menuWrap.classList.add();
	}, 100);


	hamburger.addEventListener('click', function () {
		toggleMenu();
		if (!this.classList.contains('is-active')) {
			disableBodyScroll();
		} else {
			clearAllBodyScrollLocks();
		}
		this.classList.toggle('is-active');
	}, false);

	menuWrap.classList.add('menu-vertical-push-processed');
}

const menuLinkClick = () => {
	toggleMenu();
	clearAllBodyScrollLocks();
	hamburger.classList.remove('is-active');
};

const getHamburgerHtml = () => {
	const hamburgerHtmlString = `
		<button class="hamburger hamburger--collapse" type="button">
		  <span class="hamburger-box">
		    <span class="hamburger-inner"></span>
		  </span>
		</button>  
	`;

	let div = document.createElement('div');
	div.innerHTML = hamburgerHtmlString;
	return div.firstElementChild;
};

const toggleMenu = () => {
	outerHeight(menuWrap);
	if (menuWrap.classList.contains('open')) {
		menuWrap.classList.remove('open');
	} else {
		menuWrap.classList.add('open');
	}
};

const outerHeight = (el) => {
	let height = el.offsetHeight;
	// const style = getComputedStyle(el);
	// height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	return height;
};