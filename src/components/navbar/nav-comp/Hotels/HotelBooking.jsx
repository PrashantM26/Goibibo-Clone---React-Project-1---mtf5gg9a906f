import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { DateComponent } from '../../../Date/Date';
import'./Hotels.css'

export const HotelBooking = () => {
    const location = useLocation();
    const { guestRoomInfo, startDate, endDate, roomData, receivedData, nights, id } = location.state || {};
    const { adults, children, rooms } = guestRoomInfo;
    const [ bookedPrice, setBookedPrice] = useState({totalWithoutTax: "", totalTax: "", totalGrand: ""})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState('');
    
    useEffect(() => {
        const priceSummary = () => {
            const priceRoom = roomData.reduce((acc, curr) => acc + curr.costDetails.baseCost, 0)
            const totalRoomPrice = priceRoom * rooms * nights;

            const roomTax = roomData.reduce((acc, curr) => acc + curr.costDetails.taxesAndFees, 0)
            const totalRoomTax = roomTax * rooms * nights;

            const totalAfterTax = totalRoomPrice + totalRoomTax;

            setBookedPrice((prev) => {
                return {
                    ...prev,
                    totalWithoutTax: totalRoomPrice,
                    totalTax: totalRoomTax,
                    totalGrand: totalAfterTax
                }
            })
            
        }
        priceSummary();
    }, [])

    const bookingData_config = {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGI3NTI2M2UxN2I1ZjFmNmMzNTRjMCIsImlhdCI6MTcwMjg2NzQwNCwiZXhwIjoxNzM0NDAzNDA0fQ.rrkw78j0GJ3zYBQQ22qwJaeAuiQeL7Oqj5fsKFHO_XE",
            projectId: 'zvc3foel7gfi',
        },
    }

    const body_book = {
        bookingType: "hotel",
        bookingDetails: {
          hotelId: `${id}`,
          startDate: `${startDate}`,
          endDate: `${endDate}`,
        },
      };
      
      const confirmHotelBooking = async () => {
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
        <div className='bookingMainPage'>
            <div className='bookingLeftH'>
                    <div className='bookingS1H'>
                        <div className='bookingImage1'>
                            <img src={receivedData.images[0]}></img>
                        </div>
                        <div className='bookingHotelNameRating'>
                            <h3>{receivedData.name}, {receivedData.location}</h3>
                            <br />
                            <p className='ratingOne'>{receivedData.rating}/5</p>
                        </div>
                    </div>
                    <div className='bookingS2H'>
                        <div className='bookP1'>
                            <p>Check in</p>
                            <h2>{DateComponent({ dateVal: startDate, type: "shortDay" })} {DateComponent({ dateVal: startDate })}</h2>
                            <p>2 PM</p>
                        </div>
                        <div className='bookH2'>
                            <p>Check Out</p>
                            <h2>{DateComponent({ dateVal: endDate })}</h2>
                            <p>12 PM</p>
                        </div>
                        <div className='bookH3'>
                            <p>Guests</p>
                            <h2>{adults + children} Guests | {rooms} Rooms</h2>
                            <p>{nights} Nights</p>
                        </div>
                </div>
                    <button className="bookButtonH" onClick={confirmHotelBooking}>Proceed to Book</button>
                    {
                        isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                    }
            </div>

                <div className='bookingRightH'>
                    <div className='contentRightH'>
                        <h1>Price Summary</h1>
                        <div className='basePriceH'>
                            <p>Base Price ({rooms} rooms x {nights} nights)</p>
                            <p>₹ {bookedPrice.totalWithoutTax}</p>
                        </div>
                        <div className='hotelTaxes'>
                            <p>Hotel Taxes</p>
                            <p>₹ {bookedPrice.totalTax}</p>
                        </div>
                        <div className='totalGrandH'>
                            <p>Total Amount to be paid</p>
                            <p>₹ {bookedPrice.totalGrand}</p>
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
          <h2>Booking Confirmation</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  };