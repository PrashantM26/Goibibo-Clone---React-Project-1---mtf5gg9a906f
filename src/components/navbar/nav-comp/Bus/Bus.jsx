import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { DateComponent } from "../../../Date/Date";
import Calendar from "react-calendar";
import { BusFooter } from "./BusFooter";
import { BusCard } from "./BusCard";
import { GetToTopButton } from '../../../../GetToTopButton';
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

    const [selectedDepartureTime, setSelectedDepartureTime] = useState([]);
    const [selectedArrivalTime, setSelectedArrivalTime] = useState([]);
    const [selectedBusType, setSelectedBusType] = useState([]);

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

    const handleDepartureTime = (time) => {
        setSelectedDepartureTime((prev) => {
            if (prev.includes(time)) {
                return prev.filter((selectedTime) => selectedTime !== time);
            } else {
                return [...prev, time];
            }
        });
    }

    const handleArrivalTime = (time) => {
        setSelectedArrivalTime((prev) => {
            if (prev.includes(time)) {
                return prev.filter((selectedTime) => selectedTime !== time);
            } else {
                return [...prev, time];
            }
        });
    }

    const handleBusType = (type) => {
        setSelectedBusType((prev) => {
            if (prev.includes(type)) {
                return prev.filter((selectedType) => selectedType !== type);
            } else {
                return [...prev, type];
            }
        });
    }

    useEffect(() => {
        let filtData = data;

        if (selectedBusType.length>0) {
            filtData = filtData.filter(bus => {
                    const busTypeInfo = bus.type;
                    
                        return selectedBusType.some((type) => {
                            if(type==="AC"){
                                return busTypeInfo === 'AC';
                            }
                            else if(type==="Non-AC"){
                                return busTypeInfo === 'Non-AC'
                            }
                            else {
                                return true
                            }
                        })
                    //selectedBusType.includes(busTypeInfo)
                });
        }

        if (selectedDepartureTime.length>0) {
            filtData = filtData.filter(bus => {
                const departureHour = parseInt(bus.departureTime.split(":")[0]);
                return selectedDepartureTime.includes(getTimeRange(departureHour));
            });
        }
    
        // Filter by stops
        if (selectedArrivalTime.length>0) {
            filtData = filtData.filter(bus => {
                const arrivalHour = parseInt(bus.arrivalTime.split(":")[0]);
                return selectedArrivalTime.includes(getTimeRange(arrivalHour));
            });
        }

        filtData = filtData.filter((bus) => {
            if (isChecked.forAmenities.some(Boolean)) {
                const amenitiesFilter = amenities
                .filter((amenity, i) => isChecked.forAmenities[i])
                .every(amenity => bus.amenities.includes(amenity.label));

                if (!amenitiesFilter) {
                    return false;
                }
            }

            return true;
        });
    
        setFilteredData(filtData)
    }, [selectedDepartureTime, selectedArrivalTime, selectedBusType, isChecked])
        
        console.log(filteredData)

        const getTimeRange = (departArriveHour) => {
            if (departArriveHour < 6) {
              return "before6AM";
            } else if (departArriveHour < 12) {
              return "6AMto12PM";
            } else if (departArriveHour < 18) {
              return "12PMto6PM";
            } else if (departArriveHour >= 18) {
              return "after6PM";
            } else {
              return true;
            }
          };


    return (
        <div className={`${styles.mainDiv} mainBus`}>  
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
                                            <Calendar id="dateFlight" minDate={new Date()} onChange={handleDateChange} onClickDay={handleDayClick} />
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
                            <div className="div-search-bus">
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
                            <div className="filterBorderB">
                                <h3>Filters</h3>
                                <hr></hr>
                                <h4>Bus Type</h4>

                                <div className="busTypeB">

                                    <button
                                        style={{
                                            backgroundColor: selectedBusType.includes("AC") /*&& isToggled.busType*/ ? 'blue' : '#F3F6F8',        //here
                                            color: selectedBusType.includes("AC") /*&& isToggled.busType*/ ? 'white' : 'black'                     //here
                                        }}
                                        onClick={() => {
                                            handleBusType("AC")
                                            //setIsToggled((prev) => ({ ...prev, busType: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, busType: !prev.busType }))}
                                        >
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="" width="1.5rem" height="1.5rem" class="AcOnIcon-sc-c8hliw-0 lmmNpL"><path d="M2.24 14.653c.195 0 .387-.027.571-.077l4.133-1.12a.536.536 0 01.421.057l-.003-.001 3.44 2.008a.555.555 0 01.003.959l-.003.001-3.44 2.008a.537.537 0 01-.42.052l.004.001-4.133-1.12a2.165 2.165 0 00-2.16.544 2.219 2.219 0 00-.57 2.184l-.004-.016a2.209 2.209 0 001.6 1.56l2.587.699a.561.561 0 01.386.684l.001-.004-.685 2.613a2.214 2.214 0 001.515 2.703l.016.004c.187.053.379.08.571.08a2.194 2.194 0 002.106-1.627l.003-.015 1.107-4.179a.56.56 0 01.253-.335l.003-.001 3.451-2.003a.551.551 0 01.549.001l-.002-.001a.556.556 0 01.275.474v4.016c0 .152-.061.29-.16.39l-3.029 3.059a2.22 2.22 0 00-.614 1.536c0 .609.245 1.161.641 1.563.394.4.941.648 1.547.648.592 0 1.129-.237 1.52-.621l1.893-1.915a.545.545 0 01.776 0l1.893 1.915c.391.384.928.621 1.52.621.605 0 1.153-.248 1.546-.647a2.22 2.22 0 00.641-1.563c0-.596-.234-1.137-.615-1.536l.001.001-3.027-3.056a.553.553 0 01-.16-.39v-4.018c0-.197.107-.379.275-.48a.551.551 0 01.549.001l-.003-.001 3.443 2.008a.555.555 0 01.255.332l.001.004 1.107 4.179a2.195 2.195 0 002.695 1.559l-.015.004a2.218 2.218 0 001.543-2.72l.004.016-.693-2.616a.56.56 0 01.383-.679l.004-.001 2.587-.699a2.2 2.2 0 001.6-1.56 2.22 2.22 0 00-.576-2.168 2.163 2.163 0 00-2.17-.538l.015-.004-4.133 1.12a.536.536 0 01-.421-.057l.003.001-3.437-2.008a.555.555 0 01-.003-.959l.003-.001 3.44-2.008a.537.537 0 01.42-.052l-.004-.001 4.133 1.12a2.196 2.196 0 002.735-1.835l.001-.011a2.212 2.212 0 00-1.584-2.423l-.016-.004-2.587-.699a.561.561 0 01-.386-.684l-.001.004.683-2.613a2.215 2.215 0 00-1.537-2.695l-.016-.004a2.187 2.187 0 00-2.671 1.539l-.004.015-1.107 4.179a.56.56 0 01-.253.335l-.003.001-3.435 2.003a.551.551 0 01-.549-.001l.003.001a.556.556 0 01-.275-.474V7.201c0-.147.059-.288.16-.392L21.38 3.75c.38-.399.614-.94.614-1.536a2.22 2.22 0 00-.641-1.563 2.164 2.164 0 00-1.547-.648c-.592 0-1.129.237-1.52.621l-1.893 1.915a.545.545 0 01-.776 0L13.724.624a2.163 2.163 0 00-1.52-.621c-.605 0-1.153.248-1.546.647a2.22 2.22 0 00-.641 1.563c0 .596.234 1.137.615 1.536l-.001-.001 3.024 3.056a.57.57 0 01.16.392v4.016a.563.563 0 01-.275.48.551.551 0 01-.549-.001l.002.001L9.55 9.684a.555.555 0 01-.255-.332l-.001-.004-1.107-4.179a2.188 2.188 0 00-2.655-1.428l.015-.004a2.218 2.218 0 00-1.576 2.588l-.002-.014.693 2.616a.56.56 0 01-.383.679l-.004.001-2.587.699a2.216 2.216 0 00-1.604 2.436l-.001-.012a2.2 2.2 0 002.168 1.923h-.008z"></path></svg>
                                            &nbsp;&nbsp;AC
                                        </span>                                            
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedBusType.includes("Non-AC") ? 'blue' : '#F3F6F8',
                                            color: selectedBusType.includes("Non-AC") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                                handleBusType("Non-AC")
                                                //setIsToggled((prev) => ({ ...prev, busType: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, busType: !prev.busType }))}
                                        >
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="" width="1.5rem" height="1.5rem" class="AcIcon-sc-1t96y-0 fGuEds"><path d="M27.88 1.877c.33.329.533.784.533 1.287s-.204.958-.533 1.287L4.733 27.6a1.82 1.82 0 01-2.574-2.574l7.973-7.979-2.747.747a.466.466 0 00-.208.123l-.075.099-1.835 3.197a1.87 1.87 0 01-2.558.689l.009.005a1.89 1.89 0 01-.662-2.574l-.005.009 1.141-2a.476.476 0 00-.166-.645l-.002-.001-1.976-1.147a1.877 1.877 0 01-.973-1.64v-.013c0-.7.379-1.312.943-1.641l.009-.005c.264-.154.581-.245.92-.245.36 0 .697.103.981.281l-.008-.005 3.16 1.832c.107.061.235.08.355.045l3.277-.893a.474.474 0 00.213-.79l-2.392-2.413a.465.465 0 00-.329-.136h-.001l-3.653.008a1.87 1.87 0 01-1.839-2.132l-.001.01a1.888 1.888 0 011.858-1.64h.001l2.285-.005a.474.474 0 00.469-.475l.005-2.307a1.887 1.887 0 011.866-1.771h.001c.992 0 1.803.777 1.858 1.755v.005l-.011 3.685a.47.47 0 00.136.333l2.392 2.413a.463.463 0 00.454.12l-.003.001a.475.475 0 00.33-.33l.001-.003.888-3.307a.473.473 0 00-.046-.36l.001.002-1.819-3.189A1.897 1.897 0 0113.072.2l.009-.005A1.849 1.849 0 0115.61.84l.005.008 1.136 1.995a.464.464 0 00.642.169l-.002.001 1.981-1.157a1.85 1.85 0 012.515.69l.005.009a1.895 1.895 0 01-.664 2.557L18.06 6.963a.471.471 0 00-.215.285l-.001.003-.768 2.853 8.232-8.232c.329-.329.783-.532 1.285-.532s.956.203 1.285.532zm.827 7.438a1.89 1.89 0 01.659 2.574l.005-.009-1.141 2.003a.476.476 0 00.166.645l.002.001 1.976 1.147c.583.324.971.935.973 1.637v.013c0 .7-.379 1.312-.943 1.641l-.009.005a1.844 1.844 0 01-1.901-.034l.008.005-3.16-1.835a.462.462 0 00-.358-.045l.003-.001-3.277.893a.474.474 0 00-.21.792l2.392 2.411c.084.085.2.138.328.139l3.653-.011c.163 0 .325.021.485.064l.253.088a1.879 1.879 0 011.097 1.98l.001-.01a1.888 1.888 0 01-1.852 1.643h-.001l-2.285.005a.474.474 0 00-.469.475l-.005 2.304a1.885 1.885 0 01-1.866 1.773h-.004a1.862 1.862 0 01-1.858-1.755v-.005l.011-3.685v-.005a.473.473 0 00-.133-.329l-2.395-2.413a.46.46 0 00-.454-.122l.003-.001a.475.475 0 00-.33.33l-.001.003-.885 3.307a.467.467 0 00.047.363l-.001-.002 1.816 3.187a1.897 1.897 0 01-.696 2.542l-.009.005a1.849 1.849 0 01-2.529-.645l-.005-.008-1.136-1.995a.464.464 0 00-.642-.169l.002-.001-1.981 1.157a1.848 1.848 0 01-2.512-.69l-.005-.009a1.897 1.897 0 01.653-2.555l.008-.005 3.168-1.851a.478.478 0 00.218-.282l.001-.003.885-3.307c.043-.165 6.125-6.304 6.285-6.347l3.283-.891a.475.475 0 00.284-.216l.001-.002 1.835-3.197a1.868 1.868 0 012.561-.691l-.009-.005z"></path></svg>
                                            &nbsp;&nbsp;Non-AC
                                        </span>                        
                                    </button>

                                </div>

                                <hr></hr>
                                <h4>Departure Time</h4>

                                <div className="departuresB">
                                    <div>
                                    <button
                                        style={{
                                            backgroundColor: selectedDepartureTime.includes("before6AM") ? 'blue' : '#F3F6F8',
                                            color: selectedDepartureTime.includes("before6AM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            handleDepartureTime("before6AM")
                                            //setIsToggled((prev) => ({ ...prev, depart: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                        >
                                        Before 6AM
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedDepartureTime.includes("6AMto12PM") ? 'blue' : '#F3F6F8',
                                            color: selectedDepartureTime.includes("6AMto12PM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                                handleDepartureTime("6AMto12PM")
                                                //setIsToggled((prev) => ({ ...prev, depart: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                        >
                                        6AM - 12PM
                                    </button>
                                    </div>
                                    <div>
                                    <button
                                        style={{
                                            backgroundColor: selectedDepartureTime.includes("12PMto6PM") /*&& isToggled.depart*/ ? 'blue' : '#F3F6F8',           //here
                                            color: selectedDepartureTime.includes("12PMto6PM") /*&& isToggled.depart*/ ? 'white' : 'black'                    //here
                                        }}
                                        onClick={() => {
                                            handleDepartureTime("12PMto6PM")
                                            //setIsToggled((prev) => ({ ...prev, depart: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                        >
                                        12PM - 6PM
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedDepartureTime.includes("after6PM") ? 'blue' : '#F3F6F8',
                                            color: selectedDepartureTime.includes("after6PM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            handleDepartureTime("after6PM")
                                            //setIsToggled((prev) => ({ ...prev, depart: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, depart: !prev.depart }))}
                                        >
                                        After 6PM
                                    </button>
                                    </div>
                                </div>
                                <hr></hr>
                                <h4>Arrival Time</h4>

                                <div className="arrivalB">
                                    <div>
                                    <button
                                        style={{
                                            backgroundColor: selectedArrivalTime.includes("before6AM") /*&& isToggled.arrive*/ ? 'blue' : '#F3F6F8',           //here
                                            color: selectedArrivalTime.includes("before6AM") /*&& isToggled.arrive*/ ? 'white' : 'black'                       //here
                                        }}
                                        onClick={() => {
                                            handleArrivalTime("before6AM")
                                            //setIsToggled((prev) => ({ ...prev, arrive: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                        >
                                        Before 6AM
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedArrivalTime.includes("6AMto12PM") ? 'blue' : '#F3F6F8',
                                            color: selectedArrivalTime.includes("6AMto12PM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                                handleArrivalTime("6AMto12PM")
                                                //setIsToggled((prev) => ({ ...prev, arrive: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                        >
                                        6AM - 12PM
                                    </button>
                                    </div>
                                    <div>
                                    <button
                                        style={{
                                            backgroundColor: selectedArrivalTime.includes("12PMto6PM") ? 'blue' : '#F3F6F8',
                                            color: selectedArrivalTime.includes("12PMto6PM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            handleArrivalTime("12PMto6PM")
                                            //setIsToggled((prev) => ({ ...prev, arrive: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrival: !prev.arrive }))}
                                        >
                                        12PM - 6PM
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: selectedArrivalTime.includes("after6PM") ? 'blue' : '#F3F6F8',
                                            color: selectedArrivalTime.includes("after6PM") ? 'white' : 'black'
                                        }}
                                        onClick={() => {
                                            handleArrivalTime("after6PM")
                                            //setIsToggled((prev) => ({ ...prev, arrive: true }));
                                        }}
                                        //onDoubleClick={() => setIsToggled((prev) => ({ ...prev, arrive: !prev.arrive }))}
                                        >
                                        After 6PM
                                    </button>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className='filterSectionAmenitiesB'>
                                    <h4>Amenities</h4>
                                    <div className="amenitiesHolderB">
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
                        </div>

                        <div className="bus-cards-holder">

                            {filteredData.map((bus, index)=>(
                                
                                <BusCard
                                    key={index}
                                    bus={bus}
                                    index={index}
                                    setCurrdata={setCurrdata}
                                    currData={currData}
                                />
                                
                            ))}

                            <GetToTopButton />
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
                </>
            }
        </div>
    )
}













