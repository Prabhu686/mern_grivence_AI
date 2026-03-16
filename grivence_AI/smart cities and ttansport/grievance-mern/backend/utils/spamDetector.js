/**
 * Fake/Spam Grievance Detection System
 */

const SPAM_INDICATORS = {
  spam_words: ['lottery', 'winner', 'prize', 'click here', 'buy now', 'offer', 'discount', 'free money', 'viagra', 'casino'],
  fake_patterns: ['test', 'testing', 'asdf', 'qwerty', '123456', 'aaaaa', 'zzzzz'],
  suspicious_phrases: ['give me money', 'send money', 'bank account', 'credit card', 'password']
};

const LEGITIMACY_INDICATORS = {
  has_location: 2,
  has_images: 3,
  detailed_description: 2,
  valid_contact: 1,
  specific_issue: 2
};

const detectFakeGrievance = (title, description, location, images = [], email = '', phone = '') => {
  let legitimacyScore = 0;
  let spamScore = 0;
  const flags = [];

  const fullText = `${title} ${description}`.toLowerCase();

  // Check for spam words
  SPAM_INDICATORS.spam_words.forEach(word => {
    if (fullText.includes(word)) {
      spamScore += 3;
      flags.push(`Contains spam word: "${word}"`);
    }
  });

  // Check for fake patterns
  SPAM_INDICATORS.fake_patterns.forEach(pattern => {
    if (fullText.includes(pattern)) {
      spamScore += 2;
      flags.push(`Contains suspicious pattern: "${pattern}"`);
    }
  });

  // Check for suspicious phrases
  SPAM_INDICATORS.suspicious_phrases.forEach(phrase => {
    if (fullText.includes(phrase)) {
      spamScore += 4;
      flags.push(`Contains suspicious phrase: "${phrase}"`);
    }
  });

  // Check legitimacy indicators
  if (location && location.length > 10) {
    legitimacyScore += LEGITIMACY_INDICATORS.has_location;
  }

  if (images && images.length > 0) {
    legitimacyScore += LEGITIMACY_INDICATORS.has_images;
  }

  if (description.length > 50 && description.split(' ').length > 10) {
    legitimacyScore += LEGITIMACY_INDICATORS.detailed_description;
  }

  if (email && email.includes('@') && phone && phone.length >= 10) {
    legitimacyScore += LEGITIMACY_INDICATORS.valid_contact;
  }

  // Check for specific issue keywords
  const issueKeywords = ['broken', 'not working', 'damaged', 'leak', 'problem', 'issue', 'need', 'repair'];
  if (issueKeywords.some(keyword => fullText.includes(keyword))) {
    legitimacyScore += LEGITIMACY_INDICATORS.specific_issue;
  }

  // Very short descriptions are suspicious
  if (description.length < 20) {
    spamScore += 2;
    flags.push('Description too short');
  }

  // All caps is suspicious
  if (title === title.toUpperCase() && title.length > 5) {
    spamScore += 1;
    flags.push('Title in all caps');
  }

  // Calculate final verdict
  const totalScore = legitimacyScore - spamScore;
  let isLegitimate = true;
  let confidence = 'High';
  let status = 'Verified';

  if (spamScore >= 5) {
    isLegitimate = false;
    confidence = 'High';
    status = 'Flagged as Spam';
  } else if (spamScore >= 3) {
    isLegitimate = false;
    confidence = 'Medium';
    status = 'Suspicious - Needs Review';
  } else if (totalScore < 3) {
    isLegitimate = true;
    confidence = 'Low';
    status = 'Needs Verification';
  } else {
    isLegitimate = true;
    confidence = 'High';
    status = 'Verified';
  }

  return {
    isLegitimate,
    confidence,
    status,
    legitimacyScore,
    spamScore,
    totalScore,
    flags: flags.length > 0 ? flags : ['No issues detected'],
    verifiedAt: new Date()
  };
};

module.exports = { detectFakeGrievance };
