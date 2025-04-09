import 'dotenv/config'
import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const albumSchema = new Schema({
    id: Number,
    artist: {
        type: String,
        required: [true, 'An artist name is required'],
        trim: true,
        minLength:[3, 'Length 3-50 characters'],
        maxLength:[50, 'Length 3-50 characters']
    },
    title: {
        type: String,
        required: [true, 'An album title is required'],
        trim: true,
        minLength:[3, 'Length 3-50 characters'],
        maxLength:[50, 'Length 3-50 characters']
    },
    year: {
        type: Number,
        required: [true, 'Year must be provided'],
        trim: true,
        min: [1900, 'Album can\'t be older than from year 1900'],
        max: [2025, 'Album can\'t be newer than from this year']
    },
    genre: {
        type: String,
        enum: {
            values: ['Rock', 'Pop', 'Jazz', 'Jazz Rock'],
            message: '{VALUE} not supported'
        }
    },
    tracks: {
        type: Number,
        required: [true, 'Number of tracks must be provided'],
        trim: true,
        min: [1, 'Number of tracks has to be 1-100'],
        max: [100, 'Number of tracks has to be 1-100']
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    owners: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// pre-save hook to update the timestamp before saving
albumSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

const Album = mongoose.model('Album', albumSchema)

export default Album