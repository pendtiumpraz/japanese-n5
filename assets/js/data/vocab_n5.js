/**
 * Vocab N5 categorized dataset (seed)
 * Structure: { id, jp, romaji, meaning, category }
 * Categories: greetings, numbers, time_days, family, school, verbs_daily
 */
export const VocabN5 = [
  // greetings
  { id:'g_hello', jp:'こんにちは', romaji:'konnichiwa', meaning:'halo/selamat siang', category:'greetings' },
  { id:'g_morning', jp:'おはようございます', romaji:'ohayou gozaimasu', meaning:'selamat pagi (sopan)', category:'greetings' },
  { id:'g_evening', jp:'こんばんは', romaji:'konbanwa', meaning:'selamat malam', category:'greetings' },
  { id:'g_thanks', jp:'ありがとうございます', romaji:'arigatou gozaimasu', meaning:'terima kasih banyak', category:'greetings' },
  { id:'g_sorry', jp:'すみません', romaji:'sumimasen', meaning:'permisi/maaf', category:'greetings' },

  // numbers
  { id:'n_1', jp:'一', romaji:'ichi', meaning:'satu', category:'numbers' },
  { id:'n_2', jp:'二', romaji:'ni', meaning:'dua', category:'numbers' },
  { id:'n_3', jp:'三', romaji:'san', meaning:'tiga', category:'numbers' },
  { id:'n_4', jp:'四', romaji:'shi/yon', meaning:'empat', category:'numbers' },
  { id:'n_5', jp:'五', romaji:'go', meaning:'lima', category:'numbers' },

  // time & days
  { id:'t_today', jp:'今日', romaji:'kyou', meaning:'hari ini', category:'time_days' },
  { id:'t_tomorrow', jp:'明日', romaji:'ashita', meaning:'besok', category:'time_days' },
  { id:'t_yesterday', jp:'昨日', romaji:'kinou', meaning:'kemarin', category:'time_days' },
  { id:'t_morning', jp:'朝', romaji:'asa', meaning:'pagi', category:'time_days' },
  { id:'t_night', jp:'夜', romaji:'yoru', meaning:'malam', category:'time_days' },

  // family
  { id:'f_father', jp:'父', romaji:'chichi', meaning:'ayah (sendiri)', category:'family' },
  { id:'f_mother', jp:'母', romaji:'haha', meaning:'ibu (sendiri)', category:'family' },
  { id:'f_older_bro', jp:'兄', romaji:'ani', meaning:'kakak laki-laki (sendiri)', category:'family' },
  { id:'f_older_sis', jp:'姉', romaji:'ane', meaning:'kakak perempuan (sendiri)', category:'family' },
  { id:'f_family', jp:'家族', romaji:'kazoku', meaning:'keluarga', category:'family' },

  // school
  { id:'s_school', jp:'学校', romaji:'gakkou', meaning:'sekolah', category:'school' },
  { id:'s_student', jp:'学生', romaji:'gakusei', meaning:'pelajar', category:'school' },
  { id:'s_teacher', jp:'先生', romaji:'sensei', meaning:'guru', category:'school' },
  { id:'s_class', jp:'クラス', romaji:'kurasu', meaning:'kelas', category:'school' },
  { id:'s_book', jp:'本', romaji:'hon', meaning:'buku', category:'school' },

  // daily verbs
  { id:'v_eat', jp:'食べる', romaji:'taberu', meaning:'makan', category:'verbs_daily' },
  { id:'v_drink', jp:'飲む', romaji:'nomu', meaning:'minum', category:'verbs_daily' },
  { id:'v_go', jp:'行く', romaji:'iku', meaning:'pergi', category:'verbs_daily' },
  { id:'v_come', jp:'来る', romaji:'kuru', meaning:'datang', category:'verbs_daily' },
  { id:'v_see', jp:'見る', romaji:'miru', meaning:'melihat', category:'verbs_daily' },
];

export const VocabCategories = [
  { key:'all', label:'Semua' },
  { key:'greetings', label:'Salam' },
  { key:'numbers', label:'Angka' },
  { key:'time_days', label:'Waktu & Hari' },
  { key:'family', label:'Keluarga' },
  { key:'school', label:'Sekolah' },
  { key:'verbs_daily', label:'Verba Harian' },
];

export function filterByCategory(cat) {
  if (!cat || cat === 'all') return VocabN5.slice();
  return VocabN5.filter(v => v.category === cat);
}