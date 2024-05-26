import db from "../models/index"

const getGroupWithRoles = async (user) => {
    //scope
    let roles = await db.Groups.findOne({
        where: { id: user.groupId },
        attributes: ["id", "name", "description"],
        include: {
            model: db.Roles,
            attributes: ["id", "url", "description"],
            through: { attributes: [] }
        }
    })

    return roles ? roles : {};
}

module.exports = {
    getGroupWithRoles
}