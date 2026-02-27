<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWebsiteKnowledgeTable extends Migration
{
    public function up()
    {
        Schema::create('website_knowledge', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('source_type');
            $table->string('source_id')->nullable();
            $table->string('title');
            $table->text('content');
            $table->text('summary')->nullable();
            $table->string('url')->nullable();
            $table->text('keywords')->nullable(); // Using text for simple array storage or json
            $table->text('metadata')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('source_updated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('website_knowledge');
    }
}
