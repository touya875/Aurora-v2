import { Button, Label, Modal, TextInput, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { fetchGroup, createNewUser, updateCurrentUser } from '../../services/userService';
import { toast } from "react-toastify";
import _ from "lodash";

const ModalUser = (props) => {

    const { action, dataModalUser } = props;

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: '',
    }

    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,

    }

    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault);
    const [userGroups, setUserGroups] = useState([]);


    useEffect(() => {
        getGroups();
    }, [])

    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({ ...dataModalUser, group: dataModalUser.Group ? dataModalUser.Group.id : '' });
        }
    }, [dataModalUser])

    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroups && userGroups.length > 0) {
                setUserData({ ...userData, group: userGroups[0].id })
            }
        }
    }, [action])

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);
            if (res.DT && res.DT.length > 0) {
                let groups = res.DT;
                setUserData({ ...userData, group: groups[0].id });
            }
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const checkValidateInputs = () => {
        //create user
        if (action === 'UPDATE') return true;

        setValidInputs(validInputsDefault);
        let arr = ['email', 'phone', 'password', 'group'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }

        return check;
    }

    const handleConfirmUser = async () => {
        //create user
        let check = checkValidateInputs();
        if (check === true) {
            let res = action === 'CREATE' ?
                await createNewUser({ ...userData, groupId: userData[`group`] })
                : await updateCurrentUser({ ...userData, groupId: userData['group'] });

            if (res && res.EC === 0) {
                props.onHide();
                setUserData({
                    ...defaultUserData,
                    group: userGroups && userGroups.length > 0 ? userGroups[0].id : ''
                })
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }

    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData);
        setValidInputs(validInputsDefault);
    }

    return (
        <>
            <Modal show={props.show} size="4xl" onClose={() => handleCloseModalUser()} popup>
                <Modal.Header />
                <Modal.Body>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{props.action === 'CREATE' ? 'Create new user' : 'Edit a user'}</h3>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-3">
                            <div className="mb-2  ">
                                <Label>Email</Label>
                            </div>
                            <TextInput
                                className={validInputs.email}
                                disabled={action === 'CREATE' ? false : true}
                                type="email"
                                value={userData.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <div className="mb-2  ">
                                <Label>Phone</Label>
                            </div>
                            <TextInput
                                disabled={action === 'CREATE' ? false : true}
                                type="text"
                                value={userData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <div className="mb-2  ">
                                <Label>Username</Label>
                            </div>
                            <TextInput type="text"
                                value={userData.username}
                                onChange={(event) => handleOnchangeInput(event.target.value, "username")}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            {action === 'CREATE'
                                &&
                                <>
                                    <div className="mb-2  ">
                                        <Label>Password</Label>
                                    </div>
                                    <TextInput type="password"
                                        value={userData.password}
                                        onChange={(event) => handleOnchangeInput(event.target.value, "password")}
                                    />
                                </>
                            }

                        </div>

                        <div className="col-span-full">
                            <div className="mb-2  ">
                                <Label>Address</Label>
                            </div>
                            <TextInput type="text"
                                value={userData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <div className="mb-2  ">
                                <Label>Gender</Label>
                            </div>
                            <Select
                                value={userData.sex}
                                onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                            >
                                <option defaultValue="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </Select>
                        </div>

                        <div className="sm:col-span-3">
                            <div className="mb-2  ">
                                <Label>Group</Label>
                            </div>
                            <Select
                                value={userData.group}
                                onChange={(event) => handleOnchangeInput(event.target.value, "group")}
                            >
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </Select>
                        </div>

                    </div>
                    <div className="mt-12 flex items-center justify-end gap-4">
                        {/* <Button color="success" onClick={() => handleConfirmUser()}>
                        Save
                    </Button> */}
                        <Button color="success" onClick={() => handleConfirmUser()}>
                            {action === 'CREATE' ? 'Save' : 'Update'}
                        </Button>
                        <Button color="gray" onClick={() => handleCloseModalUser()}>
                            Close
                        </Button>
                    </div>


                </Modal.Body>
            </Modal >
        </>
    )
}

export default ModalUser;