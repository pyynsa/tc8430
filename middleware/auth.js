import Album from '../models/Album.js'
import APIError from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'

// check that user is logged in
const authUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.status(StatusCodes.UNAUTHORIZED).render('error', {
        title: 'Unauthorized',
        status: StatusCodes.UNAUTHORIZED,
        message: 'You must login to access this page.'
    })
}

// check user's role
const checkRole = (...roles) => {
    return (req, res, next) => {
        // if user doesn't have the required role, throw an error
        if (!roles.includes(req.user.role)) {
            return res.status(StatusCodes.UNAUTHORIZED).render('error', {
                title: 'Unauthorized',
                status: StatusCodes.UNAUTHORIZED,
                message:"You don't have permission to perform this action."
            })
        }
        next()
    }
}

// check user's ownership of a requested album
const checkOwnership = async (req, res, next) => {
    const { id } = req.params

    // check if album can be found
    const album = await Album.findById(id)
    if (!album) {
        throw new APIError('Album not found', StatusCodes.NOT_FOUND)
    }

    // check if user is admin
    if (req.user.role === 'admin') {
        return next()
    }

    // check if the user is owner
    if (album.owners.toString() !== req.user.id) {
        return res.status(StatusCodes.UNAUTHORIZED).render('error', {
            title: 'Unauthorized',
            status: StatusCodes.UNAUTHORIZED,
            message:"You are not allowed to modify this album."
        })
    }

    next()
}

export default { authUser, checkRole, checkOwnership }