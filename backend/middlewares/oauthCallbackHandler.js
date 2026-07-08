const passport = require("passport");

module.exports = function (strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      const frontendUrl = process.env.FRONTEND_URL;

      if (err) {
        console.error(err);
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
      }

      if (!user) {
        if (info?.status) {
          return res.redirect(
            `${frontendUrl}/login?error=oauth_failed&message=${encodeURIComponent(info.message)}`,
          );
        }

        return res.redirect(`${frontendUrl}/login?error=oauth_denied`);
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
