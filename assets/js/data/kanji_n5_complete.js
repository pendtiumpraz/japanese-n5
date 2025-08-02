/**
 * Complete Kanji N5 dataset - 100 kanji required for JLPT N5
 * Each entry includes: kanji, onyomi, kunyomi, meaning, examples, and stroke function
 * Stroke functions provide simplified guides for StrokeTrainer
 */

// Helper function to create placeholder strokes
function createPlaceholderStrokes(strokes = 4) {
  return function(w=320, h=320) {
    const result = [];
    const spacing = h / (strokes + 1);
    for (let i = 1; i <= strokes; i++) {
      result.push([
        {x: w * 0.2, y: spacing * i},
        {x: w * 0.8, y: spacing * i}
      ]);
    }
    return result;
  };
}

export const KanjiN5Complete = [
  // === NUMBERS (数字) ===
  {
    kanji: '一',
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと'],
    meaning: 'satu',
    examples: [
      { jp: '一人', romaji: 'hitori', meaning: 'satu orang' },
      { jp: '一つ', romaji: 'hitotsu', meaning: 'satu buah' }
    ],
    strokes: function(w=320,h=320){
      return [ [{x:w*0.1,y:h*0.5},{x:w*0.9,y:h*0.5}] ];
    }
  },
  {
    kanji: '二',
    onyomi: ['ニ', 'ジ'],
    kunyomi: ['ふた'],
    meaning: 'dua',
    examples: [
      { jp: '二人', romaji: 'futari', meaning: 'dua orang' },
      { jp: '二月', romaji: 'nigatsu', meaning: 'Februari' }
    ],
    strokes: function(w=320,h=320){
      return [
        [{x:w*0.15,y:h*0.35},{x:w*0.85,y:h*0.35}],
        [{x:w*0.15,y:h*0.65},{x:w*0.85,y:h*0.65}]
      ];
    }
  },
  {
    kanji: '三',
    onyomi: ['サン', 'ゾウ'],
    kunyomi: ['み', 'みっ'],
    meaning: 'tiga',
    examples: [
      { jp: '三人', romaji: 'sannin', meaning: 'tiga orang' },
      { jp: '三月', romaji: 'sangatsu', meaning: 'Maret' }
    ],
    strokes: function(w=320,h=320){
      return [
        [{x:w*0.15,y:h*0.25},{x:w*0.85,y:h*0.25}],
        [{x:w*0.15,y:h*0.5},{x:w*0.85,y:h*0.5}],
        [{x:w*0.15,y:h*0.75},{x:w*0.85,y:h*0.75}]
      ];
    }
  },
  {
    kanji: '四',
    onyomi: ['シ'],
    kunyomi: ['よ', 'よん'],
    meaning: 'empat',
    examples: [
      { jp: '四人', romaji: 'yonin', meaning: 'empat orang' },
      { jp: '四月', romaji: 'shigatsu', meaning: 'April' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [{x:w*0.2,y:h*0.2},{x:w*0.8,y:h*0.2},{x:w*0.8,y:h*0.8},{x:w*0.2,y:h*0.8},{x:w*0.2,y:h*0.2}];
      const s2 = [{x:w*0.3,y:h*0.4},{x:w*0.7,y:h*0.4}];
      const s3 = [{x:w*0.3,y:h*0.6},{x:w*0.7,y:h*0.6}];
      return [s1,s2,s3];
    }
  },
  {
    kanji: '五',
    onyomi: ['ゴ'],
    kunyomi: ['いつ'],
    meaning: 'lima',
    examples: [
      { jp: '五人', romaji: 'gonin', meaning: 'lima orang' },
      { jp: '五月', romaji: 'gogatsu', meaning: 'Mei' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [{x:w*0.2,y:h*0.25},{x:w*0.8,y:h*0.25}];
      const s2 = [{x:w*0.3,y:h*0.35},{x:w*0.7,y:h*0.35}];
      const s3 = [{x:w*0.25,y:h*0.45},{x:w*0.75,y:h*0.45}];
      const s4 = [{x:w*0.2,y:h*0.6},{x:w*0.8,y:h*0.6}];
      const s5 = [{x:w*0.35,y:h*0.7},{x:w*0.65,y:h*0.7}];
      return [s1,s2,s3,s4,s5];
    }
  },
  {
    kanji: '六',
    onyomi: ['ロク', 'リク'],
    kunyomi: ['む', 'むっ'],
    meaning: 'enam',
    examples: [
      { jp: '六人', romaji: 'rokunin', meaning: 'enam orang' },
      { jp: '六月', romaji: 'rokugatsu', meaning: 'Juni' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '七',
    onyomi: ['シチ'],
    kunyomi: ['なな', 'なの'],
    meaning: 'tujuh',
    examples: [
      { jp: '七人', romaji: 'nananin/shichinin', meaning: 'tujuh orang' },
      { jp: '七月', romaji: 'shichigatsu', meaning: 'Juli' }
    ],
    strokes: createPlaceholderStrokes(2)
  },
  {
    kanji: '八',
    onyomi: ['ハチ', 'ハツ'],
    kunyomi: ['や', 'やっ'],
    meaning: 'delapan',
    examples: [
      { jp: '八人', romaji: 'hachinin', meaning: 'delapan orang' },
      { jp: '八月', romaji: 'hachigatsu', meaning: 'Agustus' }
    ],
    strokes: function(w=320,h=320){
      return [
        [{x:w*0.5,y:h*0.2},{x:w*0.3,y:h*0.8}],
        [{x:w*0.5,y:h*0.2},{x:w*0.7,y:h*0.8}]
      ];
    }
  },
  {
    kanji: '九',
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの'],
    meaning: 'sembilan',
    examples: [
      { jp: '九人', romaji: 'kyuunin', meaning: 'sembilan orang' },
      { jp: '九月', romaji: 'kugatsu', meaning: 'September' }
    ],
    strokes: createPlaceholderStrokes(2)
  },
  {
    kanji: '十',
    onyomi: ['ジュウ', 'ジッ'],
    kunyomi: ['とお'],
    meaning: 'sepuluh',
    examples: [
      { jp: '十人', romaji: 'juunin', meaning: 'sepuluh orang' },
      { jp: '十月', romaji: 'juugatsu', meaning: 'Oktober' }
    ],
    strokes: function(w=320,h=320){
      return [
        [{x:w*0.5,y:h*0.2},{x:w*0.5,y:h*0.8}],
        [{x:w*0.2,y:h*0.5},{x:w*0.8,y:h*0.5}]
      ];
    }
  },
  {
    kanji: '百',
    onyomi: ['ヒャク'],
    kunyomi: ['もも'],
    meaning: 'seratus',
    examples: [
      { jp: '百円', romaji: 'hyakuen', meaning: 'seratus yen' },
      { jp: '三百', romaji: 'sanbyaku', meaning: 'tiga ratus' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '千',
    onyomi: ['セン', 'ゼン'],
    kunyomi: ['ち'],
    meaning: 'seribu',
    examples: [
      { jp: '千円', romaji: 'senen', meaning: 'seribu yen' },
      { jp: '三千', romaji: 'sanzen', meaning: 'tiga ribu' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '万',
    onyomi: ['マン', 'バン'],
    kunyomi: [],
    meaning: 'sepuluh ribu',
    examples: [
      { jp: '一万', romaji: 'ichiman', meaning: 'sepuluh ribu' },
      { jp: '万円', romaji: 'manen', meaning: 'sepuluh ribu yen' }
    ],
    strokes: createPlaceholderStrokes(3)
  },

  // === TIME & CALENDAR (時間・暦) ===
  {
    kanji: '日',
    onyomi: ['ニチ','ジツ'],
    kunyomi: ['ひ','か'],
    meaning: 'matahari; hari',
    examples: [
      { jp: '日本', romaji: 'nihon', meaning: 'Jepang' },
      { jp: '毎日', romaji: 'mainichi', meaning: 'setiap hari' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [{x:w*0.2,y:h*0.2},{x:w*0.8,y:h*0.2}];
      const s2 = [{x:w*0.2,y:h*0.8},{x:w*0.8,y:h*0.8}];
      const s3 = [{x:w*0.2,y:h*0.2},{x:w*0.2,y:h*0.8}];
      const s4 = [{x:w*0.8,y:h*0.2},{x:w*0.8,y:h*0.8}];
      const s5 = [{x:w*0.25,y:h*0.5},{x:w*0.75,y:h*0.5}];
      return [s1,s2,s3,s4,s5];
    }
  },
  {
    kanji: '月',
    onyomi: ['ゲツ','ガツ'],
    kunyomi: ['つき'],
    meaning: 'bulan; bulan (kalender)',
    examples: [
      { jp: '月曜日', romaji: 'getsuyoubi', meaning: 'Senin' },
      { jp: '一月', romaji: 'ichigatsu', meaning: 'Januari' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [{x:w*0.3,y:h*0.2},{x:w*0.3,y:h*0.8}];
      const s2 = [{x:w*0.3,y:h*0.2},{x:w*0.7,y:h*0.2},{x:w*0.7,y:h*0.5},{x:w*0.3,y:h*0.5}];
      const s3 = [{x:w*0.3,y:h*0.5},{x:w*0.65,y:h*0.5},{x:w*0.65,y:h*0.8},{x:w*0.3,y:h*0.8}];
      return [s1,s2,s3];
    }
  },
  {
    kanji: '火',
    onyomi: ['カ'],
    kunyomi: ['ひ'],
    meaning: 'api',
    examples: [
      { jp: '火曜日', romaji: 'kayoubi', meaning: 'Selasa' },
      { jp: '火事', romaji: 'kaji', meaning: 'kebakaran' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '水',
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    meaning: 'air',
    examples: [
      { jp: '水曜日', romaji: 'suiyoubi', meaning: 'Rabu' },
      { jp: '水道', romaji: 'suidou', meaning: 'keran air' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '木',
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ'],
    meaning: 'pohon',
    examples: [
      { jp: '木曜日', romaji: 'mokuyoubi', meaning: 'Kamis' },
      { jp: '木材', romaji: 'mokuzai', meaning: 'kayu' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '金',
    onyomi: ['キン', 'コン'],
    kunyomi: ['かね'],
    meaning: 'emas; uang',
    examples: [
      { jp: '金曜日', romaji: 'kinyoubi', meaning: 'Jumat' },
      { jp: 'お金', romaji: 'okane', meaning: 'uang' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '土',
    onyomi: ['ド', 'ト'],
    kunyomi: ['つち'],
    meaning: 'tanah',
    examples: [
      { jp: '土曜日', romaji: 'doyoubi', meaning: 'Sabtu' },
      { jp: '土地', romaji: 'tochi', meaning: 'lahan' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '曜',
    onyomi: ['ヨウ'],
    kunyomi: [],
    meaning: 'hari (dalam seminggu)',
    examples: [
      { jp: '曜日', romaji: 'youbi', meaning: 'hari (dalam seminggu)' },
      { jp: '何曜日', romaji: 'nanyoubi', meaning: 'hari apa' }
    ],
    strokes: createPlaceholderStrokes(18)
  },
  {
    kanji: '年',
    onyomi: ['ネン'],
    kunyomi: ['とし'],
    meaning: 'tahun',
    examples: [
      { jp: '今年', romaji: 'kotoshi', meaning: 'tahun ini' },
      { jp: '来年', romaji: 'rainen', meaning: 'tahun depan' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '時',
    onyomi: ['ジ'],
    kunyomi: ['とき'],
    meaning: 'waktu; jam',
    examples: [
      { jp: '時間', romaji: 'jikan', meaning: 'waktu' },
      { jp: '三時', romaji: 'sanji', meaning: 'jam tiga' }
    ],
    strokes: createPlaceholderStrokes(10)
  },
  {
    kanji: '間',
    onyomi: ['カン', 'ケン'],
    kunyomi: ['あいだ', 'ま'],
    meaning: 'jarak; antara',
    examples: [
      { jp: '時間', romaji: 'jikan', meaning: 'waktu' },
      { jp: '一週間', romaji: 'isshuukan', meaning: 'satu minggu' }
    ],
    strokes: createPlaceholderStrokes(12)
  },
  {
    kanji: '分',
    onyomi: ['ブン', 'フン', 'ブ'],
    kunyomi: ['わ'],
    meaning: 'menit; bagian',
    examples: [
      { jp: '五分', romaji: 'gofun', meaning: 'lima menit' },
      { jp: '半分', romaji: 'hanbun', meaning: 'setengah' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '半',
    onyomi: ['ハン'],
    kunyomi: ['なか'],
    meaning: 'setengah',
    examples: [
      { jp: '半分', romaji: 'hanbun', meaning: 'setengah' },
      { jp: '一時半', romaji: 'ichijihan', meaning: 'jam setengah dua' }
    ],
    strokes: createPlaceholderStrokes(5)
  },

  // === PEOPLE & BODY (人・体) ===
  {
    kanji: '人',
    onyomi: ['ジン','ニン'],
    kunyomi: ['ひと'],
    meaning: 'orang',
    examples: [
      { jp: '日本人', romaji: 'nihonjin', meaning: 'orang Jepang' },
      { jp: '三人', romaji: 'sannin', meaning: 'tiga orang' }
    ],
    strokes: function(w=320,h=320){
      return [
        [{x:w*0.5,y:h*0.2},{x:w*0.25,y:h*0.8}],
        [{x:w*0.5,y:h*0.35},{x:w*0.75,y:h*0.8}]
      ];
    }
  },
  {
    kanji: '男',
    onyomi: ['ダン', 'ナン'],
    kunyomi: ['おとこ'],
    meaning: 'laki-laki',
    examples: [
      { jp: '男の子', romaji: 'otoko no ko', meaning: 'anak laki-laki' },
      { jp: '男性', romaji: 'dansei', meaning: 'pria' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '女',
    onyomi: ['ジョ', 'ニョ', 'ニョウ'],
    kunyomi: ['おんな', 'め'],
    meaning: 'perempuan',
    examples: [
      { jp: '女の子', romaji: 'onna no ko', meaning: 'anak perempuan' },
      { jp: '女性', romaji: 'josei', meaning: 'wanita' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '子',
    onyomi: ['シ', 'ス'],
    kunyomi: ['こ'],
    meaning: 'anak',
    examples: [
      { jp: '子供', romaji: 'kodomo', meaning: 'anak' },
      { jp: '男の子', romaji: 'otoko no ko', meaning: 'anak laki-laki' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '目',
    onyomi: ['モク', 'ボク'],
    kunyomi: ['め', 'ま'],
    meaning: 'mata',
    examples: [
      { jp: '目薬', romaji: 'megusuri', meaning: 'obat tetes mata' },
      { jp: '一目', romaji: 'hitome', meaning: 'sekilas' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '耳',
    onyomi: ['ジ', 'ニ'],
    kunyomi: ['みみ'],
    meaning: 'telinga',
    examples: [
      { jp: '耳鼻科', romaji: 'jibika', meaning: 'THT' },
      { jp: '耳が痛い', romaji: 'mimi ga itai', meaning: 'telinga sakit' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '口',
    onyomi: ['コウ', 'ク'],
    kunyomi: ['くち'],
    meaning: 'mulut',
    examples: [
      { jp: '入口', romaji: 'iriguchi', meaning: 'pintu masuk' },
      { jp: '出口', romaji: 'deguchi', meaning: 'pintu keluar' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '手',
    onyomi: ['シュ', 'ズ'],
    kunyomi: ['て', 'た'],
    meaning: 'tangan',
    examples: [
      { jp: '手紙', romaji: 'tegami', meaning: 'surat' },
      { jp: '握手', romaji: 'akushu', meaning: 'jabat tangan' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '足',
    onyomi: ['ソク'],
    kunyomi: ['あし', 'た'],
    meaning: 'kaki',
    examples: [
      { jp: '足首', romaji: 'ashikubi', meaning: 'pergelangan kaki' },
      { jp: '満足', romaji: 'manzoku', meaning: 'puas' }
    ],
    strokes: createPlaceholderStrokes(7)
  },

  // === NATURE & DIRECTIONS (自然・方向) ===
  {
    kanji: '山',
    onyomi: ['サン', 'セン'],
    kunyomi: ['やま'],
    meaning: 'gunung',
    examples: [
      { jp: '富士山', romaji: 'fujisan', meaning: 'Gunung Fuji' },
      { jp: '山道', romaji: 'yamamichi', meaning: 'jalan gunung' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '川',
    onyomi: ['セン'],
    kunyomi: ['かわ'],
    meaning: 'sungai',
    examples: [
      { jp: '川岸', romaji: 'kawagishi', meaning: 'tepi sungai' },
      { jp: '河川', romaji: 'kasen', meaning: 'sungai' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '田',
    onyomi: ['デン'],
    kunyomi: ['た'],
    meaning: 'sawah',
    examples: [
      { jp: '田んぼ', romaji: 'tanbo', meaning: 'sawah' },
      { jp: '田中', romaji: 'tanaka', meaning: 'Tanaka (nama)' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '空',
    onyomi: ['クウ'],
    kunyomi: ['そら', 'あ', 'から'],
    meaning: 'langit; kosong',
    examples: [
      { jp: '空港', romaji: 'kuukou', meaning: 'bandara' },
      { jp: '青空', romaji: 'aozora', meaning: 'langit biru' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '雨',
    onyomi: ['ウ'],
    kunyomi: ['あめ', 'あま'],
    meaning: 'hujan',
    examples: [
      { jp: '雨天', romaji: 'uten', meaning: 'cuaca hujan' },
      { jp: '大雨', romaji: 'ooame', meaning: 'hujan lebat' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '天',
    onyomi: ['テン'],
    kunyomi: ['あま', 'あめ'],
    meaning: 'langit; surga',
    examples: [
      { jp: '天気', romaji: 'tenki', meaning: 'cuaca' },
      { jp: '天国', romaji: 'tengoku', meaning: 'surga' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '気',
    onyomi: ['キ', 'ケ'],
    kunyomi: [],
    meaning: 'udara; perasaan',
    examples: [
      { jp: '天気', romaji: 'tenki', meaning: 'cuaca' },
      { jp: '元気', romaji: 'genki', meaning: 'sehat' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '上',
    onyomi: ['ジョウ', 'ショウ'],
    kunyomi: ['うえ', 'あ', 'のぼ'],
    meaning: 'atas',
    examples: [
      { jp: '上手', romaji: 'jouzu', meaning: 'pandai' },
      { jp: '机の上', romaji: 'tsukue no ue', meaning: 'di atas meja' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '下',
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'お', 'くだ'],
    meaning: 'bawah',
    examples: [
      { jp: '下手', romaji: 'heta', meaning: 'tidak pandai' },
      { jp: '地下', romaji: 'chika', meaning: 'bawah tanah' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '中',
    onyomi: ['チュウ', 'ジュウ'],
    kunyomi: ['なか'],
    meaning: 'tengah; dalam',
    examples: [
      { jp: '中国', romaji: 'chuugoku', meaning: 'China' },
      { jp: '中学校', romaji: 'chuugakkou', meaning: 'SMP' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '外',
    onyomi: ['ガイ', 'ゲ'],
    kunyomi: ['そと', 'ほか'],
    meaning: 'luar',
    examples: [
      { jp: '外国', romaji: 'gaikoku', meaning: 'luar negeri' },
      { jp: '外出', romaji: 'gaishutsu', meaning: 'keluar rumah' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '左',
    onyomi: ['サ', 'シャ'],
    kunyomi: ['ひだり'],
    meaning: 'kiri',
    examples: [
      { jp: '左手', romaji: 'hidarite', meaning: 'tangan kiri' },
      { jp: '左折', romaji: 'sasetsu', meaning: 'belok kiri' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '右',
    onyomi: ['ウ', 'ユウ'],
    kunyomi: ['みぎ'],
    meaning: 'kanan',
    examples: [
      { jp: '右手', romaji: 'migite', meaning: 'tangan kanan' },
      { jp: '右折', romaji: 'usetsu', meaning: 'belok kanan' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '東',
    onyomi: ['トウ'],
    kunyomi: ['ひがし'],
    meaning: 'timur',
    examples: [
      { jp: '東京', romaji: 'toukyou', meaning: 'Tokyo' },
      { jp: '東洋', romaji: 'touyou', meaning: 'timur (oriental)' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '西',
    onyomi: ['セイ', 'サイ'],
    kunyomi: ['にし'],
    meaning: 'barat',
    examples: [
      { jp: '西洋', romaji: 'seiyou', meaning: 'barat (occidental)' },
      { jp: '関西', romaji: 'kansai', meaning: 'wilayah Kansai' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '南',
    onyomi: ['ナン', 'ナ'],
    kunyomi: ['みなみ'],
    meaning: 'selatan',
    examples: [
      { jp: '南米', romaji: 'nanbei', meaning: 'Amerika Selatan' },
      { jp: '南口', romaji: 'minamiguchi', meaning: 'pintu selatan' }
    ],
    strokes: createPlaceholderStrokes(9)
  },
  {
    kanji: '北',
    onyomi: ['ホク', 'ホッ'],
    kunyomi: ['きた'],
    meaning: 'utara',
    examples: [
      { jp: '北海道', romaji: 'hokkaidou', meaning: 'Hokkaido' },
      { jp: '北口', romaji: 'kitaguchi', meaning: 'pintu utara' }
    ],
    strokes: createPlaceholderStrokes(5)
  },

  // === EDUCATION & ACTIVITIES (教育・活動) ===
  {
    kanji: '学',
    onyomi: ['ガク'],
    kunyomi: ['まな'],
    meaning: 'belajar',
    examples: [
      { jp: '学校', romaji: 'gakkou', meaning: 'sekolah' },
      { jp: '大学', romaji: 'daigaku', meaning: 'universitas' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '校',
    onyomi: ['コウ', 'キョウ'],
    kunyomi: [],
    meaning: 'sekolah',
    examples: [
      { jp: '学校', romaji: 'gakkou', meaning: 'sekolah' },
      { jp: '高校', romaji: 'koukou', meaning: 'SMA' }
    ],
    strokes: createPlaceholderStrokes(10)
  },
  {
    kanji: '生',
    onyomi: ['セイ', 'ショウ'],
    kunyomi: ['い', 'う', 'は'],
    meaning: 'hidup; lahir',
    examples: [
      { jp: '学生', romaji: 'gakusei', meaning: 'pelajar' },
      { jp: '生活', romaji: 'seikatsu', meaning: 'kehidupan' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '先',
    onyomi: ['セン'],
    kunyomi: ['さき', 'ま'],
    meaning: 'dulu; depan',
    examples: [
      { jp: '先生', romaji: 'sensei', meaning: 'guru' },
      { jp: '先週', romaji: 'senshuu', meaning: 'minggu lalu' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '友',
    onyomi: ['ユウ'],
    kunyomi: ['とも'],
    meaning: 'teman',
    examples: [
      { jp: '友達', romaji: 'tomodachi', meaning: 'teman' },
      { jp: '友人', romaji: 'yuujin', meaning: 'teman' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '父',
    onyomi: ['フ', 'ホ'],
    kunyomi: ['ちち'],
    meaning: 'ayah',
    examples: [
      { jp: '父親', romaji: 'chichioya', meaning: 'ayah' },
      { jp: 'お父さん', romaji: 'otousan', meaning: 'ayah' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '母',
    onyomi: ['ボ'],
    kunyomi: ['はは'],
    meaning: 'ibu',
    examples: [
      { jp: '母親', romaji: 'hahaoya', meaning: 'ibu' },
      { jp: 'お母さん', romaji: 'okaasan', meaning: 'ibu' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '本',
    onyomi: ['ホン'],
    kunyomi: ['もと'],
    meaning: 'buku; asal',
    examples: [
      { jp: '日本', romaji: 'nihon', meaning: 'Jepang' },
      { jp: '本屋', romaji: 'honya', meaning: 'toko buku' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '書',
    onyomi: ['ショ'],
    kunyomi: ['か'],
    meaning: 'menulis',
    examples: [
      { jp: '辞書', romaji: 'jisho', meaning: 'kamus' },
      { jp: '図書館', romaji: 'toshokan', meaning: 'perpustakaan' }
    ],
    strokes: createPlaceholderStrokes(10)
  },
  {
    kanji: '語',
    onyomi: ['ゴ'],
    kunyomi: ['かた'],
    meaning: 'bahasa',
    examples: [
      { jp: '日本語', romaji: 'nihongo', meaning: 'bahasa Jepang' },
      { jp: '英語', romaji: 'eigo', meaning: 'bahasa Inggris' }
    ],
    strokes: createPlaceholderStrokes(14)
  },
  {
    kanji: '話',
    onyomi: ['ワ'],
    kunyomi: ['はな', 'はなし'],
    meaning: 'berbicara',
    examples: [
      { jp: '電話', romaji: 'denwa', meaning: 'telepon' },
      { jp: '会話', romaji: 'kaiwa', meaning: 'percakapan' }
    ],
    strokes: createPlaceholderStrokes(13)
  },
  {
    kanji: '聞',
    onyomi: ['ブン', 'モン'],
    kunyomi: ['き'],
    meaning: 'mendengar',
    examples: [
      { jp: '新聞', romaji: 'shinbun', meaning: 'koran' },
      { jp: '聞く', romaji: 'kiku', meaning: 'mendengar' }
    ],
    strokes: createPlaceholderStrokes(14)
  },
  {
    kanji: '読',
    onyomi: ['ドク', 'トク', 'トウ'],
    kunyomi: ['よ'],
    meaning: 'membaca',
    examples: [
      { jp: '読書', romaji: 'dokusho', meaning: 'membaca buku' },
      { jp: '読む', romaji: 'yomu', meaning: 'membaca' }
    ],
    strokes: createPlaceholderStrokes(14)
  },
  {
    kanji: '見',
    onyomi: ['ケン'],
    kunyomi: ['み'],
    meaning: 'melihat',
    examples: [
      { jp: '見物', romaji: 'kenbutsu', meaning: 'tamasya' },
      { jp: '見る', romaji: 'miru', meaning: 'melihat' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '行',
    onyomi: ['コウ', 'ギョウ', 'アン'],
    kunyomi: ['い', 'ゆ'],
    meaning: 'pergi',
    examples: [
      { jp: '旅行', romaji: 'ryokou', meaning: 'perjalanan' },
      { jp: '銀行', romaji: 'ginkou', meaning: 'bank' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '来',
    onyomi: ['ライ'],
    kunyomi: ['く', 'きた'],
    meaning: 'datang',
    examples: [
      { jp: '来年', romaji: 'rainen', meaning: 'tahun depan' },
      { jp: '来週', romaji: 'raishuu', meaning: 'minggu depan' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '出',
    onyomi: ['シュツ', 'スイ'],
    kunyomi: ['で', 'だ'],
    meaning: 'keluar',
    examples: [
      { jp: '出口', romaji: 'deguchi', meaning: 'pintu keluar' },
      { jp: '出発', romaji: 'shuppatsu', meaning: 'berangkat' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '入',
    onyomi: ['ニュウ', 'ジュ'],
    kunyomi: ['い', 'はい'],
    meaning: 'masuk',
    examples: [
      { jp: '入口', romaji: 'iriguchi', meaning: 'pintu masuk' },
      { jp: '入学', romaji: 'nyuugaku', meaning: 'masuk sekolah' }
    ],
    strokes: createPlaceholderStrokes(2)
  },
  {
    kanji: '食',
    onyomi: ['ショク', 'ジキ'],
    kunyomi: ['た', 'く'],
    meaning: 'makan',
    examples: [
      { jp: '食べ物', romaji: 'tabemono', meaning: 'makanan' },
      { jp: '朝食', romaji: 'choushoku', meaning: 'sarapan' }
    ],
    strokes: createPlaceholderStrokes(9)
  },
  {
    kanji: '飲',
    onyomi: ['イン', 'オン'],
    kunyomi: ['の'],
    meaning: 'minum',
    examples: [
      { jp: '飲み物', romaji: 'nomimono', meaning: 'minuman' },
      { jp: '飲む', romaji: 'nomu', meaning: 'minum' }
    ],
    strokes: createPlaceholderStrokes(12)
  },

  // === COMMON KANJI (一般) ===
  {
    kanji: '大',
    onyomi: ['ダイ', 'タイ'],
    kunyomi: ['おお'],
    meaning: 'besar',
    examples: [
      { jp: '大学', romaji: 'daigaku', meaning: 'universitas' },
      { jp: '大きい', romaji: 'ookii', meaning: 'besar' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '小',
    onyomi: ['ショウ'],
    kunyomi: ['ちい', 'こ', 'お'],
    meaning: 'kecil',
    examples: [
      { jp: '小学校', romaji: 'shougakkou', meaning: 'SD' },
      { jp: '小さい', romaji: 'chiisai', meaning: 'kecil' }
    ],
    strokes: createPlaceholderStrokes(3)
  },
  {
    kanji: '長',
    onyomi: ['チョウ'],
    kunyomi: ['なが'],
    meaning: 'panjang; kepala',
    examples: [
      { jp: '社長', romaji: 'shachou', meaning: 'direktur' },
      { jp: '長い', romaji: 'nagai', meaning: 'panjang' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '高',
    onyomi: ['コウ'],
    kunyomi: ['たか'],
    meaning: 'tinggi',
    examples: [
      { jp: '高校', romaji: 'koukou', meaning: 'SMA' },
      { jp: '高い', romaji: 'takai', meaning: 'tinggi/mahal' }
    ],
    strokes: createPlaceholderStrokes(10)
  },
  {
    kanji: '安',
    onyomi: ['アン'],
    kunyomi: ['やす'],
    meaning: 'murah; tenang',
    examples: [
      { jp: '安い', romaji: 'yasui', meaning: 'murah' },
      { jp: '安全', romaji: 'anzen', meaning: 'aman' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '新',
    onyomi: ['シン'],
    kunyomi: ['あたら', 'あら'],
    meaning: 'baru',
    examples: [
      { jp: '新聞', romaji: 'shinbun', meaning: 'koran' },
      { jp: '新しい', romaji: 'atarashii', meaning: 'baru' }
    ],
    strokes: createPlaceholderStrokes(13)
  },
  {
    kanji: '古',
    onyomi: ['コ'],
    kunyomi: ['ふる'],
    meaning: 'tua; lama',
    examples: [
      { jp: '古い', romaji: 'furui', meaning: 'tua/lama' },
      { jp: '中古', romaji: 'chuuko', meaning: 'bekas' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '白',
    onyomi: ['ハク', 'ビャク'],
    kunyomi: ['しろ', 'しら'],
    meaning: 'putih',
    examples: [
      { jp: '白い', romaji: 'shiroi', meaning: 'putih' },
      { jp: '白人', romaji: 'hakujin', meaning: 'orang kulit putih' }
    ],
    strokes: createPlaceholderStrokes(5)
  },
  {
    kanji: '黒',
    onyomi: ['コク'],
    kunyomi: ['くろ'],
    meaning: 'hitam',
    examples: [
      { jp: '黒い', romaji: 'kuroi', meaning: 'hitam' },
      { jp: '黒板', romaji: 'kokuban', meaning: 'papan tulis' }
    ],
    strokes: createPlaceholderStrokes(11)
  },
  {
    kanji: '赤',
    onyomi: ['セキ', 'シャク'],
    kunyomi: ['あか'],
    meaning: 'merah',
    examples: [
      { jp: '赤い', romaji: 'akai', meaning: 'merah' },
      { jp: '赤ちゃん', romaji: 'akachan', meaning: 'bayi' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '青',
    onyomi: ['セイ', 'ショウ'],
    kunyomi: ['あお'],
    meaning: 'biru',
    examples: [
      { jp: '青い', romaji: 'aoi', meaning: 'biru' },
      { jp: '青年', romaji: 'seinen', meaning: 'pemuda' }
    ],
    strokes: createPlaceholderStrokes(8)
  },

  // === ADDITIONAL COMMON N5 KANJI ===
  {
    kanji: '円',
    onyomi: ['エン'],
    kunyomi: ['まる'],
    meaning: 'yen; lingkaran',
    examples: [
      { jp: '百円', romaji: 'hyakuen', meaning: 'seratus yen' },
      { jp: '円い', romaji: 'marui', meaning: 'bulat' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '店',
    onyomi: ['テン'],
    kunyomi: ['みせ'],
    meaning: 'toko',
    examples: [
      { jp: '本屋', romaji: 'honya', meaning: 'toko buku' },
      { jp: '喫茶店', romaji: 'kissaten', meaning: 'kafe' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '駅',
    onyomi: ['エキ'],
    kunyomi: [],
    meaning: 'stasiun',
    examples: [
      { jp: '東京駅', romaji: 'toukyoueki', meaning: 'Stasiun Tokyo' },
      { jp: '駅前', romaji: 'ekimae', meaning: 'depan stasiun' }
    ],
    strokes: createPlaceholderStrokes(14)
  },
  {
    kanji: '車',
    onyomi: ['シャ'],
    kunyomi: ['くるま'],
    meaning: 'mobil; kendaraan',
    examples: [
      { jp: '電車', romaji: 'densha', meaning: 'kereta listrik' },
      { jp: '自動車', romaji: 'jidousha', meaning: 'mobil' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '電',
    onyomi: ['デン'],
    kunyomi: [],
    meaning: 'listrik',
    examples: [
      { jp: '電話', romaji: 'denwa', meaning: 'telepon' },
      { jp: '電車', romaji: 'densha', meaning: 'kereta listrik' }
    ],
    strokes: createPlaceholderStrokes(13)
  },
  {
    kanji: '道',
    onyomi: ['ドウ', 'トウ'],
    kunyomi: ['みち'],
    meaning: 'jalan',
    examples: [
      { jp: '道路', romaji: 'douro', meaning: 'jalan raya' },
      { jp: '北海道', romaji: 'hokkaidou', meaning: 'Hokkaido' }
    ],
    strokes: createPlaceholderStrokes(12)
  },
  {
    kanji: '社',
    onyomi: ['シャ'],
    kunyomi: ['やしろ'],
    meaning: 'perusahaan; kuil',
    examples: [
      { jp: '会社', romaji: 'kaisha', meaning: 'perusahaan' },
      { jp: '神社', romaji: 'jinja', meaning: 'kuil Shinto' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '会',
    onyomi: ['カイ', 'エ'],
    kunyomi: ['あ'],
    meaning: 'bertemu',
    examples: [
      { jp: '会社', romaji: 'kaisha', meaning: 'perusahaan' },
      { jp: '会議', romaji: 'kaigi', meaning: 'rapat' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '国',
    onyomi: ['コク'],
    kunyomi: ['くに'],
    meaning: 'negara',
    examples: [
      { jp: '外国', romaji: 'gaikoku', meaning: 'luar negeri' },
      { jp: '中国', romaji: 'chuugoku', meaning: 'China' }
    ],
    strokes: createPlaceholderStrokes(8)
  },
  {
    kanji: '何',
    onyomi: ['カ'],
    kunyomi: ['なに', 'なん'],
    meaning: 'apa',
    examples: [
      { jp: '何時', romaji: 'nanji', meaning: 'jam berapa' },
      { jp: '何人', romaji: 'nannin', meaning: 'berapa orang' }
    ],
    strokes: createPlaceholderStrokes(7)
  },
  {
    kanji: '今',
    onyomi: ['コン', 'キン'],
    kunyomi: ['いま'],
    meaning: 'sekarang',
    examples: [
      { jp: '今日', romaji: 'kyou', meaning: 'hari ini' },
      { jp: '今年', romaji: 'kotoshi', meaning: 'tahun ini' }
    ],
    strokes: createPlaceholderStrokes(4)
  },
  {
    kanji: '前',
    onyomi: ['ゼン'],
    kunyomi: ['まえ'],
    meaning: 'depan; sebelum',
    examples: [
      { jp: '前日', romaji: 'zenjitsu', meaning: 'hari sebelumnya' },
      { jp: '名前', romaji: 'namae', meaning: 'nama' }
    ],
    strokes: createPlaceholderStrokes(9)
  },
  {
    kanji: '後',
    onyomi: ['ゴ', 'コウ'],
    kunyomi: ['あと', 'うし', 'のち'],
    meaning: 'belakang; setelah',
    examples: [
      { jp: '午後', romaji: 'gogo', meaning: 'sore/siang' },
      { jp: '後ろ', romaji: 'ushiro', meaning: 'belakang' }
    ],
    strokes: createPlaceholderStrokes(9)
  },
  {
    kanji: '毎',
    onyomi: ['マイ'],
    kunyomi: ['ごと'],
    meaning: 'setiap',
    examples: [
      { jp: '毎日', romaji: 'mainichi', meaning: 'setiap hari' },
      { jp: '毎週', romaji: 'maishuu', meaning: 'setiap minggu' }
    ],
    strokes: createPlaceholderStrokes(6)
  },
  {
    kanji: '週',
    onyomi: ['シュウ'],
    kunyomi: [],
    meaning: 'minggu',
    examples: [
      { jp: '今週', romaji: 'konshuu', meaning: 'minggu ini' },
      { jp: '来週', romaji: 'raishuu', meaning: 'minggu depan' }
    ],
    strokes: createPlaceholderStrokes(11)
  },
  {
    kanji: '力',
    onyomi: ['リョク', 'リキ'],
    kunyomi: ['ちから'],
    meaning: 'kekuatan',
    examples: [
      { jp: '力士', romaji: 'rikishi', meaning: 'pesumo' },
      { jp: '体力', romaji: 'tairyoku', meaning: 'stamina' }
    ],
    strokes: createPlaceholderStrokes(2)
  }
];

// Helper function to get total count
export function getTotalKanjiCount() {
  return KanjiN5Complete.length;
}

// Export default as alias
export const KanjiN5 = KanjiN5Complete;