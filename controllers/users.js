import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import APIError from '../errors/index.js'

// Get all users
const getAllUsers = async (_req, res) => {
    const users = await User.find({}).select('_id name username email role') // eliminate passwordHash from the results
    res.status(StatusCodes.OK).json({ success: true, data: users})
}

// Get one user
const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('_id name username email role') // eliminate passwordHash from the results

    // if user is not found, throw an error
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: 'User not found'})
    }
    res.status(StatusCodes.OK).json({ 
        success: true,
        user: user
    })
}

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params
    // find user by id and delete
    const deletedUser = await User.findByIdAndDelete(id)

    // if user is not found, throw an error
    if (!deletedUser) {
        throw new APIError('No user found', StatusCodes.NOT_FOUND)
    }

    return res.status(StatusCodes.NO_CONTENT).json({ success: true, msg: 'User deleted' })
}

export default { getAllUsers, getUser, deleteUser }