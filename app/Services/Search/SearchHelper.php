<?php

namespace App\Services\Search;

class SearchHelper
{


    public function prepareText($text, array $stopWords, array $synonymMap)
    {
        $normalized = $this->normalizeText($text);

        $tokens = $this->tokenize($normalized, $stopWords);

        $expandedTokens = $this->expandTokens($tokens, $synonymMap);

        return [
            'normalized' => $normalized,
            'tokens' => $tokens,
            'expanded_tokens' => $expandedTokens,
        ];
    }

    public function normalizeText($text)
    {
        $text = strtolower((string)$text);
        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    public function tokenize($text, array $stopWords)
    {
        if ($text === '') {
            return [];
        }

        $rawTokens = preg_split('/\s+/', $text);

        $tokens = [];

        foreach ($rawTokens as $token) {

            $token = $this->normalizeToken($token);

            if (
                strlen($token) < 2 ||
                in_array($token, $stopWords)
            ) {
                continue;
            }

            $tokens[] = $token;
        }

        return array_values(array_unique($tokens));
    }

    public function normalizeToken($token)
    {
        $token = trim($token);

        if (strlen($token) > 4 && substr($token, -3) === 'nya') {
            $token = substr($token, 0, -3);
        }

        if (strlen($token) > 5 && substr($token, -3) === 'kan') {
            $token = substr($token, 0, -3);
        }

        if (strlen($token) > 5 && substr($token, -1) === 'i') {
            $token = substr($token, 0, -1);
        }

        return $token;
    }

    public function expandTokens(array $tokens, array $synonymMap)
    {
        $expanded = [];

        foreach ($tokens as $token) {
            $expanded[] =
                $synonymMap[$token] ?? $token;
        }
        return array_values(array_unique($expanded));
    }

    public function calculateScore(array $query, array $candidate)
    {
      if ($candidate['normalized'] === '') {
        return 0;
      }

      if ($query['normalized'] === $candidate['normalized']) {
        return 1.0;
      }

      $phraseScore = $this->calculatePhraseScore(
        $query['normalized'],
        $candidate['normalized'],
        count($candidate['tokens'])
      );

      $tokenScore = $this->calculateTokenScore(
        $query['expanded_tokens'],
        $candidate['expanded_tokens']
      );

      $fuzzyScore = $this->calculateFuzzyScore(
        $query['tokens'],
        $candidate['tokens']
      );
      // Kombinasi seluruh sinyal
      $score =
        ($phraseScore * 0.30) +
        ($tokenScore * 0.50) +
        ($fuzzyScore * 0.20);

      return min(1.0, $score);
    }

    public function calculateTokenScore(array $queryTokens, array $candidateTokens)
    {
        if (empty($queryTokens) || empty($candidateTokens)) {
            return 0;
        }

        $intersection = array_intersect($queryTokens, $candidateTokens);
        $intersectionCount = count($intersection);

        if ($intersectionCount === 0) {
            return 0;
        }

        $dice = (2 * $intersectionCount) / (count($queryTokens) + count($candidateTokens));
        $queryCoverage = $intersectionCount / count($queryTokens);
        $candidateCoverage = $intersectionCount / count($candidateTokens);

        return ($dice * 0.40) + ($queryCoverage * 0.35) + ($candidateCoverage * 0.25);
    }

    private function calculateFuzzyScore(array $queryTokens, array $candidateTokens)
    {
        if (empty($queryTokens) || empty($candidateTokens)) {
            return 0;
        }

        $matches = 0;

        foreach ($candidateTokens as $candidateToken) {
            foreach ($queryTokens as $queryToken) {
                if ($this->isSimilarToken($queryToken, $candidateToken)) {
                    $matches++;
                    break;
                }
            }
        }

        return $matches / count($candidateTokens);
    }

    private function isSimilarToken($first, $second)
    {
        if ($first === $second) {
            return true;
        }

        $minLength = min(strlen($first), strlen($second));

        if ($minLength < 5) {
            return false;
        }

        $distance = levenshtein($first, $second);

        return $distance <= ($minLength >= 8 ? 2 : 1);
    }

    public function calculatePhraseScore(
      $queryText,
      $candidateText,
      $candidateTokenCount
    )
    {
      if ($queryText === $candidateText) {
        return 1.0;
      }

        if (strpos($queryText, $candidateText) !== false) {

          return ($candidateTokenCount <= 1)
            ? 0.65
            : 0.85;

        }

        if (strpos($candidateText, $queryText) !== false) {
          return 0.75;
        }

        return 0;
    }

}