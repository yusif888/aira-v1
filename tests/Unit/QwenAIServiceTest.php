<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\QwenAIService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Exception\ConnectException;

class QwenAIServiceTest extends TestCase
{
    public function test_system_prompt_builder_includes_dinas_rules_and_context()
    {
        $service = new QwenAIService();

        $chunks = [
            [
                'title' => 'Profil Dinas PU SDA Jatim',
                'content' => 'Dinas PU SDA mengelola 76 daerah irigasi kewenangan provinsi.',
            ]
        ];

        $prompt = $service->buildSystemPrompt($chunks);

        $this->assertStringContainsString('AIRA', $prompt);
        $this->assertStringContainsString('Dinas Pekerjaan Umum Sumber Daya Air', $prompt);
        $this->assertStringContainsString('Profil Dinas PU SDA Jatim', $prompt);
        $this->assertStringContainsString('RAG CONTEXT', $prompt);
    }

    public function test_mock_response_mode_returns_intelligible_reply()
    {
        // Override env/config simulation by passing a mock client
        $mock = new MockHandler([]);
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $service = new QwenAIService($client);

        // Reflection to force mock = true
        $ref = new \ReflectionClass($service);
        $propMock = $ref->getProperty('mock');
        $propMock->setAccessible(true);
        $propMock->setValue($service, true);

        $reply = $service->generateResponse('Bagaimana cara mengajukan izin pemanfaatan air?');

        $this->assertNotEmpty($reply);
        $this->assertStringContainsString('izin', strtolower($reply));
    }

    public function test_client_handles_successful_vllm_response()
    {
        $vllmResponsePayload = json_encode([
            'id' => 'chatcmpl-test-123',
            'object' => 'chat.completion',
            'created' => 1730188000,
            'model' => 'Qwen/Qwen2.5-7B-Instruct',
            'choices' => [
                [
                    'index' => 0,
                    'message' => [
                        'role' => 'assistant',
                        'content' => 'Dinas PU SDA Jatim berkantor di Gayung Kebonsari Surabaya.'
                    ],
                    'finish_reason' => 'stop'
                ]
            ],
            'usage' => [
                'prompt_tokens' => 25,
                'completion_tokens' => 15,
                'total_tokens' => 40
            ]
        ]);

        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'application/json'], $vllmResponsePayload),
        ]);

        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $service = new QwenAIService($client);

        // Ensure mock = false
        $ref = new \ReflectionClass($service);
        $propMock = $ref->getProperty('mock');
        $propMock->setAccessible(true);
        $propMock->setValue($service, false);

        $reply = $service->generateResponse('Di mana kantor dinas?');

        $this->assertEquals('Dinas PU SDA Jatim berkantor di Gayung Kebonsari Surabaya.', $reply);
    }

    public function test_client_handles_unreachable_server_gracefully()
    {
        $mock = new MockHandler([
            new ConnectException('Failed to connect to localhost:8000', new Request('POST', 'test')),
        ]);

        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $service = new QwenAIService($client);

        $ref = new \ReflectionClass($service);
        $propMock = $ref->getProperty('mock');
        $propMock->setAccessible(true);
        $propMock->setValue($service, false);

        // When vLLM server is completely down, it must return null gracefully (zero fatal crashes)
        $reply = $service->generateResponse('Halo');

        $this->assertNull($reply);
    }
}
