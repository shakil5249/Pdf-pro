<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\InstallController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Access public landing pages, dynamic tools SaaS, and admin CMS workspace.
|
*/

// Dynamic CMS installation setup
Route::get('/install', [InstallController::class, 'index'])->name('install.index');
Route::post('/install', [InstallController::class, 'install'])->name('install.process');

// Public Frontend pages and layouts
Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::get('/blog', [FrontendController::class, 'blogList'])->name('blog.index');
Route::get('/blog/{slug}', [FrontendController::class, 'blogDetail'])->name('blog.show');
Route::get('/page/{slug}', [FrontendController::class, 'showPage'])->name('page.show');
Route::post('/feedback/submit', [FrontendController::class, 'submitFeedback'])->name('feedback.submit');

// PDF tools ajax engines (Process local API uploads & simulations)
Route::prefix('api/pdf')->group(function () {
    Route::post('/merge', [PDFController::class, 'mergePDF'])->name('pdf.merge');
    Route::post('/split', [PDFController::class, 'splitPDF'])->name('pdf.split');
    Route::post('/watermark', [PDFController::class, 'watermarkPDF'])->name('pdf.watermark');
    Route::post('/ai-translate', [PDFController::class, 'aiTranslatePDF'])->name('pdf.translate');
});

// Admin portal authentication routes
Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login.submit');
Route::any('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// Admin panel dashboard & dynamic settings CRUD routes
Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/settings/update', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
    
    // Tools management
    Route::post('/tools/{id}/toggle', [AdminController::class, 'toggleTool'])->name('admin.tools.toggle');
    Route::post('/tools/{id}/update', [AdminController::class, 'updateToolDetails'])->name('admin.tools.update');
    
    // Blogs CRUD
    Route::post('/blogs/save/{id?}', [AdminController::class, 'saveBlogPost'])->name('admin.blogs.save');
    Route::post('/blogs/delete/{id}', [AdminController::class, 'deleteBlogPost'])->name('admin.blogs.delete');
    
    // Custom Pages CRUD
    Route::post('/pages/save/{id?}', [AdminController::class, 'saveCustomPage'])->name('admin.pages.save');
    Route::post('/pages/delete/{id}', [AdminController::class, 'deleteCustomPage'])->name('admin.pages.delete');
    
    // FAQs CRUD
    Route::post('/faqs/save/{id?}', [AdminController::class, 'saveFaq'])->name('admin.faqs.save');
    Route::post('/faqs/delete/{id}', [AdminController::class, 'deleteFaq'])->name('admin.faqs.delete');
    
    // Menus CRUD
    Route::post('/menus/save/{menuType}', [AdminController::class, 'saveMenu'])->name('admin.menus.save');
    
    // Dynamic Ads setup
    Route::post('/ads/save/{id}', [AdminController::class, 'saveAd'])->name('admin.ads.save');
});

// Catch-all fallback route at root level for PDF Tools (Matches: /merge-pdf, /compress-pdf, etc.)
Route::get('/{id}', [FrontendController::class, 'showTool'])->name('tool.show');
