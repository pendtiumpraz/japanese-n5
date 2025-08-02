/**
 * Kanji N5 dataset (seed)
 * - 100 entries target; start with a seed list and expand iteratively.
 * - Each entry: { kanji, onyomi, kunyomi, meaning, examples: [{jp, romaji, meaning}], strokes: simplifiedPath }
 * - strokes: for now, provide simplified guides compatible with StrokeTrainer (array of stroke point arrays).
 */
export const KanjiN5 = [
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
      // Approx 4 strokes simplified
      const s1 = [ {x:w*0.2,y:h*0.2},{x:w*0.8,y:h*0.2} ]; // top
      const s2 = [ {x:w*0.2,y:h*0.8},{x:w*0.8,y:h*0.8} ]; // bottom
      const s3 = [ {x:w*0.2,y:h*0.2},{x:w*0.2,y:h*0.8} ]; // left
      const s4 = [ {x:w*0.8,y:h*0.2},{x:w*0.8,y:h*0.8} ]; // right
      const s5 = [ {x:w*0.25,y:h*0.5},{x:w*0.75,y:h*0.5} ]; // inner bar
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
      // Simplified moon shape
      const s1 = [ {x:w*0.3,y:h*0.2},{x:w*0.3,y:h*0.8} ];
      const s2 = [ {x:w*0.3,y:h*0.2},{x:w*0.7,y:h*0.2},{x:w*0.7,y:h*0.5},{x:w*0.3,y:h*0.5} ];
      const s3 = [ {x:w*0.3,y:h*0.5},{x:w*0.65,y:h*0.5},{x:w*0.65,y:h*0.8},{x:w*0.3,y:h*0.8} ];
      return [s1,s2,s3];
    }
  },
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
      const s1 = [ {x:w*0.45,y:h*0.2},{x:w*0.25,y:h*0.8} ];
      const s2 = [ {x:w*0.55,y:h*0.2},{x:w*0.75,y:h*0.8} ];
      return [s1,s2];
    }
  },
  {
    kanji: '大',
    onyomi: ['ダイ','タイ'],
    kunyomi: ['おお(きい)'],
    meaning: 'besar',
    examples: [
      { jp: '大学', romaji: 'daigaku', meaning: 'universitas' },
      { jp: '大きい', romaji: 'ookii', meaning: 'besar' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [ {x:w*0.5,y:h*0.2},{x:w*0.5,y:h*0.75} ];
      const s2 = [ {x:w*0.2,y:h*0.55},{x:w*0.8,y:h*0.55} ];
      const s3 = [ {x:w*0.35,y:h*0.8},{x:w*0.65,y:h*0.8} ];
      return [s1,s2,s3];
    }
  },
  {
    kanji: '学',
    onyomi: ['ガク'],
    kunyomi: [],
    meaning: 'belajar',
    examples: [
      { jp: '学生', romaji: 'gakusei', meaning: 'pelajar' },
      { jp: '学校', romaji: 'gakkou', meaning: 'sekolah' }
    ],
    strokes: function(w=320,h=320){
      const s1 = [ {x:w*0.2,y:h*0.25},{x:w*0.8,y:h*0.25} ];
      const s2 = [ {x:w*0.3,y:h*0.35},{x:w*0.7,y:h*0.35} ];
      const s3 = [ {x:w*0.25,y:h*0.45},{x:w*0.75,y:h*0.45} ];
      const s4 = [ {x:w*0.2,y:h*0.6},{x:w*0.8,y:h*0.6} ];
      const s5 = [ {x:w*0.35,y:h*0.7},{x:w*0.65,y:h*0.7} ];
      return [s1,s2,s3,s4,s5];
    }
  }
];

// Placeholder to expand toward full 100-entry coverage
export const KanjiN5Placeholders = [
  { kanji:'山', meaning:'gunung' },
  { kanji:'川', meaning:'sungai' },
  { kanji:'田', meaning:'sawah' },
  { kanji:'口', meaning:'mulut' },
  { kanji:'目', meaning:'mata' },
  { kanji:'手', meaning:'tangan' },
  { kanji:'足', meaning:'kaki' },
  { kanji:'力', meaning:'kekuatan' },
  { kanji:'女', meaning:'perempuan' },
  { kanji:'男', meaning:'laki-laki' }
];