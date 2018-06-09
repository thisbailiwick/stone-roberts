@foreach($projects as $index => $project)
    @php
        $sections = ArtsyTheme\StoneRoberts\ACFPageComponents\get_sections($project, $project->acf_content[0]);
        echo $sections;
    @endphp
@endforeach

