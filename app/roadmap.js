// The platinum roadmap: six stages in the order to play them.
// Stage numbers match each trophy's "stage" field in data/trophies.json.
export const ROADMAP = [
  {
    stage: 1,
    title: 'Story first — save every chapter',
    note: 'Play Chapters 1 to 5 and the story missions as they come. There is no mission replay and no New Game Plus, so keep one manual save at the start of every chapter and one untouched save from just before the final mission — the game has 15 manual save slots plus one autosave. Character switching between Jason and Lucia opens after Breakfast Run in Chapter 2.',
    warn: 'Do Lucia\u2019s balcony meditation in Chapter 1 (after the mission Down to Earth, in the morning, follow her from the kitchen to the balcony). It counts toward Positive Mental Attitude and is gone once Chapter 1 ends — the list\u2019s only missable trophy.',
  },
  {
    stage: 2,
    title: 'Strangers & side stories',
    note: 'Finish the five stranger finales (Andy, Kenton, Billy, Randy, Tyrone) and 8 stranger strands for Strangers & Freaks. The finales stay open after the credits, so there is no rush — but Andy\u2019s, Billy\u2019s and Tyrone\u2019s strands do not count toward Strangers & Freaks, because they have their own trophies. Check the trophy\u2019s progress counter after each strand you finish.',
    warn: 'Race Against Yago in Chapter 3 is time-sensitive (hourglass icon) and feeds Strangers & Freaks: save first, then race.',
  },
  {
    stage: 3,
    title: 'Partner & robbery',
    note: 'Once both characters are playable, do the partner trophies and the robberies. Sneakthief opens in Chapter 3 (Yasmani\u2019s Jewelry Jobs gives you the Snap Gun); bank vaults open near the end of Chapter 4 through the optional mission That\u2019s Where The Money Is. A vault job gives you 4 stars straight away, so escaping one with your partner also earns Hot Together.',
    warn: 'Robbery trophies only pop once you have left the red heat zone, not just the flashing search area.',
  },
  {
    stage: 4,
    title: 'Activities & collectibles',
    note: 'The long middle: shooting range golds (42), drone races (14 locations), 250 stunts, 20 race wins, fishing, arcade, bowling, hunting, WAiNK scans (100), card sets (3), 50 Challenges, 100 vehicles, all 52 areas and all 18 meditation spots. Most of these fill up naturally while you explore — chase the stragglers with the in-game trackers (Progress, then Challenges / Stats).',
    warn: 'Meditation spots count twice if you meditate with both characters — bring your partner every time.',
  },
  {
    stage: 5,
    title: 'Money & property',
    note: 'Launder $250,000 of marked bills through your contacts, spend $100,000 across the shops, buy all 8 garages (about $160,000, in the Vice City Real Estate app after the Chapter 2 mission Daily Driver) and register 10 vehicles to the Scooter Bros app. Each registered car needs a free garage space, so buy garages first and register cheap cars.',
    warn: null,
  },
  {
    stage: 6,
    title: '100% & the Platinum',
    note: 'The 100% checklist (35 tasks) appears after the story under Progress, then Stats, then 100% Completion — but work you did earlier still counts. The big items: 300 stunts, 200 of 277 vehicles, 70 of 80 Challenges, all 8 bank vaults and all 39 illegal operations. Finish A Long Road and Vice Got a Price! pops with it.',
    warn: null,
  },
];

export const KIND_LABELS = {
  all: 'All',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};
