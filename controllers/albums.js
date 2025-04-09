//import albums from '../data/albums.json'
import Album from '../models/Album.js'
import { StatusCodes } from 'http-status-codes'
import APIError from '../errors/index.js'
import User from '../models/User.js'

// GET /albums - returns all albums
const getAllAlbums = async (req, res) => {
    const albums = await Album.find({})
    if (!albums) {
        throw new APIError('No albums found!', StatusCodes.NOT_FOUND)
    }
    return res.status(StatusCodes.OK).json({ success: true, data: albums })
}

// GET /albums? - returns albums by queries
const getAlbumsQuery = async (req, res) => {
    const queryObject = {}
    // find sort, numericFilter or fields from request query
    const { sort, numericFilters, fields, artist, title, startYear, endYear } = req.query

    // filter by artist or album name
    if (artist) {
        queryObject.artist = {$regex: artist, $options: 'i'}
    }
    if (title) {
        queryObject.title = {$regex: title, $options: 'i'}
    }

    // year filtering, allows also for filtering with either only start or end year
    if (startYear || endYear) {
        // ensuring year as an object before adding conditions
        queryObject.year = {}
        
        if (startYear) {
            queryObject.year.$gte = Number(startYear)
        }
        if (endYear) {
            queryObject.year.$lte = Number(endYear)
        }
    }
    
    // numericFiltering
    if (numericFilters) {
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regex = /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regex,(match)=>`-${operatorMap[match]}-`)
        const options = ['year']
        // split the numeric filters to individual items
        filters = filters.split(',').forEach((item) => {
            // destructuring each numeric filter from the array
            const [field,operator,value] = item.split('-')
            if (options.includes(field)) {
                // add numeric filters to queryObject
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    let result = Album.find(queryObject)

    // if fields are found, parse the query for multiple fields
    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)            
    }

    // if sorting is found, parse the query into list if there are more than one sorting items
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        // otherwise sort by id by default
        result = result.sort('_id')
    }

    // find and show the albums
    const albums = await result
    res.status(StatusCodes.OK).json({ nbHits: albums.length, albums })
}

// GET /albums/:id - returns a single album by id
const getAlbum = async (req, res) => {
    const { id } = req.params
    const album = await Album.findOne({_id: id})
    if (!album) {
        return res 
            .status(StatusCodes.NOT_FOUND)
            .json({ success: false, msg: `No album found with id ${id}` })
    }
    res.status(StatusCodes.OK).json({ success: true, data: album })
}

// POST /albums - adds a new album
const createAlbum = async (req, res) => {
    const { artist, title, year, genre, tracks } = req.body
    const user = await User.findById(req.user.id)

    if ( !artist || !title || !year || !genre || !tracks ) {
        throw new APIError('All fields need to be provided', StatusCodes.BAD_REQUEST)
    }

    const album = new Album({
        artist,
        title,
        year,
        genre,
        tracks,
        owners: user._id
    })

    const savedAlbum = await album.save()
    
    // save album to user's album array
    user.album.push(savedAlbum._id)
    await user.save()

    return res.status(StatusCodes.CREATED).json({ success: true, album: savedAlbum })
}

// PUT /albums/:id - updates an album by id
const updateAlbum = async (req, res) => {
    const { id } = req.params
    // all of these need to be provided in the body, otherwise the not provided fields will be emptied
    const { artist, title, year, genre, tracks } = req.body

    if ( !artist || !title || !year || !genre || !tracks ) {
        throw new APIError('All fields need to be provided', StatusCodes.BAD_REQUEST)
    }

    const album = await Album.findOne({_id: id})
    if (!album) {
        return res 
            .status(StatusCodes.NOT_FOUND)
            .json({ success: false, msg: `No album found with id ${id}` })
    }

    await album.updateOne({artist: artist, title: title, year: year, genre: genre, tracks: tracks})
    
    res.status(StatusCodes.CREATED).json({ success: true, album })
}

// DELETE /albums/:id - deletes an album by id
const deleteAlbum = async (req, res) => {
    const { id } = req.params
    const album = await Album.findOne({_id: id})
    if (!album) {
        return res 
            .status(StatusCodes.NOT_FOUND)
            .json({ success: false, msg: `No album found with id ${id}` })
    }
    
    // find album owner and delete the album from their array
    const user = await User.findById(album.owners[0])
    user.album.pop(album._id)
    await user.save()
    
    await album.deleteOne({_id: id})
    res.status(StatusCodes.OK).json({ success: true, msg: 'Album deleted' })
}


export default {
    getAllAlbums,
    getAlbumsQuery,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum
}