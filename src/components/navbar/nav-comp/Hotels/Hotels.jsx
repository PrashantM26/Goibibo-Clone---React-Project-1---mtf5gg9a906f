import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Calendar } from './../../../../components/Calendar/Calendar';
import Calendar from 'react-calendar';
import { SelectGuestRoom } from './../Hotels/SelectGuestRoom';
import { DateComponent } from '../../../Date/Date';
import "./Hotels.css";

export function Hotels() {


  const [location, setLocation] = useState('');
  const [hotels, setHotels] = useState([]);
  const [sortedHotels, setSortedHotels] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortBy, setSortBy] = useState('priceLowToHigh');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCal, setShowCal] = useState(false);
  const [clickDay, setClickDay] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [isToggled, setIsToggled] = useState([false, false]);    // 0 for couples, 1 for stay
  const [currentColor, setCurrentColor] = useState(['', '']);
  const [guestRoomInfo, setGuestRoomInfo] = useState('')
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


  const allVals = ( selectedValues ) => {
    setGuestRoomInfo(() => {
      selectedValues
    })}
  
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

        if(isToggled[0]){
          filData = filData.filter((hotel) => {
            const check = hotel.houseRules.guestProfile.unmarriedCouplesAllowed
            console.log("CHECK !!!!!",check)
            console.log("TOGGLE BUTTON ",isToggled)
            return (check == true)
          })
        }
        setFilteredData(filData)
        //console.log(filData);

      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching datea.');
      }


    
    }

    fetchHotels();
  }, [searchOn[1]]);

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

  const handlePriceChange = (index, valueMin, valueMax) => {
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
        })*/
        const arr = filData.map((obj) => {
          return obj.rooms
          /*obj.rooms.map((roomData) => {
            return roomData.costPerNight;
          });*/
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
        })*/
        console.log(data);
        //console.log(hotel)
        //return hotelPrice >= parseInt(valueMin) && hotelPrice <= parseInt(valueMax);
      //})
    }
  };

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




  const applyCheckAndFilters = (index, typeObj, type) => {
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
      }*/
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
      }*/
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
  }
    //console.log(isChecked)
    console.log(filteredData)




  const handleDateChange = (date) => {
    if(clickCount === 0 && date.getTime() < endDate.getTime()) {
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
    }
    
  };


  const handleDayClick = (date) => {

    DateComponent({ dateVal : date, type : "shortDay", setterFnc : setClickDay })
  
  };



  const handleCalculateNights = () => {
    const newstartDate = startDate.getDate();
    const newendDate = endDate.getDate();
    const nights = newendDate - newstartDate;
    return nights;
  }




  if(startDate.getTime() === endDate.getTime()){
  /*const eD = new date(startDate).setdate(startDate.getdate() + 1)
    setEndDate(eD);*/
    const newendDate = new Date(startDate.getTime());
    newendDate.setDate(startDate.getDate() + 1);
    setEndDate(newendDate);
    setClickCount(0);
}







  const filteredHotels = filterHotelsByRating();

  return (
    <div>
      <div className="input_data">
      <h1>Book Hotels & Homestays</h1>
      <div style={{display:"flex",justifyContent:"left",margin:"0 55px "}}>
        <label htmlFor="India">
          <input
            type="radio"
            id="India"
            value="India"
            //checked={selectedOption === 'option1'}
            //onChange={handleOptionChange}
          />
          India
        </label>
        <label htmlFor="International">
          <input
            type="radio"
            id="International"
            value="International"
          />
          International
        </label>
      </div>

        <br />
        <label htmlFor="location">Where</label>
        <br />
        <input
        type="text"
        id="location"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        />
        <br />
        <label htmlFor="date" onClick={() => setShowCal((prev) => !prev)}>Check-in</label>
        <br />
        <DateComponent dateVal = { startDate } />
        <br />
        {handleCalculateNights()}
        <br />
        <label htmlFor="date" onClick={() => setShowCal((prev) => !prev)}>Check-out</label>
        <br />
        <DateComponent dateVal = { endDate } />
        { showCal ?
        (
          <Calendar className="calendarOn" id="date" onChange={handleDateChange} onClickDay={handleDayClick}/>
        )
        : null }
        <SelectGuestRoom passedVals={ allVals }/>
        <label htmlFor="travelPref">Traveller Preference</label>
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
      
      <button onClick={() => {
          setSearchOn((prev) => [prev[0] = true, !prev[1]])
      }}>Search</button>







      {/*Filter section*/}


      <div className='topFilter'>
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
      </div>

      <div className='mainDisplay'>

          <div className="filteredHotels">
            <div>
                  <h3>Price Range</h3>
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
                          onChange={() => handlePriceChange(index, range.valueMin, range.valueMax)}
                        />
                        <label htmlFor={range.label}>{range.label}</label>
                      </div>
                  ))}
            </div>

            <div>
            <h3>Ratings</h3>
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
                            onChange={() => applyCheckAndFilters(index, rating, 'rating')}
                          />
                          <label htmlFor={rating.label}>{rating.label}</label>
                        </div>
                    ))}
            </div>

            <div>
            <h3>Amenities</h3>
                    {amenities.map((amenity, index) => (
                        <div key={amenity.label}>
                          <input
                            type="checkbox"
                            id={amenity.label}
                            checked={isChecked.forAmenities[index]}
                            //onChange={() => handleAmenitiesChange(index, amenity.label)}
                            onChange={() => applyCheckAndFilters(index, amenity, 'amenity')}
                          />
                          <label htmlFor={amenity.label}>{amenity.label}</label>
                        </div>
                    ))}
            </div>


        </div>






        {/*Filter Render*/}
        <div className='displayFilteredCards'>
          {filteredData.map((hotel) => (
            <div key={hotel._id}>
              <h2>{hotel.name}</h2>
              <p>Location: {hotel.location}</p>
              <p>Rating: {hotel.rating}</p>
              <p>
                Price: ${hotel.rooms[0].price} per night
                <br />
                Room Type: {hotel.rooms[0].roomType}
              </p>
              {hotel.images.map((image, index) => (
                <img key={index} src={image} alt={`Hotel ${index + 1}`} style={{ width: '150px', height: '100px' }} />
              ))}
            </div>
          ))}
        </div>

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