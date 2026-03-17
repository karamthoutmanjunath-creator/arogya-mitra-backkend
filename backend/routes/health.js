const router = require('express').Router();

// GET /api/health — simple health check for Render monitoring
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// GET /api/symptoms — multilingual symptom guidance data
router.get('/symptoms', (_req, res) => {
  res.json({
    symptoms: {
      fever: {
        icon: '🤒',
        en: 'You may have a mild fever. Drink plenty of fluids, rest, and monitor temperature. Consult doctor if it persists.',
        hi: 'आपको हल्का बुखार हो सकता है। पर्याप्त पानी पिएँ, आराम करें। गंभीर होने पर डॉक्टर से मिलें।',
        te: 'మీకు తక్కువ జ్వరం ఉండవచ్చు। సరిపడా ద్రవాలు త్రాగండి, విశ్రాంతి తీసుకోండి।'
      },
      cough: {
        icon: '🤧',
        en: 'For cough, try warm steam and honey. Seek medical attention if cough is severe or persists.',
        hi: 'खांसी के लिए भाप और शहद लें। गंभीर होने पर डॉक्टर से मिलें।',
        te: 'జలుబు కోసం వేడి ఆవిరి, తేనె త్రాగండి। తీవ్రమైతే డాక్టర్‌ను సంప్రదించండి।'
      },
      stomach: {
        icon: '🤢',
        en: 'Stomach pain — avoid heavy meals, stay hydrated. Consult doctor if severe or blood present.',
        hi: 'पेट दर्द — भारी भोजन से बचें, हाइड्रेटेड रहें। गंभीर होने पर डॉक्टर से मिलें।',
        te: 'పొట్ట నొప్పి — భారం తినకుండా ఉండండి, సరిపడా ద్రవాలు త్రాగండి।'
      },
      headache: {
        icon: '🤕',
        en: 'Mild headache — rest in quiet place, drink water. See doctor if severe or frequent.',
        hi: 'हल्का सिरदर्द — शांत जगह पर आराम करें, पानी पीएँ। गंभीर होने पर डॉक्टर से मिलें।',
        te: 'తక్కువ తలనొప్పి — ప్రశాంత స్థలంలో విశ్రాంతి తీసుకోండి, నీరు త్రాగండి।'
      },
      fatigue: {
        icon: '😴',
        en: 'Feeling tired? Ensure good sleep, balanced diet, and hydration. Consult if chronic.',
        hi: 'थकान महसूस हो रही है? अच्छी नींद लें, संतुलित आहार लें। पुरानी हो तो डॉक्टर से मिलें।',
        te: 'అలసట అనుభూతి? మంచి నిద్ర, సమతుల ఆహారం తీసుకోండి।'
      },
      dizzy: {
        icon: '😵',
        en: 'Dizziness can indicate low BP or dehydration. Sit down, drink water. See doctor if persists.',
        hi: 'चक्कर आना कम बीपी या डिहाइड्रेशन का संकेत हो सकता है। बैठें, पानी पिएँ।',
        te: 'తల తిరగడం తక్కువ BP లేదా నిర్జలీకరణను సూచించవచ్చు। కూర్చోండి, నీళ్లు త్రాగండి।'
      }
    }
  });
});

module.exports = router;
