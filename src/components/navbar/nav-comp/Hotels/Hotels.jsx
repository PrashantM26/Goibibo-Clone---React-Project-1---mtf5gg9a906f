import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Calendar } from './../../../../components/Calendar/Calendar';
import Calendar from 'react-calendar';
import { SelectGuestRoom } from './../Hotels/SelectGuestRoom';
import { DateComponent } from '../../../Date/Date';

export function Hotels() {


  const [location, setLocation] = useState('');
  const [hotels, setHotels] = useState([]);
  const [sortedHotels, setSortedHotels] = useState([]);
  const [sortBy, setSortBy] = useState('priceLowToHigh');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCal, setShowCal] = useState(false);
  const [clickDay, setClickDay] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [isToggled, setIsToggled] = useState([false, false]);
  const [currentColor, setCurrentColor] = useState(['', '']);
  const [guestRoomInfo, setGuestRoomInfo] = useState('')



  const allVals = ( selectedValues ) => {
    setGuestRoomInfo(selectedValues)
  }
  
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

        if (response.data.message === 'success') {
          setHotels(response.data.data.hotels);
        } else {
          alert('Failed to fetch hotel datea');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching datea.');
      }
    }

    fetchHotels();
  }, [location]);

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
      <h1>Book Hotels & Homestays</h1>
      <div>
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
      
      <button onClick={() => setLocation(location)}>Search</button>
      <div>
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
      <div>
        {filteredHotels.map((hotel) => (
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
  );


}









{/*<datePicker
        id="dateL"
        selected={startDateD}
        onChange={(date) => setStartDateD(date)}
        //dateFormat="dd/MM/yyyy" // Customize the date format
/>*/}