<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Table for News Categories
        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Table for News Tags
        Schema::create('news_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 3. Main table for News Articles (Now with more features)
        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_category_id')->constrained('news_categories')->onDelete('cascade');
            $table->foreignId('user_id')->comment('The author of the article')->constrained('users')->onDelete('cascade');

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->comment('A short summary of the article');
            $table->longText('content');
            $table->string('featured_image_path')->nullable()->comment('Main cover image for the article');

            $table->enum('status', ['draft', 'published', 'archived', 'deleted'])->default('draft');
            $table->timestamp('published_at')->nullable();

            // --- NEW & IMPROVED COLUMNS ---
            $table->boolean('is_featured')->default(false)->comment('To pin an article to the top');
            $table->unsignedBigInteger('view_count')->default(0)->comment('To track article popularity');

            // SEO Optimization
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();

            $table->timestamps();
            $table->softDeletes()->comment('For safe deletion, article can be restored'); // NEW: Soft Deletes
        });

        // 4. Pivot table for Articles and Tags
        Schema::create('news_article_tag', function (Blueprint $table) {
            $table->foreignId('news_article_id')->constrained('news_articles')->onDelete('cascade');
            $table->foreignId('news_tag_id')->constrained('news_tags')->onDelete('cascade');
            $table->primary(['news_article_id', 'news_tag_id']);
        });

        // 5. NEW: Table for Image Galleries within an article
        Schema::create('news_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_article_id')->constrained('news_articles')->onDelete('cascade');
            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->integer('order_column')->default(0);
            $table->timestamps();
        });

        // 6. NEW: Table for File Attachments (e.g., PDF, DOCX)
        Schema::create('news_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_article_id')->constrained('news_articles')->onDelete('cascade');
            $table->string('display_name');
            $table->string('file_path');
            $table->string('file_type', 50)->nullable();
            $table->unsignedInteger('file_size')->nullable()->comment('File size in kilobytes');
            $table->timestamps();
        });

        // 7. NEW: Table for Comments
        Schema::create('news_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_article_id')->constrained('news_articles')->onDelete('cascade');

            // For nested comments (replies)
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('news_comments')->onDelete('cascade');

            // Commenter Info (can be a guest or a logged-in user)
            $table->string('commenter_name');
            $table->string('commenter_email');
            $table->foreignId('user_id')->nullable()->comment('Link to users table if commenter is logged in')->constrained('users')->onDelete('set null');

            $table->text('content');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->comment('For moderation');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop tables in the reverse order of creation
        Schema::dropIfExists('news_comments');
        Schema::dropIfExists('news_attachments');
        Schema::dropIfExists('news_images');
        Schema::dropIfExists('news_article_tag');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('news_tags');
        Schema::dropIfExists('news_categories');
    }
};
