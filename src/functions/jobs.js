const dbs = require("../../db").dbs();
const config = require("../../config.json");
const Discord = require("discord.js");

class Jobs {
    async save(data) {
        // Data Change
        const members = dbs.members.get("members") || [];
        let userData = members.find(f => f.steamID == data.driver.steamID);

        if (userData) {
            data.driver.userID = userData.userID;
            data.driver.username = userData.username;

            // Setting Points
            let points = 0;
            points = parseFloat(data.distanceDriven * (config.pointsMultiplier || 1));
            data.points = points;

            dbs.jobs.push("jobs", data);

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setAuthor({ name: String(data.driver.username), iconURL: `${config.url}${userData.avatar.replace("\\", "\/")}`, url: `${config.url}profile/${userData.userID}` })
                .setTitle(`Job Completed - #${data.jobID}`)
                .addFields([
                    {
                        name: "Points Earned",
                        value: `${data.points.toFixed(2)} Points`,
                        inline: true
                    },
                    {
                        name: "Top Speed",
                        value: `${Math.round(data.topSpeed * 3.6)} km/h`,
                        inline: true
                    },
                    {
                        name: "Average Speed",
                        value: `${Math.round(data.avgSpeed * 3.6)} km/h`,
                        inline: true
                    },
                    {
                        name: "From",
                        value: String(data.source.city.name),
                        inline: true
                    },
                    {
                        name: "To",
                        value: String(data.destination.city.name),
                        inline: true
                    },
                    {
                        name: "Details",
                        value: `Distance Driven: ${Math.round(data.distanceDriven)} km\nCargo: ${data.cargo.name}\nRevenue: € ${data.income}\nTruck: ${data.truck.name} ${data.truck.model.name}\nFuel Used: ${Math.round(data.fuel.burned)}`,
                        inline: false
                    }
                ])
                .setURL(`${config.url}jobs/${data.jobID}`)
                .setThumbnail(`${config.url}images/${data.game.id}.png`)
                .setFooter({ text: `Tracker version: ${data.clientVersion}` })

            try {
                const webhook = new Discord.WebhookClient({ url: process.env.jobwebhook }).catch((err) => { });

                await webhook.edit({
                    name: "Job Logger",
                    avatar: config.avatar
                }).catch((err) => { });
                webhook.send({ embeds: [embed] }).catch((err) => { });
            } catch (error) {
                console.log(error);
            }

            this.setData(data);
            this.setUserData(data, userData);
        }
    }

    setData(data) {
        const content = dbs.idb.all();

        const date = new Date();

        const month = date.getUTCMonth() + 1;
        const fullYear = date.getUTCFullYear();

        const jobData = content[`job-${month}-${fullYear}`] || 0;
        const distData = content[`dist-${month}-${fullYear}`] || 0;
        const fuelData = parseInt(content[`fuel-${month}-${fullYear}`] || 0);
        const incomeData = content[`income-${month}-${fullYear}`] || 0;


        const totalDistance = content["totalDistance"] || 0;
        const totalJobs = content["totalJobs"] || 0;
        const totalIncome = content["totalIncome"] || 0;
        const totalFuel = content["totalFuel"] || 0;

        dbs.idb.set(`job-${month}-${fullYear}`, Math.round(jobData + 1));
        dbs.idb.set(`dist-${month}-${fullYear}`, Math.round(distData + data.distanceDriven));
        dbs.idb.set(`fuel-${month}-${fullYear}`, Math.round((fuelData + data.fuel?.burned) || 1));
        dbs.idb.set(`income-${month}-${fullYear}`, Math.round(incomeData + data.income));

        dbs.idb.set("totalDistance", Math.round(totalDistance + data.distanceDriven));
        dbs.idb.set("totalJobs", Math.round(totalJobs + 1));
        dbs.idb.set("totalIncome", Math.round(totalIncome + data.income));
        dbs.idb.set("totalFuel", Math.round((totalFuel + data.fuel?.burned) || 1));

        if (data.game.id == "ets2") {
            const ets2Jobs = content["ets2Jobs"] || 0;
            dbs.idb.set("ets2Jobs", Math.round(ets2Jobs + 1));
        } else {
            const atsJobs = content["atsJobs"] || 0;
            dbs.idb.set("atsJobs", Math.round(atsJobs + 1));
        }
    }

    setUserData(job, getUserData) {
        if (getUserData) {
            if (!getUserData.distance) {
                getUserData.distance = 0;
            }
            if (!getUserData.monthlyStats) {
                getUserData.monthlyStats = {
                    jobs: {},
                    distance: {},
                    points: {},
                    income: {}
                };
            }

            getUserData.points += job.points;
            getUserData.distance += job.distanceDriven;
            getUserData.jobs++;

            const date = new Date();

            const month = date.getUTCMonth() + 1;
            const fullYear = date.getUTCFullYear();

            // Jobs
            getUserData.monthlyStats.jobs[`${month}-${fullYear}`] ? getUserData.monthlyStats.jobs[`${month}-${fullYear}`]++ : getUserData.monthlyStats.jobs[`${month}-${fullYear}`] = 1;

            // Distance
            getUserData.monthlyStats.distance[`${month}-${fullYear}`] ? getUserData.monthlyStats.distance[`${month}-${fullYear}`] += job.distanceDriven : getUserData.monthlyStats.distance[`${month}-${fullYear}`] = job.distanceDriven;

            // Points
            getUserData.monthlyStats.points[`${month}-${fullYear}`] ? getUserData.monthlyStats.points[`${month}-${fullYear}`] += job.points : getUserData.monthlyStats.points[`${month}-${fullYear}`] = job.points;

            // Income
            getUserData.monthlyStats.income[`${month}-${fullYear}`] ? getUserData.monthlyStats.income[`${month}-${fullYear}`] += job.income : getUserData.monthlyStats.income[`${month}-${fullYear}`] = job.income;

            const members = dbs.members.get("members") || [];
            const filteredMembers = members.filter(f => f.userID !== getUserData.userID);
            filteredMembers.push(getUserData);
            dbs.members.set("members", filteredMembers);
        }
    }
}

module.exports = Jobs;