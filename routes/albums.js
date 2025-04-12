import express from 'express'
const router = express.Router()

import albumsController from '../controllers/albums.js';

import authController from '../middleware/auth.js'

const {authUser, checkOwnership} = authController

// Destructure the methods from the default export
const { getAllAlbums, getAlbumsQuery, getAlbum, createAlbum, updateAlbum, deleteAlbum } = albumsController;

router
    .get('/', authUser, getAllAlbums)     //authUser, removed temporarily since vercel is serverless
    .get('/', getAlbumsQuery)   //authUser, 
    .post('/', createAlbum)     //authUser, 
router
    .get('/:id', getAlbum)      //authUser, 
    .put('/:id', checkOwnership, updateAlbum)   //authUser, 
    .delete('/:id', checkOwnership, deleteAlbum)    //authUser, 

export default router