import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from 'react-router-dom';
import { DateComponent } from '../../../Date/Date';
import'./Bus.css'

export const BusBooking = () => {
    const { id } = useParams();
    const location = useLocation();
    const { currData } = location.state || {};
    const { source, destination, departure, day, seatCount } = currData;
    const [fare, setFare] = useState({ totalBaseFare : "", totalTax : "", totalFare : ""});
    const [receivedData, setReceivedData] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState('');
    const [acitOpen, setACITOpen] = useState({});

  useEffect(() => {
    async function fetchBus() {
      try {

        const response = await axios.get(
          `https://academics.newtonschool.co/api/v1/bookingportals/bus/${id}`,
          {
            headers: {
              projectID: 'zvc3foel7gfi',
            },
          }
        );
        setReceivedData(response.data.data);

        const resData = response.data.data;
        const tBaseFare = seatCount* resData.fare;
        const tTax = seatCount * Math.ceil(resData.fare * 0.8);
        const tFare = tBaseFare + tTax;

        setFare((prev) => {
            return {
                ...prev,
                totalBaseFare : tBaseFare,
                totalTax : tTax,
                totalFare : tFare
            }
        })

      } catch (error) {
        console.log(error);
        alert('An error occurred while fetching data.');
      }
    }

    fetchBus();
  }, []);


  const token = sessionStorage.getItem("user-token")
  const bookingData_config = {
    headers: {
        Authorization: `Bearer ${token}`,
        projectID: 'zvc3foel7gfi',
    },
  }

  const body_book = {
    bookingType: "bus",
    bookingDetails: {
      busId: `${id}`,
      startDate: `${departure}`,
      endDate: `${departure}`,
    },
  };
      
  const confirmBusBooking = async () => {
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
      <div className="bookingBusContainer">
          <div className="top-color">     
          </div>
          <div className="top-info">
            <h4>Review your Booking</h4>
            <div className="fast">                
              <h4>{receivedData.source} - {receivedData.destination}  |&nbsp;</h4>
              <p>{DateComponent({ dateVal: departure })}</p>    
            </div>
          </div>
          <div className="bus-body-booking">
            <div className='bookingLeftSec'>
              <div className="bus-details-booking">
                  <div className="left-upper-bus-booking">
                      <div className="bus-name-booking">
                          <h2>{receivedData.name}</h2>
                      </div>
                      <div className="bus-type-cancel-booking">
                          <p>Bus Type : {receivedData.type}</p>
                          <p className="cancel-policy-bus">Cancellation Policy</p>
                      </div>
                      <div className="bus-seat-book">
                          <p>Seats Selected: +{seatCount}</p>
                      </div>
                  </div>
                  <div className="left-lower-bus-booking">
                      <div className="boarding-point-bus-booking">
                          <p>Boarding Point Deatils</p>
                          <p className="blue-date-bus">{receivedData.departureTime}, {DateComponent({ dateVal: departure })}</p>
                          <h4>{receivedData.source}</h4>
                      </div>
                      <div className="dropping-point-bus-booking">
                          <p>Dropping Point Deatils</p>
                          <p className="blue-date-bus">{receivedData.arrivalTime}, {DateComponent({ dateVal: departure })}</p>
                          <h4>{receivedData.destination}</h4>
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
                  {Array.from({ length: seatCount }, (_, index) => (
                    <div className='acit-detail' onClick={() => handleACITOpen(index)}>
                      <div className='acit-r1'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1.7rem" height="1.7rem" fill="#333333" loading="lazy">
                          <path d="M8 10c0 4.412 3.588 8 8 8s8-3.588 8-8-3.587-8-8-8-8 3.588-8 8zm16 10H8c-4.412 0-8 3.587-8 8v2h32v-2c0-4.413-3.587-8-8-8z"></path>
                        </svg>
                        <span>Traveller {index+1}</span>
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
                          <div className='acit-name-textB'>
                            Traveller Name
                          </div>
                          <div className='acit-inputB'>
                            <input className='acit-inputbox acit-full' /*placeholder='First & Middle Name'*/ placeholder="Full Name" onClick={(e) => e.stopPropagation()} />
                            {/*<input className='acit-inputbox' placeholder='Last Name' onClick={(e) => e.stopPropagation()} />*/}
                            <div className='gender-select'>
                              <select onClick={(e) => e.stopPropagation()}>
                                <option>Male</option>
                                <option>Female</option>
                              </select>
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
                    <button className="bus-book-btton" onClick={confirmBusBooking} >Proceed to Book</button>
                    {
                      isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                    }
                  </div>
              </div>
            </div>
            <div className="price-summary-bus-booking">
              <div className="price-summary-bus">
                <h2>Price</h2>
                <div className="base-bus-fare">
                    <h4>Total Basefare</h4>
                    <h4>₹ {fare.totalBaseFare}</h4>
                </div>
                <div className="bus-tax-fare">
                    <h4>Taxes & fees</h4>
                    <h4>₹ {fare.totalTax}</h4>
                </div>
                <div className="bus-total-fare">
                    <h4>Final Price</h4>
                    <h4>₹ {fare.totalFare}</h4>
                </div>
                {/*<button className="bus-book-btton" onClick={confirmBusBooking} >Proceed to Book</button>
                {
                    isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                }*/}
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