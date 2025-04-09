import { StatusCodes } from "http-status-codes"

export default (req, res) => res.status(404).render('error', {
    status: StatusCodes.NOT_FOUND,
    message: 'The requested page could not be found'
})