<!doctype html>
<html <?php language_attributes() ?>>
	<?php echo $__env->make('partials.head', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
	<body <?php body_class() ?>>
		<div class="fullscreen">
			<div class="fullscreen-wrapper">
				<?php do_action('get_header') ?>
				<?php echo $__env->make('partials.header', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
				<div id="barba-wrapper"
						class="wrap container"
						role="document">
					<div class="content row barba-container"
							data-namespace="common">
						<main class="main">
							<?php echo $__env->yieldContent('content'); ?>
						</main>
						<?php if(App\display_sidebar()): ?>
							<aside class="sidebar">
								<?php echo $__env->make('partials.sidebar', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
							</aside>
						<?php endif; ?>
					</div>
				</div>
				<?php do_action('get_footer') ?>
				<?php echo $__env->make('partials.footer', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
				<?php wp_footer() ?>
			</div>
		</div>
	</body>
</html>
