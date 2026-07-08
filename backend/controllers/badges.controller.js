const Rating = require("../models/Rating");
const Comment = require("../models/comment");
const { User } = require("../models/user");

const calculateBadges = (ratedCount) => {
    const badges = [];

    if (ratedCount >= 1 && ratedCount < 3)
        badges.push({
            name: 'First-Cut Critic',
            description: "You've officially entered the film critic scene!"
        });

    if (ratedCount >= 3 && ratedCount < 5)
        badges.push({
            name: 'Indie Reviewer',
            description: "You're expressing your unique voice and detailed thoughts."
        });

    if (ratedCount >= 5 && ratedCount < 10)
        badges.push({
            name: 'Feature Critic',
            description: "You are becoming a regular face at the local theater."
        });

    if (ratedCount >= 10 && ratedCount < 20)
        badges.push({
            name: 'Box Office Expert',
            description: "You have loud, frequent opinions on every film out there."
        });

    if (ratedCount >= 20 && ratedCount < 50)
        badges.push({
            name: 'Cinema Connoisseur',
            description: "You have reached legendary movie-master status."
        });

    return badges;
}


const getUserBadges = async (req, res) => {
    try {
        const userId = req.params.id;
        const ratedCount = await Rating.countDocuments({ userId })
        const badges = calculateBadges(ratedCount);
        res.status(200).json({success: true, data: badges});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

module.exports = { getUserBadges };