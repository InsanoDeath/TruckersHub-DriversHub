/*
 * DriversHub
 * Copyright (c) 2026 InsanoDeath
 */

require("./db.js").init();

const config = require("./config.js");
const env = require("./env.js");

const fs = require("fs");

async function start() {
    if (!fs.existsSync("config.json")) {
        await config();
    }

    if (!fs.existsSync(".env")) {
        await env();
    }

    require('dotenv').config();

    // EXPRESS INTIALIZE
    console.log("Server is Starting...")
    const express = require("./src/express.js");
    const Express = new express;
    Express.init();
}
start();