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
  'Electricity': ['electricity', 'electric', 'power', 'light', 'lighting', 'streetlight', 'street light', 'lamp', 'bulb', 'transformer', 'outage', 'blackout', 'voltage', 'wiring', 'pole'],
  'Roads & Transport': ['road', 'street', 'pothole', 'traffic', 'signal', 'highway', 'bridge', 'footpath', 'pavement', 'crossing', 'transport'],
  'Water & Sanitation': ['water', 'drainage', 'sewage', 'pipe', 'leak', 'garbage', 'waste', 'sanitation', 'toilet', 'drain', 'sewer'],
  'Public Safety': ['police', 'crime', 'safety', 'security', 'theft', 'accident', 'emergency', 'fire', 'danger'],
  'Healthcare': ['hospital', 'clinic', 'medical', 'health', 'doctor', 'ambulance', 'patient'],
  'Education': ['school', 'college', 'education', 'teacher', 'student', 'university', 'class'],
  'Environment': ['pollution', 'tree', 'park', 'noise', 'cleanliness', 'garden', 'forest', 'environment']
};

const analyzeComplaint = (title, description, location = '') => {
  try {
    const fullText = `${title} ${description} ${location}`.toLowerCase();
    
    const summary = description.split(/[.!?]/)[0].substring(0, 150) || title.substring(0, 100);
    
    let priorityScore = 0;
    if (PRIORITY_KEYWORDS.critical.some(k => fullText.includes(k))) priorityScore = 4;
    else if (PRIORITY_KEYWORDS.high.some(k => fullText.includes(k))) priorityScore = 3;
    else if (PRIORITY_KEYWORDS.medium.some(k => fullText.includes(k))) priorityScore = 2;
    else priorityScore = 1;
    
    const aiPriority = priorityScore >= 4 ? 'Critical' : priorityScore >= 3 ? 'High' : priorityScore >= 2 ? 'Medium' : 'Low';
    
    let maxScore = 0;
    let aiCategory = 'Administration';
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = keywords.filter(k => fullText.includes(k)).length;
      if (score > maxScore) {
        maxScore = score;
        aiCategory = cat;
      }
    }
    
    const impactScore = Math.min(10, priorityScore * 2 + (fullText.includes('many') || fullText.includes('days') ? 2 : 0));
    
    return {
      aiSummary: summary,
      aiPriority: aiPriority,
      aiCategory: aiCategory,
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
