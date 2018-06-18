import 'hamburgers';

const menuWrap = document.querySelector('header.banner');
let hamburger = null;
let menuWrapHeight = null;

export function init() {
	menuWrap.classList.add('menu-vertical-push');
	menuWrapHeight = outerHeight(menuWrap);
	menuWrap.style.marginTop = -menuWrapHeight + 'px';
	const menuLinks = menuWrap.querySelectorAll('a');
	menuLinks.forEach(function(link){
		link.addEventListener('click', menuLinkClick);
	});
	const hamburgerHtml = getHamburgerHtml();
	menuWrap.insertBefore(hamburgerHtml, menuWrap.firstChild);
	hamburger = document.querySelector('header.banner .hamburger');
	window.setTimeout(function () {
		menuWrap.classList.add();
	}, 100);


	hamburger.addEventListener('click', function () {
		toggleMenu();
		this.classList.toggle('is-active');
	}, false);
}

const menuLinkClick = () => {
	toggleMenu();
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
		const style = getComputedStyle(el);
		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
};