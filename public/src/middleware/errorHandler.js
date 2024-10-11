const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error('Express error', { error: err.message, stack: err.stack });

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
}

module.exports = errorHandler;
