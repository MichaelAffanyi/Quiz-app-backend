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
        enum: ['social interaction', 'personal develop', 'entertainment and fun', 'rewards and recognition'],
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
    passwordTokenLifetime: Date
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const userModel = model('User', userSchema)
module.exports = userModel