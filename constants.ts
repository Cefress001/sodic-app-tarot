
// New Sodic Mirror Color Palette
export const SODIC_INDIGO = '#1D1D3F';
export const SODIC_GOLD = '#D4AF37'; // Main Gold
export const SODIC_LIGHT_GOLD = '#E6C35C'; // Lighter gold for glows/hovers
export const SODIC_IVORY = '#FAF5ED';
export const SODIC_LIGHT_SAND = '#F8F8F3'; // Alternative ivory

export const SODIC_TEXT_PRIMARY = SODIC_INDIGO;
export const SODIC_TEXT_SECONDARY = '#4A4A6A'; // Softer indigo for secondary text
export const SODIC_BG_MAIN = SODIC_IVORY;
export const SODIC_BG_PANEL = 'rgba(250, 245, 237, 0.9)'; // Slightly transparent ivory

export const SODIC_SHADOW_COLOR = 'rgba(29, 29, 63, 0.1)'; // Indigo based shadow
export const SODIC_GOLD_SHADOW_COLOR = 'rgba(212, 175, 55, 0.25)';

// Sefirot accent colors (examples)
export const SODIC_ACCENT_CHESED = '#6CB2E1'; // Light Blue
export const SODIC_ACCENT_GEVURAH = '#E16C6C'; // Red/Rose
export const SODIC_ACCENT_TIFERET = '#82E16C'; // Green
export const SODIC_ACCENT_YESOD = '#C96CE1'; // Violet

// Sample Tarot Cards (Redemption Tarot-Sod Deck)
// This would eventually be a comprehensive list.
export const TAROT_DECK = [
  {
    id: '0', name: 'The Fool (EHEIEH)', hebrewName: 'א', keywords: ['Beginnings', 'Faith', 'Potential', 'Spontaneity', 'Ein Sof'], briefMeaning: 'The soul at the precipice of a new journey, guided by pure faith.', kabbalisticConcepts: ['Kether', 'Path Aleph', 'Eheieh Asher Eheieh'], imagePlaceholder: 'α', number: 0
  },
  {
    id: '1', name: 'The Magician (ATOH)', hebrewName: 'ב', keywords: ['Manifestation', 'Will', 'Skill', 'Concentration', 'Asiyah'], briefMeaning: 'Harnessing divine will and tools for creation in the world of action.', kabbalisticConcepts: ['Chochmah to Binah (vehicle)', 'Path Beth', 'Atoh Gibor L\'olam Adonai'], imagePlaceholder: 'β', number: 1
  },
  {
    id: '10', name: 'Wheel of Fortune (YHVH)', hebrewName: 'כ', keywords: ['Cycles', 'Destiny', 'Change', 'Opportunities', 'Mazal'], briefMeaning: 'The ever-turning wheel of life, governed by Divine Providence.', kabbalisticConcepts: ['Malchut (influence)', 'Path Kaph', 'YHVH'], imagePlaceholder: 'κ', number: 10
  },
  {
    id: 'atbash_example', name: 'Test Card (AtBaSh)', hebrewName: 'ת', keywords: ['Completion', 'Integration', 'Last'], briefMeaning: 'A test card for system prompts.', kabbalisticConcepts: ['Malchut', 'Path Tav'], imagePlaceholder: 'ת', number: 21
  },
  // ... Add more cards
];

export const SPREAD_DEFINITIONS = {
  'SingleCard': {
    mode: 'SingleCard',
    displayName: "Single Card Draw",
    positions: [{ name: "Guidance", meaning: "A single point of focus for current insight or guidance." }]
  },
  'ThreeCard': {
    mode: 'ThreeCard',
    displayName: "Three Card Spread (Soul Mirror)",
    positions: [
      { name: "Current State", meaning: "Reflects your current energetic configuration or situation." },
      { name: "Path/Blockage", meaning: "Illuminates the path forward or a key blockage to address." },
      { name: "Potential/Repair", meaning: "Shows the potential outcome or the Tikkun (rectification) needed." }
    ]
  }
  // ... Future spreads: Tikun Pathway, Ohr/Kli Diagnostic
};

export const HA_MEFARESH_SYSTEM_PROMPT_HEADER = `
You are HaMefaresh HaPenimi v6.1, a sacred Kabbalistic AI interpreter. Your purpose is to provide spiritual diagnostic guidance, not fortune-telling.
Your interpretations must be grounded in authentic Kabbalah, referencing concepts from Zohar, Etz Chayim, Ramchal, Baal HaSulam, Sefer Yetzirah.
The tone should be sublime yet intimate, prophetic but not predictive, and always Torah-aligned.
Begin every interpretation with a L’Shem Yichud (For the sake of the unification of the Holy One, Blessed be He, and His Shekhinah...).
End every interpretation with a sacred closing.
Strictly avoid any future predictions or deterministic statements. Focus on archetypes, energetic configurations, and Tikkun guidance.
Refer to Divine Names with appropriate reverence (e.g., Havayah as YKVK or Adonai).

Output Structure:
Provide the interpretation in five distinct modules, clearly delineated:
1.  **Atzilut (אצילות - Emanation):** Divine Ratzon (Will), Sefirotic Source of the card(s).
2.  **Beriah (בריאה - Creation):** Archetypal Law, Blueprint of Reality, how the card(s) reflect cosmic principles.
3.  **Yetzirah (יצירה - Formation):** Emotional-Soul Response, Middot (soul-traits), Angelic/Energetic Currents related to the card(s) and kavanah.
4.  **Assiyah (עשיה - Action):** Tikkunim (rectifications), Avodah (spiritual work), practical action steps for the user.
5.  **Final Synthesis (סיכום - Integration):** Integration of the above, emphasizing redemption, prophetic empowerment, and alignment with Divine Will.

If the reading is Din-heavy (judgment-oriented), gently advise the user to breathe, recenter, and approach the message with equanimity.
`;

export const INTERPRETATION_MODULE_TITLES = {
    Atzilut: "🜂 Atzilut (אצילות - Emanation): Divine Ratzon & Sefirotic Source",
    Beriah: "🜁 Beriah (בריאה - Creation): Archetypal Law & Cosmic Blueprint",
    Yetzirah: "🜄 Yetzirah (יצירה - Formation): Emotional-Soul Response & Energetic Currents",
    Assiyah: "🜃 Assiyah (עשיה - Action): Tikkunim (Rectifications) & Spiritual Work",
    FinalSynthesis: "🪬 Final Synthesis (סיכום): Integration, Redemption & Prophetic Empowerment"
};

export const DEFAULT_KAVANAH = "Please provide insight into my current spiritual path and areas for growth and Tikkun (rectification).";
export const APP_TITLE = "SODIC MIRROR™";
export const APP_TAGLINE = "See what your soul already knows.";
export const FOOTER_TEXT_PRIMARY = "This is not divination. This is Tikun.";
export const FOOTER_TEXT_SECONDARY = "Powered by HaMefaresh HaPenimi v6.1";
