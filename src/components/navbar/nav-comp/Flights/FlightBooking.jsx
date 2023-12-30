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
        <div className='bookingFlightContainer'>
          <div className='bookingBgColorF'></div>
          <div className='bookingMainPageF'>
              <div className='bookingLeftF'>
                      <div className='bookingS1F'>                         
                          <h2>{receivedData.source} - {receivedData.destination}</h2>
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
                          <div class="baggageDetailsF">
                            <span class="baggageWeightF">
                              <span class="baggageTextF">Baggage - </span>
                              <svg width="1.6rem" height="1.6rem" style={{ marginLeft: '5px', marginRight: '-8px', marginTop: '5px' }} fill="none" xmlns="http://www.w3.org/2000/svg" class="CheckIn__CheckinIcon-sc-ayznhy-0 hJPxjR marginL5"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.102 2.224H7.069V.948h.398c.251 0 .443-.205.443-.474S7.718 0 7.467 0H2.565c-.251 0-.443.205-.443.474s.192.474.443.474h.398v1.276H1.93c-.9 0-1.637.79-1.637 1.754v8.43c0 .964.738 1.754 1.637 1.754h.015v.143c0 .379.295.695.65.695h.324c.354 0 .649-.316.649-.695v-.143H6.42v.143c0 .379.295.695.649.695h.324c.355 0 .65-.316.65-.695v-.143h.014c.9 0 1.638-.79 1.638-1.754v-8.43c.059-.964-.679-1.754-1.593-1.754zM6.184.948v1.276H3.863V.948h2.32zM3.06 5.1c0-.268.128-.474.295-.474.158 0 .296.222.296.474v6.17c0 .269-.128.474-.296.474-.167 0-.295-.205-.295-.474V5.1zm2.045-.412c-.167 0-.295.205-.295.474v6.169c0 .269.128.474.295.474.168 0 .296-.205.296-.474v-6.17c0-.252-.128-.473-.296-.473zm1.455.474c0-.269.128-.474.295-.474.168 0 .296.22.296.474v6.169c0 .269-.128.474-.296.474-.167 0-.295-.205-.295-.474v-6.17z" fill="#222"></path></svg>
                              7 Kgs 
                              <span class="baggageCabinF">Cabin</span>
                              <svg width="1.6rem" height="1.6rem" style={{ marginLeft: '16px', marginRight: '-10px', marginTop: '5px' }} fill="none" xmlns="http://www.w3.org/2000/svg" class="Cabin__CabinIcon-sc-1da560d-0 hsAnyH marginL16"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.388 5.625a.28.28 0 01-.174-.062c-.31-.246-3.034-2.455-3.034-4C3.18 0 5.837 0 6.97 0c1.135 0 3.792 0 3.792 1.563 0 1.544-2.724 3.754-3.035 4a.28.28 0 01-.173.062H6.388zm5.622.28a.276.276 0 00-.313.04.327.327 0 00-.098.32c.144.593.214 1.2.214 1.861l.002.563c.007 1.177.015 3.267-.25 4.544a.323.323 0 00.125.329.276.276 0 00.33-.007c.645-.496.96-.944.96-1.368V7.814c0-.929-.327-1.57-.97-1.907zM2.127 8.689l.003-.563c0-.66.07-1.268.213-1.86a.325.325 0 00-.098-.32.278.278 0 00-.313-.04c-.642.338-.97.98-.97 1.907v4.375c0 .424.315.872.96 1.368a.276.276 0 00.33.007c.102-.071.151-.202.125-.329-.265-1.277-.257-3.367-.25-4.545zm.745-3.954c.226-.539.376-.929.41-1.417a.33.33 0 00-.044-.19L3.19 3.05l-.013-.021c-.016-.027-.032-.053-.046-.08a.29.29 0 00-.28-.155.296.296 0 00-.248.207 9.344 9.344 0 00-.413 1.87.312.312 0 00.212.34.277.277 0 00.078.012c.113 0 .22-.071.267-.187l.124-.302zm8.465-1.732c.197.589.335 1.216.412 1.864a.314.314 0 01-.211.34.284.284 0 01-.079.012.292.292 0 01-.267-.186l-.122-.297c-.226-.54-.376-.93-.41-1.418a.328.328 0 01.043-.19l.107-.177a.293.293 0 01.279-.154c.114.012.21.092.248.207zm.01 5.123c0-1.478-.368-2.359-.692-3.135l-.001-.002c-.081-.193-.16-.38-.23-.572a.298.298 0 00-.215-.193.281.281 0 00-.268.092 15.365 15.365 0 01-1.866 1.75.867.867 0 01-.228.127v1.365c.338.13.338.442-.001.57 0 0-.131.058-.292.058H6.386c-.16 0-.292-.057-.292-.057-.337-.13-.337-.442.002-.571V6.192a.874.874 0 01-.23-.126c-.4-.319-1.173-.968-1.865-1.751a.285.285 0 00-.268-.092.3.3 0 00-.216.193c-.066.182-.14.36-.216.542l-.012.03-.001.002c-.324.776-.692 1.657-.692 3.135l-.002.568c-.012 1.994-.026 4.475 1.063 5.648.406.437.932.659 1.564.659h3.5c.633 0 1.159-.222 1.565-.659 1.089-1.173 1.074-3.654 1.063-5.648l-.003-.568zM7.263 6.25H6.68V7.5h.584V6.25z" fill="#222"></path></svg>
                              15 Kgs
                              <span class="baggageCheckinF">Check-In</span>
                            </span>
                            <span class="baggageViewDetailsF">View Baggage Details</span>
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