import groupService from "../service/groupService";

const readFunc = async (req, res) => {
    try {
        let data = await groupService.getGroups();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Error from server', //error message
            EC: '-1', //error code,
            DT: '', //data
        })
    }
}

module.exports = {
    readFunc
}