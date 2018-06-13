import 'hamburgers';

const menuWrap = document.querySelector('header.banner');
let menuWrapHeight = null;
console.log(menuWrap);

export function init() {
	menuWrap.classList.add('menu-vertical-push');
	menuWrapHeight = outerHeight(menuWrap);
	menuWrap.style.marginTop = -menuWrapHeight + 'px';
	const hamburgerHtml = getHamburgerHtml();
	console.log(hamburgerHtml);
	menuWrap.insertBefore(hamburgerHtml, menuWrap.firstChild);
	window.setTimeout(function () {
		menuWrap.classList.add();
	}, 100);

	const hamburger = document.querySelector('header.banner .hamburger');
	hamburger.addEventListener('click', function () {
		toggleMenu();
		this.classList.toggle('is-active');
	}, false);
}

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
	console.log(div);
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
		const style = getComputedStyle(el);
		console.log(el);
		console.log(style);
		console.log(style.marginBottom);
		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
};