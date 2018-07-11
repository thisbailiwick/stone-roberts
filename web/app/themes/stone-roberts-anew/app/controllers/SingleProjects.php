<?php

 namespace App\Controllers;

 use Sober\Controller\Controller;

 class SingleProjects extends Controller {
	public function postCategoryBackLink() {
	 global $post;
	 // we pull the first category of the project, possible for there to be more than one
	 $post_category = get_the_category($post->ID);

	 return '<a href="' . get_bloginfo('url') . '/' . $post_category[0]->slug . '">View all ' . $post_category[0]->name . '</a>';
	}

	public function acfSections(){
	 global $post;
	 return  get_fields($post->ID)['content'];
	}
 }
