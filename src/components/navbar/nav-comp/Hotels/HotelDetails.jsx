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
        // Increment the selectedRooms
        setSelectedRooms((prev) => prev + 1);
      }
      setRoomData((prev) => {
        return [...prev, room]
      })
  }

  return (
    <div className='mainReceived'>
    {receivedData && (
      <div>
        <h1>
          {receivedData.name}, {receivedData.location}
        </h1>
        <div className='topLineHotelOne'>
          {isToggled[0] ? <p className='coupleFriendly'>Couple Friendly</p> : null}
          <p className='ratingOne'>{receivedData.rating}/5</p>
        </div>
        <br />
        <Carousel className='carouselImage'>
          {receivedData.images.map((image, index) => (
            <div className='imageCarouselDivH' key={index}>
              <img src={image} className='imageCarouselH' alt={`Slide ${index}`} />
            </div>
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
    )}

    {/* Room Cards Section */}
        <div className='cardsAndBooking'>
            <div className='roomCards'>
                <h2>Available Rooms</h2>
                {receivedData &&
                  receivedData.rooms.map((room, index) => (
                      <div key={index} className='roomCardSingle'>
                          {/* Left side of the card */}
                          <div className='leftSideRoomCard'>
                          {/* No image to display */}
                          <p>Room Size: {room.roomSize}</p>
                          <p>Bed Detail: {room.bedDetail}</p>
                          <button className="roomCardButton" onClick={() => handleRoomSelection(room)}>Select Room</button>
                          </div>

                          {/* Right side of the card */}
                          <div className='rightSideRoomCard'>
                          <p>Cancellation Policy: {room.cancellationPolicy}</p>
                          <h5>₹ {room.costDetails.baseCost}</h5>
                          <p>+ ₹ {room.costDetails.taxesAndFees} taxes & Fees</p>
                          </div>
                      </div>
                  ))}
            </div>

            {/* Sticky Label and Button */}
            <div className='validateRoomNo'>
              <div className='stickyContainer'>
                <div className='stickyRoomNo'>
                    <p>Select {guestRoomInfo.rooms - selectedRooms} more room(s) to proceed</p>
                </div>
                <button className="stickyButton" disabled={selectedRooms !== guestRoomInfo.rooms} onClick={() => 
                    {navigate(`/hotels/${receivedData._id}/booking`, { state: {guestRoomInfo, startDate, endDate, id, roomData, receivedData, nights }}
                )}}>Book Now</button>
              </div>
            </div>
        </div>
  </div>
  );
};