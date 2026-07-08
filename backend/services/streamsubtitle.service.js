const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { getSubtitle, getSubtitleDownloadLink } = require('./subtitle.service');
const { activeDownloads } = require('./download.service');

const SUBTITLE_DIR = path.join(__dirname, '../subtitles');

if (!fs.existsSync(SUBTITLE_DIR)) {
  fs.mkdirSync(SUBTITLE_DIR, { recursive: true });
}

const srtToVtt = (srtContent) => {
  let vtt = 'WEBVTT\n\n';
  vtt += srtContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  return vtt;
};

const scoreSubtitle = (slug, magnetInfo) => {
  let score = 0;
  const lowerSlug = (slug || '').toLowerCase();

  if (lowerSlug.includes('yify') || lowerSlug.includes('yts')) {
    score += 50;
  }

  const magType = (magnetInfo?.magType || '').toLowerCase();
  if (magType && (lowerSlug.includes(magType) || (magType.includes('bluray') && lowerSlug.includes('brrip')))) {
    score += 20;
  }

  const quality = (magnetInfo?.quality || '').toLowerCase();
  if (quality) {
    const qualityKeywords = [quality];
    if (quality === '2160p') qualityKeywords.push('4k', 'uhd');
    if (qualityKeywords.some(q => lowerSlug.includes(q))) {
      score += 10;
    }
  }

  const videoCodec = (magnetInfo?.video_codec || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (videoCodec && lowerSlug.replace(/[^a-z0-9]/g, '').includes(videoCodec)) {
    score += 10;
  }

  if (/\b(cam|ts|dvdrip)\b/.test(lowerSlug)) {
    score -= 50;
  }

  if (lowerSlug.includes('cd1') || lowerSlug.includes('cd2')) {
    score -= 20;
  }

  return score;
};

const pickBestSubtitle = (subtitlesByLang, lang, magnetInfo) => {
  const candidates = subtitlesByLang?.[lang] || [];
  if (candidates.length === 0) return null;
  if (!magnetInfo) return candidates[0];

  const scoredSubtitles = candidates.map(candidate => ({
    ...candidate,
    score: scoreSubtitle(candidate.slug, magnetInfo),
  }));

  scoredSubtitles.sort((a, b) => b.score - a.score);

  return scoredSubtitles[0];
};

const getActiveMagnetInfo = (movie) => {
  const activeKey = Object.keys(activeDownloads).find(key => key.startsWith(`${movie.tmdbId}-`));
  const activeQuality = activeKey ? activeKey.slice(String(movie.tmdbId).length + 1) : null;
  const byQuality = activeQuality && movie.magnetLinks?.find(m => m.quality === activeQuality);
  return byQuality || movie.magnetLinks?.[0] || null;
};

const getSubtitleVtt = async (movie, lang = 'en') => {

  const cacheFile = path.join(SUBTITLE_DIR, `${movie.tmdbId}-${lang}.vtt`);
  if (fs.existsSync(cacheFile)) {
    console.log(`📝 Subtitle from cache: ${lang}`);
    return fs.readFileSync(cacheFile, 'utf8');
  }

  console.log(`🔎 Looking up subtitle for: ${lang}`);
  const magnetInfo = getActiveMagnetInfo(movie);
  const subtitlesByLang = await getSubtitle(movie.imdbId, lang);
  const subtitle = pickBestSubtitle(subtitlesByLang, lang, magnetInfo);

  console.log(`📥📥📥 best sub [${lang}] ---> `, subtitle);

  if (!subtitle) {
    console.log(`❌ No subtitle found for: ${lang}`);
    return null;
  }

  const downloadLink = await getSubtitleDownloadLink(subtitle.fileId);
  if (!downloadLink) {
    console.log(`❌ No download link for: ${lang}`);
    return null;
  }

  console.log(`📥 Downloading subtitle: ${lang}`);
  const response = await axios.get(downloadLink, { responseType: 'text' });
  const srtContent = response.data;

  const vttContent = srtToVtt(srtContent);
  fs.writeFileSync(cacheFile, vttContent);
  console.log(`💾 Subtitle cached: ${cacheFile}`);

  return vttContent;
};

const getFallbackVtt = () => {
  return 'WEBVTT\n\n00:00:00.000 --> 00:00:20.000\nNO SUBTITLES FOUND\n';
};

module.exports = { getSubtitleVtt, getFallbackVtt };