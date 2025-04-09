import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'A username must be provided']
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'An email must be provided']
    },
    passwordHash: String,
    album: [{
        type: Schema.Types.ObjectId,
        ref: 'Album'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const User = mongoose.model('User', userSchema)

export default User