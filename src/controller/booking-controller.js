const {StatusCodes} = require('http-status-codes');

const { BookingService } = require('../services/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();


class BookingController {

    constructor () {
        
    }

    async sendMessageToQueue (req,res) {
        const channel = await createChannel();
        const data = {
            message: 'Success'
        }
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data) );
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }
    async create (req, res) {
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
}

module.exports = BookingController;