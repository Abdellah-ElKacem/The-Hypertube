const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const { User } = require('../models/user');
const { getSubtitleVtt, getFallbackVtt } = require('../services/streamsubtitle.service');
const auth = require('../middlewares/auth');

router.get('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    const prefLang = user?.subtitlePreference || 'en';
    const lang = req.query.lang || prefLang;

    const movie = await Movie.findOne({ tmdbId: Number(movieId) });
    if (!movie) {
      return res.status(404).json({ error: '1 - Movie not found' });
    }

    const enVtt = await getSubtitleVtt(movie, 'en');

    let vttContent = enVtt;
    if (lang !== 'en') {
      vttContent = await getSubtitleVtt(movie, lang);
      if (!vttContent) {
        console.log(`⚠️ No subtitle for ${lang}, falling back to en`);
        vttContent = enVtt;
      }
    }

    if (!vttContent) {
      console.log(`⚠️ No subtitle found at all for movie ${movieId}, sending fallback`);
      vttContent = getFallbackVtt();
    }

    res.setHeader('Content-Type', 'text/vtt');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(vttContent);

  } catch (err) {
    console.log('❌ Subtitle error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;