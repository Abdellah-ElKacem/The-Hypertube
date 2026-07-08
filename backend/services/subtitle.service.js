const Movie = require("../models/movie");
const axios = require('axios');

const Subtitle_API_URL = process.env.Subtitle_API_URL;
const Subtitle_API_KEY = process.env.Subtitle_API_KEY;
const Subtitle_Username = process.env.OPEN_SUBTITLES_USERNAME;
const Subtitle_Password = process.env.OPEN_SUBTITLES_PASSWORD;
const Subtitle_User_Agent = process.env.OPEN_SUBTITLES_USER_AGENT;

let authToken = null;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loginToOpenSubtitles = async () => {
    const response = await axios.post(
        `${Subtitle_API_URL}login`,
        { username: Subtitle_Username, password: Subtitle_Password },
        {
            headers: {
                'Api-Key': Subtitle_API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': Subtitle_User_Agent
            }
        }
    );
    authToken = response.data.token;
};

const getSubtitle = async (imdb_code, preferredLanguage) => {
    try {
        const defaultLanguages = ['en'];
        if (preferredLanguage && preferredLanguage !== 'en') {
            defaultLanguages.push(preferredLanguage);
        }
        const languagesQuery = defaultLanguages.join(',');
        const response = await axios.get(`${Subtitle_API_URL}subtitles`, {
            params: {
                imdb_id: imdb_code,
                languages: languagesQuery
            },
            headers: {
                'Api-Key': Subtitle_API_KEY,
                'User-Agent': Subtitle_User_Agent
            }
        });
        const subtitles = response.data?.data || [];
        const sortedSubtitles = subtitles.sort((a, b) => {
            return (b.attributes.download_count || 0) - (a.attributes.download_count || 0);
        });
        const groupedByLanguage = {};
        for (const sub of sortedSubtitles) {
            const lang = sub.attributes.language.toLowerCase();
            const fileId = sub.attributes.files?.[0]?.file_id;
            const slug = sub.attributes.slug;

            if (fileId) {
                if (!groupedByLanguage[lang]) {
                    groupedByLanguage[lang] = [];
                }
                groupedByLanguage[lang].push({ fileId, slug });
            }
        }
        if (!authToken) {
            try {
                await loginToOpenSubtitles();
            } catch (loginErr) {
                console.error("Initial OpenSubtitles login failed:", loginErr.message);
                return {};
            }
        }
        return groupedByLanguage;
    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`Subtitle API service error: ${errorDetails}`);
    }
};


const getSubtitleDownloadLink = async (fileId) => {
    try {
        if (!authToken)
            await loginToOpenSubtitles();
        const response = await axios.post(`${Subtitle_API_URL}download`,
            { file_id: fileId },
            {
                headers: {
                    'Api-Key': Subtitle_API_KEY,
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'User-Agent': Subtitle_User_Agent
                }
            }
        );
        return response.data?.link || null;
    } catch (error) {
        if (error.response?.status === 401) {
            authToken = null;
            return await getSubtitleDownloadLink(fileId);
        }
        console.error('Subtitle download endpoint details:', error.response?.data || error.message);
        const statusCode = error.response?.status || 429;
        const err = new Error(`Subtitle API error: ${error.response?.data?.message || error.message}`);
        err.status = statusCode;
        throw err;    }
};

module.exports = { getSubtitle, getSubtitleDownloadLink };