const Tesseract = require('tesseract.js');

/**
 * Extract text from an image buffer using Tesseract OCR.
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} lang - Language hint ('eng', 'hin', 'tel')
 * @returns {Promise<string>} Extracted text
 */
async function extractText(imageBuffer, lang = 'eng') {
  const { data: { text } } = await Tesseract.recognize(imageBuffer, lang, {
    logger: info => {
      if (info.status === 'recognizing text') {
        const pct = Math.round((info.progress || 0) * 100);
        if (pct % 25 === 0) console.log(`   OCR progress: ${pct}%`);
      }
    }
  });
  return text.trim();
}

/**
 * Basic regex-based parser to extract medicine info from OCR text.
 * This is a best-effort parser — real-world prescriptions vary widely.
 */
function parseMedicines(text) {
  const medicines = [];
  const lines = text.split('\n').filter(l => l.trim());

  // Common medicine patterns
  const medPatterns = [
    // "Paracetamol 500mg" or "Tab. Paracetamol 500 mg"
    /(?:tab\.?|cap\.?|syp\.?|inj\.?)?\s*([A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+\s*(?:mg|ml|mcg|g))/gi,
  ];

  const dosagePatterns = [
    /(\d+)\s*(?:times?\s*(?:a\s*)?day|x\s*daily|\/day|BD|TDS|OD|QID)/gi,
    /(once|twice|thrice|one|two|three)\s*(?:a\s*)?(?:day|daily)/gi,
  ];

  const mealPatterns = [
    /(before|after|with)\s*(?:food|meal|breakfast|lunch|dinner)/gi,
    /(empty\s*stomach)/gi,
  ];

  const durationPatterns = [
    /(?:for\s*)?(\d+)\s*(?:days?|weeks?|months?)/gi,
  ];

  // Try to extract structured data from each line
  for (const line of lines) {
    let medMatch = null;
    for (const pattern of medPatterns) {
      pattern.lastIndex = 0;
      medMatch = pattern.exec(line);
      if (medMatch) break;
    }

    if (medMatch) {
      const medicine = {
        name: medMatch[1].trim(),
        dosage: medMatch[2] ? medMatch[2].trim() : '',
        frequency: '',
        mealTiming: '',
        duration: ''
      };

      // Extract frequency
      for (const pattern of dosagePatterns) {
        pattern.lastIndex = 0;
        const freqMatch = pattern.exec(line);
        if (freqMatch) {
          medicine.frequency = freqMatch[0].trim();
          break;
        }
      }

      // Extract meal timing
      for (const pattern of mealPatterns) {
        pattern.lastIndex = 0;
        const mealMatch = pattern.exec(line);
        if (mealMatch) {
          medicine.mealTiming = mealMatch[0].trim();
          break;
        }
      }

      // Extract duration
      for (const pattern of durationPatterns) {
        pattern.lastIndex = 0;
        const durMatch = pattern.exec(line);
        if (durMatch) {
          medicine.duration = durMatch[0].trim();
          break;
        }
      }

      medicines.push(medicine);
    }
  }

  return medicines;
}

module.exports = { extractText, parseMedicines };
