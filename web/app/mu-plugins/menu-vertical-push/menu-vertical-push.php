<?php
 namespace MenuVerticalPush;
 /**
	* @package Menu Vertical Push
	* @version 1.0
	*/
 /*
 Plugin Name: Menu Vertical Push
 Plugin URI: http://roundhex.com
 Description: Have your menu expand and push content down from the top of the page
 Author: Kevin Clark - Roundhex
 Version: 1.0
 Author URI: http://roundhex.com
 Text Domain: menu-vertical-push
 */

 // include js file
// include css file
 add_action('wp_enqueue_scripts', function () {
	$plugin_dir = plugin_dir_url(__FILE__);
	wp_enqueue_style('menu-vertical-push.css', $plugin_dir . 'dist/main.css', false, null);
	wp_enqueue_script('menu-vertical-push.js', $plugin_dir . 'dist/bundle.js', false, null, true);
 }, 100);