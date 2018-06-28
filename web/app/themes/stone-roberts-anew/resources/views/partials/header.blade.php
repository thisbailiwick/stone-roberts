<header class="banner">
	<div class="container">
		<div class="fullscreen-toggle"></div>
		<a class="brand hide-text"
				href="{{ home_url('/') }}"><span>{{ get_bloginfo('name', 'display') }}</span></a>
		<nav class="nav-primary">
			{{--@if (has_nav_menu('primary_navigation'))--}}
				{{--{!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']) !!}--}}
			{{--@endif--}}
			@php
				echo ArtsyTheme\StoneRoberts\ACFPageComponents\get_custom_nav();
			@endphp
		</nav>
	</div>
</header>
