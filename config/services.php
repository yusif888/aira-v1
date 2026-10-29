<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Qwen 2.5 AI Inference (Self-Hosted vLLM Server)
    |--------------------------------------------------------------------------
    */
    'qwen' => [
        'url' => env('QWEN_API_URL', env('VLLM_API_URL', 'http://127.0.0.1:8000/v1/chat/completions')),
        'model' => env('QWEN_MODEL', 'Qwen/Qwen2.5-7B-Instruct'),
        'api_key' => env('QWEN_API_KEY', 'none'),
        'timeout' => env('QWEN_TIMEOUT', 30),
        'enabled' => env('QWEN_ENABLED', true),
        'mock' => env('QWEN_MOCK', false),
        'temperature' => env('QWEN_TEMPERATURE', 0.3),
        'max_tokens' => env('QWEN_MAX_TOKENS', 800),
    ],

];
