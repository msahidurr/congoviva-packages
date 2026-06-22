<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('event_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('visitor_id')->nullable();
            $table->string('ip_address');
            $table->text('user_agent')->nullable();
            $table->string('browser')->nullable();
            $table->string('platform')->nullable();
            $table->string('device')->nullable();
            $table->string('referer')->nullable();
            $table->timestamp('viewed_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_analytics');
    }
};