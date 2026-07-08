const axios = require('axios');
const { getImdbId } = require('./metadata.service');
const Movie = require('../models/movie');


const YTS_BASE_API_URL = process.env.YTS_BASE_API_URL;

const getTorrents = async (imdb_Id) => {
    try {
        const response = await axios.get(`${YTS_BASE_API_URL}movie_details.json?imdb_id=${imdb_Id}`);
        const movieObj = response.data?.data?.movie;
        if (movieObj && movieObj.torrents && movieObj.torrents.length > 0) {
            return {
                title: movieObj.title_long || movieObj.title,
                torrents: movieObj.torrents.map(torrent => ({
                    quality:     torrent.quality,
                    size:        torrent.size,
                    hash:        torrent.hash,
                    seeds:       torrent.seeds,
                    magType:     torrent.type,
                    video_codec: torrent.video_codec
                }))
            };
        }
        const movieTitle = movieObj?.title || await getMovieTitleFallback(imdb_Id);
        if (!movieTitle)
            throw new Error(`No movie title found for IMDb ID ${imdb_Id}`);
        return await getFromArchive(movieTitle);
    } catch (error) {
        throw new Error(`YTS API error: ${error.message}`);
    }
}

const getMovieTitleFallback = async (imdb_Id) => {
    const dbMovie = await Movie.findOne({ imdbId: imdb_Id });
    if (dbMovie?.movieName) return dbMovie.movieName;
    try {
        const findResponse = await axios.get(
            `${process.env.TMDB_BASE_URL}/find/${imdb_Id}?api_key=${process.env.TMDB_API_KEY}&external_source=imdb_id`
        );
        return findResponse.data?.movie_results?.[0]?.title || null;
    } catch (e) {
        return null;
    }
}

// separate function for Archive.org
const getFromArchive = async (movieTitle) => {
    const searchRes = await axios.get(`https://archive.org/advancedsearch.php`, {
        params: {
            q: `title:("${movieTitle}") AND mediatype:(movies)`,
            output: 'json'
        }
    });

    const docs = searchRes.data?.response?.docs || [];
    const bestMatch = docs.find(doc => {
        const isTrailer = doc.subject?.some(s => s.toLowerCase().includes('trailer')) ||
            doc.title?.toLowerCase().includes('trailer');
        const isFullLength = doc.item_size ? parseInt(doc.item_size) > 400000000 : false;
        return !isTrailer && isFullLength;
    });

    if (!bestMatch) {
        console.log(`No acceptable items found on Archive.org for: ${movieTitle}`);
        return { title: movieTitle, torrents: [] };
    }

    const metadataRes = await axios.get(`https://archive.org/metadata/${bestMatch.identifier}`);
    const files = metadataRes.data?.files || [];
    const torrentFile = files.find(file => file.name.endsWith('.torrent'));

    if (!torrentFile?.btih)
        return { title: movieTitle, torrents: [] };

    return {
        title: movieTitle,
        torrents: [{
            quality:     'Archive-Source',
            size:        torrentFile.size,
            hash:        torrentFile.btih,
            seeds:       0,
            magType:     torrentFile.format,
            video_codec: null
        }]
    };
}

const buildMagnetLink = async (imdbId) => {
	try {
		const torrentsData = await getTorrents(imdbId);
		if (!torrentsData || !torrentsData.torrents || torrentsData.torrents.length === 0)
			return [];
		const trackers = [
			'udp://zer0day.ch:1337/announce',
			'udp://tracker.publictracker.xyz:6969/announce',
			'http://tracker.opentrackr.org:1337/announce',
			'udp://open.demonii.com:1337/announce',
			'udp://open.stealth.si:80/announce',
			'udp://tracker.torrent.eu.org:451/announce',
			'udp://tracker.qu.ax:6969/announce',
			'udp://tracker.dler.org:6969/announce',
			'udp://tracker.bittor.pw:1337/announce',
			'udp://tracker.auctor.tv:6969/announce',
			'udp://tracker.004430.xyz:1337/announce',
			'udp://tracker-udp.gbitt.info:80/announce',
			'udp://t.overflow.biz:6969/announce',
			'udp://retracker01-msk-virt.corbina.net:80/announce',
			'udp://leet-tracker.moe:1337/announce',
			'udp://explodie.org:6969/announce',
			'udp://bittorrent-tracker.e-n-c-r-y-p-t.net:1337/announce',
			'https://tracker.yemekyedim.com:443/announce',
			'https://tracker.nekomi.cn:443/announce',
			'https://tr.zukizuki.org:443/announce',
			'udp://retracker.hotplug.ru:2710/announce',
			'http://ipv4announce.sktorrent.eu:6969/announce',
			'http://tracker.mywaifu.best:6969/announce',
			'udp://evan.im:6969/announce',
			'udp://martin-gebhardt.eu:25/announce',
			'http://echostar.ddnsfree.com:8080/announce',
			'https://tr.nyacat.pw:443/announce',
			'udp://tracker.opentorrent.top:6969/announce',
			'udp://ns575949.ip-51-222-82.net:6969/announce',
			'udp://tracker.corpscorp.online:80/announce',
			'https://tracker.manager.v6.navy:443/announce',
			'udp://yuptracker-eu.gaijinent.com:27022/announce',
			'udp://tracker.aruku.ovh:8081/announce',
			'https://orgtgju.org:443/announce',
			'https://banananetwork.qzz.io:443/announce',
			'https://021912.xyz:443/announce',
			'udp://mail.segso.net:6969/announce',
			'https://ht.therarbg.to:443/announce',
			'udp://tracker.dler.com:6969/announce',
			'http://tracker.dhitechnical.com:6969/announce',
			'udp://tracker.bluefrog.pw:2710/announce',
			'udp://anime-tracker.aruku.kro.kr:8081/announce',
			'https://tracker.anibt.net:443/announce',
			'http://wegkxfcivgx.ydns.eu:80/announce',
			'udp://open.ftorrent.com:443/announce',
			'udp://tracker.teambelgium.net:6969/announce',
			'udp://tracker.gmi.gd:6969/announce',
			'https://tracker.7471.top:443/announce',
			'udp://tracker.trackarr.org:6969/announce',
			'https://t.213891.xyz:443/announce',
			'https://torrents.tmtime.dev:443/announce',
			'https://tracker.leechshield.link:443/announce',
			'udp://tracker.wildkat.net:6969/announce',
			'http://bt2.archive.org:6969/announce',
			'udp://torrentclub.online:1984/announce',
			'http://bt1.archive.org:6969/announce',
			'http://tracker.xn--djrq4gl4hvoi.top:80/announce',
			'https://004430.xyz:443/announce',
			'http://tracker.waaa.moe:6969/announce',
			'http://tracker.renfei.net:8080/announce',
			'http://tracker.ipv6tracker.ru:80/announce',
			'http://tracker.bt4g.com:2095/announce',
			'https://tracker.zhuqiy.com:443/announce',
			'udp://tracker.breizh.pm:6969/announce',
			'http://tracker.tritan.gg:8080/announce',
			'udp://tracker.hismz.cn:6969/announce',
		];
		const trackersString = trackers.map(t => `&tr=${encodeURIComponent(t)}`).join('');
		const title = encodeURIComponent(torrentsData.title);
		const magnetLinks = torrentsData.torrents.map(torrent => ({
			quality: torrent.quality,
			size: torrent.size,
			seeds: torrent.seeds,
			magType: torrent.magType,
			video_codec: torrent.video_codec,
			magnetLink: `magnet:?xt=urn:btih:${torrent.hash}&dn=${title}${trackersString}`
		}));
		return magnetLinks;
	} catch (error) {
		console.error(error.message);
		throw new Error(` build magnet link error : ${error.message}`);
	}
}

module.exports = { getTorrents, buildMagnetLink };
