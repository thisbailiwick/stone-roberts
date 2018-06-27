<?php
 namespace App\Controllers;

 use Sober\Controller\Controller;

 class TemplateProjects extends Controller {
	protected $template = 'template-projects';

	public function projectCategoryPosts() {
	 $page_term = get_field('page_term');
	 // Define custom query parameters
	 $args = array(
		 'posts_per_page' => 1000,
		 'post_type' => 'projects',
		 'order' => 'ASC',
		 'post_status' => 'publish',
		 'category_name' => $page_term[0]->slug,
		 'meta_key' => '_reorder_term_category_' . $page_term[0]->slug,
		 'orderby' => 'meta_value_num title'
	 );
	 // Get current page and append to custom query parameters array
	 $args['paged'] = get_query_var('paged') ? get_query_var('paged') : 1;

	 // Instantiate custom query
//	 $the_query = new WP_Query($args);
	 $projects = get_posts($args);
	 foreach($projects as $index => $project){
	  	$projects[$index]->acf_content = get_fields($project->ID)['content'];
	 }

	 // Pagination fix
//    $temp_query = $wp_query;
//    $wp_query = NULL;
//    $wp_query = $temp_query;

	 return $projects;
	}

	public function testing() {
	 return 'tessting';
	}

 }
