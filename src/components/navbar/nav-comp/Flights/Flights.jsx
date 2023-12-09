import { useEffect, useState } from 'react';
import "./Flights.css";
//import { ProductCarousel } from './ProductCarousel';
import { Link } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import { SelectPassenger } from './../Flights/SelectPassenger';
import { DateComponent } from '../../../Date/Date';


export function Flights()
{
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
    const [clickDay, setClickDay] = useState('');
    const [isToggled, setIsToggled] = useState({depart : false, stop : false});



    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedStops, setSelectedStops] = useState("");
    const [priceRange, setPriceRange] = useState([]); // Adjust min and max values based on your data
    const [maxSelPrice, setMaxSelPrice] = useState();
    const [durationRange, setDurationRange] = useState([]); // Adjust min and max values based on your data
    const [maxSelDuration, setMaxSelDuration] = useState();


    const [currData,setCurrdata]=useState({
        from:"AMD",
        destination:"ATQ",
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

          console.log(filData);

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
          console.log("rendered API Called")
        //})
        
    //}, [searchOn[1]])

    //Ask doubt for double useEffect with same dependency
    //useEffect(() => {
        //let filData = data;
                    // Filter by departure time
            if (selectedDepartureTime && isToggled.depart) {
                filData = filData.filter(flight => {
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
                filData = filData.filter(flight => {
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

            filData = filData.filter(flight => {
                    const ticketPrice = flight.ticketPrice;
                    return (ticketPrice >= priceRange[0] && ticketPrice <= maxSelPrice);
                })
            

            filData = filData.filter(flight => {
                    const duration = flight.duration;
                    return (duration >= durationRange[0] && duration <= maxSelDuration);
                })
            
            //console.log(filData)
            //if(searchOn[1]){
                setFilteredData(filData)
            //}
            console.log("Filters Applied")
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




    const handleForm=(e)=>{
        e.preventDefault()
        //console.log("currData",currData)
        //setForm(currData.from)
        

    }


    const handleChange=(e)=>{

        const {name,value,checked,type} =e.target;
        setCurrdata({
            ...currData,
            [name]:type === 'checkbox' ? checked :value
        })
        
    }




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
        /*setCurrdata((prev) => ({
            ...prev,
            day: clickDay
        }));*/
    }
    //Using useEffect made it work
    useEffect(() => {
        setCurrdata((prev) => ({
            ...prev,
            day: clickDay
        }));
    }, [clickDay]);
    console.log("DAY             ",currData.day)


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


    
    return(
        <div >

            {/* searchbox */}
            
            <div className="input_data">
                <h1>Book Domestic and International Flight Tickets</h1>
                <div style={{display:"flex",justifyContent:"left",margin:"0 55px "}}>
                <input type="radio" value="one-way" />One way
                <input type="radio" value="round-trip" />Round trip
            </div>
                
            
           {console.log(filteredData)}
           
            
    <form onSubmit={handleForm}>
        <div className="parent1">

            <div className="child1">
             <label>From</label>   
             <input name="from" onChange={handleChange}></input>
            </div>
            <div className="swapbutton">
            <button ><img src="https://cdn-icons-png.flaticon.com/512/61/61165.png"></img></button>
            </div>
            <div className="child1">
            <label>Destination</label>   
            <input name="destination" onChange={handleChange}></input>
            </div>
            
           {/*<div className="child1">
           <label>Departure</label>   
           <input  type="text"   onFocus={(e) => e.target.type = 'date'}  name="departure" onChange={handleChange}></input>
               </div>
            
            <div className="child1">
            <label>Return</label>   
            <input type="text"   onFocus={(e) => e.target.type = 'date'}  name="return" onChange={handleChange}></input>
            </div>*/}

        


            <div className="child1">
           <label>Departure</label>   
           <input  type="text" name="departure" onClick={() => setShowCal(!showCal)} value={displayDepart} />
           <DateComponent dateVal = { currData.departure } setterFnc={setDisplayDepart} type="departure" />
               </div>
            
            <div className="child1">
            <label>Return</label>   
            <input type="text" name="return" onClick={() => setShowCal(!showCal)} value={displayReturn} />
            <DateComponent dateVal = { currData.return } setterFnc={setDisplayReturn} type="return" />
            </div>

            { showCal ?
                (
                <Calendar className="calendarFlight" id="dateFlight" onChange={handleDateChange} onClickDay={handleDayClick} />
                )
            : null }

             {/*<div className="child1">  
                <label>Passenger & class</label>
                <div style={{height:"98%",padding:"15px",backgroundColor:"rgb(25, 88, 182)",borderRadius:"8px"}} onClick={()=>setShow_ticket(!show_ticket)}  >{count} travellers,{ticketType}</div>
                </div>*/}
            <SelectPassenger valSetter={ setCurrdata }/>

            </div>
        </form>

            <div style={{display:"flex",textAlign:"left",margin:"0px 60px ",marginBottom:"5px"}}>
                Select A Fare Type:
            </div>

            <div className="fare" >
                <input type="radio"></input>Regular
                <input type="radio"></input>Armed Forces
                <input type="radio" ></input>Senior Citizen
                <input type="radio"></input>Student
                <input type="radio"></input>Doctors & Nurses
            </div>

            <div className="child1">
                <input type="submit" value="UPDATE SEARCH" onClick={() => {
                    setSearchOn((prev) => [prev[0] = true, !prev[1]])
                }} />
            </div>

        </div>


            
            {/* tickets display section */}

            
    { searchOn[0] ? 
           
            <div className="body">
            <div className="filters" >
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
                    <div className="departures">

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
                <div className="departures">
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


            <div>
                <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={maxSelPrice}
                    onChange={(e) => setMaxSelPrice(e.target.value)}
                />
                {/*<input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                    />*/}
                <input
                    type="range"
                    min={durationRange[0]}
                    max={durationRange[1]}
                    value={maxSelDuration}
                    onChange={(e) => setMaxSelDuration(e.target.value)}
                />
            </div>

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

            <div className="details_flight">

                        {filteredData.map((data)=>(
                            <div className="particular_flight">
                                    <div className="curr_flight">
                                        
                                        <div ><img></img>  </div>
                                        <div className="topHeading">{data.source},India</div>
                                        <div className="curr_flight_time">{data.departureTime}</div>
                                    </div>
                            
                                    <div style={{margin:"auto 0px" ,fontSize:"1.0rem"}}>{data.duration}h</div>
                                    <div>
                                        <br></br>   
                                        <div className="topHeading" style={{margin:"4px"}}>{data.destination},India</div>
                                        <div className="curr_flight_time">{data.arrivalTime}</div>
                                    </div>

                                    <div style={{margin:"auto 0px" ,fontSize:"1.2rem"}}>
                                        <div ><del>&#2352;</del> {data.ticketPrice}</div>   
                                    
                                    </div>
                                
                                    <div>
                                    <button onClick={()=>{
                                                console.log(e)
                                                handlebook(e)

                                                
                                            }}><Link to="/checkout">BOOK</Link>  </button>
                                            <br></br>
                                    </div>
                            
                            </div>
                            
                            
                        ))}

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
                        

            </div>

            </div>
            
        : <div>Loading...</div> }
            
        </div>
    )
}