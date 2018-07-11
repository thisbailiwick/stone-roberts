@extends('layouts.app')

@section('content')
 @include('partials.page-header')
 @php echo ArtsyTheme\StoneRoberts\ACFPageComponents\get_sections($post, $acf_sections); @endphp
 {!! $post_category_back_link !!}
@endsection
