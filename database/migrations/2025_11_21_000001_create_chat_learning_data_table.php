<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChatLearningDataTable extends Migration
{
    public function up()
    {
        Schema::create('chat_learning_data', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('session_id')->index();
            $table->string('user_ip')->nullable();
            $table->text('conversation')->nullable(); // Changed to text for L5.8 compat
            $table->integer('message_count')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->boolean('is_processed')->default(false);
            $table->text('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('chat_learning_data');
    }
}
