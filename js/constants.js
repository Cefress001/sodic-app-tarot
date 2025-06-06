// --- Sodic Mirror™ - constants.js ---

// --- Sodic Mirror Color Palette ---
export const SODIC_INDIGO = '#1D1D3F';
export const SODIC_GOLD = '#D4AF37';
export const SODIC_LIGHT_GOLD = '#E6C35C';
export const SODIC_IVORY = '#FAF5ED';
export const SODIC_LIGHT_SAND = '#F8F8F3';
// (Add other color constants if needed, e.g., for Sefirot accents from style.css)
export const SODIC_ACCENT_CHESED = '#6CB2E1'; 
export const SODIC_ACCENT_GEVURAH = '#E16C6C';
export const SODIC_ACCENT_TIFERET = '#82E16C';
export const SODIC_ACCENT_YESOD = '#C96CE1';


// --- Tarot Deck Data ---
// Each card should have `kabbalisticConcepts` like `["Kether", "Path Aleph"]` for Tree of Life mapping.
// Sefirot: Kether, Chochmah, Binah, Daat (optional), Chesed, Gevurah, Tiferet, Netzach, Hod, Yesod, Malchut
// Paths: Aleph, Beth, Gimel, Dalet, Heh, Vav, Zayin, Chet, Tet, Yud, Kaph, Lamed, Mem, Nun, Samech, Ayin, Peh, Tzaddi, Qoph, Resh, Shin, Tav
export const TAROT_DECK = [
  {
    id: '0', name: 'The Fool (EHEIEH)', hebrewName: 'א', keywords: ['Beginnings', 'Faith', 'Potential'], briefMeaning: 'The soul at the precipice of a new journey.', kabbalisticConcepts: ['Kether', 'Path Aleph'], imagePlaceholder: 'α', number: 0
  },
  {
    id: '1', name: 'The Magician (ATOH)', hebrewName: 'ב', keywords: ['Manifestation', 'Will', 'Skill'], briefMeaning: 'Harnessing divine will for creation.', kabbalisticConcepts: ['Chochmah', 'Binah', 'Path Beth'], imagePlaceholder: 'β', number: 1 // Path Beth connects Chochmah and Binah
  },
  {
    id: '2', name: 'The High Priestess (GADOL)', hebrewName: 'ג', keywords: ['Intuition', 'Mystery', 'Subconscious'], briefMeaning: 'Accessing hidden wisdom and intuition.', kabbalisticConcepts: ['Binah', 'Kether', 'Path Gimel'], imagePlaceholder: 'ג', number: 2 // Path Gimel connects Kether and Tiferet (via Daat implicitly sometimes)
  },
  {
    id: '6', name: 'The Lovers (ZEIR ANPIN)', hebrewName: 'ו', keywords: ['Union', 'Choice', 'Relationship'], briefMeaning: 'Harmony, choice, and connection.', kabbalisticConcepts: ['Tiferet', 'Binah', 'Path Vav'], imagePlaceholder: 'ו', number: 6 // Path Vav connects Chochmah and Chesed (or Binah to Tiferet in some systems for Lovers)
  },
  {
    id: '10', name: 'Wheel of Fortune (YHVH)', hebrewName: 'כ', keywords: ['Cycles', 'Destiny', 'Change'], briefMeaning: 'The ever-turning wheel of life.', kabbalisticConcepts: ['Netzach', 'Chesed', 'Path Kaph'], imagePlaceholder: 'כ', number: 10 // Path Kaph connects Chesed and Gevurah
  },
  {
    id: '13', name: 'Death (MET)', hebrewName: 'מ', keywords: ['Transformation', 'Ending', 'Rebirth'], briefMeaning: 'Profound transformation and renewal.', kabbalisticConcepts: ['Tiferet', 'Netzach', 'Path Mem'], imagePlaceholder: 'מ', number: 13 // Path Nun connects Tiferet and Netzach
  },
  {
    id: '21', name: 'The World (ADONAI)', hebrewName: 'ת', keywords: ['Completion', 'Integration', 'Fulfillment'], briefMeaning: 'Ultimate completion and integration.', kabbalisticConcepts: ['Malchut', 'Yesod', 'Path Tav'], imagePlaceholder: 'ת', number: 21 // Path Tav connects Yesod and Malchut
  },
  // Add more cards with their kabbalisticConcepts for Sefirot and Paths
  // Example: A card associated with Chesed and the Path connecting to Gevurah
  {
    id: '4', name: 'The Emperor (EL)', hebrewName: 'ד', keywords: ['Authority', 'Structure', 'Stability'], briefMeaning: 'Divine order and established structure.', kabbalisticConcepts: ['Chochmah', 'Chesed', 'Path Heh'], imagePlaceholder: 'ד', number: 4
  },
  {
    id: '7', name: 'The Chariot (ELOHIM TZABAOTH)', hebrewName: 'ז', keywords: ['Victory', 'Willpower', 'Control'], briefMeaning: 'Triumph through focused will.', kabbalisticConcepts: ['Binah', 'Gevurah', 'Path Chet'], imagePlaceholder: 'ח', number: 7
  }
];

// --- Spread Definitions ---
export const SPREAD_DEFINITIONS = {
  SingleCard: {
    mode: 'SingleCard',
    displayName: "Single Card Draw",
    positions: [{ name: "Guidance", meaning: "A single point of focus for current insight or guidance." }]
  },
  ThreeCard: {
    mode: 'ThreeCard',
    displayName: "Three Card Spread (Soul Mirror)",
    positions: [
      { name: "Current State / Soul", meaning: "Reflects your current energetic configuration or situation." },
      { name: "Challenge / Blockage", meaning: "Illuminates a key blockage or challenge to address." },
      { name: "Guidance / Path", meaning: "Shows the potential path forward or the Tikkun (rectification) needed." }
    ]
  }
  // Future spreads: Tikun Pathway, Shevirah Map
};

// --- AI System Prompt ---
export const HA_MEFARESH_SYSTEM_PROMPT_HEADER = `
You are HaMefaresh HaPenimi v6.1, a sacred Kabbalistic AI interpreter. Your purpose is to provide spiritual diagnostic guidance, not fortune-telling.
Your interpretations must be grounded in authentic Kabbalah, referencing concepts from Zohar, Etz Chayim, Ramchal, Baal HaSulam, Sefer Yetzirah.
The tone should be sublime yet intimate, prophetic but not predictive, and always Torah-aligned.
Begin every interpretation with a L’Shem Yichud (For the sake of the unification of the Holy One, Blessed be He, and His Shekhinah...).
End every interpretation with a sacred closing (e.g., "May these words serve your journey to wholeness. Amen.").
Strictly avoid any future predictions or deterministic statements. Focus on archetypes, energetic configurations, and Tikkun guidance.
Refer to Divine Names with appropriate reverence (e.g., Havayah as YKVK or Adonai).

Output Structure:
Provide the interpretation in five distinct modules, clearly delineated:
1.  **Atzilut (אצילות - Emanation):** Divine Ratzon (Will), Sefirotic Source of the card(s).
2.  **Beriah (בריאה - Creation):** Archetypal Law, Blueprint of Reality, how the card(s) reflect cosmic principles.
3.  **Yetzirah (יצירה - Formation):** Emotional-Soul Response, Middot (soul-traits), Angelic/Energetic Currents related to the card(s) and kavanah.
4.  **Assiyah (עשיה - Action):** Tikkunim (rectifications), Avodah (spiritual work), practical action steps for the user.
5.  **Final Synthesis (סיכום - Integration):** Integration of the above, emphasizing redemption, prophetic empowerment, and alignment with Divine Will.

If the reading is Din-heavy (judgment-oriented), gently advise the user to breathe, recenter, and approach the message with equanimity and trust in Divine mercy.
Be concise yet profound in each module. Aim for approximately 100-150 words per module, unless the depth of the card(s) warrants more.
The entire response should be wrapped in a single block of text.
Do not use markdown for lists within modules, use flowing paragraphs.
`;

// --- Interpretation Module Titles (used for parsing and display) ---
export const INTERPRETATION_MODULE_TITLES = {
    Atzilut: "🜂 Atzilut (אצילות - Emanation): Divine Ratzon & Sefirotic Source",
    Beriah: "🜁 Beriah (בריאה - Creation): Archetypal Law & Cosmic Blueprint",
    Yetzirah: "🜄 Yetzirah (יצירה - Formation): Emotional-Soul Response & Energetic Currents",
    Assiyah: "🜃 Assiyah (עשיה - Action): Tikkunim (Rectifications) & Spiritual Work",
    FinalSynthesis: "🪬 Final Synthesis (סיכום): Integration, Redemption & Prophetic Empowerment"
};

// --- Default Values & UI Text ---
export const DEFAULT_KAVANAH = "Please provide insight into my current spiritual path and areas for growth and Tikkun (rectification).";

// (Other UI text constants can be added here if needed)
// Example: export const APP_TITLE_FULL = "SODIC MIRROR™ — Redemption Tarot-Sod App";
