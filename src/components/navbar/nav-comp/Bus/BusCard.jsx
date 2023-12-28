import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export const BusCard = ({ bus, index, setCurrdata, currData }) => {
    const navigate = useNavigate();
    const [showSeat, setShowSeat] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const [clickedSeats, setClickedSeats] = useState([]);
    const [seatCnt, setSeatCnt] = useState(0);

    const handleSeatClick = (seatNumber) => {
        setSeatCnt((prevData) => prevData + (clickedSeats.includes(seatNumber) ? -1 : 1));
        setClickedSeats((prevClickedSeats) => {
            if (prevClickedSeats.includes(seatNumber)) {
              return prevClickedSeats.filter((clickedSeat) => clickedSeat !== seatNumber);
            } else {
              return [...prevClickedSeats, seatNumber];
            }
        });
    };

    useEffect(() => {
        setCurrdata((prevData) => 
        ({
            ...prevData, seatCount: seatCnt
        })
        )
    }, [seatCnt])

    return (
        <div className="bus-card-single">
            <div className="bus-card-top">
                <div className="bus-name-card"><h5>{bus.name}</h5></div>
                <div className='bus-departure-card'><h5>{bus.departureTime}</h5></div>
                <div className="bus-arrival-card"><h5>{bus.arrivalTime}</h5></div>
                <div className="bus-price-card"><h5>₹ {bus.fare}</h5></div>                                            
            </div>                                
                                            
            <div className='bus-card-mid'>    
                    <div className="bus-card-type">{bus.type}</div>
                    <div className="bus-source-card">{bus.source}</div>
                    <div className="bus-destination-card">{bus.destination}</div>
                    <div className="bus-seat-cards">Seats left: {bus.seats}</div>
            </div>
            <div className='bus-mid-low'>
                <div className="bus-rating-card">{bus.ratings}/5</div>
                <div>
                    {index%(Math.floor(Math.random() * 4) + 1)===0 ?                                         
                        <span className="goDealApplied">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#f4a900" width="1.5rem" height="1.5rem" class="OffersIcon-sc-1e79akd-0 gWQjzI"><path d="M32 16v-.047a5.808 5.808 0 00-3-5.086l-.03-.015a.334.334 0 01-.159-.386l-.001.002a5.888 5.888 0 00-7.321-7.271l.042-.01a.335.335 0 01-.383-.158l-.001-.002c-1.025-1.82-2.945-3.03-5.148-3.03s-4.123 1.209-5.132 3l-.015.029a.334.334 0 01-.386.159l.002.001A5.888 5.888 0 003.2 10.508l-.01-.042a.33.33 0 01-.16.384C1.21 11.875 0 13.795 0 15.998s1.209 4.123 3 5.132l.029.015a.333.333 0 01.16.384A5.888 5.888 0 0010.51 28.8l-.042.01a.33.33 0 01.384.16c1.025 1.819 2.945 3.028 5.147 3.028S20.12 30.789 21.13 29l.015-.029a.335.335 0 01.388-.16l-.002-.001a5.888 5.888 0 007.268-7.32l.01.042a.334.334 0 01.158-.385l.002-.001c1.818-1.005 3.03-2.911 3.03-5.1v-.051.003zm-11.123 7.315h-.001a2.438 2.438 0 01-.001-4.876h.001a2.438 2.438 0 01.001 4.876zm-10.439.132a1.333 1.333 0 01-1.88-1.883l-.001.001L21.562 8.562a1.332 1.332 0 111.882 1.88l-.001.001-13.005 13.001zm.685-14.762a2.438 2.438 0 110 4.876 2.438 2.438 0 110-4.876z"></path></svg>
                            &nbsp;goDeal applied
                        </span>
                    : null}
                    <button className="bus-seat-show-card" onClick={() => setShowSeat(!showSeat)}>Select Seat</button>
                </div>
            </div>
                {showSeat?
                    <div className="seat-holder">
                        <div className="board-drop-point">
                            <div className="board-point">
                                <h5>Boarding Point</h5>
                                <p>{bus.departureTime}</p>
                                <p>{bus.source}</p>
                            </div>
                            <div className="drop-point">
                                <h5>Dropping Point</h5>
                                <p>{bus.arrivalTime}</p>
                                <p>{bus.destination}</p>
                            </div>
                        </div>
                        <div className="seat-select">
                            <div className="seat-container">
                                <p>Select seat position</p>
                                {[...Array(3)].map((row, rowIndex) => (
                                    <div key={rowIndex} className="seat-row">
                                    {[...Array(6)].map((_, columnIndex) => {
                                        const seatNumber = rowIndex * 6 + columnIndex + 1;
                                        return (
                                        <div
                                            key={seatNumber}
                                            className={`seat ${clickedSeats.includes(seatNumber) ? 'clicked' : ''}`}
                                            onClick={() => handleSeatClick(seatNumber)}
                                        >
                                        </div>
                                        );
                                    })}
                                    </div>
                                ))}
                                </div>
                                <button onClick={()=>{
                                    {navigate(`/bus/${bus._id}`, { state: { currData }}
                                    )}
                                }}>Proceed To Book ({seatCnt} seats)
                                </button>
                        </div>
                    </div>
                : null}
                <div className="show-amenities-btn-holder">
                    <span className="liveTracking">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#647a97" width="1.5rem" height="1.5rem" class="LiveBusIcon-sc-haxyte-0 iyvUcy"><path d="M15.272 26.548h4.822v3.212a.803.803 0 01-.803.802h-3.217a.804.804 0 01-.802-.802v-3.212zm-12.86 0h4.822v3.212a.803.803 0 01-.803.802H3.216a.803.803 0 01-.803-.802v-3.212z"></path><path d="M17.789 8.089a2.31 2.31 0 012.306 2.314v16.21c0 .85-.688 1.539-1.538 1.541H3.95a1.541 1.541 0 01-1.538-1.541V10.402a2.31 2.31 0 012.307-2.314h13.069zm-2.601 2.149H7.643a3.368 3.368 0 00-3.368 3.368v3.82a3.368 3.368 0 003.368 3.368h7.545a3.368 3.368 0 003.368-3.368v-3.818a3.368 3.368 0 00-3.368-3.368z"></path><path d="M2.412 14.509v5.619H.804a.803.803 0 01-.803-.803v-4.012c0-.443.36-.803.803-.803h1.608z"></path><path stroke-width="1.684" stroke="#000" d="M19.146 1.684c4.399 0 7.978 3.683 7.978 8.211 0 4.967-5.546 10.617-7.247 12.231a1.032 1.032 0 01-1.46 0h0c-1.701-1.613-7.247-7.264-7.247-12.231 0-4.527 3.577-8.211 7.976-8.211zm.222 6.737a2.526 2.526 0 000 5.052v0a2.526 2.526 0 000-5.052v0z"></path></svg>
                        &nbsp;Live Tracking
                    </span>
                    <button onClick={() => setShowAmenities(!showAmenities)}>Amenities&nbsp;
                        {showAmenities ? 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="0.9rem" height="0.9rem" fill="#2276e3" class="DropArrowIcon-sc-175sk62-0 irXHlx"><path transform="rotate(180 16 16)" d="M5.224 6.944a2.95 2.95 0 00-2.164-.942 2.95 2.95 0 00-2.159.936l-.002.002c-1.2 1.252-1.2 3.292-.008 4.548L13.839 25.06c.542.579 1.311.94 2.164.94s1.622-.361 2.162-.939l.002-.002 12.94-13.568a3.281 3.281 0 00.892-2.255v-.034c0-.875-.341-1.671-.898-2.261l.002.002C30.561 6.362 29.791 6 28.937 6s-1.624.362-2.164.941l-.002.002-10.772 11.296L5.223 6.943z"></path></svg>
                        : 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="0.9rem" height="0.9rem" fill="#2276e3" class="DropArrowIcon-sc-175sk62-0 gEBrqN"><path d="M5.224 6.944a2.95 2.95 0 00-2.164-.942 2.95 2.95 0 00-2.159.936l-.002.002c-1.2 1.252-1.2 3.292-.008 4.548L13.839 25.06c.542.579 1.311.94 2.164.94s1.622-.361 2.162-.939l.002-.002 12.94-13.568a3.281 3.281 0 00.892-2.255v-.034c0-.875-.341-1.671-.898-2.261l.002.002C30.561 6.362 29.791 6 28.937 6s-1.624.362-2.164.941l-.002.002-10.772 11.296L5.223 6.943z"></path></svg>
                        }
                    </button>
                </div>

                {showAmenities ? 
                    <div className="amenities-list">
                        <p>{bus.amenities.join(', ')}</p>
                    </div>
        
                : null}
        </div>
    )
}