const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService {

    constructor () {
        this.BookingRepository = new BookingRepository();
    }
    async createBooking (data) {
        try {
            const flightId = data.flightId;
            let getFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const response = await axios.get(getFlightURL);
            const flightData =  response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process','Insufficient Seats');
            }
            const totalCost  = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.BookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {
                totalSeats : flightData.totalSeats - booking.noOfSeats
            });
            const finalBooking = await this.BookingRepository.update(booking.id, {status: "Booked"})
            return finalBooking;
            
        } catch (error) {
            if( error.name == 'RepositoryError' || error.name == 'ValidationError')
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;