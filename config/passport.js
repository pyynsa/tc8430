import passport from "passport"
import LocalStrategy from 'passport-local'
import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const initializePassport = () => {
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        try {
            // find the user by email
            const user = await User.findOne({ username })
            // check if password matches
            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(password, user.passwordHash)
            console.log('Password correct?', passwordCorrect)
            // if either is incorrect, throw error
            if (!(user && passwordCorrect)) {
                return cb(null, false, { message: 'Incorrect username or password'})
            }
            // if both are correct, return user
            return cb(null, user)
        } catch (err) {
            return cb(err)
        }
    }))

    // if user is successfully verified, this is called and user's id and email are stored
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            cb(null, { 
                id: user.id, 
                name: user.name, 
                username: user.username, 
                email: user.email,
                role: user.role
            })
        })
    })

    // returns user data from session
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user)
        })
    })
}