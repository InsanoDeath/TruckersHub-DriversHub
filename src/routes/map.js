const router = require("express").Router();
const axios = require("axios");

router.get("/map/:map", (req, res, next) => {
    const { map } = req.params;
    axios(`https://map.truckershub.in/${map}`).then((text) => {
        text = text.data;
        text = text
            .replace("const vtc = new URLSearchParams(window.location.search).get(\"vtc\");", `const vtc = ${req.config.truckersHubVTCID};`)
            .replace("window.location = `${path}?vtc=${vtc}`;", "window.location = `${path}`;")
            .replace("https://map.truckershub.in/images/brand.png", req.config.avatar);
        res.send(text)
    }).catch((err) => {
        res.send("error")
    })
})

module.exports = router;