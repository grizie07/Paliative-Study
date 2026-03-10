export const ESAS_FIELDS = [
  { key: "pain", label: { en: "Pain", hiLatn: "Dard", hi: "दर्द" } },
  { key: "tiredness", label: { en: "Tiredness", hiLatn: "Thakaan", hi: "थकान" } },
  { key: "drowsiness", label: { en: "Drowsiness", hiLatn: "Nind ya jhapki", hi: "नींद या झपकी" } },
  { key: "nausea", label: { en: "Nausea", hiLatn: "Matli", hi: "मतली" } },
  { key: "appetite", label: { en: "Lack of Appetite", hiLatn: "Bhukh ki kami", hi: "भूख की कमी" } },
  { key: "shortnessOfBreath", label: { en: "Shortness of Breath", hiLatn: "Saans lene mein takleef", hi: "साँस लेने में तकलीफ़" } },
  { key: "depression", label: { en: "Depression", hiLatn: "Udaasi / Avsaad", hi: "उदासी / अवसाद" } },
  { key: "anxiety", label: { en: "Anxiety", hiLatn: "Ghabrahat / Chinta", hi: "घबराहट / चिंता" } },
  { key: "wellbeing", label: { en: "Well-being", hiLatn: "Kul milaakar sthiti", hi: "कुल मिलाकर स्थिति" } },
  { key: "otherProblem", label: { en: "Other problem", hiLatn: "Koi aur samasya", hi: "कोई और समस्या" } }
];

export const ESAS_SCALE = {
  min: { en: "0 = No symptom", hiLatn: "0 = Koi lakshan nahin", hi: "0 = कोई लक्षण नहीं" },
  max: { en: "10 = Worst possible", hiLatn: "10 = Sabse zyada", hi: "10 = सबसे ज़्यादा" }
};

export const QLQ_4_OPTIONS = [
  { value: 1, en: "Not at all", hiLatn: "Bilkul nahin", hi: "बिल्कुल नहीं" },
  { value: 2, en: "A little", hiLatn: "Thoda", hi: "थोड़ा" },
  { value: 3, en: "Quite a bit", hiLatn: "Kaafi had tak", hi: "काफ़ी हद तक" },
  { value: 4, en: "Very much", hiLatn: "Bahut zyada", hi: "बहुत ज़्यादा" }
];

export const QLQ_7_OPTIONS = [
  { value: 1, en: "Very poor", hiLatn: "Bahut kharab", hi: "बहुत खराब" },
  { value: 2, en: "Poor", hiLatn: "Kharab", hi: "खराब" },
  { value: 3, en: "Fair", hiLatn: "Theek-thaak", hi: "ठीक-ठाक" },
  { value: 4, en: "Good", hiLatn: "Achha", hi: "अच्छा" },
  { value: 5, en: "Very good", hiLatn: "Bahut achha", hi: "बहुत अच्छा" },
  { value: 6, en: "Excellent", hiLatn: "Utkrisht", hi: "उत्कृष्ट" },
  { value: 7, en: "Best possible", hiLatn: "Sabse achha", hi: "सबसे अच्छा" }
];

export const QLQ_QUESTIONS = [
  ...Array.from({ length: 28 }, (_, i) => ({
    key: `q${i + 1}`,
    group: i < 10 ? "part1" : i < 20 ? "part2" : "part3",
    scale: "four",
    label: {
      en: `QLQ Question ${i + 1}`,
      hiLatn: `QLQ Prashn ${i + 1}`,
      hi: `QLQ प्रश्न ${i + 1}`
    }
  })),
  {
    key: "q29",
    group: "part3",
    scale: "seven",
    label: {
      en: "Global health status question 1",
      hiLatn: "Kul swasthya sthiti prashn 1",
      hi: "कुल स्वास्थ्य स्थिति प्रश्न 1"
    }
  },
  {
    key: "q30",
    group: "part3",
    scale: "seven",
    label: {
      en: "Global quality of life question 2",
      hiLatn: "Jeevan ki gunvatta prashn 2",
      hi: "जीवन की गुणवत्ता प्रश्न 2"
    }
  }
];

export function getText(obj, language) {
  return obj?.[language] || obj?.en || "";
}