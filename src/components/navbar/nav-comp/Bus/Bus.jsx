import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { DateComponent } from "../../../Date/Date";
import Calendar from "react-calendar";
import { BusFooter } from "./BusFooter";
import "./Bus.css";
import styles from "./Bus.css";
export function Bus() {

    const navigate = useNavigate();

    const [data,setData]=useState([])
    const [filteredData, setFilteredData] = useState([]);

    const [show_ticket,setShow_ticket]=useState(false);
    const [source,setSource]=useState("delhi");
    const [showCal, setShowCal] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [displayDepart, setDisplayDepart] = useState("");
    const [displayToday, setDisplayToday] = useState("");
    const [searchOn, setSearchOn] = useState([false, false]);
    const [clickDay, setClickDay] = useState('Wed');
    const [isToggled, setIsToggled] = useState({depart : false, arrive : false, busType : false});
    const [showSeat, setShowSeat] = useState(false);
    const [clickedSeats, setClickedSeats] = useState([]);
    const [showAmenities, setShowAmenities] = useState(false)

    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedArrivalTime, setSelectedArrivalTime] = useState("");
    const [selectedBusType, setSelectedBusType] = useState("");

    const amenities = [
        {label: 'WiFi'},
        {label: 'Water Bottle'},
        {label: 'Reading Light'},
        {label: 'CCTV'},
        {label: 'Pillow'},
        {label: 'Charging Point'},
        {label: 'Personal TV'},
        {label: 'Snack Box'},
        {label: 'TV'}
      ]

      const [isChecked, setChecked] = useState(
        {
            forAmenities: Array(amenities.length).fill(false)
        });


        useEffect(() => {
            try {
                axios.get(`https://academics.newtonschool.co/api/v1/bookingportals/bus?search={"source":"${currData.source}","destination":"${currData.destination}"}&day=${currData.day}`,
                    {
                        headers: {
                            projectID: 'zvc3foel7gfi',
                        }
                    }
                )
                .then((response) => {
                    let filData = response.data.data.buses;
                    setData(filData);
                    setFilteredData(filData);
                    if(filData.length==0){
                        alert("No data fetched");
                      }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error or set an error state
            }
        }, [searchOn[1]]);


    const [currData,setCurrdata]=useState({
        source:"",
        destination:"",
        departure: new Date(),
        tickets:"",
        day: "Mon",
        seatCount: 0
    })

    const handleSeatClick = (seatNumber) => {
        setCurrdata((prevData) => ({
          ...prevData,
          seatCount: prevData.seatCount + (clickedSeats.includes(seatNumber) ? -1 : 1),
        }));
        setClickedSeats((prevClickedSeats) => {
            if (prevClickedSeats.includes(seatNumber)) {
              return prevClickedSeats.filter((clickedSeat) => clickedSeat !== seatNumber);
            } else {
              return [...prevClickedSeats, seatNumber];
            }
          });
      };

    const handleDateChange = (date) => {
            setCurrdata({
                ...currData,
                departure : date
            });
      };

    const handleDayClick = (date) => {
        DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay })
        
        setCurrdata((prev) => {
            //console.log(clickDay);
            return {
            ...prev,
            day: clickDay
            }
        });
    }

      const handleChange=(e)=>{

        const {name,value,checked,type} =e.target;
        setCurrdata({
            ...currData,
            [name]:type === 'checkbox' ? checked :value
        })
        
    }

    const handleAmenityChange = (index) => {
        const newChecked = { ...isChecked };
        newChecked.forAmenities[index] = !newChecked.forAmenities[index];
        setChecked(newChecked);
    };

    useEffect(() => {
        let filtData = data;

        if (selectedBusType && isToggled.busType) {
            filtData = filtData.filter(bus => {
                    const busTypeInfo = bus.type;
                    switch (selectedBusType) {
                        case "AC":
                        return busTypeInfo === 'AC';
                        case "Non-AC":
                        return busTypeInfo === 'Non-AC'
                        default:
                        return true;
                    }
                });
        }

        if (selectedDepartureTime && isToggled.depart) {
            filtData = filtData.filter(bus => {
                    const departureHour = parseInt(bus.departureTime.split(":")[0]);
                    switch (selectedDepartureTime) {
                        case "before6AM":
                        return departureHour < 6;
                        case "6AMto12PM":
                        return departureHour >= 6 && departureHour < 12;
                        case "12PMto6PM":
                        return departureHour >= 12 && departureHour < 18;
                        case "after6PM":
                        return departureHour >= 18;
                        default:
                        return true;
                    }
                });
        }
    
        // Filter by stops
        if (selectedArrivalTime  && isToggled.arrive) {
            filtData = filtData.filter(bus => {
                const arrivalHour = parseInt(bus.arrivalTime.split(":")[0]);
                    switch (selectedArrivalTime) {
                        case "before6AM":
                        return arrivalHour < 6;
                        case "6AMto12PM":
                        return arrivalHour >= 6 && arrivalHour < 12;
                        case "12PMto6PM":
                        return arrivalHour >= 12 && arrivalHour < 18;
                        case "after6PM":
                        return arrivalHour >= 18;
                        default:
                        return true;
                    }
                });
        }

        filtData = filtData.filter((bus) => {
            if (isChecked.forAmenities.some(Boolean)) {
                const amenitiesFilter = amenities
                .filter((amenity, i) => isChecked.forAmenities[i])
                .some(amenity => bus.amenities.includes(amenity.label));

                if (!amenitiesFilter) {
                    return false;
                }
            }

            return true;
        });
    
        setFilteredData(filtData)
    }, [selectedDepartureTime, selectedArrivalTime, isToggled, isChecked])
        
        console.log(filteredData)


    return (
        <div className={styles.mainDiv}>   
            <div className="Home">
             <div className="background-col" ></div>
            <div className="background-col2"></div>
        <div className="bus-headline">
                <h2 className="bus-headline-h1">Bus Ticket Booking</h2>
                
            
            <div className="destination-crousal-div">
                <div className="destination">
                    <div>
                        <div className="from-section">
                            <label>FROM</label>
                            <input type="text" name="source"  className="input-from" onChange={handleChange} />
                        </div>
                        
                    </div>
                    <div>
                        <div className="from-section">
                            <label>TO</label>
                            <input type="text" name="destination"  className="input-from" onChange={handleChange} />

                        </div>
                        
                    </div>
                    <div className="date-travel">
                        <label className="labelBus" htmlFor="">Travel Date</label>
                        <div className="datewrapper">
                            <input className="inp-date" type="text" name="departure" onClick={() => setShowCal(!showCal)} value={displayDepart} />
                            <DateComponent dateVal = { currData.departure } setterFnc={setDisplayDepart} type="departure" />
                            <div className="date-tomorrow">
                                <span className="span" onClick={() => handleDateChange(new Date)} onClickDay={handleDayClick} ><p>Today</p>
                                    <DateComponent dateVal = { currData.departure } setterFnc={setDisplayToday} type="today" />
                                    {displayToday}
                                </span>
                                <span className="span" onClick={() => handleDateChange(new Date().setDate(new Date().getDate() + 1))} onClickDay={handleDayClick} >Tommorrow</span>

                            </div>
                            { showCal ?
                                (
                                <div className='calendarF'>
                                    <Calendar id="dateFlight" onChange={handleDateChange} onClickDay={handleDayClick} />
                                    <button className="calendarButtonF" onClick={() => setShowCal(!showCal)}>Done</button>
                                </div>
                                )
                            : null }
                        </div>
                    </div>
                    <div className="lower-part-destination">
                    
                                    <div className={styles.lowerPartDestinationChild}>
                                        <img  src="https://gos3.ibcdn.com/social-distance-small-1592916992.png" alt="" />
                            <span>Social Distancing</span>
                        </div>
                                <div className={styles.knowMore}>
                                        <span className="pad">Introducing Distancing in select bus. <a href>know more</a></span>
                            </div>
                        

                    </div>
                    <div className="div-sersch-bus">
                        < button className="btn-search-bus" onClick={() => {
                            setSearchOn((prev) => [prev[0] = true, !prev[1]])}}>SEARCH BUS</button>
                    </div>
                </div>
                
                        
                         <div className="rightSection">

                    <div className="rightSection1">
                    <img src="https://gos3.ibcdn.com/gosafe1-1593079151.png" alt="" />
                    </div>


                    <div className="rightSection2">
                    <div className="r1">
                            <img src="https://gos3.ibcdn.com/img-1625069014.jpg" alt="" />
                        </div>
                        
                        <div className="r2">
                          <img src="https://gos3.ibcdn.com/img-1626751565.jpg" alt="" />
                        </div>
                    </div>


                </div>
            </div>
        </div>

            </div>
        {searchOn[0]? 
            <div className="filterResultB">
                <div className="filtersB" >
                            <h3>Filters</h3>
                            <hr></hr>

                            <div className="filterBorderB">

                                    <h4>Bus Type</h4>

                                    <div className="busTypeB">

                                        <button
                                            style={{
                                                backgroundColor: selectedBusType === "AC" && isToggled.busType ? 'blue' : 'initial',
                                                color: selectedBusType === "AC" && isToggled.busType ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedBusType("AC")
                                                setIsToggled((prev) => ({ ...prev, busType: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, busType: !prev.busType }))}
                                            >
                                            AC
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedBusType === "Non-AC" && isToggled.busType ? 'blue' : 'initial',
                                                color: selectedBusType === "Non-AC" && isToggled.busType ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                    setSelectedBusType("Non-AC"),
                                                    setIsToggled((prev) => ({ ...prev, busType: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, busType: !prev.busType }))}
                                            >
                                            Non-AC
                                        </button>

                                    </div>

                                    <hr></hr>
                                    <h4>Departure Time</h4>

                                    <div className="departuresB">

                                        <button
                                            style={{
                                                backgroundColor: selectedDepartureTime === "before6AM" && isToggled.depart ? 'blue' : 'initial',
                                                color: selectedDepartureTime === "before6AM" && isToggled.depart ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedDepartureTime("before6AM")
                                                setIsToggled((prev) => ({ ...prev, depart: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                            >
                                            Before 6AM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedDepartureTime === "6AMto12PM" && isToggled.depart ? 'blue' : 'initial',
                                                color: selectedDepartureTime === "6AMto12PM" && isToggled.depart ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                    setSelectedDepartureTime("6AMto12PM"),
                                                    setIsToggled((prev) => ({ ...prev, depart: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                            >
                                            6AM - 12PM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedDepartureTime === "12PMto6PM" && isToggled.depart ? 'blue' : 'initial',
                                                color: selectedDepartureTime === "12PMto6PM" && isToggled.depart ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedDepartureTime("12PMto6PM")
                                                setIsToggled((prev) => ({ ...prev, depart: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                            >
                                            12PM - 6PM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedDepartureTime === "after6PM" && isToggled.depart ? 'blue' : 'initial',
                                                color: selectedDepartureTime === "after6PM" && isToggled.depart ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedDepartureTime("after6PM")
                                                setIsToggled((prev) => ({ ...prev, depart: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                            >
                                            After 6PM
                                        </button>

                                    </div>
                                    <hr></hr>
                                    <h4>Arrival Time</h4>

                                    <div className="arrivalB">

                                        <button
                                            style={{
                                                backgroundColor: selectedArrivalTime === "before6AM" && isToggled.arrive ? 'blue' : 'initial',
                                                color: selectedArrivalTime === "before6AM" && isToggled.arrive ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedArrivalTime("before6AM")
                                                setIsToggled((prev) => ({ ...prev, arrive: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                            >
                                            Before 6AM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedArrivalTime === "6AMto12PM" && isToggled.arrive ? 'blue' : 'initial',
                                                color: selectedArrivalTime === "6AMto12PM" && isToggled.arrive ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                    setSelectedArrivalTime("6AMto12PM"),
                                                    setIsToggled((prev) => ({ ...prev, arrive: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                            >
                                            6AM - 12PM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedArrivalTime === "12PMto6PM" && isToggled.arrive ? 'blue' : 'initial',
                                                color: selectedArrivalTime === "12PMto6PM" && isToggled.arrive ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedArrivalTime("12PMto6PM")
                                                setIsToggled((prev) => ({ ...prev, arrive: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrival: !prev.arrive }))}
                                            >
                                            12PM - 6PM
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: selectedArrivalTime === "after6PM" && isToggled.arrive ? 'blue' : 'initial',
                                                color: selectedArrivalTime === "after6PM" && isToggled.arrive ? 'white' : 'black'
                                            }}
                                            onClick={() => {
                                                setSelectedArrivalTime("after6PM")
                                                setIsToggled((prev) => ({ ...prev, arrive: true }));
                                            }}
                                            onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                            >
                                            After 6PM
                                        </button>
                                    </div>
                                    <hr></hr>
                                    <div className='filterSectionAmenitiesB'>
                                            <h3>Amenities</h3>
                                            {amenities.map((amenity, index) => (
                                                <div key={amenity.label}>
                                                    <input
                                                        type="checkbox"
                                                        id={amenity.label}
                                                        checked={isChecked.forAmenities[index]}
                                                        onChange={() => handleAmenityChange(index)}
                                                    />
                                                    <label htmlFor={amenity.label}>{amenity.label}</label>
                                                </div>
                                            ))}
                                    </div>
                            </div>
                    
                </div>

            <div className="bus-cards-holder">

                        {filteredData.map((bus)=>(
                            <div className="bus-card-single">
                                    <div className="bus-card-top">
                                        <div className="bus-name-card"><h5>{bus.name}</h5></div>
                                        <div className='bus-departure-card'>{bus.departureTime}</div>
                                        <div className="bus-arrival-card">{bus.arrivalTime}</div>
                                        <div className="bus-price-card">₹ {bus.fare}</div>
                                        
                                    </div>
                            
                                        
                                    <div className='bus-card-mid'>    
                                            <div className="bus-card-type">{bus.type}</div>
                                            <div className="bus-source-card">{bus.source}</div>
                                            <div className="bus-destination-card">{bus.destination}</div>
                                            <div className="bus-seat-cards">Seats left: {bus.seats}</div>
                                    </div>
                                    <div className='bus-mid-low'>
                                        <div className="bus-rating-card">{bus.ratings}/5</div>
                                        <button className="bus-seat-show-card" onClick={() => setShowSeat(!showSeat)}>Select Seat</button>
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
                                                        }}>Proceed To Book ({currData.seatCount} seats)
                                                        </button>
                                                </div>
                                            </div>
                                        : null}
                                    <div className="show-amenities-btn-holder">
                                        <button onClick={() => setShowAmenities(!showAmenities)}>Amenities</button>
                                    </div>
                                    {showAmenities ? 
                                        <div className="amenities-list">
                                            <p>{bus.amenities.join(', ')}</p>
                                        </div>
                              
                                    : null}
                                        
                                
                            </div>
                            
                            
                        ))}
                      

                </div>
        </div>
        :
        <>
            <div className="popularBusRoutesHeading">
                <h2>Popular Bus Routes</h2>
            </div>
            <div className="popularBusRoutes">

                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Delhi Buses</h4>
                    <p className="to">To:
                        <a href>Manali, Chandigarh, Jaipur, Dehradun</a>
                    </p>
                    </div>
                </div>
                

                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Mumbai Buses</h4>
                    <p className="to">To:
                        <a href>Goa, Pune, Bangalore, Shirdi</a>
                    </p>
                    </div>
                </div>
                
                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Chennai Buses</h4>
                    <p className="to">To:
                        <a href>Coimbatore, Pondicherry, Bangalore</a>
                    </p>
                    </div>
                </div>

                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Bangalore Buses</h4>
                    <p className="to">To:
                        <a href>Mumbai, Hyderabad, Chennai, Goa</a>
                    </p>
                    </div>
                </div>
                
                 <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Hyderabad Buses</h4>
                    <p className="to">To:
                        <a href>Mumbai, Chennai, Bangalore, Goa</a>
                    </p>
                    </div>
                </div>
                
                  <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Pune Buses</h4>
                    <p className="to">To:
                        <a href>Mumbai, Shirdi, Bangalore, Goa</a>
                    </p>
                    </div>
                </div>
                
                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Kolkata Buses </h4>
                    <p className="to">To:
                        <a href>Digha, Siliguri, Durgapur, Asansol</a>
                    </p>
                    </div>
                </div>
               
                
                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Chandigarh Buses </h4>
                    <p className="to">To:
                        <a href>Manali, Delhi, Shimla, Dehradun</a>
                    </p>
                    </div>
                </div>
               
                <div className="busLogo">
               <div className="busLogo1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2276e3" class="BusIcon-sc-106t34v-0 bSKyoo"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"></path><path fill="#647a97" fill-rule="nonzero" d="M2.667 10.667c0 .586.26 1.113.666 1.48V13a1 1 0 102 0v-.333h5.334V13c0 .547.446 1 1 1 .546 0 1-.447 1-1v-.853c.406-.367.666-.894.666-1.48V4c0-2.333-2.386-2.667-5.333-2.667S2.667 1.667 2.667 4v6.667zM5 11.333a1 1 0 111-1c0 .554-.447 1-1 1zm6 0a1 1 0 111-1c0 .554-.447 1-1 1zm1-4H4V4h8v3.333z"></path></g></svg></div>
                <div>
               <h4> Coimbatore Busess </h4>
                    <p className="to">To:
                        <a href>Chennai, Ooty, Bangalore, Mysore</a>
                    </p>
                    </div>
                </div>

            </div>
        
            <BusFooter />
        </> }
        </div>
    )
}













