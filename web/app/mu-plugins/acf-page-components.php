<?php
 /*
	Plugin Name:  Artsy Theme ACF Page Components
	Plugin URI:   http://roundhex.com
	Description:  ACF output of html
	Version:      1.0.0
	Author:       Kevin Clark - Roundhex
	Author URI:   http://roundhex.com
	License:      MIT License
	*/

 namespace ArtsyTheme\StoneRoberts\ACFPageComponents;

 function get_sections($post, $sections) {
	$sections_html = '';
	if (isset($sections['acf_fc_layout'])) {
	 $sections = [$sections];
	}
	foreach ($sections as $index => $section) {
	 $section_type = $section['acf_fc_layout'];
	 if ($section_type == 'image_text_style_2' || $section_type === 'text_style_2') {
		$section_type = str_replace('_style_2', '', $section_type);
	 }
	 $function_html = 'ArtsyTheme\\StoneRoberts\\ACFPageComponents\\' . "html_" . $section_type;

	 if (function_exists($function_html)) {
		$id_tag = $section['acf_fc_layout'] . '-' . $post->ID . '-' . $index;

		$sections_html .= $function_html($section, $id_tag, $post);
	 }
	}

	return do_shortcode($sections_html);
 }

 function html_quote($content, $id_tag) {
	$show_top_bottom_border = $content['show_top_bottom_border'] ? ' show_top_bottom_border' : '';

	$html = <<<HTML
			<div class="{$content['acf_fc_layout']}{$show_top_bottom_border}"{$id_tag}>
					{$content['text']}
			</div>
HTML;

	return $html;
 }

 function html_image($content, $id_tag) {
	$img = get_image_html($content['image_file']);
	$content['caption'] = get_caption($content['caption_text']);
	$content['position_image'] = $content['image_width'] === 'full' ? 'center' : $content['position_image'];
	$html = <<<HTML
			<div class="{$content['acf_fc_layout']} img-width-{$content['image_width']} img-{$content['position_image']} {$content['acf_fc_layout']}"{$id_tag}>
				{$img}
        {$content['caption']}
			</div>

HTML;

	return $html;

 }

 function html_title_text($content, $id_tag) {

	$html = <<<HTML
			<h2 class="{$content['acf_fc_layout']}-section {$content['acf_fc_layout']}"{$id_tag}>
				{$content['title_text']}
			</h2>

HTML;

	return $html;
 }

 function html_body_text($content, $id_tag) {

	$html = <<<HTML
			<div class="{$content['acf_fc_layout']}-section {$content['acf_fc_layout']}" id="{$id_tag}">
				<div class="text">{$content['body_text']}</div>
			</div>

HTML;

	return $html;
 }

 function html_image_file($content) {
	$image = $content['image_file'];
	return <<<HTML
			<div class="{$content['acf_fc_layout']}">
			<img src="{$image['url']}" alt="{$image['alt']}" />
			</div>
HTML;

 }

 function get_zoom_width($type, $artwork_piece, $custom_zoom_value) {
	switch ($type) {
	 case 'custom':
		// custom number is %
		$width = ((int)$custom_zoom_value * .01) * (int)$artwork_piece['width'];
		break;
	 case 'filesize':
		// this is filesize
		$width = $artwork_piece['width'];
		break;
	 case 'none':
		$width = 'disabled';
		break;

	 default:
		$width = 'disabled';
	}

	return $width;
 }

 function process_global_default_zoom_setting($artwork_piece) {
	$global_default = get_field('default_zoom_setting', 'options');
	$global_custom_zoom_value = get_field('custom_zoom_value', 'options');
	$width = get_zoom_width($global_default, $artwork_piece, $global_custom_zoom_value);
	return $width;
 }

 function get_zoom_setting($local_type, $artwork_piece, $local_custom_zoom_value) {
	switch ($local_type) {
	 case 'global_default':
		$width = process_global_default_zoom_setting($artwork_piece, $local_custom_zoom_value);
		break;
	 default:
		$width = get_zoom_width($local_type, $artwork_piece, $local_custom_zoom_value);
		break;
	}
	return $width;
 }

 function html_artwork_piece($content, $unique_id, $post) {
	$image = $content['artwork_piece'];
	$image_url = get_photon_url($image['url']);
	$permalink = get_permalink($post->ID);
	$artwork_info_text = trim($content['artwork_info_text']);
	$compare_image_height = get_field('compare_height_in_inches', 'options')['compare_height_in_inches'];
	$compare_image_width = get_field('compare_width_in_inches', 'options')['compare_width_in_inches'];
	$compare_image = get_field('compare_background_image', 'options');
	$compare_image_url = get_photon_url($compare_image['url']);
	$piece_title = $post->post_title;
	$dev_share_buttons = get_dev_share_buttons(array('facebook', 'twitter', 'email', 'copy'), $permalink, $post->post_title, '', $image_url, $post->ID);


	// get zoom settings based on values set in wp admin
	// TODO: move to this to naksentro.js where we're setting other css styles
	$zoom_setting = get_zoom_setting($content['zoom_setting'], $content['artwork_piece'], $content['custom_zoom_value']);
	$zoom_enabled_attribute = '';
	$zoom_style = '';
	$zoom_attribute = '';
	if ($zoom_setting !== 'disabled') {
	 $zoom_enabled_attribute = ' zoom-enabled';
	 $zoom_style = <<<HTML
		<style type="text/css">
			#{$unique_id}.zoomed .mouse-map-wrap{
				background-size: {$zoom_setting}px auto;
			}
		</style>
HTML;

	 $zoom_attribute = ' zoom-setting="' . $zoom_setting . '"';
	}
	return <<<HTML
		{$zoom_style}
		<div id="{$unique_id}" class="{$content['acf_fc_layout']}"{$zoom_enabled_attribute}>
			<h3 class="artwork-title">{$piece_title}</h3>
			<div class="image-wrap">
        	<div class="image-space-placeholder">
					 	<div class="loading-image">
							<div class="line"></div>
						</div>
        		<div class="center-image-wrap">
          		<img class="main-img" src="{$image_url}" alt="{$image['alt']}" data-width="{$image['width']}" data-height="{$image['height']}"/>
          	</div>
          	<div class="zoomy-wrap">
          		<div class="mouse-map-wrap" style="background-image: url('{$image_url}');"{$zoom_attribute}{$zoom_enabled_attribute}>
								<div class="mouse-map"></div>
							</div>
            	{$dev_share_buttons}
          	</div>
            <div class="image-ratio-holder"></div>
					</div>
					<div class="piece-comparison">
						<div class="piece-comparison-wrap" style="visibility: hidden;">
							<i class="close"></i>
							<div class="comparison-image-wrap">
								<div class="matte">
									<div class="comparison-image-wrap-inner">
									 <img class="comparison-image" src="{$image_url}" alt="{$image['alt']}" data-width="{$content['width']}" data-height="{$content['height']}" />
									 <div class="image-box-shadow"></div>
									</div>
								</div>
							</div>
							<!--<div style="background: url('{$compare_image_url}') no-repeat center/cover transparent" data-file-width="{$compare_image['width']}" data-file-height="{$compare_image['height']}" class="compared-to" /></div>-->
							<img src="{$compare_image_url}" data-object-fit class="compared-to" />
						</div>
					</div>
					<div class="artwork-meta">
						<div class="caption">{$content['caption_text']}</div>
						<div class="actions">
							<i class="zoom icon" data-large-image="{$image_url}" data-zoom-unique-id="{$unique_id}"></i>
							<i class="info icon" data-width="{$content['width']}" data-height="{$content['height']}" data-compare-height-inches="{$compare_image_height}" data-compare-width-inches="{$compare_image_width}"></i>
							<i class="share icon"></i>
						</div>
					</div>
          </div>
			</div>
HTML;

 }

 function html_2_column($content, $id_tag) {
	$header = !empty($content['header']) ? '<h2>' . $content['header'] . '</h2>' : '';
	$html = <<<HTML
			<div class="cf column-{$content['acf_fc_layout']}"{$id_tag}>
				{$header}
				<div class="column column-1">
					{$content['column_1']}
				</div>
				<div class="column column-2">
					{$content['column_2']}
				</div>
			</div>

HTML;

	return $html;
 }

 function html_audio($content, $id_tag) {
	$piece = $content['audio_file'];

	$container_id = 'audio-container-' . rand(1000, 10000000);
	$player_id = 'audio-player-' . rand(1000, 10000000);
	$audio_url = htmlspecialchars($content['audio_file']['url']);
	$pieces = <<<HTML
				<div class="audio-piece" data-url="{$audio_url}" data-mime_type="{$content['audio_file']['mime_type']}">
					<button class="play">Play</button>
					<button class="pause">Pause</button>
          <div class="volume span-value-wrap">
            <div class="span-value">
              <div class="span-value-jump">
                <div></div>
              </div>
            </div>
          </div>
					<div class="progress span-value-wrap">
            <div class="span-value">
              <div class="span-value-jump">
                <div></div>
              </div>
            </div>
          </div>
          <div class="duration"></div>
          <div class="timer">0:00</div>
				</div>
HTML;

	$html = <<<HTML

			<div class="{$content['acf_fc_layout']}"{$id_tag}>
			  <h2>{$content['header']}</h2>
				{$pieces}
			</div>

HTML;

	return $html;
 }

 function html_video($content, $id_tag = false) {

	$id_tag = $id_tag ?: 'video-' . random_int(100, 100000000);

	$embed = get_video_embed_html($content['acf_fc_layout'], $content['video_iframe'], $content['video_host'], $content['image_file']['url'], $content['caption_text'], $id_tag);

	$html = <<<HTML
				{$embed}
HTML;

	return $html;
 }

 function html_image_slider($content, $id_tag = false) {
	$slides_html = '';
	foreach ($content['slides'] as $slide) {
	 $image = get_image($slide['image']);
	 $slide['caption'] = get_caption($slide['caption']);
	 $slides_html .= <<<HTML
				<div class="carousel-cell">
					{$image}
					<div class="text">
						{$slide['caption']}
					</div>
				</div>
HTML;

	}
	$html = <<<HTML
			<div class="carousel-wrap {$content['acf_fc_layout']}"{$id_tag}>
				<div class="carousel">
					{$slides_html}
				</div>
			</div>
HTML;

	return $html;
 }

// Utility functions

 function get_image_html($image) {
	return <<<HTML
			<img src="{$image['url']}" alt="{$image['alt']}" />
HTML;

 }

 function get_caption($caption) {
	if (!empty($caption)) {

	 $caption = '<div class="captions">' . $caption . '</div>';
	}

	return $caption;
 }

 function get_image($image, $is_mobile = false) {

	$mobile_mark = $is_mobile ? ' class="mobile-placeholder"' : '';

	return '<img src="' . $image['url'] . '" alt="' . $image['alt'] . '"' . $mobile_mark . ' />';
 }

 function parse_for_mobile_placeholder($text, $image) {
	$image_html = get_image($image, true);
	$new_text = preg_replace('/\[mobile\-image\]/', $image_html, $text);

	$found = $new_text !== $text;

	return array($new_text, $found);
 }

 function get_video_embed_html($layout_type, $video_iframe, $video_host, $image_url, $caption, $id_tag) {
  $image_url = get_photon_url($image_url);
	return <<<HTML
			<div class="{$layout_type}" id="{$id_tag}" video-host="{$video_host}">
				<div class="wrap">
					<div class="video-play-screenshot" style="background-image: url({$image_url})">
					</div>
					<div class="iframe-wrap" id="{$id_tag}-iframe-wrap">
						{$video_iframe}
					</div>
					<button class="play-button" data-toggle="modal" data-target="#video-modal"></button>
				</div>
				<div class="caption">{$caption}</div>
			</div>
HTML;

 }

 function filter_iframe_input($iframe, $background_style = true, $unique_id) {
	// remove and replace any url queries with the background query
	$background_style = $background_style ? '?background=1' : '';

	if ($background_style === '') {
//		  $to_replace = array(
//        '/\?.*?\"/',
//        '/(src=\\?\s*".*?)(")/'
//      );
//		  $replace_with = array(
//		    '',
//        '$1?autoplay=1$2'
//      );
//			$iframe = preg_replace($to_replace, $replace_with, $iframe);

	 // remove any query variables
	 $iframe = preg_replace('/\?.*?\"/', '"', $iframe);

	 // add query question mark and query variables we want
	 $iframe = preg_replace('/(src=\\\\?\s*".*?)(")/', '$1?enablejsapi=1&amp;rel=0&amp;showinfo=0$2', $iframe);

	 // remove slashes
//	 $iframe = stripslashes($iframe);

	 // remove any current id's
	 $iframe = preg_replace('/id=\\\\\\"([^"]*)\\\\\\"\s/mi', '', $iframe);
	 // add unique id to iframe
	 $iframe = preg_replace('/(<iframe)/', '$1 id="' . $unique_id . '-iframe"', $iframe);

	 // remove any stray p tags
	 $settings_to_remove = array(
		 '/(<p[^>]*>.*?<\/p>)/',
	 );
	} else {
	 $iframe = preg_replace('/\?.*?\"/', $background_style . '"', $iframe);
	 // we remove settings appropriate for the home/work page
	 $settings_to_remove = array(
		 '/webkitallowfullscreen/',
		 '/mozallowfullscreen/',
		 '/allowfullscreen/',
		 '/(<p[^>]*>.*?<\/p>)/'
	 );
	}

	// remove any attribute settings
	return preg_replace($settings_to_remove, '', $iframe);
 }

 add_action('acf/save_post', __NAMESPACE__ . '\\acf_save_post', 1);

 function acf_save_post($post_id) {

	// bail early if no ACF data
	if (empty($_POST['acf'])) {

	 return;

	}

	if (isset($_POST['post_type']) && $_POST['post_type'] === 'projects') {
	 foreach ($_POST['acf']['field_5ad92400012d8'] as $index => $project_section) {
		if ($project_section['acf_fc_layout'] === 'video') {
		 // save iframe to hidden field
		 $unique_id = 'video-' . $post_id . '-' . $index;
		 $_POST['acf']['field_5ad92400012d8'][$index]['field_5ad92638012d9_field_5ad9230360669'] = filter_iframe_input($project_section['field_5ad92638012d9_field_5ad9230360669'], false, $unique_id);
		}
	 }
	}
 }

 function get_custom_nav() {
	$nav_items = get_field('menu_items', 'options');
	$nav_html = '';
	foreach ($nav_items as $index => $nav_item) {
	 $nav_html .= <<<HTML
			<li class="list-item">	
				<a href="{$nav_item['page_link']}" class="nav-item">
				 <span class="nav-item-header">{$nav_item['category_title']}</span>
				 <span class="nav-item-image" style="background-image: url({$nav_item['thumbnail_image']['url']})"></span>
				 <span class="nav-item-short-text">{$nav_item['short_text']}</span>		
				</a>
			</li>			
HTML;
	}

	return <<<HTML
		<ul class="custom-nav">
			{$nav_html}
		</ul>
HTML;

 }

 function get_photon_url($url){
//	if (function_exists('jetpack_photon_url')) {
//		$url = apply_filters('jetpack_photon_url', get_bloginfo('url') . $url);
//	}

	return $url;
 }