const passport = require("passport");
const Strategy42 = require("passport-42").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models/user");

const createOrFindUser = async (provider, profile) => {
  let user = await User.findOne({
    oauthProvider: provider,
    oauthId: profile.id,
  });
  if (!user) {
    const baseUsername = (
      profile.displayName || profile.emails[0].value.split("@")[0]
    )
      .replace(/\s+/g, "_")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    let username = baseUsername;
    const existing = await User.findOne({ username });
    if (existing)
      username = `${baseUsername}_${Math.floor(Math.random() * 9999)}`;

    const existingEmail = await User.findOne({
      email: profile.emails[0].value,
    });
    if (existingEmail) {
      const err = new Error(
        "An account with this email already exists. Please log in with your password.",
      );
      err.status = 409;
      throw err;
    }

    let avatar = null;
    if (provider === "42") {
      avatar = profile._json.image.link || null;
    } else {
      avatar = profile.photos?.[0]?.value || null;
    }

    user = await User.create({
      username,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      oauthProvider: provider,
      oauthId: String(profile.id),
      isVerified: true,
      avatar,
    });
  }
  return user;
};

passport.use(
  new Strategy42(
    {
      clientID: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/42/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, await createOrFindUser("42", profile));
      } catch (err) {
        return done(null, false, {
          message: err.message,
          status: err.status || 400,
        });
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, await createOrFindUser("google", profile));
      } catch (err) {
        return done(null, false, {
          message: err.message,
          status: err.status || 400,
        });
      }
    },
  ),
);

module.exports = passport;
