const {StatusCodes} = require('http-status-codes');

const { BookingService } = require('../services/index');

const bookingService = new BookingService();

const createBooking = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: 'Successfully completed Booking',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            data: {},
            err: error.explanation
        });
    }
}

module.exports = {
    createBooking
}