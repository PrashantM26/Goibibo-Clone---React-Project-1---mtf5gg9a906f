import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { Calendar } from './../../../../components/Calendar/Calendar';
import Calendar from 'react-calendar';
import { SelectGuestRoom } from './../Hotels/SelectGuestRoom';
import { DateComponent } from '../../../Date/Date';
import { GetToTopButton } from '../../../../GetToTopButton';
import { Carousel } from 'react-responsive-carousel';
import "./Hotels.css";
import Loader from '../../../../Loader';

export function Hotels() {
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [hotels, setHotels] = useState([]);
  const [sortedHotels, setSortedHotels] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortBy, setSortBy] = useState('priceLowToHigh');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCal1, setShowCal1] = useState(false);
  const [showCal2, setShowCal2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkLoad, setCheckLoad] = useState(false);
  const [clickDay, setClickDay] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [isToggled, setIsToggled] = useState([false, false]);    // 0 for couples, 1 for stay
  const [currentColor, setCurrentColor] = useState(['', '']);
  const [guestRoomInfo, setGuestRoomInfo] = useState({ adults : 1, children : 0, rooms : 1 })
  const [searchOn, setSearchOn] = useState([false, false]);  /// 0 for displaying filter list, happens first time, 1 for updating useEffect an fetching an API again
  const priceRanges = [
    { label: 'Upto ₹2000', valueMin: '0', valueMax: '2000' },
    { label: '₹2001 - ₹4000', valueMin: '2001', valueMax: '4000' },
    { label: '₹4001 - ₹6000', valueMin: '4001', valueMax: '6000' },
    { label: '₹6000 +', valueMin: '6001', valueMax: '99999' },
  ];
  const ratingRanges = [
    { label: '4.5+', value: '4.5' },
    { label: '4+', value: '4+' },
    { label: '3.5+', value: '3.5' },
    { label: '3+', value: '3' },
  ];

  const amenities = [
    {label: 'Air Conditioning'},
    {label: 'Airport Transfers'},
    {label: 'Balcony/Terrace'},
    {label: 'Bar'},
    {label: 'Barbeque'},
    {label: 'Beach'},
    {label: 'Bonfire'},
    {label: 'Bus Station Transfers'},
    {label: 'Business Centre'},
    {label: 'Cafe'},
    {label: 'Caretaker'},
    {label: 'Elevator/Lift'},
    {label: 'Facilities for Guests with Disabilities'},
    {label: 'Fireplace'},
    {label: 'Gym'},
    {label: 'Indoor Games'},
    {label: 'Kids Play Area'},
    {label: 'Kitchenette'},
    {label: 'Living Room'},
    {label: 'Outdoor Sports'},
    {label: 'Parking'},
    {label: 'Railway Station Transfers'},
    {label: 'Restaurant'},
    {label: 'Room Service'},
    {label: 'Spa'},
    {label: 'Swimming Pool'},
    {label: 'TV'},
    {label: 'Vehicle Rentals'},
    {label: 'Free WiFi'},
    {label: 'Yoga'}
  ]
  const [isChecked, setChecked] = useState(
    {forPrice: Array(priceRanges.length).fill(false), 
    forRating: Array(ratingRanges.length).fill(false),
    forAmenities: Array(amenities.length).fill(false)
  });
  //const [priceRange, setPriceRange] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([]);


  const allVals = ( { adults, children, rooms } ) => {
    setGuestRoomInfo({
        ...guestRoomInfo,
        adults : adults,
        children : children,
        rooms : rooms
    })}

    //console.log("GUEST ROOM INFO    ", guestRoomInfo)
  
  const handleTravelPrefBtn = (activate, num) => {
    setIsToggled((prevToggled) => {
      const newToggled = [...prevToggled];
      newToggled[num] = !newToggled[num];
      return newToggled;
    });
  
    setCurrentColor((prevColor) => {
      const newColor = [...prevColor];
      newColor[num] = prevColor[num] === '' ? 'blue' : '';
      return newColor;
    });
  }



  useEffect(() => {
    setIsLoading(true)
    async function fetchHotels() {
      try {
        const response = await axios.get(
          `https://academics.newtonschool.co/api/v1/bookingportals/hotel`,
          {
            headers: {
              projectID: 'zvc3foel7gfi',
            },
            params: {
              search: `{"location":"${location}","day":"${clickDay}"}`,
            },
          }
        );

        let filData = response.data.data.hotels;
        //if (response.data.message === 'success') {
          setHotels(response.data.data.hotels);
        /*} else {
          alert('Failed to fetch hotel datea');
        }*/
        if(filData.length==0){
          alert("No data fetched");
        }
        if(isToggled[0]){
          filData = filData.filter((hotel) => {
            const check = hotel.houseRules.guestProfile.unmarriedCouplesAllowed
            //console.log("CHECK !!!!!",check)
            //console.log("TOGGLE BUTTON ",isToggled)
            return (check == true)
          })
        }

        filData.forEach((hotel) => {
          const rooms = hotel.rooms;
          const totalBaseCost = rooms.reduce((sum, room) => sum + room.costDetails.baseCost, 0);
          const totalTaxes = rooms.reduce((sum, room) => sum + room.costDetails.taxesAndFees, 0);
  
          const averageBaseCost = Math.ceil(totalBaseCost / rooms.length);
          const averageTaxes = Math.ceil(totalTaxes / rooms.length);
  
          hotel.averageBaseCost = averageBaseCost;
          hotel.averageTaxes = averageTaxes;
        });
        setIsLoading(false);
        setFilteredData(filData)
        //console.log(filData);

      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching datea.');
      }

    
    }

    fetchHotels();
  }, [searchOn[1]]);

  //console.log(filteredData)


  useEffect(() => {    
                                                      //Ask question
    if(checkLoad){
      const timeoutId = setTimeout(() => {
        setCheckLoad(false)
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [checkLoad])

  //console.log("YAYYYYY", checkLoad)



  useEffect(() => {
    // Sorting the hotels based on selected sorting option
    if (sortBy === 'priceLowToHigh') {
      const sorted = [...hotels].sort((a, b) => a.rooms[0].price - b.rooms[0].price);
      setSortedHotels(sorted);
    } else if (sortBy === 'priceHighToLow') {
      const sorted = [...hotels].sort((a, b) => b.rooms[0].price - a.rooms[0].price);
      setSortedHotels(sorted);
    }
  }, [sortBy, hotels]);




  const filterHotelsByRating = () => {
    if (ratingFilter === 0) {
      return hotels;
    }
    return hotels.filter((hotel) => hotel.rating >= ratingFilter);
  };


//let filData = hotels;

//console.log(filData)

  /*const handlePriceChange = (index, valueMin, valueMax) => {
    const nChecked = {...isChecked};
    nChecked.forPrice[index] = !nChecked.forPrice[index];
    setChecked((prev) => ({
      ...prev,
      forPrice: [...nChecked.forPrice]//.slice()//map((checked, i) => (i === index ? !checked : checked)),
    }))
    //setChecked(!isChecked);
    if(nChecked.forPrice[index]){
      //filData = filData.filter((hotel) => {
        //const hotelPrice = hotel.map((room) => {
          //room.costPerNight
        //});
        //console.log(hotelPrice)
        //const rooms = hotel.rooms.costPerNight;
        /*const costNight = rooms.map((room) => {
          room.costPerNight;
        })*
        const arr = filData.map((obj) => {
          return obj.rooms
          /*obj.rooms.map((roomData) => {
            return roomData.costPerNight;
          });*
        });
        let data = [];
        console.log(arr);
        arr.forEach((roomData) => {
          data = roomData.filter((price) => {
            return price.costPerNight >= parseInt(valueMin) && price.costPerNight <= parseInt(valueMax);
          });
        })
        /*const cost = arr.map((roomData) => {
          return roomData.costPerNight;
        })*
        console.log(data);
        //console.log(hotel)
        //return hotelPrice >= parseInt(valueMin) && hotelPrice <= parseInt(valueMax);
      //})
    }
  };*/

  //console.log("HUHUHUSHUASHUSUSHUGY     ",filData)
  
  /*const handleRatingChange = (index, value) => {
    let filData = filteredData;
    const nChecked = {...isChecked};
    nChecked.forRating[index] = !nChecked.forRating[index];
    //nChecked.forRating = nChecked.forRating.map((_, i) => (i === index ? nChecked.forRating[index] : false));      //Also works
    setChecked((prev) => ({
      ...prev,
      forRating: [...nChecked.forRating].map((_, i) => (i === index ? nChecked.forRating[index] : false))//.map((_, i) => i === index)//.slice()//map((checked, i) => (i === index ? !checked : checked)),
    }))
    if(nChecked.forRating[index]){
      let filRatingData = filData.filter((hotel) => {
        const rating = hotel.rating
        return rating >= value
      })
      //console.log(filRatingData)
      setFilteredData(filRatingData)
    }
    else{
      setFilteredData(filData)
      console.log("TRIGGERED")
    }
  }

  //console.log(filData)
  const handleAmenitiesChange = (index, label) => {
    let filData = filteredData;
    //console.log("FILDATA AMENITIES       ",filData)
    const nChecked = {...isChecked};
    nChecked.forAmenities[index] = !nChecked.forAmenities[index];
    setChecked((prev) => ({
      ...prev,
      forAmenities: [...nChecked.forAmenities]
    }))
    if(nChecked.forAmenities[index]){
      let filAmenitiesData = filData.filter((hotel) => {
        const amenities = hotel.amenities || []
        let found = false;

      for (let i = 0; i < amenities.length; i++) {
        if (amenities[i] == label) {
          found = true;
          break;
        }
      }
      return found;
      /*amenities.map((obj) => {
        return amenities.includes(label);
      })*                                             //UNCOMMENT THIS
      //return amenities.includes(label);
      //return amenities.some((amenity) => amenity === label);
        //return amenity === label
      })
      //console.log("FILTERED AMENITIES    ",filAmenitiesData)
      setFilteredData(filAmenitiesData)
      //console.log(filData)
    }
    else{
      setFilteredData(filData)
      console.log("HIIT")
    }
  }
console.log("FILTERED DATA   ",filteredData)*/       //AND THIS FOR RETRIEVING BOTH FUNCTIONS
//console.log(isChecked)

  /*const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };*/




  /*const applyCheckAndFilters = (index, typeObj, type) => {
    console.log("HIIIITTTTTTTTTTTTTTTTTTTT")
    let filData = [...hotels];
    if(type === 'rating'){
      console.log("INSIDE")
      const nChecked = {...isChecked};
      nChecked.forRating[index] = !nChecked.forRating[index];
      //nChecked.forRating = nChecked.forRating.map((_, i) => (i === index ? nChecked.forRating[index] : false));      //Also works
      setChecked((prev) => ({
        ...prev,
        forRating: [...nChecked.forRating].map((_, i) => (i === index ? nChecked.forRating[index] : false))//.map((_, i) => i === index)//.slice()//map((checked, i) => (i === index ? !checked : checked)),
      }))
      /*if(nChecked.forRating[index]){                      //1st
        console.log("INSIde")
        filData = filData.filter((hotel) => {
          const rating = hotel.rating
          return rating >= typeObj.value
        })
        //console.log(filRatingData)
      }*/
      /*const checkedRatings = ratingRanges                                 //2nd
        .filter((rating, i) => nChecked.forRating[i])
        .map((checkedRating) => parseFloat(checkedRating.value));

      if (checkedRatings.length > 0) {                       
        filData = filData.filter((hotel) => {
          const rating = parseFloat(hotel.rating);

          let ifTrue = false;
          for (let i = 0; i < checkedRatings.length; i++) {
            if (rating >= checkedRatings[i]) {
              ifTrue = true;
              break;
            }
          }

          return ifTrue;
        });
      }*
    }

    if(type === 'amenity'){
      const nChecked = {...isChecked};
      nChecked.forAmenities[index] = !nChecked.forAmenities[index];
      setChecked((prev) => ({
        ...prev,
        forAmenities: [...nChecked.forAmenities]
      }))
      /*if(nChecked.forAmenities[index]){                             //1st way
        filData = filData.filter((hotel) => {
          const amenities = hotel.amenities || []
          let found = false;

        for (let i = 0; i < amenities.length; i++) {
          if (amenities[i] == typeObj.label) {
            found = true;
            break;
          }
        }
        return found;
        })
      }*/
      /*const checkedAmenities = amenities                               //2nd way
      .filter((amenity, i) => nChecked.forAmenities[i])
      .map((checkedAmenity) => checkedAmenity.label);

      if (checkedAmenities.length > 0) {
        filData = filData.filter((hotel) => {
          const hotelAmenities = hotel.amenities || [];
          
          for (let i = 0; i < checkedAmenities.length; i++) {
            if (!hotelAmenities.includes(checkedAmenities[i])) {
              return false;
            }
          }
          
          return true;
        });
      }*
    }

    const checkedRatings = ratingRanges
    .filter((rating, i) => isChecked.forRating[i])
    .map((checkedRating) => parseFloat(checkedRating.value));

    const checkedAmenities = amenities
      .filter((amenity, i) => isChecked.forAmenities[i])
      .map((checkedAmenity) => checkedAmenity.label);

    // Combining filters for 'rating' and 'amenity'
    filData = filData.filter((hotel) => {
      const rating = parseFloat(hotel.rating);
      const hotelAmenities = hotel.amenities || [];

      const ratingCondition = checkedRatings.length === 0 || checkedRatings.some((checkedRating) => rating >= checkedRating);
      const amenityCondition = checkedAmenities.length === 0 || checkedAmenities.every((checkedAmenity) => hotelAmenities.includes(checkedAmenity));

      return ratingCondition && amenityCondition;
    });

    setFilteredData(filData);
  }*/
    //console.log(isChecked)



    const handlePriceChange = (index) => {
      const newChecked = { ...isChecked };
      newChecked.forPrice[index] = !newChecked.forPrice[index];
      setChecked(newChecked);
    };
  
    const handleRatingChange = (index) => {
      const newChecked = { ...isChecked };
      newChecked.forRating = newChecked.forRating.map((value, i) => i === index ? !value : false);
      setChecked(newChecked);
    };
  
    const handleAmenityChange = (index) => {
      const newChecked = { ...isChecked };
      newChecked.forAmenities[index] = !newChecked.forAmenities[index];
      setChecked(newChecked);
    };
  
    // Apply filters to data
    const filteredHotels = filteredData
      .filter(item => {
        // Apply price filter
          if (isChecked.forPrice.some(Boolean)) {
            const priceFilter = priceRanges
              .filter((range, i) => isChecked.forPrice[i])
              .some(range => item.averageBaseCost >= range.valueMin && item.averageBaseCost <= range.valueMax);

            if (!priceFilter) {
              return false;
            }
          }
    
          // Apply rating filter
          if (isChecked.forRating.some(Boolean)) {
            const ratingFilter = ratingRanges
              .filter((rating, i) => isChecked.forRating[i])
              .some(rating => item.rating >= parseFloat(rating.value));
    
            if (!ratingFilter) {
              return false;
            }
          }
    
          // Apply amenities filter
          if (isChecked.forAmenities.some(Boolean)) {
            const amenitiesFilter = amenities
              .filter((amenity, i) => isChecked.forAmenities[i])
              .every(amenity => item.amenities.includes(amenity.label));
    
            if (!amenitiesFilter) {
              return false;
            }
          }
  
        return true;
      });
    //console.log(filteredHotels)




  const handleDateChange = (date, type) => {
    //console.log("DATE  trytrtyrtyr                        ",date)
    /*setDateRange(date);                                                                    //hen selectRange={true}
    if(date.length>1){
      DateComponent({ dateVal : date[0], type : "shortDay", setterFnc : setClickDay });
      setStartDate(date[0]);
      setEndDate(date[1]);
    }
    else if(date.length === 1 && date[1] === null ){
      setStartDate(date[0])
    }
    else if(date.length === 1 && date[0] === null ){
      setStartDate(date[1])
    }*/



    if(type === "start"){
      DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay });
      setStartDate(date)
    }
    else if(type === "end"){
      setEndDate(date)
    }

    /*if(clickCount === 0 && date.getTime() < endDate.getTime()) {
        setStartDate(date);
        setClickCount(1);
    }
    else {
      if(startDate.getTime() < date.getTime()){
        setEndDate(date);
        setClickCount(0);
      }
      else{
        setStartDate(date);
        setClickCount(1);
      }
    }*/
    
  };


  /*const handleDayClick = (date) => {

    DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay })
  
  };*/


  let nights;
  const handleCalculateNights = () => {
    const newStartDate = startDate;
    const newEndDate = endDate;
    const daysInMilliSeconds = 24 * 60 * 60 * 1000;
  
    newStartDate.setHours(12, 0, 0, 0);
    newEndDate.setHours(12, 0, 0, 0);
  
    const timeDiff = newEndDate - newStartDate;
  
    if (timeDiff >= 0) {
      nights = Math.ceil(timeDiff / daysInMilliSeconds);
    } else {
      nights = 0;
    }
  
    return nights;
  };

  /*let nights;                                      //Causes a glitch
  const handleCalculateNights = () => {
    const newstartDate = startDate.getDate();
    const newendDate = endDate.getDate();
    nights = newendDate - newstartDate;
    return nights;
  }*/


/*let nights;
const handleCalculateNights = () => {
  const newStartDate = startDate.getDate();
  const newEndDate = endDate.getDate();
  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

  if (newEndDate >= newStartDate) {
    nights = newEndDate - newStartDate + 1;
  } else {
    nights = daysInMonth - newStartDate + newEndDate + 1;
  }

  return nights;
};*/




  if( startDate.getTime() >= endDate.getTime() || endDate > new Date(startDate.getTime() + 19 * 24 * 60 * 60 * 1000)){
  /*const eD = new date(startDate).setdate(startDate.getdate() + 1)
    setEndDate(eD);*/
    const newendDate = new Date(startDate.getTime());
    newendDate.setDate(startDate.getDate() + 1);
    setEndDate(newendDate);
    console.log("ENDDATE   ", endDate)
    //setClickCount(0);
}







  //const filteredHotels = filterHotelsByRating();





  return (
    <div className='hotels'>
      <div className="background-hotel1" ></div>
      <div className="background-hotel2"></div>
      <div className='hotelsMainSection'>
        <div className='upperInputAdSectionH'>
          <div className="hotelInputs">
              <h2>Book Hotels & Homestays</h2>
              <div className='borderHotelInputs'>

                  <div className='tripRadioH'>
                      {/*<label htmlFor="India">
                        <input
                          type="radio" id="India" value="India" name='scope'/>
                          {/*checked={selectedOption === 'option1'} //onChange={handleOptionChange}*}
                        
                        India
                      </label>
                      <label htmlFor="International">
                        <input type="radio" id="International" value="International" name='scope' />
                        International
                      </label>*/}
                      <input type="radio" value="India" name='trip' />India
                      <input type="radio" value="International" name='trip' />International
                  </div>

                  <div className='whereH'>
                      
                      <label htmlFor="location">Where</label>
                      <input type="text" id="location" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
                      
                  </div>

                  <div className='checkDateH'>
                      <div className='child2'>
                      <label htmlFor="date" onClick={() => setShowCal1((prev) => !prev)}>Check-in</label>
                        <div className="displayStartDate" onClick={() => setShowCal1((prev) => !prev)}>
                          <DateComponent dateVal = { startDate } />
                        </div>
                        { showCal1 ?
                          (
                            <div className='calendarH'>
                              <Calendar id="dateHotel" value={startDate} minDate={new Date()} onChange={(date) => handleDateChange(date, "start")} />
                              <button className="calendarButtonH" onClick={() => setShowCal1(!showCal1)}>Done</button>
                            </div>
                          )
                        : null }
                      </div>

                      <div className='nightsH'>{handleCalculateNights()} Nights</div>

                      <div className='child2'>
                      <label htmlFor="date" onClick={() => setShowCal2((prev) => !prev)}>Check-out</label>
                        <div className="displayEndDate" onClick={() => setShowCal2((prev) => !prev)}>
                          <DateComponent dateVal = { endDate } />
                        </div>
                        { showCal2 ?
                          (
                            <div className='calendarH'>
                              <Calendar id="dateHotel" value={endDate} minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}  maxDate={new Date(startDate.getTime() + 19 * 24 * 60 * 60 * 1000)} onChange={(date) => handleDateChange(date, "end")} />
                              <button className="calendarButtonH" onClick={() => setShowCal2(!showCal2)}>Done</button>
                            </div>
                          )
                        : null }
                      </div>
                  </div>


                    {/* showCal ?
                          (
                            <div className='calendarH'>
                              <Calendar id="dateFlight" value={dateRange} minDate={new Date()} returnValue="range" onChange={handleDateChange} />
                              <button className="calendarButtonH" onClick={() => setShowCal(!showCal)}>Done</button>
                            </div>
                          )
                    : null */}


                  <div className='guestRoomPrefH'>
                      <SelectGuestRoom passedVals={ allVals }/>
                      
                      <div className='travellerPrefH'>
                        <div className='child2'>
                        <label htmlFor="travelPref">Traveller Preference</label>
                          <div className='travellerPrefBtnH'>
                            <button
                              style={{ backgroundColor: isToggled[0] ? currentColor[0] : 'initial', color: isToggled[0] ? 'white' : 'black' }}
                              onClick={() => { handleTravelPrefBtn(true, 0) }} id="travelPrefBtn"
                              >
                              Couple
                            </button>
                            <button
                              style={{ backgroundColor: isToggled[1] ? currentColor[1] : 'initial', color: isToggled[1] ? 'white' : 'black' }}
                              onClick={() => { handleTravelPrefBtn(false, 1) }} id="travelPrefBtn"
                              >
                              goStays
                            </button>
                          </div>
                        </div>
                      </div>
                  </div>

            </div>

              <div className="searchH">
                <button onClick={() => {
                    setSearchOn((prev) => [prev[0] = true, !prev[1]])
                }}>Search</button>
              </div>

        </div>


        <div className="rightSectionH">

          <div className="rightSection1H">
            <img src="https://gos3.ibcdn.com/meta-1-1694597822.jpg" alt="" />
          </div>
            
          <div className="rightSection2H">
              <div className="r1H">
                  <img src="https://gos3.ibcdn.com/offers-640X268-1702450350.jpg" alt="" />
              </div>
              
              <div className="r2H">
                <img src="https://gos3.ibcdn.com/img-1626751565.jpg" alt="" />
              </div>
          </div>

        </div>
        

      </div>




          {/*Filter section*/}


          {/*<div className='topFilter'>
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </select>
            <label>Minimum Rating:</label>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(parseInt(e.target.value))}>
              <option value={0}>All Ratings</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5</option>
            </select>
            </div>*/}
      {searchOn[0]? (
          <div className='mainDisplayFilterResult'>

                <div className="filteredHotels">
                  <div className='filteredHotelsBorder'>
                      <div className='filterSectionPriceH'>
                            <h3>Price Range</h3>
                            <div className='priceContainerH'>
                              {priceRanges.map((range, index) => (
                                  <div key={range.label}>
                                    <input
                                      type="checkbox"
                                      id={range.label}
                                      /*checked={selectedRanges.some(
                                        (selectedRange) =>
                                          selectedRange.valueMin === range.valueMin &&
                                          selectedRange.valueMax === range.valueMax
                                      )}*/
                                      checked={isChecked.forPrice[index]}
                                      //onChange={() => (setCheckLoad(true),handlePriceChange(index, range.valueMin, range.valueMax))}
                                      onChange={() => (setCheckLoad(true),handlePriceChange(index))}
                                    />
                                    <label htmlFor={range.label}>{range.label}</label>
                                  </div>
                              ))}
                            </div>
                      </div>
                      <hr></hr>
                      <div className='filterSectionRatingH'>
                          <h3>Ratings</h3>
                          <div className='ratingContainerH'>
                            {ratingRanges.map((rating, index) => (
                                <div key={rating.label}>
                                  <input
                                    type="checkbox"
                                    id={rating.label}
                                    /*checked={selectedRanges.some(
                                      (selectedRange) =>
                                        selectedRange.valueMin === range.valueMin &&
                                        selectedRange.valueMax === range.valueMax
                                    )}*/
                                    checked={isChecked.forRating[index]}
                                    //onChange={() => handleRatingChange(index, rating.value)}
                                    //onChange={() => (setCheckLoad(true), applyCheckAndFilters(index, rating, 'rating'))}
                                    onChange={() => (setCheckLoad(true),handleRatingChange(index))}
                                  />
                                  <label htmlFor={rating.label} className= {`rating-label-${index}`}>{rating.label}</label>
                                </div>
                            ))}
                        </div>
                      </div>
                      <hr></hr>
                      <div className='filterSectionAmenitiesH'>
                              <h3>Amenities</h3>
                              <div className='amenitiesContainerH'>
                                {amenities.map((amenity, index) => (
                                    <div key={amenity.label}>
                                      <input
                                        type="checkbox"
                                        id={amenity.label}
                                        checked={isChecked.forAmenities[index]}
                                        //onChange={() => handleAmenitiesChange(index, amenity.label)}
                                        //onChange={() => (setCheckLoad(true), applyCheckAndFilters(index, amenity, 'amenity'))}
                                        onChange={() => (setCheckLoad(true),handleAmenityChange(index))}
                                      />
                                      <label htmlFor={amenity.label}>{amenity.label}</label>
                                    </div>
                                ))}
                              </div>
                      </div>

                  </div>

                  

              </div>






            {/*Filter Render*/}
            {!checkLoad ? 
            <div className='displayFilteredCards'>
              {filteredHotels.map((hotel) => (
                <div className="singleFilteredCardsH" key={hotel._id} onClick={() => 
                  {navigate(`/hotels/${hotel._id}`, { state: {guestRoomInfo, startDate, endDate, isToggled, nights }}
                  )}}>
                    <div className='filterImageLeftH'>
                      <img src={hotel.images[0]} className='imageLeftH' alt="Filtered Hotel Image" />
                    </div>
                    <div className='filterRightH'>
                      <div className='fR1H'>
                        <div>
                          <p>Hotel</p>
                          <h4>{hotel.name}</h4>
                          <span><img src="https://gos3.ibcdn.com/map-1626422501.png" /> <span>{hotel.location}</span></span>
                        </div>
                        <p>{hotel.rating}/5</p>
                      </div>
                      <div className='fR2H'>
                        <div className='fRDH'>
                          <p>₹{hotel.averageBaseCost} per night</p>
                          <p>+ ₹{hotel.averageTaxes} TAXES</p>
                        </div>
                      </div>
                      <div className='fR3H'>
                        <p>{hotel.amenities.join(', ')}</p>
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#008a93" width="1.7rem" height="1.7rem" class="ReserveNowPayLater__ReserverNowPayLaterIcon-sc-1n1mspl-0 gRtIHg"><path fill-rule="evenodd" d="M16.97 11.867a5.01 5.01 0 013.557 1.484A5.086 5.086 0 0122 16.933C22 19.732 19.748 22 16.97 22c-2.777 0-5.029-2.268-5.029-5.067 0-2.798 2.252-5.066 5.03-5.066zm2.494 2.973a.578.578 0 00-.813.117l-2.114 2.84a.192.192 0 01-.291.021l-1.006-1.013a.578.578 0 00-.972.262.588.588 0 00.15.565L15.58 18.8c.217.22.511.343.818.344h.085c.338-.023.649-.194.85-.468l2.245-3.02a.582.582 0 00-.113-.817zM17.05 9.2c.102 0 .184.082.184.183v1.28a.186.186 0 01-.19.183h-.177a6.256 6.256 0 00-6.04 4.618.183.183 0 01-.178.136H5.838A1.833 1.833 0 014 13.771V9.383c0-.101.082-.183.184-.183zm-8.27 3.291H6.574a.55.55 0 00-.552.549.55.55 0 00.552.549h2.205a.55.55 0 00.552-.549.55.55 0 00-.552-.549zM15.397 6c1.015 0 1.838.868 1.838 1.94a.19.19 0 01-.184.193H4.184a.18.18 0 01-.13-.056A.2.2 0 014 7.939C4 6.87 4.823 6 5.838 6z"></path></svg>
                          &nbsp;Book @ ₹0
                        </p>
                      </div>
                        
                    </div>
                </div>
              ))}
            </div>
            : <Loader />}

          </div>

        ): null}

      </div>
      
    </div>
  );


}









{/*<datePicker
        id="dateL"
        selected={startDateD}
        onChange={(date) => setStartDateD(date)}
        //dateFormat="dd/MM/yyyy" // Customize the date format
/>*/}