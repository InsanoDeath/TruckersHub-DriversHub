const router = require("express").Router();
const dbs = require("../../db").dbs();
const axios = require("axios");

router.get("/jobs", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        const date = new Date(new Date().setDate(1));
        const month = date.getMonth();
        const year = date.getFullYear();


        const jobs = dbs.jobs.get("jobs") || [];
        const filteredJobs = jobs.filter(f => new Date(f.realtime.end).getMonth() == month && new Date(f.realtime.end).getFullYear() == year)
        filteredJobs.sort((a, b) => {
            return b.jobID - a.jobID;
        })

        res.render("jobs.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            jobs: filteredJobs
        })
    } else {
        res.redirect("/login");
    }
})

router.get("/jobs/:jobID", (req, res, next) => {
    const { jobID } = req.params;
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        const filteredJob = dbs.jobs.find("jobs", "jobID", jobID) || false;
        if (!filteredJob) {
            const error = new Error("Job ID not found")
            error.status = 404;
            return next(error);
        }

        res.render("eachjob.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            job: filteredJob
        })
    } else {
        res.redirect("/login");
    }
})

router.get("/jobs/:jobID/route", async (req, res, next) => {
    const { jobID } = req.params;

    const body = await axios(`https://api.truckershub.in/v1/routes/${jobID}`, {
        headers: {
            "Authorization": `${process.env.truckershub}`,
            "Content-Type": 'application/json'
        }
    }).catch((err) => { console.log(err) });
    const json = await body?.data || false;

    res.send(json);
})

router.delete("/jobs/:jobID", (req, res, next) => {
    const { jobID } = req.params;

    const jobs = dbs.jobs.get("jobs") || [];
    const currJob = jobs.find(f => f.jobID == jobID);
    const otherJobs = jobs.filter(f => f.jobID != jobID);

    if (currJob) {
        const members = dbs.jobs.get("members") || [];
        const userData = members.find(f => f.steamID == currJob.driver.steamID);

        if (userData) {
            // Setting Points
            let points = currJob.points;

            // setting user points
            const getUserData = dbs.members.find("members", "userID", String(userData.userID))
            if (getUserData) {
                getUserData.NXP -= points;
                getUserData.distance -= currJob.distanceDriven;
                getUserData.jobs--;

                const filteredMembers = members.filter(f => f.userID !== userData.userID);
                filteredMembers.push(getUserData);
                dbs.members.set("members", filteredMembers);
            }
        }
        dbs.jobs.set("jobs", otherJobs);

        res.send({ error: false, message: "success" });
    } else {
        res.send({ error: true, message: "Internal Error" });
    }
})

module.exports = router;