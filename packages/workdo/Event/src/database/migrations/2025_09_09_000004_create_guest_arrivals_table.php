<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('guest_arrivals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('table_number');
            $table->string('seat_number')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->unsignedBigInteger('checked_in_by')->nullable();
            $table->timestamps();
            
            // Composite unique index to ensure one arrival record per guest per event
            $table->unique(['event_id', 'first_name', 'last_name', 'table_number']);
            
            // Index for fast lookups
            $table->index(['event_id', 'arrived_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('guest_arrivals');
    }
};
