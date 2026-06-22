<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $page['props']['auth']['lang'] ?? app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <base href="{{ \Illuminate\Support\Facades\Request::getBasePath() }}">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- clarity script start -->
         <!-- <script type="text/javascript">
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u7i33stgw6");
        </script>


        <script>

        // -----------------------------
        // WORKDO CROSS DOMAIN USER ID
        // -----------------------------

        function getCookie(name){
        let match=document.cookie.match(new RegExp('(^| )'+name+'=([^;]+)'));
        if(match) return decodeURIComponent(match[2]);
        }

        function setCookie(name,value,days){
        let date=new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        document.cookie=name+"="+encodeURIComponent(value)+"; expires="+date.toUTCString()+"; path=/; domain=.workdo.io";
        }

        function runClarityTracking(){

        if(typeof clarity !== "function") return;

        clarity("set","userID",userID);

        let host = window.location.hostname;
        let path = window.location.pathname.split("/")[1];

        // MAIN SITE
        if(host === "workdo.io"){
        clarity("set","site_type","WorkDo");
        }

        // DASH DEMO
        if(host === "dash-demo.workdo.io"){
        clarity("set","site_type","Dash-Demo");
        }

        // DEMO PRODUCTS
        if(host === "demo.workdo.io"){

        clarity("set","site_type","Other-Products");

        if(path){
        clarity("set","product_name",path);
        clarity("event","demo_viewed");
        }
        }
        }

        let userID=getCookie("workdo_user_id");

        if(!userID){
        userID="user-"+Date.now();
        setCookie("workdo_user_id",userID,365);
        }

        document.addEventListener("DOMContentLoaded",function(){

        // wait for clarity
        let clarityInterval = setInterval(function(){

        if(typeof clarity === "function"){
        clearInterval(clarityInterval);
        runClarityTracking();
        }

        },200);

        });
        </script> -->
        <!-- clarity script end -->
         
        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ getSetting('titleText', config('app.name', 'Laravel')) }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <script src="{{ asset('js/jquery.min.js') }}"></script>
        @routes
        @if (app()->environment('local') && file_exists(public_path('hot')))
            @viteReactRefresh
        @endif
        @vite(['resources/js/app.tsx'])
        <script>
            // Ensure base URL is correctly set for assets
            window.baseUrl = '{{ url('/') }}';
            window.APP_URL = '{{ config('app.url') }}';
            window.initialLocale = @json($page['props']['auth']['lang'] ?? 'en');
        </script>
        @inertiaHead
        <link rel="icon" href="data:,">
    </head>
    <body class="font-sans antialiased">
         {{-- @if(config('app.is_demo', false))
           @include('announcebar')
        @endif --}}
        @inertia
    </body>
</html>
