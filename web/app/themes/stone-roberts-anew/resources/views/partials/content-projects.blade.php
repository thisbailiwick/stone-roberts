@foreach($projects as $index => $project)
    @php
        $sections = ArtsyTheme\StoneRoberts\ACFPageComponents\get_sections($project, $project->acf_content);
        echo $sections;
    @endphp
@endforeach

