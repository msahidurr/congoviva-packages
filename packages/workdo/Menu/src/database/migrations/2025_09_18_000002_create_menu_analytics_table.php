<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('menu_analytics')) {
            Schema::create('menu_analytics', function (Blueprint $table) {
                $table->id();
                $table->foreignId('menu_id')->constrained('menus')->onDelete('cascade');
                $table->foreignId('visitor_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('ip_address');
                $table->text('user_agent')->nullable();
                $table->string('referer')->nullable();
                $table->timestamp('viewed_at');
                $table->timestamps();

                $table->index(['menu_id', 'viewed_at']);
                $table->index(['menu_id', 'ip_address']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('menu_analytics');
    }
};