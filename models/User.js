const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        minLength: [2, 'Name not be less than two characters'],
    },
    email: {
        type: String,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is invalid'],
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        minLength: [8, 'Password should be more than eight characters'],
        required: true
    },
    profilePhoto: {
        type: String,
        required: false,
        default: ''
    },
    purpose: {
        type: [String],
        enum: ['social interaction', 'personal development', 'entertainment and fun', 'rewards and recognition'],
        default: []
    },
    interest: {
        type: [String],
        enum: ['gaming', 'fashion', 'music', 'reading'],
        default: []
    },
    passwordToken: {
        type: String,
        default: ''
    },
    cloudinaryId: {
        type: String,
        default: ''
    },
    passwordTokenLifetime: Date,
    contact: {
        type: String,
        required: false,
        default: ''
    },
    location: {
        type: String,
        required: false,
        default: ''
    },
    gender: {
        type: String,
        required: false,
        default: ''
    },
    role: {
        type: String,
        required: false,
        enum: {
            values: ['student', 'lecturer', 'admin'],
            message: '{VALUE} is not a supported role'

        },
        default: 'user'
    },
    program: {
        type: String,
        required: false,
        default: ''
    },
    level: {
        type: String,
        required: false,
        enum: {
            values: ['100l', '200l', '300l', '400l', '500l',],
            message: '{VALUE} is not a supported level'
        }
    },
})

// userSchema.methods.hashPassword = async function() {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt)
// }

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const userModel = model('User', userSchema)
module.exports = userModel