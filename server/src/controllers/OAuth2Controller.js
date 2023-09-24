const User = require("../models/user");
const bcrypt = require("bcryptjs");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

exports.googleOAuth2 = async (token, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.connectServices.set("google", {
        access_token: token,
        refresh_token: refreshToken,
        data: {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        },
      });
      await user.save();
    } else {
      const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword,
        confirmed: true,
        isGoogleAuth: true,
        connectServices: {
          google: {
            accessToken: token,
            refreshToken: refreshToken,
            data: {
              id: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          },
        },
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};

exports.facebookOAuth2 = async (token, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.connectServices.set("facebook", {
        access_token: token,
        refresh_token: refreshToken,
        data: {
          id: profile.id,
          email: profile.emails[0].value,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
        },
      });
      await user.save();
    } else {
      const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        username: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        password: hashedPassword,
        confirmed: true,
        isFacebookAuth: true,
        connectServices: {
          facebook: {
            accessToken: token,
            refreshToken: refreshToken,
            data: {
              id: profile.id,
              email: profile.emails[0].value,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
            },
          },
        },
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};
