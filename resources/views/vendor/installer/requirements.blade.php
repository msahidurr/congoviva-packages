@extends('vendor.installer.layouts.master')

@section('template_title')
    {{ trans('installer_messages.requirements.templateTitle') }}
@endsection

@section('title')
    <i class="fas fa-list-check mr-2"></i>
    {{ trans('installer_messages.requirements.title') }}
@endsection

@section('container')
    <!-- System Overview -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <i class="fas fa-info-circle mr-2"></i>
            System Requirements Overview
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div class="bg-white p-3 rounded border">
                <div class="font-medium text-gray-700">PHP Version</div>
                <div class="text-blue-600">8.2.0 or higher</div>
            </div>
            <div class="bg-white p-3 rounded border">
                <div class="font-medium text-gray-700">Memory Limit</div>
                <div class="text-blue-600">256MB or higher</div>
            </div>
            <div class="bg-white p-3 rounded border">
                <div class="font-medium text-gray-700">Upload Size</div>
                <div class="text-blue-600">32MB or higher</div>
            </div>
            <div class="bg-white p-3 rounded border">
                <div class="font-medium text-gray-700">Execution Time</div>
                <div class="text-blue-600">300 seconds</div>
            </div>
        </div>
    </div>

    <div class="space-y-6">
        @foreach($requirements['requirements'] as $type => $requirement)
            <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                        @if($type == 'php')
                            <i class="fab fa-php mr-2 text-blue-600"></i>
                        @elseif($type == 'php_optional')
                            <i class="fas fa-puzzle-piece mr-2 text-yellow-600"></i>
                        @elseif($type == 'database')
                            <i class="fas fa-database mr-2 text-green-600"></i>
                        @elseif($type == 'webserver')
                            <i class="fas fa-server mr-2 text-purple-600"></i>
                        @elseif($type == 'system')
                            <i class="fas fa-cogs mr-2 text-red-600"></i>
                        @else
                            <i class="fas fa-server mr-2 text-gray-600"></i>
                        @endif
                        
                        @if($type == 'php_optional')
                            PHP Optional Extensions
                        @elseif($type == 'webserver')
                            Web Server
                        @else
                            {{ ucfirst($type) }} Requirements
                        @endif
                        
                        @if($type == 'php')
                            <span class="ml-2 text-sm font-normal text-gray-600">
                                (version {{ $phpSupportInfo['minimum'] }} required)
                            </span>
                        @endif
                    </h3>
                    @if($type == 'php')
                        <div class="flex items-center">
                            <span class="text-lg font-semibold {{ $phpSupportInfo['supported'] ? 'text-green-600' : 'text-red-600' }} mr-2">
                                {{ $phpSupportInfo['current'] }}
                            </span>
                            <div class="w-8 h-8 rounded-full {{ $phpSupportInfo['supported'] ? 'bg-green-100' : 'bg-red-100' }} flex items-center justify-center">
                                <i class="fas fa-{{ $phpSupportInfo['supported'] ? 'check' : 'times' }} {{ $phpSupportInfo['supported'] ? 'text-green-600' : 'text-red-600' }}"></i>
                            </div>
                        </div>
                    @endif
                </div>
                
                @if(in_array($type, ['database', 'webserver', 'system']))
                    <!-- Information display for database, webserver, and system -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        @foreach($requirement as $item => $version)
                            <div class="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                                <span class="font-medium text-gray-700">{{ ucfirst($item) }}</span>
                                <span class="text-sm text-blue-600 font-medium">{{ $version }}</span>
                            </div>
                        @endforeach
                    </div>
                @else
                    <!-- Extension checking for php and php_optional -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        @foreach($requirement as $extension => $enabled)
                            @php
                                $isOptional = $type == 'php_optional';
                                $statusColor = $enabled ? 'green' : ($isOptional ? 'yellow' : 'red');
                                $borderColor = $enabled ? 'border-green-200' : ($isOptional ? 'border-yellow-200' : 'border-red-200');
                                $iconClass = $enabled ? 'check' : ($isOptional ? 'exclamation-triangle' : 'times');
                            @endphp
                            <div class="flex items-center justify-between p-3 bg-white rounded border {{ $borderColor }}">
                                <span class="font-medium text-gray-700">
                                    {{ is_numeric($extension) ? $enabled : $extension }}
                                    @if($isOptional && !$enabled)
                                        <span class="text-xs text-yellow-600">(optional)</span>
                                    @endif
                                </span>
                                <div class="w-6 h-6 rounded-full bg-{{ $statusColor }}-100 flex items-center justify-center">
                                    <i class="fas fa-{{ $iconClass }} text-sm text-{{ $statusColor }}-600"></i>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        @endforeach
    </div>

    @if ( ! isset($requirements['errors']) && $phpSupportInfo['supported'] )
        <div class="text-center mt-8">
            <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center justify-center">
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>
                    <span class="text-green-800 font-medium">All requirements are satisfied!</span>
                </div>
            </div>
            <a href="{{ route('LaravelInstaller::permissions') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                {{ trans('installer_messages.requirements.next') }}
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    @else
        <div class="text-center mt-8">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Please fix the requirements above before continuing.</span>
                </div>
            </div>
        </div>
    @endif
@endsection