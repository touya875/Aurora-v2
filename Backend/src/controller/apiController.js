import loginRegisterService from '../service/loginRegisterService';

// const testApi = (req, res) => {
//     return res.status(200).json({
//         message: 'Ok',
//         data: 'test api'
//     })
// }

const handleRegister = async (req, res) => {
    try {
        //req.body
        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                EM: 'Missing required parameters', //Error message
                EC: '1', //Error code
                DT: '' //Date
            })
        }

        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                EM: 'Password must have more than 3 characters', //Error message
                EC: '1', //Error code
                DT: '' //Date
            })
        }

        //Service: Create user
        let data = await loginRegisterService.registerNewUser(req.body)
        return res.status(200).json({
            EM: data.EM, //Error message
            EC: data.EC, //Error code
            DT: '' //Date
        })


    } catch (e) {
        return res.status(500).json({
            EM: 'Server Error', //Error message
            EC: '-1', //Error code
            DT: '' //Date
        })
    }
}

const handleLogin = async (req, res) => {
    try {
        let data = await loginRegisterService.handleUserLogin(req.body);
        //set cookie
        if (data && data.DT && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        }

        return res.status(200).json({
            EM: data.EM, //error message
            EC: data.EC, //error code,
            DT: data.DT, //data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'Error from server', //error message
            EC: '-1', //error code,
            DT: '', //data
        })
    }
}

const handleLogout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({
            EM: 'clear cookie done!',
            EC: 0,
            DT: '',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        })
    }
}

module.exports = {
    handleRegister, handleLogin, handleLogout
}