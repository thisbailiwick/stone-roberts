{{--
  Template Name: Projects
--}}

@extends('layouts.app')

@section('content')
 <?php //xdebug_break(); ?>
	@include('partials.page-header')
	@include('partials.content-projects', ['projects' => $project_category_posts])
@endsection
