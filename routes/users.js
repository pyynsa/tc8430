import express from 'express'
const router = express.Router()

import authController from '../middleware/auth.js'
const { authUser, checkRole } = authController

import usersController from '../controllers/users.js'

const { getAllUsers, getUser, deleteUser } = usersController

router.get('/', authUser, checkRole('admin'), getAllUsers)
    
router
    .get('/:id', authUser, checkRole('admin'), getUser)
    .delete('/:id', authUser, checkRole('admin'), deleteUser)

export default router