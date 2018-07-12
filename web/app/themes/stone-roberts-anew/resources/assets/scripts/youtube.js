import {utilities} from './utilities';
import reframe from 'reframe.js';

// add youtube api script to the page
let tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'http://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


/* eslint-disable */
let players = {};

window.onYouTubeIframeAPIReady = function () {

	// get all iframes where source contains youtube
	const iframes = Array.prototype.slice.call(document.querySelectorAll('.video iframe[src*="youtube"]'));
	iframes.map(function(iframe){
		const iframeWrap = iframe.closest('.iframe-wrap');
		const uniqueId = iframe.getAttribute('id');
		const button = utilities.getSiblingByClass(iframeWrap, 'play-button');
		players[uniqueId] = new YT.Player(uniqueId, {});

		button.addEventListener('click', function(){
			players[uniqueId].playVideo();
		});

		reframe(button.parentNode.querySelector("iframe"));
	});
};
/* eslint-enable */