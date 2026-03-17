/**
 * AI-Powered Smart Complaint Analyzer
 */

const PRIORITY_KEYWORDS = {
  critical: ['emergency', 'urgent', 'critical', 'danger', 'dangerous', 'severe', 'immediate', 'crisis', 'not working', 'not functioning', 'broken', 'damaged'],
  high: ['serious', 'major', 'important', 'leak', 'accident', 'problem', 'issue'],
  medium: ['concern', 'repair', 'fix', 'need', 'require'],
  low: ['minor', 'small', 'suggestion', 'request', 'improvement']
};

const CATEGORY_KEYWORDS = {
  'Water & Sanitation': ['water', 'drinking water', 'water supply', 'water pipe', 'burst pipe', 'sewage', 'sewer', 'pipe', 'leak', 'tap', 'flood', 'flooding', 'drainage', 'drain', 'garbage', 'waste', 'sanitation', 'toilet', 'flush', 'overflow', 'contamination'],
  'Electricity': ['electricity', 'electric', 'power cut', 'power outage', 'power failure', 'streetlight', 'street light', 'lamp', 'bulb', 'transformer', 'outage', 'blackout', 'voltage', 'wiring', 'wire', 'pole', 'generator'],
  'Roads & Transport': ['road', 'pothole', 'traffic', 'traffic signal', 'highway', 'bridge', 'footpath', 'pavement', 'bus stop', 'vehicle', 'speed breaker', 'divider', 'road repair', 'road damage'],
  'Public Safety': ['police', 'crime', 'theft', 'robbery', 'fire', 'danger', 'unsafe', 'harassment', 'violence', 'cctv'],
  'Healthcare': ['hospital', 'clinic', 'medical', 'health', 'doctor', 'ambulance', 'patient', 'medicine', 'nurse'],
  'Education': ['school', 'college', 'education', 'teacher', 'student', 'university', 'classroom', 'library'],
  'Environment': ['pollution', 'air pollution', 'noise pollution', 'tree', 'park', 'garden', 'forest', 'cleanliness', 'stray dog', 'mosquito', 'pest']
};

const matchKeyword = (text, keyword) => {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
};

const analyzeComplaint = (title, description, location = '') => {
  try {
    const fullText = `${title} ${description} ${location}`.toLowerCase();

    const summary = description.split(/[.!?]/)[0].substring(0, 150) || title.substring(0, 100);

    let priorityScore = 0;
    if (PRIORITY_KEYWORDS.critical.some(k => matchKeyword(fullText, k))) priorityScore = 4;
    else if (PRIORITY_KEYWORDS.high.some(k => matchKeyword(fullText, k))) priorityScore = 3;
    else if (PRIORITY_KEYWORDS.medium.some(k => matchKeyword(fullText, k))) priorityScore = 2;
    else priorityScore = 1;

    const aiPriority = priorityScore >= 4 ? 'Critical' : priorityScore >= 3 ? 'High' : priorityScore >= 2 ? 'Medium' : 'Low';

    let maxScore = 0;
    let aiCategory = 'Administration';
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = keywords.filter(k => matchKeyword(fullText, k)).length;
      if (score > maxScore) {
        maxScore = score;
        aiCategory = cat;
      }
    }

    const impactScore = Math.min(10, priorityScore * 2 + (fullText.includes('many') || fullText.includes('days') ? 2 : 0));

    return {
      aiSummary: summary,
      aiPriority,
      aiCategory,
      aiImpactScore: impactScore,
      aiAnalyzedAt: new Date()
    };
  } catch (error) {
    return {
      aiSummary: title.substring(0, 100),
      aiPriority: 'Medium',
      aiCategory: 'Administration',
      aiImpactScore: 5,
      aiAnalyzedAt: new Date()
    };
  }
};

module.exports = { analyzeComplaint };
