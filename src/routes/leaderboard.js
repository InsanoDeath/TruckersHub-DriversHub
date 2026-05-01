const router = require("express").Router();
const dbs = require("../../db").dbs();

router.get("/leaderboard", (req, res, next) => {
    if (req.isAuthenticated()) {
        const date = new Date();
        
        const userData = req.userData;
        const perms = req.perms;
        const members = dbs.members.get("members") || [];
        let jobs = dbs.jobs.get("jobs") || [];

        members.forEach(m => {
            m.monthly = {
                allJobs: [],
                distance: 0,
                points: 0,
                jobs: 0,
                convoys: (m.convoys || []).filter(f => new Date(f.time)?.getFullYear() == date.getFullYear() && new Date(f.time).getMonth() == date.getMonth()).length
            };

            jobs.filter(f => {
                if (f?.driver?.steamID == m.steamID) {
                    const jobDate = new Date(f.realtime?.end);

                    if (jobDate?.getFullYear() == date.getFullYear() && jobDate.getMonth() == date.getMonth()) {
                        m.monthly.distance += f.distanceDriven;
                        m.monthly.points += f.points;
                        m.monthly.jobs++;
                    }
                }
            });
        })

        res.render("leaderboard.ejs", {
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