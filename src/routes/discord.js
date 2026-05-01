const router = require("express").Router();
const dbs = require("../../db").dbs();
const axios = require("axios");
const config = require("../../config.json");
const Discord = require("discord.js");

router.get("/auth/discord", (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?response_type=code&redirect_uri=${config.url}auth/discord/callback&scope=identify%20email%20guilds%20guilds.join%20connections&client_id=${process.env.clientID}`)
})

router.get('/auth/discord/callback', (req, res, next) => {
    if (req.isUnauthenticated()) {
        res.redirect("/login")
    }

    const { code } = req.query;

    const data = new URLSearchParams()
    data.append('client_id', process.env.clientID)
    data.append('client_secret', process.env.clientSecret)
    data.append('grant_type', 'authorization_code')
    data.append('code', code)
    data.append('redirect_uri', `${config.url}auth/discord/callback`)

    axios(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((json) => {
        const { access_token, refresh_token } = json.data;
        axios(`https://discord.com/api/users/@me`, {
            headers: {
                "authorization": `Bearer ${access_token}`
            }
        }).then(async (json) => {
            const { id, username, avatar, discriminator, email } = json.data;

            const userData = req.userData;
            const perms = req.perms;
            userData.discord = {
                name: `${username}#${discriminator}`,
                avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=4096`,
                id: id,
                email: email,
                refresh_token: refresh_token
            }
            let members = dbs.members.get("members") || [];
            const filteredMembers = members.filter(f => f.userID !== userData.userID)
            filteredMembers.push(userData);
            dbs.members.set("members", filteredMembers)

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setTitle(userData.discord.name)
                .setDescription(userData.discord.name + " Connected there Discord to " + userData.username)
                .addFields([
                    {
                        name: "Discord ID",
                        value: id,
                        inline: true
                    }
                ])
                .setThumbnail(config.avatar)

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

            res.redirect("/profile/settings");
        }).catch((err) => {
            return next(err);
        })
    }).catch((err) => {
        return next(err);
    })
});

router.get("/auth/discord/remove", (req, res) => {
    if (req.isUnauthenticated()) {
        res.redirect("/login")
    } else {
        const userData = req.userData;
        const perms = req.perms;
        userData.discord = false;
        let members = dbs.members.get("members") || [];
        const filteredMembers = members.filter(f => f.userID !== userData.userID)
        filteredMembers.push(userData);
        dbs.members.set("members", filteredMembers)

        res.redirect("/profile/settings");
    }
})

module.exports = router;