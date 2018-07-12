import {utilities} from './utilities';
import reframe from 'reframe.js';
import YouTubePlayer from 'youtube-player';

// // add youtube api script to the page
// let tag = document.createElement('script');
// tag.id = 'iframe-demo';
// tag.src = 'http://www.youtube.com/iframe_api';
// let firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


/* eslint-disable */
let players = {};
// let youTubeIframeAPIReady = false;

function processYouTubeIframes() {
// get all iframes where source contains youtube
	const iframes = Array.prototype.slice.call(document.querySelectorAll('.video iframe[src*="youtube"]'));
	iframes.map(function (iframe) {
		const iframeWrap = iframe.closest('.iframe-wrap');
		const uniqueId = iframe.getAttribute('id');
		const button = utilities.getSiblingByClass(iframeWrap, 'play-button');
		players[uniqueId] = YouTubePlayer(uniqueId, {videoID: uniqueId});

		button.addEventListener('click', function () {
			players[uniqueId].playVideo();
		});

		reframe(button.parentNode.querySelector("iframe"));

		// const iframeWrap = iframe.closest('.iframe-wrap');
		// const uniqueId = iframe.getAttribute('id');
		// const button = utilities.getSiblingByClass(iframeWrap, 'play-button');
		// players[uniqueId] = new YT.Player(uniqueId, {});
		//
		// button.addEventListener('click', function () {
		// 	players[uniqueId].playVideo();
		// });
		//
		// reframe(button.parentNode.querySelector("iframe"));
	});
}

// window.onYouTubeIframeAPIReady = function () {
// 	youTubeIframeAPIReady = true;
// };
/* eslint-enable */

export {processYouTubeIframes/*, youTubeIframeAPIReady*/}