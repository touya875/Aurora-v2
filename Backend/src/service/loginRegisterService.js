require('dotenv').config();
import db from '../models/index';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { getGroupWithRoles } from '../service/JWTService';
import { createJWT } from '../middleware/JWTAction';


const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkEmailExist = async (userEmail) => {
    let user = await db.Users.findOne({
        where: { email: userEmail }
    })

    if (user) {
        return true;
    }
    return false;
}

const checkPhoneExist = async (userPhone) => {
    let user = await db.Users.findOne({
        where: { phone: userPhone }
    })
    if (user) {
        return true;
    }
    return false;
}


const registerNewUser = async (rawUserData) => {
    try {
        //Check mail/Phone number are already exists
        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist == true) {
            return {
                EM: 'This email is already exists',
                EC: 1
            }

        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist == true) {
            return {
                EM: 'This phone number is already registered',
                EC: 1
            }

        }

        //Hash user password
        let hashPassword = hashUserPassword(rawUserData.password);

        //Create new user
        await db.Users.create({
            email: rawUserData.email,
            phone: rawUserData.phone,
            username: rawUserData.username,
            password: hashPassword,
            groupId: 4
        })

        return {
            EM: 'Your account has been created successfully',
            EC: '0'
        }

    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service',
            EC: -2
        }
    }
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); //true or false
}

const handleUserLogin = async (rawData) => {
    try {
        let user = await db.Users.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin }
                ]
            }
        })

        if (user) {
            let isCorrectPassword = checkPassword(rawData.password, user.password);
            if (isCorrectPassword === true) {

                // let token

                // test roles:
                let groupWithRoles = await getGroupWithRoles(user);
                let payload = {
                    email: user.email,
                    groupWithRoles,
                    username: user.username,
                }
                let token = createJWT(payload);
                return {
                    EM: 'ok',
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }

        }


        return {
            EM: 'Your email/phone number or password is incorrect!',
            EC: 1,
            DT: ''
        }

    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service',
            EC: -2
        }
    }
}

module.exports = {
    registerNewUser, handleUserLogin, hashUserPassword, checkEmailExist, checkPhoneExist
}