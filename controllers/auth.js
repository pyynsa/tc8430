import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"
import APIError from "../errors/index.js"
import User from "../models/User.js"

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) { 
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
            title: 'Logout Error',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error during logout'
          })
        }
        req.session.destroy((err) => {
          if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
              title: 'Logout Error',
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              message: 'Error destroying session'
            })
          }
          res.clearCookie('session_id')
          res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
          res.set('Pragma', 'no-cache')
          res.set('Expires', '0')
          res.redirect('/')
        })
      })    
}

export const register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body
        const role = 'user'
        const userExists = await User.findOne({ username })
        const emailExists = await User.findOne({ email })
        if (userExists) {
            throw new APIError('Username taken', StatusCodes.CONFLICT)
        }
        if (emailExists) {
            throw new APIError('Email already in use', StatusCodes.CONFLICT)
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            email,
            name,
            passwordHash,
            role
        })

        await user.save()
        res.status(StatusCodes.CREATED).render('home', {
            message: `Thanks for registering ${username}! You can now log in.`
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).render('error', {
            title: 'Registration Error',
            status: StatusCodes.BAD_REQUEST,
            message: error.message
        })
    }
}