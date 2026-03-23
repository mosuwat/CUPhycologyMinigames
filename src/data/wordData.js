export const wordGroups = [
  {
    theme: "School",
    words: ["teacher","student","classroom","homework","exam","desk","chalk","board","lesson","study","notebook","uniform","principal","bell","subject"],
    lureRelated: ["class","education","learning","lecture","test","campus"],
    lureUnrelated: ["banana","ocean","guitar","pillow","mountain"],
  },
  {
    theme: "Beach",
    words: ["sand","sea","ocean","wave","shore","coast","tide","shell","sun","sunscreen","towel","umbrella","swimsuit","surf","island"],
    lureRelated: ["water","vacation","summer","seaside","sandcastle","lagoon"],
    lureUnrelated: ["keyboard","mountain","pencil","engine","curtain"],
  },
  {
    theme: "Mountain",
    words: ["molehill","climb","glacier","valley","goat","ski","bike","hill","steep","summit","top","range","peak","plain","climber"],
    lureRelated: ["gravel","mountain","road","uneven","riders"],
    lureUnrelated: ["honey","hurt","swivel","wake"],
  },
  {
    theme: "Health",
    words: ["workout","gym","fitness","training","run","jogging","cardio","strength","muscles","sweat","energy","endurance","stretching","coach","routine"],
    lureRelated: ["active","healthy","practice","sport","athlete","movement"],
    lureUnrelated: ["pillow","ocean","laptop","chocolate","mountain"],
  },
  {
    theme: "Kitchen",
    words: ["kitchen","stove","pan","pot","knife","cutting","chop","boil","fry","recipe","ingredients","seasoning","taste","chef","meal"],
    lureRelated: ["cook","baking","prepare","food","dinner","cuisine"],
    lureUnrelated: ["airplane","mountain","notebook","pillow","engine","curtain"],
  },
  {
    theme: "Math",
    words: ["number","symbol","plus","minus","multiply","divide","equal","variable","algebra","formula","calculate","solve","expression","value","term"],
    lureRelated: ["answer","math","operation","result","problem","function"],
    lureUnrelated: ["banana","ocean","guitar","pillow","mountain","candle"],
  },
  {
    theme: "Psychology",
    words: ["brain","behavior","emotion","cognition","perception","memory","attention","learning","personality","stress","therapy","experiment","research","analysis","motivation"],
    lureRelated: ["mental","thinking","feeling","psychology","awareness","consciousness"],
    lureUnrelated: ["banana","engine","mountain","guitar","ocean"],
  },
  {
    theme: "Sleep",
    words: ["bed","rest","awake","tired","dream","wake","snooze","blanket","doze","slumber","snore","nap","peace","yawn","drowsy"],
    lureRelated: ["night","pillow","relax","fatigue","calm","darkness"],
    lureUnrelated: ["banana","engine","mountain","guitar","ocean","pencil"],
  },
]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a round:
// - Show `showCount` words one by one
// - Quiz grid is 4x4 = 16 cells:
//     - some shown words (correct answers)
//     - 4-5 lure related words
//     - 1-2 lure unrelated words
//     - remaining shown words fill the rest
export function buildRound(showCount = 10) {
  const group = wordGroups[Math.floor(Math.random() * wordGroups.length)]
  const shuffledWords = shuffle(group.words)
  const shown = shuffledWords.slice(0, showCount)

  // Pick lure counts: 4-5 related, 1-2 unrelated
  const lureRelatedCount = 4 + Math.floor(Math.random() * 2) // 4 or 5
  const lureUnrelatedCount = 1 + Math.floor(Math.random() * 2) // 1 or 2
  const totalLures = lureRelatedCount + lureUnrelatedCount
  const shownInGrid = 16 - totalLures // how many shown words appear in grid

  const lureRelated = shuffle(group.lureRelated).slice(0, lureRelatedCount)
  const lureUnrelated = shuffle(group.lureUnrelated).slice(0, lureUnrelatedCount)

  // Pick which shown words appear in the grid
  const shownForGrid = shuffle(shown).slice(0, shownInGrid)

  // Build grid of 16 cells
  const gridWords = shuffle([
    ...shownForGrid.map(w => ({ word: w, type: 'shown' })),
    ...lureRelated.map(w => ({ word: w, type: 'lure_related' })),
    ...lureUnrelated.map(w => ({ word: w, type: 'lure_unrelated' })),
  ])

  return {
    group,
    shown,          // words shown during memorisation phase
    gridWords,      // 16 items for the quiz grid
    shownSet: new Set(shown), // for quick lookup
  }
}