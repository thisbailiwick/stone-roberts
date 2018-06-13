<?php $__currentLoopData = $projects; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $project): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php
        $sections = ArtsyTheme\StoneRoberts\ACFPageComponents\get_sections($project, $project->acf_content);
        echo $sections;
    ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

