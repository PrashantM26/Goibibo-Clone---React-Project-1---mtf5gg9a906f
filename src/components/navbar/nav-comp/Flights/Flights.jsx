import { useEffect, useState } from 'react';
import "./Flights.css";
//import { ProductCarousel } from './ProductCarousel';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SelectPassenger } from './../Flights/SelectPassenger';
import { DateComponent } from '../../../Date/Date';
import Loader from '../../../../Loader';
import { FlightsFooter } from './FlightsFooter';


export function Flights()
{
    const navigate = useNavigate();

    const [data,setData]=useState([])
    const [filteredData, setFilteredData] = useState([]);
    //const [count,setCount]=useState(0)
    //const [ticketType,setTickettype]=useState("")
    const [show_ticket,setShow_ticket]=useState(false);
    const [from,setForm]=useState("delhi");
    const [showCal1, setShowCal1] = useState(false);
    const [showCal2, setShowCal2] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [displayDepart, setDisplayDepart] = useState("");
    const [displayReturn, setDisplayReturn] = useState("");
    const [searchOn, setSearchOn] = useState([false, false]);
    const [clickDay, setClickDay] = useState('Wed');
    //const [isToggled, setIsToggled] = useState({depart : false, stop : false});


    const [selectedDepartureTime, setSelectedDepartureTime] = useState([]);
    const [selectedStops, setSelectedStops] = useState([]);
    const [priceRange, setPriceRange] = useState([]);
    const [maxSelPrice, setMaxSelPrice] = useState();
    const [durationRange, setDurationRange] = useState([]);
    const [maxSelDuration, setMaxSelDuration] = useState();

    const airportAndCity = {
        'IXJ':{city:'jammu'},
        'CCU':{city:'kolkata'},
        'MAA':{city:'chennai'},
        'ATQ':{city:'punjab'},
        'BLR':{city:'bengaluru'},
        'BBI':{city:'bhubaneswar'},
        'PAT':{city:'patna'},
        'DEL':{city:'new delhi'},
        'BOM':{city:'mumbai'},
        'NAG':{city:'nagpur'},
        'PNQ':{city:'pune'},
        'DED':{city:'dehradun'},
        'GOI':{city:'goa'},
        'GAU':{city:'guwahati'},
        'RPR':{city:'chhattisgarh'},
        'IXM':{city:'madurai'},
        'GAY':{city:'gaya'},
        'AMD':{city:'ahmedabad'},
        'BDQ':{city:'vadodara'},
        'STV':{city:'surat'},
        'IXE':{city:'mangaluru'},
        'JAI':{city:'jaipur'},
        'LKO':{city:'lucknow'},
        'COK':{city:'cochin'},
    }

    const [currData,setCurrdata]=useState({
        from:"",
        destination:"",
        departure: new Date(),
        return: new Date(),
        tickettype:"Economy",
        adults:1,
        children:0,
        infants:0,
        tickets:"",
        day: "Mon"

    })



    useEffect(()=>{

        axios.get(`https://academics.newtonschool.co/api/v1/bookingportals/flight/?search={"source":"${currData.from}","destination":"${currData.destination}"}&day=${currData.day}`,
        {
            headers: {
              projectID: 'zvc3foel7gfi',
            }
          }
        )
        .then((response) => {
          let filData = response.data.data.flights;
          setData(filData);
          setFilteredData(filData);
          //console.log(filData);
          if(filData.length==0){
            alert("No data fetched");
          }
          const durations = filData.map(flight => flight.duration);
          const minDuration = Math.min(...durations);
          const maxDuration = Math.max(...durations);
          setDurationRange([minDuration, maxDuration]);
          setMaxSelDuration(maxDuration)
      
          // Calculate and set price range
          const prices = filData.map(flight => flight.ticketPrice);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
          setMaxSelPrice(maxPrice);

        //})
        
    //}, [searchOn[1]])

    //Ask doubt for double useEffect with same dependency
    //useEffect(() => {
        //let filData = data;
                    // Filter by departure time
            
            //}
            //console.log("Filters Applied")
    })
    },[searchOn[1]])

    
    /*const allVals = ( {adults, children, infants, ticketType} ) => {
      setCurrdata({
        ...currData,
        tickettype: ticketType,
        adults: adults,
        children: children,
        infants: infants,
        tickets: adults + children + infants
      });
    }*/

    


    /*const handleChange=(e)=>{

        const {name,value,checked,type} =e.target;
        const inputData = value.toLowerCase();
        const matchingCode = Object.keys(airportAndCity).find(
            code => airportAndCity[code].city.toLowerCase() === inputData
          );
        console.log("Matching Code            jhghfgfgfg      ",matchingCode)
        if (matchingCode) {
            setCurrdata({
                ...currData,
                [name]:type === 'checkbox' ? checked : matchingCode ? matchingCode : value
            })
        }

    }*/

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const inputData = value.toLowerCase();
        // Check if the input matches a city name
        const matchingCity = Object.keys(airportAndCity).find(
          (code) => airportAndCity[code].city.toLowerCase() === inputData
        );
        // Check if the input is a known city
        if (matchingCity) {
          setCurrdata({
            ...currData,
            [name]: type === 'checkbox' ? checked : matchingCity
          });
        }
      };

    //console.log(currData);


    const handleDateChange = (date, type) => {
        if(type === "start"){
            DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay })
            setCurrdata({
                ...currData,
                departure : date
            });
          }
          else if(type === "end"){
            setCurrdata({
                ...currData,
                return : date
            });
          }
        /*setDateRange(date)
        DateComponent({ dateVal : date[0], type : "shortDay", setterFnc : setClickDay })
        setCurrdata({
            ...currData,
            departure : date[0],
            return : date[1]
        });*/
        //console.log(date)
        /*if(clickCount === 0 && date.getTime() < currData.return.getTime()) {
            setCurrdata({
                ...currData,
                departure : date
            });
            setClickCount(1);
        }
        else {
          if(currData.departure.getTime() < date.getTime()){
            setCurrdata({
                ...currData,
                return : date
            });
            setClickCount(0);
          }
          /*else{
            setCurrdata({
                ...currData,
                departure : date
            });
            setClickCount(1);
          }*
        }*/
      };

    useEffect(() => {
        setCurrdata((prev) => ({
            ...prev,
            day: clickDay
        }));
    }, [clickDay]);


    //Ask doubt here
    /*const handleDayClick = (date) => {            //Not needed now
        console.log("ATTENTION", date)
        //DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay })
        
        /*setCurrdata((prev) => {
            //console.log(clickDay);
            return {
            ...prev,
            day: clickDay
            }
        });*
    }*/
    //Using useEffect made it work
        //console.log("DAY    CURR         ",currData.day)

    const handlebook=async (e)=>{
        /*const data =await axios.post('http://localhost:3004/bookmarks', e)
        console.log("bookmarked",data.data)*/
    }


    if(currData.departure.getTime() > currData.return.getTime() || currData.return > new Date(currData.departure.getTime() + 19 * 24 * 60 * 60 * 1000)){
        /*const eD = new date(startDate).setdate(startDate.getdate() + 1)
          setEndDate(eD);*/
          const newendDate = new Date(currData.departure.getTime());
          //newendDate.setDate(currData.departure.getDate() + 1);
          setCurrdata({
            ...currData,
            return: newendDate
          });
          setClickCount(0);
    }


    const handleDepartureTime = (time, click) => {
        setSelectedDepartureTime((prev) => {
            if (prev.includes(time)) {
                return prev.filter((selectedTime) => selectedTime !== time);
            } else {
                return [...prev, time];
            }
        });
        /*if(click==="singleClick"){
            setIsToggled((prev) => ({ ...prev, depart: true }));
        }
        else{
            setIsToggled((prev) => ({ ...prev, depart: !prev.depart }));
        }*/
    };

    const handleStops = (stop) => {
        setSelectedStops((prev) => {
            if (prev.includes(stop)) {
                return prev.filter((st) => st !== stop);
            } else {
                return [...prev, stop];
            }
        });
    };


useEffect(() => {
    let filtData = data;
    if (selectedDepartureTime.length>0) {
        filtData = filtData.filter(flight => {
                const departureHour = parseInt(flight.departureTime.split(":")[0]);
                /*switch (selectedDepartureTime) {
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
                }*/
                return selectedDepartureTime.includes(getTimeRange(departureHour));
            });
    }

    // Filter by stops
    if (selectedStops.length>0) {
        filtData = filtData.filter(flight => {
            const stops = flight.stops;
            /*switch (selectedStops) {
                case "direct":
                return stops === 0;
                case "1stop":
                return stops === 1;
                case "2plusstops":
                return stops >= 2;
                default:
                return true;
            }*/
            return selectedStops.includes(getStopCount(stops))
        });
    }


    // Filter by price range

    filtData = filtData.filter(flight => {
            const ticketPrice = flight.ticketPrice;
            return (ticketPrice >= priceRange[0] && ticketPrice <= maxSelPrice);
        })
    

    filtData = filtData.filter(flight => {
            const duration = flight.duration;
            return (duration >= durationRange[0] && duration <= maxSelDuration);
        })
    
    //console.log(filData)
    //if(searchOn[1]){
        setFilteredData(filtData)
}, [selectedDepartureTime, selectedStops, maxSelDuration, maxSelPrice])
    
    //console.log(filteredData)

    const getTimeRange = (departureHour) => {
        if (departureHour < 6) {
          return "before6AM";
        } else if (departureHour < 12) {
          return "6AMto12PM";
        } else if (departureHour < 18) {
          return "12PMto6PM";
        } else if (departureHour >= 18) {
          return "after6PM";
        } else {
          return true;
        }
      };

    const getStopCount = (stops) => {
        if (stops === 0) {
            return "direct";
        } else if (stops === 1) {
            return "1stop";
        } else if (stops >= 2) {
            return "2plusstops";
        } else {
            return "true";
        }
    }


    return(
        <div className='flights'>
            {/*<div className="background-col" ></div>
            <div className="background-col2"></div>*/}
            {/* searchbox */}
            <div className="backgroundStyle"></div>
            <div className='flightsMainSection'>
                <div className="flightInputs">
                    <h1>Book Domestic and International Flight Tickets</h1>
                    <div className='borderFlightInputs'>
                        <div className='tripRadioF'>
                            <input type="radio" value="one-way" name='trip' />&nbsp;One way
                            <input type="radio" value="round-trip" name='trip' disabled style={{cursor: "not-allowed"}}/>&nbsp;Round trip
                        </div>
                    
            
                        <div className="flightDataInput">

                            <div className='fdi'>
                                <div className="child1">
                                    <label>From</label>   
                                    <input name="from" onChange={handleChange}></input>
                                </div>
                                {/*<div className="swapbutton">
                                <button ><img src="https://cdn-icons-png.flaticon.com/512/61/61165.png"></img></button>
                                </div>*/}
                                <div className="child1">
                                    <label>Destination</label>   
                                    <input name="destination" onChange={handleChange}></input>
                                </div>
                            </div>

                        

                            
                            <div className='fdi'>
                                <div className="child1">
                                    <label>Departure</label>
                                    <input type="text" name="departure" onClick={() => setShowCal1(!showCal1)} value={displayDepart} />
                                    <DateComponent dateVal = { currData.departure } setterFnc={setDisplayDepart} type="departure" />
                                </div>
                                { showCal1 ?
                                    (
                                        <div className='calendarF'>
                                            <Calendar id="dateFlight" value={currData.departure} minDate={new Date()} onChange={(date) => handleDateChange(date, "start")} />
                                            <button className="calendarButtonH" onClick={() => setShowCal1(!showCal1)}>Done</button>
                                        </div>
                                    )
                                : null }
                                
                                <div className="child1">
                                    <label>Return</label>   
                                    <input type="text" name="return" disabled style={{cursor: "not-allowed"}}/>{/*onClick={() => setShowCal2(!showCal2)} value={displayReturn} />
                                    <DateComponent dateVal = { currData.return } setterFnc={setDisplayReturn} type="return" />*/}
                                </div>
                                { showCal2 ?
                                    (
                                        <div className='calendarF'>
                                            <Calendar id="dateFlight" value={currData.return} minDate={new Date(currData.departure.getTime())}  maxDate={new Date(currData.return.getTime() + 19 * 24 * 60 * 60 * 1000)} onChange={(date) => handleDateChange(date, "end")} />
                                            <button className="calendarButtonH" onClick={() => setShowCal2(!showCal2)}>Done</button>
                                        </div>
                                    )
                                : null }
                            </div>

                            {/* showCal ?
                                (
                                <div className='calendarF'>
                                    <Calendar id="dateFlight" value={dateRange} minDate={new Date()} selectRange={true} onChange={handleDateChange} />
                                    <button className="calendarButtonF" onClick={() => setShowCal(!showCal)}>Done</button>
                                </div>
                                )
                                : null */}

                            {/*<div className="child1">  
                                <label>Passenger & class</label>
                                <div style={{height:"98%",padding:"15px",backgroundColor:"rgb(25, 88, 182)",borderRadius:"8px"}} onClick={()=>setShow_ticket(!show_ticket)}  >{count} travellers,{ticketType}</div>
                                </div>*/}
                            
                            <SelectPassenger valSetter={ setCurrdata }/>

                        </div>


                        <div className='fareRadioF'>
                            <span className='fareRadioFText'>Select A Fare Type:</span>
                        {/*</div>

                        <div className="fare" >*/}
                            <div className='fareRadioFInput'>
                                <div className='fri'><input type="radio" name='fare'></input>Regular</div>
                                <div className='fri'><input type="radio" name='fare'></input>Armed Forces</div>
                                <div className='fri'><input type="radio" name='fare'></input>Senior Citizen</div>
                                <div className='fri'><input type="radio" name='fare'></input>Student</div>
                                <div className='fri'><input type="radio" name='fare'></input>Doctors & Nurses</div>
                            </div>
                        </div>
                    </div>
                    <div className="child1 searchF">
                        <input type="submit" value="UPDATE SEARCH" className="searchButtonF" onClick={() => {
                            setSearchOn((prev) => [prev[0] = true, !prev[1]])
                        }} />
                    </div>

                </div>


                    
                    {/* tickets display section */}

                    
            { searchOn[0] ? 
                
                <div className="filterResultF">
                    <div className='filterHolderF'>
                        <div className="filtersF" >
                            <div>
                            <h3>Filters</h3>
                            </div>
                            <hr className='troubleMaker'></hr>

                            <div className='filterDepartStopF'>

                                <div className='filterDepartF'>
                                    <h4>Departures</h4>

                                    {/*<div className="departures">
                                        <div>Before 6 AM</div>
                                        <div> 6 AM - 12PM</div>
                                    </div>
                                    
                                    <div  className="departures">
                                        <div>12PM - 6PM</div>
                                        <div>After 6PM</div>
                                    </div>*/}
                                    <div className="departuresF">
                                        <div className='depBtnF'>
                                            <button
                                                style={{
                                                    //backgroundColor: selectedDepartureTime.includes("before6AM") && isToggled.depart ? 'blue' : 'inherit',
                                                    backgroundColor: selectedDepartureTime.includes("before6AM") ? 'blue' : '#F3F6F8',
                                                    color: selectedDepartureTime.includes("before6AM") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    /*setSelectedDepartureTime((prev) => [...prev,"before6AM"])
                                                    setIsToggled((prev) => ({ ...prev, depart: true }));*/
                                                    handleDepartureTime("before6AM")
                                                }}
                                                /*onDoubleClick={() => //setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))
                                                    handleDepartureTime("before6AM", "doubleClick")
                                                }*/
                                                >
                                                Before 6AM
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: selectedDepartureTime.includes("6AMto12PM") ? 'blue' : '#F3F6F8',
                                                    color: selectedDepartureTime.includes("6AMto12PM") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                        /*setSelectedDepartureTime("6AMto12PM"),
                                                        setIsToggled((prev) => ({ ...prev, depart: true }));*/
                                                        handleDepartureTime("6AMto12PM")
                                                }}
                                                /*onDoubleClick={() => //setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))
                                                    handleDepartureTime("6AMto12PM", "doubleClick")
                                                }*/
                                                >
                                                6AM - 12PM
                                            </button>
                                        </div>
                                        <div className='depBtnF'>
                                            <button
                                                style={{
                                                    backgroundColor: selectedDepartureTime.includes("12PMto6PM") ? 'blue' : '#F3F6F8',
                                                    color: selectedDepartureTime.includes("12PMto6PM") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    /*setSelectedDepartureTime("12PMto6PM")
                                                    setIsToggled((prev) => ({ ...prev, depart: true }));*/
                                                    handleDepartureTime("12PMto6PM")
                                                }}
                                                /*onDoubleClick={() => //setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))
                                                    handleDepartureTime("12PMto6PM", "doubleClick")
                                                }*/
                                                >
                                                12PM - 6PM
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: selectedDepartureTime.includes("after6PM") ? 'blue' : '#F3F6F8',
                                                    color: selectedDepartureTime.includes("after6PM") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    /*setSelectedDepartureTime("after6PM")
                                                    setIsToggled((prev) => ({ ...prev, depart: true }));*/
                                                    handleDepartureTime("after6PM")
                                                }}
                                                /*onDoubleClick={() => //setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))
                                                    handleDepartureTime("after6PM", "doubleClick")
                                                }*/
                                                >
                                                After 6PM
                                            </button>
                                        </div>
                                    </div>
                            
                                </div>
                                <hr></hr>

                                <div className="filterStopF">
                                    <h4>Stops</h4>
                                    <div className="stopsF">
                                        <div className='depBtnF'>
                                            <button
                                                style={{
                                                    backgroundColor: selectedStops.includes("direct") ? 'blue' : '#F3F6F8',
                                                    color: selectedStops.includes("direct") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    handleStops("direct")
                                                    //setIsToggled((prev) => ({ ...prev, stop: true }));
                                                }}
                                                //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                                >
                                                Direct
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: selectedStops.includes("1stop") ? 'blue' : '#F3F6F8',
                                                    color: selectedStops.includes("1stop") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    handleStops("1stop")
                                                    //setIsToggled((prev) => ({ ...prev, stop: true }));
                                                }}
                                                //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                                >
                                                1 Stop
                                            </button>
                                        </div>
                                        <div className='depBtnF'>
                                            <button
                                                style={{
                                                    //backgroundColor: selectedStops === "2plusstops" && isToggled.stop ? 'blue' : 'initial',
                                                    backgroundColor: selectedStops.includes("2plusstops") ? 'blue' : '#F3F6F8',
                                                    color: selectedStops.includes("2plusstops") ? 'white' : 'black'
                                                }}
                                                onClick={() => {
                                                    handleStops("2plusstops")
                                                    //setIsToggled((prev) => ({ ...prev, stop: true }));
                                                }}
                                                //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                                >
                                                2+ Stops
                                            </button>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <hr></hr>


                            <div className='rangePriceDurationF'>
                                <div>
                                    <h5>Price</h5>
                                    <div className='rangePriceF'>
                                        <p>₹ {priceRange[0]}</p>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                position: 'absolute',
                                                top: '-40px',
                                                left: `${((maxSelPrice - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#f0f0f0',
                                                padding: '5px',
                                                borderRadius: '5px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                }}
                                            >
                                                ₹{maxSelPrice}
                                            </div>
                                            <input
                                                type="range"
                                                min={priceRange[0]}
                                                max={priceRange[1]}
                                                value={maxSelPrice}
                                                onChange={(e) => setMaxSelPrice(e.target.value)}
                                            />
                                        </div>
                                        <p>₹ {priceRange[1]}</p>
                                    {/*<input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                                        />*/}
                                    </div>
                                </div>
                                <hr></hr>
                                <div>
                                    <h5>Duration</h5>
                                    <div className='rangeDurationF'>
                                        <p>{durationRange[0]} h</p>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                position: 'absolute',
                                                top: '-40px',
                                                //left: `${(maxSelDuration*(100/durationRange[1])/100) * 100}%`,
                                                //left: `${Math.min((maxSelDuration / durationRange[1]) * 100, 100)}%`,
                                                left: `${((maxSelDuration - durationRange[0]) / (durationRange[1] - durationRange[0])) * 100}%`,
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#f0f0f0',
                                                padding: '5px',
                                                borderRadius: '5px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                }}
                                            >
                                                {maxSelDuration}h
                                            </div>
                                            <input
                                                type="range"
                                                min={durationRange[0]}
                                                max={durationRange[1]}
                                                value={maxSelDuration}
                                                onChange={(e) => setMaxSelDuration(e.target.value)}
                                            />
                                        </div>
                                        <p>{durationRange[1]} h</p>
                                    </div>
                                </div>
                            </div>
                            {/*<hr></hr>
                                <div>
                                    <h4>Preffered Airlines</h4>
                                    <div className="departures" style={{flexDirection:'column' }}>
                                        <div className="checkbox_color">
                                        <input type="checkbox" value="" ></input><img src="https://play-lh.googleusercontent.com/OhZSLjRDLvFLqtDp9bIgcvAweZIg5V5uIMI_7kOaS-9nPR043DUfoibkn1BgwG7Ai1U"></img>Indigo
                                        </div>
                                        <div className="checkbox_color" >
                                        <input type="checkbox" value=""></input><img src="https://play-lh.googleusercontent.com/OhZSLjRDLvFLqtDp9bIgcvAweZIg5V5uIMI_7kOaS-9nPR043DUfoibkn1BgwG7Ai1U"></img>Airindia
                                        </div> 
                                        <div className="checkbox_color">
                                        <input type="checkbox" value=""></input><img src="https://play-lh.googleusercontent.com/OhZSLjRDLvFLqtDp9bIgcvAweZIg5V5uIMI_7kOaS-9nPR043DUfoibkn1BgwG7Ai1U"></img>Go First
                                        </div> 
                                        <div className="checkbox_color">
                                        <input type="checkbox" value=""></input><img src="https://play-lh.googleusercontent.com/OhZSLjRDLvFLqtDp9bIgcvAweZIg5V5uIMI_7kOaS-9nPR043DUfoibkn1BgwG7Ai1U"></img>Indigo
                                        </div>    
                                    </div>
                                </div>*/}
                                
                        </div>
                    </div>

                    <div className="details_flight">

                                {filteredData.map((data)=>(
                                    <div className="particular_flight">
                                        <div className='topCardLRF'>
                                            <div className='topCardLF'>
                                                <div className="curr_flight">
                                                    <div className="topHeading">{data.source}, India</div>
                                                    <div className='topHeading'>{data.stops>0 ? `${data.stops} stop(s)` : "Direct"}</div>
                                                    <div className="topHeading">{data.destination}, India</div>
                                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                                    
                                                </div>
                                                    
                                                <div className='curr_flight_mid'>    
                                                        <div className="curr_flight_data_mid">{data.departureTime}</div>
                                                        <div className="curr_flight_data_mid">{data.duration}h</div>
                                                        <div className="curr_flight_data_mid">{data.arrivalTime}</div>
                                                        <div className="curr_flight_data_mid">₹ {data.ticketPrice}</div>   
                                                </div>
                                            </div>
                                        
                                            
                                            <div className='topCardRF'>
                                                    <button onClick={()=>{
                                                            {navigate(`/flights/${data._id}`, { state: { currData }}
                                                            )}
                                                        }}>BOOK  
                                                    </button>
                                            </div>
                                            
                                        </div>

                                        <div className='offTextContainer'>
                                            <span className='offerText'>Get Rs.149 OFF on GISUPER; Extra 25 OFF on UPI&nbsp;
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" class="Discount__DiscountIcon-sc-i3dl3s-0 kPMYzm">
                                                    <defs><linearGradient id="discount_svg__a" x1="0%" x2="100%" y1="3.217%" y2="100%">
                                                        <stop offset="0%" stop-color="#1B9564"></stop><stop offset="100%" stop-color="#39D546">
                                                        </stop></linearGradient>
                                                    </defs>
                                                    <path fill="url(#discount_svg__a)" fill-rule="evenodd" d="M12 6a2.179 2.179 0 00-1.136-1.93.126.126 0 01-.06-.145 2.21 2.21 0 00-2.73-2.73.123.123 0 01-.144-.06 2.21 2.21 0 00-3.86 0 .124.124 0 01-.145.06 2.209 2.209 0 00-2.729 2.73.124.124 0 01-.06.145 2.209 2.209 0 000 3.86.127.127 0 01.06.145 2.21 2.21 0 002.729 2.73.124.124 0 01.145.06 2.21 2.21 0 003.86 0 .123.123 0 01.144-.06 2.206 2.206 0 002.729-2.73.13.13 0 01.06-.145A2.172 2.172 0 0012 6zM7.847 8.77a.925.925 0 01-.654-1.577.925.925 0 011.577.654.923.923 0 01-.923.922zm-3.77-.127a.51.51 0 01-.72-.72l4.979-4.98a.512.512 0 11.72.721l-4.979 4.98zm.077-5.412a.924.924 0 110 1.848.924.924 0 010-1.848z">
                                                    </path>
                                                </svg>
                                            </span>
                                        </div>

                                    </div>
                                    
                                    
                                ))}
                              

                    </div>

                </div>
            
            : null}
            </div>
            {!searchOn[0] ? <FlightsFooter /> : null}
        </div>
    )
}













{/*{data.filter((e)=>(e.from===`${from}`) ).map((e)=>(
                <div className="particular_flight">
                    <div className="curr_flight">
                        
                         <div ><img src={e.img}></img>  {  e.company}</div>
                         <div className="topHeading">{e.from},India</div>
                         <div className="curr_flight_time">{e.fromTime}</div>
                    </div>
                
                  <div style={{margin:"auto 0px" ,fontSize:"1.0rem"}}>{e.duration}</div>
                <div>
                 <br></br>   
                <div className="topHeading" style={{margin:"4px"}}>{e.to},India</div>
                <div className="curr_flight_time">{e.toTime}</div>
                 </div>

                <div style={{margin:"auto 0px" ,fontSize:"1.2rem"}}>
                <div ><del>&#2352;</del> {e.price}</div>   
                
                </div>
                 
           <div>
           <button onClick={()=>{
                    console.log(e)
                    handlebook(e)

                    
                }}><Link to="/checkout">BOOK</Link>  </button>
                <br></br>
           </div>
                
                </div>
                
                
            ))}*/}