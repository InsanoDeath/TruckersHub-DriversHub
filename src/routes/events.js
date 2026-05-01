const router = require("express").Router();
const axios = require("axios");
const config = require("../../config.json");

router.get("/events", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        axios(`https://api.truckersmp.com/v2/vtc/${config.vtcID}/events/attending`).then((json) => {
            const { response } = json.data;
            
            res.render("events.ejs", {
                loggedIn: req.isAuthenticated(),
                config: req.config,
                data: userData,
                perms: perms,
                events: response,
                admins: req.config.admins
            })
        }).catch((err) => {
            res.send({ error: true, success: false, message: String(err) });
        })
    } else {
        res.redirect("/login");
    }
})

module.exports = router;