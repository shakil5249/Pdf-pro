<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Settings Table
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // 2. PDF Tools Table
        Schema::create('pdf_tools', function (Blueprint $table) {
            $table->id();
            $table->string('tool_id')->unique();
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('usages_count')->default(0);
            $table->timestamps();
        });

        // 3. Blog Posts Table
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->timestamps();
        });

        // 4. Ad Spots Table
        Schema::create('ad_spots', function (Blueprint $table) {
            $table->id();
            $table->string('spot_key')->unique(); // e.g. header_ad, sidebar_ad
            $table->string('name');
            $table->longText('code')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // 5. Temporary File History Table
        Schema::create('file_histories', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('tool_id');
            $table->string('file_name');
            $table->bigInteger('file_size');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_histories');
        Schema::dropIfExists('ad_spots');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('pdf_tools');
        Schema::dropIfExists('settings');
    }
};
