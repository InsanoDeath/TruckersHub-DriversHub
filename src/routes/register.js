const router = require("express").Router();
const passport = require("passport");
const dbs = require("../../db").dbs()
const axios = require("axios");
const ct = require('countries-and-timezones');
const bcrypt = require("bcrypt");
const config = require("../../config.json");

const Jobs = require("../functions/jobs");
const jobsFunc = new Jobs();

router.get("/register", (req, res) => {
    res.redirect("/auth/register/associate");
})

router.get("/auth/register/associate", passport.authenticate("steam"))
router.get("/redirect", passport.authenticate("steam", {
    failureRedirect: "/fobidden",
    successRedirect: "/auth/register"
}), function (req, res) {
    res.sendStatus(200)
    // res.redirect('back')
})

router.get("/auth/register", (req, res) => {
    if (req.isUnauthenticated()) {
        res.redirect("/register")
    } else {
        const countries = ct.getAllCountries();
        const country = Object.keys(countries).map((key) => countries[key]);

        res.render("registerauth.ejs", { country: country, config: req.config })
    }
})

router.get("/fobidden", (req, res, next) => {
    const error = new Error("That Steam ID already exists and is already registered")
    error.status = 403;
    return next(error)
})

router.get("/forbidden", (req, res) => {
    res.redirect("/login?message=Credentials entered does not match please try again")
})

router.post("/registration", (req, res) => {
    const { username, email, password, country } = req.body;

    const { user } = req;
    if (!user) return res.redirect("/register");

    const dbdata = dbs.logins.get("logins") || [];
    const filteredData = dbdata.find(d => d.username.toLowerCase() == username.toLowerCase() || d.email.toLowerCase() == email.toLowerCase() || d.steamID == user) || false;

    if (filteredData) return res.send({
        error: true,
        message: "The data you entered already exists or the steam ID is already registered"
    })

    axios(`https://api.truckersmp.com/v2/player/${user}`).then(async (json) => {
        if (!json.data.error) {
            let userID = dbs.idb.get("userID") || 0;
            const currentID = ++userID;
            dbs.idb.set("userID", currentID);

            let countryCode = "World";
            let utcOffset = "0";
            let timezone = "Africa/Abidjan";

            try {
                const timezones = ct.getTimezonesForCountry(country);
                const getCountry = ct.getCountry(country)
                if (getCountry) {
                    countryCode = getCountry.name
                    timezone = getCountry.timezones[0];
                }
                try {
                    utcOffset = timezones[0].utcOffset
                } catch (error) { }

                axios(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API}&steamid=${user}&format=json`).then(async (respo) => {
                    let ets2;
                    let ats;

                    try {
                        ets2 = respo.data.response.games.find(g => g.appid == "227300")
                    } catch (error) {
                        ets2 = false
                    }

                    try {
                        ats = respo.data.response.games.find(g => g.appid == "270880")
                    } catch (error) {
                        ats = false
                    }

                    let games = []

                    if (ets2) {
                        games.push("ets2")
                    }

                    if (ats) {
                        games.push("ats")
                    }

                    try {
                        const hashedPassword = await bcrypt.hash(password, 10)

                        const data = {
                            username: username,
                            email: email.toLowerCase(),
                            password: hashedPassword,
                            steamID: user,
                            userID: currentID
                        }

                        const userData = {
                            username: username,
                            email: email.toLowerCase(),
                            steamID: user,
                            userID: currentID,
                            TMPID: json.data.response.id,
                            points: 0,
                            distance: 0,
                            jobs: 0,
                            level: 1,
                            rank: "Driver",
                            rankColor: config.color,
                            avatar: "avatars\\no-avatar.png",
                            role: "Driver",
                            roleColor: config.color,
                            country: countryCode,
                            countryCode: `en-${country}`,
                            timezone: timezone,
                            utcOffset: utcOffset,
                            games: games,
                            joinedDate: Date.now()
                        }

                        let members = dbs.members.get("members") || [];
                        const filteredMembers = members.filter(f => f.userID !== userData.userID)
                        filteredMembers.push(userData);
                        dbs.members.set("members", filteredMembers);


                        try {
                            dbs.logins.push("logins", data)
                        } catch (error) {
                            dbs.logins.set("logins", [data])
                        }

                        if (config.previousJobs) {
                            fetchurl(`https://api.truckershub.in/v1/drivers/${userData.steamID}/jobs`, userData.userID);
                        }

                        req.session.destroy(function (err) {
                            return res.redirect("/login")
                        })
                    } catch (error) {
                        console.log(error)
                        return res.send({
                            error: true,
                            message: "Internal Server Error",
                            developer_message: String(error)
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                    return res.send({
                        error: true,
                        message: "Error fetching data. Please contact the site Developer",
                        developer_message: String(err)
                    })
                })
            } catch (err) {
                console.log(err)
                return res.send({
                    error: true,
                    message: "Error fetching data. Please contact the site Developer",
                    developer_message: String(err)
                })
            }
        } else {
            res.send({
                error: true,
                message: "Error fetching data from TruckersMP. Please contact the site Developer",
                developer_message: json.data
            })
        }
    }).catch((err) => {
        console.log(err)
        res.send({
            error: true,
            message: "Error fetching data from TruckersMP. Please contact the site Developer",
            developer_message: String(err)
        })
    })
})

function fetchurl(url, userID) {
    const jobs = dbs.jobs.get("jobs") || [];

    axios(url, {
        headers: {
            Authorization: `${process.env.truckershub}`
        }
    }).then(async (json) => {
        const { data } = json.data;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                const jobExists = jobs.find(f => f.jobID == data[i].jobID) || false;

                if (!jobExists) {
                    await jobsFunc.save(data[i]);
                }
            }
        }
        if (json?.data?.links?.next != null) {
            fetchurl(json?.data?.links?.next, userID);
        }
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = router;