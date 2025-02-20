const userModel = require("../models/userModel");

const createUser = async ({firstName,lastName,email,password,verificationToken,expiresAt}) => {

    if(!firstName || !email || !password || !verificationToken) {
        throw new Error('All fields are required!');
    }

    const user = await userModel.create({
        fullName:{firstName,lastName},
        email,
        password,
        verificationToken:verificationToken,
        expiresAt:expiresAt
    });

    return user;
}

module.exports = {createUser}