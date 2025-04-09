import express from 'express'
const router = express.Router()

import albumsController from '../controllers/albums.js';

import authController from '../middleware/auth.js'

const {authUser, checkOwnership} = authController

// Destructure the methods from the default export
const { getAllAlbums, getAlbumsQuery, getAlbum, createAlbum, updateAlbum, deleteAlbum } = albumsController;

router
    .get('/', authUser, getAllAlbums)
    .get('/', authUser, getAlbumsQuery)
    .post('/', authUser, createAlbum)
router
    .get('/:id', authUser, getAlbum)
    .put('/:id', authUser, checkOwnership, updateAlbum)
    .delete('/:id', authUser, checkOwnership, deleteAlbum)

export default router