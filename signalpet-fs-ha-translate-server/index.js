
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const cache = {};
const supportedLanguages = ['en', 'de', 'es', 'fr', 'pt'];

app.post('/translate/batch', async (req, res) => {
  let { texts, targetLang } = req.body;
  console.log('Received texts for translation:', texts);

  if (!Array.isArray(texts) || typeof targetLang !== 'string') {
    return res.status(400).json({ error: 'Invalid input types.' });
  }

  targetLang = targetLang.replace(/[<>]/g, '');

  if (!supportedLanguages.includes(targetLang)) {
    return res.status(400).json({ error: 'Unsupported language code.' });
  }

  if (targetLang === 'en') {
    return res.json({ translations: texts });
  }

  try {
    const sanitizedTexts = texts.map((text) => {
      if (typeof text !== 'string') {
        return '';
      }
      return text.replace(/[<>]/g, '');
    });

    const cacheKeys = sanitizedTexts.map((text) => `${text}_${targetLang}`);
    const translations = [];
    const textsToTranslate = [];
    const indicesToTranslate = [];

    cacheKeys.forEach((cacheKey, index) => {
      if (cache[cacheKey]) {
        console.log("Using Cache");
     
        translations[index] = cache[cacheKey];
      } else {
      
        textsToTranslate.push(sanitizedTexts[index]);
        indicesToTranslate.push(index);
      }
    });


    if (textsToTranslate.length > 0) {
  
      const response = await axios.post('http://localhost:5000/translate', {
        q: textsToTranslate,
        source: 'en',
        target: targetLang,
        format: 'text',
      });

    
      const fetchedTranslations = response.data.translatedText;


      if (!Array.isArray(fetchedTranslations) || fetchedTranslations.length !== textsToTranslate.length) {
        console.error('Mismatch in number of translations received.');
        return res.status(500).json({ error: 'Translation failed.' });
      }

  
      fetchedTranslations.forEach((translatedSegment, idx) => {
        const index = indicesToTranslate[idx];
        const cacheKey = cacheKeys[index];
 
        cache[cacheKey] = translatedSegment;

        translations[index] = translatedSegment;
      });
    }


    res.json({ translations });
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({ error: 'Translation failed.' });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
