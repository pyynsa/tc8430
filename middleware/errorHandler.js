import { StatusCodes } from "http-status-codes";
import APIError from "../errors/index.js";

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err)      // uncomment for debugging

    // first handle our own errors
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    // handle Mongoose validation errors
    else if (err.name === 'ValidationError') {
        let errors = {}
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message
        })
        return res.status(StatusCodes.BAD_REQUEST).send(errors)
    }
    // fallback to generic 500 error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'There was an error, please try again' })
}

export default errorHandlerMiddleware