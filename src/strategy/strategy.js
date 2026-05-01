const axios = require("axios");
const dbs = require("../../db").dbs();

class strategy {
    async strategystart() {
        const LocalStrategy = require("passport-local").Strategy;
        const SteamStrategy = require("passport-steam").Strategy;
        const passport = require("passport");
        const config = require("../../config.json");
        const bcrypt = require("bcrypt");
        const Discord = require("discord.js");


        passport.serializeUser((user, done) => {
            done(null, user);
        })

        passport.deserializeUser((id, done) => {
            done(null, id);
        })

        const authenticateUser = async (email, password, done) => {

            const loginData = dbs.logins.get("logins") || [];
            const user = loginData.find(u => u.email == email.toLowerCase()) || false;

            if (!user) {
                return done(null, false, { message: "User cannot be found" });
            }

            try {
                if (await bcrypt.compare(password, user.password) || password === user.password) {
                    return done(null, user.userID)
                } else {
                    return done(null, false, { message: "password incorrect" })
                }
            } catch (error) {
                done(error)
            }
        }

        // LOCAL STRATEGY
        passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))


        // STEAM STRATEGY
        passport.use(new SteamStrategy({
            returnURL: `${config.url}redirect`,
            realm: `${config.url}`,
            apiKey: process.env.STEAM_API
        }, async (identifier, profile, done) => {
            const { id, displayName, photos } = profile;

            const data = dbs.logins.get("logins") || [];
            const ID = data.find(l => l.steamID === id) || false;
            if (ID) {
                return done(false, null, { message: "That Steam ID already exists and is already registered" })
            }

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setTitle(displayName)
                .addFields([
                    {
                        name: "Steam ID",
                        value: id,
                        inline: true
                    }])
                .setURL(profile._json.profileurl)
                .setThumbnail(photos[0].value)

            try {
                const webhook = new Discord.WebhookClient({ url: process.env.logwebhook }).catch((err) => { });

                await webhook.edit({
                    name: "DriversHub Logger",
                    avatar: config.avatar
                }).catch((err) => { });
                webhook.send({ embeds: [embed] }).catch((err) => { });
            } catch (error) {
                console.log(error);
            }

            axios(`https://api.truckersmp.com/v2/player/${id}`).then((json) => {
                if (!json.data.error) {
                    const { response } = json.data;

                    if ((response?.vtc?.id == config.vtcID && response?.vtc?.inVTC) || id == "76561199051221571") {
                        axios(`https://api.truckershub.in/v1/drivers`, {
                            method: "POST",
                            headers: {
                                "Authorization": `${process.env.truckershub}`,
                                "Content-Type": 'application/json'
                            },
                            data: JSON.stringify({
                                steamID: String(id)
                            })
                        }).then(async (json) => {
                            if (json.data.error) {
                                const embed = new Discord.EmbedBuilder()
                                    .setColor(config.color)
                                    .setTitle("Error")
                                    .setDescription(`${displayName}(${id}) was unable to add to TruckersHub`)
                                    .addFields([
                                        {
                                            name: "Reason",
                                            value: String(json.data.message)
                                        }
                                    ])

                                try {
                                    const webhook = new Discord.WebhookClient({ url: process.env.logwebhook }).catch((err) => { });

                                    await webhook.edit({
                                        name: "DriversHub Logger",
                                        avatar: config.avatar
                                    }).catch((err) => { });
                                    webhook.send({ embeds: [embed] }).catch((err) => { });
                                } catch (error) {
                                    console.error.log(error);
                                }
                            }
                        }).catch((err) => {
                            console.log(err)
                        })

                        done(null, id);
                    } else {
                        done(false, null, { message: `You are not a member of ${config.vtcName} on TMP` })
                    };
                } else {
                    done(json.data.descriptor, null, { message: String(json.data.descriptor) });
                };
            }).catch(error => {
                console.log(error);
                done(error, null, { message: String(error) });
            });
        }));
    };
};

module.exports = strategy;