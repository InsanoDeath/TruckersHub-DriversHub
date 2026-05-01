const router = require("express").Router();
const dbs = require("../../db").dbs();

router.get("/members", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        const members = dbs.members.get("members") || [];
        members.sort((a, b) => {
            return a.userID - b.userID;
        })

        res.render("members.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            members: members
        })
    } else {
        res.redirect("/login");
    }
})

module.exports = router;