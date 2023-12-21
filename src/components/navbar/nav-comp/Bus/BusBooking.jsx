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

    return (
        <div>
            <div className="top-color">
                
            </div>
            <div className="top-info">
                <div>
                    <h4>Review your Booking</h4>
                </div>
                <div className="fast">
                    
                        <h4>{receivedData.source} - {receivedData.destination}  |  </h4>
                        <p>{DateComponent({ dateVal: departure })}</p>
                    
                </div>
                
            </div>
            <div className="bus-body-booking">
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
                <div className="price-summary-bus-booking">
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
                    <button className="bus-book-btton" onClick={confirmBusBooking} >Proceed to Book</button>
                    {
                        isModalOpen ? <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={bookingConfirmation} /> : null
                    }
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