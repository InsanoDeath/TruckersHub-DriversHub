const router = require("express").Router();
const dbs = require("../../db").dbs();
const config = require("../../config.json");

router.get("/theme.css", (req, res) => {
    res.type("text/css");
    res.send(`
    :root {
        --bs-primary: ${config.color};
        --bs-secondary: ${config.color}74
    }
  `);
})

router.get("/footer.js", (req, res) => {
    res.type("application/javascript");
    res.send(`const footer = document.querySelector("footer");
                if(footer) {
                    footer.innerHTML = \`<div class="container-fluid">
                                            <div class="row align-items-center justify-content-lg-between">
                                                <div class="col-lg-6 mb-lg-0 mb-4">
                                                    <div class="copyright text-center text-sm text-muted text-lg-start">
                                                        © ${new Date().getFullYear()},
                                                        made with <i class="fa fa-heart"></i> by
                                                        <a href="https://insnaodev.com/" class="font-weight-bold" target="_blank">InsanoDeath</a>.
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="mb-0 text-secondary text-end">
                                                        Powered by
                                                        <img src="https://static.truckershub.in/images/logo.png" alt="TruckersHub Logo" style="width: 20px;">
                                                        <a href="https://truckershub.in/" target="_blank">TruckersHub</a>.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>\`;
                }`);
})

router.get("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;
        const members = dbs.members.get("members") || [];
        let jobs = dbs.jobs.get("jobs") || [];

        const data = {
            distance: dbs.idb.get("totalDistance") || 0,
            jobs: dbs.idb.get("totalJobs") || 0,
            income: dbs.idb.get("totalIncome") || 0,
            fuel: dbs.idb.get("totalFuel") || 0,
            data: [],
            ets2: dbs.idb.get("ets2Jobs") || 0,
            ats: dbs.idb.get("atsJobs") || 0
        }

        const date = new Date();
        data.data.unshift(dbs.idb.get(`job-${date.getMonth() + 1}-${date.getFullYear()}`) || 0);

        for (var i = 0; i < 11; i++) {
            const currDate = new Date(date.setMonth(date.getMonth() - 1));

            data.data.unshift(dbs.idb.get(`job-${currDate.getMonth() + 1}-${currDate.getFullYear()}`) || 0);
        }

        jobs = jobs.filter(f => new Date(f.realtime.end).getMonth() == new Date().getMonth() && new Date(f.realtime.end).getFullYear() == new Date().getFullYear());

        for (var i = 0; i < jobs.length; i++) {
            const currMember = members.find(f => f.steamID == jobs[i].driver.steamID) || false;
            if (currMember) {
                const currJobTime = new Date(jobs[i].realtime.end);
                if (!currMember.monthMile) currMember.monthMile = 0;

                if (new Date().getUTCMonth() == currJobTime.getUTCMonth() && new Date().getUTCFullYear() == currJobTime.getUTCFullYear()) {
                    currMember.monthMile += (jobs[i].distanceDriven * 0.62);
                }
            }
        }

        res.render("index.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            main: data,
            jobs: jobs,
            members: members
        })
    } else {
        res.redirect("/login");
    }
})

module.exports = router;