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

async function env() {
    const env = {
        "truckershub": await ask("TruckersHub API Key. (https://truckershub.in/integrations)"),
        "STEAM_API": await ask("Steam API Key. (https://steamcommunity.com/dev/apikey)"),
        "clientID": await ask("Discord Client ID. (https://discord.com/developers/applications)"),
        "clientSecret": await ask("Discord Application Client Secret. (https://discord.com/developers/applications)"),
        "TOKEN": await ask("Discord Application Bot Token. (https://discord.com/developers/applications)"),
        "logwebhook": await ask("Discord Channel Webhook for general Logs"),
        "jobwebhook": await ask("Discord Channel Webhook for Jobs")
    }

    fs.writeFileSync(".env", Object.entries(env).map(m => m.join("=")).join("\n"), "utf8");

    console.log("Environment File Created");

    return;
}

module.exports = env;