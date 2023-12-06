import { useEffect, useState } from 'react';
//import "./Flights.css";
//import { ProductCarousel } from './ProductCarousel';
import { Link } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import { SelectPassenger } from './../Flights/SelectPassenger';
import { DateComponent } from '../../../Date/Date';


export function Flights()
{
    const [data,setData]=useState([])
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

        axios.get(`https://academics.newtonschool.co/api/v1/bookingportals/flight/?search={"source":"","destination":""}&day=${currData.day}`,
        {
            headers: {
              projectID: 'zvc3foel7gfi',
            }
          }
        )
        .then((response) => {
         
          setData(response.data);
          console.log("response",response.data)
          
        })
        
    },[searchOn[1]])



    const allVals = ( {adults, children, infants, ticketType} ) => {
      setCurrdata({
        ...currData,
        tickettype: ticketType,
        adults: adults,
        children: children,
        infants: infants,
        tickets: adults + children + infants
      });
    }

    //console.log(currData);



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
        //return <DateComponent dateVal={date} type="shortDay" setterFnc={setClickDay} />
      };



    const handleDayClick = (date) => {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        setClickDay(dayOfWeek)
    }


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
            <SelectPassenger passedVals={ allVals }/>

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

            

           
            <div className="body">
            <div className="filters" >
            <h3>Filters</h3>
            <hr></hr>

            <div >
                <h4>Departures</h4>

                <div className="departures">
                <div onClick={
                    ()=>{
                        setData(data.filter((e)=>e.fromTime <=11.00))
                    }
                } >Before 6 AM</div>
                <div onClick={
                    ()=>{
                        setData(data.filter((e)=>(e.fromTime >11.00 && e.fromTime<17.00)))
                    }
                }> 6 AM - 12PM</div>
                </div>
                
                <div  className="departures">
                <div>12PM - 6PM</div>
                <div>After 6PM</div>
                </div>
               
            </div>
            <hr></hr>


            <div>
            <h4>Stops</h4>
            <div className="departures">
            <div>Direct</div>
            <div>1 Stop</div>
            <div>2+ Stops</div>
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

            <div className="details_flight">
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
            
           
            
        </div>
    )
}