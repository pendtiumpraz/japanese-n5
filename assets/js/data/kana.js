// Data Kana dasar: Hiragana & Katakana (gojūon) + diakritik + youon (subset awal M1)
// Struktur item: { kana, romaji, type: 'hiragana'|'katakana' }

export const Hiragana = [
  // Vokal
  { kana:'あ', romaji:'a', type:'hiragana' },
  { kana:'い', romaji:'i', type:'hiragana' },
  { kana:'う', romaji:'u', type:'hiragana' },
  { kana:'え', romaji:'e', type:'hiragana' },
  { kana:'お', romaji:'o', type:'hiragana' },
  // K
  { kana:'か', romaji:'ka', type:'hiragana' },
  { kana:'き', romaji:'ki', type:'hiragana' },
  { kana:'く', romaji:'ku', type:'hiragana' },
  { kana:'け', romaji:'ke', type:'hiragana' },
  { kana:'こ', romaji:'ko', type:'hiragana' },
  // S
  { kana:'さ', romaji:'sa', type:'hiragana' },
  { kana:'し', romaji:'shi', type:'hiragana' },
  { kana:'す', romaji:'su', type:'hiragana' },
  { kana:'せ', romaji:'se', type:'hiragana' },
  { kana:'そ', romaji:'so', type:'hiragana' },
  // T
  { kana:'た', romaji:'ta', type:'hiragana' },
  { kana:'ち', romaji:'chi', type:'hiragana' },
  { kana:'つ', romaji:'tsu', type:'hiragana' },
  { kana:'て', romaji:'te', type:'hiragana' },
  { kana:'と', romaji:'to', type:'hiragana' },
  // N
  { kana:'な', romaji:'na', type:'hiragana' },
  { kana:'に', romaji:'ni', type:'hiragana' },
  { kana:'ぬ', romaji:'nu', type:'hiragana' },
  { kana:'ね', romaji:'ne', type:'hiragana' },
  { kana:'の', romaji:'no', type:'hiragana' },
  // H
  { kana:'は', romaji:'ha', type:'hiragana' },
  { kana:'ひ', romaji:'hi', type:'hiragana' },
  { kana:'ふ', romaji:'fu', type:'hiragana' },
  { kana:'へ', romaji:'he', type:'hiragana' },
  { kana:'ほ', romaji:'ho', type:'hiragana' },
  // M
  { kana:'ま', romaji:'ma', type:'hiragana' },
  { kana:'み', romaji:'mi', type:'hiragana' },
  { kana:'む', romaji:'mu', type:'hiragana' },
  { kana:'め', romaji:'me', type:'hiragana' },
  { kana:'も', romaji:'mo', type:'hiragana' },
  // Y
  { kana:'や', romaji:'ya', type:'hiragana' },
  { kana:'ゆ', romaji:'yu', type:'hiragana' },
  { kana:'よ', romaji:'yo', type:'hiragana' },
  // R
  { kana:'ら', romaji:'ra', type:'hiragana' },
  { kana:'り', romaji:'ri', type:'hiragana' },
  { kana:'る', romaji:'ru', type:'hiragana' },
  { kana:'れ', romaji:'re', type:'hiragana' },
  { kana:'ろ', romaji:'ro', type:'hiragana' },
  // W + N
  { kana:'わ', romaji:'wa', type:'hiragana' },
  { kana:'を', romaji:'wo', type:'hiragana' },
  { kana:'ん', romaji:'n', type:'hiragana' },
];

export const Katakana = [
  // Vokal
  { kana:'ア', romaji:'a', type:'katakana' },
  { kana:'イ', romaji:'i', type:'katakana' },
  { kana:'ウ', romaji:'u', type:'katakana' },
  { kana:'エ', romaji:'e', type:'katakana' },
  { kana:'オ', romaji:'o', type:'katakana' },
  // K
  { kana:'カ', romaji:'ka', type:'katakana' },
  { kana:'キ', romaji:'ki', type:'katakana' },
  { kana:'ク', romaji:'ku', type:'katakana' },
  { kana:'ケ', romaji:'ke', type:'katakana' },
  { kana:'コ', romaji:'ko', type:'katakana' },
  // S
  { kana:'サ', romaji:'sa', type:'katakana' },
  { kana:'シ', romaji:'shi', type:'katakana' },
  { kana:'ス', romaji:'su', type:'katakana' },
  { kana:'セ', romaji:'se', type:'katakana' },
  { kana:'ソ', romaji:'so', type:'katakana' },
  // T
  { kana:'タ', romaji:'ta', type:'katakana' },
  { kana:'チ', romaji:'chi', type:'katakana' },
  { kana:'ツ', romaji:'tsu', type:'katakana' },
  { kana:'テ', romaji:'te', type:'katakana' },
  { kana:'ト', romaji:'to', type:'katakana' },
  // N
  { kana:'ナ', romaji:'na', type:'katakana' },
  { kana:'ニ', romaji:'ni', type:'katakana' },
  { kana:'ヌ', romaji:'nu', type:'katakana' },
  { kana:'ネ', romaji:'ne', type:'katakana' },
  { kana:'ノ', romaji:'no', type:'katakana' },
  // H
  { kana:'ハ', romaji:'ha', type:'katakana' },
  { kana:'ヒ', romaji:'hi', type:'katakana' },
  { kana:'フ', romaji:'fu', type:'katakana' },
  { kana:'ヘ', romaji:'he', type:'katakana' },
  { kana:'ホ', romaji:'ho', type:'katakana' },
  // M
  { kana:'マ', romaji:'ma', type:'katakana' },
  { kana:'ミ', romaji:'mi', type:'katakana' },
  { kana:'ム', romaji:'mu', type:'katakana' },
  { kana:'メ', romaji:'me', type:'katakana' },
  { kana:'モ', romaji:'mo', type:'katakana' },
  // Y
  { kana:'ヤ', romaji:'ya', type:'katakana' },
  { kana:'ユ', romaji:'yu', type:'katakana' },
  { kana:'ヨ', romaji:'yo', type:'katakana' },
  // R
  { kana:'ラ', romaji:'ra', type:'katakana' },
  { kana:'リ', romaji:'ri', type:'katakana' },
  { kana:'ル', romaji:'ru', type:'katakana' },
  { kana:'レ', romaji:'re', type:'katakana' },
  { kana:'ロ', romaji:'ro', type:'katakana' },
  // W + N
  { kana:'ワ', romaji:'wa', type:'katakana' },
  { kana:'ヲ', romaji:'wo', type:'katakana' },
  { kana:'ン', romaji:'n', type:'katakana' },
];

// Diakritik (dakuten/handakuten) contoh subset, dapat ditambah di M2
export const HiraganaDakuten = [
  { kana:'が', romaji:'ga', type:'hiragana' },
  { kana:'ぎ', romaji:'gi', type:'hiragana' },
  { kana:'ぐ', romaji:'gu', type:'hiragana' },
  { kana:'げ', romaji:'ge', type:'hiragana' },
  { kana:'ご', romaji:'go', type:'hiragana' },
  { kana:'ざ', romaji:'za', type:'hiragana' },
  { kana:'じ', romaji:'ji', type:'hiragana' },
  { kana:'ず', romaji:'zu', type:'hiragana' },
  { kana:'ぜ', romaji:'ze', type:'hiragana' },
  { kana:'ぞ', romaji:'zo', type:'hiragana' },
  { kana:'だ', romaji:'da', type:'hiragana' },
  { kana:'ぢ', romaji:'ji', type:'hiragana' },
  { kana:'づ', romaji:'zu', type:'hiragana' },
  { kana:'で', romaji:'de', type:'hiragana' },
  { kana:'ど', romaji:'do', type:'hiragana' },
  { kana:'ば', romaji:'ba', type:'hiragana' },
  { kana:'び', romaji:'bi', type:'hiragana' },
  { kana:'ぶ', romaji:'bu', type:'hiragana' },
  { kana:'べ', romaji:'be', type:'hiragana' },
  { kana:'ぼ', romaji:'bo', type:'hiragana' },
  { kana:'ぱ', romaji:'pa', type:'hiragana' },
  { kana:'ぴ', romaji:'pi', type:'hiragana' },
  { kana:'ぷ', romaji:'pu', type:'hiragana' },
  { kana:'ぺ', romaji:'pe', type:'hiragana' },
  { kana:'ぽ', romaji:'po', type:'hiragana' },
];

export const KatakanaDakuten = [
  { kana:'ガ', romaji:'ga', type:'katakana' },
  { kana:'ギ', romaji:'gi', type:'katakana' },
  { kana:'グ', romaji:'gu', type:'katakana' },
  { kana:'ゲ', romaji:'ge', type:'katakana' },
  { kana:'ゴ', romaji:'go', type:'katakana' },
  { kana:'ザ', romaji:'za', type:'katakana' },
  { kana:'ジ', romaji:'ji', type:'katakana' },
  { kana:'ズ', romaji:'zu', type:'katakana' },
  { kana:'ゼ', romaji:'ze', type:'katakana' },
  { kana:'ゾ', romaji:'zo', type:'katakana' },
  { kana:'ダ', romaji:'da', type:'katakana' },
  { kana:'ヂ', romaji:'ji', type:'katakana' },
  { kana:'ヅ', romaji:'zu', type:'katakana' },
  { kana:'デ', romaji:'de', type:'katakana' },
  { kana:'ド', romaji:'do', type:'katakana' },
  { kana:'バ', romaji:'ba', type:'katakana' },
  { kana:'ビ', romaji:'bi', type:'katakana' },
  { kana:'ブ', romaji:'bu', type:'katakana' },
  { kana:'ベ', romaji:'be', type:'katakana' },
  { kana:'ボ', romaji:'bo', type:'katakana' },
  { kana:'パ', romaji:'pa', type:'katakana' },
  { kana:'ピ', romaji:'pi', type:'katakana' },
  { kana:'プ', romaji:'pu', type:'katakana' },
  { kana:'ペ', romaji:'pe', type:'katakana' },
  { kana:'ポ', romaji:'po', type:'katakana' },
];

// Youon (kombinasi kecil ゃゅょ / ャュョ) subset contoh
export const HiraganaYouon = [
  { kana:'きゃ', romaji:'kya', type:'hiragana' },
  { kana:'きゅ', romaji:'kyu', type:'hiragana' },
  { kana:'きょ', romaji:'kyo', type:'hiragana' },
  { kana:'しゃ', romaji:'sha', type:'hiragana' },
  { kana:'しゅ', romaji:'shu', type:'hiragana' },
  { kana:'しょ', romaji:'sho', type:'hiragana' },
  { kana:'ちゃ', romaji:'cha', type:'hiragana' },
  { kana:'ちゅ', romaji:'chu', type:'hiragana' },
  { kana:'ちょ', romaji:'cho', type:'hiragana' },
  { kana:'にゃ', romaji:'nya', type:'hiragana' },
  { kana:'にゅ', romaji:'nyu', type:'hiragana' },
  { kana:'にょ', romaji:'nyo', type:'hiragana' },
  { kana:'ひゃ', romaji:'hya', type:'hiragana' },
  { kana:'ひゅ', romaji:'hyu', type:'hiragana' },
  { kana:'ひょ', romaji:'hyo', type:'hiragana' },
  { kana:'みゃ', romaji:'mya', type:'hiragana' },
  { kana:'みゅ', romaji:'myu', type:'hiragana' },
  { kana:'みょ', romaji:'myo', type:'hiragana' },
  { kana:'りゃ', romaji:'rya', type:'hiragana' },
  { kana:'りゅ', romaji:'ryu', type:'hiragana' },
  { kana:'りょ', romaji:'ryo', type:'hiragana' },
];

export const KatakanaYouon = [
  { kana:'キャ', romaji:'kya', type:'katakana' },
  { kana:'キュ', romaji:'kyu', type:'katakana' },
  { kana:'キョ', romaji:'kyo', type:'katakana' },
  { kana:'シャ', romaji:'sha', type:'katakana' },
  { kana:'シュ', romaji:'shu', type:'katakana' },
  { kana:'ショ', romaji:'sho', type:'katakana' },
  { kana:'チャ', romaji:'cha', type:'katakana' },
  { kana:'チュ', romaji:'chu', type:'katakana' },
  { kana:'チョ', romaji:'cho', type:'katakana' },
  { kana:'ニャ', romaji:'nya', type:'katakana' },
  { kana:'ニュ', romaji:'nyu', type:'katakana' },
  { kana:'ニョ', romaji:'nyo', type:'katakana' },
  { kana:'ヒャ', romaji:'hya', type:'katakana' },
  { kana:'ヒュ', romaji:'hyu', type:'katakana' },
  { kana:'ヒョ', romaji:'hyo', type:'katakana' },
  { kana:'ミャ', romaji:'mya', type:'katakana' },
  { kana:'ミュ', romaji:'myu', type:'katakana' },
  { kana:'ミョ', romaji:'myo', type:'katakana' },
  { kana:'リャ', romaji:'rya', type:'katakana' },
  { kana:'リュ', romaji:'ryu', type:'katakana' },
  { kana:'リョ', romaji:'ryo', type:'katakana' },
];

// Helper gabungan untuk flashcards awal
export const KanaBasic = [
  ...Hiragana,
  ...Katakana
];

export function pickRandomKana(count = 20) {
  const pool = KanaBasic.slice();
  const result = [];
  while (result.length < Math.min(count, pool.length)) {
    const i = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(i,1)[0]);
  }
  return result;
}

// Export as KanaData for compatibility
export const KanaData = {
  hiragana: Hiragana,
  katakana: Katakana,
  hiraganaDakuten: HiraganaDakuten,
  katakanaDakuten: KatakanaDakuten,
  hiraganaYouon: HiraganaYouon,
  katakanaYouon: KatakanaYouon,
  basic: KanaBasic
};