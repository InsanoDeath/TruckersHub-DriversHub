const router = require("express").Router();
const dbs = require("../../db").dbs();
const axios = require("axios");
const fs = require("fs");

const Jobs = require("../functions/jobs");
const jobs = new Jobs();

router.get("/api/stats", (req, res, next) => {
    const content = JSON.parse(fs.readFileSync("idb/idb.json", "utf-8") || {});
    res.send({
        error: true, success: false, response: {
            distance: content["totalDistance"],
            jobs: content["totalJobs"]
        }
    });
})

router.get("/api/jobs/:jobID", (req, res, next) => {
    const { jobID } = req.params;

    const currJob = dbs.jobs.find("jobs", "jobID", jobID) || false;

    res.send({ error: false, success: true, response: currJob });
})

router.post("/api/delivery", async (req, res) => {
    const { type, data } = req.body;

    if (type == "job.delivered") {
        const jobExists = dbs.jobs.find("jobs", "jobID", data.jobID) || false;
        if (jobExists) return res.sendStatus(403);

        res.sendStatus(200);

        await jobs.save(data);
    }
})

// To delete Jobs
start();
function start() {
    setTimeout(start, 1000 * 60 * 60 * 24);

    let jobs = dbs.jobs.get("jobs") || [];
    jobs = jobs.filter(f => {
        const jobDate = new Date(f?.realtime?.end);

        if (jobDate && jobDate.getMonth() == new Date().getMonth()) {
            return f;
        } else if (jobDate && jobDate.getMonth() == new Date(new Date().getMonth() - 1).getMonth()) {
            return f;
        } else if (jobDate && jobDate.getMonth() == new Date(new Date().getMonth() - 2).getMonth()) {
            return f;
        } else if (jobDate && jobDate.getMonth() == new Date(new Date().getMonth() - 3).getMonth()) {
            return f;
        }
    })
    dbs.jobs.set("jobs", jobs);
}

module.exports = router;