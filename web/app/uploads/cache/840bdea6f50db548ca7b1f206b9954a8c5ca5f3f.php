<header class="banner">
	<div class="container">
		<div class="fullscreen-toggle"></div>
		<a class="brand hide-text"
				href="<?php echo e(home_url('/')); ?>"><span><?php echo e(get_bloginfo('name', 'display')); ?></span></a>
		<nav class="nav-primary">
			
				
			
			<?php
				echo ArtsyTheme\StoneRoberts\ACFPageComponents\get_custom_nav();
			?>
		</nav>
	</div>
</header>
