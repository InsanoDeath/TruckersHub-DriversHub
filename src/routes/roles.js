const router = require("express").Router();
const dbs = require("../../db").dbs();

router.get("/roles/create", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "createRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        res.render("roles/create.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms
        })
    } else {
        res.redirect("/login");
    }
})

router.post("/roles/create", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "createRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        const { roleName, color, order } = req.body;
        const permissions = Object.keys(req.body)?.filter(f => !["roleName", "color", "order"].includes(f));

        let roleID = dbs.roles.get("roleID") || 0;
        const currentID = ++roleID;
        dbs.roles.set("roleID", currentID);

        const roleData = {
            id: currentID,
            name: roleName,
            order: order,
            color: color,
            permissions: permissions,
            createdTimestamp: Date.now(),
            updatedTimestamp: Date.now()
        }
        dbs.roles.push("roles", roleData);

        res.redirect("/roles/edit");
    } else {
        res.redirect("/login");
    }
})

router.get("/roles/edit", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "createRoles", "viewRoles", "assignRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        const roles = dbs.roles.get("roles") || [];
        const members = dbs.members.get("members") || [];

        res.render("roles/list.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            perms: perms,
            roles: roles,
            members: members
        })
    } else {
        res.redirect("/login");
    }
})

router.get("/roles/edit/:roleID", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "createRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        const { roleID } = req.params;
        const role = dbs.roles.find("roles", "id", roleID) || false;

        if (!role) {
            const err = new Error("Role not found.");
            err.status = 404;
            return next(err);
        }

        res.render("roles/edit.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            perms: perms,
            role: role
        })
    } else {
        res.redirect("/login");
    }
})

router.post("/roles/edit/:roleID", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "createRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        const { roleName, color, order } = req.body;
        const permissions = Object.keys(req.body)?.filter(f => !["roleName", "color", "order"].includes(f));

        const { roleID } = req.params;
        const roles = dbs.roles.get("roles") || [];
        const role = roles.find(f => f.id == roleID);
        const otherRoles = roles.filter(f => f.id != roleID);

        role.name = roleName;
        role.order = order;
        role.color = color;
        role.permissions = permissions;
        role.updatedTimestamp = Date.now();

        otherRoles.push(role);
        dbs.roles.set("roles", otherRoles);

        res.redirect("/roles/edit/" + roleID);
    } else {
        res.redirect("/login");
    }
})

router.get("/roles/assign", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "assignRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        const members = dbs.members.get("members") || [];
        const roles = dbs.roles.get("roles") || [];

        res.render("roles/assign.ejs", {
            loggedIn: req.isAuthenticated(),
            config: req.config,
            data: userData,
            perms: perms,
            perms: perms,
            roles: roles,
            members: members
        })
    } else {
        res.redirect("/login");
    }
})

router.post("/roles/assign", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userData = req.userData;
        const perms = req.perms;

        if (!["manageRoles", "assignRoles"].find(f => perms.includes(f)) && userData.userID != 1) {
            const err = new Error("You are not authorised");
            err.status = 403;
            return next(err);
        }

        let { user, role, isRoleSecondary } = req.body;

        user = parseInt(user);
        role = parseInt(role);

        const roleuserData = dbs.members.find("members", "userID", String(user)) || false;
        if (!roleuserData) {
            const err = new Error("User not found")
            err.status = 404;
            return next(err)
        }

        const roles = dbs.roles.get("roles") || [];
        const filteredRole = roles.find(f => f.id == role);
        if (!filteredRole) {
            const err = new Error("Role not found")
            err.status = 404;
            return next(err)
        }

        if (role == 0) {
            if (isRoleSecondary) {
                roleuserData.isStaff = true;
                userData.allRoles = roleuserData.allRoles.filter(f => f != role);
                roleuserData.secondaryRoles = roleuserData.secondaryRoles.filter(f => f.roleID != role);

            } else {
                roleuserData.isStaff = false;
                roleuserData.allRoles = [];
                roleuserData.secondaryRoles = [];
            }
        } else {
            roleuserData.isStaff = true;
        }

        if (isRoleSecondary && role != 0) {
            try {
                roleuserData.allRoles.push(role);
            } catch (error) {
                roleuserData.allRoles = [role];
            }

            const secondData = {
                role: filteredRole.name,
                roleColor: filteredRole.color,
                roleID: filteredRole.id
            }
            try {
                roleuserData.secondaryRoles.push(secondData);
            } catch (error) {
                roleuserData.secondaryRoles = [secondData];
            }
        } else if (!isRoleSecondary) {
            if (role != 0) {
                try {
                    roleuserData.allRoles = roleuserData.allRoles?.filter(f => f != roleuserData.roleID);
                    roleuserData.allRoles.push(role);
                } catch (error) {
                    roleuserData.allRoles = [role];
                }
            }

            roleuserData.role = filteredRole.name;
            roleuserData.roleColor = filteredRole.color;
            roleuserData.roleID = filteredRole.id;
        }

        const members = dbs.members.get("members") || [];
        const filteredMembers = members.filter(f => f.userID !== roleuserData.userID)
        filteredMembers.push(roleuserData);
        dbs.members.set("members", filteredMembers);

        res.redirect("/roles/edit");
    } else {
        res.redirect("/login");
    }
})

module.exports = router;