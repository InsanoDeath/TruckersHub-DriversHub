const router = require("express").Router();
const dbs = require("../../db").dbs();
const ct = require('countries-and-timezones');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const config = require("../../config.json");
const axios = require("axios");
const Discord = require("discord.js");

router.get("/profile", (req, res, next) => {
    const { user } = req;
    if (req.isAuthenticated()) {
        res.redirect("/profile/" + user);
    } else {
        res.redirect("/login");
    }
})

router.get("/profile/settings", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        const countries = ct.getAllCountries();
        const country = Object.keys(countries).map((key) => countries[key]);

        res.render("settings.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            country: country
        })
    } else {
        res.redirect("/login");
    }
})

router.get("/profile/:userID", (req, res, next) => {
    const { userID } = req.params;
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;
        if (!userData) {
            const error = new Error("User not found")
            error.status = 404;
            return next(error);
        }
        const myData = req.userData;

        const jobs = dbs.jobs.get("jobs") || [];
        const filteredJob = jobs.filter(f => f.driver.steamID == userData.steamID)

        const data = {
            distance: 0,
            fuel: 0,
            XP: 0,
            revenue: 0,
            mass: 0
        }

        for (var i = 0; i < filteredJob.length; i++) {
            data.fuel += Math.round(filteredJob[i].fuel.burned) || 0;
            data.mass += Math.round(filteredJob[i].cargo.mass) || 0;
            data.revenue += Math.round(filteredJob[i].income || 0);
            data.XP += Math.round(filteredJob[i].earnedXP || 0);
        }

        res.render("profile.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: myData,
            perms: perms,
            user: userData,
            jobs: filteredJob,
            main: data
        })
    } else {
        res.redirect("/login");
    }
})

// POST SETTINGS
const storage = multer.diskStorage({
    destination: (req, file, done) => {
        const { user } = req;
        if (!user) {
            done("not logged in")
            return req.res.redirect("/login")
        }

        done(null, "src/static/avatars")
    },
    filename: (req, file, done) => {
        const userData = req.userData;
        if (!userData) {
            done("User Not Found")
            return req.res.redirect("/login")
        }

        if (userData.avatar != "avatars\\no-avatar.png") {
            try {
                fs.unlinkSync(__dirname.split("routes")[0] + `static/${userData.avatar}`)
            } catch (error) {
                console.log(error)
            }
        }

        const { mimetype } = file;
        const id = userData.userID;
        let name = `${id}-${mimetype.replace("/", ".")}`

        userData.avatar = `avatars\\${name}`;

        let members = dbs.members.get("members") || [];
        const filteredMembers = members.filter(f => f.userID !== userData.userID)
        filteredMembers.push(userData);
        dbs.members.set("members", filteredMembers);

        done(null, name);
    }
})

const upload = multer({ storage })

router.post("/settings/avatar", upload.single("avatar"), (req, res) => {
    res.redirect("/profile/settings")
})

router.get("/settings/avatar/remove", (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;
        if (!userData) {
            const error = new Error("User not found")
            error.status = 404;
            return next(error);
        }

        if (userData.avatar != "avatars\\no-avatar.png") {
            try {
                fs.unlinkSync(path.join(__dirname, "../static", "avatars", `${userData.avatar.split("\\")[1]}`))
            } catch (error) {
                console.log(error)
            }
        }

        userData.avatar = "avatars\\no-avatar.png";

        let members = dbs.members.get("members") || [];
        const filteredMembers = members.filter(f => f.userID !== userData.userID)
        filteredMembers.push(userData);
        dbs.members.set("members", filteredMembers)

        res.redirect("/profile/settings")
    } else {
        res.redirect("/login");
    }
})

router.post("/settings/edit/profile", (req, res) => {
    const { username, email, country } = req.body;

    const { user } = req;

    const loginData = dbs.logins.get("logins") || []
    const filteredData = loginData.find(u => u.userID == user)
    let notFilteredData = loginData.filter(d => d.userID != user)

    if (!filteredData) return res.send({ error: true, success: false, message: "User Credentials Not Found. Please Contact Site Developer" })

    const userData = req.userData;
    const perms = req.perms;
    if (!userData) return res.send({ error: true, success: false, message: "User Not Found. Please Contact Site Developer" })

    if (username) {
        if (userData.username !== username) {
            userData.username = username

            filteredData.username = username;
            notFilteredData.push(filteredData);
            dbs.logins.set("logins", notFilteredData);
        }
    }
    if (email) {
        if (userData.email !== email) {
            userData.email = email;

            filteredData.email = email;
            notFilteredData.push(filteredData);
            dbs.logins.set("logins", notFilteredData);
        }
    }
    if (country != 0) {
        if (userData.country != country) {
            let countryCode = country
            let timezone = "Asia/Kolkata"
            let countryy = "India"

            try {
                const timezones = ct.getTimezonesForCountry(countryCode);
                const getCountry = ct.getCountry(countryCode)
                if (getCountry) {
                    countryy = getCountry.name
                    timezone = getCountry.timezones[0];
                }
                try {
                    utcOffset = timezones[0].utcOffset
                } catch (error) { }

                userData.country = countryy
                userData.countryCode = `en-${countryCode}`
                userData.timezone = timezone
            } catch (error) {
                return res.send({ error: true, success: false, message: "Please Contact Site Developer", developer_message: String(error) })
            }
        }
    }

    let members = dbs.members.get("members") || [];
    const filteredMembers = members.filter(f => f.userID !== userData.userID)
    filteredMembers.push(userData);
    dbs.members.set("members", filteredMembers)

    res.send({ error: false, success: true, message: "Data Successfully Updated" })
})

router.post("/settings/edit/password", async (req, res) => {
    const { cpassword, npassword, repassword } = req.body;

    const { user } = req;

    const loginData = dbs.logins.get("logins") || []
    const filteredData = loginData.find(u => u.userID == user)
    let notFilteredData = loginData.filter(d => d.userID != user)

    if (!filteredData) return res.send({ error: true, success: false, message: "Please Contact Site Developer" })

    if (await bcrypt.compare(cpassword, filteredData.password) || cpassword == filteredData.password) {
        if (npassword !== repassword) {
            res.send({ error: true, success: false, message: "New Password and retype Password are different" })
        } else {
            const hashedPassword = await bcrypt.hash(npassword, 10)
            filteredData.password = hashedPassword;
            notFilteredData.push(filteredData)
            dbs.logins.set("logins", notFilteredData)
            res.send({ error: false, success: true, message: "Password changed successfully" })
        }
    } else {
        res.send({ error: true, success: false, message: "Current Password is Incorrect" })
    }
})

router.get("/user/:userID/remove", async (req, res, next) => {
    const { userID } = req.params;

    const perms = req.perms;
    if (!["manageUsers"].find(f => perms.includes(f))) {
        const err = new Error("You are not authorised");
        err.status = 403;
        return next(err);
    }

    const userData = dbs.members.find("members", "userID", String(userID));
    const embed = new Discord.EmbedBuilder()
        .setColor("#ff0000")
        .setTitle(userData?.username + "'s Account was deactivated!")

    try {
        const webhook = new Discord.WebhookClient({ url: process.env.logwebhook });;

        await webhook.edit({
            name: "DriversHub Logger",
            avatar: config.avatar
        }).catch((err) => { });
        webhook.send({ embeds: [embed] }).catch((err) => { });
    } catch (error) {
        console.log(error);
    }

    axios(`https://api.truckershub.in/v1/drivers/${userData.steamID}`, {
        method: "DELETE",
        headers: {
            "Authorization": `${process.env.truckershub}`,
            "Content-Type": 'application/json'
        }
    }).catch((err) => {
        console.log(err)
    })

    const login = dbs.logins.get("logins") || [];
    dbs.logins.set("logins", login.filter(f => f.userID !== userData.userID))

    let members = dbs.members.get("members") || [];
    const filteredMembers = members.filter(f => f.userID !== userData.userID)
    dbs.members.set("members", filteredMembers);

    res.redirect("/members");
})

module.exports = router;