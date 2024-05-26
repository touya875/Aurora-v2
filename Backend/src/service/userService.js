import bcrypt from 'bcrypt';
// import bluebird from 'bluebird';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const createNewUser = async (email, password, username) => {
    let hashPass = hashUserPassword(password);
    try {
        await db.Users.create({
            username: username,
            email: email,
            password: hashPass
        })
    } catch (error) {
        console.log(">>Check error: ", error)
    }
}

const getUserList = async () => {

    //test relationship
    let newUser = await db.Users.findOne({
        where: { id: 1 },
        attributes: ["id", "username", "email"],
        include: { model: db.Groups, attributes: ["name", "description"], },
        raw: true,
        nest: true
    })

    // let roles = await db.Groups.findOne({
    //     where: { id: 1 },
    //     include: [{ model: db.Roles}],
    //     raw: true,
    //     nest: true
    // })

    let r = await db.Roles.findAll({
        include: { model: db.Groups, where: { id: 1 } },
        raw: true,
        nest: true
    })

    // console.log(">>Check new u", newUser);
    // console.log(">>Check new g", r);

    let users = [];
    users = await db.Users.findAll();
    return users;
}

const deleteUser = async (userId) => {
    await db.Users.destroy({
        where: {
            id: userId
        }
    });
}

const getUserById = async (id) => {
    let user = {};
    user = await db.Users.findOne({
        where: {
            id: id
        }
    })
    return user.get({ plain: true });
}

const updateUserInfor = async (email, username, id) => {

    await db.Users.update(
        {
            email: email,
            username: username
        },
        {
            where: {
                id: id
            }
        }
    )

}

module.exports = {
    createNewUser, getUserList, deleteUser, getUserById, updateUserInfor
}