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
    const [acitOpen, setACITOpen] = useState({});
    
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

    const token = sessionStorage.getItem("user-token")
    const bookingData_config = {
        headers: {
            Authorization: `Bearer ${token}`,
            projectID: 'zvc3foel7gfi',
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

    const handleACITOpen = (index) => {
        setACITOpen((prev) => {
            const newState = Object.fromEntries(Object.keys(prev).map(key => [key, false]));
            newState[index] = !prev[index];
            return newState;
        })
    }

    return (
        <div className='bookingHotelContainer'>
            <div className='bookingBgColorH'></div>
            <div className='bookingMainPage'>
                <div className='bookingLeftSec acitFullH'>
                    <div className='bookingLeftH'>
                            <div className='bookingS1H'>
                                <div className='bookingImage1'>
                                    <img src={receivedData.images[0]}></img>
                                </div>
                                <div className='bookingHotelNameRating'>
                                    <h3>{receivedData.name}</h3>
                                    <span className='bookingLocationH'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="1.4rem" width="1.4rem" class="LocationIcon-sc-1qsqrxe-0 ReviewHotelInfostyles__LocationDiv-sc-nhoe5s-5 ctXfCh dwkPbE"><path d="M22.301 24.38a1.334 1.334 0 10-.224 2.658 39.92 39.92 0 015.035.697.333.333 0 010 .651A53.38 53.38 0 0116 29.334a53.376 53.376 0 01-11.111-.948.333.333 0 010-.651 39.257 39.257 0 014.981-.693 1.333 1.333 0 00-.227-2.656c-9.644.815-9.644 2.815-9.644 3.673 0 3.557 11.089 3.941 16 3.941s16-.384 16-3.941c0-.859 0-2.859-9.699-3.679zM16 28.8c.455 0 .878-.232 1.123-.615 2.611-4.084 8.683-14.048 8.683-18.381 0-5.416-4.391-9.807-9.807-9.807S6.192 4.388 6.192 9.804c0 4.333 6.072 14.299 8.684 18.381.244.385.669.617 1.124.615zM11.333 9.333A4.667 4.667 0 1116 14a4.667 4.667 0 01-4.667-4.667z"></path></svg>
                                        &nbsp;{receivedData.location}
                                    </span>
                                    <br />
                                    <p className='ratingOneBooking'>{receivedData.rating}/5</p>
                                </div>
                            </div>
                            <div className='bookingS2H'>
                                <div className='bookH1'>
                                    <p>Check in</p>
                                    <h3>{DateComponent({ dateVal: startDate, type: "shortDay" })} {DateComponent({ dateVal: startDate })}</h3>
                                    <p>12 PM</p>
                                </div>
                                <div className='bookH2'>
                                    <p>Check Out</p>
                                    <h3>{DateComponent({ dateVal: endDate })}</h3>
                                    <p>12 PM</p>
                                </div>
                                <div className='bookH3'>
                                    <p>Guests</p>
                                    <h3>{adults + children} Guests | {rooms} Rooms</h3>
                                    <p>{nights} Nights</p>
                                </div>
                            </div>
                    </div>
                    <div className="traveller-detail-form">
                      <span className="traveller-detail-text">TRAVELLER DETAILS</span>
                      <div className='traveller-hr'></div>
                      <div className="traveller-personal-business-switch">
                        <div className="traveller-personal">Personal</div>
                        <div className="traveller-business">Business</div>
                      </div>
                      {Array.from({ length: adults }, (_, index) => (
                        <div className='acit-detail' onClick={() => handleACITOpen(index)}>
                          <div className='acit-r1'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1.7rem" height="1.7rem" fill="#333333" loading="lazy">
                              <path d="M8 10c0 4.412 3.588 8 8 8s8-3.588 8-8-3.587-8-8-8-8 3.588-8 8zm16 10H8c-4.412 0-8 3.587-8 8v2h32v-2c0-4.413-3.587-8-8-8z"></path>
                            </svg>
                            <span>Adult {index+1}</span>
                            <svg
                              viewBox="0 0 17 10"
                              xmlns="http://www.w3.org/2000/svg"
                              className="dropDown__DropDownIcon-sc-1l6w68g-0 elozUn rotate180"
                              width="1.5rem"
                              height="1.5rem"
                              fill="rgb(179, 179, 179)"
                              style={{ transform: acitOpen[index] ? 'rotate(180deg)' : '' }}
                              loading="lazy"
                            >
                              <path
                                d="M15.192.732c.3-.31.785-.31 1.084 0 .299.31.299.812 0 1.122L9.403 9.112a1.243 1.243 0 01-1.806 0L.724 1.854a.813.813 0 010-1.122c.3-.31.784-.31 1.084 0L8.5 7.803l6.692-7.07z"
                                fill="#b3b3b3"
                                fillRule="nonzero"
                              />
                            </svg>
                          </div>
                          {acitOpen[index] && 
                            <div className='acit-r2'>
                              <div className='acit-name-text'>
                                Adult Name
                              </div>
                              <div className='acit-input'>
                                <div className='gender-select'>
                                  <select onClick={(e) => e.stopPropagation()}>
                                    <option>Male</option>
                                    <option>Female</option>
                                  </select>
                                </div>
                                <div className='acit-inputbox-container'>
                                  <input className='acit-inputbox' placeholder='First & Middle Name' onClick={(e) => e.stopPropagation()} />
                                  <input className='acit-inputbox' placeholder='Last Name' onClick={(e) => e.stopPropagation()} />
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      ))}
                      {Array.from({ length: children }, (_, index) => (
                        <div className='acit-detail' onClick={() => handleACITOpen(adults + index)}>
                          <div className='acit-r1'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1.7rem" height="1.7rem" fill="#333333" loading="lazy">
                              <path d="M8 10c0 4.412 3.588 8 8 8s8-3.588 8-8-3.587-8-8-8-8 3.588-8 8zm16 10H8c-4.412 0-8 3.587-8 8v2h32v-2c0-4.413-3.587-8-8-8z"></path>
                            </svg>
                            <span>Child {index+1}</span>
                            <svg
                              viewBox="0 0 17 10"
                              xmlns="http://www.w3.org/2000/svg"
                              className="dropDown__DropDownIcon-sc-1l6w68g-0 elozUn rotate180"
                              width="1.5rem"
                              height="1.5rem"
                              fill="rgb(179, 179, 179)"
                              style={{ transform: acitOpen[adults + index] ? 'rotate(180deg)' : '' }}
                              loading="lazy"
                            >
                              <path
                                d="M15.192.732c.3-.31.785-.31 1.084 0 .299.31.299.812 0 1.122L9.403 9.112a1.243 1.243 0 01-1.806 0L.724 1.854a.813.813 0 010-1.122c.3-.31.784-.31 1.084 0L8.5 7.803l6.692-7.07z"
                                fill="#b3b3b3"
                                fillRule="nonzero"
                              />
                            </svg>
                          </div>
                          {acitOpen[adults + index] && 
                            <div className='acit-r2'>
                              <div className='acit-name-text'>
                                Child Name
                              </div>
                              <div className='acit-input'>
                                <div className='gender-select'>
                                  <select onClick={(e) => e.stopPropagation()}>
                                    <option>Male</option>
                                    <option>Female</option>
                                  </select>
                                </div>
                                <div className='acit-inputbox-container'>
                                  <input className='acit-inputbox' placeholder='First & Middle Name' onClick={(e) => e.stopPropagation()} />
                                  <input className='acit-inputbox' placeholder='Last Name' onClick={(e) => e.stopPropagation()} />
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      ))}
                      <div className='acit-r3'>
                        <div className='email-mobile-text'>Email Address</div>
                        <div className='email-mobile-container'>
                          <input type='email' className='literal-email' placeholder='Email' />
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="email-icon">
                            <path d="M0 5.125v21.25h32V5.125H0zm16 13.15L2.875 6.75h26.25L16 18.275zm-5.175-2.525l-9.2 8.075V7.662l9.2 8.088zm1.138 1.025L16 20.325l4.038-3.55 9.1 7.975H2.863l9.1-7.975zm9.212-1.025l9.2-8.088v16.15l-9.2-8.063z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className='acit-r4'>
                        <div className='email-mobile-text'>Mobile Number</div>
                        <div className='email-mobile-container'>
                          <input type='number' className='literal-mobile' placeholder='Mobile No' />
                        </div>
                      </div>
                      <div className='traveller-hr'></div>
                      <div className='acit-r5'>
                        <button className="bookButton" onClick={confirmHotelBooking}>Proceed to Book</button>
                        {
                            isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                        }
                      </div>
                    </div>
                </div>

                <div className='bookingRightH'>
                    <div className='contentRightH'>
                        <h2>Price Summary</h2>
                        <div className='basePriceH'>
                            <p>Base Price ({rooms} rooms x {nights} nights)</p>
                            <p style={{whiteSpace: 'nowrap', paddingLeft: '10px'}}>₹ {bookedPrice.totalWithoutTax}</p>
                        </div>
                        <div className='hotelTaxes'>
                            <p>Hotel Taxes</p>
                            <p style={{whiteSpace: 'nowrap', paddingLeft: '10px'}}>₹ {bookedPrice.totalTax}</p>
                        </div>
                        <div className='totalGrandH'>
                            <p>Total Amount to be paid</p>
                            <p style={{whiteSpace: 'nowrap', paddingLeft: '10px'}}>₹ {bookedPrice.totalGrand}</p>
                        </div>
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
          <span className="close" onClick={() => setIsModalOpen(false)}>
            &times;
          </span>
          <br />
          <h2 className="modal-title">🚀 Booking Confirmed 🚀</h2>
          <p className="modal-message">{message}</p>
          <div className="tick-mark">&#10003;</div>
        </div>
      </div>
    );
  };