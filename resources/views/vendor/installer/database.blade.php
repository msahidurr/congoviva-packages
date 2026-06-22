@extends('vendor.installer.layouts.master')

@section('template_title')
    Database Setup
@endsection

@section('title')
    <i class="fas fa-database mr-2"></i>
    Database Setup
@endsection

@section('container')
    <div class="text-center">
        <div id="migration-progress" class="mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-database text-2xl text-green-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Setting up your database...</h3>
            <p class="text-gray-600 mb-4">Please wait while we migrate your database tables and seed initial data.</p>
            
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div id="progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            
            <div id="status-text" class="text-sm text-gray-600">Initializing...</div>
        </div>

        <div id="migration-success" class="hidden">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-2xl text-green-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Database setup completed!</h3>
            <a href="{{ route('LaravelInstaller::final') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                Continue to Final Step
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>

        <div id="migration-error" class="hidden">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-times text-2xl text-red-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Database setup failed</h3>
            <div id="error-message" class="text-red-600 mb-4"></div>
            <button onclick="startMigration()" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                <i class="fas fa-redo mr-2"></i>
                Retry
            </button>
        </div>
    </div>

    <script>
        function updateProgress(percent, text) {
            document.getElementById('progress-bar').style.width = percent + '%';
            document.getElementById('status-text').textContent = text;
        }

        function showSuccess() {
            document.getElementById('migration-progress').classList.add('hidden');
            document.getElementById('migration-success').classList.remove('hidden');
        }

        function showError(message) {
            document.getElementById('migration-progress').classList.add('hidden');
            document.getElementById('migration-error').classList.remove('hidden');
            document.getElementById('error-message').textContent = message;
        }

        function startMigration() {
            document.getElementById('migration-error').classList.add('hidden');
            document.getElementById('migration-progress').classList.remove('hidden');
            
            updateProgress(10, 'Starting migration...');
            
            fetch('{{ route("LaravelInstaller::runMigration") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateProgress(100, 'Migration completed successfully!');
                    setTimeout(showSuccess, 1000);
                } else {
                    showError(data.message || 'Migration failed');
                }
            })
            .catch(error => {
                showError('Network error: ' + error.message);
            });
        }

        // Auto-start migration when page loads
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(startMigration, 1000);
        });
    </script>
@endsection