<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

// Halaman utama chat
Route::get('/', 'ChatController@index')->name('chat.index');

// API endpoints untuk chat
Route::post('/chat/send', 'ChatController@sendMessage')->name('chat.send');
Route::get('/chat/history', 'ChatController@getHistory')->name('chat.history');
Route::post('/chat/clear', 'ChatController@clearHistory')->name('chat.clear');
Route::post('/chat/minimize', 'ChatController@minimizeChat')->name('chat.minimize');
