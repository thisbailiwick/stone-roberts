<!doctype html>
<html @php language_attributes() @endphp>
	@include('partials.head')
	<body @php body_class() @endphp>
		<div class="fullscreen">
			<div class="fullscreen-wrapper">
				@php do_action('get_header') @endphp
				@include('partials.header')
				<div id="barba-wrapper"
						class="wrap container"
						role="document">
					<div class="content row barba-container"
							data-namespace="common">
						<main class="main">
							@yield('content')
						</main>
						@if (App\display_sidebar())
							<aside class="sidebar">
								@include('partials.sidebar')
							</aside>
						@endif
					</div>
				</div>
				@php do_action('get_footer') @endphp
				@include('partials.footer')
				@php wp_footer() @endphp
			</div>
		</div>
	</body>
</html>
