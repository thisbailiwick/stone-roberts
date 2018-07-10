@extends('layouts.app')

@section('content')
 <?php xdebug_break(); ?>
 @include('partials.page-header')
 @php
	 $acf_content = get_fields($post->ID)['content'];
	 $sections = ArtsyTheme\StoneRoberts\ACFPageComponents\get_sections($post, $acf_content);
	 echo $sections;
 @endphp
@endsection
