const router = require("express").Router();
const passport = require("passport");
const dbs = require("../../db").dbs();
const config = require("../../config.json");

router.get("/login", (req, res) => {
    const { message } = req.query;
    if (req.isAuthenticated()) {
        if (req.headers.referer && req.headers.referer.includes("?redirect=")) {
            const redirect = req.headers.referer.split("?redirect=")

            try {
                if (redirect[1].includes(config.url)) {
                    if (redirect[1].startsWith("http") || redirect[1].startsWith("https")) {
                        return res.redirect(`${redirect[1]}`)
                    } else {
                        return res.redirect(`/${redirect[1]}`)
                    }
                } else {
                    return res.redirect("/");
                }
            } catch (error) {
                console.log(error)
                return res.redirect("/")
            }
        } else {
            return res.redirect("/")
        }
    }

    if (message) {
        return res.render("login.ejs", { loggedIn: req.isAuthenticated(), config: req.config, message: message })
    } else if (req.headers.referer && !req.headers.referer.includes("/auth/register") && !req.headers.referer.includes("forgotpassword") && !req.query.redirect) {
        return res.redirect(`/login?redirect=${req.headers.referer.split("login")[0]}`)
    }

    res.render("login.ejs", { loggedIn: req.isAuthenticated(), config: req.config, message: false })
})

router.get("/login/discord", (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?response_type=code&redirect_uri=${config.url}login/discord/callback&scope=identify&client_id=${process.env.clientID}`)
})

router.get('/login/discord/callback', (req, res, next) => {
    const { code } = req.query;

    const data = new URLSearchParams()
    data.append('client_id', process.env.clientID)
    data.append('client_secret', process.env.clientSecret)
    data.append('grant_type', 'authorization_code')
    data.append('code', code)
    data.append('redirect_uri', `${config.url}login/discord/callback`)

    fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((body) => {
        return body.json()
    }).then((json) => {
        const { access_token, refresh_token } = json;
        fetch(`https://discord.com/api/users/@me`, {
            headers: {
                "authorization": `Bearer ${access_token}`
            }
        }).then((body) => {
            return body.json()
        }).then(async (json) => {
            const { id, username, discriminator, avatar } = json;

            const members = dbs.members.get("members") || [];

            const currUser = members.find(f => f?.discord?.id == id) || false;
            if (!currUser) {
                res.redirect("/login?message=That discord is not connected with any User!");
            } else {
                const userData = dbs.members.find("members", "userID", String(currUser.userID)) || false;

                userData.discord.name = `${username}#${discriminator}`;
                userData.discord.avatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=4096`;
                userData.discord.id = id;
                userData.discord.refresh_token = refresh_token;

                const filteredMembers = members.filter(f => f.userID !== userData.userID)
                filteredMembers.push(userData);
                dbs.members.set("members", filteredMembers)

                req.login(String(currUser.userID), function (err) {
                    if (err) { return next(err); }

                    res.cookie("remember", true, { maxAge: 1000 * 60 * 60 * 24 * 365 });
                    res.cookie("userID", currUser.userID, { maxAge: 1000 * 60 * 60 * 24 * 365 });

                    res.redirect("/")
                });
            }
        }).catch((err) => {
            return next(err);
        })
    }).catch((err) => {
        return next(err);
    })
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/forbidden',
    // failureFlash: true
}), (req, res) => {
    if (req.body.remember && req.body.remember == "on") {
        res.cookie("remember", true, { maxAge: 1000 * 60 * 60 * 24 * 365 })
        res.cookie("userID", req.user, { maxAge: 1000 * 60 * 60 * 24 * 365 })
    }

    if (req.headers.referer && req.headers.referer.includes("?redirect=")) {
        const redirect = req.headers.referer.split("?redirect=")

        try {
            if (redirect[i].includes(config.url)) {
                if (redirect[1].startsWith("http")) {
                    res.redirect(`${redirect[1]}`)
                } else {
                    res.redirect(`/${redirect[1]}`)
                }
            } else {
                res.redirect(`/`)
            }
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        if (err) return res.send(err)
        res.cookie("remember", false)
        res.redirect("/login")
    })
})

module.exports = router;