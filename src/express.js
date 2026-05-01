/*
 * DriversHub
 * Copyright (c) 2026 InsanoDeath
 */

class express {
    init() {
        const express = require("express");
        const app = new express();
        const passport = require("passport");
        const session = require("express-session");
        const flash = require("express-flash");
        const path = require("path");
        const fs = require("fs");
        const config = require("../config.json");
        const cookieParser = require("cookie-parser");

        const steamStrategy = require("./strategy/strategy");
        const strategy = new steamStrategy();
        strategy.strategystart();

        const dbs = require("../db").dbs();

        app.set("view-engine", "ejs");

        // MIDDLE WARES
        app.use(session({
            secret: "secret",
            saveUninitialized: false,
            resave: false
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(express.static(path.join(__dirname, "static")))
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))
        app.use(cookieParser())
        app.use(flash())

        app.use((req, res, next) => {
            if (req.isUnauthenticated() && req.cookies.remember == "true") {
                const avblUserData = dbs.members.find("members", "userID", String(req.cookies.userID)) || false;
                if (avblUserData) {
                    req.login(String(req.cookies.userID), function (err) {
                        if (err) { return next(err); }
                    });
                }
            }
            res.setHeader("Access-Control-Allow-Origin", "*");

            req.config = require("../config.json");
            req.config.admins = config.admin || [];
            if (req.isAuthenticated()) {
                const { user } = req;
                req.userData = dbs.members.find("members", "userID", String(user));
                if (req.userData) {
                    const rolePerms = ((dbs.roles.get("roles") || []).filter(f => ((req.userData.allRoles || []).length == 0 ? [0] : req.userData.allRoles).includes(f.id)).map(m => m.permissions));
                    req.perms = rolePerms.length == 0 ? [] : rolePerms.reduce((pre, cur) => pre.concat(cur));
                }
            }

            next()
        })

        const routes = fs.readdirSync("./src/routes").filter(r => r.endsWith(".js"))
        for (let route of routes) {
            const authRoute = require(`./routes/${route}`)
            app.use("/", authRoute)
        }

        app.use((req, res, next) => {
            const err = new Error("Page Not Found")
            err.status = 404
            next(err)
        })

        app.use((err, req, res, next) => {
            res.status(err.status || 500)

            // if (err.status == 404) {
            //     return res.render("404.ejs", {
            //         error: err
            //     })
            // } else {
            try {
                return res.send({ error: err.status, success: false, message: err.message })
            } catch { }
            // }
        })

        const port = config.express.PORT;
        const server = app.listen(port, async () => {
            console.log(`Listennig to port ${port} `);
            console.log(`Access the website at ${config.url}`);
        })
        server.setTimeout(0)
    }
}

module.exports = express