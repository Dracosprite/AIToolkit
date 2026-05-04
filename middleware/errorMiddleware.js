import errorResponse from '../utils/erroResponse.js'

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message

    if (err.name === 'CastError') {
        error = new errorResponse('Resources not found', 404)
    }

    if (err.code === 11000) {
        error = new errorResponse('Duplicate field value entry', 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ')
        error = new errorResponse(message, 400)
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server error'
    })
}

export default errorHandler
