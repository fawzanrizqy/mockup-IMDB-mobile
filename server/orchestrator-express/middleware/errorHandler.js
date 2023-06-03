function errorHandler(err, req, res, next) {
    console.log(err);
    if (err.name) {
        res.status(err.response.status).json({
            message: err.response.data.message,
        });
    } else {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

module.exports = errorHandler;