/*
 * DriversHub
 * Copyright (c) 2026 InsanoDeath
 */

const readline = require("readline");
const fs = require("fs");

function ask(question, defaultValue) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const prompt = defaultValue !== undefined
            ? `${question} (${defaultValue}): `
            : `${question}: `;

        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer.trim() || defaultValue);
        });
    });
}

async function config() {
    const config = {
        "color": await ask("VTC main Colour Code", "#298cd8"),
        "avatar": await ask("VTC Logo URL", "https://static.truckershub.in/images/logo.png"),
        "guildID": await ask("Discord Server ID"),
        "vtcName": await ask("VTC Name"),
        "vtcShortName": await ask("VTC Short Name"),
        "vtcID": parseInt(await ask("TruckersMP VTC ID" || 0)),
        "truckersHubVTCID": parseInt(await ask("TruckersHub VTC ID", 0)),

        "previousJobs": (await ask("Do you want to load previous jobs at the time of registration (yes / no)"), "yes").toLocaleLowerCase() == "yes",

        "pointsMultiplier": parseInt(await ask("Points Multiplier based on job distance. For example if 2 points for 1 km distance then the multiplier should be 2", 1)),

        "admin": (await ask("Admin user ID", "1")).split(", ").join(",").split(",").map(m => parseInt(m)),
        "url": await ask("DriversHub URL", "http://localhost:3000/"),
        "express": {
            "PORT": parseInt(await ask("Port to run DriversHub on", 3000)),
            "callbackurl": "/redirect"
        }
    }

    config.url = config.url.endsWith("/") ? config.url : config.url + "/";

    fs.writeFileSync("config.json", JSON.stringify(config), "utf8");

    console.log("Config File Created");

    return;
}

module.exports = config;