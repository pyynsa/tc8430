import APIError from "./apierror.js";
import { StatusCodes } from 'http-status-codes'

class UnauthenticatedError extends APIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export default UnauthenticatedError