<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('menus')) {
            Schema::create('menus', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('menu_type')->default('cafe');
                $table->string('qr_code_path')->nullable();
                $table->boolean('is_active')->default(true);
                $table->json('config_sections')->nullable();
                $table->timestamps();
            });
         }
    }

    public function down()
    {
        Schema::dropIfExists('menus');
    }
};