const mongoose = require('mongoose');

const mongoUri = "mongodb+srv://yasmine:Lachhab2002@hypertube.cld0yjz.mongodb.net/?appName=Hypertube";

async function run() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(mongoUri);
        console.log("Connected successfully!");

        // Define a simple Movie schema to query
        const movieSchema = new mongoose.Schema({}, { strict: false });
        const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema, 'movies');

        console.log("Searching for movie with tmdbId 16859...");
        const movieByTmdb = await Movie.findOne({ tmdbId: 16859 });
        console.log("Found by tmdbId (number):", movieByTmdb);

        const movieByTmdbStr = await Movie.findOne({ tmdbId: "16859" });
        console.log("Found by tmdbId (string):", movieByTmdbStr);

        console.log("Searching by _id or other fields...");
        const movieByAny = await Movie.findOne({
            $or: [
                { _id: "16859" },
                { imdbId: "16859" },
                { imdbId: "tt16859" },
                { tmdbId: 16859 },
                { tmdbId: "16859" }
            ]
        });
        console.log("Found by any ID matching '16859':", movieByAny);

        if (!movieByAny) {
            console.log("Getting a sample movie from database to inspect schema/values...");
            const sample = await Movie.findOne();
            console.log("Sample movie:", sample);
        }

    } catch (err) {
        console.error("Error running query:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

run();
