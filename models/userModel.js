import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,


    },

    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6
    },
    customarId: {
        type: String,
        default: ''
    },
    subscription: {
        type: String,
        default: ''
    },
    resumePath:{
        type:String,
        default:''
    },
    interviewQuestion:{
        type:Array,
        default:[]
    },
    resumeUploadAt:{
        type:Date,
        default:null
    }

})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return
    }
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    
})


userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.getSignedToken = function (res) {
    const accesToken = jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_ACCESS_EXPIREIN })
    const refreshtoken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_EXPIREIN })
    res.cookie('refreshToken', `${refreshtoken}`, {
        maxAge: 86400 * 7000,
        httpOnly: true,
    })
    return accesToken
}

const User = mongoose.model('User', userSchema)

export default User


