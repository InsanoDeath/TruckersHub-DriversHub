const router = require("express").Router();
const axios = require("axios");
const config = require("../../config.json");

router.get("/news", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        await axios(`https://api.truckersmp.com/v2/vtc/${config.vtcID}/news`).then((json) => {
            if (!json.data.error) {
                const { news } = json.data.response;

                res.render("news.ejs", {
                    loggedIn: req.isAuthenticated(),
                    config: req.config,
                    data: userData,
                    perms: perms,
                    news: news
                })
            } else {
                res.render("news.ejs", {
                    loggedIn: req.isAuthenticated(),
                    config: req.config,
                    data: userData,
                    perms: perms,
                    news: []
                })
            }
        }).catch((err) => {
            res.render("news.ejs", {
                loggedIn: req.isAuthenticated(),
                config: req.config,
                data: userData,
                perms: perms,
                news: []
            })
        });
    } else {
        res.redirect("/login");
    }
})

module.exports = router;