<?php

namespace App\Services\Search;

class StopWordDictionary
{
    public static function getWords()
    {
        return [
            'apa',
            'apakah',
            'adalah',
            'ada',
            'akan',
            'atau',
            'dan',
            'di',
            'dari',
            'yang',
            'ke',
            'untuk',
            'pada',
            'oleh',
            'dengan',
            'ini',
            'itu',
            'tersebut',
            'dapat',
            'sudah',
            'telah',
            'juga',

            'kamu',
            'anda',
            'saya',
            'kami',
            'kita',
            'mereka',

            'nya',
            'mu',
            'ku',

            'bagaimana',
            'gimana',
            'siapa',
            'dimana',
            'di mana',
            'kapan',
            'mengapa',
            'kenapa',
            'berapa',
            'mana',

            'tentang',
            'mengenai',
            'jelaskan',
            'ceritakan',
            'tolong',
            'mohon',
            'dong',
            'ya',
            'nih',

            'kah',
            'bisa',
            'mau',
            'ingin',

            'langsung',
            'kesana',
            'sana',

            'dinas',
            'pusda',
            'dispuair',
            'pu',
            'sda',
            'jatim',
            'jawa',
            'timur'

        ];
    }
}