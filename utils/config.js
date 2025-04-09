import 'dotenv/config'

const SESSION_SECRET = process.env.SESSION_SECRET
const PORT = process.env.PORT

const MONGO_URI = process.env.MONGO_URI

export default {
    SESSION_SECRET,
    PORT,
    MONGO_URI
}