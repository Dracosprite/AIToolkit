import errorHandler from '../middleware/errorMiddleware.js'
import userModel from '../models/userModel.js'
import errorResponse from '../utils/erroResponse.js'



export const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res)
    res.status(statusCode).json({
        success: true,
        token,

    })
}




export const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return next(new errorResponse(`email is already register`, 500))

        }
        const user = await userModel.create({ username, email, password })
        sendToken(user, 201, res)

    } catch (error) {
        console.log(error);
        next(error)
    }
}
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new errorResponse(`please provide email or password `))
        }
        const emailFound = await userModel.findOne({ email })
        if (!emailFound) {
            return next(new errorResponse(`email not found`, 402))
        }
        const isMatch = await emailFound.matchPassword(password)
        if (!isMatch) {
            return next(new errorResponse(`invalid credentials`, 401))
        }

        sendToken(emailFound, 200, res)



    } catch (error) {
        console.log(error);
        next(error)
    }



}
export const logoutController = async (req, res) => {
    res.clearCookie('refreshToken')
    return res.status(200).json({
        success: true,
        message: `logout succsefully`
    })
}