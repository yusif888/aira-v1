<?php

namespace App\Services;

class SearchResult
{
    /**
     * Tingkat kecocokan (0.0 - 1.0)
     *
     * @var float
     */
    public $score;

    /**
     * Nama source
     * Contoh:
     * kamus
     * website
     * irigasi
     * pdf
     *
     * @var string
     */
    public $source;

    /**
     * Jawaban yang akan diberikan ke user
     *
     * @var string|null
     */
    public $answer;

    /**
     * Informasi tambahan
     *
     * @var array
     */
    public $sourceInfo;

    /**
     * Constructor
     *
     * @param float $score
     * @param string $source
     * @param string|null $answer
     * @param array $sourceInfo
     */
    public function __construct(
        $score = 0.0,
        $source = '',
        $answer = null,
        array $sourceInfo = []
    ) {
        $this->score = (float) $score;
        $this->source = $source;
        $this->answer = $answer;
        $this->sourceInfo = $sourceInfo;
    }

    /**
     * Apakah source berhasil menemukan jawaban
     *
     * @return bool
     */
    public function found()
    {
        return !empty($this->answer);
    }

    /**
     * Convert ke array
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'score' => $this->score,
            'source' => $this->source,
            'answer' => $this->answer,
            'source_info' => $this->sourceInfo,
        ];
    }

    /**
     * Factory untuk hasil kosong
     *
     * @return SearchResult
     */
    public static function empty()
    {
        return new self();
    }

    /**
     * Factory untuk hasil sukses
     *
     * @param float $score
     * @param string $source
     * @param string $answer
     * @param array $sourceInfo
     * @return SearchResult
     */
    public static function success(
        $score,
        $source,
        $answer,
        array $sourceInfo = []
    ) {
        return new self(
            $score,
            $source,
            $answer,
            $sourceInfo
        );
    }
}