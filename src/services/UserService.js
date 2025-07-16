const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;
        try {
            if (!email || !password) {
                return resolve({
                    status: 'ERR',
                    message: 'All fields are required'
                });
            }

            if (typeof password !== 'string' || password.trim() === '') {
                return resolve({
                    status: 'ERR',
                    message: 'Password must be a non-empty string'
                });
            }

            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'The email is already used'
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                name,
                email,
                password: hash,
                phone
            });

            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createUser
            });

        } catch (e) {
            console.error('Error in createUser:', e);
            return reject(e);
        }
    });
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if(!comparePassword) {
              resolve({
                status: 'OK',
                message: 'The password or user is incorrect'
              })  
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete success'
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete success'
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if(user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}