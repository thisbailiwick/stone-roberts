<?php
 /*
 Plugin Name:  Artsy Theme Custom Post Types
 Plugin URI:   http://roundhex.com
 Description:  Register default Artsy Theme post type
 Version:      1.0.0
 Author:       Kevin Clark - Roundhex
 Author URI:   http://roundhex.com
 License:      MIT License
 */

 // Add Projects custom post type
 function at_projects_post_type() {

	$labels = array(
		'name'                  => _x( 'Projects', 'Post Type General Name', 'st_projects' ),
		'singular_name'         => _x( 'Project', 'Post Type Singular Name', 'st_projects' ),
		'menu_name'             => __( 'Projects', 'st_projects' ),
		'name_admin_bar'        => __( 'Projects', 'st_projects' ),
		'archives'              => __( 'Project Archives', 'st_projects' ),
		'attributes'            => __( 'Project Attributes', 'st_projects' ),
		'parent_item_colon'     => __( 'Parent Project:', 'st_projects' ),
		'all_items'             => __( 'All Projects', 'st_projects' ),
		'add_new_item'          => __( 'Add New Project', 'st_projects' ),
		'add_new'               => __( 'Add Project', 'st_projects' ),
		'new_item'              => __( 'New Project', 'st_projects' ),
		'edit_item'             => __( 'Edit Project', 'st_projects' ),
		'update_item'           => __( 'Update Project', 'st_projects' ),
		'view_item'             => __( 'View Project', 'st_projects' ),
		'view_items'            => __( 'View Projects', 'st_projects' ),
		'search_items'          => __( 'Search Project', 'st_projects' ),
		'not_found'             => __( 'Not found', 'st_projects' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'st_projects' ),
		'featured_image'        => __( 'Featured Image', 'st_projects' ),
		'set_featured_image'    => __( 'Set featured image', 'st_projects' ),
		'remove_featured_image' => __( 'Remove featured image', 'st_projects' ),
		'use_featured_image'    => __( 'Use as featured image', 'st_projects' ),
		'insert_into_item'      => __( 'Insert into Project', 'st_projects' ),
		'uploaded_to_this_item' => __( 'Uploaded to this Project', 'st_projects' ),
		'items_list'            => __( 'Projects list', 'st_projects' ),
		'items_list_navigation' => __( 'Projects list navigation', 'st_projects' ),
		'filter_items_list'     => __( 'Filter Projects list', 'st_projects' ),
	);
	$args = array(
		'label'                 => __( 'Project', 'st_projects' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'post',
	);
	register_post_type( 'projects', $args );

 }
 add_action( 'init', 'at_projects_post_type', 0 );
