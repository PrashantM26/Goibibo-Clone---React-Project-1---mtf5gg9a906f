import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { DateComponent } from '../../../Date/Date';


export const FlightBooking = () => {
    const { id } = useParams();
    const location = useLocation();
    const { currData } = location.state || {};
    const { from, destination, departure, adults, children, infants, day, tickettype } = currData;
    const [receivedData, setReceivedData] = useState('');
    const [fare, setFare] = useState({adultsFare : "", childrenFare : "", infantsFare : "", totalBaseFare : "", taxOfFare : "", totalFare : ""});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState('');

    useEffect(() => {
        async function fetchFlights() {
          try {

            const response = await axios.get(
              `https://academics.newtonschool.co/api/v1/bookingportals/flight/${id}`,
              {
                headers: {
                  projectID: 'zvc3foel7gfi',
                },
              }
            );
            //const { source, destination, stops, departureTime, arrivalTime, duration } = response.data.data;
            setReceivedData(response.data.data);

            const resData = response.data.data;
            const aFare = adults * resData.ticketPrice;
            const cFare = children * Math.ceil(resData.ticketPrice * 0.7);
            const iFare = infants * Math.ceil(resData.ticketPrice * 0.15);
            const totalbFare = aFare + cFare + iFare;
            const taxFare = Math.ceil(totalbFare * 0.15);
            const tFare = totalbFare + taxFare;

            setFare((prev) => {
                return {
                    ...prev,
                    adultsFare : aFare,
                    childrenFare : cFare,
                    infantsFare : iFare,
                    totalBaseFare : totalbFare,
                    taxOfFare : taxFare,
                    totalFare : tFare
                }
            })

          } catch (error) {
            console.log(error);
            alert('An error occurred while fetching data.');
          }
        }
    
        fetchFlights();
      }, []);

    const token = sessionStorage.getItem("user-token")
    const bookingData_config = {
        headers: {
            Authorization: `Bearer ${token}`,
            projectID: 'zvc3foel7gfi',
        },
    }

    const body_book = {
        bookingType: "flight",
        bookingDetails: {
          flightId: `${id}`,
          startDate: `${departure}`,
          endDate: `${departure}`,
        },
      };
      
      const confirmFlightBooking = async () => {
            try {
                const response = await axios.post('https://academics.newtonschool.co/api/v1/bookingportals/booking',
                    body_book,
                    bookingData_config
                )
                setBookingConfirmation(response.data.message)
                setIsModalOpen(true);
            } 
            catch (error) {
              console.error('Error fetching data:', error);
            }

      }


      return (
        <div className='bookingMainPageF'>
            <div className='bookingLeftF'>
                    <div className='bookingS1F'>
                        
                            <h2>{receivedData.source} -  {receivedData.destination}</h2>
                            <p className='stop'>{receivedData.stop} Stop(s) | All departure/arrival times are in local time/s</p>
                        
                    </div>
                    <div className='bookingS2F'>
                        <div className='bookF1'>
                            <p>{tickettype}</p>
                        </div>
                        <div className='bookF2'>
                            <span>
                                <p>Start on-</p>
                                <h4>{DateComponent({ dateVal: departure, type: "shortDay" })} {DateComponent({ dateVal: departure })}</h4>
                            </span>
                            <span>
                                <p>Arrive on-</p>
                                <h4>{DateComponent({ dateVal: departure, type: "shortDay" })} {DateComponent({ dateVal: departure })}</h4>
                            </span>
                        </div>
                        <div className='bookF3'>
                            <h5>{receivedData.departureTime}</h5>
                            {/*<div className="strike-arrow-flight-booking">
                                <p>{receivedData.duration} Hrs</p>
                            </div>*/}
                            <div class="duration-flight-booking">{receivedData.duration} Hrs</div>
                            <h5>{receivedData.arrivalTime}</h5>
                        </div>
                        <div className='bookF4'>
                            <p>{receivedData.source}</p>
                            {/*<h2>{adults + children} Guests | {rooms} Rooms</h2>*/}
                            <p>Duration</p>
                            <p>{receivedData.destination}</p>
                        </div>
                    </div>
                    <button className="bookButtonF" onClick={confirmFlightBooking}>Proceed to Book</button>
                    {
                        isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                    }
            </div>


            <div className='bookingRightF'>
                <div className='contentRightF'>
                    <div className='FareSummary'>
                        <h3>FARE SUMMARY</h3>
                        <p>{adults} ADULTS | {children} CHILDREN | {infants} INFANTS</p>
                    </div>
                    <hr className='hABase'></hr>
                    <div className='basePriceF'>
                        <p>Base Price</p>
                        <p>₹ {fare.totalBaseFare}</p>
                    </div>
                    <div className='adultsF'>
                        <p>Adult ({adults} x {receivedData.ticketPrice})</p>
                        <p>₹ {fare.adultsFare} </p>
                    </div>
                    <div className='childrenF'>
                        <p>Child ({children} x {Math.ceil(receivedData.ticketPrice * 0.7)})</p>
                        <p>₹ {fare.childrenFare} </p>
                    </div>
                    <div className='infantsF'>
                        <p>Infant ({infants} x {Math.ceil(receivedData.ticketPrice * 0.15)})</p>
                        <p>₹ {fare.infantsFare} </p>
                    </div>
                    <hr className='hATax'></hr>
                    <div className='flightTaxes'>
                        <p>Taxes and Surcharges</p>
                        <p>₹ {fare.taxOfFare}</p>
                    </div>
                    <hr className='hAGrand'></hr>
                    <div className='totalGrandF'>
                        <p>Grand Total</p>
                        <p>₹ {fare.totalFare}</p>
                    </div>
                </div>
            </div>

        </div>
    )

}



const Modal = ({ isOpen, setIsModalOpen, message }) => {
    return (
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={() =>setIsModalOpen(false)}>
            &times;
          </span>
          <br />
          <h2>Booking Confirmation</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  };