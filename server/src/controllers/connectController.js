const passport = require("passport");
const { registerOAuthSession, verifyOAuthSession } = require("../utils/OAuthSessionUtils");
require("../connection/youtubeStrategy");
require("../connection/gmailStrategy");
require("../connection/githubStrategy");
require("../connection/spotifyStrategy");
require("../connection/twitchStrategy");

exports.getYoutubeOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "youtube");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/youtube/callback",
        scopes: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/youtube",
        ],
        oAuthSessionId: oAuthSessionId,
    });
};


exports.youtubeCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "youtube");

        if (!user) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        passport.authenticate("youtube-connect", (err, authenticatedUser) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Internal server error." });
            }
            if (!authenticatedUser) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Authentication failed." });
            }
            res.json({
                status: "success",
                message: "Successfully connected with Youtube.",
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};

exports.getGmailOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "gmail");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/gmail/callback",
        scopes: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send"
        ],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.gmailCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "gmail");

        if (!user) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        passport.authenticate("gmail-connect", (err, authenticatedUser) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Internal server error." });
            }
            if (!authenticatedUser) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Authentication failed." });
            }
            res.json({
                status: "success",
                message: "Successfully connected with Gmail.",
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};


exports.getGithubOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "github");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GITHUB_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/github/callback",
        scopes: ["user", "repo", "user:email"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.githubCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "github");
        if (!user) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        passport.authenticate("github-connect", (err, authenticatedUser) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Internal server error." });
            }
            if (!authenticatedUser) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Authentication failed." });
            }
            res.json({
                status: "success",
                message: "Successfully connected with Github.",
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};

exports.getSpotifyOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "spotify");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/spotify/callback",
        scopes: [
            "user-library-read",
            "user-read-recently-played",
            "playlist-read-private",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-library-modify",
            "user-follow-modify",
        ],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.spotifyCallback = async (req, res, next) => {
    try {
        console.log("CALL_BACK");
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "spotify");

        if (!user) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        passport.authenticate("spotify-connect", (err, authenticatedUser) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Internal server error." });
            }
            if (!authenticatedUser) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Authentication failed." });
            }
            res.json({
                status: "success",
                message: "Successfully connected with Spotify.",
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};

exports.getTwitchOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "twitch");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.TWITCH_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/twitch/callback",
        scopes: ["user_read", "user:read:follows"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.twitchCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "twitch");
        if (!user) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        passport.authenticate("twitch-connect", (err, authenticatedUser) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Internal server error." });
            }
            if (!authenticatedUser) {
                return res
                    .status(401)
                    .json({ status: "failed", message: "Authentication failed." });
            }
            res.json({
                status: "success",
                message: "Successfully connected with Twitch.",
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};
