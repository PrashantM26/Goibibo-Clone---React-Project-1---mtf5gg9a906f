import { useEffect, useState } from 'react';
import "./Flights.css";
//import { ProductCarousel } from './ProductCarousel';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
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
    const [showCal, setShowCal] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [displayDepart, setDisplayDepart] = useState("");
    const [displayReturn, setDisplayReturn] = useState("");
    const [searchOn, setSearchOn] = useState([false, false]);
    const [clickDay, setClickDay] = useState('Wed');
    const [isToggled, setIsToggled] = useState({depart : false, stop : false});
    


    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedStops, setSelectedStops] = useState("");
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
        tickettype:"",
        adults:"",
        children:"",
        infants:"",
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

    console.log(currData);


    const handleDateChange = (date) => {
        if(clickCount === 0 && date.getTime() < currData.return.getTime()) {
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
          else{
            setCurrdata({
                ...currData,
                departure : date
            });
            setClickCount(1);
          }
        }
      };


    //Ask doubt here
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
    //Using useEffect made it work
    /*useEffect(() => {
        setCurrdata((prev) => ({
            ...prev,
            day: clickDay
        }));
    }, [clickDay]);*/
        //console.log("DAY    CURR         ",currData.day)


    const handlebook=async (e)=>{
        /*const data =await axios.post('http://localhost:3004/bookmarks', e)
        console.log("bookmarked",data.data)*/
    }


    if(currData.departure.getTime() === currData.return.getTime()){
        /*const eD = new date(startDate).setdate(startDate.getdate() + 1)
          setEndDate(eD);*/
          const newendDate = new Date(currData.departure.getTime());
          newendDate.setDate(currData.departure.getDate() + 1);
          setCurrdata({
            ...currData,
            return: newendDate
          });
          setClickCount(0);
    }


useEffect(() => {
    let filtData = data;
    if (selectedDepartureTime && isToggled.depart) {
        filtData = filtData.filter(flight => {
                const departureHour = parseInt(flight.departureTime.split(":")[0]);
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
    if (selectedStops  && isToggled.stop) {
        filtData = filtData.filter(flight => {
            const stops = flight.stops;
            switch (selectedStops) {
                case "direct":
                return stops === 0;
                case "1stop":
                return stops === 1;
                case "2plusstops":
                return stops >= 2;
                default:
                return true;
            }
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
}, [selectedDepartureTime, selectedStops, maxSelDuration, maxSelPrice, isToggled])
    
    //console.log(filteredData)

    return(
        <div >
            {/*<div className="background-col" ></div>
            <div className="background-col2"></div>*/}
            {/* searchbox */}
            <div className="backgroundStyle"></div>
            <div className='flightsMainSection'>
                <div className="flightInputs">
                    <h1>Book Domestic and International Flight Tickets</h1>
                    <div className='borderFlightInputs'>
                        <div className='tripRadioF'>
                            <input type="radio" value="one-way" name='trip' />One way
                            <input type="radio" value="round-trip" name='trip' />Round trip
                        </div>
                
                
                    
            
                        <div className="flightDataInput">

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

                        


                            <div className="child1">
                                <label>Departure</label>
                                <input type="text" name="departure" onClick={() => setShowCal(!showCal)} value={displayDepart} />
                                <DateComponent dateVal = { currData.departure } setterFnc={setDisplayDepart} type="departure" />
                            </div>
                            
                            <div className="child1">
                                <label>Return</label>   
                                <input type="text" name="return" onClick={() => setShowCal(!showCal)} value={displayReturn} />
                                <DateComponent dateVal = { currData.return } setterFnc={setDisplayReturn} type="return" />
                            </div>

                            { showCal ?
                                (
                                <div className='calendarF'>
                                    <Calendar id="dateFlight" onChange={handleDateChange} onClickDay={handleDayClick} />
                                    <button className="calendarButtonF" onClick={() => setShowCal(!showCal)}>Done</button>
                                </div>
                                )
                            : null }

                            {/*<div className="child1">  
                                <label>Passenger & class</label>
                                <div style={{height:"98%",padding:"15px",backgroundColor:"rgb(25, 88, 182)",borderRadius:"8px"}} onClick={()=>setShow_ticket(!show_ticket)}  >{count} travellers,{ticketType}</div>
                                </div>*/}
                            
                            <SelectPassenger valSetter={ setCurrdata }/>

                        </div>


                        <div className='fareRadioF'>
                            Select A Fare Type:
                        {/*</div>

                        <div className="fare" >*/}
                            <input type="radio" name='fare'></input>Regular
                            <input type="radio" name='fare'></input>Armed Forces
                            <input type="radio" name='fare'></input>Senior Citizen
                            <input type="radio" name='fare'></input>Student
                            <input type="radio" name='fare'></input>Doctors & Nurses
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
                    <div>
                        <div className="filtersF" >
                            <h3>Filters</h3>
                            <hr></hr>

                            <div >
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
                            
                            </div>
                            <hr></hr>


                            <div>
                                <h4>Stops</h4>
                                <div className="stopsF">
                                    <button
                                        style={{
                                            backgroundColor: selectedStops === "direct" && isToggled.stop ? 'blue' : 'initial',
                                            color: selectedStops === "direct" && isToggled.stop ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            setSelectedStops("direct")
                                            setIsToggled((prev) => ({ ...prev, stop: true }));
                                        }}
                                        onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                        >
                                        Direct
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedStops === "1stop" && isToggled.stop ? 'blue' : 'initial',
                                            color: selectedStops === "1stop" && isToggled.stop ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            setSelectedStops("1stop")
                                            setIsToggled((prev) => ({ ...prev, stop: true }));
                                        }}
                                        onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                        >
                                        1 Stop
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedStops === "2plusstops" && isToggled.stop ? 'blue' : 'initial',
                                            color: selectedStops === "2plusstops" && isToggled.stop ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            setSelectedStops("2plusstops")
                                            setIsToggled((prev) => ({ ...prev, stop: true }));
                                        }}
                                        onDoubleClick={() => setIsToggled((prev) => ({ ...prev, stop: !prev.stop }))}
                                        >
                                        2+ Stops
                                    </button>
                                </div>

                            </div>

                            <hr></hr>


                            <div className='rangePriceDurationF'>
                                <h5>Price</h5>
                                <div className='rangePriceF'>
                                    <p>₹ {priceRange[0]}</p>
                                    <input
                                        type="range"
                                        min={priceRange[0]}
                                        max={priceRange[1]}
                                        value={maxSelPrice}
                                        onChange={(e) => setMaxSelPrice(e.target.value)}
                                    />
                                    <p>₹ {priceRange[1]}</p>
                                {/*<input
                                    type="range"
                                    min={minPrice}
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                                    />*/}
                                </div>
                                <h5>Duration</h5>
                                <div className='rangeDurationF'>
                                    <p>{durationRange[0]} Hrs</p>
                                    <input
                                        type="range"
                                        min={durationRange[0]}
                                        max={durationRange[1]}
                                        value={maxSelDuration}
                                        onChange={(e) => setMaxSelDuration(e.target.value)}
                                    />
                                    <p>{durationRange[1]} Hrs</p>
                                </div>
                            </div>
                            <hr></hr>
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
                                </div>
                                
                        </div>
                    </div>

                    <div className="details_flight">

                                {filteredData.map((data)=>(
                                    <div className="particular_flight">
                                            <div className="curr_flight">
                                                <div className="topHeading">{data.source},India</div>
                                                <div className='durationCardF'>Duration</div>
                                                <div className="topHeading">{data.destination}India</div>
                                                
                                            </div>
                                    
                                                
                                            <div className='curr_flight_mid'>    
                                                    <div className="curr_flight_time">{data.departureTime}</div>
                                                    <div>{data.duration}h</div>
                                                    <div className="curr_flight_time">{data.arrivalTime}</div>   
                                            </div>
                                            <div className='curr_flight_price_book'>
                                                <div >₹ {data.ticketPrice}</div>
                                                <button onClick={()=>{
                                                            {navigate(`/flights/${data._id}`, { state: { currData }}
                                                            )}
                                                        }}>BOOK  
                                                </button>
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