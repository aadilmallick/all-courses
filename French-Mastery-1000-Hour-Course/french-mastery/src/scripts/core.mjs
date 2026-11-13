export function normalize(text, accents = true) {
  let s = String(text).normalize('NFC').toLocaleLowerCase('fr').replace(/[’‘`]/g, "'").replace(/[œ]/g,'oe').replace(/[æ]/g,'ae').replace(/[-–—]/g,' ').replace(/[.,!?;:«»“”\"()[\]]/g,' ').replace(/\s+/g,' ').trim();
  if (!accents) s = s.normalize('NFD').replace(/\p{M}/gu,'');
  return s;
}
export function judge(input, accepted) {
  const exact = accepted.some(a => normalize(a) === normalize(input));
  const near = !exact && accepted.some(a => normalize(a, false) === normalize(input, false));
  return { exact, near, kind: exact ? 'correct' : near ? 'accent' : 'compare' };
}
export function vocabularyAnswers(item, french) {
  const text=String(french?item.fr:item.en);
  const clean=text.replace(/\s*\([^)]*\)/g,'').trim();
  return [...new Set([text,clean,...clean.split(/\s*[;/]\s*/)].filter(Boolean))];
}
export function shuffle(items, random = Math.random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function makeDeck(chapters, mode) {
  return chapters.flatMap(c => {
    if (mode === 'grammar') return c.grammar.map((g,i) => ({ ...g, id:`${c.chapter}-g-${i}`, chapter:c.chapter, type:'grammar' }));
    if (mode.startsWith('vocab')) return c.vocab.map((v,i) => ({ ...v, id:`${c.chapter}-v-${i}-${mode}`, chapter:c.chapter, type:mode }));
    return c.sentences.map((s,i) => ({ ...s, id:`${c.chapter}-s-${i}-${mode}`, chapter:c.chapter, type:mode }));
  });
}
export function scheduleReview(previous, correct, now = Date.now()) {
  const streak = correct ? Math.min((previous?.streak || 0) + 1, 9) : 0;
  const days = correct ? [1,1,3,7,14,30,60,120,180,365][streak] : 0;
  return { streak, due: now + (correct ? days * 86400000 : 600000), attempts:(previous?.attempts || 0) + 1, correct: (previous?.correct || 0) + Number(correct) };
}
