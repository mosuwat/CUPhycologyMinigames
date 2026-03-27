export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// English: show 10, grid 16 (shown + 4-5 LR + 1-2 LUR)
export const wordGroupsEN = [
  {
    theme: 'Sleep',
    words: ['nap','awake','rest','drowsy','wake','snooze','doze','yawn','snore','dream','bed','slumber','peace','blanket','tried'],
    lureRelated: ['sleep','pillow','night','sleepy','bedroom','relax'],
    lureUnrelated: ['bitter','knitting','prick','steep','sugar','sewing'],
  },
  {
    theme: 'Sewing',
    words: ['sewing','injection','prick','sharp','syringe','knitting','thorn','thimble','cloth','point','eye','haystack','hurt','thread','pin'],
    lureRelated: ['needle','pain','stitch','sew','metal','sharpness'],
    lureUnrelated: ['doze','goat','legs','steep','slumber','bed'],
  },
  {
    theme: 'Furniture',
    words: ['table','wood','stool','sit','legs','cushion','bench','seat','swivel','couch','desk','rocking','recliner','sofa','sitting'],
    lureRelated: ['chair','furniture','room','office','lounge','rest'],
    lureUnrelated: ['bed','tooth','chocolate','dream','haystack','nice'],
  },
  {
    theme: 'Sweet',
    words: ['soda','bitter','chocolate','nice','pie','heart','sugar','tooth','good','cake','honey','tart','candy','taste','sour'],
    lureRelated: ['sweet','dessert','cream','cookie','pastry','syrup'],
    lureUnrelated: ['swivel','thread','sofa','dream','goat','ground'],
  },
  {
    theme: 'Texture',
    words: ['jagged','smooth','riders','road','tough','rugged','bumpy','ground','coarse','sand','sandpaper','uneven','boards','gravel','stone'],
    lureRelated: ['rough','texture','gritty','surface','rock','rocky'],
    lureUnrelated: ['cushion','eye','rest','wood','sour','taste'],
  },
  {
    theme: 'Mountain',
    words: ['ski','glacier','valley','molehill','summit','steep','top','climb','plain','climber','bike','range','hill','peak','goat'],
    lureRelated: ['mountain','snow','hike','altitude','slope','ridge'],
    lureUnrelated: ['bumpy','cushion','hurt','thorn','wood','point'],
  },
]

// Thai: show 8, grid 12 (6 shown + 3 LR + 3 LUR)
export const wordGroupsTH = [
  {
    theme: 'นอนหลับ',
    words: ['งีบ','ตื่น','พักผ่อน','ชุดนอน','ที่นอน','หลับ','พยายาม','กอด','หาว','กรน','ฝัน','เตียง','หลับใหล'],
    lureRelated: ['นอน','หมอน','กลางคืน','ปลุก','ห้องนอน','ฟูก'],
    lureUnrelated: ['ขม','การถัก','แทง','น้ำตาล','เปรี้ยว','หนาม'],
  },
  {
    theme: 'การเย็บ',
    words: ['เย็บ','ฉีด','แทง','แหลม','สะดุ้ง','ถัก','หนาม','นิ้วมือ','ผ้า','จิ้ม','ทิ่ม','รูเข็ม','เจ็บ'],
    lureRelated: ['เข็ม','ปวด','ช่าง','ปัก','โลหะ','คม'],
    lureUnrelated: ['งีบ','เรียบ','ขา','ชัน','ช้า','หลับ'],
  },
  {
    theme: 'เฟอร์นิเจอร์',
    words: ['โต๊ะ','ไม้','ท่าทาง','พื้น','ขา','เบาะ','ม้านั่ง','ที่นั่ง','หมุน','โซฟา','เตียง','โยก','เอน'],
    lureRelated: ['เก้าอี้','เฟอร์นิเจอร์','ห้อง','พลาสติก','พนักพิง','พักผ่อน'],
    lureUnrelated: ['เรียบ','ฟัน','ช้อน','ฝัน','กอง','ดี'],
  },
  {
    theme: 'ของหวาน',
    words: ['โซดา','ขม','ไอศครีม','อร่อย','พาย','หัวใจ','น้ำตาล','ฟัน','ดี','เค้ก','น้ำผึ้ง','เปรี้ยว','ลูกอม'],
    lureRelated: ['ของหวาน','ครีม','ความสุข','คุกกี้','เด็ก','น้ำเชื่อม'],
    lureUnrelated: ['หิน','ด้าย','หัว','โซฟา','ผ้า','แพะ'],
  },
  {
    theme: 'พื้นผิว',
    words: ['ขรุขระ','เรียบ','นักขี่','ถนน','ยาก','บ่อ','หลุม','พื้นดิน','หยาบ','ทราย','ถลอก','เสียดทาน','กรวด'],
    lureRelated: ['พื้นผิว','สาก','หน้าผา','หิน','ก้อนหิน','แข็ง'],
    lureUnrelated: ['เบาะ','ตา','พัก','ไม้','เปรี้ยว','รส'],
  },
  {
    theme: 'ภูเขา',
    words: ['สกี','ธารน้ำแข็ง','หุบเขา','เนิน','ยอด','สูงชัน','ธรรมชาติ','ปีน','ที่ราบ','ก้อนเมฆ','แพะ','เทือกเขา','ท้องฟ้า'],
    lureRelated: ['ภูเขา','หิมะ','ดอย','ความสูง','ลาดชัน','สันเขา'],
    lureUnrelated: ['ขรุขระ','เบาะ','เจ็บ','หนาม','ไม้','จุด'],
  },
]

// Build a round without repeating themes across rounds in a session
// usedThemes: Set of theme strings already used
export function buildRound(lang, usedThemes = new Set()) {
  const groups = lang === 'th' ? wordGroupsTH : wordGroupsEN
  const showCount = lang === 'th' ? 8 : 10
  const gridSize = lang === 'th' ? 12 : 16
  const lureRelatedCount = lang === 'th' ? 3 : (4 + Math.floor(Math.random() * 2))
  const lureUnrelatedCount = lang === 'th' ? 3 : (1 + Math.floor(Math.random() * 2))

  // Pick a group not yet used this session
  const available = groups.filter(g => !usedThemes.has(g.theme))
  const pool = available.length > 0 ? available : groups
  const group = pool[Math.floor(Math.random() * pool.length)]

  const shown = shuffle(group.words).slice(0, showCount)
  const shownInGrid = gridSize - lureRelatedCount - lureUnrelatedCount

  const lureRelated = shuffle(group.lureRelated).slice(0, lureRelatedCount)
  const lureUnrelated = shuffle(group.lureUnrelated).slice(0, lureUnrelatedCount)
  const shownForGrid = shuffle(shown).slice(0, shownInGrid)

  const gridWords = shuffle([
    ...shownForGrid.map(w => ({ word: w, type: 'shown' })),
    ...lureRelated.map(w => ({ word: w, type: 'lure_related' })),
    ...lureUnrelated.map(w => ({ word: w, type: 'lure_unrelated' })),
  ])

  return { group, shown, gridWords, shownSet: new Set(shown), gridSize }
}