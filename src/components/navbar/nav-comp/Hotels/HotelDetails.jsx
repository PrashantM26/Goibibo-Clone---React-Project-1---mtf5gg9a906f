/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the styles

export const HotelDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { guestRoomInfo, startDate, endDate, clickDay, isToggled } = location.state || {};
    const [receivedData, setReceivedData] = useState('');
    useEffect(() => {
        async function fetchHotels() {
          try {
            console.log(id);
            const response = await axios.get(
              `https://academics.newtonschool.co/api/v1/bookingportals/hotel/${id}`,
              {
                headers: {
                  projectID: 'zvc3foel7gfi',
                },
              }
            );

            setReceivedData(response.data.data);
            let recData = response.data.data;
            console.log(recData);

            //if(recData.homeRules.guestProfile.unmarriedCouplesAllowed)
    
          } catch (error) {
            console.log(error);
            alert('An error occurred while fetching datea.');
          }
    
        
        }
    
        fetchHotels();
      }, []);
    
    return(
        <div className='mainReceived'>
            {receivedData && (
                <div>
                    
                        <h1>{receivedData.name}, {receivedData.location}</h1>
                    <div className='topLineHotelOne'>
                        {isToggled[0] ? (
                            <p className='coupleFriendly'>Couple Friendly</p>
                            ): null
                        }
                        <p className='ratingOne'>{receivedData.rating}/5</p>
                    </div>
                    <br />
                    <Carousel className='carouselImage'>
                        {receivedData.images.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt={`Slide ${index}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>


            )}
        </div>

    )
}*/





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
//import { Carousel } from 'react-bootstrap';

export const HotelDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { guestRoomInfo, startDate, endDate, isToggled, nights } = location.state || {};
  const [receivedData, setReceivedData] = useState('');
  const [selectedRooms, setSelectedRooms] = useState(0);
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    async function fetchHotels() {
      try {
        console.log(id);
        const response = await axios.get(
          `https://academics.newtonschool.co/api/v1/bookingportals/hotel/${id}`,
          {
            headers: {
              projectID: 'zvc3foel7gfi',
            },
          }
        );
          
        setReceivedData(response.data.data);
      } catch (error) {
        console.log(error);
        alert('An error occurred while fetching data.');
      }
    }

    fetchHotels();
  }, []);

  const handleRoomSelection = (room) => {
    if (selectedRooms < guestRoomInfo.rooms) {
        setSelectedRooms((prev) => prev + 1);
      }
      setRoomData((prev) => {
        return [...prev, room]
      })
  }

  return (
    <div className='mainReceived'>
      <div className='upperDetailH'>
        {receivedData && (
          <div className='nameLocationRatingCarouselH'>
            <div className='nameLocationRatingH'>
              <div>
                <div className='nameCoupleH'>
                  <h2>{receivedData.name}</h2>
                  {isToggled[0] ? 
                    <span className='coupleFriendly'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="1.4rem" width="1.4rem" fill="#ff6d38" margin="" class="CoupleFriendlyIcon-sc-1akp97f-0 daAofM"><path d="M23.333 4.309A4.133 4.133 0 0019.805.025a3.776 3.776 0 00-3.539 1.627.333.333 0 01-.541 0A3.772 3.772 0 0012.194.025a4.133 4.133 0 00-3.528 4.284c0 3.236 4.564 7.081 6.533 8.585.473.37 1.137.37 1.611 0 1.957-1.503 6.523-5.349 6.523-8.585zM11.155 24.507a.335.335 0 01-.044-.566 5.866 5.866 0 10-6.888 0 .334.334 0 01-.044.567A7.674 7.674 0 000 31.335c0 .368.298.667.667.667h14a.667.667 0 00.667-.667 7.675 7.675 0 00-4.179-6.827zM7.667 22.4a3.2 3.2 0 01-3.035-4.207.333.333 0 01.496-.174 7.509 7.509 0 005.337 1.073.332.332 0 01.281.081.336.336 0 01.108.267 3.2 3.2 0 01-3.188 2.96zM27.733 24.892a.667.667 0 00-.839.28l-1.611 2.8a.335.335 0 01-.579 0l-1.611-2.8a.667.667 0 00-.839-.28 7.01 7.01 0 00-4.256 6.441c0 .368.298.667.667.667h12.667a.667.667 0 00.667-.667 7.01 7.01 0 00-4.267-6.441z"></path><path d="M19.333 18.977a4.092 4.092 0 01-.933 3.136 1.333 1.333 0 101.866 1.896 5.16 5.16 0 00.557-.651.334.334 0 01.488-.054 5.654 5.654 0 007.368 0 .338.338 0 01.488.056c.168.232.354.449.557.651a1.333 1.333 0 101.875-1.897 4.088 4.088 0 01-.933-3.136 5.667 5.667 0 10-11.334 0zm2.964.036a4.565 4.565 0 001.212-.373c.481-.226.9-.564 1.221-.987a.335.335 0 01.533 0c.322.422.741.761 1.221.987.385.18.793.306 1.212.373.173.034.29.196.267.371a2.998 2.998 0 01-5.949 0 .335.335 0 01.283-.371z"></path></svg>
                      &nbsp;<span className='beMonk'>Couple Friendly</span>
                    </span> 
                  : null}
                </div>
                <div>
                  <span><img src="https://gos3.ibcdn.com/map-1626422501.png" /> {receivedData.location}</span>
                </div>
              </div>
              <div className='topLineHotelOne'>
                <p className='ratingOne'>{receivedData.rating} / 5</p>
              </div>
            </div>
            <br />
            <div className='carouselCheckinContainer'>
              <div className='carouselContainer'>
                <Carousel className='carouselImage'>
                  {receivedData.images.map((image, index) => (
                    <img src={image} key={index} className='imageCarouselH' alt={`Slide ${index}`} />
                  ))}
                </Carousel>
                {/*<div id="carouselExample" className="carousel slide">
                  <div className="carousel-inner">
                    {receivedData.images.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img src={image} className="d-block w-100" alt={`Slide ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>*/}
                </div>
                <div className='carouselOfferContainer'>
                  <div color="#77ca7e" className='carouCancellation'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="1.4rem" width="1.4rem" fill="#77ca7e" margin="" class="ShieldIcon-sc-k4m8fy-0 dyWNxG"><path d="M29.333 5.033a2.052 2.052 0 00-1.187-1.875A29.52 29.52 0 0015.999.666 29.52 29.52 0 003.852 3.158a2.05 2.05 0 00-1.187 1.875v10.183a16.38 16.38 0 0010.437 15.291l1.423.552a4.082 4.082 0 002.947 0l1.423-.552a16.38 16.38 0 0010.437-15.291zm-4.656 5.952L16.63 21.961a1.667 1.667 0 01-1.216.676h-.133c-.442 0-.866-.176-1.179-.489l-6.103-6.1a1.667 1.667 0 012.358-2.356l4.455 4.456a.333.333 0 00.505-.039l6.667-9.095a1.667 1.667 0 012.716 1.932l-.028.038z"></path></svg>
                    <span className='carouCancellationText'>&nbsp;Free Cancellation till 24 hrs before check in</span>
                  </div>
                  <div className="besideCarouselCheck">
                    <div className="carouCheckin">
                      <p className="carouCheckinText">Check-in</p>
                      <span className="carouCheckinTime">12 PM</span>
                    </div>
                    <div className="carouCheckout">
                      <p className="carouCheckoutText">Check-out</p>
                      <span className="carouCheckoutTime">12 PM</span>
                    </div>
                  </div>
                  <div class="carouOfferContainer">
                    <div class="carouOfferImageDiv">
                      <img src="https://gos3.ibcdn.com/pnb_logo-1664589635.png" class="carouOfferImage" />
                    </div>
                    <div class="carouOfferText">
                      <p class="carouOfferCode">Use GOPNB Code</p>
                      <span class="carouOfferoff">Get ₹820 off. Pay using Punjab National Bank Credit Cards  to avail the offer.
                      </span>
                    </div>
                    <a class="carouOfferLink">+ 2 more offers</a>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    {/* Room Cards Section */}
      <div className='lowerDetailH'>
        <div className='cardsAndBooking'>
            <div className='roomCards'>
                <h2>Available Rooms</h2>
                {receivedData &&
                  receivedData.rooms.map((room, index) => (
                      <div key={index} className='roomCardSingle'>
                          {/* Left side of the card */}
                          <div className='leftSideRoomCard'>
                          {/* No image to display */}
                            <h5>{room.roomType}</h5>
                            <p><img src="https://gos3.ibcdn.com/roomSizeBlack-1678093548.png" width="22px" /> {room.roomSize}</p>
                            <p><img src="https://gos3.ibcdn.com/bedBlackIcon-1678093474.png" width="22px" /> {room.bedDetail}</p>
                          </div>

                          {/* Right side of the card */}
                          <div className='rightSideRoomCard'>
                            <p>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#008a93" width="1.7rem" height="1.7rem" class="ReserveNowPayLater__ReserverNowPayLaterIcon-sc-1n1mspl-0 gRtIHg"><path fill-rule="evenodd" d="M16.97 11.867a5.01 5.01 0 013.557 1.484A5.086 5.086 0 0122 16.933C22 19.732 19.748 22 16.97 22c-2.777 0-5.029-2.268-5.029-5.067 0-2.798 2.252-5.066 5.03-5.066zm2.494 2.973a.578.578 0 00-.813.117l-2.114 2.84a.192.192 0 01-.291.021l-1.006-1.013a.578.578 0 00-.972.262.588.588 0 00.15.565L15.58 18.8c.217.22.511.343.818.344h.085c.338-.023.649-.194.85-.468l2.245-3.02a.582.582 0 00-.113-.817zM17.05 9.2c.102 0 .184.082.184.183v1.28a.186.186 0 01-.19.183h-.177a6.256 6.256 0 00-6.04 4.618.183.183 0 01-.178.136H5.838A1.833 1.833 0 014 13.771V9.383c0-.101.082-.183.184-.183zm-8.27 3.291H6.574a.55.55 0 00-.552.549.55.55 0 00.552.549h2.205a.55.55 0 00.552-.549.55.55 0 00-.552-.549zM15.397 6c1.015 0 1.838.868 1.838 1.94a.19.19 0 01-.184.193H4.184a.18.18 0 01-.13-.056A.2.2 0 014 7.939C4 6.87 4.823 6 5.838 6z"></path></svg>
                                &nbsp;Book @ ₹0 available
                              </span>
                              <div>
                                Risk Free Booking!
                              </div>               
                            </p>
                            <ul>
                              <li>25 % Discount On F&B Services</li>
                            </ul>
                            <p className='roomCancellationText'>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" fill="#18A160" width="0.8rem" height="0.8rem" class="HappyTickMarkIcon-sc-z2gohj-0 hkokbM"><path d="M7.712 13.5a1.646 1.646 0 01-1.203.669h-.132c-.437 0-.857-.174-1.165-.484l-4.75-4.29a1.648 1.648 0 012.332-2.33l3.12 2.663a.33.33 0 00.499-.038L13.008.693a1.648 1.648 0 112.659 1.949L7.712 13.5z"></path></svg>
                              &nbsp;{room.cancellationPolicy}                             
                            </p>
                            
                          </div>
                          <div className='rightSidePriceRoomCard'>
                            <h4>₹ {room.costDetails.baseCost}</h4>
                            <p>+ ₹ {room.costDetails.taxesAndFees} taxes & Fees</p>
                            <p className='strongBoi'><strong>1 Room</strong> per night</p>
                            <button className="roomCardButton" onClick={() => handleRoomSelection(room)}>SELECT ROOM</button>
                          </div>
                      </div>
                  ))}
            </div>

            {/* Sticky Label and Button */}
            <div className='validateRoomNo'>
              {receivedData &&
                <div className='stickyContainer'>
                  <div className='stickyRoomNo'>
                      <p>Select {guestRoomInfo.rooms - selectedRooms} more room(s) to proceed</p>
                  </div>
                  <button className="stickyButton" disabled={selectedRooms !== guestRoomInfo.rooms} style={{backgroundColor: selectedRooms !== guestRoomInfo.rooms ? 'grey' : '#1CA54F'}}
                    onClick={() => 
                      {navigate(`/hotels/${receivedData._id}/booking`, { state: {guestRoomInfo, startDate, endDate, id, roomData, receivedData, nights }}
                    )}}
                  >BOOK {guestRoomInfo.rooms} ROOM(S)</button>
                </div>
              }
            </div>
            
      </div>
    </div>
  </div>
  );
};