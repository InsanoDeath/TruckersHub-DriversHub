/*
 * DriversHub
 * Copyright (c) 2026 InsanoDeath
 */

const InsanoDB = require("insanodb");

const data = {};

function init() {
    data.idb = new InsanoDB({});
    data.members = new InsanoDB({ file: "members" });
    data.roles = new InsanoDB({ file: "roles" });
    data.logins = new InsanoDB({ file: "logins" });
    data.jobs = new InsanoDB({ file: "jobs" });
}

function dbs() {
    return data;
}

module.exports = {
    init,
    dbs
}